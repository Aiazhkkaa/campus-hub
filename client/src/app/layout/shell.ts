import { I18n } from '../core/i18n';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Avatar } from '../shared/avatar';
import { LangSwitch } from '../shared/lang-switch';

/** The frame around every logged-in page: top bar on desktop, tab bar on mobile. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar, LangSwitch],
  template: `
    <header class="topbar">
      <div class="container topbar-inner">
        <a routerLink="/home" class="logo"><span class="logo-mark">🎓</span>Campus<span>Hub</span></a>

        <nav class="nav" aria-label="Main">
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" routerLinkActive="active">{{ t(link.label) }}</a>
          }
        </nav>

        <app-lang-switch />

        @if (auth.user(); as user) {
          <a routerLink="/profile" class="profile-link" routerLinkActive="active" aria-label="My profile">
            <app-avatar [name]="user.name" [url]="user.avatarUrl" size="sm" />
          </a>
        }
      </div>
    </header>

    <main class="container page">
      <router-outlet />
    </main>

    <nav class="tabbar" aria-label="Main">
      @for (link of links; track link.path) {
        <a [routerLink]="link.path" routerLinkActive="active">{{ t(link.label) }}</a>
      }
      <a routerLink="/profile" routerLinkActive="active">{{ t('nav.profile') }}</a>
    </nav>
  `,
})
export class Shell {
  protected readonly t = inject(I18n).t;
  protected readonly auth = inject(AuthService);
  protected readonly links = [
    { path: '/home', label: 'nav.home' },
    { path: '/activities', label: 'nav.activities' },
    { path: '/events', label: 'nav.events' },
    { path: '/clubs', label: 'nav.clubs' },
    { path: '/polls', label: 'nav.polls' },
  ];
}
