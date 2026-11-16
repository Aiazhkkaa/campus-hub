import { ToastService } from '../core/toast.service';
import { AppDatePipe } from '../shared/app-date.pipe';
import { I18n } from '../core/i18n';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { activityTheme } from '../core/labels';
import { ActivityDetail } from '../core/models';
import { Avatar } from '../shared/avatar';

@Component({
  selector: 'app-activity-detail',
  imports: [RouterLink, AppDatePipe, Avatar],
  template: `
    <a routerLink="/activities" class="back">{{ t('back.activities') }}</a>

    @if (activity(); as a) {
      <div [class]="'banner art-' + theme(a.category).color"><span>{{ theme(a.category).emoji }}</span></div>
      <article class="detail">
        <div class="detail-main">
          <span class="tag">{{ t('cat.' + a.category) }}</span>
          <h1>{{ a.title }}</h1>
          @if (a.status === 'CANCELLED') {
            <p class="notice">{{ t('detail.cancelled') }}</p>
          }

          <dl class="facts">
            <div><dt>{{ t('detail.when') }}</dt><dd>{{ a.startsAt | appDate }}</dd></div>
            <div><dt>{{ t('detail.where') }}</dt><dd>{{ a.location }}</dd></div>
            <div><dt>{{ t('detail.host') }}</dt><dd>{{ a.creator.name }}</dd></div>
            <div><dt>{{ t('detail.spots') }}</dt><dd>{{ t('detail.spotsValue', { n: a.participantCount, m: a.maxParticipants }) }}</dd></div>
          </dl>

          <p class="description">{{ a.description }}</p>
        </div>

        <aside class="card detail-side">
          @if (a.status === 'OPEN') {
            @if (a.isCreator) {
              <p class="muted">{{ t('detail.hostingYou') }}</p>
              <button class="btn btn-danger btn-block" (click)="cancel()" [disabled]="busy()">{{ t('detail.cancelActivity') }}</button>
            } @else if (a.isJoined) {
              <p class="muted">{{ t('detail.going') }}</p>
              <button class="btn btn-secondary btn-block" (click)="leave()" [disabled]="busy()">{{ t('detail.leave') }}</button>
            } @else if (isFull()) {
              <button class="btn btn-primary btn-block" disabled>{{ t('detail.full') }}</button>
            } @else {
              <button class="btn btn-primary btn-block" (click)="join()" [disabled]="busy()">{{ t('detail.join') }}</button>
            }
          }
          @if (actionError()) {
            <p class="error">{{ actionError() }}</p>
          }

          <h2 class="section-title">{{ t('detail.whoGoing') }}</h2>
          <ul class="people">
            @for (p of a.participants; track p.id) {
              <li>
                <app-avatar [name]="p.name" [url]="p.avatarUrl" size="sm" />
                <span>
                  {{ p.name }}
                  @if (p.faculty) {
                    <small class="muted">{{ p.faculty }}</small>
                  }
                </span>
              </li>
            }
          </ul>
        </aside>
      </article>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class ActivityDetailPage implements OnInit {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);

  /** Comes from the URL /activities/:id */
  readonly id = input.required<string>();

  protected readonly theme = activityTheme;
  protected readonly activity = signal<ActivityDetail | null>(null);
  protected readonly error = signal('');
  protected readonly actionError = signal('');
  protected readonly busy = signal(false);
  protected readonly isFull = computed(() => {
    const a = this.activity();
    return !!a && a.participantCount >= a.maxParticipants;
  });

  ngOnInit(): void {
    this.api.activity(this.id()).subscribe({
      next: (a) => this.activity.set(a),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  join(): void {
    this.run(this.api.joinActivity(this.id()), 'toast.joined');
  }

  leave(): void {
    this.run(this.api.leaveActivity(this.id()), 'toast.left');
  }

  cancel(): void {
    if (confirm(this.t('detail.confirmCancel'))) this.run(this.api.cancelActivity(this.id()), 'toast.cancelled');
  }

  private run(request: Observable<ActivityDetail>, messageKey: string): void {
    this.busy.set(true);
    this.actionError.set('');
    request.subscribe({
      next: (a) => {
        this.activity.set(a);
        this.busy.set(false);
        this.toast.success(this.t(messageKey));
      },
      error: (err) => {
        this.actionError.set(errorMessage(err));
        this.busy.set(false);
      },
    });
  }
}
