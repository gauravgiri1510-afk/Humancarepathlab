import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  ArrowRight
} from 'lucide-react';
import { LabTest, PatientMember } from '../types';
import { PaymentModal } from './PaymentModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTest?: LabTest | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedTest
}) => {
  const { 
    t, 
    language, 
    tests, 
    patientMembers, 
    addPatientMember, 
    addBooking, 
    user 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>(() => {
    return selectedTest ? [selectedTest] : [tests[0]];
  });

  const [selectedMemberId, setSelectedMemberId] = useState<string>(patientMembers[0]?.id || 'p-1');
  const [showAddMember, setShowAddMember] = useState(false);

  // New member inputs
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAge, setNewMemberAge] = useState<number>(30);
  const [newMemberGender, setNewMemberGender] = useState<'male' | 'female' | 'other'>('male');
  const [newMemberRelation, setNewMemberRelation] = useState<PatientMember['relation']>('Spouse');
  const [newMemberConditions, setNewMemberConditions] = useState('');

  // Date and Time Slot
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [scheduledDate, setScheduledDate] = useState<string>(tomorrowStr);
  const [scheduledSlot, setScheduledSlot] = useState<string>('06:30 AM - 07:30 AM (Fasting)');

  // Address
  const [address, setAddress] = useState<string>(user.address || 'Civil Lines, Near Subhash Chowk, Deoria');
  const [pincode, setPincode] = useState<string>('274001');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [fastingConfirmed, setFastingConfirmed] = useState<boolean>(true);

  // Payment flow state
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!isOpen) return null;

  const currentMember = patientMembers.find(m => m.id === selectedMemberId) || patientMembers[0];

  // Calculate pricing
  const totalAmount = selectedTests.reduce((acc, t) => acc + (t.discountPrice || t.price), 0);
  const requiresFasting = selectedTests.some(t => t.fastingHours > 0);
  const maxFastingHours = Math.max(...selectedTests.map(t => t.fastingHours), 0);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const created = addPatientMember({
      name: newMemberName.trim(),
      age: Number(newMemberAge) || 25,
      gender: newMemberGender,
      relation: newMemberRelation,
      existingConditions: newMemberConditions
    });
    setSelectedMemberId(created.id);
    setShowAddMember(false);
    setNewMemberName('');
  };

  const toggleTestSelection = (test: LabTest) => {
    if (selectedTests.some(t => t.id === test.id)) {
      if (selectedTests.length > 1) {
        setSelectedTests(selectedTests.filter(t => t.id !== test.id));
      }
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (method: 'upi' | 'card' | 'netbanking' | 'pay_at_collection', paymentId: string) => {
    setShowPaymentModal(false);

    // Add booking to context
    addBooking({
      patientMember: currentMember,
      tests: selectedTests,
      totalAmount,
      paymentMethod: method,
      paymentStatus: method === 'pay_at_collection' ? 'pending' : 'paid',
      paymentId,
      scheduledDate,
      scheduledTimeSlot: scheduledSlot,
      address,
      pincode,
      status: 'booked',
      fastingConfirmed,
      specialInstructions
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
        <div 
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="Book Home Blood Test"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-teal-200 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t.homeCollectionBadge}
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                {t.bookTestTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-center">
            <button
              onClick={() => setStep(1)}
              className={`py-3 px-2 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                step === 1 ? 'border-teal-600 text-teal-800 bg-teal-50/50 font-bold' : 'border-transparent text-slate-500'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.step1Patient}</span>
            </button>
            <button
              onClick={() => setStep(2)}
              className={`py-3 px-2 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                step === 2 ? 'border-teal-600 text-teal-800 bg-teal-50/50 font-bold' : 'border-transparent text-slate-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.step2Slot}</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className={`py-3 px-2 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                step === 3 ? 'border-teal-600 text-teal-800 bg-teal-50/50 font-bold' : 'border-transparent text-slate-500'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.step3Address}</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Tests & Patient Member */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Tests to be booked */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Selected Blood Tests ({selectedTests.length})
                    </label>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      Total: ₹{totalAmount}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tests.map(test => {
                      const isChecked = selectedTests.some(t => t.id === test.id);
                      return (
                        <div
                          key={test.id}
                          onClick={() => toggleTestSelection(test)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isChecked 
                              ? 'border-teal-600 bg-teal-50/70 shadow-xs' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {language === 'hi' ? test.nameHi : test.nameEn}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>₹{test.discountPrice || test.price}</span>
                              <span>•</span>
                              <span>{test.parametersCount} {t.parameters}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fasting Notice Banner */}
                {requiresFasting && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Fasting Requirement:</strong> This test profile requires{' '}
                      <strong>{maxFastingHours} hours</strong> of overnight fasting. Only plain water is allowed before the sample is drawn.
                    </div>
                  </div>
                )}

                {/* Patient selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      {t.selectPatient}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddMember(!showAddMember)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.addPatient}
                    </button>
                  </div>

                  {showAddMember && (
                    <form onSubmit={handleCreateMember} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-3 space-y-3">
                      <div className="font-bold text-slate-800">Add Family Member Profile</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 mb-1">{t.patientName}</label>
                          <input
                            type="text"
                            required
                            value={newMemberName}
                            onChange={e => setNewMemberName(e.target.value)}
                            placeholder="e.g. Ramesh Giri"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1">{t.relation}</label>
                          <select
                            value={newMemberRelation}
                            onChange={e => setNewMemberRelation(e.target.value as PatientMember['relation'])}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Self">Self</option>
                            <option value="Father">Father (पिता)</option>
                            <option value="Mother">Mother (माता)</option>
                            <option value="Spouse">Spouse (पति/पत्नी)</option>
                            <option value="Son">Son (पुत्र)</option>
                            <option value="Daughter">Daughter (पुत्री)</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1">{t.patientAge}</label>
                          <input
                            type="number"
                            min={1}
                            max={120}
                            value={newMemberAge}
                            onChange={e => setNewMemberAge(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1">{t.patientGender}</label>
                          <select
                            value={newMemberGender}
                            onChange={e => setNewMemberGender(e.target.value as 'male' | 'female' | 'other')}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="male">{t.male}</option>
                            <option value="female">{t.female}</option>
                            <option value="other">{t.other}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">{t.existingCondition}</label>
                        <input
                          type="text"
                          value={newMemberConditions}
                          onChange={e => setNewMemberConditions(e.target.value)}
                          placeholder="e.g. Diabetic, High BP, Thyroid medication"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddMember(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600"
                        >
                          {t.cancel}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold"
                        >
                          Save Member
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {patientMembers.map(member => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedMemberId === member.id
                            ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{member.name}</span>
                          <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                            {member.relation}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {member.age} Yrs • {member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}
                        </div>
                        {member.existingConditions && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 truncate">
                            {member.existingConditions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                  >
                    <span>Next: Choose Pickup Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slot */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.preferredDate}
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:outline-teal-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      {t.preferredSlot}
                    </label>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {t.slotFastingNote}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      { slot: '06:30 AM - 07:30 AM (Fasting)', recommended: true },
                      { slot: '07:30 AM - 08:30 AM (Fasting)', recommended: true },
                      { slot: '08:30 AM - 09:30 AM (Fasting)', recommended: false },
                      { slot: '09:30 AM - 10:30 AM', recommended: false },
                      { slot: '11:00 AM - 12:30 PM', recommended: false },
                      { slot: '04:00 PM - 05:30 PM (Evening Routine)', recommended: false },
                    ].map(item => (
                      <button
                        key={item.slot}
                        type="button"
                        onClick={() => setScheduledSlot(item.slot)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          scheduledSlot === item.slot
                            ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span>{item.slot}</span>
                        </div>
                        {item.recommended && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Recommended
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200/80 text-xs text-teal-900 flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    Our vaccinated phlebotomist will arrive with sterile needle vacuum tubes and ice pack cold-chain carriers.
                  </span>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                  >
                    <span>Next: Address Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Address & Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.addressLine}
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    placeholder="e.g. Flat 402, Tower B, Green Valley Apartments"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t.pincode}
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="e.g. 201301"
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t.specialInstructions}
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={e => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Call when outside gate"
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-teal-600"
                    />
                  </div>
                </div>

                {/* Fasting Confirmation Checkbox */}
                {requiresFasting && (
                  <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-amber-950 font-medium">
                      <input
                        type="checkbox"
                        checked={fastingConfirmed}
                        onChange={e => setFastingConfirmed(e.target.checked)}
                        className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>
                        {t.fastingAgreement} ({maxFastingHours} hours fasting).
                      </span>
                    </label>
                  </div>
                )}

                {/* Final Order Review Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-800 border-b pb-2">
                    <span>Patient: {currentMember?.name} ({currentMember?.relation})</span>
                    <span className="text-teal-700">₹{totalAmount} Total</span>
                  </div>
                  <div className="text-slate-600 text-[11px] space-y-1">
                    <div>📅 Scheduled Date: <strong>{scheduledDate}</strong></div>
                    <div>⏰ Preferred Slot: <strong>{scheduledSlot}</strong></div>
                    <div>📍 Doorstep Address: <strong>{address}, PIN {pincode}</strong></div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.proceedToPayment} (₹{totalAmount})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tests={selectedTests}
        totalAmount={totalAmount}
        patientName={currentMember?.name || 'Patient'}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};
