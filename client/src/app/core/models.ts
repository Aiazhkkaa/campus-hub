// Shapes of the JSON our NestJS API returns. Dates arrive as ISO strings.

export type Role = 'STUDENT' | 'ADMIN';
export type ActivityCategory = 'FOOD' | 'STUDY' | 'SPORTS' | 'CULTURE' | 'GAMES' | 'OTHER';
export type ClubCategory = 'IT' | 'BUSINESS' | 'SPORTS' | 'VOLUNTEER' | 'CREATIVE' | 'DEBATE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  faculty: string | null;
  year: number | null;
  bio: string | null;
  role: Role;
}

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  faculty: string | null;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  startsAt: string;
  location: string;
  maxParticipants: number;
  status: 'OPEN' | 'CANCELLED';
  participantCount: number;
  isJoined: boolean;
  isCreator: boolean;
  creator: Person;
}

export interface ActivityDetail extends Activity {
  participants: Person[];
}

export interface ClubSummary {
  id: string;
  name: string;
  category: ClubCategory;
  logoUrl: string | null;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  imageUrl: string | null;
  capacity: number | null;
  registrationUrl: string | null;
  registrationCount: number;
  isRegistered: boolean;
  club: ClubSummary | null;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: ClubCategory;
  logoUrl: string | null;
  followerCount: number;
  isFollowing: boolean;
}

export interface ClubDetail extends Club {
  events: CampusEvent[];
  canManage: boolean;
}

export interface Profile {
  user: User;
  activities: Activity[];
  events: CampusEvent[];
  clubs: Club[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  endsAt: string | null;
  createdAt: string;
  isClosed: boolean;
  creator: Person;
  options: PollOption[];
  totalVotes: number;
  myOptionId: string | null;
}
