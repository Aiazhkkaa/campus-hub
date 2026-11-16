import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { API_URL } from './api';
import { AuthResponse, User } from './models';

const TOKEN_KEY = 'campushub_token';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  faculty?: string;
  year?: number;
}

/** Keeps track of who is logged in. Components read `auth.user()`. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap((res) => this.startSession(res)));
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, data)
      .pipe(tap((res) => this.startSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.user.set(null);
    this.router.navigateByUrl('/');
  }

  /** Runs once when the app starts: turns a saved token back into a logged-in user. */
  async restoreSession(): Promise<void> {
    if (!this.token) return;
    try {
      this.user.set(await firstValueFrom(this.http.get<User>(`${API_URL}/auth/me`)));
    } catch {
      localStorage.removeItem(TOKEN_KEY); // token expired or server unreachable
    }
  }

  private startSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.user.set(res.user);
  }
}
