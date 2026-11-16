import { Component, inject, input, OnDestroy, output } from '@angular/core';
import { I18n } from '../core/i18n';

/** Search field. Emits the text 300 ms after the user stops typing. */
@Component({
  selector: 'app-search-box',
  template: `
    <label class="search">
      <span aria-hidden="true">🔍</span>
      <input
        type="search"
        [placeholder]="placeholder() || t('search.placeholder')"
        (input)="onInput($any($event.target).value)"
      />
    </label>
  `,
})
export class SearchBox implements OnDestroy {
  protected readonly t = inject(I18n).t;
  readonly placeholder = input('');
  readonly search = output<string>();
  private timer?: ReturnType<typeof setTimeout>;

  onInput(value: string): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search.emit(value.trim()), 300);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
