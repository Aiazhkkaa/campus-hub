import { ToastService } from '../core/toast.service';
import { I18n } from '../core/i18n';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/errors';
import { Profile } from '../core/models';
import { ActivityCard } from '../shared/activity-card';
import { Avatar } from '../shared/avatar';
import { ClubCard } from '../shared/club-card';
import { EmptyState } from '../shared/empty-state';
import { EventCard } from '../shared/event-card';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, Avatar, ActivityCard, EventCard, ClubCard, EmptyState],
  template: `
    @if (profile(); as p) {
      <header class="club-header profile-header">
        <app-avatar [name]="p.user.name" [url]="p.user.avatarUrl" size="lg" />
        <div class="club-header-text">
          <h1>{{ p.user.name }}</h1>
          <p class="muted">
            {{ p.user.faculty || t('profile.student') }}{{ p.user.year ? ' · ' + t('profile.yearN', { n: p.user.year }) : '' }}
          </p>
          @if (p.user.bio && !editing()) {
            <p>{{ p.user.bio }}</p>
          }
        </div>
        <div class="row">
          @if (!editing()) {
            <button class="btn btn-secondary" (click)="startEdit()">{{ t('profile.edit') }}</button>
          }
          <button class="btn btn-ghost" (click)="auth.logout()">{{ t('profile.logout') }}</button>
        </div>
      </header>

      @if (editing()) {
        <form class="card form narrow" [formGroup]="form" (ngSubmit)="save()">
          <label class="field">
            <span>{{ t('profile.name') }}</span>
            <input class="input" formControlName="name" />
          </label>
          <div class="field-row">
            <label class="field">
              <span>{{ t('auth.faculty') }}</span>
              <input class="input" formControlName="faculty" />
            </label>
            <label class="field field-narrow">
              <span>{{ t('auth.year') }}</span>
              <select class="input" formControlName="year">
                <option [ngValue]="null">—</option>
                @for (y of years; track y) {
                  <option [ngValue]="y">{{ y }}</option>
                }
              </select>
            </label>
          </div>
          <label class="field">
            <span>{{ t('profile.about') }}</span>
            <textarea class="input" rows="3" formControlName="bio" [placeholder]="t('profile.aboutPh')"></textarea>
          </label>
          @if (formError()) {
            <p class="error">{{ formError() }}</p>
          }
          <div class="row row-end">
            <button type="button" class="btn btn-ghost" (click)="editing.set(false)">{{ t('common.cancel') }}</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving()">{{ t('common.save') }}</button>
          </div>
        </form>
      }

      <section class="section">
        <h2 class="section-title">{{ t('profile.myActivities') }}</h2>
        @if (p.activities.length) {
          <div class="grid grid-3">
            @for (a of p.activities; track a.id) {
              <app-activity-card [activity]="a" />
            }
          </div>
        } @else {
          <app-empty-state [title]="t('profile.noActivities')">
            <a routerLink="/activities" class="btn btn-secondary">{{ t('profile.findOne') }}</a>
          </app-empty-state>
        }
      </section>

      <section class="section">
        <h2 class="section-title">{{ t('profile.myEvents') }}</h2>
        @if (p.events.length) {
          <div class="grid grid-3">
            @for (e of p.events; track e.id) {
              <app-event-card [event]="e" />
            }
          </div>
        } @else {
          <app-empty-state [title]="t('profile.noEvents')">
            <a routerLink="/events" class="btn btn-secondary">{{ t('profile.browseEvents') }}</a>
          </app-empty-state>
        }
      </section>

      <section class="section">
        <h2 class="section-title">{{ t('profile.myClubs') }}</h2>
        @if (p.clubs.length) {
          <div class="grid grid-3">
            @for (c of p.clubs; track c.id) {
              <app-club-card [club]="c" />
            }
          </div>
        } @else {
          <app-empty-state [title]="t('profile.noClubs')">
            <a routerLink="/clubs" class="btn btn-secondary">{{ t('profile.exploreClubs') }}</a>
          </app-empty-state>
        }
      </section>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
    } @else {
      <p class="muted">{{ t('common.loading') }}</p>
    }
  `,
})
export class ProfilePage {
  protected readonly t = inject(I18n).t;
  private readonly toast = inject(ToastService);
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);

  protected readonly years = [1, 2, 3, 4, 5, 6];
  protected readonly profile = signal<Profile | null>(null);
  protected readonly error = signal('');
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly form = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    faculty: [''],
    year: [null as number | null],
    bio: [''],
  });

  constructor() {
    this.api.profile().subscribe({
      next: (p) => this.profile.set(p),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  startEdit(): void {
    const user = this.profile()?.user;
    if (!user) return;
    this.form.setValue({ name: user.name, faculty: user.faculty ?? '', year: user.year, bio: user.bio ?? '' });
    this.formError.set('');
    this.editing.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.formError.set(this.t('profile.err.name'));
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.api
      .updateProfile({ name: v.name ?? '', faculty: v.faculty ?? '', year: v.year ?? undefined, bio: v.bio ?? '' })
      .subscribe({
        next: (user) => {
          this.profile.update((p) => (p ? { ...p, user } : p));
          this.auth.user.set(user);
          this.editing.set(false);
          this.saving.set(false);
          this.toast.success(this.t('toast.profileSaved'));
        },
        error: (err) => {
          this.formError.set(errorMessage(err));
          this.saving.set(false);
        },
      });
  }
}
