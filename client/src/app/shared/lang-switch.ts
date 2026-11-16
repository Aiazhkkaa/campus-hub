import { Component, inject } from '@angular/core';
import { I18n, LANGS } from '../core/i18n';

/** EN / RU / KZ toggle */
@Component({
  selector: 'app-lang-switch',
  template: `
    <div class="lang-switch" role="group" aria-label="Language">
      @for (l of langs; track l.code) {
        <button type="button" [class.active]="i18n.lang() === l.code" (click)="i18n.lang.set(l.code)">{{ l.label }}</button>
      }
    </div>
  `,
})
export class LangSwitch {
  protected readonly i18n = inject(I18n);
  protected readonly langs = LANGS;
}
