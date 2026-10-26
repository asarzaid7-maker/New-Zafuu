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
import { CoinShopModal } from './components/CoinShopModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SignInModal } from './components/SignInModal';
import { TrophiesView } from './components/TrophiesView';
import { CareerChallenge } from './components/CareerChallenge';
import { ZaFootAI } from './components/ZaFootAI';
import { OneVsOneChallenge } from './components/OneVsOneChallenge';
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
        if (parsed && typeof parsed.coins === 'number') {
          return {
            id: typeof parsed.id === 'string' && parsed.id.trim() ? parsed.id.trim() : 'player_' + Date.now(),
            username: typeof parsed.username === 'string' && parsed.username.trim() ? parsed.username.trim() : 'Manager',
            avatar: typeof parsed.avatar === 'string' && parsed.avatar ? parsed.avatar : 'striker',
            ...parsed,
            customPhoto: typeof parsed.customPhoto === 'string' ? parsed.customPhoto : undefined,
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
  const [activeView, setActiveView] = useState<'lobby' | 'quiz' | 'trophies' | 'careerChallenge' | 'aiChat' | 'oneVsOne'>('lobby');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('champions_league');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCoinShopOpen, setIsCoinShopOpen] = useState(false);

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
  const handleSignIn = (username: string, avatar: string, customPhoto?: string) => {
    const newUser: UserProfile = {
      id: 'player_' + Date.now(),
      username: username.trim() || 'Manager',
      avatar: avatar || 'striker',
      customPhoto: customPhoto || undefined,
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

  // Start a Quiz Match
  const handleStartQuiz = (overrideDiff?: DifficultyLevel, overrideCat?: CategoryId) => {
    if (!user) return;
    const diffToUse = overrideDiff || selectedDifficulty;
    const catToUse = overrideCat || selectedCategory;

    const diffConfig = DIFFICULTY_CONFIG[diffToUse] || DIFFICULTY_CONFIG.easy;
    const entryCost = diffConfig.cost;

    // Check if player has enough coins
    if (user.coins < entryCost) {
      sounds.playWrong();
      setIsCoinShopOpen(true);
      return;
    }

    // Deduct coins entry fee
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coins: prev.coins - entryCost,
        quizzesPlayed: prev.quizzesPlayed + 1,
      };
    });

    // Retrieve fresh questions
    const questions = getQuestionsForQuiz(catToUse, diffToUse, recentQuestionIds);
    setQuizQuestions(questions);

    // Save recent questions to avoid immediate repetition
    const newIds = questions.map((q) => q.id);
    setRecentQuestionIds((prev) => [...newIds, ...prev].slice(0, 80));

    setQuizResult(null);
    setActiveView('quiz');
    sounds.playWhistle();
  };

  // Finish a Quiz Match
  const handleFinishQuiz = (matchStats: {
    correctCount: number;
    wrongCount: number;
    timeSpentSeconds: number;
    answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[];
  }) => {
    const totalQuestions = quizQuestions.length;
    const diffConfig =
      DIFFICULTY_CONFIG[selectedDifficulty] ||
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

  // Purchase Coins from Coin Shop (100 for $1, 1000 for $10, 2000 for $20, or custom amount at $0.01/coin)
  const handlePurchaseCoins = (amount: number, _packName: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedCoins = prev.coins + amount;
      const newTrophies = [...prev.trophies];
      if (updatedCoins >= 150 && !newTrophies.includes('wealth')) {
        newTrophies.push('wealth');
      }
      return {
        ...prev,
        coins: updatedCoins,
        trophies: newTrophies,
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

  // Reset Account handler
  const handleResetAccount = () => {
    const freshUser: UserProfile = {
      id: 'player_' + Date.now(),
      username: user?.username || 'Manager',
      avatar: user?.avatar || 'striker',
      coins: 50,
      quizzesPlayed: 0,
      quizzesWon: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      trophies: [],
      createdDate: new Date().toISOString(),
    };
    setUser(freshUser);
    setActiveView('lobby');
    setQuizResult(null);
    sounds.playClick();
  };

  // If user hasn't created profile, show initial sign-in modal
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070d14] text-slate-100 flex items-center justify-center p-4">
        <SignInModal
          language={settings.language}
          onSignIn={handleSignIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
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
        onOpenCoinShop={() => setIsCoinShopOpen(true)}
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

        {/* Career Path Challenge View */}
        {activeView === 'careerChallenge' && (
          <CareerChallenge
            language={settings.language}
            user={user}
            onUpdateCoins={(newCoins) => {
              setUser((prev) => (prev ? { ...prev, coins: newCoins } : prev));
            }}
            onBackToLobby={() => {
              sounds.playClick();
              setActiveView('lobby');
            }}
            onOpenCoinShop={() => setIsCoinShopOpen(true)}
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

        {/* ZaFoot AI Football Assistant View */}
        {activeView === 'aiChat' && (
          <ZaFootAI
            language={settings.language}
            user={user}
            onBackToLobby={() => {
              sounds.playClick();
              setActiveView('lobby');
            }}
          />
        )}

        {/* 1v1 Football Challenge View */}
        {activeView === 'oneVsOne' && (
          <OneVsOneChallenge
            language={settings.language}
            user={user}
            onBackToLobby={() => {
              sounds.playClick();
              setActiveView('lobby');
            }}
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
            onOpenCoinShop={() => setIsCoinShopOpen(true)}
            onPlayCareerChallenge={() => {
              sounds.playClick();
              setActiveView('careerChallenge');
            }}
            onOpenAiChat={() => {
              sounds.playClick();
              setActiveView('aiChat');
            }}
            onPlayOneVsOne={() => {
              sounds.playClick();
              setActiveView('oneVsOne');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060b11] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/360_F_332687153_gmsohq86koOEWFYlYSI3N6xzb1zIcG88_cb9e53eb.jpg"
              alt="ZaFoot Logo"
              className="w-5 h-5 rounded-md object-cover border border-slate-700/80 inline-block"
            />
            <span className="font-bold text-slate-300">ZaFoot</span>
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

      {/* Coin Shop Modal */}
      <CoinShopModal
        isOpen={isCoinShopOpen}
        onClose={() => setIsCoinShopOpen(false)}
        language={settings.language}
        currentCoins={user.coins}
        userId={user.id}
        onPurchaseCoins={handlePurchaseCoins}
      />
    </div>
  );
}
