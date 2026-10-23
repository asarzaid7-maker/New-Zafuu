import React from 'react';
import { Crown, Trophy, Swords, Zap, Check, Users } from 'lucide-react';
import { Language } from '../types/quiz';
import { AVATAR_OPTIONS } from '../data/avatars';

export interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  customPhoto?: string;
  connected: boolean;
  score: number;
  correctCount: number;
  hasAnsweredCurrent?: boolean;
}

export interface Scoreboard1v1Props {
  player1: PlayerInfo;
  player2?: PlayerInfo | null;
  currentUserId: string;
  language: Language;
  timeLeft?: number;
  showTimer?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  isFinal?: boolean;
  winnerId?: string | 'draw' | null;
}

/**
 * FootballAvatar renders player custom photo or a distinguished football-themed fallback avatar
 */
export const FootballAvatar: React.FC<{
  player?: PlayerInfo | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLeading?: boolean;
  isWinner?: boolean;
  isCurrent?: boolean;
  hasAnswered?: boolean;
  side?: 'left' | 'right';
}> = ({
  player,
  size = 'md',
  isLeading = false,
  isWinner = false,
  isCurrent = false,
  hasAnswered = false,
}) => {
  if (!player) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <Users className="w-6 h-6 animate-pulse" />
      </div>
    );
  }

  const av = AVATAR_OPTIONS.find((a) => a.id === player.avatar) || {
    id: 'striker',
    emoji: '⚽',
    label: { en: 'Golden Striker', ar: 'الهداف الذهبي' },
    bgGradient: 'from-amber-500 via-amber-600 to-yellow-600',
  };

  const dimClasses =
    size === 'sm'
      ? 'w-10 h-10 text-xl rounded-xl'
      : size === 'md'
      ? 'w-12 h-12 sm:w-14 sm:h-14 text-2xl sm:text-3xl rounded-2xl'
      : size === 'lg'
      ? 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl'
      : 'w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl rounded-3xl';

  const borderClass = isWinner
    ? 'border-2 border-amber-400 ring-4 ring-amber-400/40 shadow-lg shadow-amber-500/30'
    : isLeading
    ? 'border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/20'
    : isCurrent
    ? 'border-2 border-emerald-400 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-500/20'
    : 'border-2 border-slate-700 shadow-md';

  return (
    <div className="relative shrink-0 select-none inline-block">
      {player.customPhoto ? (
        <img
          src={player.customPhoto}
          alt={player.name}
          className={`${dimClasses} object-cover ${borderClass} bg-slate-900`}
        />
      ) : (
        <div
          className={`${dimClasses} bg-gradient-to-br ${av.bgGradient} flex items-center justify-center ${borderClass} text-white drop-shadow`}
        >
          <span>{av.emoji || '⚽'}</span>
        </div>
      )}

      {/* Football-themed Mini Badge overlay for players without custom photo or as sports badge */}
      {!player.customPhoto && (
        <span
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] shadow"
          title="ZaFoot 1v1 Football Player"
        >
          ⚽
        </span>
      )}

      {/* Answered Current Question Checkmark */}
      {hasAnswered && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px] shadow-lg ring-2 ring-slate-950">
          <Check className="w-3 h-3 stroke-[3]" />
        </span>
      )}

      {/* Winner Trophy or Leading Crown */}
      {isWinner ? (
        <span className="absolute -top-2.5 -left-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] shadow-lg flex items-center gap-0.5 ring-2 ring-slate-950">
          <Trophy className="w-2.5 h-2.5" /> 🏆
        </span>
      ) : isLeading ? (
        <span className="absolute -top-2 -left-1 px-1 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] shadow flex items-center gap-0.5 ring-1 ring-slate-950">
          <Crown className="w-2.5 h-2.5" />
        </span>
      ) : null}

      {/* Online indicator */}
      <span
        className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
          player.connected ? 'bg-emerald-400' : 'bg-slate-500'
        }`}
        title={player.connected ? 'Connected' : 'Offline'}
      />
    </div>
  );
};

/**
 * Scoreboard1v1:
 * - Always positions Player 1 strictly on the Left and Player 2 on the Right (dir="ltr")
 * - Shows each player's profile picture/avatar and username clearly at the top
 * - Displays the current score directly beneath each player's name
 * - Shows the match format e.g. "Player 1: 5 - 4 :Player 2"
 * - Automatically updates in real time whenever either player answers correctly
 * - Reflects actual points earned (e.g. 500 pts vs 400 pts)
 * - Highlights the leading player subtly and shows a draw indicator when tied
 * - Full responsive layout for mobile and desktop
 */
export const Scoreboard1v1: React.FC<Scoreboard1v1Props> = ({
  player1,
  player2,
  currentUserId,
  language,
  timeLeft,
  showTimer = false,
  questionNumber,
  totalQuestions = 30,
  isFinal = false,
  winnerId,
}) => {
  const p1Name = player1.name || 'Player 1';
  const p2Name = player2?.name || (language === 'ar' ? 'الخصم' : 'Player 2');

  const p1Goals = player1.correctCount ?? 0;
  const p2Goals = player2?.correctCount ?? 0;

  const p1Points = player1.score ?? 0;
  const p2Points = player2?.score ?? 0;

  const isP1Me = currentUserId === player1.id;
  const isP2Me = !!player2 && currentUserId === player2.id;

  // Compare leaders (by goals or points)
  const isP1Leading = p1Points > p2Points;
  const isP2Leading = p2Points > p1Points;
  const isTied = p1Points === p2Points;

  const isP1Winner = isFinal && winnerId === player1.id;
  const isP2Winner = isFinal && !!player2 && winnerId === player2.id;
  const isDrawFinal = isFinal && winnerId === 'draw';

  // Timer visual style
  const isUrgent = (timeLeft ?? 15) <= 4;
  const isWarning = (timeLeft ?? 15) <= 7 && (timeLeft ?? 15) > 4;
  const timerStyle = isUrgent
    ? 'text-rose-400 border-rose-500/70 bg-rose-500/20 shadow-rose-500/30 animate-pulse'
    : isWarning
    ? 'text-amber-400 border-amber-500/70 bg-amber-500/20'
    : 'text-emerald-400 border-emerald-500/70 bg-emerald-500/20';

  return (
    <div
      dir="ltr"
      className="w-full rounded-2xl bg-gradient-to-r from-[#071322]/98 via-[#0b1c2e]/98 to-[#071322]/98 border border-slate-700/80 shadow-2xl p-3 sm:p-5 relative overflow-hidden backdrop-blur-md select-none transition-all"
    >
      {/* Stadium Pitch Top Highlight Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-500" />

      {/* Top Meta Strip: Match Header & Synchronized Scoreboard title */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 text-[11px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Swords className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">
            {language === 'ar' ? 'تحدي 1 ضد 1 · زافوت' : 'ZaFoot 1v1 Arena'}
          </span>
        </div>

        {/* Question Counter or Match Stage */}
        <div className="flex items-center gap-2">
          {isFinal ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
              {language === 'ar' ? 'صافرة النهاية · النتيجة الختامية' : 'Full-Time · Final Score'}
            </span>
          ) : questionNumber !== undefined && questionNumber > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-black flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>
                {language === 'ar'
                  ? `السؤال ${questionNumber} من ${totalQuestions}`
                  : `Question ${questionNumber}/${totalQuestions}`}
              </span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
              {language === 'ar' ? 'نفق اللاعبين قبل صافرة البداية' : 'Match Tunnel · Ready'}
            </span>
          )}
        </div>
      </div>

      {/* Centered Matchup Formula: Player 1: 5 - 4 :Player 2 */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner max-w-full">
          <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-[160px]">
            {p1Name}
          </span>
          <span className="font-mono font-black text-xs sm:text-sm text-amber-400 tracking-wider">
            : {p1Goals} - {p2Goals} :
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-[160px]">
            {p2Name}
          </span>
        </div>
      </div>

      {/* Main 3-Column Scoreboard Grid: Player 1 (Left) | Center Scoreboard & Timer | Player 2 (Right) */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PLAYER 1 */}
        {/* ========================================================================= */}
        <div
          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl transition-all ${
            isP1Leading || isP1Winner
              ? 'bg-amber-500/10 border border-amber-500/40 ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border border-slate-800'
          }`}
        >
          <FootballAvatar
            player={player1}
            size="md"
            isLeading={isP1Leading && !isFinal}
            isWinner={isP1Winner}
            isCurrent={isP1Me}
            hasAnswered={player1.hasAnsweredCurrent}
            side="left"
          />

          <div className="overflow-hidden min-w-0 flex-1 text-left">
            {/* Player 1 Username & Badges */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm md:text-base font-black text-white truncate max-w-[120px] sm:max-w-[150px]">
                {p1Name}
              </span>
              {isP1Me && (
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                  {language === 'ar' ? 'أنت' : 'YOU'}
                </span>
              )}
              {isP1Leading && !isFinal && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  <span className="hidden xs:inline">{language === 'ar' ? 'متصدر' : 'LEADER'}</span>
                </span>
              )}
              {isP1Winner && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black flex items-center gap-0.5 shadow">
                  <Trophy className="w-2.5 h-2.5" />
                  <span>{language === 'ar' ? 'الفائز' : 'WINNER'}</span>
                </span>
              )}
            </div>

            {/* Score directly beneath Player 1's name */}
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-xl sm:text-3xl font-black font-mono tabular-nums leading-none ${
                  isP1Leading ? 'text-amber-400' : 'text-white'
                }`}
              >
                {p1Goals}
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                {p1Points} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </span>
            </div>

            <div className="text-[10px] text-slate-400 font-medium truncate">
              {language === 'ar'
                ? `${p1Goals} أهداف صحيحة`
                : `${p1Goals} correct / goals`}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: LIVE SCOREBOARD / TIMER / DRAW INDICATOR */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-3 text-center shrink-0">
          {/* Big Digital Score Display */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-950/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-slate-700/80 shadow-inner">
            <span
              className={`text-2xl sm:text-4xl font-black font-mono tabular-nums ${
                isP1Leading ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-white'
              }`}
            >
              {p1Goals}
            </span>
            <span className="text-slate-600 font-mono text-xl sm:text-3xl font-black">:</span>
            <span
              className={`text-2xl sm:text-4xl font-black font-mono tabular-nums ${
                isP2Leading ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-white'
              }`}
            >
              {p2Goals}
            </span>
          </div>

          {/* Draw or Leading status indicator */}
          <div className="mt-1">
            {isTied ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] sm:text-[11px] font-black shadow">
                <span>⚖️</span>
                <span>{language === 'ar' ? 'تعادل' : 'TIED'}</span>
              </span>
            ) : isP1Leading ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                <span>◀</span>
                <span className="hidden sm:inline">{language === 'ar' ? 'اللاعب 1 يتقدم' : 'P1 Leads'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                <span className="hidden sm:inline">{language === 'ar' ? 'اللاعب 2 يتقدم' : 'P2 Leads'}</span>
                <span>▶</span>
              </span>
            )}
          </div>

          {/* Synchronized Countdown Timer (during active match) */}
          {showTimer && timeLeft !== undefined && (
            <div className="mt-1.5 flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center font-mono font-black text-sm sm:text-lg transition-all shadow-md ${timerStyle}`}
              >
                {timeLeft}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {language === 'ar' ? 'ثانية' : 'sec'}
              </span>
            </div>
          )}

          {/* Points summary line */}
          <div className="mt-1 text-[10px] font-mono text-slate-400 hidden sm:block">
            {p1Points} pts <span className="text-slate-600">vs</span> {p2Points} pts
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PLAYER 2 */}
        {/* ========================================================================= */}
        <div
          className={`flex items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl transition-all ${
            isP2Leading || isP2Winner
              ? 'bg-amber-500/10 border border-amber-500/40 ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border border-slate-800'
          }`}
        >
          <div className="overflow-hidden min-w-0 flex-1 text-right">
            {/* Player 2 Username & Badges */}
            <div className="flex items-center justify-end gap-1 sm:gap-1.5 flex-wrap">
              {isP2Winner && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black flex items-center gap-0.5 shadow">
                  <Trophy className="w-2.5 h-2.5" />
                  <span>{language === 'ar' ? 'الفائز' : 'WINNER'}</span>
                </span>
              )}
              {isP2Leading && !isFinal && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  <span className="hidden xs:inline">{language === 'ar' ? 'متصدر' : 'LEADER'}</span>
                </span>
              )}
              {isP2Me && (
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                  {language === 'ar' ? 'أنت' : 'YOU'}
                </span>
              )}
              <span className="text-xs sm:text-sm md:text-base font-black text-white truncate max-w-[120px] sm:max-w-[150px]">
                {p2Name}
              </span>
            </div>

            {/* Score directly beneath Player 2's name */}
            <div className="mt-1 flex items-baseline justify-end gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                <span className="text-[10px] text-slate-400 font-normal">pts </span>
                {p2Points}
              </span>
              <span
                className={`text-xl sm:text-3xl font-black font-mono tabular-nums leading-none ${
                  isP2Leading ? 'text-amber-400' : 'text-white'
                }`}
              >
                {p2Goals}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 font-medium truncate text-right">
              {language === 'ar'
                ? `${p2Goals} أهداف صحيحة`
                : `${p2Goals} correct / goals`}
            </div>
          </div>

          <FootballAvatar
            player={player2}
            size="md"
            isLeading={isP2Leading && !isFinal}
            isWinner={isP2Winner}
            isCurrent={isP2Me}
            hasAnswered={player2?.hasAnsweredCurrent}
            side="right"
          />
        </div>
      </div>
    </div>
  );
};
