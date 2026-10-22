import React from 'react';
import { Trophy, Settings, Coins, Gift, GitCommit, Bot } from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { AVATAR_OPTIONS } from '../data/avatars';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile;
  activeView: 'lobby' | 'trophies' | 'careerChallenge' | 'aiChat';
  onNavigate: (view: 'lobby' | 'trophies' | 'careerChallenge' | 'aiChat') => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onClaimDailyBonus: () => void;
  onOpenCoinShop: () => void;
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
  onOpenCoinShop,
  canClaimBonus,
}) => {
  const t = getTranslation(language);
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#070d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark & Logo */}
        <button
          onClick={() => onNavigate('lobby')}
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform bg-[#09111c] shrink-0">
            <img
              src="/assets/aistudio/360_F_332687153_gmsohq86koOEWFYlYSI3N6xzb1zIcG88_cb9e53eb.jpg"
              alt="ZaFoot Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              ZaFoot
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 -mt-1">
              Football Arena
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('lobby')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              activeView === 'lobby'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.play}
          </button>

          {/* Career Path Challenge Link */}
          <button
            onClick={() => onNavigate('careerChallenge')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              activeView === 'careerChallenge'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'مسيرة اللاعبين' : 'Career Path'}</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
              New
            </span>
          </button>

          {/* ZaFoot AI Assistant Link */}
          <button
            onClick={() => onNavigate('aiChat')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              activeView === 'aiChat'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'زافوت AI' : 'ZaFoot AI'}</span>
            <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase shadow-xs">
              Gemini
            </span>
          </button>

          <button
            onClick={() => onNavigate('trophies')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              activeView === 'trophies'
                ? 'border-emerald-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.leaderboard}</span>
          </button>

          <button
            onClick={onOpenCoinShop}
            className="flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 border-transparent text-amber-300 hover:text-amber-200 transition-colors font-semibold cursor-pointer"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'متجر العملات' : 'Coin Shop'}</span>
          </button>

          {canClaimBonus && (
            <button
              onClick={onClaimDailyBonus}
              className="flex items-center gap-1.5 whitespace-nowrap text-amber-300 hover:text-amber-200 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all animate-pulse cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t.claimBonus}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Coins, Language, Profile, Settings) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Coins Badge / Button to Buy Coins */}
          <button
            onClick={onOpenCoinShop}
            type="button"
            title={language === 'ar' ? 'انقر لشراء العملات (1000، 5000، 10000)' : 'Click to buy coins (1000, 5000, 10000)'}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-amber-500/20 border border-amber-500/50 hover:border-amber-400 text-amber-300 px-3 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm group"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-sm font-extrabold tabular-nums tracking-tight text-white">
              {user.coins.toLocaleString()}
            </span>
            <span className="text-xs text-amber-300/80 hidden sm:inline font-medium">
              {t.coins}
            </span>
            <span className="ml-0.5 text-[11px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md leading-tight shrink-0 shadow-sm">
              +
            </span>
          </button>

          {/* Quick Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            title="Switch Language / تغيير اللغة"
          >
            {language === 'en' ? 'العربية' : 'EN'}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all text-xs font-medium cursor-pointer"
            title={t.profile}
          >
            {user.customPhoto ? (
              <img
                src={user.customPhoto}
                alt={user.username}
                className="w-5 h-5 rounded-md object-cover border border-emerald-400/60 shrink-0"
              />
            ) : (
              <span className="text-sm leading-none">{currentAvatar.emoji}</span>
            )}
            <span className="max-w-[70px] sm:max-w-[90px] truncate hidden xs:inline">
              {user.username}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors cursor-pointer"
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
          className={`flex items-center gap-1 font-semibold cursor-pointer ${
            activeView === 'lobby' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <span>⚽</span> {t.play}
        </button>
        <button
          onClick={() => onNavigate('careerChallenge')}
          className={`flex items-center gap-1 font-semibold cursor-pointer ${
            activeView === 'careerChallenge' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5 text-amber-400" /> {language === 'ar' ? 'المسيرة' : 'Careers'}
        </button>
        <button
          onClick={() => onNavigate('aiChat')}
          className={`flex items-center gap-1 font-semibold cursor-pointer ${
            activeView === 'aiChat' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" /> {language === 'ar' ? 'زافوت AI' : 'AI'}
        </button>
        <button
          onClick={onOpenCoinShop}
          className="flex items-center gap-1 font-semibold text-amber-300 cursor-pointer"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" /> {language === 'ar' ? 'المتجر' : 'Shop'}
        </button>
        <button
          onClick={() => onNavigate('trophies')}
          className={`flex items-center gap-1 font-semibold cursor-pointer ${
            activeView === 'trophies' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> {t.leaderboard}
        </button>
      </div>
    </header>
  );
};
