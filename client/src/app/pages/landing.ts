import { I18n } from '../core/i18n';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CampusScene } from '../shared/campus-scene';
import { LangSwitch } from '../shared/lang-switch';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, LangSwitch, CampusScene],
  template: `
    <div class="landing">
      <div class="container">
        <header class="landing-top">
          <span class="logo"><span class="logo-mark">🎓</span>Campus<span>Hub</span></span>
          <div class="row">
            <app-lang-switch />
            <a routerLink="/login" class="btn btn-ghost">{{ t('landing.login') }}</a>
          </div>
        </header>

        <section class="hero">
          <div class="hero-text">
            <span class="pill">{{ t('landing.pill') }}</span>
            <h1>{{ t('landing.title1') }}<br /><span class="gradient-text">{{ t('landing.title2') }}</span></h1>
            <p class="lead">{{ t('landing.lead') }}</p>
            <div class="row">
              <a routerLink="/register" class="btn btn-primary btn-lg">{{ t('landing.start') }}</a>
              <a routerLink="/login" class="btn btn-secondary btn-lg">{{ t('landing.haveAccount') }}</a>
            </div>
          </div>

          <div class="hero-art">
            <app-campus-scene />
          </div>
        </section>

        <section class="grid grid-3 features">
          <div class="card feature art-peach">
            <span class="feature-emoji">🤝</span>
            <h3 class="card-title">{{ t('landing.f1.title') }}</h3>
            <p class="card-text">{{ t('landing.f1.text') }}</p>
          </div>
          <div class="card feature art-sky">
            <span class="feature-emoji">🎉</span>
            <h3 class="card-title">{{ t('landing.f2.title') }}</h3>
            <p class="card-text">{{ t('landing.f2.text') }}</p>
          </div>
          <div class="card feature art-mint">
            <span class="feature-emoji">💜</span>
            <h3 class="card-title">{{ t('landing.f3.title') }}</h3>
            <p class="card-text">{{ t('landing.f3.text') }}</p>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class LandingPage {
  protected readonly t = inject(I18n).t;}
