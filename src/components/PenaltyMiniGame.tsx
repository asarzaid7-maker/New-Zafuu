import React, { useState } from 'react';
import { Target, RotateCcw, ArrowRight, ArrowLeft, Coins, Award, Sparkles, Volume2, Shield } from 'lucide-react';
import { Language } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface PenaltyMiniGameProps {
  language: Language;
  onEarnCoins: (amount: number) => void;
  onBackToLobby: () => void;
}

type ShotTarget = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface ShotRecord {
  target: ShotTarget;
  result: 'GOAL' | 'SAVED';
}

export const PenaltyMiniGame: React.FC<PenaltyMiniGameProps> = ({
  language,
  onEarnCoins,
  onBackToLobby,
}) => {
  const t = getTranslation(language);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [goalsScored, setGoalsScored] = useState(0);
  const [shotHistory, setShotHistory] = useState<ShotRecord[]>([]);
  const [lastResult, setLastResult] = useState<'GOAL' | 'SAVED' | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [activeTarget, setActiveTarget] = useState<ShotTarget | null>(null);
  const [keeperDiveTarget, setKeeperDiveTarget] = useState<ShotTarget>('center');
  const [roundOver, setRoundOver] = useState(false);
  const [netShaking, setNetShaking] = useState(false);

  // Ball animation state
  // Default: at penalty spot (bottom center)
  const [ballStyles, setBallStyles] = useState<{
    bottom: string;
    left: string;
    transform: string;
  }>({
    bottom: '16px',
    left: '50%',
    transform: 'translate(-50%, 0) scale(1)',
  });

  // Keeper animation state
  const [keeperStyles, setKeeperStyles] = useState<{
    top: string;
    left: string;
    transform: string;
  }>({
    top: '32%',
    left: '50%',
    transform: 'translate(-50%, 0) scale(1)',
  });

  const targets: {
    id: ShotTarget;
    labelEn: string;
    labelAr: string;
    coordsClass: string;
    ballTarget: { bottom: string; left: string; transform: string };
  }[] = [
    {
      id: 'top-left',
      labelEn: 'Top Left (Upper 90)',
      labelAr: 'الزاوية 90 يسار (مقص)',
      coordsClass: 'top-3 left-4 sm:top-5 sm:left-6',
      ballTarget: {
        bottom: '62%',
        left: '26%',
        transform: 'translate(-50%, 0) scale(0.65) rotate(720deg)',
      },
    },
    {
      id: 'center',
      labelEn: 'Center (Panenka Chip)',
      labelAr: 'بانينكا في الوسط',
      coordsClass: 'top-8 left-1/2 -translate-x-1/2',
      ballTarget: {
        bottom: '56%',
        left: '50%',
        transform: 'translate(-50%, 0) scale(0.68) rotate(540deg)',
      },
    },
    {
      id: 'top-right',
      labelEn: 'Top Right (Top Bins)',
      labelAr: 'الزاوية 90 يمين (مقص)',
      coordsClass: 'top-3 right-4 sm:top-5 sm:right-6',
      ballTarget: {
        bottom: '62%',
        left: '74%',
        transform: 'translate(-50%, 0) scale(0.65) rotate(-720deg)',
      },
    },
    {
      id: 'bottom-left',
      labelEn: 'Bottom Left (Side Netting)',
      labelAr: 'أرضية زاحفة يسار',
      coordsClass: 'bottom-6 left-4 sm:bottom-8 sm:left-6',
      ballTarget: {
        bottom: '38%',
        left: '25%',
        transform: 'translate(-50%, 0) scale(0.65) rotate(600deg)',
      },
    },
    {
      id: 'bottom-right',
      labelEn: 'Bottom Right (Driven)',
      labelAr: 'أرضية زاحفة يمين',
      coordsClass: 'bottom-6 right-4 sm:bottom-8 sm:right-6',
      ballTarget: {
        bottom: '38%',
        left: '75%',
        transform: 'translate(-50%, 0) scale(0.65) rotate(-600deg)',
      },
    },
  ];

  const handleShoot = (target: ShotTarget) => {
    if (isShooting || shotsLeft <= 0 || roundOver) return;

    setIsShooting(true);
    setActiveTarget(target);
    setLastResult(null);

    // Audio: referee whistle + boot impact on leather ball
    sounds.playKick();

    // Keeper AI picks dive direction
    const possibleDives: ShotTarget[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
    const chosenDive = possibleDives[Math.floor(Math.random() * possibleDives.length)];
    setKeeperDiveTarget(chosenDive);

    // Move ball toward chosen target
    const targetConfig = targets.find((t) => t.id === target);
    if (targetConfig) {
      setBallStyles(targetConfig.ballTarget);
    }

    // Move keeper based on chosen dive
    if (chosenDive === 'top-left') {
      setKeeperStyles({
        top: '25%',
        left: '28%',
        transform: 'translate(-50%, 0) scale(0.9) rotate(-22deg)',
      });
    } else if (chosenDive === 'top-right') {
      setKeeperStyles({
        top: '25%',
        left: '72%',
        transform: 'translate(-50%, 0) scale(0.9) rotate(22deg)',
      });
    } else if (chosenDive === 'bottom-left') {
      setKeeperStyles({
        top: '36%',
        left: '26%',
        transform: 'translate(-50%, 0) scale(0.95) rotate(-40deg)',
      });
    } else if (chosenDive === 'bottom-right') {
      setKeeperStyles({
        top: '36%',
        left: '74%',
        transform: 'translate(-50%, 0) scale(0.95) rotate(40deg)',
      });
    } else {
      // Center reaction
      setKeeperStyles({
        top: '28%',
        left: '50%',
        transform: 'translate(-50%, 0) scale(1.05)',
      });
    }

    // Determine shot outcome after flight duration
    setTimeout(() => {
      const isGoal = target !== chosenDive;

      if (isGoal) {
        sounds.playVictory();
        setNetShaking(true);
        setTimeout(() => setNetShaking(false), 900);
        setLastResult('GOAL');
        setGoalsScored((g) => g + 1);
        setShotHistory((prev) => [...prev, { target, result: 'GOAL' }]);
      } else {
        sounds.playSave();
        setLastResult('SAVED');
        setShotHistory((prev) => [...prev, { target, result: 'SAVED' }]);
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
    }, 750);
  };

  const handleNextShotOrReset = () => {
    // Reset positions for next shot
    setBallStyles({
      bottom: '16px',
      left: '50%',
      transform: 'translate(-50%, 0) scale(1)',
    });
    setKeeperStyles({
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, 0) scale(1)',
    });
    setActiveTarget(null);
    setKeeperDiveTarget('center');
    setLastResult(null);
  };

  const handleFullReset = () => {
    sounds.playWhistle();
    setShotsLeft(3);
    setGoalsScored(0);
    setShotHistory([]);
    setRoundOver(false);
    handleNextShotOrReset();
  };

  const totalReward = goalsScored * 10;

  // Decide which goalkeeper image asset to render:
  // In ready stance or center: real_goalkeeper_ready
  // When diving left or right: real_goalkeeper_dive
  const isDivingHorizontal = isShooting && (keeperDiveTarget === 'top-left' || keeperDiveTarget === 'top-right' || keeperDiveTarget === 'bottom-left' || keeperDiveTarget === 'bottom-right');
  const isDivingLeft = keeperDiveTarget === 'top-left' || keeperDiveTarget === 'bottom-left';

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 animate-fadeIn">
      {/* Stadium Header HUD */}
      <div className="bg-[#0b131e]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🏟️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {language === 'ar' ? 'ملعب سانتياغو برنابيو' : 'BERNABÉU ARENA'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                {language === 'ar' ? '82,000 مشجع في المدرجات' : '82,000 FANS LIVE'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {t.penaltyTitle}
            </h2>
          </div>
        </div>

        {/* Shootout Rounds Tracker */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-semibold mr-1">
              {language === 'ar' ? 'الركلات:' : 'Penalties:'}
            </span>
            {[0, 1, 2].map((idx) => {
              const record = shotHistory[idx];
              if (!record) {
                return (
                  <span
                    key={idx}
                    className="w-5 h-5 rounded-full border border-slate-600 bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold"
                  >
                    {idx + 1}
                  </span>
                );
              }
              return (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                    record.result === 'GOAL'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                  title={record.result === 'GOAL' ? 'Goal' : 'Saved'}
                >
                  {record.result === 'GOAL' ? '✓' : '✗'}
                </span>
              );
            })}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-black text-amber-300 tabular-nums">
              +{goalsScored * 10} {language === 'ar' ? 'عملة' : 'Coins'}
            </span>
          </div>
        </div>
      </div>

      {/* Real Stadium Shootout Arena */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-black shadow-2xl h-[420px] sm:h-[480px] flex flex-col justify-between select-none">
        {/* Real Stadium Image Backdrop */}
        <img
          src="/src/assets/images/penalty_stadium_arena_1792513771355.jpg"
          alt="Real Football Stadium during Penalty Shootout"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-bottom filter contrast-105 brightness-95"
        />

        {/* Cinematic Atmospheric Vignette & Floodlight Flare */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

        {/* Stadium Top Bar Overlay */}
        <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-3 text-xs text-white/80 font-bold pointer-events-none">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'الحارس العملاق: كورتوا (تقييم 92)' : 'GOALKEEPER: COURTOIS • 92 GK'}</span>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-amber-300">
            {language === 'ar' ? `المتبقي: ${shotsLeft} ركلات` : `${shotsLeft} Shots Left`}
          </div>
        </div>

        {/* Realistic Goal Frame & Net Area */}
        <div
          className={`absolute inset-x-4 sm:inset-x-12 top-[12%] sm:top-[14%] h-56 sm:h-64 z-10 transition-transform ${
            netShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
          }`}
        >
          {/* Goal Posts Outline (Top Crossbar + Left & Right Uprights) */}
          <div className="w-full h-full relative rounded-t-lg border-t-8 border-x-8 border-white/95 shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-emerald-950/20 backdrop-blur-[0.5px]">
            {/* Hexagonal / Diamond Net Texture Grid */}
            <div
              className="w-full h-full opacity-25"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #fff, #fff 1.5px, transparent 1.5px, transparent 18px), repeating-linear-gradient(90deg, #fff, #fff 1.5px, transparent 1.5px, transparent 18px)',
              }}
            />

            {/* Depth Net Shadow & Stadium Floodlight Glare */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Real Goalkeeper Component inside Goal */}
          <div
            style={{
              top: keeperStyles.top,
              left: keeperStyles.left,
              transform: keeperStyles.transform,
            }}
            className="absolute z-20 transition-all duration-700 ease-out pointer-events-none flex flex-col items-center"
          >
            {/* Goalkeeper Shadow on Turf */}
            <div className="w-24 sm:w-32 h-4 bg-black/70 rounded-full blur-[3px] -mb-3 z-0" />

            {/* Real Goalkeeper Photo Asset */}
            <div className="relative z-10 group">
              <div className="w-28 h-36 sm:w-36 sm:h-44 md:w-40 md:h-48 overflow-hidden rounded-2xl border-2 border-emerald-400/60 shadow-[0_12px_32px_rgba(0,0,0,0.9)] bg-slate-950/80 backdrop-blur-sm">
                <img
                  src={
                    isDivingHorizontal
                      ? '/src/assets/images/real_goalkeeper_dive_1792513771960.jpg'
                      : '/src/assets/images/real_goalkeeper_ready_1792513772711.jpg'
                  }
                  alt="Real Professional Goalkeeper"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-top filter contrast-110 brightness-100 transition-transform duration-300 ${
                    isDivingHorizontal && isDivingLeft ? 'scale-x-[-1]' : ''
                  }`}
                />
              </div>

              {/* Goalkeeper Name & Reflex Badge */}
              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span className="text-[9px] font-black tracking-wider uppercase bg-slate-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-lg">
                  {isShooting ? (lastResult === 'SAVED' ? '🧤 SAVED!' : '⚡ DIVING') : '🧤 READY'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Target Crosshairs Inside Goal */}
          {!isShooting && !roundOver && (
            <div className="absolute inset-0 z-30">
              {targets.map((tgt) => (
                <button
                  key={tgt.id}
                  onClick={() => handleShoot(tgt.id)}
                  className={`absolute ${tgt.coordsClass} group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95`}
                  title={language === 'ar' ? tgt.labelAr : tgt.labelEn}
                >
                  {/* Glowing Target Ring Reticle */}
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-white/60 group-hover:border-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/25 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-lg transition-all">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-emerald-300 transition-colors" />
                  </div>
                  {/* Target Label Pill */}
                  <span className="mt-1 text-[9px] sm:text-[10px] font-bold text-white bg-black/75 px-2 py-0.5 rounded-full border border-white/20 group-hover:border-emerald-400 group-hover:text-emerald-300 transition-all opacity-80 group-hover:opacity-100 whitespace-nowrap shadow">
                    {language === 'ar' ? tgt.labelAr : tgt.labelEn}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real Soccer Ball Element on Pitch */}
        <div
          style={{
            bottom: ballStyles.bottom,
            left: ballStyles.left,
            transform: ballStyles.transform,
          }}
          className="absolute z-25 transition-all duration-700 ease-out pointer-events-none flex flex-col items-center"
        >
          {/* Ball Shadow on Grass */}
          <div className="w-8 sm:w-10 h-3 bg-black/80 rounded-full blur-[2px] -mb-1" />
          {/* 3D Soccer Ball */}
          <div className="text-3xl sm:text-4xl filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
            ⚽
          </div>
        </div>

        {/* Result Overlay Banner (GOAL! or SAVED!) */}
        {lastResult && (
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-sm pointer-events-none animate-fadeIn">
            <div
              className={`px-8 py-4 rounded-3xl text-2xl sm:text-4xl font-black shadow-2xl border-2 flex flex-col items-center gap-1.5 animate-bounce ${
                lastResult === 'GOAL'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-rose-600 to-red-700 text-white border-rose-300 shadow-rose-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lastResult === 'GOAL' ? '⚽' : '🧤'}</span>
                <span>{lastResult === 'GOAL' ? t.scoreGoal : t.saved}</span>
              </div>
              <span className="text-xs sm:text-sm font-bold opacity-90">
                {lastResult === 'GOAL'
                  ? (language === 'ar' ? '+10 عملات في رصيدك!' : '+10 Coins Earned!')
                  : (language === 'ar' ? 'تصدى الحارس العملاق لتسديدتك!' : 'Courtois stopped the shot with a flying dive!')}
              </span>
            </div>
          </div>
        )}

        {/* Penalty Spot & Pitch Turf Markings */}
        <div className="relative z-10 w-full pb-4 px-6 flex items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{language === 'ar' ? 'نقطة الجزاء الرسمية (11 متراً)' : 'Penalty Spot (11 Meters)'}</span>
          </div>

          {!isShooting && !roundOver && (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold animate-pulse">
              {language === 'ar' ? '🎯 انقر على أي زاوية في المرمى للتسديد' : '🎯 Tap any target in the goal to strike!'}
            </div>
          )}

          {lastResult && !roundOver && (
            <button
              onClick={handleNextShotOrReset}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-full text-xs shadow-lg active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              {language === 'ar' ? 'الركلة التالية ➔' : 'Next Shot ➔'}
            </button>
          )}
        </div>
      </div>

      {/* End of Round Summary or Quick Navigation */}
      {roundOver ? (
        <div className="bg-[#0e1724] border border-emerald-500/40 p-6 rounded-2xl text-center space-y-4 shadow-xl animate-fadeIn">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ar' ? 'انتهت حصة ركلات الترجيح!' : 'Shootout Training Complete!'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {language === 'ar'
                ? `سجلت ${goalsScored} من 3 ركلات في شباك الحارس وربحت +${totalReward} عملة!`
                : `You scored ${goalsScored} of 3 penalties against the goalkeeper and earned +${totalReward} Coins!`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleFullReset}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'سدد جولة أخرى (3 ركلات)' : 'Take Another Round (3 Shots)'}</span>
            </button>
            <button
              onClick={onBackToLobby}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'العودة للمسابقات والمباريات' : 'Return to Match Tunnel'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400 px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ar'
                ? 'كل هدف تسجله يمنحك +10 عملات لمواصلة لعب كويز التحدي!'
                : 'Every goal scores you +10 instant coins to keep playing quiz matches!'}
            </span>
          </div>
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
