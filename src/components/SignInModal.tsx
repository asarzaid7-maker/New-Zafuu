import React, { useState, useRef } from 'react';
import { Coins, Sparkles, User, CheckCircle, Bot, Camera, Upload, X } from 'lucide-react';
import { Language } from '../types/quiz';
import { AVATAR_OPTIONS } from '../data/avatars';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';
import { processProfileImage } from '../utils/imageUpload';

interface SignInModalProps {
  language: Language;
  onSignIn: (username: string, avatar: string, customPhoto?: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ language, onSignIn }) => {
  const t = getTranslation(language);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('striker');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setPhotoError(null);
      const dataUrl = await processProfileImage(file);
      setCustomPhoto(dataUrl);
      sounds.playClick();
    } catch (err: any) {
      setPhotoError(err?.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCoin();
    const finalName = name.trim() || (language === 'ar' ? 'المدرب زيد' : 'Manager Zaid');

    // Register user with server
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: finalName,
        avatar: selectedAvatar,
        customPhoto: customPhoto || undefined,
      }),
    }).catch(() => {
      // Ignore background error
    });

    onSignIn(finalName, selectedAvatar, customPhoto || undefined);
  };

  const currentDefaultAvatar =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#0b131e] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden my-auto">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        {/* Pitch light banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Top Feature Tag */}
        <div className="flex items-center justify-center text-xs pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-bold">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'ar'
                ? 'يشمل مساعد زافوت الذكي (ZaFoot AI)'
                : 'Includes ZaFoot AI Football Assistant'}
            </span>
          </div>
        </div>

        {/* Header with App Logo & Welcome */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/25 bg-[#080f18] group hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/360_F_332687153_gmsohq86koOEWFYlYSI3N6xzb1zIcG88_cb9e53eb.jpg"
              alt="ZaFoot Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.welcomeTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.welcomeSubtitle}
            </p>
          </div>
        </div>

        {/* 50 Coins Starter Gift Badge */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-500/40 flex items-center justify-center gap-3 shadow-inner">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-lg text-amber-300 shrink-0">
            🪙
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-wider block">
              {language === 'ar' ? 'هدية الانضمام الفورية' : 'Instant Sign-In Bonus'}
            </span>
            <span className="text-base font-black text-white">
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-400 placeholder:text-slate-500"
            />
          </div>

          {/* Optional Profile Picture Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'ar' ? 'الصورة الشخصية (اختياري)' : 'Profile Picture (Optional)'}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رفع صورة من جهازك' : 'Upload from device'}</span>
              </button>
            </div>

            {customPhoto ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-400">
                    <img src={customPhoto} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-emerald-300 font-semibold">
                    {language === 'ar' ? 'تم اختيار صورتك الشخصية' : 'Photo selected'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomPhoto(null)}
                  className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.slice(0, 8).map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
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
            )}

            {photoError && (
              <p className="text-[11px] text-rose-400 mt-1">{photoError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Coins className="w-4 h-4" />
            <span>{t.claimBonusAndEnter}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
