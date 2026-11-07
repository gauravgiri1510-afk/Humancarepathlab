import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Filter, 
  Plus, 
  Save, 
  FileUp,
  Tag,
  Stethoscope
} from 'lucide-react';
import { Booking, LabReport, TestParameter, ParameterStatus } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    t, 
    language, 
    bookings, 
    updateBookingStatus, 
    reports, 
    addReport, 
    tests, 
    auditLogs,
    setSelectedReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'uploadReport' | 'audit'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForReport, setSelectedBookingForReport] = useState<Booking | null>(null);

  // Report Generator Form State
  const [doctorName, setDoctorName] = useState('Dr. Sunita Kulkarni');
  const [doctorRegNo, setDoctorRegNo] = useState('MCI-64920/DMC');
  const [clinicalRemarks, setClinicalRemarks] = useState('All tested parameters are clinically reviewed and verified on calibrated automated analyzers.');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [customBarcode, setCustomBarcode] = useState(`AR-${Math.floor(100000 + Math.random() * 900000)}`);

  // Parameter values generator
  const [parameterInputs, setParameterInputs] = useState<Array<{
    name: string;
    value: number;
    unit: string;
    refMin: number;
    refMax: number;
    status: ParameterStatus;
  }>>([
    { name: 'Hemoglobin (Hb)', value: 14.5, unit: 'g/dL', refMin: 13.0, refMax: 17.0, status: 'normal' },
    { name: 'Total Leukocyte Count (WBC)', value: 7500, unit: 'cells/cu.mm', refMin: 4000, refMax: 11000, status: 'normal' },
    { name: 'Platelet Count', value: 230000, unit: 'cells/cu.mm', refMin: 150000, refMax: 450000, status: 'normal' },
    { name: 'Fasting Blood Glucose', value: 95, unit: 'mg/dL', refMin: 70, refMax: 100, status: 'normal' },
    { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', refMin: 125, refMax: 200, status: 'normal' }
  ]);

  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(q) ||
      b.patientMember.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  });

  const handleUpdateParamValue = (index: number, val: number) => {
    setParameterInputs(prev => {
      const copy = [...prev];
      const item = { ...copy[index], value: val };
      if (val < item.refMin) {
        item.status = val < item.refMin * 0.7 ? 'critical' : 'low';
      } else if (val > item.refMax) {
        item.status = val > item.refMax * 1.3 ? 'critical' : 'high';
      } else {
        item.status = 'normal';
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleStartReportForBooking = (b: Booking) => {
    setSelectedBookingForReport(b);
    setCustomBarcode(b.sampleBarcode || `AR-${Math.floor(100000 + Math.random() * 900000)}`);
    setActiveTab('uploadReport');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handlePublishReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReport) return;

    const b = selectedBookingForReport;
    const testToReport = b.tests[0] || tests[0];

    const hasCritical = parameterInputs.some(p => p.status === 'critical');
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newReport: LabReport = {
      id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: b.id,
      patientId: b.patientMember.id,
      patientName: b.patientMember.name,
      patientAge: b.patientMember.age,
      patientGender: b.patientMember.gender === 'male' ? 'Male' : b.patientMember.gender === 'female' ? 'Female' : 'Other',
      testId: testToReport.id,
      testNameEn: testToReport.nameEn,
      testNameHi: testToReport.nameHi,
      collectionTime: `${b.scheduledDate}, ${b.scheduledTimeSlot.split(' ')[0]} ${b.scheduledTimeSlot.split(' ')[1]}`,
      reportedTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      sampleBarcode: customBarcode,
      sampleType: testToReport.sampleType,
      referredBy: 'Dr. Anand Verma, MD (Internal Medicine)',
      pathologistName: doctorName,
      pathologistRegNo: doctorRegNo,
      parameters: parameterInputs.map((p, idx) => ({
        id: `param-gen-${idx}`,
        name: p.name,
        value: p.value,
        unit: p.unit,
        referenceMin: p.refMin,
        referenceMax: p.refMax,
        status: p.status,
        interpretation: p.status === 'critical' ? 'Urgent doctor review required' : p.status === 'normal' ? 'Within physiological baseline' : 'Borderline deviation'
      })),
      overallRemarksEn: clinicalRemarks,
      overallRemarksHi: 'परीक्षण परिणाम ऑटोमेटेड एनालाइजर पर सत्यापित किए गए हैं। सामान्य स्वास्थ्य के लिए नियमित जांच जारी रखें।',
      criticalAlert: hasCritical,
      isVerified: true,
      encryptedHash: randomHex,
      rawCiphertext: `U2FsdGVkX1+${randomHex.substring(0, 32)}[AES-256 SEALED]`
    };

    addReport(newReport);
    setSelectedBookingForReport(null);
    setUploadedFileName(null);
    setActiveTab('bookings');
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {t.adminTitle}
                </h1>
                <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Staff Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {t.adminSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
              <span className="text-xs text-indigo-200 block">Total Bookings</span>
              <span className="text-xl font-black text-white">{bookings.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
              <span className="text-xs text-emerald-200 block">Reports Live</span>
              <span className="text-xl font-black text-emerald-300">{reports.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.tabBookings} ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('uploadReport')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'uploadReport'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{t.tabUploadReport}</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.tabAudit} ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchOrders}
              className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredBookings.map(b => {
              const matchedReport = reports.find(r => r.bookingId === b.id);
              return (
                <div 
                  key={b.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        #{b.bookingRef}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {b.patientMember.name} ({b.patientMember.relation})
                      </span>
                      <span className="text-xs text-slate-500">
                        • {b.patientMember.age} Yrs / {b.patientMember.gender}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        b.status === 'report_ready' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'in_lab'
                            ? 'bg-cyan-100 text-cyan-800'
                            : b.status === 'sample_collected'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>🩺 Tests: <strong>{b.tests.map(t => language === 'hi' ? t.nameHi : t.nameEn).join(', ')}</strong></span>
                      <span>📅 Scheduled: <strong>{b.scheduledDate} ({b.scheduledTimeSlot})</strong></span>
                      <span>📍 Address: {b.address}</span>
                      <span>💵 Total: <strong>₹{b.totalAmount}</strong> ({b.paymentStatus === 'paid' ? 'Paid' : 'Pay at Home'})</span>
                      {b.phlebotomistName && (
                        <span>🚚 Collector: <strong>{b.phlebotomistName}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Status updater quick pills */}
                    <div className="flex items-center gap-1">
                      {b.status === 'booked' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'collector_assigned', {
                            phlebotomistName: 'Ramesh Singh (Certified)',
                            phlebotomistPhone: '+91 98765 43210'
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                        >
                          Dispatch Phlebo
                        </button>
                      )}

                      {b.status === 'collector_assigned' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'sample_collected', {
                            sampleBarcode: `AR-${Math.floor(100000 + Math.random() * 900000)}`
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold"
                        >
                          Mark Collected
                        </button>
                      )}

                      {b.status === 'sample_collected' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'in_lab')}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold"
                        >
                          Receive in Lab
                        </button>
                      )}

                      <button
                        onClick={() => handleStartReportForBooking(b)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{matchedReport ? 'Re-issue Report' : 'Enter Report'}</span>
                      </button>

                      {matchedReport && (
                        <button
                          onClick={() => setSelectedReport(matchedReport)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Report</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Upload / Enter Report */}
      {activeTab === 'uploadReport' && (
        <form onSubmit={handlePublishReport} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                {t.generateReportTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Input analyzer observation values or attach PDF report. All data is verified and digitally signed.
              </p>
            </div>

            {/* Select Target Booking */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Order:</span>
              <select
                value={selectedBookingForReport?.id || ''}
                onChange={e => {
                  const b = bookings.find(item => item.id === e.target.value) || null;
                  setSelectedBookingForReport(b);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-indigo-600"
              >
                <option value="">-- Choose Booking --</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    #{b.bookingRef} - {b.patientMember.name} ({b.tests[0]?.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pathologist Name</label>
              <input
                type="text"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Medical Council Reg. No</label>
              <input
                type="text"
                value={doctorRegNo}
                onChange={e => setDoctorRegNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sample Barcode Seal</label>
              <input
                type="text"
                value={customBarcode}
                onChange={e => setCustomBarcode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:outline-indigo-600"
              />
            </div>
          </div>

          {/* Dynamic Parameter Observations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Analyzer Measured Parameter Values
              </label>
              <span className="text-[11px] text-indigo-700 font-medium">
                Automatic Abnormal & Critical Threshold Detection
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5">Measured Value</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Reference Span</th>
                    <th className="p-2.5 text-right">Computed Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parameterInputs.map((param, idx) => (
                    <tr key={idx} className={param.status === 'critical' ? 'bg-rose-50/70' : param.status !== 'normal' ? 'bg-amber-50/50' : ''}>
                      <td className="p-2.5 font-medium text-slate-900">{param.name}</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          step="0.1"
                          value={param.value}
                          onChange={e => handleUpdateParamValue(idx, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 rounded border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-indigo-600"
                        />
                      </td>
                      <td className="p-2.5 text-slate-500 font-mono">{param.unit}</td>
                      <td className="p-2.5 text-slate-600 font-mono">{param.refMin} - {param.refMax}</td>
                      <td className="p-2.5 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          param.status === 'critical'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : param.status === 'normal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {param.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scanned Report / PDF Attachment */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-indigo-600" />
              <span>Attach External Scanned Lab Document or Instrument Printout (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Directly upload high-resolution analyzer scan. Embedded into patient&apos;s encrypted vault.
            </p>
            <div className="flex items-center gap-3">
              <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg cursor-pointer">
                <span>Choose File</span>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFileName ? (
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {uploadedFileName} (Attached)
                </span>
              ) : (
                <span className="text-slate-400">No file selected</span>
              )}
            </div>
          </div>

          {/* Clinical impression */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Pathologist Clinical Impression & Comments
            </label>
            <textarea
              rows={2}
              value={clinicalRemarks}
              onChange={e => setClinicalRemarks(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-indigo-600"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!selectedBookingForReport}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveAndPublish}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: HIPAA Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                {t.auditLogHeading}
              </h2>
              <p className="text-xs text-slate-500">
                Immutable, append-only security logs with SHA-256 integrity checksums for HIPAA & GDPR compliance.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
              TAMPER-PROOF LEDGER ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Event Details</th>
                  <th className="py-2.5 px-3 font-mono">SHA-256 Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-700">{log.action}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-800 font-semibold">{log.actor} ({log.role})</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{log.details}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono truncate max-w-[120px]" title={log.sha256Checksum}>
                      {log.sha256Checksum.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
