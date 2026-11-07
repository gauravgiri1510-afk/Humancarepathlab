import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, user, isMfaAuthenticated, setIsMfaAuthenticated, addAuditLog } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [emailOrPhone, setEmailOrPhone] = useState(user.phone);
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setResendTimer(45);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const copy = [...otp];
    copy[index] = val;
    setOtp(copy);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsMfaAuthenticated(true);
      addAuditLog('MFA_VERIFIED', `User ${user.name} completed Two-Factor OTP authentication on secure session`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Secure Authentication & MFA"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {step === 1 ? t.loginTitle : t.mfaStepTitle}
              </h3>
              <p className="text-xs text-emerald-200">
                {step === 1 ? t.loginSubtitle : t.mfaInstruction}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{t.emailOrPhone}</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{t.password}</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:outline-teal-600"
              />
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-[11px] text-teal-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 shrink-0" />
              <span>HIPAA Multi-Factor Challenge will follow this step</span>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/20"
            >
              <span>{t.loginBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5 text-xs text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <p className="text-slate-600 text-xs">
              We sent a 6-digit verification code to <strong>+91 98765 ***10</strong>
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-black font-mono border-2 border-slate-300 rounded-xl bg-white focus:border-teal-600 focus:outline-hidden"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
              <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Did not receive code?'}</span>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => setResendTimer(45)}
                className="text-teal-700 font-bold hover:underline disabled:opacity-40"
              >
                {t.resendOtp}
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Token...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.verifyMfa}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
