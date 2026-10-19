import React, { useState } from 'react';
import { X, Award, Check, User, Trophy as TrophyIcon, Sparkles, Coins } from 'lucide-react';
import { UserProfile, Language } from '../types/quiz';
import { AVATAR_OPTIONS } from '../data/avatars';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface ProfileModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  language,
  onClose,
  onUpdateProfile,
}) => {
  const t = getTranslation(language);
  const [username, setUsername] = useState(user.username);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    sounds.playClick();
    onUpdateProfile({
      username: username.trim() || user.username,
      avatar: selectedAvatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const winRate =
    user.quizzesPlayed > 0
      ? Math.round((user.quizzesWon / user.quizzesPlayed) * 100)
      : 0;

  const accuracy =
    user.questionsAnswered > 0
      ? Math.round((user.correctAnswers / user.questionsAnswered) * 100)
      : 0;

  const trophiesList = [
    {
      id: 'first_win',
      icon: '🏆',
      title: t.firstWinTrophy,
      desc: t.firstWinDesc,
      unlocked: user.quizzesWon >= 1,
    },
    {
      id: 'centurion',
      icon: '💯',
      title: t.centurionTrophy,
      desc: t.centurionDesc,
      unlocked: user.correctAnswers >= 50,
    },
    {
      id: 'hardcore',
      icon: '🧠',
      title: t.hardcoreTrophy,
      desc: t.hardcoreDesc,
      unlocked: user.trophies.includes('hardcore'),
    },
    {
      id: 'world_cup',
      icon: '🌍',
      title: t.worldCupTrophy,
      desc: t.worldCupDesc,
      unlocked: user.trophies.includes('world_cup'),
    },
    {
      id: 'wealth',
      icon: '💰',
      title: t.wealthTrophy,
      desc: t.wealthDesc,
      unlocked: user.coins >= 150,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{t.playerProfile}</h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'سجل الإنجازات والبيانات التكتيكية' : 'Career achievements & manager dossier'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Name & Avatar Customizer */}
        <div className="space-y-4 bg-[#0e1724] p-4 sm:p-5 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              maxLength={24}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t.selectAvatar}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all text-xl cursor-pointer ${
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

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تم الحفظ!' : 'Saved!'}</span>
                </>
              ) : (
                <span>{t.save}</span>
              )}
            </button>
          </div>
        </div>

        {/* Career Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>📊</span>
            <span>{t.stats}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0e1724] border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">{t.matchesPlayed}</span>
              <span className="text-xl font-black text-white tabular-nums">
                {user.quizzesPlayed}
              </span>
            </div>

            <div className="bg-[#0e1724] border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">{t.quizzesWon}</span>
              <span className="text-xl font-black text-emerald-400 tabular-nums">
                {user.quizzesWon}
              </span>
            </div>

            <div className="bg-[#0e1724] border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">{t.winRate}</span>
              <span className="text-xl font-black text-amber-400 tabular-nums">
                {winRate}%
              </span>
            </div>

            <div className="bg-[#0e1724] border border-slate-800/80 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">{t.coins}</span>
              <span className="text-xl font-black text-white tabular-nums flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{user.coins}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trophy Cabinet */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrophyIcon className="w-4 h-4 text-amber-400" />
            <span>{t.trophyCabinet}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trophiesList.map((tr) => (
              <div
                key={tr.id}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  tr.unlocked
                    ? 'border-amber-500/40 bg-amber-950/20 shadow-sm'
                    : 'border-slate-800 bg-[#0e1724] opacity-40'
                }`}
              >
                <div className="text-2xl shrink-0 p-2 rounded-lg bg-black/40 border border-white/5">
                  {tr.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{tr.title}</span>
                    {tr.unlocked && (
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase">
                        ✓ {language === 'ar' ? 'مكتمل' : 'Unlocked'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{tr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
