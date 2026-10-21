import React from 'react';
import { Play, Sparkles, Coins, Trophy, Flame, AlertCircle } from 'lucide-react';
import { CategoryId, DifficultyLevel, Language, UserProfile } from '../types/quiz';
import { CATEGORIES_META, DIFFICULTY_CONFIG } from '../data/questions';
import { getTranslation } from '../data/translations';

interface LobbyProps {
  language: Language;
  user: UserProfile;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  onStartQuiz: () => void;
  onOpenCoinShop: () => void;
  onPlayCareerChallenge: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  language,
  user,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  onStartQuiz,
  onOpenCoinShop,
  onPlayCareerChallenge,
}) => {
  const t = getTranslation(language);
  const diffConfig = DIFFICULTY_CONFIG[selectedDifficulty] || DIFFICULTY_CONFIG.easy;
  const userCoins = user?.coins ?? 0;
  const hasEnoughCoins = userCoins >= (diffConfig?.cost ?? 10);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
      {/* Hero Showcase Area (No Picture) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-br from-[#0c1828] via-[#08101a] to-[#04080e] p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative stadium pitch radial lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight text-balance">
            {language === 'ar' ? (
              <>
                اختبر معلوماتك الكروية في <span className="text-emerald-400">زافوت</span>
              </>
            ) : (
              <>
                Test Your Football IQ in <span className="text-emerald-400">ZaFoot</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {language === 'ar'
              ? 'اختر بطولتك المفضلة، حدد مستوى التحدي، وادخل المستطيل الأخضر للفوز بالعملات والتتويج بالكؤوس!'
              : 'Choose your competition, select match intensity, and step onto the pitch to win coins and conquer the football trivia world!'}
          </p>

          {/* Quick Economy Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-emerald-400 font-bold">{language === 'ar' ? 'السهل:' : 'Easy:'}</span>
              <span className="text-white font-bold tabular-nums">10 🪙 ➔ +20 🪙</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-amber-400 font-bold">{language === 'ar' ? 'المتوسط:' : 'Medium:'}</span>
              <span className="text-white font-bold tabular-nums">20 🪙 ➔ +40 🪙</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-rose-400 font-bold">{language === 'ar' ? 'الصعب:' : 'Hard:'}</span>
              <span className="text-white font-bold tabular-nums">30 🪙 ➔ +60 🪙</span>
            </div>

            <button
              onClick={onPlayCareerChallenge}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer ml-auto"
            >
              <span>🧭</span>
              <span>{language === 'ar' ? 'تحدي مسيرة اللاعبين ➔' : 'Career Challenge ➔'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Special Mode: Career Path Challenge */}
      <section className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-gradient-to-r from-[#0c1e19] via-[#091522] to-[#08101a] p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/25 shrink-0">
              🧭
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  {language === 'ar' ? 'نمط جديد · مسيرة الأندية' : 'Brand New Mode · Career Transfers'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {language === 'ar' ? 'أساطير ونجوم الكرة العالمية' : 'World Football Legends & Stars'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'ar' ? 'تحدي مسيرة اللاعبين (Career Path)' : 'Football Career Path Challenge'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {language === 'ar'
                  ? 'نعرض لك سلسلة الأندية التي لعب لها النجم طوال مسيرته بالترتيب الزمني الدقيق. خمّن صاحب المسيرة من بين 4 خيارات حقيقية! 3 مستويات صعوبة وجوائز تصل إلى 1,000 عملة.'
                  : 'Guess the mystery player from their actual chronological club transfer history! 4 choices with real photos. 3 difficulty levels and winning rewards up to 1,000 Coins.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="text-center md:text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-400">{language === 'ar' ? 'المكافأة تصل إلى' : 'Rewards up to'}</div>
              <div className="text-lg font-black text-emerald-400 tabular-nums">+1,000 🪙</div>
            </div>
            <button
              onClick={onPlayCareerChallenge}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>🧭</span>
              <span>{language === 'ar' ? 'العب تحدي المسيرة الآن ➔' : 'Play Career Challenge ➔'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. Category Selection Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🏆</span>
              <span>{t.selectCategory}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {language === 'ar'
                ? '6 بطولات عالمية كبرى متاحة للاختبار'
                : '6 major world competitions ready for kick-off'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES_META.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between h-44 sm:h-48 group overflow-hidden ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40'
                    : 'border-slate-800 bg-[#0d1622] hover:border-slate-700 hover:bg-[#121e2e]'
                }`}
              >
                {/* Background ambient gradient */}
                <div
                  className="absolute inset-0 opacity-15 transition-opacity group-hover:opacity-25"
                  style={{
                    background: `radial-gradient(circle at top right, ${cat.accentColor}, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex items-start justify-between w-full">
                  <span className="text-xs font-black tracking-widest px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/10 uppercase">
                    {cat.badgeText}
                  </span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
                  )}
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                    {cat.name[language]}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {cat.description[language]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Difficulty Selection Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>⚡</span>
            <span>{t.selectDifficulty}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'اختر عدد الأسئلة ومدة التحدي الكروي'
              : 'Choose the match length and tactical depth'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Easy: 10 Questions */}
          <button
            onClick={() => onSelectDifficulty('easy')}
            className={`p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
              selectedDifficulty === 'easy'
                ? 'border-emerald-400 bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                : 'border-slate-800 bg-[#0d1622] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {t.difficulties.easy}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                10 Qs
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {t.questionCountDesc.easy}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.difficultySub.easy}
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
              <span className="text-slate-400">{t.cost}: <strong className="text-amber-300">10 🪙</strong></span>
              <span className="text-slate-400">{t.reward}: <strong className="text-emerald-400">+20 🪙</strong></span>
            </div>
          </button>

          {/* Medium: 20 Questions */}
          <button
            onClick={() => onSelectDifficulty('medium')}
            className={`p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
              selectedDifficulty === 'medium'
                ? 'border-amber-400 bg-amber-950/20 shadow-md ring-2 ring-amber-500/30'
                : 'border-slate-800 bg-[#0d1622] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {t.difficulties.medium}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                20 Qs
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {t.questionCountDesc.medium}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.difficultySub.medium}
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
              <span className="text-slate-400">{t.cost}: <strong className="text-amber-300">20 🪙</strong></span>
              <span className="text-slate-400">{t.reward}: <strong className="text-emerald-400">+40 🪙</strong></span>
            </div>
          </button>

          {/* Hard: 30 Questions */}
          <button
            onClick={() => onSelectDifficulty('hard')}
            className={`p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
              selectedDifficulty === 'hard'
                ? 'border-rose-400 bg-rose-950/20 shadow-md ring-2 ring-rose-500/30'
                : 'border-slate-800 bg-[#0d1622] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{t.difficulties.hard}</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                30 Qs
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {t.questionCountDesc.hard}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.difficultySub.hard}
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
              <span className="text-slate-400">{t.cost}: <strong className="text-amber-300">30 🪙</strong></span>
              <span className="text-slate-400">{t.reward}: <strong className="text-emerald-400">+60 🪙</strong></span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Match Action Console / Kick Off */}
      <section className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {language === 'ar' ? 'جاهز للانطلاق؟' : 'Match Selection Ready'}
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {CATEGORIES_META.find((c) => c.id === selectedCategory)?.name[language]} ·{' '}
            <span className="text-emerald-400">{diffConfig.questionCount} {language === 'ar' ? 'سؤال' : 'Questions'}</span>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? `رسوم المباراة ${diffConfig.cost} عملات · مكافأة الفوز ${diffConfig.winReward} عملة تضاف لرصيدك`
              : `Match entry ${diffConfig.cost} Coins · Victory reward of ${diffConfig.winReward} Coins added straight to your balance`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {hasEnoughCoins ? (
            <button
              onClick={() => onStartQuiz()}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t.startQuiz} ({diffConfig.cost} {t.coins})</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? `تحتاج إلى ${diffConfig.cost} عملات للعب` : `Need ${diffConfig.cost} Coins to Play`}</span>
              </div>
              <button
                onClick={onOpenCoinShop}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Coins className="w-4 h-4" />
                <span>{language === 'ar' ? 'شراء عملات للدخول' : 'Buy Coins to Enter'}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
