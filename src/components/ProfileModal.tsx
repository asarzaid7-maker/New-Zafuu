import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  User,
  Trophy as TrophyIcon,
  Coins,
  Camera,
  Trash2,
  Upload,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, Language } from '../types/quiz';
import { AVATAR_OPTIONS } from '../data/avatars';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';
import { processProfileImage } from '../utils/imageUpload';

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile Picture Upload & Preview state
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDefaultAvatar =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  const handleOpenPhotoPicker = () => {
    sounds.playClick();
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      setErrorMessage(null);
      const processedDataUrl = await processProfileImage(file);
      setPreviewPhoto(processedDataUrl);
      sounds.playClick();
    } catch (err: any) {
      setErrorMessage(
        err?.message || (language === 'ar' ? 'فشل معالجة الصورة المختارة' : 'Failed to process selected image.')
      );
    } finally {
      setIsProcessingPhoto(false);
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSavePhotoPreview = () => {
    if (!previewPhoto) return;
    sounds.playVictory();
    onUpdateProfile({ customPhoto: previewPhoto });
    setPreviewPhoto(null);
    setStatusMessage(
      language === 'ar' ? 'تم حفظ الصورة الشخصية بنجاح!' : 'Profile picture saved successfully!'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCancelPhotoPreview = () => {
    sounds.playClick();
    setPreviewPhoto(null);
    setErrorMessage(null);
  };

  const handleRemovePhoto = () => {
    sounds.playClick();
    onUpdateProfile({ customPhoto: undefined });
    setPreviewPhoto(null);
    setStatusMessage(
      language === 'ar'
        ? 'تمت إزالة الصورة الشخصية والعودة للشخصية الافتراضية.'
        : 'Profile picture removed. Reverted to avatar.'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveDetails = () => {
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

  const displayedPhoto = previewPhoto || user.customPhoto;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b131e] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-6 shadow-2xl relative">
        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{t.playerProfile}</h2>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'تخصيص الصورة الشخصية واسم المدرب والإحصائيات'
                  : 'Manage custom photo, manager credentials & career achievements'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status or Error Notifications */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Profile Picture Hero Showcase & Upload Control */}
        <div className="bg-[#0e1724] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Avatar / Photo Preview */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/20 bg-slate-900 flex items-center justify-center text-4xl shrink-0">
                  {displayedPhoto ? (
                    <img
                      src={displayedPhoto}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentDefaultAvatar.emoji}</span>
                  )}
                </div>

                <button
                  onClick={handleOpenPhotoPicker}
                  className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg border border-emerald-400/80 transition-transform active:scale-90 cursor-pointer"
                  title={language === 'ar' ? 'تعديل الصورة الشخصية' : 'Edit Profile Picture'}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {displayedPhoto
                      ? language === 'ar'
                        ? 'صورتك الشخصية الخاصة'
                        : 'Custom Profile Picture'
                      : language === 'ar'
                      ? 'الشخصية الافتراضية'
                      : 'Default Manager Avatar'}
                  </h3>
                  {displayedPhoto && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  {language === 'ar'
                    ? 'اختر أي صورة من هاتفك (أندرويد / آيفون) أو جهاز الكمبيوتر لتظهر صورتك في كل أنحاء المنصة.'
                    : 'Upload any photo from your mobile photo gallery or computer to represent your manager dossier.'}
                </p>
              </div>
            </div>

            {/* Action Buttons for Picture */}
            <div className="flex flex-wrap sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleOpenPhotoPicker}
                disabled={isProcessingPhoto}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {isProcessingPhoto
                    ? language === 'ar'
                      ? 'جاري المعالجة...'
                      : 'Processing...'
                    : user.customPhoto
                    ? language === 'ar'
                      ? 'تغيير الصورة'
                      : 'Change Photo'
                    : language === 'ar'
                    ? 'رفع صورة جديدة'
                    : 'Upload Photo'}
                </span>
              </button>

              {user.customPhoto && !previewPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title={language === 'ar' ? 'إزالة صورتك والعودة للشخصية' : 'Remove picture'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إزالة الصورة' : 'Remove Photo'}</span>
                </button>
              )}
            </div>
          </div>

          {/* New Photo Preview Confirmation Bar */}
          {previewPhoto && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-400/60 shrink-0">
                  <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    {language === 'ar' ? 'معاينة الصورة قبل الحفظ:' : 'Preview Before Saving:'}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {language === 'ar'
                      ? 'هل تود اعتماد هذه الصورة كصورتك الرسمية؟'
                      : 'Ready to set this as your official ZaFoot profile photo?'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSavePhotoPreview}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حفظ الصورة' : 'Save Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelPhotoPreview}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Manager Name & Emoji Avatar Customizer */}
        <div className="space-y-4 bg-[#0e1724] p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              maxLength={24}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'ar' ? 'الشخصية الرمزية (الاحتياطية)' : 'Default Avatar (Fallback)'}
              </label>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'تُستخدم عند عدم رفع صورة شخصية' : 'Used when no custom photo is uploaded'}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2.5 rounded-xl flex flex-col items-center justify-center border transition-all text-xl cursor-pointer ${
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
              onClick={handleSaveDetails}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
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

        {/* 3. Career Statistics */}
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

        {/* 4. Trophy Cabinet */}
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
