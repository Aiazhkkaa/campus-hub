import { computed, effect, Injectable, signal } from '@angular/core';
import { DICTIONARY } from './i18n.dictionary';

export type Lang = 'en' | 'ru' | 'kk';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'KZ' },
];

export const LANG_KEY = 'campushub_lang';

function initialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === 'ru' || saved === 'kk' || saved === 'en' ? saved : 'en';
}

/**
 * Translations. In a template: {{ t('nav.home') }}.
 * `lang` is a signal, so every text on screen updates as soon as the user picks a language.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>(initialLang());

  /** Locale id for dates (registered in app.config.ts) */
  readonly locale = computed(() => ({ en: 'en-US', ru: 'ru', kk: 'kk' })[this.lang()]);

  constructor() {
    effect(() => {
      localStorage.setItem(LANG_KEY, this.lang());
      document.documentElement.lang = this.lang();
    });
  }

  readonly t = (key: string, params?: Record<string, string | number>): string => {
    let text = DICTIONARY[this.lang()][key] ?? DICTIONARY.en[key] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };
}
