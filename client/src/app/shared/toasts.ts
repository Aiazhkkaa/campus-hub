import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <button type="button" class="toast" [class.toast-error]="t.kind === 'error'" (click)="toast.dismiss(t.id)">
          {{ t.text }}
        </button>
      }
    </div>
  `,
})
export class Toasts {
  protected readonly toast = inject(ToastService);
}
