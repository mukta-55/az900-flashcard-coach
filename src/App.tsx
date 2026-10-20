import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProgress, SessionState, Flashcard } from './types';
import { loadProgress, saveProgress, exportProgress, importProgress, resetProgress } from './engine/storage';
import {
  buildSessionQueue, buildSessionBySkillArea, buildTroubleQueue,
  createSession, processAnswer, getSessionSummary, updateStreak,
  getSkillAreaMastery, getCardsPerBox, getDaysUntilExam,
  getCardById, getConfusedWithCards, getLocalDateString, isTroubleCard
} from './engine/leitner';
import { cards } from './data/cards';
import { SKILL_AREAS } from './types';

type Screen = 'onboarding' | 'home' | 'study' | 'study-area' | 'study-trouble' | 'browse' | 'progress' | 'settings';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [screen, setScreen] = useState<Screen>(progress.onboardingComplete ? 'home' : 'onboarding');
  const [session, setSession] = useState<SessionState | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [studyArea, setStudyArea] = useState<string>('');
  const [storageError, setStorageError] = useState(false);

  // Persist progress
  useEffect(() => {
    const ok = saveProgress(progress);
    if (!ok) setStorageError(true);
  }, [progress]);

  // Refs for keyboard handler (defined here, assigned after handleAnswer)
  const handleAnswerRef = useRef<((a: 'got' | 'almost' | 'missed') => void) | null>(null);
  const flippedRef = useRef(flipped);
  flippedRef.current = flipped;

  const handleAnswer = useCallback((answer: 'got' | 'almost' | 'missed') => {
    if (!session) return;
    const cardId = session.queue[session.currentIndex];
    if (!cardId) return;

    const newProgress = processAnswer(cardId, answer, progress.cards, progress.settings.examDate);
    const today = getLocalDateString();
    const { streak, lastStudyDate } = updateStreak(progress.streak, progress.lastStudyDate, today);

    // Handle requeue for missed cards
    let newQueue = [...session.queue];
    let newRequeue = [...session.requeue];
    if (answer === 'missed') {
      // Re-appear after at least 5 other cards
      const remaining = newQueue.length - session.currentIndex - 1;
      if (remaining >= 5) {
        const insertAt = session.currentIndex + 6;
        newQueue.splice(insertAt, 0, cardId);
      } else {
        newRequeue.push(cardId);
      }
    }

    const newSession: SessionState = {
      ...session,
      currentIndex: session.currentIndex + 1,
      results: [...session.results, { cardId, answer }],
      queue: newQueue,
      requeue: newRequeue,
    };

    // Update review history
    const history = [...progress.reviewHistory];
    const todayEntry = history.find(h => h.date === today);
    if (todayEntry) {
      todayEntry.count += 1;
    } else {
      history.push({ date: today, count: 1 });
    }
    // Keep last 14 days
    const recentHistory = history.filter(h => {
      const d = new Date(h.date + 'T00:00:00');
      const now = new Date();
      return (now.getTime() - d.getTime()) <= 14 * 24 * 60 * 60 * 1000;
    });

    setProgress({
      ...progress,
      cards: newProgress,
      streak,
      lastStudyDate,
      reviewHistory: recentHistory,
    });
    setSession(newSession);
    setFlipped(false);
  }, [session, progress]);

  // Assign ref after handleAnswer is defined
  handleAnswerRef.current = handleAnswer;

  // Keyboard shortcuts during study
  useEffect(() => {
    if (screen !== 'study' && screen !== 'study-area' && screen !== 'study-trouble') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped(f => !f);
      }
      if (flippedRef.current && handleAnswerRef.current) {
        if (e.key === '1') handleAnswerRef.current('missed');
        if (e.key === '2') handleAnswerRef.current('almost');
        if (e.key === '3') handleAnswerRef.current('got');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen]);

  const startSession = (type: 'all' | 'area' | 'trouble', area?: string) => {
    let queue: string[];
    const today = getLocalDateString();
    if (type === 'area' && area) {
      queue = buildSessionBySkillArea(progress.cards, area, today);
      setStudyArea(area);
      setScreen('study-area');
    } else if (type === 'trouble') {
      queue = buildTroubleQueue(progress.cards);
      setScreen('study-trouble');
    } else {
      queue = buildSessionQueue(progress.cards, progress.settings.dailyNewGoal, today);
      setScreen('study');
    }
    // Append requeue items
    setSession(createSession(queue));
    setFlipped(false);
  };

  const endSession = () => {
    setSession(null);
    setFlipped(false);
    setScreen('home');
  };

  const completeOnboarding = (settings: { examDate: string | null; dailyNewGoal: number }) => {
    setProgress({
      ...progress,
      onboardingComplete: true,
      settings: { ...progress.settings, ...settings },
    });
    setScreen('home');
  };

  // Current card
  const currentCard: Flashcard | null = session ? getCardById(session.queue[session.currentIndex]) || null : null;
  const isSessionComplete = session ? session.currentIndex >= session.queue.length : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {storageError && (
        <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 p-2 text-center text-sm">
          Storage unavailable. Progress will not be saved.
        </div>
      )}

      {screen === 'onboarding' && <OnboardingScreen onComplete={completeOnboarding} />}
      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          onStart={() => startSession('all')}
          onStartArea={(area) => startSession('area', area)}
          onStartTrouble={() => startSession('trouble')}
          onNavigate={setScreen}
        />
      )}
      {(screen === 'study' || screen === 'study-area' || screen === 'study-trouble') && session && (
        isSessionComplete ? (
          <SessionSummaryScreen session={session} onDone={endSession} />
        ) : currentCard ? (
          <StudyScreen
            card={currentCard}
            flipped={flipped}
            onFlip={() => setFlipped(true)}
            onAnswer={handleAnswer}
            progress={session}
            onUndo={() => {
              // Simple undo: go back one card (does not reverse box changes for simplicity)
              if (session.currentIndex > 0) {
                setSession({ ...session, currentIndex: session.currentIndex - 1 });
                setFlipped(false);
              }
            }}
            onEnd={endSession}
            sessionTitle={screen === 'study-area' ? studyArea : screen === 'study-trouble' ? 'Trouble Cards' : "Today's Session"}
          />
        ) : null
      )}
      {screen === 'browse' && <BrowseScreen onBack={() => setScreen('home')} />}
      {screen === 'progress' && <ProgressScreen progress={progress} onBack={() => setScreen('home')} />}
      {screen === 'settings' && (
        <SettingsScreen
          progress={progress}
          onUpdate={(newSettings) => setProgress({ ...progress, settings: { ...progress.settings, ...newSettings } })}
          onBack={() => setScreen('home')}
        />
      )}

      <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-4 px-4 border-t border-gray-200 dark:border-gray-700">
        Unofficial study tool. Not affiliated with or endorsed by Microsoft.
      </footer>
    </div>
  );
}

// ==================== ONBOARDING ====================
function OnboardingScreen({ onComplete }: { onComplete: (s: { examDate: string | null; dailyNewGoal: number }) => void }) {
  const [step, setStep] = useState(0);
  const [examDate, setExamDate] = useState('');
  const [dailyGoal, setDailyGoal] = useState(10);

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
      {step === 0 && (
        <div className="space-y-6 text-center">
          <div className="text-5xl">📚</div>
          <h1 className="text-2xl font-bold">AZ-900 Flashcard Coach</h1>
          <p className="text-gray-600 dark:text-gray-400">
            An unofficial study tool to help you prepare for the Azure Fundamentals exam using spaced repetition.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            This is an unofficial study aid. It is not affiliated with, endorsed by, or connected to Microsoft Corporation.
          </p>
          <button
            onClick={() => setStep(1)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
          >
            Get Started
          </button>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center">Exam Date (optional)</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
            Set your exam date to cap review intervals and see a countdown.
          </p>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[44px]"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium min-h-[44px]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center">Daily New Cards</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
            How many new cards per day? You can change this later.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setDailyGoal(Math.max(5, dailyGoal - 1))}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold min-h-[44px] min-w-[44px]"
            >
              −
            </button>
            <span className="text-3xl font-bold w-16 text-center">{dailyGoal}</span>
            <button
              onClick={() => setDailyGoal(Math.min(30, dailyGoal + 1))}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold min-h-[44px] min-w-[44px]"
            >
              +
            </button>
          </div>
          <p className="text-center text-sm text-gray-500">Range: 5–30 cards per day</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium min-h-[44px]"
            >
              Back
            </button>
            <button
              onClick={() => onComplete({ examDate: examDate || null, dailyNewGoal: dailyGoal })}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HOME SCREEN ====================
function HomeScreen({
  progress, onStart, onStartArea, onStartTrouble, onNavigate
}: {
  progress: UserProgress;
  onStart: () => void;
  onStartArea: (area: string) => void;
  onStartTrouble: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const today = getLocalDateString();
  const dueCount = cards.filter(c => progress.cards[c.id] && progress.cards[c.id].dueDate <= today && progress.cards[c.id].timesReviewed > 0).length;
  const newCount = Math.max(0, progress.settings.dailyNewGoal - Object.values(progress.cards).filter(c => c.timesReviewed === 0).length);
  const troubleCount = cards.filter(c => progress.cards[c.id] && isTroubleCard(progress.cards[c.id])).length;
  const daysToExam = getDaysUntilExam(progress.settings.examDate);
  const mastery = getSkillAreaMastery(progress.cards);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Today</h1>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('browse')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center" title="Browse">
            <span className="text-lg">📖</span>
          </button>
          <button onClick={() => onNavigate('progress')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center" title="Progress">
            <span className="text-lg">📊</span>
          </button>
          <button onClick={() => onNavigate('settings')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center" title="Settings">
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Due" value={dueCount} />
        <StatCard label="New" value={newCount} />
        <StatCard label="Trouble" value={troubleCount} highlight={troubleCount > 0} />
        <StatCard label="Streak" value={`${progress.streak}d`} />
      </div>

      {daysToExam !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {daysToExam > 0 ? `${daysToExam} days until exam` : 'Exam day is here!'}
          </span>
        </div>
      )}

      {/* Primary action */}
      <button
        onClick={onStart}
        className="w-full py-4 px-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[56px] shadow-sm"
      >
        Start today's session
      </button>

      {/* Study modes */}
      <div className="space-y-2">
        <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Study Modes</h2>
        {troubleCount > 0 && (
          <button
            onClick={onStartTrouble}
            className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-900/40 min-h-[44px]"
          >
            <span className="font-medium text-red-700 dark:text-red-300">Trouble Cards</span>
            <span className="text-sm text-red-600 dark:text-red-400 ml-2">({troubleCount} cards)</span>
          </button>
        )}
        <details className="group">
          <summary className="py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer font-medium min-h-[44px] flex items-center list-none">
            <span className="mr-2 group-open:rotate-90 transition-transform">▶</span>
            Study by Skill Area
          </summary>
          <div className="mt-2 space-y-1 pl-2">
            {SKILL_AREAS.map(area => (
              <button
                key={area}
                onClick={() => onStartArea(area)}
                className="w-full py-2 px-3 text-left text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] flex items-center justify-between"
              >
                <span>{area}</span>
                <span className="text-xs text-gray-500">{mastery[area] || 0}%</span>
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Deck mastery */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Deck Mastery</h2>
        {SKILL_AREAS.map(area => (
          <div key={area} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate">{area}</span>
              <span className="text-gray-500 ml-2 shrink-0">{mastery[area] || 0}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${mastery[area] || 0}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Mastery = % of cards in Box 4 or 5. This does not predict exam results.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 text-center ${highlight ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

// ==================== STUDY SCREEN ====================
function StudyScreen({
  card, flipped, onFlip, onAnswer, progress, onUndo, onEnd, sessionTitle
}: {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  onAnswer: (a: 'got' | 'almost' | 'missed') => void;
  progress: SessionState;
  onUndo: () => void;
  onEnd: () => void;
  sessionTitle: string;
}) {
  const confusedWith = flipped ? getConfusedWithCards(card.id) : [];
  const totalCards = progress.queue.length;
  const currentPos = Math.min(progress.currentIndex + 1, totalCards);
  const progressPct = totalCards > 0 ? (progress.currentIndex / totalCards) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onEnd} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 min-h-[44px] px-2">
          ✕ End
        </button>
        <span className="text-sm font-medium">{sessionTitle}</span>
        <span className="text-sm text-gray-500">{currentPos}/{totalCards}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Card */}
      <div
        className="flex-1 flex items-center justify-center mb-6"
        onClick={() => !flipped && onFlip()}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Card answer shown' : 'Tap to reveal answer'}
      >
        <div className={`w-full max-h-[60vh] overflow-y-auto rounded-2xl border-2 p-6 transition-all duration-300 ${
          flipped
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-300'
        }`}>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {card.type} • {card.skill_area}
          </div>
          <div className="text-lg font-medium mb-4">{card.front}</div>
          {flipped && (
            <div className="space-y-4 border-t border-green-200 dark:border-green-800 pt-4">
              <div className="text-lg font-semibold text-green-800 dark:text-green-200">{card.back}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{card.explanation}</div>
              {card.example && (
                <div className="text-sm bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Example:</span> {card.example}
                </div>
              )}
              {confusedWith.length > 0 && (
                <div className="text-sm bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Often confused with:</span>
                  <ul className="mt-1 space-y-1">
                    {confusedWith.map(c => (
                      <li key={c.id}>• {c.front}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {!flipped && (
            <div className="text-sm text-gray-400 text-center mt-8">Tap to reveal answer</div>
          )}
        </div>
      </div>

      {/* Answer buttons */}
      {flipped ? (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAnswer('missed')}
              className="py-3 px-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 min-h-[44px] text-sm"
            >
              Missed it
              <span className="block text-xs opacity-70">→ Box 1</span>
            </button>
            <button
              onClick={() => onAnswer('almost')}
              className="py-3 px-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 min-h-[44px] text-sm"
            >
              Almost
              <span className="block text-xs opacity-70">Stay in box</span>
            </button>
            <button
              onClick={() => onAnswer('got')}
              className="py-3 px-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 min-h-[44px] text-sm"
            >
              Got it
              <span className="block text-xs opacity-70">↑ Next box</span>
            </button>
          </div>
          <button
            onClick={onUndo}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 min-h-[44px]"
          >
            Undo last answer
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-gray-400">
          Press Space or tap the card to flip
        </div>
      )}
    </div>
  );
}

// ==================== SESSION SUMMARY ====================
function SessionSummaryScreen({ session, onDone }: { session: SessionState; onDone: () => void }) {
  const summary = getSessionSummary(session);
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
      <div className="text-5xl">✅</div>
      <h2 className="text-2xl font-bold">Session Complete</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between"><span>Cards reviewed</span><span className="font-bold">{summary.total}</span></div>
        <div className="flex justify-between text-green-600 dark:text-green-400"><span>Got it</span><span className="font-bold">{summary.got}</span></div>
        <div className="flex justify-between text-amber-600 dark:text-amber-400"><span>Almost</span><span className="font-bold">{summary.almost}</span></div>
        <div className="flex justify-between text-red-600 dark:text-red-400"><span>Missed</span><span className="font-bold">{summary.missed}</span></div>
      </div>
      <button
        onClick={onDone}
        className="w-full py-4 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 min-h-[44px]"
      >
        Back to Home
      </button>
    </div>
  );
}

// ==================== BROWSE SCREEN ====================
function BrowseScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const filtered = cards.filter(c => {
    if (filterArea && c.skill_area !== filterArea) return false;
    if (filterType && c.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q) || c.skill_ref.toLowerCase().includes(q);
    }
    return true;
  });

  if (selectedCard) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <button onClick={() => setSelectedCard(null)} className="text-sm text-blue-600 dark:text-blue-400 min-h-[44px]">
          ← Back to list
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">{selectedCard.type} • {selectedCard.skill_area}</div>
          <div className="text-lg font-medium">{selectedCard.front}</div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="font-semibold text-green-700 dark:text-green-300 mb-2">{selectedCard.back}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{selectedCard.explanation}</div>
            {selectedCard.example && (
              <div className="mt-3 text-sm bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                <span className="font-medium">Example:</span> {selectedCard.example}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Difficulty: {'★'.repeat(selectedCard.difficulty)}{'☆'.repeat(3 - selectedCard.difficulty)}
            {selectedCard.needs_verification && <span className="ml-2 text-amber-500">⚠ Needs verification</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 min-h-[44px]">← Home</button>
        <h1 className="text-lg font-bold">Browse Cards</h1>
        <span className="text-sm text-gray-500">{filtered.length} cards</span>
      </div>

      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[44px]"
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        <select
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm min-h-[44px]"
        >
          <option value="">All Areas</option>
          {SKILL_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm min-h-[44px]"
        >
          <option value="">All Types</option>
          <option value="definition">Definition</option>
          <option value="compare">Compare</option>
          <option value="scenario">Scenario</option>
          <option value="acronym">Acronym</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No cards match your filters.</div>
        ) : (
          filtered.map(card => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 min-h-[44px]"
            >
              <div className="text-xs text-gray-500 mb-1">{card.type} • {card.skill_area}</div>
              <div className="text-sm font-medium truncate">{card.front}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== PROGRESS SCREEN ====================
function ProgressScreen({ progress, onBack }: { progress: UserProgress; onBack: () => void }) {
  const mastery = getSkillAreaMastery(progress.cards);
  const boxesPerBox = getCardsPerBox(progress.cards);
  const totalCards = cards.length;
  const reviewedCards = Object.keys(progress.cards).length;

  // 14-day review history
  const history = progress.reviewHistory || [];
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = getLocalDateString(d);
    const entry = history.find(h => h.date === dateStr);
    return { date: dateStr, count: entry?.count || 0, label: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' }) };
  });
  const maxCount = Math.max(1, ...last14.map(d => d.count));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 min-h-[44px]">← Home</button>
        <h1 className="text-lg font-bold">Progress</h1>
        <div />
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">{reviewedCards}</div>
          <div className="text-xs text-gray-500">Started</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">{progress.streak}</div>
          <div className="text-xs text-gray-500">Day streak</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">{totalCards}</div>
          <div className="text-xs text-gray-500">Total cards</div>
        </div>
      </div>

      {/* Cards per box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-3">Cards per Box</h2>
        <div className="flex gap-1 items-end h-20">
          {[1, 2, 3, 4, 5].map(box => {
            const count = boxesPerBox[box] || 0;
            const height = totalCards > 0 ? (count / totalCards) * 100 : 0;
            return (
              <div key={box} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{count}</span>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative" style={{ height: '60px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all"
                    style={{ height: `${Math.max(2, height)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">B{box}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-day history */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-3">Last 14 Days</h2>
        <svg viewBox="0 0 280 80" className="w-full h-20" aria-label="Review history chart">
          {last14.map((d, i) => {
            const barWidth = 16;
            const gap = 4;
            const x = i * (barWidth + gap) + 2;
            const barHeight = (d.count / maxCount) * 60;
            return (
              <g key={d.date}>
                <rect
                  x={x}
                  y={70 - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                  className="fill-blue-500"
                />
                {i % 3 === 0 && (
                  <text x={x + barWidth / 2} y={79} textAnchor="middle" className="fill-gray-400" fontSize="7">
                    {d.label.split(' ')[1]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mastery per area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Deck Mastery by Area</h2>
        {SKILL_AREAS.map(area => (
          <div key={area} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate">{area}</span>
              <span className="text-gray-500 ml-2 shrink-0">{mastery[area] || 0}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${mastery[area] || 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== SETTINGS SCREEN ====================
function SettingsScreen({
  progress, onUpdate, onBack
}: {
  progress: UserProgress;
  onUpdate: (s: Partial<typeof progress.settings>) => void;
  onBack: () => void;
}) {
  const [showReset, setShowReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportProgress();
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `az900-progress-${getLocalDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (importProgress(text)) {
        window.location.reload();
      } else {
        alert('Failed to import. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetProgress();
    window.location.reload();
  };

  // Theme
  useEffect(() => {
    const theme = progress.settings.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [progress.settings.theme]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 min-h-[44px]">← Home</button>
        <h1 className="text-lg font-bold">Settings</h1>
        <div />
      </div>

      {/* Daily goal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Daily New Cards</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpdate({ dailyNewGoal: Math.max(5, progress.settings.dailyNewGoal - 1) })}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg font-bold min-h-[44px] min-w-[44px]"
          >
            −
          </button>
          <span className="text-2xl font-bold w-12 text-center">{progress.settings.dailyNewGoal}</span>
          <button
            onClick={() => onUpdate({ dailyNewGoal: Math.min(30, progress.settings.dailyNewGoal + 1) })}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg font-bold min-h-[44px] min-w-[44px]"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500">Range: 5–30</p>
      </div>

      {/* Exam date */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Exam Date</h2>
        <input
          type="date"
          value={progress.settings.examDate || ''}
          onChange={(e) => onUpdate({ examDate: e.target.value || null })}
          className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[44px]"
        />
        {progress.settings.examDate && (
          <p className="text-sm text-gray-500">
            {getDaysUntilExam(progress.settings.examDate)} days remaining
          </p>
        )}
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Theme</h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => onUpdate({ theme: t })}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm min-h-[44px] capitalize ${
                progress.settings.theme === t
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Export/Import */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Backup</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-sm min-h-[44px]"
          >
            Export Progress
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-sm min-h-[44px]"
          >
            Import Progress
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <p className="text-xs text-gray-500">Progress is stored only on this device. Export regularly to back up.</p>
      </div>

      {/* Reset */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold text-red-600 dark:text-red-400">Reset</h2>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium min-h-[44px]"
          >
            Reset All Progress
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600 dark:text-red-400">This will delete all your progress. This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium min-h-[44px]"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
