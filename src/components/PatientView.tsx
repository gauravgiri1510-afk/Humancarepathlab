import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Droplet, 
  Activity, 
  Heart, 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  Download,
  AlertTriangle,
  BadgePercent
} from 'lucide-react';
import { LabTest, Booking } from '../types';

interface PatientViewProps {
  onOpenBooking: (test?: LabTest) => void;
  onOpenReport: (reportId: string) => void;
  onOpenTrends: () => void;
}

export const PatientView: React.FC<PatientViewProps> = ({
  onOpenBooking,
  onOpenReport,
  onOpenTrends
}) => {
  const { 
    t, 
    language, 
    tests, 
    bookings, 
    reports, 
    setSelectedReport 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  // Filter tests
  const filteredTests = tests.filter(test => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      test.nameEn.toLowerCase().includes(q) ||
      test.nameHi.toLowerCase().includes(q) ||
      test.descriptionEn.toLowerCase().includes(q) ||
      test.descriptionHi.toLowerCase().includes(q) ||
      test.includedParameters.some(p => p.toLowerCase().includes(q));

    const matchesCategory = 
      selectedCategory === 'All' || test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 text-white p-6 sm:p-10 shadow-2xl border border-teal-700/40">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>{t.homeCollectionBadge}</span>
            <span className="text-teal-400">•</span>
            <span>{t.badgeNabl}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Quick CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-teal-950 font-black text-sm shadow-lg shadow-teal-900/40 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.heroCtaBook}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenTrends}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>{t.navTrends}</span>
            </button>
          </div>

          {/* Trust badges strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-teal-200 border-t border-teal-700/50">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.badgeE2ee}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t.badgeQuickTat}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>NABL & ISO 15189</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Droplet className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Sterile Vacuum Draw</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sample Tracking Widget (if bookings exist) */}
      {activeBookings.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {t.trackingTitle}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Active Pickups: {activeBookings.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeBookings.map(b => {
              const currentStatus = b.status;
              const isReportReady = currentStatus === 'report_ready';
              const matchedReport = reports.find(r => r.bookingId === b.id || r.id === b.reportId);

              // Steps array
              const steps = [
                { key: 'booked', label: t.statusBooked },
                { key: 'collector_assigned', label: t.statusCollectorAssigned },
                { key: 'sample_collected', label: t.statusSampleCollected },
                { key: 'in_lab', label: t.statusInLab },
                { key: 'report_ready', label: t.statusReportReady }
              ];

              const currentStepIdx = steps.findIndex(s => s.key === currentStatus);

              return (
                <div 
                  key={b.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-4"
                >
                  {/* Top info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          #{b.bookingRef}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {b.patientMember.name} ({b.patientMember.relation})
                        </span>
                        <span className="text-xs text-slate-500">
                          • {b.patientMember.age} Yrs
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Test: <strong>{b.tests.map(test => language === 'hi' ? test.nameHi : test.nameEn).join(', ')}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isReportReady && matchedReport ? (
                        <button
                          onClick={() => onOpenReport(matchedReport.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 hover:scale-[1.02] transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{t.viewReportBtn}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-teal-800 font-semibold bg-teal-100/70 px-3 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Scheduled: {b.scheduledDate} ({b.scheduledTimeSlot.split(' ')[0]} {b.scheduledTimeSlot.split(' ')[1]})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-5 gap-1 relative">
                      {steps.map((st, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={st.key} className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-teal-600 text-white shadow-2xs'
                                : 'bg-slate-200 text-slate-400'
                            } ${isCurrent ? 'ring-4 ring-teal-200 scale-110' : ''}`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-[11px] mt-1.5 font-semibold line-clamp-2 ${
                              isCurrent ? 'text-teal-900 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phlebotomist contact card */}
                  {b.phlebotomistName && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                          🚚
                        </div>
                        <div>
                          <span className="text-slate-500 text-[11px] block">{t.assignedPhlebo}</span>
                          <span className="font-bold text-slate-900">{b.phlebotomistName}</span>
                        </div>
                      </div>
                      {b.phlebotomistPhone && (
                        <a
                          href={`tel:${b.phlebotomistPhone}`}
                          className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 font-bold flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-600" />
                          <span>{t.callCollector}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Test Catalog & Booking Section */}
      <section className="space-y-4">
        {/* Search & Category Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.allTests}
            </h2>
            <p className="text-xs text-slate-500">
              Select any test or health package for doorstep blood collection
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-teal-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
          {[
            { id: 'All', labelEn: 'All Tests', labelHi: 'सभी टेस्ट' },
            { id: 'Full Body', labelEn: 'Full Body', labelHi: 'फुल बॉडी' },
            { id: 'Routine', labelEn: 'Routine (CBC)', labelHi: 'रूटीन (CBC)' },
            { id: 'Diabetes', labelEn: 'Diabetes', labelHi: 'डायबिटीज' },
            { id: 'Cardiology', labelEn: 'Heart & Lipid', labelHi: 'लिपिड' },
            { id: 'Thyroid', labelEn: 'Thyroid', labelHi: 'थायरॉइड' },
            { id: 'Kidney', labelEn: 'Kidney (KFT)', labelHi: 'किडनी' },
            { id: 'Liver', labelEn: 'Liver (LFT)', labelHi: 'लिवर' },
            { id: 'Vitamins', labelEn: 'Vitamins', labelHi: 'विटामिन' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => {
            const isExpanded = expandedTestId === test.id;
            const savingPercent = test.discountPrice 
              ? Math.round(((test.price - test.discountPrice) / test.price) * 100) 
              : 0;

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  {/* Top tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {test.code}
                    </span>
                    {savingPercent > 0 && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <BadgePercent className="w-3 h-3" />
                        {savingPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {language === 'hi' ? test.nameHi : test.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {language === 'hi' ? test.descriptionHi : test.descriptionEn}
                    </p>
                  </div>

                  {/* Key Test Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{test.tatHours} {t.hours} {t.tat}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{test.parametersCount} {t.parameters}</span>
                    </div>
                    <div className="col-span-2 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />
                      <span>
                        {test.fastingHours > 0 
                          ? `${test.fastingHours} ${t.fastingRequired}` 
                          : t.noFasting}
                      </span>
                    </div>
                  </div>

                  {/* Parameter Preview Expansion */}
                  <div>
                    <button
                      onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                      className="text-[11px] text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Parameters ▲' : `View ${test.parametersCount} Parameters ▼`}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 animate-in fade-in">
                        <div className="font-bold text-slate-800">Included Biomarkers:</div>
                        <ul className="list-disc list-inside space-y-0.5 pl-1">
                          {test.includedParameters.map((p, idx) => (
                            <li key={idx} className="truncate">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.price}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        ₹{test.discountPrice || test.price}
                      </span>
                      {test.discountPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{test.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(test)}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{t.bookNow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Patient Reports Vault Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>{t.navHistory}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Access and download digitally signed pathology reports anytime
            </p>
          </div>
          <button
            onClick={onOpenTrends}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.trendsTitle} →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reports.map(rep => (
            <div
              key={rep.id}
              onClick={() => onOpenReport(rep.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {rep.patientName}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({rep.patientAge} Yrs / {rep.patientGender})
                  </span>
                  {rep.criticalAlert && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      Critical Alert
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-teal-900">
                  {language === 'hi' ? rep.testNameHi : rep.testNameEn}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <span>Reported: {rep.reportedTime}</span>
                  <span>•</span>
                  <span>Barcode: #{rep.sampleBarcode}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                <Download className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
