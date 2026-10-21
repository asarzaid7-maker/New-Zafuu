import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GitCommit,
  Coins,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Trophy,
  Shield,
  Flame,
  Award,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { sounds } from '../utils/audio';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ClubStep {
  club: string;
  club_ar: string;
  years: string;
  country: string;
  loan?: boolean;
}

export interface PlayerCandidate {
  id: string;
  name: string;
  name_ar: string;
  nationality: string;
  nationality_ar: string;
  flag: string;
  photo: string;
  position: string;
  position_ar: string;
}

export interface CareerMatchQuestion {
  questionIndex: number;
  careerTimeline: ClubStep[];
  options: PlayerCandidate[];
}

export interface CareerMatchData {
  matchId: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  fee: number;
  reward: number;
  winThreshold: number;
  updatedBalance: number;
  questions: CareerMatchQuestion[];
}

export interface QuestionAnswerResult {
  isCorrect: boolean;
  questionIndex: number;
  selectedPlayerId: string;
  correctPlayer: {
    id: string;
    name: string;
    name_ar: string;
    nationality: string;
    nationality_ar: string;
    flag: string;
    photo: string;
    position: string;
    position_ar: string;
    career: ClubStep[];
  };
  correctCount: number;
  wrongCount: number;
}

export interface MatchFinishResult {
  isWin: boolean;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  winThreshold: number;
  difficulty: DifficultyLevel;
  feeDeducted: number;
  coinsAwarded: number;
  netCoinsChange: number;
  updatedBalance: number;
}

interface CareerChallengeProps {
  language: Language;
  user: UserProfile;
  onUpdateCoins: (newCoins: number) => void;
  onBackToLobby: () => void;
  onOpenCoinShop: () => void;
}

export const CareerChallenge: React.FC<CareerChallengeProps> = ({
  language,
  user,
  onUpdateCoins,
  onBackToLobby,
  onOpenCoinShop,
}) => {
  // Navigation & Match State
  const [gameState, setGameState] = useState<'difficulty' | 'playing' | 'results'>('difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [match, setMatch] = useState<CareerMatchData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answering State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [currentAnswerResult, setCurrentAnswerResult] = useState<QuestionAnswerResult | null>(null);
  const [isAnswering, setAnswering] = useState(false);
  const [liveCorrectCount, setLiveCorrectCount] = useState(0);
  const [liveWrongCount, setLiveWrongCount] = useState(0);

  // Final Results State
  const [finishResult, setFinishResult] = useState<MatchFinishResult | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  // Difficulty Tier Definitions
  const DIFFICULTIES = [
    {
      id: 'easy' as DifficultyLevel,
      title: language === 'ar' ? 'المستوى السهل (أساطير ونجوم العصر)' : 'Easy Level (Global Legends & Superstars)',
      tag: language === 'ar' ? '15 سؤالاً' : '15 Questions',
      fee: 150,
      reward: 300,
      winMark: '10 / 15',
      icon: Shield,
      accent: 'emerald',
      desc: {
        en: 'World-famous icons (Ronaldo, Messi, Haaland, Mbappé, Salah, De Bruyne, Benzema...) with memorable career stops.',
        ar: 'أساطير الكرة العالمية (رونالدو، ميسي، هالاند، مبابي، صلاح، دي بروين...) بمسيرات شهيرة ومحطات خالدة.',
      },
    },
    {
      id: 'medium' as DifficultyLevel,
      title: language === 'ar' ? 'المستوى المتوسط (مسيرات رحّالة)' : 'Medium Level (Multi-Club Journeys)',
      tag: language === 'ar' ? '20 سؤالاً' : '20 Questions',
      fee: 300,
      reward: 600,
      winMark: '14 / 20',
      icon: Flame,
      accent: 'amber',
      desc: {
        en: 'Players who played for multiple top European clubs, loans, and diverse leagues (Lukaku, Griezmann, Casemiro, Son, Di Maria...).',
        ar: 'لاعبون خاضوا تجارب في أندية كبرى متعددة وإعارات مختلفة (لوكاكو، غريزمان، كاسيميرو، سون، دي ماريا...).',
      },
    },
    {
      id: 'hard' as DifficultyLevel,
      title: language === 'ar' ? 'المستوى الصعب (أكاديميات ومسيرات دقيقة)' : 'Hard Level (Academies & Subtle Paths)',
      tag: language === 'ar' ? '25 سؤالاً' : '25 Questions',
      fee: 500,
      reward: 1000,
      winMark: '18 / 25',
      icon: Award,
      accent: 'rose',
      desc: {
        en: 'Youth academy roots, rising wonderkids, one-club men, and tactical steps (Palmer, Wirtz, Camavinga, Theo, Musiala...).',
        ar: 'محطات الفئات السنية، المواهب الصاعدة، ولاعبو النادي الواحد والخطوات الدقيقة (بالمر، فيرتز، كامافينغا، ثيو، موسيالا...).',
      },
    },
  ];

  const currentDiffConfig =
    DIFFICULTIES.find((d) => d.id === selectedDifficulty) || DIFFICULTIES[0];

  // Start a New Career Match
  const handleStartMatch = async (diff: DifficultyLevel = selectedDifficulty) => {
    if (!user) return;
    setErrorMsg(null);
    setIsLoadingMatch(true);

    const targetTier = DIFFICULTIES.find((d) => d.id === diff) || DIFFICULTIES[0];

    // Client-side coin check
    if (user.coins < targetTier.fee) {
      setErrorMsg(
        language === 'ar'
          ? `رصيدك (${user.coins.toLocaleString()} 🪙) لا يكفي لدخول التحدي (${targetTier.fee} 🪙). يمكنك شحن العملات من المتجر.`
          : `Your balance (${user.coins.toLocaleString()} 🪙) is insufficient for entry (${targetTier.fee} 🪙). You can top up in the Coin Shop.`
      );
      sounds.playWrong();
      setIsLoadingMatch(false);
      return;
    }

    try {
      const res = await fetch('/api/career-challenge/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          difficulty: diff,
          clientCoins: user.coins,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.currentBalance !== undefined) {
          onUpdateCoins(data.currentBalance);
        }
        setErrorMsg(
          language === 'ar'
            ? data?.message_ar || 'تعذر بدء التحدي. تأكد من رصيد العملات.'
            : data?.message || 'Failed to start challenge. Check your balance.'
        );
        return;
      }

      setMatch(data);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setCurrentAnswerResult(null);
      setLiveCorrectCount(0);
      setLiveWrongCount(0);
      setGameState('playing');
      sounds.playWhistle();

      // Deduct entry fee on client right away
      if (typeof data.updatedBalance === 'number') {
        onUpdateCoins(data.updatedBalance);
      }
    } catch {
      setErrorMsg(
        language === 'ar'
          ? 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
          : 'Failed to connect to game server. Please try again.'
      );
    } finally {
      setIsLoadingMatch(false);
    }
  };

  // Submit Answer for the current question
  const handleSelectOption = async (optionId: string) => {
    if (!match || !user || currentAnswerResult !== null || isAnswering) return;

    setSelectedOptionId(optionId);
    setAnswering(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/career-challenge/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.matchId,
          questionIndex: currentIndex,
          selectedPlayerId: optionId,
          userId: user.id,
        }),
      });

      const data: QuestionAnswerResult = await res.json();
      if (!res.ok) {
        setErrorMsg(language === 'ar' ? 'تعذر تسجيل الإجابة.' : 'Failed to register answer.');
        return;
      }

      setCurrentAnswerResult(data);
      setLiveCorrectCount(data.correctCount);
      setLiveWrongCount(data.wrongCount);

      if (data.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }
    } catch {
      setErrorMsg(language === 'ar' ? 'حدث خطأ أثناء إرسال الإجابة.' : 'Error submitting answer.');
    } finally {
      setAnswering(false);
    }
  };

  // Move to Next Question or Finish Match
  const handleNextQuestion = async () => {
    if (!match || !user) return;

    const nextIdx = currentIndex + 1;
    if (nextIdx < match.totalQuestions) {
      setCurrentIndex(nextIdx);
      setSelectedOptionId(null);
      setCurrentAnswerResult(null);
      sounds.playClick();
    } else {
      // Reached the end -> Finish match
      await handleFinishMatch();
    }
  };

  // Finish Match and claim victory reward if won
  const handleFinishMatch = async () => {
    if (!match || !user) return;
    setIsFinishing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/career-challenge/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.matchId,
          userId: user.id,
        }),
      });

      const data: MatchFinishResult = await res.json();
      if (!res.ok) {
        setErrorMsg(language === 'ar' ? 'تعذر إنهاء التحدي.' : 'Failed to finish challenge.');
        setIsFinishing(false);
        return;
      }

      setFinishResult(data);
      if (typeof data.updatedBalance === 'number') {
        onUpdateCoins(data.updatedBalance);
      }

      setGameState('results');

      if (data.isWin) {
        sounds.playVictory();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        sounds.playWhistle();
      }
    } catch {
      setErrorMsg(
        language === 'ar' ? 'حدث خطأ أثناء احتساب النتيجة.' : 'Error calculating final results.'
      );
    } finally {
      setIsFinishing(false);
    }
  };

  const currentQuestion = match?.questions[currentIndex];

  // =========================================================================
  // RENDER SCREEN 1: DIFFICULTY SELECTION & LOBBY
  // =========================================================================
  if (gameState === 'difficulty') {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <button
              onClick={onBackToLobby}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer group mb-1"
            >
              {language === 'ar' ? (
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Lobby'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <GitCommit className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {language === 'ar' ? 'تحدي مسيرة اللاعبين' : 'Football Career Path Challenge'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {language === 'ar'
                ? 'نعرض لك محطات الأندية التي مثّلها اللاعب في مسيرته بالترتيب الزمني الدقيق. هل تستطيع معرفة اسم اللاعب من بين 4 خيارات؟'
                : 'Identify the mystery football player from the authentic clubs they played for throughout their career in chronological order!'}
            </p>
          </div>

          {/* User Coins Display */}
          <button
            onClick={onOpenCoinShop}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
            title={language === 'ar' ? 'رصيد العملات' : 'Coin Balance'}
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-amber-400/80 uppercase font-black tracking-wider">
                {language === 'ar' ? 'رصيدك الحالي' : 'Your Balance'}
              </div>
              <div className="text-sm font-extrabold text-white tabular-nums">
                {user.coins.toLocaleString()} 🪙
              </div>
            </div>
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p>{errorMsg}</p>
              {user.coins < currentDiffConfig.fee && (
                <button
                  onClick={onOpenCoinShop}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'شحن العملات من المتجر ➔' : 'Top Up Coins in Shop ➔'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* How It Works Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
              1
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? 'تسلسل زمني للأندية' : 'Chronological Timeline'}
              </div>
              <div className="text-slate-400">
                {language === 'ar' ? 'من أول نادٍ محترف وحتى المحطة الحالية' : 'From first club through to current team'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
              2
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? '4 خيارات لاعبين' : '4 Player Choices'}
              </div>
              <div className="text-slate-400">
                {language === 'ar' ? 'خيار واحد فقط صحيح مع صور حقيقية' : 'Only one correct star with real photos'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              3
            </div>
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? 'رسوم ومكافأة الفوز' : 'Entry Fee & Rewards'}
              </div>
              <div className="text-slate-400">
                {language === 'ar' ? 'تُخصم الرسوم مرة واحدة وتُضاعف عند الفوز' : 'Single fee on start · Double payout on win'}
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Selection Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>{language === 'ar' ? 'اختر مستوى الصعوبة' : 'Select Challenge Intensity'}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'حدد المستوى قبل بدء التحدي' : 'Pick your preferred tier'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              const Icon = diff.icon;
              const hasCoins = user.coins >= diff.fee;

              return (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'border-emerald-400 bg-gradient-to-b from-slate-900 via-[#0d1c16] to-[#07130f] ring-2 ring-emerald-500/30 shadow-xl'
                      : 'border-slate-800 bg-[#0a1019] hover:border-slate-700 hover:bg-[#0e1724]'
                  }`}
                >
                  <div className="space-y-3 w-full">
                    {/* Top Tier Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          diff.accent === 'emerald'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : diff.accent === 'amber'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{diff.tag}</span>
                      </span>

                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                        {diff.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {diff.desc[language]}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats: Cost, Reward & Win condition */}
                  <div className="mt-5 pt-3 border-t border-slate-800/80 w-full space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">{language === 'ar' ? 'رسوم الدخول:' : 'Entry Fee:'}</span>
                      <strong className="text-amber-300 tabular-nums">{diff.fee} 🪙</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">{language === 'ar' ? 'مكافأة الفوز:' : 'Winning Bounty:'}</span>
                      <strong className="text-emerald-400 tabular-nums font-bold">+{diff.reward} 🪙</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/40">
                      <span>{language === 'ar' ? 'شرط الفوز:' : 'Win Threshold:'}</span>
                      <span className="font-semibold text-slate-300">{diff.winMark} {language === 'ar' ? 'صحيحة' : 'correct'}</span>
                    </div>

                    {!hasCoins && (
                      <div className="text-[11px] text-rose-400 font-semibold pt-1 text-center">
                        {language === 'ar' ? `تحتاج إلى ${diff.fee - user.coins} عملة إضافية` : `Need ${diff.fee - user.coins} more coins`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game Action Bar */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1522] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'جاهز للتحدي الكروي؟' : 'Ready for the Career Test?'}</span>
            </div>
            <div className="text-lg font-bold text-white">
              {currentDiffConfig.title} ·{' '}
              <span className="text-emerald-400">{currentDiffConfig.tag}</span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? `رسوم الدخول ${currentDiffConfig.fee} عملة · مكافأة الفوز ${currentDiffConfig.reward} عملة تُصرف عند تحقيق شرط الفوز (${currentDiffConfig.winMark})`
                : `Entry fee ${currentDiffConfig.fee} Coins · Victory bounty of ${currentDiffConfig.reward} Coins upon hitting ${currentDiffConfig.winMark}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            {user.coins >= currentDiffConfig.fee ? (
              <button
                onClick={() => handleStartMatch(selectedDifficulty)}
                disabled={isLoadingMatch}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <GitCommit className="w-4 h-4" />
                <span>
                  {isLoadingMatch
                    ? (language === 'ar' ? 'جارٍ التحميل...' : 'Starting Match...')
                    : (language === 'ar' ? `ابدأ التحدي (${currentDiffConfig.fee} عملة) ➔` : `Start Challenge (${currentDiffConfig.fee} Coins) ➔`)}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenCoinShop}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Coins className="w-4 h-4" />
                <span>{language === 'ar' ? 'شحن رصيد عملات للدخول' : 'Buy Coins to Enter'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 2: ACTIVE 15/20/25 QUESTIONS CAREER CHALLENGE
  // =========================================================================
  if (gameState === 'playing' && match && currentQuestion) {
    const isAnswered = currentAnswerResult !== null;
    const progressPct = ((currentIndex + 1) / match.totalQuestions) * 100;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 animate-fadeIn">
        {/* Top Match HUD Bar */}
        <div className="bg-[#09111c]/90 backdrop-blur border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back / Abandon Button */}
            <button
              onClick={() => {
                if (window.confirm(
                  language === 'ar'
                    ? 'هل أنت متأكد من مغادرة المباراة؟ لن يتم استرداد رسوم الدخول.'
                    : 'Are you sure you want to exit? Match entry fee will not be refunded.'
                )) {
                  setGameState('difficulty');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'ar' ? 'انسحاب' : 'Forfeit'}</span>
            </button>

            {/* Center: Question Counter */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {language === 'ar'
                  ? `السؤال ${currentIndex + 1} من ${match.totalQuestions}`
                  : `Question ${currentIndex + 1} of ${match.totalQuestions}`}
              </span>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                ({match.difficulty.toUpperCase()})
              </span>
            </div>

            {/* Right: Live Counters & Balance */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-xs font-bold tabular-nums">
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {liveCorrectCount}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-rose-400 flex items-center gap-0.5">
                  <XCircle className="w-3.5 h-3.5" /> {liveWrongCount}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums">{user.coins.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Career Timeline Showcase Box */}
        <div className="bg-gradient-to-br from-[#0c1828] via-[#09121f] to-[#060c14] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-black text-white">
                {language === 'ar' ? 'مسيرة انتقال الأندية (بالترتيب الزمني)' : 'Career Club Path (Chronological Order)'}
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'من البدايات وحتى اليوم' : 'From youth / senior debut to current club'}
            </div>
          </div>

          {/* Timeline Nodes Chain */}
          <div className="relative">
            {/* Desktop / Tablet Horizontal Timeline Flow */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
              {currentQuestion.careerTimeline.map((step, idx) => {
                const isLast = idx === currentQuestion.careerTimeline.length - 1;
                const isFirst = idx === 0;

                return (
                  <React.Fragment key={idx}>
                    {/* Club Node Pill */}
                    <div
                      className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                        isLast
                          ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                          : isFirst
                          ? 'bg-slate-900/90 border-slate-700 shadow-sm'
                          : 'bg-slate-900/70 border-slate-800'
                      }`}
                    >
                      {/* Step index circle */}
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isLast
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {/* Club info */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-white">
                            {language === 'ar' ? step.club_ar : step.club}
                          </span>
                          {step.loan && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
                              {language === 'ar' ? 'إعارة' : 'Loan'}
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30 animate-pulse">
                              {language === 'ar' ? 'الحالي' : 'Now'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{step.years}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{step.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Chevron Arrow */}
                    {!isLast && (
                      <div className="text-emerald-400/80 font-bold shrink-0 hidden sm:block">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-semibold">
            {language === 'ar'
              ? 'أي من اللاعبين الأربعة خاض هذه المسيرة الكروية؟'
              : 'Which of the four players below has had this exact career path?'}
          </div>
        </div>

        {/* Revelation Banner (After Answering) */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-4 ${
              currentAnswerResult.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  currentAnswerResult.isCorrect
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                }`}
              >
                {currentAnswerResult.isCorrect ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {currentAnswerResult.isCorrect
                    ? (language === 'ar' ? 'إجابة صحيحة! أحسنت!' : 'Spot On! Correct Answer!')
                    : (language === 'ar' ? 'إجابة خاطئة!' : 'Incorrect Guess!')}
                </div>
                <div className="text-lg font-black text-white flex items-center gap-2">
                  <span>{currentAnswerResult.correctPlayer.flag}</span>
                  <span>
                    {language === 'ar'
                      ? currentAnswerResult.correctPlayer.name_ar
                      : currentAnswerResult.correctPlayer.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({language === 'ar'
                      ? currentAnswerResult.correctPlayer.position_ar
                      : currentAnswerResult.correctPlayer.position})
                  </span>
                </div>
              </div>
            </div>

            {/* Next / Finish Button */}
            <button
              onClick={handleNextQuestion}
              disabled={isFinishing}
              className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-xl text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>
                {currentIndex + 1 === match.totalQuestions
                  ? (language === 'ar' ? 'عرض النتائج النهائية ➔' : 'View Final Match Results ➔')
                  : (language === 'ar' ? 'السؤال التالي ➔' : 'Next Question ➔')}
              </span>
            </button>
          </div>
        )}

        {/* 4 Candidate Player Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>{language === 'ar' ? 'خيارات اللاعبين (اختر الإجابة الصحيحة):' : 'Candidate Players (Pick the correct star):'}</span>
            <span>{language === 'ar' ? '4 خيارات' : '4 Options'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let cardStyle = 'border-slate-800 bg-[#0d1622] hover:border-slate-600 hover:bg-[#121f30]';

              if (isAnswered) {
                const isTarget = opt.id === currentAnswerResult.correctPlayer.id;
                if (isTarget) {
                  cardStyle = 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20';
                } else if (isSelected && !isTarget) {
                  cardStyle = 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/60 opacity-80';
                } else {
                  cardStyle = 'border-slate-800/40 bg-slate-900/40 opacity-40';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered || isAnswering}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${cardStyle} ${
                    !isAnswered ? 'active:scale-98' : ''
                  }`}
                >
                  {/* Player Portrait Container */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                    <img
                      src={opt.photo}
                      alt={opt.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Nationality Tag in top corner */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-xs font-bold flex items-center gap-1 text-white">
                      <span>{opt.flag}</span>
                      <span className="text-[10px] hidden sm:inline">
                        {language === 'ar' ? opt.nationality_ar : opt.nationality}
                      </span>
                    </div>

                    {/* Answer Reveal Overlay Badges */}
                    {isAnswered && opt.id === currentAnswerResult.correctPlayer.id && (
                      <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="p-2 rounded-full bg-emerald-500 text-slate-950 shadow-lg animate-bounce">
                          <CheckCircle2 className="w-8 h-8" />
                        </span>
                      </div>
                    )}
                    {isAnswered && isSelected && opt.id !== currentAnswerResult.correctPlayer.id && (
                      <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="p-2 rounded-full bg-rose-500 text-white shadow-lg">
                          <XCircle className="w-8 h-8" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Player Name and Position */}
                  <div className="space-y-1">
                    <div className="text-base font-black text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {language === 'ar' ? opt.name_ar : opt.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>{language === 'ar' ? opt.position_ar : opt.position}</span>
                      <span className="text-[11px] text-slate-500">{opt.flag}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 3: GAME RESULTS & BOUNTY PAYOUT
  // =========================================================================
  if (gameState === 'results' && finishResult) {
    const isWin = finishResult.isWin;
    const accuracy = Math.round((finishResult.score / finishResult.totalQuestions) * 100);

    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn space-y-6">
        <div
          className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 text-center space-y-6 shadow-2xl ${
            isWin
              ? 'bg-gradient-to-b from-[#0b2016] via-[#08150f] to-[#040c08] border-emerald-500/50 shadow-emerald-500/10'
              : 'bg-gradient-to-b from-[#1f1015] via-[#140b0e] to-[#0b0507] border-rose-500/40 shadow-rose-500/10'
          }`}
        >
          {/* Header Trophy or Whistle */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-xl mx-auto">
            {isWin ? (
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-400" />
            )}
          </div>

          <div className="space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block ${
                isWin
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isWin
                ? (language === 'ar' ? 'فوز مستحق وتتويج!' : 'Match Victory!')
                : (language === 'ar' ? 'خسارة وتحدي قوي' : 'Defeat! Hard Luck')}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isWin
                ? (language === 'ar' ? 'عبقري مسيرات كرة القدم!' : 'Master Football Scout!')
                : (language === 'ar' ? 'لم تبلغ حد الفوز المطلوب' : 'Missed Winning Mark')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {isWin
                ? (language === 'ar'
                    ? `أحسنت! حققت ${finishResult.score} من ${finishResult.totalQuestions} وتجاوزت شرط الفوز (${finishResult.winThreshold}). تمت إضافة مكافأة الفوز إلى رصيدك!`
                    : `Incredible football IQ! You achieved ${finishResult.score}/${finishResult.totalQuestions} and passed the required threshold (${finishResult.winThreshold}). Coins awarded!`)
                : (language === 'ar'
                    ? `حققت ${finishResult.score} إجابات صحيحة من أصل ${finishResult.totalQuestions}. شرط الفوز كان ${finishResult.winThreshold} إجابات. تدرب وجرب مجدداً!`
                    : `You got ${finishResult.score} correct out of ${finishResult.totalQuestions}. You needed ${finishResult.winThreshold} to claim the bounty. Try again!`)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-bold">
                {language === 'ar' ? 'النتيجة النهائية' : 'Final Score'}
              </div>
              <div className="text-xl font-black text-white tabular-nums mt-0.5">
                {finishResult.score} / {finishResult.totalQuestions}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-bold">
                {language === 'ar' ? 'دقة الإجابات' : 'Accuracy'}
              </div>
              <div className="text-xl font-black text-emerald-400 tabular-nums mt-0.5">
                {accuracy}%
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-bold">
                {language === 'ar' ? 'أرباح المباراة' : 'Coins Awarded'}
              </div>
              <div
                className={`text-xl font-black tabular-nums mt-0.5 ${
                  finishResult.coinsAwarded > 0 ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {finishResult.coinsAwarded > 0 ? `+${finishResult.coinsAwarded} 🪙` : '0 🪙'}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-bold">
                {language === 'ar' ? 'الرصيد الكلي' : 'Total Balance'}
              </div>
              <div className="text-xl font-black text-amber-300 tabular-nums mt-0.5">
                {finishResult.updatedBalance.toLocaleString()} 🪙
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleStartMatch(finishResult.difficulty)}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'العب مجدداً بنفس المستوى' : 'Play Again'}</span>
            </button>

            <button
              onClick={() => setGameState('difficulty')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <span>{language === 'ar' ? 'تغيير مستوى الصعوبة' : 'Change Difficulty'}</span>
            </button>

            <button
              onClick={onBackToLobby}
              className="w-full sm:w-auto px-5 py-3.5 bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              <span>{language === 'ar' ? 'الرئيسية' : 'Back to Lobby'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
