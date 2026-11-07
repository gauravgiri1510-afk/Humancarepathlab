import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LabTest } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: LabTest[];
  totalAmount: number;
  patientName: string;
  onPaymentSuccess: (method: 'upi' | 'card' | 'netbanking' | 'pay_at_collection', paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  tests,
  totalAmount,
  patientName,
  onPaymentSuccess
}) => {
  const { t, language } = useApp();
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking' | 'pay_at_collection'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes

  // Card form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('891');
  const [cardHolder, setCardHolder] = useState(patientName || 'Gaurav Giri');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    const generatedTxn = `PAY_${method.toUpperCase()}_${Date.now().toString().slice(-6)}`;
    setTxnId(generatedTxn);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(method, generatedTxn);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Payment Gateway"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {t.paymentTitle}
              </h3>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 mt-0.5">
                <Lock className="w-3 h-3" />
                256-Bit Encrypted Healthcare Checkout
              </p>
            </div>
          </div>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {t.paymentSuccess}
              </h4>
              <p className="text-sm text-slate-600 mt-1">
                Your home sample collection has been scheduled and dispatched.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 max-w-sm mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold">{txnId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold">{patientName}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Redirecting to your appointment confirmation...
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Order summary mini-card */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>{t.orderSummary}</span>
                <span className="text-teal-700 font-semibold">{tests.length} Test(s)</span>
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {tests.map(test => (
                  <div key={test.id} className="flex justify-between text-xs text-slate-600">
                    <span className="truncate max-w-[280px]">
                      {language === 'hi' ? test.nameHi : test.nameEn}
                    </span>
                    <span className="font-medium text-slate-800">
                      ₹{test.discountPrice || test.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between text-xs">
                <span className="text-slate-500">{t.homeCollectionFee}:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="line-through text-slate-400 font-normal">₹150</span>
                  {t.free}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm font-extrabold text-slate-900">
                <span>{t.totalPayable}:</span>
                <span className="text-teal-700 text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Methods Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    method === 'upi'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-teal-600" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    method === 'card'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    method === 'netbanking'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>Net Banking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('pay_at_collection')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    method === 'pay_at_collection'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>Pay at Home</span>
                </button>
              </div>
            </div>

            {/* Method Details Pane */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs">
              {method === 'upi' && (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Generated QR Code SVG */}
                  <div className="bg-white p-3 rounded-xl border-2 border-slate-300 shadow-xs flex flex-col items-center">
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      {/* Stylized QR Code */}
                      <rect width="100" height="100" fill="white" />
                      {/* Top left finder */}
                      <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="2" />
                      <rect x="9" y="9" width="20" height="20" fill="white" />
                      <rect x="13" y="13" width="12" height="12" fill="#0d9488" rx="1" />
                      {/* Top right finder */}
                      <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="2" />
                      <rect x="71" y="9" width="20" height="20" fill="white" />
                      <rect x="75" y="13" width="12" height="12" fill="#0d9488" rx="1" />
                      {/* Bottom left finder */}
                      <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="2" />
                      <rect x="9" y="71" width="20" height="20" fill="white" />
                      <rect x="13" y="75" width="12" height="12" fill="#0d9488" rx="1" />
                      {/* Data dots */}
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
                    <span className="text-[10px] font-mono text-slate-500 mt-1">aarogya.lab@axisbank</span>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{t.scanQrNotice}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Open Google Pay, PhonePe, Paytm, or BHIM. Scan QR and complete payment of <strong className="text-slate-900">₹{totalAmount}</strong>.
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Session expires in: {formatTimer(countdown)}</span>
                    </div>
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">{t.cardNumber}</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono bg-white focus:outline-teal-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">{t.expiry}</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono bg-white focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">{t.cvv}</label>
                      <input 
                        type="password" 
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono bg-white focus:outline-teal-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">{t.cardHolder}</label>
                    <input 
                      type="text" 
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-teal-600"
                    />
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-slate-600 font-medium">{t.bankSelect}</label>
                  <select
                    value={selectedBank}
                    onChange={e => setSelectedBank(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-teal-600 text-xs font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank (Instant Transfer)</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    You will be redirected to {selectedBank}&apos;s secure portal to authorize the payment.
                  </p>
                </div>
              )}

              {method === 'pay_at_collection' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Pay at Doorstep During Sample Pickup</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    You can pay the phlebotomist directly in cash or scan their handheld QR code using any UPI app once your blood sample is collected. No advance payment required!
                  </p>
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                    ✓ Phlebotomist carries exact change and digital thermal receipt printer.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying Payment...
                  </span>
                ) : (
                  <>
                    <span>
                      {method === 'pay_at_collection' ? t.confirmBooking : `${t.payNow} (₹${totalAmount})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
