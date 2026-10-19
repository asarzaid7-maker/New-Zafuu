import React, { useState } from 'react';
import { Coins, Sparkles, User, CheckCircle } from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { AVATAR_OPTIONS } from '../data/avatars';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface SignInModalProps {
  language: Language;
  onSignIn: (username: string, avatar: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ language, onSignIn }) => {
  const t = getTranslation(language);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('striker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCoin();
    const finalName = name.trim() || (language === 'ar' ? 'المدرب زيد' : 'Manager Zaid');
    onSignIn(finalName, selectedAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b131e] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Pitch light banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Header with App Logo & Welcome */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/25">
            ⚽
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.welcomeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* 50 Coins Starter Gift Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-500/40 flex items-center justify-center gap-3 shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-xl text-amber-300">
            🪙
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300/90 uppercase tracking-wider block">
              {language === 'ar' ? 'هدية الانضمام الفورية' : 'Instant Sign-In Bonus'}
            </span>
            <span className="text-xl font-black text-white">
              +50 {t.coins}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.username}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.enterNamePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-400 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t.selectAvatar}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.slice(0, 8).map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
                    selectedAvatar === av.id
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                  title={av.label[language]}
                >
                  <span>{av.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm sm:text-base shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Coins className="w-5 h-5" />
            <span>{t.claimBonusAndEnter}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
