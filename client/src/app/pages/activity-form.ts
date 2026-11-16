import { ToastService } from '../core/toast.service';
import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { ACTIVITY_CATEGORIES } from '../core/labels';
import { ActivityCategory } from '../core/models';

@Component({
  selector: 'app-activity-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/activities" class="back">{{ t('back.activities') }}</a>
    <div class="narrow">
      <h1>{{ t('form.createTitle') }}</h1>
      <p class="muted">{{ t('form.createSub') }}</p>

      <form class="card form" [formGroup]="form" (ngSubmit)="submit()">
        <label class="field">
          <span>{{ t('form.title') }}</span>
          <input class="input" formControlName="title" [placeholder]="t('form.titlePh')" />
        </label>

        <div class="field">
          <span>{{ t('form.category') }}</span>
          <div class="chips">
            @for (c of categories; track c.value) {
              <button type="button" class="chip" [class.active]="form.controls.category.value === c.value" (click)="form.controls.category.setValue(c.value)">
                {{ t('cat.' + c.value) }}
              </button>
            }
          </div>
        </div>

        <div class="field-row">
          <label class="field">
            <span>{{ t('form.datetime') }}</span>
            <input class="input" type="datetime-local" formControlName="startsAt" />
          </label>
          <label class="field field-narrow">
            <span>{{ t('form.max') }}</span>
            <input class="input" type="number" min="2" max="100" formControlName="maxParticipants" />
          </label>
        </div>

        <label class="field">
          <span>{{ t('form.location') }}</span>
          <input class="input" formControlName="location" [placeholder]="t('form.locationPh')" />
        </label>

        <label class="field">
          <span>{{ t('form.description') }}</span>
          <textarea class="input" rows="4" formControlName="description" [placeholder]="t('form.descriptionPh')"></textarea>
        </label>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <div class="row row-end">
          <a routerLink="/activities" class="btn btn-ghost">{{ t('common.cancel') }}</a>
          <button class="btn btn-primary" type="submit" [disabled]="loading()">
            {{ loading() ? t('form.creating') : t('acts.create') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ActivityFormPage {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  protected readonly categories = ACTIVITY_CATEGORIES;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['FOOD' as ActivityCategory, Validators.required],
    startsAt: ['', Validators.required],
    maxParticipants: [4, [Validators.required, Validators.min(2), Validators.max(100)]],
    location: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
  });
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.error.set(this.t('form.err.fill'));
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
      .createActivity({ ...v, maxParticipants: Number(v.maxParticipants), startsAt: startsAt.toISOString() })
      .subscribe({
        next: (a) => {
          this.toast.success(this.t('toast.activityCreated'));
          this.router.navigate(['/activities', a.id]);
        },
        error: (err) => {
          this.error.set(errorMessage(err));
          this.loading.set(false);
        },
      });
  }
}
