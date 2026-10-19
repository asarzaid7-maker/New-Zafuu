import React, { useState } from 'react';
import { Target, RotateCcw, ArrowRight, ArrowLeft, Coins, Award } from 'lucide-react';
import { Language } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface PenaltyMiniGameProps {
  language: Language;
  onEarnCoins: (amount: number) => void;
  onBackToLobby: () => void;
}

type ShotTarget = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export const PenaltyMiniGame: React.FC<PenaltyMiniGameProps> = ({
  language,
  onEarnCoins,
  onBackToLobby,
}) => {
  const t = getTranslation(language);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [goalsScored, setGoalsScored] = useState(0);
  const [lastResult, setLastResult] = useState<'GOAL' | 'SAVED' | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [ballPosition, setBallPosition] = useState<string>('bottom-10 left-1/2 -translate-x-1/2');
  const [keeperPosition, setKeeperPosition] = useState<string>('top-16 left-1/2 -translate-x-1/2');
  const [roundOver, setRoundOver] = useState(false);

  const targets: { id: ShotTarget; label: string; coords: string }[] = [
    { id: 'top-left', label: t.targetTopLeft, coords: 'top-8 left-8' },
    { id: 'top-right', label: t.targetTopRight, coords: 'top-8 right-8' },
    { id: 'center', label: t.targetCenter, coords: 'top-16 left-1/2 -translate-x-1/2' },
    { id: 'bottom-left', label: t.targetBottomLeft, coords: 'bottom-20 left-8' },
    { id: 'bottom-right', label: t.targetBottomRight, coords: 'bottom-20 right-8' },
  ];

  const handleShoot = (target: ShotTarget) => {
    if (isShooting || shotsLeft <= 0 || roundOver) return;

    setIsShooting(true);
    setLastResult(null);

    // Keeper picks a dive direction randomly
    const keeperChoices: ShotTarget[] = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'center',
    ];
    const keeperDive = keeperChoices[Math.floor(Math.random() * keeperChoices.length)];

    // Animate keeper
    if (keeperDive === 'top-left') setKeeperPosition('top-8 left-12');
    else if (keeperDive === 'top-right') setKeeperPosition('top-8 right-12');
    else if (keeperDive === 'bottom-left') setKeeperPosition('bottom-16 left-12');
    else if (keeperDive === 'bottom-right') setKeeperPosition('bottom-16 right-12');
    else setKeeperPosition('top-16 left-1/2 -translate-x-1/2');

    // Animate ball towards target
    if (target === 'top-left') setBallPosition('top-10 left-12 scale-75');
    else if (target === 'top-right') setBallPosition('top-10 right-12 scale-75');
    else if (target === 'bottom-left') setBallPosition('bottom-20 left-12 scale-75');
    else if (target === 'bottom-right') setBallPosition('bottom-20 right-12 scale-75');
    else setBallPosition('top-16 left-1/2 -translate-x-1/2 scale-75');

    setTimeout(() => {
      // Determine if goal or save
      const isGoal = target !== keeperDive;

      if (isGoal) {
        sounds.playVictory();
        setLastResult('GOAL');
        setGoalsScored((g) => g + 1);
      } else {
        sounds.playWrong();
        setLastResult('SAVED');
      }

      setShotsLeft((s) => {
        const remaining = s - 1;
        if (remaining <= 0) {
          setRoundOver(true);
          const earned = (goalsScored + (isGoal ? 1 : 0)) * 10;
          if (earned > 0) {
            onEarnCoins(earned);
          }
        }
        return remaining;
      });

      setIsShooting(false);
    }, 800);
  };

  const handleResetRound = () => {
    sounds.playWhistle();
    setShotsLeft(3);
    setGoalsScored(0);
    setLastResult(null);
    setRoundOver(false);
    setBallPosition('bottom-10 left-1/2 -translate-x-1/2');
    setKeeperPosition('top-16 left-1/2 -translate-x-1/2');
  };

  const totalReward = goalsScored * 10;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Title & HUD */}
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>⚽</span>
            <span>{t.penaltyTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.penaltyDesc}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            {language === 'ar' ? 'الركلات المتبقية:' : 'Shots Remaining:'}{' '}
            <strong className="text-amber-400 tabular-nums">{shotsLeft}</strong>
          </div>
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            {language === 'ar' ? 'الأهداف:' : 'Goals:'}{' '}
            <strong className="text-emerald-400 tabular-nums">{goalsScored} / 3</strong>
          </div>
        </div>
      </div>

      {/* Penalty Goal Arena View */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#091e13] shadow-2xl h-80 sm:h-96 flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Goal Frame & Net Background */}
        <div className="absolute inset-x-8 sm:inset-x-16 top-6 h-48 sm:h-56 border-t-8 border-x-8 border-white/90 rounded-t-lg bg-emerald-950/40 shadow-inner">
          {/* Net texture grid */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 16px)',
            }}
          />
        </div>

        {/* Goalkeeper Element */}
        <div
          className={`absolute transition-all duration-500 text-4xl sm:text-5xl ${keeperPosition} z-10 flex flex-col items-center pointer-events-none`}
        >
          <span>🧤</span>
          <span className="text-[10px] font-black uppercase text-amber-300 bg-black/60 px-1 rounded -mt-1">
            Keeper
          </span>
        </div>

        {/* Ball Element */}
        <div
          className={`absolute transition-all duration-700 ${ballPosition} z-20 pointer-events-none text-3xl sm:text-4xl filter drop-shadow-lg`}
        >
          ⚽
        </div>

        {/* Target Buttons Overlay on Goal */}
        {!isShooting && !roundOver && (
          <div className="absolute inset-x-8 sm:inset-x-16 top-6 h-48 sm:h-56 z-30 grid grid-cols-3 grid-rows-2 gap-2 p-3">
            <button
              onClick={() => handleShoot('top-left')}
              className="border border-white/20 hover:border-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer"
            >
              ↖ {language === 'ar' ? 'زاوية 90 يسار' : 'Top Left'}
            </button>
            <button
              onClick={() => handleShoot('center')}
              className="border border-white/20 hover:border-amber-400 hover:bg-amber-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer"
            >
              ⬆ {language === 'ar' ? 'بانينكا وسط' : 'Panenka'}
            </button>
            <button
              onClick={() => handleShoot('top-right')}
              className="border border-white/20 hover:border-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer"
            >
              ↗ {language === 'ar' ? 'زاوية 90 يمين' : 'Top Right'}
            </button>
            <button
              onClick={() => handleShoot('bottom-left')}
              className="border border-white/20 hover:border-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer"
            >
              ↙ {language === 'ar' ? 'أرضية يسار' : 'Bottom Left'}
            </button>
            <div />
            <button
              onClick={() => handleShoot('bottom-right')}
              className="border border-white/20 hover:border-emerald-400 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer"
            >
              ↘ {language === 'ar' ? 'أرضية يمين' : 'Bottom Right'}
            </button>
          </div>
        )}

        {/* Feedback Banner (GOOOAL / SAVED) */}
        {lastResult && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-40 animate-bounce pointer-events-none">
            <div
              className={`px-6 py-2.5 rounded-2xl text-xl sm:text-2xl font-black shadow-2xl border ${
                lastResult === 'GOAL'
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-rose-600 text-white border-rose-400'
              }`}
            >
              {lastResult === 'GOAL' ? t.scoreGoal : t.saved}
            </div>
          </div>
        )}

        {/* Grass Pitch Markings */}
        <div className="relative z-10 flex justify-between items-end w-full text-xs text-white/50 pt-48 sm:pt-56">
          <div className="w-16 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
          <div className="text-center font-bold text-emerald-300/80 bg-black/40 px-3 py-1 rounded-full border border-emerald-500/30">
            {language === 'ar' ? 'نقطة الجزاء (11 متراً)' : 'Penalty Spot (11m)'}
          </div>
          <div className="w-16 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
        </div>
      </div>

      {/* End of Round Summary or Controls */}
      {roundOver ? (
        <div className="bg-[#0e1724] border border-emerald-500/40 p-6 rounded-2xl text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>{language === 'ar' ? 'انتهت حصة ركلات الترجيح!' : 'Shootout Complete!'}</span>
          </h3>

          <p className="text-sm text-slate-300">
            {language === 'ar'
              ? `سجلت ${goalsScored} من 3 ركلات وحصلت على ${totalReward} عملة!`
              : `You scored ${goalsScored} of 3 penalties and claimed +${totalReward} Coins!`}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetRound}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'سدد جولة أخرى' : 'Take Another Round'}</span>
            </button>
            <button
              onClick={onBackToLobby}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'العودة للمباريات' : 'Play Main Quiz'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>{language === 'ar' ? 'انقر على أي زاوية في المرمى للتسديد' : 'Tap any target area inside the net to shoot'}</span>
          <button
            onClick={onBackToLobby}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            {t.backToLobby}
          </button>
        </div>
      )}
    </div>
  );
};
