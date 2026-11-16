import { Component, input } from '@angular/core';

/** Friendly message when a list is empty. Put a button inside it if needed. */
@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <span class="empty-emoji">🌸</span>
      <p class="empty-title">{{ title() }}</p>
      @if (text()) {
        <p class="muted">{{ text() }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly text = input<string>('');
}
