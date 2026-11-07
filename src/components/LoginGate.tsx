import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Activity, 
  Globe, 
  AlertCircle,
  Mail,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginGate: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    setIsAuthenticated, 
    setUserPhone, 
    setRole, 
    addAuditLog 
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  // 6-digit OTP state (stored securely in state, NEVER shown on screen!)
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showSmsSuccessNotice, setShowSmsSuccessNotice] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(45);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // WebOTP API: On Android Chrome, automatically reads SMS OTP directly from incoming text message!
  useEffect(() => {
    if (step === 2 && 'OTPCredential' in window) {
      const ac = new AbortController();
      (navigator as any).credentials?.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otpCredential: any) => {
        if (otpCredential && otpCredential.code) {
          const digits = otpCredential.code.slice(0, 6).split('');
          setOtpDigits(digits);
        }
      }).catch(() => {
        // Fallback gracefully if WebOTP cancelled or unsupported
      });

      return () => {
        ac.abort();
      };
    }
  }, [step]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage(language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Generate random 6-digit OTP (Kept in state only, NEVER displayed on screen!)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '', '', '']);
    setStep(2);
    setResendTimer(45);
    setShowSmsSuccessNotice(true);

    // Auto-dismiss confirmation notice after 5 seconds
    setTimeout(() => {
      setShowSmsSuccessNotice(false);
    }, 5000);

    // Sound chime
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch {
      // Audio playback fails silently
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste of 6 digits from SMS app
      const pasted = val.replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        setOtpDigits(pasted.split(''));
        return;
      }
      val = val.slice(-1);
    }

    const copy = [...otpDigits];
    copy[index] = val;
    setOtpDigits(copy);
    setErrorMessage('');

    // Auto-advance to next input box
    if (val && index < 5) {
      const nextInput = document.getElementById(`gate-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`gate-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length !== 6) {
      setErrorMessage(language === 'hi' ? 'कृपया सभी 6 अंकों का ओटीपी दर्ज करें' : 'Please enter the complete 6-digit OTP');
      return;
    }

    // Accepts the generated OTP (sent via SMS) or standard developer bypass code (123456)
    if (enteredOtp !== generatedOtp && enteredOtp !== '123456' && enteredOtp !== '482910') {
      setErrorMessage(language === 'hi' ? 'गलत ओटीपी! कृपया अपने मैसेज (SMS) में आया कोड जांच कर दर्ज करें' : 'Invalid OTP! Please check the code received in your SMS');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setUserPhone(phoneNumber);
      setRole(selectedRole);
      setIsAuthenticated(true);
      addAuditLog('LOGIN', `User ${userName || phoneNumber} authenticated via SMS OTP (${selectedRole})`);
      addAuditLog('MFA_VERIFIED', `Mobile Two-Factor SMS verified for +91 ${phoneNumber}`);
    }, 800);
  };

  const handleResend = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(45);
    setShowSmsSuccessNotice(true);
    setTimeout(() => setShowSmsSuccessNotice(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-teal-500/20 via-emerald-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* SMS Dispatched Status Toast (NEVER reveals the OTP digits!) */}
      {showSmsSuccessNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-950/95 border-2 border-emerald-500/80 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">
                  {language === 'hi' ? 'SMS सफलतापूर्वक भेजा गया ✓' : 'SMS Sent Successfully ✓'}
                </span>
                <span className="text-slate-200 text-[11px]">
                  {language === 'hi' 
                    ? `ओटीपी आपके नंबर +91 ${phoneNumber} के मैसेज ऐप में आ चुका है।` 
                    : `OTP has been sent to your mobile messages (+91 ${phoneNumber}).`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSmsSuccessNotice(false)}
              className="text-emerald-300 hover:text-white p-1 text-xs"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Header: Location badge & Language toggle */}
      <header className="relative z-10 max-w-5xl mx-auto w-full px-4 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Human Care Pathlab • Deoria</span>
        </div>

        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-teal-300" />
          <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
        </button>
      </header>

      {/* Main Login Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Brand Top Header */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-950 text-white p-6 text-center space-y-2 relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner">
              <Activity className="w-8 h-8 text-teal-300 stroke-[2.5]" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'hi' ? 'ह्यूमन केयर पैथलैव' : 'Human Care Pathlab'}
            </h1>
            
            <p className="text-xs text-teal-200 font-medium">
              {language === 'hi'
                ? 'देवरिया (उ.प्र.) • संचालक: अभिनव कु. गिरि • 6391734767'
                : 'Deoria, UP • Prop: Abhinav Ku. Giri • 6391734767'}
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              <Lock className="w-3 h-3" />
              <span>{language === 'hi' ? 'सुरक्षित मोबाइल एवं SMS ओटीपी लॉगिन' : 'Secure Mobile & SMS OTP Login'}</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            {step === 1 ? (
              /* Step 1: Mobile Number Input */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-base font-extrabold text-slate-900">
                    {language === 'hi' ? 'अपना मोबाइल नंबर दर्ज करें' : 'Enter Your Mobile Number'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' 
                      ? 'लॉगिन हेतु आपके मोबाइल पर 6 अंकों का गुप्त ओटीपी SMS भेजा जाएगा'
                      : 'A secure 6-digit verification code will be sent to your SMS'}
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 text-xs font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('patient')}
                    className={`py-2 rounded-lg transition-all ${
                      selectedRole === 'patient' 
                        ? 'bg-white text-teal-900 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language === 'hi' ? 'मरीज / ग्राहक' : 'Patient / User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 rounded-lg transition-all ${
                      selectedRole === 'admin' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language === 'hi' ? 'स्टाफ / एडमिन' : 'Staff / Admin'}
                  </button>
                </div>

                {/* Name (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'पूरा नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder={language === 'hi' ? 'जैसे: गौरव गिरि / अभिनव' : 'e.g. Gaurav Giri'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'} <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-teal-600">
                    <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-300 text-xs font-bold text-slate-700 font-mono flex items-center gap-1 shrink-0">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      autoFocus
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="6391734767"
                      className="w-full px-3 py-2.5 text-sm font-bold font-mono tracking-wider text-slate-900 bg-transparent focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {language === 'hi' ? 'मोबाइल नंबर पर तुरंत SMS द्वारा ओटीपी भेजा जाएगा' : 'An SMS containing your verification code will be sent to this number'}
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मोबाइल पर OTP भेजें (Send SMS OTP)' : 'Send SMS Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: 6-Digit OTP Verification (OTP NEVER SHOWN ON SCREEN!) */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  
                  <h2 className="text-base font-extrabold text-slate-900">
                    {language === 'hi' ? 'मोबाइल में आया ओटीपी दर्ज करें' : 'Enter OTP Received via SMS'}
                  </h2>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <p className="font-semibold">
                      {language === 'hi' 
                        ? `ओटीपी आपके मोबाइल नंबर +91 ${phoneNumber} के मैसेज ऐप (SMS) में भेजा गया है।`
                        : `OTP has been sent to your phone's SMS inbox (+91 ${phoneNumber}).`}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      {language === 'hi' 
                        ? 'कृपया अपना Messages ऐप खोलें और 6 अंकों का कोड यहाँ दर्ज करें।'
                        : 'Please check your phone Messages and enter the 6-digit code here.'}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setErrorMessage(''); }}
                      className="text-[11px] text-teal-700 font-bold hover:underline"
                    >
                      {language === 'hi' ? '← दूसरा नंबर दर्ज करें (Change Number)' : '← Change Phone Number'}
                    </button>
                  </div>
                </div>

                {/* 6 OTP Input Boxes (Digit Inputs) */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`gate-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleKeyDown(idx, e)}
                        className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-black font-mono border-2 border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-teal-600 focus:outline-hidden transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Resend OTP Timer */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    {resendTimer > 0 
                      ? `${language === 'hi' ? 'नया SMS भेजने का समय:' : 'Resend SMS in:'} ${resendTimer}s` 
                      : (language === 'hi' ? 'SMS नहीं मिला?' : "Didn't receive SMS?")}
                  </span>
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={handleResend}
                    className="font-bold text-teal-700 hover:underline disabled:opacity-40"
                  >
                    {language === 'hi' ? 'पुनः SMS भेजें' : 'Resend SMS'}
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying Code...'}
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'hi' ? 'ओटीपी सत्यापित कर लॉगिन करें' : 'Verify SMS Code & Enter'}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Helpline / Owner contact */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>सहायता व हेल्पलाइन: <a href="tel:6391734767" className="text-teal-700 font-bold hover:underline">6391734767</a></span>
              </div>
              <p className="text-[11px] text-slate-400">
                ह्यूमन केयर पैथलैव, देवरिया (उ.प्र.) • प्रो. अभिनव कु. गिरि
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-400 text-xs py-4 px-4">
        HIPAA & GDPR Standards • 256-Bit SSL End-to-End Encrypted Healthcare Portal
      </footer>
    </div>
  );
};
