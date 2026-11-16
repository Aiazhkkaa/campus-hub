import { AppDatePipe } from './app-date.pipe';
import { I18n } from '../core/i18n';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { activityTheme } from '../core/labels';
import { Activity } from '../core/models';

@Component({
  selector: 'app-activity-card',
  imports: [RouterLink, AppDatePipe],
  template: `
    <a class="card card-link card-media" [routerLink]="['/activities', activity().id]">
      <div [class]="'cover-art art-' + theme().color">
        <span class="cover-emoji">{{ theme().emoji }}</span>
        <span class="cover-tag">{{ t('cat.' + activity().category) }}</span>
        @if (activity().isCreator) {
          <span class="cover-badge">{{ t('card.hosting') }}</span>
        } @else if (activity().isJoined) {
          <span class="cover-badge">{{ t('card.joined') }}</span>
        } @else if (isFull()) {
          <span class="cover-badge muted-badge">{{ t('card.full') }}</span>
        }
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ activity().title }}</h3>
        <p class="meta">🗓️ {{ activity().startsAt | appDate }}</p>
        <p class="meta">📍 {{ activity().location }}</p>
        <div class="card-foot">
          <span class="spots">
            <span class="spots-bar"><span [style.width.%]="fill()"></span></span>
            {{ t('card.going', { n: activity().participantCount, m: activity().maxParticipants }) }}
          </span>
        </div>
      </div>
    </a>
  `,
})
export class ActivityCard {
  protected readonly t = inject(I18n).t;
  readonly activity = input.required<Activity>();
  protected readonly theme = computed(() => activityTheme(this.activity().category));
  protected readonly isFull = computed(
    () => this.activity().participantCount >= this.activity().maxParticipants,
  );
  protected readonly fill = computed(() =>
    Math.min(100, (this.activity().participantCount / this.activity().maxParticipants) * 100),
  );
}
