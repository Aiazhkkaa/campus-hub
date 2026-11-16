import { AppDatePipe } from './app-date.pipe';
import { I18n } from '../core/i18n';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { eventTheme } from '../core/labels';
import { CampusEvent } from '../core/models';

@Component({
  selector: 'app-event-card',
  imports: [RouterLink, AppDatePipe],
  template: `
    <a class="card card-link card-media" [routerLink]="['/events', event().id]">
      <div [class]="'cover-art art-' + theme().color">
        @if (event().imageUrl) {
          <img class="cover-img" [src]="event().imageUrl" [alt]="event().title" />
        } @else {
          <span class="cover-emoji">{{ theme().emoji }}</span>
        }
        <span class="date-chip">
          <strong>{{ event().startsAt | appDate: 'd' }}</strong>
          <span>{{ event().startsAt | appDate: 'MMM' }}</span>
        </span>
        @if (event().isRegistered) {
          <span class="cover-badge">{{ t('card.goingBadge') }}</span>
        } @else if (isFull()) {
          <span class="cover-badge muted-badge">{{ t('card.full') }}</span>
        }
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ event().title }}</h3>
        <p class="meta">🗓️ {{ event().startsAt | appDate }}</p>
        <p class="meta">📍 {{ event().location }}</p>
        <div class="card-foot">
          <span class="meta">{{ event().club?.name ?? t('card.uniEvent') }}</span>
        </div>
      </div>
    </a>
  `,
})
export class EventCard {
  protected readonly t = inject(I18n).t;
  readonly event = input.required<CampusEvent>();
  protected readonly theme = computed(() => eventTheme(this.event().club?.category));
  protected readonly isFull = computed(() => {
    const e = this.event();
    return e.capacity !== null && e.registrationCount >= e.capacity;
  });
}
