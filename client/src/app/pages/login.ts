import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/errors';
import { LangSwitch } from '../shared/lang-switch';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LangSwitch],
  template: `
    <div class="auth-page">
      <app-lang-switch />
      <a routerLink="/" class="logo"><span class="logo-mark">🎓</span>Campus<span>Hub</span></a>
      <form class="card auth-card form" [formGroup]="form" (ngSubmit)="submit()">
        <h1 class="h2">{{ t('auth.welcome') }}</h1>

        <label class="field">
          <span>{{ t('auth.email') }}</span>
          <input class="input" type="email" formControlName="email" autocomplete="email" />
        </label>
        <label class="field">
          <span>{{ t('auth.password') }}</span>
          <input class="input" type="password" formControlName="password" autocomplete="current-password" />
        </label>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
          {{ loading() ? t('auth.loggingIn') : t('auth.login') }}
        </button>

        <p class="muted center">{{ t('auth.noAccount') }} <a routerLink="/register">{{ t('auth.signup') }}</a></p>
        <p class="hint center">{{ t('auth.demo') }}: student&#64;campushub.kz / password123</p>
      </form>
    </div>
  `,
})
export class LoginPage {
  protected readonly t = inject(I18n).t;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.error.set(this.t('auth.err.login'));
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
