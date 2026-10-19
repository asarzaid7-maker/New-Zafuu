import React from 'react';
import { Trophy, Settings, User, Coins, Target, Gift } from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { AVATAR_OPTIONS } from '../data/avatars';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile;
  activeView: 'lobby' | 'penalty' | 'trophies';
  onNavigate: (view: 'lobby' | 'penalty' | 'trophies') => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onClaimDailyBonus: () => void;
  canClaimBonus: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  user,
  activeView,
  onNavigate,
  onOpenProfile,
  onOpenSettings,
  onClaimDailyBonus,
  canClaimBonus,
}) => {
  const t = getTranslation(language);
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#070d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('lobby')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">⚽</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              ZaFoot
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 -mt-1">
              Quiz Arena
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('lobby')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeView === 'lobby'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.play}
          </button>

          <button
            onClick={() => onNavigate('penalty')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeView === 'penalty'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>{t.getFreeCoins}</span>
          </button>

          <button
            onClick={() => onNavigate('trophies')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeView === 'trophies'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.leaderboard}</span>
          </button>

          {canClaimBonus && (
            <button
              onClick={onClaimDailyBonus}
              className="flex items-center gap-1.5 whitespace-nowrap text-amber-300 hover:text-amber-200 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all animate-pulse"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t.claimBonus}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Coins, Language, Profile, Settings) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Coins Badge */}
          <div
            onClick={() => onNavigate('penalty')}
            title="Click to earn more coins in Penalty Shootout!"
            className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-extrabold tabular-nums tracking-tight text-white">
              {user.coins}
            </span>
            <span className="text-xs text-amber-300/80 hidden sm:inline font-medium">
              {t.coins}
            </span>
          </div>

          {/* Quick Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            title="Switch Language / تغيير اللغة"
          >
            {language === 'en' ? 'العربية' : 'EN'}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all text-xs font-medium"
            title={t.profile}
          >
            <span className="text-sm leading-none">{currentAvatar.emoji}</span>
            <span className="max-w-[70px] sm:max-w-[90px] truncate hidden xs:inline">
              {user.username}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Action Strip */}
      <div className="md:hidden flex items-center justify-around pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => onNavigate('lobby')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'lobby' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <span>⚽</span> {t.play}
        </button>
        <button
          onClick={() => onNavigate('penalty')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'penalty' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-emerald-400" /> {t.getFreeCoins}
        </button>
        <button
          onClick={() => onNavigate('trophies')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'trophies' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> {t.leaderboard}
        </button>
      </div>
    </header>
  );
};
