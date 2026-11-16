import { ActivityCategory, ClubCategory } from './models';

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string }[] = [
  { value: 'FOOD', label: 'Food' },
  { value: 'STUDY', label: 'Study' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'CULTURE', label: 'Culture' },
  { value: 'GAMES', label: 'Games' },
  { value: 'OTHER', label: 'Other' },
];

export const CLUB_CATEGORIES: { value: ClubCategory; label: string }[] = [
  { value: 'IT', label: 'IT' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'VOLUNTEER', label: 'Volunteering' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'DEBATE', label: 'Debate' },
  { value: 'OTHER', label: 'Other' },
];

export function activityCategoryLabel(value: ActivityCategory): string {
  return ACTIVITY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function clubCategoryLabel(value: ClubCategory): string {
  return CLUB_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** Date format used everywhere, e.g. "Tue, Nov 18 · 13:00" */
export const DATE_FORMAT = 'EEE, MMM d · HH:mm';

// ── Cute visual themes: an emoji + a pastel colour for every category ──

export type Pastel = 'peach' | 'sky' | 'mint' | 'pink' | 'lemon' | 'lavender';

export interface Theme {
  emoji: string;
  color: Pastel;
}

const ACTIVITY_THEMES: Record<ActivityCategory, Theme> = {
  FOOD: { emoji: '🍜', color: 'peach' },
  STUDY: { emoji: '📚', color: 'sky' },
  SPORTS: { emoji: '⚽', color: 'mint' },
  CULTURE: { emoji: '🎬', color: 'pink' },
  GAMES: { emoji: '🎲', color: 'lemon' },
  OTHER: { emoji: '✨', color: 'lavender' },
};

const CLUB_THEMES: Record<ClubCategory, Theme> = {
  IT: { emoji: '💻', color: 'sky' },
  BUSINESS: { emoji: '🚀', color: 'peach' },
  SPORTS: { emoji: '🏃', color: 'mint' },
  VOLUNTEER: { emoji: '🌱', color: 'lemon' },
  CREATIVE: { emoji: '🎨', color: 'pink' },
  DEBATE: { emoji: '🎤', color: 'lavender' },
  OTHER: { emoji: '🌟', color: 'lavender' },
};

export function activityTheme(category: ActivityCategory): Theme {
  return ACTIVITY_THEMES[category];
}

export function clubTheme(category: ClubCategory): Theme {
  return CLUB_THEMES[category];
}

/** Events take the look of their club; university-wide events get confetti. */
export function eventTheme(clubCategory: ClubCategory | undefined): Theme {
  return clubCategory ? CLUB_THEMES[clubCategory] : { emoji: '🎉', color: 'pink' };
}

const PASTELS: Pastel[] = ['peach', 'sky', 'mint', 'pink', 'lemon', 'lavender'];

/** Same name -> always the same soft colour (used for avatars). */
export function pastelFor(text: string): Pastel {
  let sum = 0;
  for (const ch of text) sum += ch.charCodeAt(0);
  return PASTELS[sum % PASTELS.length]!;
}
