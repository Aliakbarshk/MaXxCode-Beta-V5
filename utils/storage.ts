import { UserState, Lesson, Badge } from '../types';
import { LESSONS, BADGES } from '../constants';

const STORAGE_KEY = 'maxxcode_user_v3'; 

const INITIAL_STATE: UserState = {
  completedLessons: [],
  completedProblems: [],
  currentStreak: 0,
  lastLoginDate: null,
  xp: 0,
  badges: [],
  adminUnlocked: false,
  apiKey: null,
  lastActiveLanguage: 'python',
  settings: {
    appLanguage: 'en',
    theme: 'light',
  }
};

export const getUserState = (): UserState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_STATE;
  
  try {
      const parsed = JSON.parse(stored);
      // Robust merge: Ensure nested objects (like settings) are merged, not overwritten
      return {
          ...INITIAL_STATE,
          ...parsed,
          settings: {
              ...INITIAL_STATE.settings,
              ...(parsed.settings || {})
          }
      };
  } catch (e) {
      console.error("Failed to load user state", e);
      return INITIAL_STATE;
  }
};

export const saveUserState = (state: UserState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const updateStreak = (state: UserState): UserState => {
  const today = new Date().toDateString();
  const lastLogin = state.lastLoginDate ? new Date(state.lastLoginDate).toDateString() : null;

  if (lastLogin === today) {
    return state; // Already logged in today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = state.currentStreak;

  if (lastLogin === yesterday.toDateString()) {
    newStreak += 1;
  } else {
    newStreak = 1; // Reset or start new
  }

  return {
    ...state,
    currentStreak: newStreak,
    lastLoginDate: new Date().toISOString(),
  };
};

// Now a pure function that returns IDs of NEW badges to add.
// It does NOT modify storage directly anymore, preventing race conditions.
export const checkBadges = (state: UserState): string[] => {
  const newBadgeIds: string[] = [];
  const currentBadgeIds = new Set(state.badges);

  // Check First Steps
  if (state.completedLessons.length >= 1 && !currentBadgeIds.has('first_steps')) {
    newBadgeIds.push('first_steps');
  }

  // Check Streak
  if (state.currentStreak >= 3 && !currentBadgeIds.has('streak_3')) {
    newBadgeIds.push('streak_3');
  }

  // Check Week Warrior
  if (state.currentStreak >= 7 && !currentBadgeIds.has('streak_7')) {
    newBadgeIds.push('streak_7');
  }

  // Check Master Coder
  if (state.completedLessons.length >= 10 && !currentBadgeIds.has('master_coder')) {
    newBadgeIds.push('master_coder');
  }

  return newBadgeIds;
};