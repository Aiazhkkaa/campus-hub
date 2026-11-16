import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { CampusEvent } from '../core/models';
import { EmptyState } from '../shared/empty-state';
import { EventCard } from '../shared/event-card';
import { SearchBox } from '../shared/search-box';

@Component({
  selector: 'app-events-list',
  imports: [EventCard, EmptyState, SearchBox],
  template: `
    <div class="page-header">
      <div>
        <h1>{{ t('events.title') }}</h1>
        <p class="muted">{{ t('events.sub') }}</p>
      </div>
    </div>

    <app-search-box (search)="load($event)" />

    @if (error()) {
      <p class="error">{{ error() }}</p>
    } @else if (events(); as list) {
      @if (list.length) {
        <div class="grid grid-3">
          @for (e of list; track e.id) {
            <app-event-card [event]="e" />
          }
        </div>
      } @else {
        <app-empty-state [title]="t('events.empty')" [text]="t('events.emptyText')" />
      }
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class EventsListPage {
  protected readonly t = inject(I18n).t;
  protected readonly events = signal<CampusEvent[] | null>(null);
  protected readonly error = signal('');

  private readonly api = inject(ApiService);

  constructor() {
    this.load('');
  }

  load(q: string): void {
    this.events.set(null);
    this.api.events(q).subscribe({
      next: (list) => this.events.set(list),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
