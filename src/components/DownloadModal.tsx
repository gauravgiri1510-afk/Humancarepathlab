import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Download, 
  Smartphone, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  Apple, 
  ShieldCheck,
  ExternalLink,
  Laptop,
  Briefcase
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const { t, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-65qf2mjnpyg2pi4xs6ikr7-189117792411.asia-southeast1.run.app';

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Download Mobile App"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Smartphone className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'hi' ? 'ह्यूमन केयर पैथलैव ऐप डाउनलोड व इंस्टाल करें' : 'Download & Install Human Care Pathlab App'}
              </h3>
              <p className="text-xs text-teal-200/90">
                Deoria, UP • Prop: Abhinav Ku. Giri • 6391734767
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Direct Install PWA Action */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-700/20">
              <Download className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                {language === 'hi' ? 'फोन की होम स्क्रीन पर सीधे इंस्टॉल करें' : 'Install Directly to Home Screen'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                {language === 'hi' 
                  ? 'बिना प्ले स्टोर के यह ऐप आपके फोन पर एक नेटिव मोबाइल ऐप की तरह तेजी से काम करेगी और ऑफ़लाइन भी खुलेगी।'
                  : 'Zero App Store hassle. Operates as a fast standalone native application with full offline report caching.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'hi' ? 'अभी फोन पर इंस्टॉल करें (Install App)' : 'Install App Now'}</span>
                </button>
              ) : (
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/20"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (language === 'hi' ? 'ऐप लिंक कॉपी करें (Copy App Link)' : 'Copy App Link')}</span>
                </button>
              )}
            </div>
          </div>

          {/* QR Code and Web Link Sharing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* QR Code graphic */}
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <svg className="w-28 h-28" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="2" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="#0d9488" rx="1" />
                  <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="2" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="#0d9488" rx="1" />
                  <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="2" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="#0d9488" rx="1" />
                  <rect x="40" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="50" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="20" width="8" height="8" fill="#0d9488" />
                  <rect x="52" y="20" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="38" width="16" height="16" fill="#0f766e" rx="2" />
                  <rect x="10" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="22" y="48" width="8" height="6" fill="#0f172a" />
                  <rect x="72" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="84" y="48" width="8" height="6" fill="#0f172a" />
                  <rect x="40" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="74" width="6" height="6" fill="#0d9488" />
                  <rect x="70" y="70" width="12" height="8" fill="#0f172a" />
                  <rect x="85" y="78" width="6" height="14" fill="#0f172a" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-2">
                {language === 'hi' ? 'फोन से QR कोड स्कैन करें' : 'Scan to Open on Phone'}
              </span>
              <span className="text-[10px] text-slate-500">Camera / Google Lens</span>
            </div>

            {/* Direct Web URL */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1 text-[11px]">
                  {language === 'hi' ? 'लाइव वेब ऐप लिंक (Live App Link):' : 'Official Application URL:'}
                </label>
                <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-slate-300 font-mono text-[11px] text-slate-800 break-all select-all">
                  <span className="truncate">{appUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy URL'}</span>
                </button>

                <a
                  href={appUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Instructions for Android & iPhone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android Chrome Installation</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                1. Open link in Chrome.<br />
                2. Tap three dots ⋮ at top right.<br />
                3. Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-slate-800" />
                <span>iPhone / iPad Safari Installation</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                1. Open link in Safari.<br />
                2. Tap the <strong>Share</strong> button (box with arrow).<br />
                3. Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>
          </div>

          {/* Direct Admin Panel Switcher CTA */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Looking for Lab Administration?</span>
            </div>
            <button
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'hi' ? 'एडमिन पैनल खोलें (Open Admin Panel)' : 'Open Lab Admin Panel'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
