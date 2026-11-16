import { ToastService } from '../core/toast.service';
import { I18n } from '../core/i18n';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { clubTheme } from '../core/labels';
import { ClubDetail } from '../core/models';
import { EmptyState } from '../shared/empty-state';
import { EventCard } from '../shared/event-card';

@Component({
  selector: 'app-club-detail',
  imports: [RouterLink, EventCard, EmptyState],
  template: `
    <a routerLink="/clubs" class="back">{{ t('back.clubs') }}</a>

    @if (club(); as c) {
      <div [class]="'banner art-' + theme(c.category).color"><span>{{ theme(c.category).emoji }}</span></div>
      <header class="club-header">
        <div class="club-header-text">
          <h1>{{ c.name }}</h1>
          <p class="muted">{{ t('clubcat.' + c.category) }} · {{ t('club.followers', { n: c.followerCount }) }}</p>
        </div>
        <div class="row">
          @if (c.canManage) {
            <a [routerLink]="['/clubs', c.id, 'events', 'new']" class="btn btn-secondary">{{ t('club.newEvent') }}</a>
          }
          @if (c.isFollowing) {
            <button class="btn btn-secondary" (click)="toggleFollow()" [disabled]="busy()">{{ t('club.following') }}</button>
          } @else {
            <button class="btn btn-primary" (click)="toggleFollow()" [disabled]="busy()">{{ t('club.follow') }}</button>
          }
        </div>
      </header>

      <p class="description narrow-text">{{ c.description }}</p>

      <section class="section">
        <h2 class="section-title">{{ t('club.upcoming') }}</h2>
        @if (c.events.length) {
          <div class="grid grid-3">
            @for (e of c.events; track e.id) {
              <app-event-card [event]="e" />
            }
          </div>
        } @else {
          <app-empty-state [title]="t('club.noEvents')" [text]="t('club.noEventsText')" />
        }
      </section>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class ClubDetailPage implements OnInit {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);

  readonly id = input.required<string>();

  protected readonly theme = clubTheme;
  protected readonly club = signal<ClubDetail | null>(null);
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.api.club(this.id()).subscribe({
      next: (c) => this.club.set(c),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  toggleFollow(): void {
    const c = this.club();
    if (!c) return;
    this.busy.set(true);
    const request = c.isFollowing ? this.api.unfollowClub(c.id) : this.api.followClub(c.id);
    request.subscribe({
      next: (updated) => {
        this.club.set(updated);
        this.busy.set(false);
        this.toast.success(this.t(updated.isFollowing ? 'toast.followed' : 'toast.unfollowed'));
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.busy.set(false);
      },
    });
  }
}
