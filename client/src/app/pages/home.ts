import { AppDatePipe } from '../shared/app-date.pipe';
import { I18n } from '../core/i18n';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/errors';
import { Activity, CampusEvent, Profile } from '../core/models';
import { ActivityCard } from '../shared/activity-card';
import { EmptyState } from '../shared/empty-state';
import { EventCard } from '../shared/event-card';

interface Plan {
  id: string;
  kind: 'Activity' | 'Event';
  title: string;
  startsAt: string;
  link: string[];
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-home',
  imports: [RouterLink, AppDatePipe, ActivityCard, EventCard, EmptyState],
  template: `
    <div class="page-header">
      <div>
        <h1>{{ t('home.hi', { name: firstName() }) }}</h1>
        <p class="muted">{{ t('home.sub') }}</p>
      </div>
      <a routerLink="/activities/new" class="btn btn-primary">{{ t('home.create') }}</a>
    </div>

    @if (error()) {
      <p class="error">{{ error() }}</p>
    }

    <section class="section">
      <h2 class="section-title">{{ t('home.plans') }}</h2>
      @if (profile(); as p) {
        @if (plans().length) {
          <ul class="list card">
            @for (plan of plans(); track plan.kind + plan.id) {
              <li>
                <a class="list-item" [routerLink]="plan.link">
                  <span class="list-date">{{ plan.startsAt | appDate }}</span>
                  <span class="list-title">{{ plan.title }}</span>
                  <span class="tag" [class.tag-event]="plan.kind === 'Event'">{{ t('home.kind.' + plan.kind) }}</span>
                </a>
              </li>
            }
          </ul>
        } @else {
          <app-empty-state [title]="t('home.noPlans')" [text]="t('home.noPlansText')">
            <a routerLink="/activities" class="btn btn-secondary">{{ t('home.browse') }}</a>
          </app-empty-state>
        }
      } @else if (!error()) {
        <p class="muted">{{ t('common.loading') }}</p>
      }
    </section>

    @if (weekEvents().length) {
      <section class="section">
        <div class="section-head">
          <h2 class="section-title">{{ t('home.week') }}</h2>
          <a routerLink="/events" class="link">{{ t('common.seeAll') }}</a>
        </div>
        <div class="grid grid-3">
          @for (e of weekEvents(); track e.id) {
            <app-event-card [event]="e" />
          }
        </div>
      </section>
    }

    @if (openActivities().length) {
      <section class="section">
        <div class="section-head">
          <h2 class="section-title">{{ t('home.company') }}</h2>
          <a routerLink="/activities" class="link">{{ t('common.seeAll') }}</a>
        </div>
        <div class="grid grid-3">
          @for (a of openActivities(); track a.id) {
            <app-activity-card [activity]="a" />
          }
        </div>
      </section>
    }
  `,
})
export class HomePage {
  protected readonly t = inject(I18n).t;
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly events = signal<CampusEvent[]>([]);
  protected readonly activities = signal<Activity[]>([]);
  protected readonly error = signal('');

  protected readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] ?? '');

  /** My activities + my events, merged and sorted by date (max 5). */
  protected readonly plans = computed<Plan[]>(() => {
    const p = this.profile();
    if (!p) return [];
    const items: Plan[] = [
      ...p.activities.map((a) => ({ id: a.id, kind: 'Activity' as const, title: a.title, startsAt: a.startsAt, link: ['/activities', a.id] })),
      ...p.events.map((e) => ({ id: e.id, kind: 'Event' as const, title: e.title, startsAt: e.startsAt, link: ['/events', e.id] })),
    ];
    return items.sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 5);
  });

  protected readonly weekEvents = computed(() => {
    const limit = Date.now() + WEEK_MS;
    return this.events().filter((e) => new Date(e.startsAt).getTime() < limit).slice(0, 3);
  });

  protected readonly openActivities = computed(() =>
    this.activities()
      .filter((a) => !a.isJoined && a.participantCount < a.maxParticipants)
      .slice(0, 3),
  );

  constructor() {
    forkJoin({ profile: this.api.profile(), events: this.api.events(), activities: this.api.activities() }).subscribe({
      next: ({ profile, events, activities }) => {
        this.profile.set(profile);
        this.events.set(events);
        this.activities.set(activities);
      },
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
