import { ToastService } from '../core/toast.service';
import { AppDatePipe } from '../shared/app-date.pipe';
import { I18n } from '../core/i18n';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { eventTheme } from '../core/labels';
import { CampusEvent } from '../core/models';

@Component({
  selector: 'app-event-detail',
  imports: [RouterLink, AppDatePipe],
  template: `
    <a routerLink="/events" class="back">{{ t('back.events') }}</a>

    @if (event(); as e) {
      @if (e.imageUrl) {
        <img class="cover" [src]="e.imageUrl" [alt]="e.title" />
      } @else {
        <div [class]="'banner art-' + theme(e.club?.category).color"><span>{{ theme(e.club?.category).emoji }}</span></div>
      }
      <article class="detail">
        <div class="detail-main">
          @if (e.club; as club) {
            <a class="tag" [routerLink]="['/clubs', club.id]">{{ club.name }}</a>
          } @else {
            <span class="tag">{{ t('event.uni') }}</span>
          }
          <h1>{{ e.title }}</h1>

          <dl class="facts">
            <div><dt>{{ t('detail.when') }}</dt><dd>{{ e.startsAt | appDate }}</dd></div>
            <div><dt>{{ t('detail.where') }}</dt><dd>{{ e.location }}</dd></div>
            <div>
              <dt>{{ t('event.going') }}</dt>
              <dd>{{ e.capacity !== null ? t('event.countOf', { n: e.registrationCount, m: e.capacity }) : t('event.count', { n: e.registrationCount }) }}</dd>
            </div>
          </dl>

          <p class="description">{{ e.description }}</p>
        </div>

        <aside class="card detail-side">
          @if (e.isRegistered) {
            <p class="muted">{{ t('event.youRegistered') }}</p>
            <button class="btn btn-secondary btn-block" (click)="unregister()" [disabled]="busy()">{{ t('event.cancelReg') }}</button>
          } @else if (isFull()) {
            <button class="btn btn-primary btn-block" disabled>{{ t('event.full') }}</button>
          } @else {
            <button class="btn btn-primary btn-block" (click)="register()" [disabled]="busy()">{{ t('event.register') }}</button>
          }
          @if (e.registrationUrl) {
            <a class="btn btn-ghost btn-block" [href]="e.registrationUrl" target="_blank" rel="noopener">{{ t('event.form') }}</a>
          }
          @if (actionError()) {
            <p class="error">{{ actionError() }}</p>
          }
        </aside>
      </article>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class EventDetailPage implements OnInit {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);

  readonly id = input.required<string>();

  protected readonly theme = eventTheme;
  protected readonly event = signal<CampusEvent | null>(null);
  protected readonly error = signal('');
  protected readonly actionError = signal('');
  protected readonly busy = signal(false);
  protected readonly isFull = computed(() => {
    const e = this.event();
    return !!e && e.capacity !== null && e.registrationCount >= e.capacity;
  });

  ngOnInit(): void {
    this.api.event(this.id()).subscribe({
      next: (e) => this.event.set(e),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  register(): void {
    this.run(this.api.registerForEvent(this.id()), 'toast.registered');
  }

  unregister(): void {
    this.run(this.api.unregisterFromEvent(this.id()), 'toast.unregistered');
  }

  private run(request: Observable<CampusEvent>, messageKey: string): void {
    this.busy.set(true);
    this.actionError.set('');
    request.subscribe({
      next: (e) => {
        this.event.set(e);
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
