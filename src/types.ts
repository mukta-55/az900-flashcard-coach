export interface Flashcard {
  id: string;
  skill_area: string;
  skill_ref: string;
  type: 'definition' | 'compare' | 'scenario' | 'acronym';
  front: string;
  back: string;
  explanation: string;
  example?: string;
  confused_with?: string[];
  difficulty: 1 | 2 | 3;
  needs_verification: boolean;
}

export interface CardProgress {
  cardId: string;
  box: 1 | 2 | 3 | 4 | 5;
  dueDate: string; // ISO date string YYYY-MM-DD
  lapses: number;
  lastTwoAnswers: ('got' | 'almost' | 'missed')[];
  timesReviewed: number;
}

export interface UserProgress {
  cards: Record<string, CardProgress>;
  streak: number;
  lastStudyDate: string | null;
  dailyNewCount: Record<string, number>; // date -> count of new cards shown
  reviewHistory: { date: string; count: number }[];
  settings: UserSettings;
  onboardingComplete: boolean;
}

export interface UserSettings {
  dailyNewGoal: number;
  examDate: string | null;
  theme: 'light' | 'dark' | 'system';
}

export interface SessionState {
  queue: string[];
  currentIndex: number;
  results: { cardId: string; answer: 'got' | 'almost' | 'missed' }[];
  requeue: string[];
  requeueAfter: number;
  startedAt: string;
}

export const BOX_INTERVALS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
};

export const SKILL_AREAS = [
  'Cloud Concepts',
  'Cloud Benefits',
  'Cloud Service Types',
  'Azure Architecture',
  'Compute & Networking',
  'Storage Services',
  'Identity & Security',
  'Cost Management',
  'Governance & Compliance',
  'Resource Deployment',
  'Monitoring Tools',
] as const;

export type SkillArea = typeof SKILL_AREAS[number];
