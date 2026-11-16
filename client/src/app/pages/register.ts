import { ToastService } from '../core/toast.service';
import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/errors';
import { LangSwitch } from '../shared/lang-switch';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, LangSwitch],
  template: `
    <div class="auth-page">
      <app-lang-switch />
      <a routerLink="/" class="logo"><span class="logo-mark">🎓</span>Campus<span>Hub</span></a>
      <form class="card auth-card form" [formGroup]="form" (ngSubmit)="submit()">
        <h1 class="h2">{{ t('auth.join') }}</h1>

        <label class="field">
          <span>{{ t('auth.name') }}</span>
          <input class="input" formControlName="name" autocomplete="name" />
        </label>
        <label class="field">
          <span>{{ t('auth.uniEmail') }}</span>
          <input class="input" type="email" formControlName="email" autocomplete="email" />
        </label>
        <label class="field">
          <span>{{ t('auth.password') }}</span>
          <input class="input" type="password" formControlName="password" autocomplete="new-password" />
          <small class="muted">{{ t('auth.min8') }}</small>
        </label>
        <div class="field-row">
          <label class="field">
            <span>{{ t('auth.faculty') }} <em class="muted">{{ t('common.optional') }}</em></span>
            <input class="input" formControlName="faculty" />
          </label>
          <label class="field field-narrow">
            <span>{{ t('auth.year') }}</span>
            <select class="input" formControlName="year">
              <option [ngValue]="null">—</option>
              @for (y of years; track y) {
                <option [ngValue]="y">{{ y }}</option>
              }
            </select>
          </label>
        </div>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
          {{ loading() ? t('auth.creating') : t('auth.signup') }}
        </button>
        <p class="muted center">{{ t('auth.haveAccount') }} <a routerLink="/login">{{ t('auth.login') }}</a></p>
      </form>
    </div>
  `,
})
export class RegisterPage {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly years = [1, 2, 3, 4, 5, 6];
  protected readonly form = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    faculty: [''],
    year: [null as number | null],
  });
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.error.set(this.t('auth.err.register'));
      return;
    }
    const v = this.form.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.auth
      .register({
        name: v.name ?? '',
        email: v.email ?? '',
        password: v.password ?? '',
        faculty: v.faculty || undefined,
        year: v.year ?? undefined,
      })
      .subscribe({
        next: () => {
          this.toast.success(this.t('toast.welcome'));
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.error.set(errorMessage(err));
          this.loading.set(false);
        },
      });
  }
}
