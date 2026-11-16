import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  text: string;
  kind: 'success' | 'error';
}

/** Small pop-up messages in the corner, e.g. "You joined! 🎉". They disappear after 3 seconds. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(text: string, kind: Toast['kind']): void {
    const toast = { id: this.nextId++, text, kind };
    this.toasts.update((list) => [...list, toast].slice(-3));
    setTimeout(() => this.dismiss(toast.id), 3000);
  }
}
