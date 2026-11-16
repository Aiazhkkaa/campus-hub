import { I18n } from '../core/i18n';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { clubTheme } from '../core/labels';
import { Club } from '../core/models';

@Component({
  selector: 'app-club-card',
  imports: [RouterLink],
  template: `
    <a class="card card-link card-media" [routerLink]="['/clubs', club().id]">
      <div [class]="'cover-art cover-short art-' + theme().color">
        <span class="cover-emoji">{{ theme().emoji }}</span>
        <span class="cover-tag">{{ t('clubcat.' + club().category) }}</span>
        @if (club().isFollowing) {
          <span class="cover-badge">{{ t('card.following') }}</span>
        }
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ club().name }}</h3>
        <p class="card-text">{{ club().description }}</p>
        <div class="card-foot">
          <span class="meta">{{ t('card.followers', { n: club().followerCount }) }}</span>
        </div>
      </div>
    </a>
  `,
})
export class ClubCard {
  protected readonly t = inject(I18n).t;
  readonly club = input.required<Club>();
  protected readonly theme = computed(() => clubTheme(this.club().category));
}
