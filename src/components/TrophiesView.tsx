import React from 'react';
import {
  Trophy,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Coins,
  Play,
  Flame,
} from 'lucide-react';
import { UserProfile, Language } from '../types/quiz';
import { getTranslation } from '../data/translations';

interface TrophiesViewProps {
  user: UserProfile;
  language: Language;
  onBackToLobby: () => void;
  onPlayTrophyMatch: () => void;
}

export const TrophiesView: React.FC<TrophiesViewProps> = ({
  user,
  language,
  onBackToLobby,
  onPlayTrophyMatch,
}) => {
  const t = getTranslation(language);
  const canAffordTrophyMatch = user.coins >= 150;

  const trophiesList = [
    {
      id: 'first_win',
      icon: '🏆',
      title: t.firstWinTrophy,
      desc: t.firstWinDesc,
      unlocked: user.quizzesWon >= 1,
      badge: 'Level 1',
    },
    {
      id: 'centurion',
      icon: '💯',
      title: t.centurionTrophy,
      desc: t.centurionDesc,
      unlocked: user.correctAnswers >= 50,
      badge: '50 Qs',
    },
    {
      id: 'hardcore',
      icon: '🧠',
      title: t.hardcoreTrophy,
      desc: t.hardcoreDesc,
      unlocked: user.trophies.includes('hardcore'),
      badge: '30 Qs Hard',
    },
    {
      id: 'world_cup',
      icon: '🌍',
      title: t.worldCupTrophy,
      desc: t.worldCupDesc,
      unlocked: user.trophies.includes('world_cup'),
      badge: 'FIFA World Cup',
    },
    {
      id: 'wealth',
      icon: '💰',
      title: t.wealthTrophy,
      desc: t.wealthDesc,
      unlocked: user.coins >= 150,
      badge: '150+ Coins',
    },
    {
      id: 'grand_champion',
      icon: '👑',
      title: language === 'ar' ? 'بطل خزانة الكؤوس' : 'Trophy Room Champion',
      desc:
        language === 'ar'
          ? 'الفوز في بطولة خزانة الكؤوس الكبرى (تحدي الـ 150 عملة).'
          : 'Win the Grand Trophy Room Championship match (150 Coins challenge).',
      unlocked: user.trophies.includes('grand_champion'),
      badge: 'Grand Final',
    },
  ];

  const unlockedCount = trophiesList.filter((tr) => tr.unlocked).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.trophyCabinet}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'ar' ? 'خزانة الكؤوس والألقاب' : 'The ZaFoot Hall of Fame'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'ar'
              ? `لقد فتحت ${unlockedCount} من أصل ${trophiesList.length} كؤوس وإنجازات كروية.`
              : `You have unlocked ${unlockedCount} of ${trophiesList.length} prestigious football trophies.`}
          </p>
        </div>

        <button
          onClick={onBackToLobby}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>{language === 'ar' ? 'العودة للمباريات' : 'Return to Match Lobby'}</span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* FEATURED: Play Trophy Room with 150 Coins Challenge */}
      <div className="relative rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-[#1d1708] via-[#151d28] to-[#0d1622] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/30 shrink-0">
              <img
                src="/src/assets/images/zafoot_trophy_cup_1792423866211.jpg"
                alt="Champions Trophy Cup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'ar' ? 'التحدي الأسطوري الكبير' : 'Legendary Cup Match'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.trophyMatchTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {t.trophyMatchDesc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="bg-black/50 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                  {t.cost}: <strong className="text-amber-300">150 🪙</strong>
                </span>
                <span className="bg-black/50 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                  {t.reward}: <strong className="text-emerald-400 font-extrabold">+300 🪙</strong>
                </span>
                <span className="bg-black/50 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                  {language === 'ar' ? '20 سؤالاً من جميع البطولات' : '20 All-Star Questions'}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {canAffordTrophyMatch ? (
              <button
                onClick={onPlayTrophyMatch}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm sm:text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t.playTrophyMatch}</span>
              </button>
            ) : (
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 rounded-lg">
                  {t.need150Coins} ({user.coins} / 150 🪙)
                </div>
                <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (user.coins / 150) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trophies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trophiesList.map((tr) => (
          <div
            key={tr.id}
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              tr.unlocked
                ? 'border-amber-500/50 bg-gradient-to-b from-[#181a14] to-[#0e1724] shadow-lg shadow-amber-500/10'
                : 'border-slate-800/80 bg-[#0a111a] opacity-50'
            }`}
          >
            {/* Glow */}
            {tr.unlocked && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                {tr.icon}
              </div>

              {tr.unlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تم تحقيقه' : 'Unlocked'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  <span>{language === 'ar' ? 'مغلق' : 'Locked'}</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {tr.badge}
              </span>
              <h3 className="text-base font-bold text-white">{tr.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tr.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
