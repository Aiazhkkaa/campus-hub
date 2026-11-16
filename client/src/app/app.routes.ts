import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  // Public pages (only for logged-out users)
  { path: '', pathMatch: 'full', canActivate: [guestGuard], loadComponent: () => import('./pages/landing').then((m) => m.LandingPage) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login').then((m) => m.LoginPage) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/register').then((m) => m.RegisterPage) },

  // App pages (need login) — all share the header/navigation from Shell
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home').then((m) => m.HomePage) },
      { path: 'activities', loadComponent: () => import('./pages/activities-list').then((m) => m.ActivitiesListPage) },
      { path: 'activities/new', loadComponent: () => import('./pages/activity-form').then((m) => m.ActivityFormPage) },
      { path: 'activities/:id', loadComponent: () => import('./pages/activity-detail').then((m) => m.ActivityDetailPage) },
      { path: 'events', loadComponent: () => import('./pages/events-list').then((m) => m.EventsListPage) },
      { path: 'events/:id', loadComponent: () => import('./pages/event-detail').then((m) => m.EventDetailPage) },
      { path: 'clubs', loadComponent: () => import('./pages/clubs-list').then((m) => m.ClubsListPage) },
      { path: 'clubs/:id', loadComponent: () => import('./pages/club-detail').then((m) => m.ClubDetailPage) },
      { path: 'clubs/:id/events/new', loadComponent: () => import('./pages/event-form').then((m) => m.EventFormPage) },
      { path: 'polls', loadComponent: () => import('./pages/polls').then((m) => m.PollsPage) },
      { path: 'profile', loadComponent: () => import('./pages/profile').then((m) => m.ProfilePage) },
    ],
  },

  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFoundPage) },
];
