import { UserProgress, UserSettings } from '../types';

const STORAGE_KEY = 'az900_flashcard_coach_progress';

const defaultSettings: UserSettings = {
  dailyNewGoal: 10,
  examDate: null,
  theme: 'system',
};

const defaultProgress: UserProgress = {
  cards: {},
  streak: 0,
  lastStudyDate: null,
  dailyNewCount: {},
  reviewHistory: [],
  settings: defaultSettings,
  onboardingComplete: false,
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
      cards: parsed.cards || {},
      reviewHistory: parsed.reviewHistory || [],
      dailyNewCount: parsed.dailyNewCount || {},
    };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    // Storage might be full or blocked
    return false;
  }
}

export function exportProgress(): string | null {
  try {
    const progress = loadProgress();
    return JSON.stringify(progress, null, 2);
  } catch {
    return null;
  }
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return false;
    return saveProgress({
      ...defaultProgress,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
    });
  } catch {
    return false;
  }
}

export function resetProgress(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
