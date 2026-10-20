import { CardProgress, SessionState, UserProgress, UserSettings, BOX_INTERVALS } from '../types';
import { cards } from '../data/cards';

// Injectable clock for testing
let clockFn: () => Date = () => new Date();

export function setClock(fn: () => Date) {
  clockFn = fn;
}

export function getClock(): Date {
  return clockFn();
}

export function getLocalDateString(date: Date = getClock()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diff = d2.getTime() - d1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

export function getIntervalForBox(box: number, examDate: string | null): number {
  let interval = BOX_INTERVALS[box] || 1;
  if (examDate) {
    const today = getLocalDateString();
    const daysUntilExam = daysBetween(today, examDate);
    const maxInterval = Math.max(1, daysUntilExam - 1);
    interval = Math.min(interval, maxInterval);
  }
  return Math.max(1, interval);
}

export function isCardDue(progress: CardProgress, today: string = getLocalDateString()): boolean {
  return progress.dueDate <= today;
}

export function isTroubleCard(progress: CardProgress): boolean {
  return progress.lapses >= 3 && (progress.box === 1 || progress.box === 2);
}

export function isMastered(progress: CardProgress): boolean {
  if (progress.box !== 5) return false;
  const lastTwo = progress.lastTwoAnswers;
  if (lastTwo.length < 2) return false;
  return lastTwo[lastTwo.length - 1] === 'got' && lastTwo[lastTwo.length - 2] === 'got';
}

export function processAnswer(
  cardId: string,
  answer: 'got' | 'almost' | 'missed',
  progress: Record<string, CardProgress>,
  examDate: string | null
): Record<string, CardProgress> {
  const today = getLocalDateString();
  const existing = progress[cardId] || createNewProgress(cardId);
  const updated = { ...existing };

  updated.timesReviewed += 1;
  updated.lastTwoAnswers = [...updated.lastTwoAnswers.slice(-1), answer];

  switch (answer) {
    case 'missed':
      updated.box = 1;
      updated.lapses += 1;
      updated.dueDate = today; // due today (will be requeued)
      break;
    case 'almost':
      // stays in current box, due tomorrow
      updated.dueDate = addDays(today, 1);
      break;
    case 'got':
      updated.box = Math.min(5, updated.box + 1) as 1 | 2 | 3 | 4 | 5;
      const interval = getIntervalForBox(updated.box, examDate);
      updated.dueDate = addDays(today, interval);
      break;
  }

  return { ...progress, [cardId]: updated };
}

export function createNewProgress(cardId: string): CardProgress {
  return {
    cardId,
    box: 1,
    dueDate: getLocalDateString(),
    lapses: 0,
    lastTwoAnswers: [],
    timesReviewed: 0,
  };
}

export function buildSessionQueue(
  progress: Record<string, CardProgress>,
  dailyNewGoal: number,
  today: string = getLocalDateString()
): string[] {
  const allCardIds = cards.map(c => c.id);
  const todayKey = today.replace(/-/g, '');
  const newCardsShownToday = Object.keys(progress).filter(id => {
    const p = progress[id];
    return p.timesReviewed === 0;
  }).length;

  // 1. Due cards (most overdue first)
  const dueCards = allCardIds
    .filter(id => progress[id] && isCardDue(progress[id], today) && progress[id].timesReviewed > 0)
    .sort((a, b) => {
      const daysA = daysBetween(progress[a].dueDate, today);
      const daysB = daysBetween(progress[b].dueDate, today);
      return daysB - daysA; // most overdue first
    });

  // 2. Trouble cards not already in due list
  const dueSet = new Set(dueCards);
  const troubleCards = allCardIds
    .filter(id => progress[id] && isTroubleCard(progress[id]) && !dueSet.has(id));

  // 3. New cards up to daily limit
  const seenIds = new Set([...dueCards, ...troubleCards]);
  const newCards = allCardIds
    .filter(id => !progress[id] && !seenIds.has(id))
    .slice(0, Math.max(0, dailyNewGoal - newCardsShownToday));

  return [...dueCards, ...troubleCards, ...newCards];
}

export function buildSessionBySkillArea(
  progress: Record<string, CardProgress>,
  skillArea: string,
  today: string = getLocalDateString()
): string[] {
  const areaCards = cards.filter(c => c.skill_area === skillArea).map(c => c.id);
  const dueCards = areaCards
    .filter(id => progress[id] && isCardDue(progress[id], today))
    .sort((a, b) => {
      const daysA = daysBetween(progress[a].dueDate, today);
      const daysB = daysBetween(progress[b].dueDate, today);
      return daysB - daysA;
    });
  const dueSet = new Set(dueCards);
  const remaining = areaCards.filter(id => !dueSet.has(id));
  return [...dueCards, ...remaining];
}

export function buildTroubleQueue(
  progress: Record<string, CardProgress>
): string[] {
  return cards
    .filter(c => progress[c.id] && isTroubleCard(progress[c.id]))
    .map(c => c.id);
}

export function createSession(queue: string[]): SessionState {
  return {
    queue,
    currentIndex: 0,
    results: [],
    requeue: [],
    requeueAfter: 0,
    startedAt: new Date().toISOString(),
  };
}

export function getSessionSummary(session: SessionState) {
  const got = session.results.filter(r => r.answer === 'got').length;
  const almost = session.results.filter(r => r.answer === 'almost').length;
  const missed = session.results.filter(r => r.answer === 'missed').length;
  return {
    total: session.results.length,
    got,
    almost,
    missed,
  };
}

export function getSkillAreaMastery(progress: Record<string, CardProgress>): Record<string, number> {
  const mastery: Record<string, number> = {};
  const areas = [...new Set(cards.map(c => c.skill_area))];

  for (const area of areas) {
    const areaCards = cards.filter(c => c.skill_area === area);
    const total = areaCards.length;
    const mastered = areaCards.filter(c => {
      const p = progress[c.id];
      return p && (p.box === 4 || p.box === 5);
    }).length;
    mastery[area] = total > 0 ? Math.round((mastered / total) * 100) : 0;
  }

  return mastery;
}

export function getCardsPerBox(progress: Record<string, CardProgress>): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const id of Object.keys(progress)) {
    const box = progress[id].box;
    counts[box] = (counts[box] || 0) + 1;
  }
  return counts;
}

export function updateStreak(
  currentStreak: number,
  lastStudyDate: string | null,
  today: string = getLocalDateString()
): { streak: number; lastStudyDate: string } {
  if (!lastStudyDate) {
    return { streak: 1, lastStudyDate: today };
  }
  if (lastStudyDate === today) {
    return { streak: currentStreak, lastStudyDate: today };
  }
  const daysSince = daysBetween(lastStudyDate, today);
  if (daysSince === 1) {
    return { streak: currentStreak + 1, lastStudyDate: today };
  }
  // streak broken
  return { streak: 1, lastStudyDate: today };
}

export function getDaysUntilExam(examDate: string | null): number | null {
  if (!examDate) return null;
  const today = getLocalDateString();
  const days = daysBetween(today, examDate);
  return Math.max(0, days);
}

export function getCardById(id: string) {
  return cards.find(c => c.id === id);
}

export function getConfusedWithCards(cardId: string): typeof cards {
  const card = getCardById(cardId);
  if (!card || !card.confused_with) return [];
  return card.confused_with.map(id => getCardById(id)).filter(Boolean) as typeof cards;
}
