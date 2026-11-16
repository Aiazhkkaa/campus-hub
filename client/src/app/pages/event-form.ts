import { ToastService } from '../core/toast.service';
import { I18n } from '../core/i18n';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';

/** For club representatives: publish a new event for their club. */
@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a [routerLink]="['/clubs', id()]" class="back">{{ t('back.club') }}</a>
    <div class="narrow">
      <h1>{{ t('eform.title') }}</h1>
      <p class="muted">{{ t('eform.sub') }}</p>

      <form class="card form" [formGroup]="form" (ngSubmit)="submit()">
        <label class="field">
          <span>{{ t('form.title') }}</span>
          <input class="input" formControlName="title" />
        </label>
        <div class="field-row">
          <label class="field">
            <span>{{ t('form.datetime') }}</span>
            <input class="input" type="datetime-local" formControlName="startsAt" />
          </label>
          <label class="field field-narrow">
            <span>{{ t('eform.capacity') }} <em class="muted">{{ t('common.optional') }}</em></span>
            <input class="input" type="number" min="1" formControlName="capacity" />
          </label>
        </div>
        <label class="field">
          <span>{{ t('form.location') }}</span>
          <input class="input" formControlName="location" />
        </label>
        <label class="field">
          <span>{{ t('form.description') }}</span>
          <textarea class="input" rows="5" formControlName="description"></textarea>
        </label>
        <label class="field">
          <span>{{ t('eform.image') }} <em class="muted">{{ t('common.optional') }}</em></span>
          <input class="input" type="url" formControlName="imageUrl" placeholder="https://..." />
        </label>
        <label class="field">
          <span>{{ t('eform.regLink') }} <em class="muted">{{ t('common.optional') }}</em></span>
          <input class="input" type="url" formControlName="registrationUrl" placeholder="https://forms.google.com/..." />
        </label>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        <div class="row row-end">
          <a [routerLink]="['/clubs', id()]" class="btn btn-ghost">{{ t('common.cancel') }}</a>
          <button class="btn btn-primary" type="submit" [disabled]="loading()">
            {{ loading() ? t('eform.publishing') : t('eform.publish') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EventFormPage {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  /** Club id from the URL /clubs/:id/events/new */
  readonly id = input.required<string>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    startsAt: ['', Validators.required],
    capacity: [null as number | null],
    location: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: [''],
    registrationUrl: [''],
  });
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.error.set(this.t('eform.err.fill'));
      return;
    }
    const v = this.form.getRawValue();
    const startsAt = new Date(v.startsAt);
    if (startsAt.getTime() < Date.now()) {
      this.error.set(this.t('form.err.future'));
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.api
      .createEvent({
        title: v.title,
        description: v.description,
        location: v.location,
        startsAt: startsAt.toISOString(),
        clubId: this.id(),
        capacity: v.capacity ? Number(v.capacity) : undefined,
        imageUrl: v.imageUrl || undefined,
        registrationUrl: v.registrationUrl || undefined,
      })
      .subscribe({
        next: (e) => {
          this.toast.success(this.t('toast.eventCreated'));
          this.router.navigate(['/events', e.id]);
        },
        error: (err) => {
          this.error.set(errorMessage(err));
          this.loading.set(false);
        },
      });
  }
}
