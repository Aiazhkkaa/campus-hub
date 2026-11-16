import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { I18n } from '../core/i18n';
import { Poll } from '../core/models';
import { ToastService } from '../core/toast.service';
import { AppDatePipe } from './app-date.pipe';
import { Avatar } from './avatar';

@Component({
  selector: 'app-poll-card',
  imports: [Avatar, AppDatePipe],
  template: `
    <article class="card poll">
      <div class="poll-head">
        <app-avatar [name]="poll().creator.name" [url]="poll().creator.avatarUrl" size="sm" />
        <span class="meta">{{ poll().creator.name }}</span>
        @if (poll().isClosed) {
          <span class="badge badge-muted">{{ t('polls.closed') }}</span>
        } @else if (poll().endsAt) {
          <span class="badge">{{ t('polls.until', { date: (poll().endsAt! | appDate: 'd MMM') }) }}</span>
        }
      </div>
      <h3 class="card-title">{{ poll().question }}</h3>

      <div class="poll-options">
        @for (o of poll().options; track o.id) {
          <button
            type="button"
            class="poll-option"
            [class.chosen]="poll().myOptionId === o.id"
            [class.show-results]="showResults()"
            [disabled]="busy() || poll().isClosed"
            (click)="vote(o.id)"
          >
            @if (showResults()) {
              <span class="poll-fill" [style.width.%]="percent(o.votes)"></span>
            }
            <span class="poll-text">{{ o.text }} @if (poll().myOptionId === o.id) { ✓ }</span>
            @if (showResults()) {
              <span class="poll-percent">{{ percent(o.votes) }}%</span>
            }
          </button>
        }
      </div>

      <div class="card-foot">
        <span class="meta">🗳 {{ t('polls.votes', { n: poll().totalVotes }) }}</span>
        @if (poll().myOptionId && !poll().isClosed) {
          <button type="button" class="btn btn-ghost btn-sm" (click)="unvote()" [disabled]="busy()">{{ t('polls.unvote') }}</button>
        }
      </div>
    </article>
  `,
})
export class PollCard {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  protected readonly t = inject(I18n).t;

  readonly poll = input.required<Poll>();
  readonly changed = output<Poll>();
  protected readonly busy = signal(false);

  /** Results are visible after you vote, or when the poll is closed */
  protected readonly showResults = computed(() => !!this.poll().myOptionId || this.poll().isClosed);

  percent(votes: number): number {
    const total = this.poll().totalVotes;
    return total ? Math.round((votes / total) * 100) : 0;
  }

  vote(optionId: string): void {
    if (this.poll().myOptionId === optionId) return;
    this.send(this.api.votePoll(this.poll().id, optionId), this.t('toast.voted'));
  }

  unvote(): void {
    this.send(this.api.unvotePoll(this.poll().id), this.t('toast.unvoted'));
  }

  private send(request: ReturnType<ApiService['votePoll']>, message: string): void {
    this.busy.set(true);
    request.subscribe({
      next: (p) => {
        this.changed.emit(p);
        this.toast.success(message);
        this.busy.set(false);
      },
      error: (err) => {
        this.toast.error(errorMessage(err));
        this.busy.set(false);
      },
    });
  }
}
