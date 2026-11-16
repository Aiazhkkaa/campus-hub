import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { ACTIVITY_CATEGORIES } from '../core/labels';
import { Activity, ActivityCategory } from '../core/models';
import { ActivityCard } from '../shared/activity-card';
import { EmptyState } from '../shared/empty-state';
import { SearchBox } from '../shared/search-box';

@Component({
  selector: 'app-activities-list',
  imports: [RouterLink, ActivityCard, EmptyState, SearchBox],
  template: `
    <div class="page-header">
      <div>
        <h1>{{ t('acts.title') }}</h1>
        <p class="muted">{{ t('acts.sub') }}</p>
      </div>
      <a routerLink="/activities/new" class="btn btn-primary">{{ t('home.create') }}</a>
    </div>

    <app-search-box (search)="onSearch($event)" />

    <div class="chips" role="group" aria-label="Filter by category">
      <button class="chip" [class.active]="!category()" (click)="select(undefined)">{{ t('common.all') }}</button>
      @for (c of categories; track c.value) {
        <button class="chip" [class.active]="category() === c.value" (click)="select(c.value)">{{ t('cat.' + c.value) }}</button>
      }
    </div>

    @if (error()) {
      <p class="error">{{ error() }}</p>
    } @else if (activities(); as list) {
      @if (list.length) {
        <div class="grid grid-3">
          @for (a of list; track a.id) {
            <app-activity-card [activity]="a" />
          }
        </div>
      } @else {
        <app-empty-state [title]="t('acts.empty')" [text]="t('acts.emptyText')">
          <a routerLink="/activities/new" class="btn btn-secondary">{{ t('acts.create') }}</a>
        </app-empty-state>
      }
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class ActivitiesListPage {
  protected readonly t = inject(I18n).t;
  private readonly api = inject(ApiService);

  protected readonly categories = ACTIVITY_CATEGORIES;
  protected readonly category = signal<ActivityCategory | undefined>(undefined);
  protected readonly activities = signal<Activity[] | null>(null);
  protected readonly query = signal('');
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  select(category: ActivityCategory | undefined): void {
    this.category.set(category);
    this.load();
  }

  onSearch(q: string): void {
    this.query.set(q);
    this.load();
  }

  private load(): void {
    this.activities.set(null);
    this.api.activities(this.category(), this.query()).subscribe({
      next: (list) => this.activities.set(list),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
