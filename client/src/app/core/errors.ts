import { HttpErrorResponse } from '@angular/common/http';
import { LANG_KEY } from './i18n';

const TEXTS = {
  en: { network: 'Cannot reach the server. Is the backend running?', generic: 'Something went wrong. Please try again.' },
  ru: { network: 'Не удаётся связаться с сервером. Бэкенд запущен?', generic: 'Что-то пошло не так. Попробуйте ещё раз.' },
  kk: { network: 'Серверге қосылу мүмкін емес. Бэкенд іске қосылған ба?', generic: 'Бірдеңе дұрыс болмады. Қайталап көріңіз.' },
};

/** Turns any API error into one short sentence we can show to the user. */
export function errorMessage(error: unknown): string {
  const saved = localStorage.getItem(LANG_KEY);
  const texts = saved === 'ru' || saved === 'kk' ? TEXTS[saved] : TEXTS.en;

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return texts.network;
    const message = (error.error as { message?: string | string[] } | null)?.message;
    if (Array.isArray(message)) return message[0] ?? texts.generic;
    if (typeof message === 'string') return message;
  }
  return texts.generic;
}
