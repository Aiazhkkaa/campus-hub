import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api';
import {
  Activity,
  ActivityCategory,
  ActivityDetail,
  CampusEvent,
  Club,
  ClubCategory,
  ClubDetail,
  Poll,
  Profile,
  User,
} from './models';

export interface NewActivity {
  title: string;
  description: string;
  category: ActivityCategory;
  startsAt: string;
  location: string;
  maxParticipants: number;
}

export interface NewEvent {
  title: string;
  description: string;
  startsAt: string;
  location: string;
  clubId: string;
  capacity?: number;
  imageUrl?: string;
  registrationUrl?: string;
}

export interface ProfileChanges {
  name?: string;
  faculty?: string;
  year?: number;
  bio?: string;
}

/** All calls to the backend in one place. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  // ── Activities ──
  activities(category?: ActivityCategory, q?: string): Observable<Activity[]> {
    const params: Record<string, string> = { ...(category ? { category } : {}), ...(q ? { q } : {}) };
    return this.http.get<Activity[]>(`${API_URL}/activities`, { params });
  }
  activity(id: string): Observable<ActivityDetail> {
    return this.http.get<ActivityDetail>(`${API_URL}/activities/${id}`);
  }
  createActivity(data: NewActivity): Observable<ActivityDetail> {
    return this.http.post<ActivityDetail>(`${API_URL}/activities`, data);
  }
  joinActivity(id: string): Observable<ActivityDetail> {
    return this.http.post<ActivityDetail>(`${API_URL}/activities/${id}/join`, {});
  }
  leaveActivity(id: string): Observable<ActivityDetail> {
    return this.http.delete<ActivityDetail>(`${API_URL}/activities/${id}/join`);
  }
  cancelActivity(id: string): Observable<ActivityDetail> {
    return this.http.post<ActivityDetail>(`${API_URL}/activities/${id}/cancel`, {});
  }

  // ── Events ──
  events(q?: string): Observable<CampusEvent[]> {
    const params: Record<string, string> = q ? { q } : {};
    return this.http.get<CampusEvent[]>(`${API_URL}/events`, { params });
  }
  event(id: string): Observable<CampusEvent> {
    return this.http.get<CampusEvent>(`${API_URL}/events/${id}`);
  }
  createEvent(data: NewEvent): Observable<CampusEvent> {
    return this.http.post<CampusEvent>(`${API_URL}/events`, data);
  }
  registerForEvent(id: string): Observable<CampusEvent> {
    return this.http.post<CampusEvent>(`${API_URL}/events/${id}/register`, {});
  }
  unregisterFromEvent(id: string): Observable<CampusEvent> {
    return this.http.delete<CampusEvent>(`${API_URL}/events/${id}/register`);
  }

  // ── Clubs ──
  clubs(category?: ClubCategory, q?: string): Observable<Club[]> {
    const params: Record<string, string> = { ...(category ? { category } : {}), ...(q ? { q } : {}) };
    return this.http.get<Club[]>(`${API_URL}/clubs`, { params });
  }
  club(id: string): Observable<ClubDetail> {
    return this.http.get<ClubDetail>(`${API_URL}/clubs/${id}`);
  }
  followClub(id: string): Observable<ClubDetail> {
    return this.http.post<ClubDetail>(`${API_URL}/clubs/${id}/follow`, {});
  }
  unfollowClub(id: string): Observable<ClubDetail> {
    return this.http.delete<ClubDetail>(`${API_URL}/clubs/${id}/follow`);
  }

  // ── Polls ──
  polls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${API_URL}/polls`);
  }
  createPoll(data: { question: string; options: string[]; endsAt?: string }): Observable<Poll> {
    return this.http.post<Poll>(`${API_URL}/polls`, data);
  }
  votePoll(id: string, optionId: string): Observable<Poll> {
    return this.http.post<Poll>(`${API_URL}/polls/${id}/vote`, { optionId });
  }
  unvotePoll(id: string): Observable<Poll> {
    return this.http.delete<Poll>(`${API_URL}/polls/${id}/vote`);
  }

  // ── Me ──
  profile(): Observable<Profile> {
    return this.http.get<Profile>(`${API_URL}/users/me`);
  }
  updateProfile(changes: ProfileChanges): Observable<User> {
    return this.http.patch<User>(`${API_URL}/users/me`, changes);
  }
}
