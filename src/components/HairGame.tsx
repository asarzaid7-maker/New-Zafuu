import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Scissors,
  Coins,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertCircle,
  Trophy,
  Shield,
  Flame,
} from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { sounds } from '../utils/audio';

interface HairOption {
  id: string;
  name: string;
  name_ar: string;
  club: string;
  club_ar: string;
  league: string;
  league_ar: string;
  photo: string;
}

interface HairChallenge {
  challengeId: string;
  hairPhoto: string;
  options: HairOption[];
  cost: number;
  reward: number;
  updatedBalance: number;
}

interface SubmitResult {
  isCorrect: boolean;
  selectedPlayerId: string;
  correctPlayer: {
    id: string;
    name: string;
    name_ar: string;
    club: string;
    club_ar: string;
    league: string;
    league_ar: string;
    hair_style: string;
    hair_style_ar: string;
    photo_full: string;
    photo_hair: string;
  };
  coinsAwarded: number;
  netCoinsChange: number;
  updatedBalance: number;
}

interface HairGameProps {
  language: Language;
  user: UserProfile;
  onUpdateCoins: (newCoins: number) => void;
  onBackToLobby: () => void;
  onOpenCoinShop: () => void;
}

export const HairGame: React.FC<HairGameProps> = ({
  language,
  user,
  onUpdateCoins,
  onBackToLobby,
  onOpenCoinShop,
}) => {
  const [challenge, setChallenge] = useState<HairChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [zoomHair, setZoomHair] = useState(false);
  const [streak, setStreak] = useState(0);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  // Sync user balance on initial mount
  useEffect(() => {
    if (user?.id) {
      fetch('/api/user/sync-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, clientCoins: user.coins }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data?.coins === 'number' && data.coins !== user.coins) {
            onUpdateCoins(data.coins);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  // Load a new challenge
  const fetchNewChallenge = async () => {
    if (!user) return;
    setErrorMsg(null);
    setSelectedPlayerId(null);
    setResult(null);
    setZoomHair(false);
    setLoading(true);

    try {
      const res = await fetch('/api/hair-game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, clientCoins: user.coins }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.currentBalance !== undefined) {
          onUpdateCoins(data.currentBalance);
        }
        setErrorMsg(
          language === 'ar'
            ? data?.message_ar || 'رصيدك غير كافٍ. تحتاج إلى 500 عملة للعب.'
            : data?.message || 'Insufficient coins. You need 500 Coins to enter.'
        );
        return;
      }

      setChallenge(data);
      // Immediately reflect the deducted 500 Coins
      if (typeof data.updatedBalance === 'number') {
        onUpdateCoins(data.updatedBalance);
      }
      sounds.playClick();
    } catch {
      setErrorMsg(
        language === 'ar'
          ? 'تعذر الاتصال بالخادم لبدء التحدي. يرجى المحاولة ثانية.'
          : 'Failed to start hair challenge. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto start first challenge if user has enough coins and no challenge yet
  useEffect(() => {
    if (!challenge && !result && !errorMsg && user && user.coins >= 500) {
      fetchNewChallenge();
    }
  }, []);

  // Submit guess
  const handleSelectPlayer = async (playerId: string) => {
    if (submitting || result || !challenge || !user) return;

    setSelectedPlayerId(playerId);
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/hair-game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          selectedPlayerId: playerId,
          userId: user.id,
        }),
      });

      const data: SubmitResult = await res.json();
      if (!res.ok) {
        setErrorMsg(
          language === 'ar'
            ? 'انتهت صلاحية هذا التحدي. اضغط على التحدي التالي للمتابعة.'
            : 'Challenge expired. Please move to next challenge.'
        );
        return;
      }

      setResult(data);
      if (typeof data.updatedBalance === 'number') {
        onUpdateCoins(data.updatedBalance);
      }

      if (data.isCorrect) {
        sounds.playCorrect();
        setTimeout(() => sounds.playVictory(), 250);
        setStreak((prev) => prev + 1);
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#fbbf24', '#38bdf8', '#a855f7'],
        });
      } else {
        sounds.playWrong();
        setStreak(0);
      }
    } catch {
      setErrorMsg(
        language === 'ar'
          ? 'تعذر التحقق من الإجابة مع الخادم.'
          : 'Failed to verify answer with server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasEnoughCoins = user && user.coins >= 500;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToLobby}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={language === 'ar' ? 'العودة للرئيسية' : 'Back to Lobby'}
            >
              <ArrowIcon className="w-4 h-4 rotate-180" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Scissors className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{language === 'ar' ? 'خمّن اللاعب من شعره' : 'Guess the Player by Their Hair'}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                500 🪙
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'ar'
              ? 'دقق في قصة الشعر وتعرف على نجم الدوريات الأوروبية الخمس الكبرى للفوز بـ 1,000 عملة!'
              : 'Spot the iconic haircut from the Big 5 European Leagues. Pick the star to win 1,000 Coins!'}
          </p>
        </div>

        {/* HUD: Coin Balance & Streak */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streak}x {language === 'ar' ? 'توالي' : 'Streak'}</span>
            </div>
          )}

          <div
            onClick={onOpenCoinShop}
            title={language === 'ar' ? 'شراء المزيد من العملات' : 'Get More Coins'}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm group"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-sm font-black text-white tabular-nums">
              {user.coins.toLocaleString()}
            </span>
            <span className="text-xs text-amber-300/80 font-bold">
              {language === 'ar' ? 'عملة' : 'Coins'}
            </span>
            <span className="text-[11px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md leading-tight">
              +
            </span>
          </div>
        </div>
      </div>

      {/* Economy Rule Strip */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-xs font-semibold">
        <div className="bg-[#0b1422] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-slate-400">{language === 'ar' ? 'تكلفة المحاولة:' : 'Cost per Try:'}</span>
          <span className="text-rose-400 font-black tabular-nums">500 🪙</span>
        </div>
        <div className="bg-[#0b1422] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-slate-400">{language === 'ar' ? 'مكافأة الإجابة الصحيحة:' : 'Win Reward:'}</span>
          <span className="text-emerald-400 font-black tabular-nums">+1,000 🪙</span>
        </div>
        <div className="bg-[#0b1422] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-slate-400">{language === 'ar' ? 'الدوريات المتاحة:' : 'Leagues:'}</span>
          <span className="text-amber-300 font-black">Top 5 European</span>
        </div>
      </div>

      {/* Error / Alert Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="font-semibold leading-relaxed">{errorMsg}</p>
            {!hasEnoughCoins && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={onOpenCoinShop}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'شحن رصيد من متجر العملات' : 'Buy Coins in Coin Shop'}</span>
                </button>
                <button
                  onClick={onBackToLobby}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'العودة للمباريات السهلة' : 'Back to Easy Matches'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insufficient Coins Guard View (when balance < 500 and not active) */}
      {!hasEnoughCoins && !challenge && (
        <div className="bg-gradient-to-b from-[#0e1726] to-[#080e18] border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-500/20">
            🪙
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              {language === 'ar' ? 'تحتاج إلى 500 عملة للمشاركة' : '500 Coins Required to Play'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? `رصيدك الحالي هو ${user.coins.toLocaleString()} عملة. يمكنك شحن رصيدك فوراً لمواصلة تحدي تخمين الشعر وكسب 1,000 عملة لكل إجابة صحيحة!`
                : `Your current balance is ${user.coins.toLocaleString()} Coins. Top up in the Coin Shop to enter the hair guessing arena and win 1,000 Coins per victory!`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenCoinShop}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>{language === 'ar' ? 'شراء عملات الآن' : 'Get Coins in Coin Shop'}</span>
            </button>
            <button
              onClick={onBackToLobby}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Return to Tunnel'}
            </button>
          </div>
        </div>
      )}

      {/* Active Challenge Arena */}
      {challenge && (
        <div className="space-y-8">
          {/* Main Showcase: Mystery Cropped Hair / Revealed Correct Player */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-[#0e1828] via-[#09111c] to-[#050b12] shadow-2xl p-6 sm:p-8">
            {/* Ambient floodlight glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Badge above image */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-bold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {result
                    ? (result.isCorrect ? (language === 'ar' ? 'تم الكشف: إجابة صحيحة! 🎯' : 'Revealed: Spot on! 🎯') : (language === 'ar' ? 'تم الكشف: إجابة خاطئة!' : 'Revealed: Incorrect Guess!'))
                    : (language === 'ar' ? 'من هو صاحب قصة الشعر هذه؟' : 'Whose Hairstyle is This?')}
                </span>
              </div>

              {/* Cropped Hair Frame with Interactive Zoom & Mystery Shield */}
              <div className="relative group max-w-sm w-full mx-auto">
                <div
                  className={`relative rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-500 ${
                    result
                      ? result.isCorrect
                        ? 'border-emerald-400 shadow-emerald-500/30'
                        : 'border-rose-400 shadow-rose-500/30'
                      : 'border-amber-400/80 shadow-amber-500/20 bg-slate-950'
                  }`}
                >
                  {/* Photo: Mystery hair crop OR Revealed full portrait */}
                  <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={result ? result.correctPlayer.photo_full : challenge.hairPhoto}
                      alt="Player Hairstyle"
                      className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                        zoomHair ? 'scale-150' : 'scale-100'
                      }`}
                    />

                    {/* Before answer: Dark frosted gradient obscuring any facial details at bottom */}
                    {!result && (
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
                    )}

                    {/* Mystery label overlay */}
                    {!result && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/75 border border-slate-700/80 text-[10px] font-bold text-slate-300 whitespace-nowrap backdrop-blur-sm pointer-events-none flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-amber-400" />
                        <span>{language === 'ar' ? 'شعر فقط · الوجه محجوب' : 'Hair Only · Face Obscured'}</span>
                      </div>
                    )}
                  </div>

                  {/* Zoom Toggle button */}
                  {!result && (
                    <button
                      type="button"
                      onClick={() => setZoomHair(!zoomHair)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/70 hover:bg-black text-slate-200 border border-slate-700 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1"
                      title={zoomHair ? 'Zoom Out' : 'Zoom In on Hair'}
                    >
                      {zoomHair ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Hairstyle Description / Reveal Announcement */}
              {result ? (
                <div className="space-y-2 pt-2 animate-in zoom-in-95 duration-200">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black border ${
                    result.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {result.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span>
                      {result.isCorrect
                        ? (language === 'ar' ? 'إجابة صحيحة! +1,000 عملة 🎉' : 'CORRECT! +1,000 COINS WON! 🎉')
                        : (language === 'ar' ? 'إجابة خاطئة! -500 عملة' : 'INCORRECT! -500 COINS')}
                    </span>
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-white">
                    {language === 'ar' ? result.correctPlayer.name_ar : result.correctPlayer.name}
                  </div>

                  <div className="text-xs text-slate-300 flex items-center justify-center gap-2">
                    <span className="text-amber-400 font-bold">{language === 'ar' ? result.correctPlayer.club_ar : result.correctPlayer.club}</span>
                    <span>·</span>
                    <span className="text-slate-400">{language === 'ar' ? result.correctPlayer.league_ar : result.correctPlayer.league}</span>
                  </div>

                  <p className="text-xs text-slate-400 max-w-md mx-auto italic">
                    "{language === 'ar' ? result.correctPlayer.hair_style_ar : result.correctPlayer.hair_style}"
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">
                    {language === 'ar' ? 'اختر اللاعب صاحب هذا الشعر:' : 'Identify the player with this hairstyle:'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'ar'
                      ? 'اختر خياراً واحداً من النجوم الأربعة أدناه لتأكيد تخمينك'
                      : 'Select one of the 4 candidates below to lock in your guess'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4 Player Candidate Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>{language === 'ar' ? 'اللاعبون المرشحون (4 خيارات)' : 'Player Options (Choose One)'}</span>
              <span>{language === 'ar' ? 'الدوريات الكبرى 5' : 'Big 5 European Leagues'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {challenge.options.map((player) => {
                const isSelected = selectedPlayerId === player.id;
                const isRevealed = !!result;
                const isCorrect = result?.correctPlayer.id === player.id;
                const isWrongSelection = isRevealed && isSelected && !result.isCorrect;

                return (
                  <button
                    key={player.id}
                    type="button"
                    disabled={isRevealed || submitting}
                    onClick={() => handleSelectPlayer(player.id)}
                    className={`relative rounded-2xl border p-3 flex flex-col justify-between transition-all duration-200 text-left cursor-pointer group ${
                      isRevealed
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20'
                          : isWrongSelection
                          ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/40 opacity-90'
                          : 'border-slate-800 bg-[#0a121d]/80 opacity-50'
                        : isSelected
                        ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40'
                        : 'border-slate-800 bg-[#0a121e] hover:border-slate-700 hover:bg-[#0e1929] hover:scale-[1.02] active:scale-95 shadow-md'
                    }`}
                  >
                    {/* Status Badge on Reveal */}
                    {isRevealed && isCorrect && (
                      <div className="absolute top-2.5 right-2.5 z-10 p-1 rounded-full bg-emerald-500 text-slate-950 font-bold shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {isRevealed && isWrongSelection && (
                      <div className="absolute top-2.5 right-2.5 z-10 p-1 rounded-full bg-rose-500 text-white font-bold shadow-md">
                        <XCircle className="w-4 h-4" />
                      </div>
                    )}

                    {/* Player Image */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-3">
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {language === 'ar' ? player.league_ar : player.league}
                        </span>
                      </div>

                      <div className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                        {language === 'ar' ? player.name_ar : player.name}
                      </div>

                      <div className="text-xs text-slate-400 truncate">
                        {language === 'ar' ? player.club_ar : player.club}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Area: Next Challenge Button */}
          {result && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 animate-in fade-in duration-200">
              <div className="text-xs text-slate-400">
                {result.isCorrect ? (
                  <span className="text-emerald-400 font-bold">
                    {language === 'ar'
                      ? 'ربحت +1,000 عملة (صافي الربح +500 عملة)'
                      : 'You received +1,000 Coins (Net profit: +500 Coins)'}
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">
                    {language === 'ar'
                      ? 'خسرت 500 عملة في هذه المحاولة'
                      : 'You lost the 500 Coins used for this attempt'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onBackToLobby}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Lobby'}
                </button>

                <button
                  type="button"
                  onClick={fetchNewChallenge}
                  disabled={loading}
                  className="w-1/2 sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'التحدي التالي ➔ (500 🪙)' : 'Next Challenge ➔ (500 🪙)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
