import React, { useState, useEffect } from 'react';
import {
  CategoryId,
  DifficultyLevel,
  Language,
  UserProfile,
  GameSettings,
  QuizResult,
  Question,
} from './types/quiz';
import { getQuestionsForQuiz, DIFFICULTY_CONFIG } from './data/questions';
import { Navbar } from './components/Navbar';
import { Lobby } from './components/Lobby';
import { QuizPlay } from './components/QuizPlay';
import { ResultModal } from './components/ResultModal';
import { PenaltyMiniGame } from './components/PenaltyMiniGame';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SignInModal } from './components/SignInModal';
import { TrophiesView } from './components/TrophiesView';
import { sounds } from './utils/audio';

const STORAGE_KEY_USER = 'zafoot_user_profile_v1';
const STORAGE_KEY_SETTINGS = 'zafoot_settings_v1';

export default function App() {
  // Load settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // default
    }
    return {
      language: 'en',
      soundEnabled: true,
      timerEnabled: true,
      timerSeconds: 25,
    };
  });

  // Load user profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            coins: typeof parsed.coins === 'number' ? parsed.coins : 50,
            trophies: Array.isArray(parsed.trophies) ? parsed.trophies : [],
            quizzesPlayed: typeof parsed.quizzesPlayed === 'number' ? parsed.quizzesPlayed : 0,
            quizzesWon: typeof parsed.quizzesWon === 'number' ? parsed.quizzesWon : 0,
            questionsAnswered: typeof parsed.questionsAnswered === 'number' ? parsed.questionsAnswered : 0,
            correctAnswers: typeof parsed.correctAnswers === 'number' ? parsed.correctAnswers : 0,
          };
        }
      }
    } catch {
      // default
    }
    return null; // Triggers sign-in modal to claim initial 50 coins
  });

  // Navigation & Game State
  const [activeView, setActiveView] = useState<'lobby' | 'quiz' | 'penalty' | 'trophies'>('lobby');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('champions_league');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync RTL and lang attribute
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.language, settings.soundEnabled]);

  // Persist user
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch {
        // storage quota
      }
    }
  }, [user]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // storage quota
    }
  }, [settings]);

  // Sign In handler (gives 50 coins)
  const handleSignIn = (username: string, avatar: string) => {
    const newUser: UserProfile = {
      id: 'player_' + Date.now(),
      username: username.trim() || 'Manager',
      avatar: avatar || 'striker',
      coins: 50, // Initial 50 Coins granted on sign in!
      quizzesPlayed: 0,
      quizzesWon: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      trophies: [],
      createdDate: new Date().toISOString(),
    };
    setUser(newUser);
  };

  // Start a Quiz (Easy: 10, Medium: 20, Hard: 30, Trophy Cup: 150 coins)
  const handleStartQuiz = (overrideDiff?: unknown, overrideCategory?: unknown) => {
    const validDifficulties: DifficultyLevel[] = ['easy', 'medium', 'hard', 'trophy_cup'];
    const activeDiff: DifficultyLevel =
      typeof overrideDiff === 'string' && validDifficulties.includes(overrideDiff as DifficultyLevel)
        ? (overrideDiff as DifficultyLevel)
        : (validDifficulties.includes(selectedDifficulty) ? selectedDifficulty : 'easy');

    const validCategories: CategoryId[] = [
      'champions_league',
      'laliga',
      'premier_league',
      'serie_a',
      'ligue_1',
      'world_cup',
      'trophy_room',
    ];
    const activeCat: CategoryId =
      typeof overrideCategory === 'string' && validCategories.includes(overrideCategory as CategoryId)
        ? (overrideCategory as CategoryId)
        : (validCategories.includes(selectedCategory) ? selectedCategory : 'champions_league');

    const diffConfig =
      (activeDiff && DIFFICULTY_CONFIG[activeDiff]) ||
      (selectedDifficulty && DIFFICULTY_CONFIG[selectedDifficulty]) ||
      DIFFICULTY_CONFIG.easy || {
        questionCount: 10,
        cost: 10,
        winReward: 20,
        passScorePercentage: 0.6,
        color: 'emerald',
      };

    if (!user || (user.coins ?? 0) < diffConfig.cost) return;

    sounds.playCoin();

    // Deduct exact match fee (10 for easy, 20 for medium, 30 for hard, 150 for trophy match)
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coins: Math.max(0, (prev.coins ?? 0) - diffConfig.cost),
        quizzesPlayed: (prev.quizzesPlayed ?? 0) + 1,
      };
    });

    setSelectedDifficulty(activeDiff);
    setSelectedCategory(activeCat);

    // Generate questions according to difficulty
    // Avoids previously played questions and randomizes option orders (A, B, C, D)
    const questions = getQuestionsForQuiz(activeCat, activeDiff, recentQuestionIds);
    setQuizQuestions(questions);
    setRecentQuestionIds((prev) => {
      const updated = [...prev, ...questions.map((q) => q.id)];
      return updated.slice(-80);
    });
    setQuizResult(null);
    setActiveView('quiz');
  };

  // Finish a Quiz Match (Easy: +20, Medium: +40, Hard: +60, Trophy Cup: +300 Coins)
  const handleFinishQuiz = (matchStats: {
    correctCount: number;
    wrongCount: number;
    timeSpentSeconds: number;
    answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[];
  }) => {
    const totalQuestions = quizQuestions.length;
    const diffConfig =
      (selectedDifficulty && DIFFICULTY_CONFIG[selectedDifficulty]) ||
      DIFFICULTY_CONFIG.easy || {
        questionCount: 10,
        cost: 10,
        winReward: 20,
        passScorePercentage: 0.6,
        color: 'emerald',
      };
    const isWin = matchStats.correctCount >= totalQuestions * diffConfig.passScorePercentage;
    const coinsEarned = isWin ? diffConfig.winReward : 0;

    const result: QuizResult = {
      categoryId: selectedCategory,
      difficulty: selectedDifficulty,
      totalQuestions,
      correctCount: matchStats.correctCount,
      wrongCount: matchStats.wrongCount,
      isWin,
      coinsEarned,
      timeSpentSeconds: matchStats.timeSpentSeconds,
      answers: matchStats.answers,
    };

    setQuizResult(result);

    // Update User Profile
    setUser((prev) => {
      if (!prev) return prev;

      const newTrophies = [...prev.trophies];
      if (isWin && !newTrophies.includes('first_win')) newTrophies.push('first_win');
      if (isWin && selectedDifficulty === 'hard' && !newTrophies.includes('hardcore'))
        newTrophies.push('hardcore');
      if (isWin && selectedCategory === 'world_cup' && !newTrophies.includes('world_cup'))
        newTrophies.push('world_cup');
      if (
        isWin &&
        (selectedDifficulty === 'trophy_cup' || selectedCategory === 'trophy_room') &&
        !newTrophies.includes('grand_champion')
      )
        newTrophies.push('grand_champion');
      if (prev.correctAnswers + matchStats.correctCount >= 50 && !newTrophies.includes('centurion'))
        newTrophies.push('centurion');

      const updatedCoins = prev.coins + coinsEarned;
      if (updatedCoins >= 150 && !newTrophies.includes('wealth')) newTrophies.push('wealth');

      return {
        ...prev,
        coins: updatedCoins,
        quizzesWon: isWin ? prev.quizzesWon + 1 : prev.quizzesWon,
        questionsAnswered: prev.questionsAnswered + totalQuestions,
        correctAnswers: prev.correctAnswers + matchStats.correctCount,
        trophies: newTrophies,
      };
    });
  };

  // Earn Coins from Shootout mini game
  const handleEarnCoins = (amount: number) => {
    sounds.playCoin();
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coins: prev.coins + amount,
      };
    });
  };

  // Daily Training Bonus
  const todayStr = new Date().toISOString().slice(0, 10);
  const canClaimBonus = user ? user.lastDailyBonusDate !== todayStr : false;

  const handleClaimDailyBonus = () => {
    if (!canClaimBonus || !user) return;
    sounds.playVictory();
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coins: prev.coins + 25,
        lastDailyBonusDate: todayStr,
      };
    });
  };

  // Reset Account back to 50 coins
  const handleResetAccount = () => {
    if (!user) return;
    sounds.playClick();
    const resetUser: UserProfile = {
      ...user,
      coins: 50,
      quizzesPlayed: 0,
      quizzesWon: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      trophies: [],
    };
    setUser(resetUser);
    setIsSettingsOpen(false);
  };

  // If user is not yet signed in, display the initial 50 coins welcome modal
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070d14] text-slate-100 flex flex-col justify-between">
        <SignInModal
          language={settings.language}
          onSignIn={handleSignIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Bar */}
      <Navbar
        language={settings.language}
        onLanguageChange={(lang) => setSettings((s) => ({ ...s, language: lang }))}
        user={user}
        activeView={activeView === 'quiz' ? 'lobby' : activeView}
        onNavigate={(view) => {
          sounds.playClick();
          setActiveView(view);
          setQuizResult(null);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClaimDailyBonus={handleClaimDailyBonus}
        canClaimBonus={canClaimBonus}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Active Quiz Match Arena */}
        {activeView === 'quiz' && (
          <>
            {quizResult ? (
              <ResultModal
                result={quizResult}
                questions={quizQuestions}
                language={settings.language}
                onPlayAgain={() => handleStartQuiz()}
                onBackToLobby={() => {
                  sounds.playClick();
                  setActiveView('lobby');
                  setQuizResult(null);
                }}
              />
            ) : (
              <QuizPlay
                questions={quizQuestions}
                category={selectedCategory}
                difficulty={selectedDifficulty}
                language={settings.language}
                timerEnabled={settings.timerEnabled}
                onFinish={handleFinishQuiz}
                onQuit={() => {
                  sounds.playClick();
                  setActiveView('lobby');
                  setQuizResult(null);
                }}
              />
            )}
          </>
        )}

        {/* Penalty Shootout Mini-Game View */}
        {activeView === 'penalty' && (
          <PenaltyMiniGame
            language={settings.language}
            onEarnCoins={handleEarnCoins}
            onBackToLobby={() => {
              sounds.playClick();
              setActiveView('lobby');
            }}
          />
        )}

        {/* Trophy Room View */}
        {activeView === 'trophies' && (
          <TrophiesView
            user={user}
            language={settings.language}
            onBackToLobby={() => {
              sounds.playClick();
              setActiveView('lobby');
            }}
            onPlayTrophyMatch={() => handleStartQuiz('trophy_cup', 'trophy_room')}
          />
        )}

        {/* Match Selection Lobby View */}
        {activeView === 'lobby' && (
          <Lobby
            language={settings.language}
            user={user}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              sounds.playClick();
              setSelectedCategory(cat);
            }}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={(diff) => {
              sounds.playClick();
              setSelectedDifficulty(diff);
            }}
            onStartQuiz={() => handleStartQuiz()}
            onPlayPenalty={() => {
              sounds.playClick();
              setActiveView('penalty');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060b11] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ZaFoot</span>
            <span>·</span>
            <span>
              {settings.language === 'ar'
                ? 'مسابقة كرة القدم: دوري الأبطال، الليغا، البريميرليغ، السيريا آ، الليغ 1، وكأس العالم'
                : 'Football Quiz: Champions League, La Liga, Premier League, Serie A, Ligue 1 & World Cup'}
            </span>
          </div>
          <div className="text-slate-500">
            {settings.language === 'ar'
              ? 'السهل: 10 (فوز +20) · المتوسط: 20 (فوز +40) · الصعب: 30 (فوز +60) · خزانة الكؤوس: 150 (فوز +300)'
              : 'Easy: 10 (Win +20) · Medium: 20 (Win +40) · Hard: 30 (Win +60) · Trophy Cup: 150 (Win +300)'}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isProfileOpen && (
        <ProfileModal
          user={user}
          language={settings.language}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={(updated) => setUser((u) => (u ? { ...u, ...updated } : u))}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          language={settings.language}
          onUpdateSettings={(newS) => setSettings((s) => ({ ...s, ...newS }))}
          onClose={() => setIsSettingsOpen(false)}
          onResetAccount={handleResetAccount}
        />
      )}
    </div>
  );
}
