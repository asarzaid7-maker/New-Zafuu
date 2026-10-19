import React from 'react';
import { X, Globe, Volume2, VolumeX, Clock, RotateCcw, Info, ShieldCheck } from 'lucide-react';
import { Language, GameSettings } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  language: Language;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
  onResetAccount: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  language,
  onUpdateSettings,
  onClose,
  onResetAccount,
}) => {
  const t = getTranslation(language);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.setEnabled(next);
    if (next) sounds.playClick();
    onUpdateSettings({ soundEnabled: next });
  };

  const toggleTimer = () => {
    sounds.playClick();
    onUpdateSettings({ timerEnabled: !settings.timerEnabled });
  };

  const setLanguage = (lang: Language) => {
    sounds.playClick();
    onUpdateSettings({ language: lang });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{t.settingsTitle}</h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'تخصيص اللغة والتفضيلات' : 'Customization & audio settings'}
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

        {/* 1. Language Preference */}
        <div className="space-y-2 bg-[#0e1724] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{t.language}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                language === 'en'
                  ? 'border-emerald-400 bg-emerald-500/20 text-white ring-2 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                language === 'ar'
                  ? 'border-emerald-400 bg-emerald-500/20 text-white ring-2 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>🇸🇦</span>
              <span>العربية</span>
            </button>
          </div>
        </div>

        {/* 2. Sound Effects */}
        <div className="flex items-center justify-between p-4 bg-[#0e1724] rounded-xl border border-slate-800">
          <div className="space-y-0.5 pr-2">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span>{t.soundEffects}</span>
            </div>
            <p className="text-xs text-slate-400">{t.soundDesc}</p>
          </div>

          <button
            onClick={toggleSound}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.soundEnabled ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 3. Timer Mode */}
        <div className="flex items-center justify-between p-4 bg-[#0e1724] rounded-xl border border-slate-800">
          <div className="space-y-0.5 pr-2">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t.timerMode}</span>
            </div>
            <p className="text-xs text-slate-400">{t.timerDesc}</p>
          </div>

          <button
            onClick={toggleTimer}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              settings.timerEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.timerEnabled ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 4. Game Rules & Economy Overview */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.rulesTitle}</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>{t.rule1}</li>
            <li>{t.rule2}</li>
            <li>{t.rule3}</li>
            <li>{t.rule4}</li>
            <li>{t.rule5}</li>
          </ul>
        </div>

        {/* 5. Reset Account Option */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm(t.resetConfirm)) {
                onResetAccount();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetAccount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
