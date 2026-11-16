import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { I18n } from '../core/i18n';
import { Poll } from '../core/models';
import { ToastService } from '../core/toast.service';
import { EmptyState } from '../shared/empty-state';
import { PollCard } from '../shared/poll-card';

@Component({
  selector: 'app-polls',
  imports: [ReactiveFormsModule, PollCard, EmptyState],
  template: `
    <div class="page-header">
      <div>
        <h1>{{ t('polls.title') }}</h1>
        <p class="muted">{{ t('polls.sub') }}</p>
      </div>
      @if (!creating()) {
        <button class="btn btn-primary" (click)="creating.set(true)">{{ t('polls.create') }}</button>
      }
    </div>

    @if (creating()) {
      <form class="card form narrow poll-form" [formGroup]="form" (ngSubmit)="submit()">
        <label class="field">
          <span>{{ t('polls.question') }}</span>
          <input class="input" formControlName="question" [placeholder]="t('polls.questionPh')" />
        </label>

        <div class="field">
          <span>{{ t('polls.options') }}</span>
          @for (control of options.controls; track $index; let i = $index) {
            <div class="row option-row">
              <input class="input" [formControl]="control" [placeholder]="t('polls.optionN', { n: i + 1 })" />
              @if (options.length > 2) {
                <button type="button" class="btn btn-ghost" (click)="options.removeAt(i)" aria-label="Remove">✕</button>
              }
            </div>
          }
          @if (options.length < 6) {
            <button type="button" class="btn btn-ghost add-option" (click)="addOption()">{{ t('polls.addOption') }}</button>
          }
        </div>

        <label class="field">
          <span>{{ t('polls.endsAt') }} <em class="muted">{{ t('common.optional') }}</em></span>
          <input class="input" type="date" formControlName="endsAt" />
        </label>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        <div class="row row-end">
          <button type="button" class="btn btn-ghost" (click)="cancel()">{{ t('common.cancel') }}</button>
          <button type="submit" class="btn btn-primary" [disabled]="saving()">{{ t('polls.publish') }}</button>
        </div>
      </form>
    }

    @if (loadError()) {
      <p class="error">{{ loadError() }}</p>
    } @else if (polls(); as list) {
      @if (list.length) {
        <div class="grid grid-2">
          @for (p of list; track p.id) {
            <app-poll-card [poll]="p" (changed)="replace($event)" />
          }
        </div>
      } @else {
        <app-empty-state [title]="t('polls.empty')" [text]="t('polls.emptyText')" />
      }
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class PollsPage {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  protected readonly t = inject(I18n).t;

  protected readonly polls = signal<Poll[] | null>(null);
  protected readonly loadError = signal('');
  protected readonly creating = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.minLength(5)]],
    options: this.fb.array([this.optionControl(), this.optionControl()]),
    endsAt: [''],
  });

  get options(): FormArray<FormControl<string>> {
    return this.form.controls.options;
  }

  constructor() {
    this.api.polls().subscribe({
      next: (list) => this.polls.set(list),
      error: (err) => this.loadError.set(errorMessage(err)),
    });
  }

  addOption(): void {
    this.options.push(this.optionControl());
  }

  /** A poll card changed (someone voted) — swap the updated poll into the list */
  replace(updated: Poll): void {
    this.polls.update((list) => list?.map((p) => (p.id === updated.id ? updated : p)) ?? null);
  }

  cancel(): void {
    this.creating.set(false);
    this.error.set('');
  }

  submit(): void {
    if (this.form.invalid) {
      this.error.set(this.t('polls.err.fill'));
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');
    this.api
      .createPoll({
        question: v.question,
        options: v.options,
        // end of the chosen day
        endsAt: v.endsAt ? new Date(v.endsAt + 'T23:59:00').toISOString() : undefined,
      })
      .subscribe({
        next: (poll) => {
          this.polls.update((list) => [poll, ...(list ?? [])]);
          this.toast.success(this.t('toast.pollCreated'));
          this.form.reset();
          while (this.options.length > 2) this.options.removeAt(this.options.length - 1);
          this.creating.set(false);
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set(errorMessage(err));
          this.saving.set(false);
        },
      });
  }

  private optionControl(): FormControl<string> {
    return this.fb.nonNullable.control('', Validators.required);
  }
}
