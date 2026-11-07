import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  Bell, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Globe, 
  User, 
  Sliders, 
  Check, 
  Lock,
  Stethoscope,
  Briefcase,
  Truck,
  Download,
  Smartphone,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenCompliance: () => void;
  onOpenTrends: () => void;
  onOpenMyReports: () => void;
  onOpenMfa: () => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenCompliance,
  onOpenTrends,
  onOpenMyReports,
  onOpenMfa,
  onOpenDownload
}) => {
  const { 
    language, 
    setLanguage, 
    t, 
    role, 
    setRole, 
    user, 
    unreadNotifsCount, 
    isOffline, 
    setIsOffline,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    isEncryptionActive,
    logout
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      {/* Top micro-bar for HIPAA and emergency helpline */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">HIPAA & GDPR Compliant</span>
            <span className="text-emerald-400 font-semibold">• NABL ISO 15189 Certified</span>
          </span>
          <span className="hidden md:inline-block text-emerald-300/60">|</span>
          <span className="hidden md:inline-block text-emerald-200">
            {t.homeCollectionBadge}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {/* Offline simulator toggle */}
          <button 
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${
              isOffline ? 'bg-amber-500 text-white font-medium' : 'bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200'
            }`}
            title="Toggle simulated network connectivity"
          >
            {isOffline ? <WifiOff className="w-3 h-3 text-white" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
          </button>

          <span className="text-emerald-300/40 hidden sm:inline">|</span>

          {/* 24x7 Helpline */}
          <a 
            href="tel:6391734767"
            className="text-emerald-200 hover:text-white font-mono hidden sm:inline transition-colors"
          >
            📞 6391734767 (Abhinav Ku. Giri, Deoria)
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                {language === 'hi' ? 'ह्यूमन केयर ' : 'Human Care '}<span className="text-teal-600">Pathlab</span>
              </span>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider hidden xs:inline-block">
                DEORIA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-sm">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Center Navigation Shortcuts (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button 
            onClick={onOpenMyReports}
            className="px-3 py-1.5 rounded-lg hover:bg-white hover:text-teal-700 hover:shadow-xs transition-all flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            {t.navHistory}
          </button>
          <button 
            onClick={onOpenTrends}
            className="px-3 py-1.5 rounded-lg hover:bg-white hover:text-teal-700 hover:shadow-xs transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            {t.navTrends}
          </button>
          <button 
            onClick={onOpenCompliance}
            className="px-3 py-1.5 rounded-lg hover:bg-white hover:text-teal-700 hover:shadow-xs transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {t.navCompliance}
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct Download Mobile App Button */}
          <button
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
            title="Download & Install Mobile App (PWA)"
          >
            <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">
              {language === 'hi' ? 'ऐप डाउनलोड' : 'Download App'}
            </span>
          </button>

          {/* 1-Click Direct Admin Panel Switcher */}
          <button
            onClick={() => setRole(role === 'admin' ? 'patient' : 'admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              role === 'admin'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}
            title="Switch to Lab Admin & Pathologist Portal"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {role === 'admin' ? (language === 'hi' ? 'मरीज पोर्टल' : 'Patient View') : (language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel')}
            </span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
            >
              {role === 'patient' && <User className="w-3.5 h-3.5 text-teal-600" />}
              {role === 'admin' && <Briefcase className="w-3.5 h-3.5 text-indigo-600" />}
              {role === 'phlebotomist' && <Truck className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden md:inline">
                {role === 'patient' ? t.rolePatient : role === 'admin' ? t.roleAdmin : t.rolePhlebotomist}
              </span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 text-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.switchRole}
                </div>
                <button
                  onClick={() => { setRole('patient'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                    role === 'patient' ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-teal-600" />
                  <div>
                    <div>{t.rolePatient}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Book home test & download report</div>
                  </div>
                </button>
                <button
                  onClick={() => { setRole('admin'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                    role === 'admin' ? 'bg-indigo-50 text-indigo-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div>{t.roleAdmin}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Upload reports & verify parameters</div>
                  </div>
                </button>
                <button
                  onClick={() => { setRole('phlebotomist'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                    role === 'phlebotomist' ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-600" />
                  <div>
                    <div>{t.rolePhlebotomist}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Home pickup queue & barcode scan</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Language Toggle (EN / हिंदी) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 text-xs">
                <button
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                    language === 'en' ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                    language === 'hi' ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Accessibility Settings (Font scaling & High contrast) */}
          <div className="relative">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
              title="Accessibility Settings (Font size, High Contrast)"
              aria-label="Accessibility Settings"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
            </button>

            {showAccessibilityMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="font-bold text-slate-800 mb-2">Accessibility Options</div>
                
                {/* Font Size Scaling */}
                <div className="mb-3">
                  <div className="text-[11px] text-slate-500 mb-1">Text Scaling</div>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setFontSize('normal')}
                      className={`py-1 text-center font-bold rounded ${fontSize === 'normal' ? 'bg-white shadow-2xs text-teal-700' : 'text-slate-600'}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`py-1 text-center font-bold text-sm rounded ${fontSize === 'large' ? 'bg-white shadow-2xs text-teal-700' : 'text-slate-600'}`}
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setFontSize('xlarge')}
                      className={`py-1 text-center font-bold text-base rounded ${fontSize === 'xlarge' ? 'bg-white shadow-2xs text-teal-700' : 'text-slate-600'}`}
                    >
                      A++
                    </button>
                  </div>
                </div>

                {/* High Contrast Mode */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-700 font-medium">High Contrast</span>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
            title={t.notifications}
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User profile / MFA button */}
          <button
            onClick={onOpenMfa}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition-all"
            title="User Profile & Two-Factor Authentication (MFA)"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="leading-tight text-[11px] truncate max-w-[80px]">{user.name.split(' ')[0]}</div>
              <div className="text-[9px] text-emerald-700 font-normal flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                <span>MFA</span>
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs"
            title={language === 'hi' ? 'लॉगआउट करें' : 'Logout Session'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'लॉगआउट' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
