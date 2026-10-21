import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, ShieldCheck, X, ArrowDownCircle, ExternalLink } from 'lucide-react';
import { Language } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { triggerApkDownload } from '../utils/apkDownload';
import { sounds } from '../utils/audio';

interface DownloadApkModalProps {
  language: Language;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ language, onClose }) => {
  const t = getTranslation(language);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    sounds.playClick();
    triggerApkDownload();
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b131e] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-left">
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0 bg-[#080e16]">
            <img
              src="/assets/aistudio/360_F_332687153_gmsohq86koOEWFYlYSI3N6xzb1zIcG88_cb9e53eb.jpg"
              alt="ZaFoot Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Android APK v1.1.0 (Signed Release)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t.downloadApkFullTitle}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t.downloadApkBannerDesc}
        </p>

        {/* Download Trigger Action */}
        <div className="bg-[#080e16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pb-1 border-b border-slate-800/80">
            <div>Package: <strong className="text-white block font-mono">com.zafoot.app</strong></div>
            <div>Version: <strong className="text-white block">1.1.0 (Build 2)</strong></div>
            <div>File Size: <strong className="text-emerald-400 block tabular-nums">125 KB</strong></div>
            <div>Compatibility: <strong className="text-slate-300 block">Android 5.0 – 15+</strong></div>
            <div>Security: <strong className="text-emerald-400 block">Signed (v1, v2, v3)</strong></div>
            <div>Architecture: <strong className="text-slate-300 block">Universal</strong></div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{t.downloadApk}</span>
          </button>

          {downloaded && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold animate-fadeIn">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{t.downloadStarted}</span>
            </div>
          )}
        </div>

        {/* Installation Instructions */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'خطوات التثبيت على الهاتف:' : 'Quick Installation Guide:'}</span>
          </h4>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <span>
                {language === 'ar'
                  ? 'اضغط على زر "تحميل APK" لتحميل ملف ZaFoot.apk مباشرة.'
                  : 'Tap "Download APK" to save ZaFoot.apk directly to your device.'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <span>
                {language === 'ar'
                  ? 'افتح الإشعار أو مجلد التنزيلات (Downloads) واضغط على ملف ZaFoot.apk.'
                  : 'Open your notification drawer or Downloads folder and tap the downloaded APK.'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <span>
                {language === 'ar'
                  ? 'إذا طُلب منك، اسمح بالتثبيت من هذا المصدر (Allow from this source) ثم اضغط "تثبيت".'
                  : 'If prompted by Android, enable "Install from Unknown Sources" and tap Install.'}
              </span>
            </div>
          </div>
        </div>

        {/* Direct Download fallback link */}
        <div className="text-center pt-1">
          <a
            href="/api/download/zafoot.apk"
            download="ZaFoot.apk"
            className="text-xs text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
          >
            <span>{language === 'ar' ? 'رابط تحميل مباشر بديل لملف APK' : 'Direct APK download link'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
