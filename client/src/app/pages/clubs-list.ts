import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { CLUB_CATEGORIES } from '../core/labels';
import { Club, ClubCategory } from '../core/models';
import { ClubCard } from '../shared/club-card';
import { EmptyState } from '../shared/empty-state';
import { SearchBox } from '../shared/search-box';

@Component({
  selector: 'app-clubs-list',
  imports: [ClubCard, EmptyState, SearchBox],
  template: `
    <div class="page-header">
      <div>
        <h1>{{ t('clubs.title') }}</h1>
        <p class="muted">{{ t('clubs.sub') }}</p>
      </div>
    </div>

    <app-search-box (search)="onSearch($event)" />

    <div class="chips" role="group" aria-label="Filter by category">
      <button class="chip" [class.active]="!category()" (click)="select(undefined)">{{ t('common.all') }}</button>
      @for (c of categories; track c.value) {
        <button class="chip" [class.active]="category() === c.value" (click)="select(c.value)">{{ t('clubcat.' + c.value) }}</button>
      }
    </div>

    @if (error()) {
      <p class="error">{{ error() }}</p>
    } @else if (clubs(); as list) {
      @if (list.length) {
        <div class="grid grid-3">
          @for (c of list; track c.id) {
            <app-club-card [club]="c" />
          }
        </div>
      } @else {
        <app-empty-state [title]="t('clubs.empty')" />
      }
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class ClubsListPage {
  protected readonly t = inject(I18n).t;
  private readonly api = inject(ApiService);

  protected readonly categories = CLUB_CATEGORIES;
  protected readonly category = signal<ClubCategory | undefined>(undefined);
  protected readonly clubs = signal<Club[] | null>(null);
  protected readonly query = signal('');
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  select(category: ClubCategory | undefined): void {
    this.category.set(category);
    this.load();
  }

  onSearch(q: string): void {
    this.query.set(q);
    this.load();
  }

  private load(): void {
    this.clubs.set(null);
    this.api.clubs(this.category(), this.query()).subscribe({
      next: (list) => this.clubs.set(list),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
