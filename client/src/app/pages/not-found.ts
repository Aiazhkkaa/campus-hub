import { I18n } from '../core/i18n';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="auth-page">
      <h1>{{ t('notfound.title') }}</h1>
      <p class="muted">{{ t('notfound.text') }}</p>
      <a routerLink="/" class="btn btn-primary">{{ t('notfound.home') }}</a>
    </div>
  `,
})
export class NotFoundPage {
  protected readonly t = inject(I18n).t;
}
