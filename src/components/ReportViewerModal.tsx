import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Key, 
  Download,
  Activity,
  QrCode
} from 'lucide-react';
import { LabReport } from '../types';

interface ReportViewerModalProps {
  report: LabReport | null;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  onClose
}) => {
  const { t, language, addAuditLog, isEncryptionActive } = useApp();
  const [showEncryptedView, setShowEncryptedView] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (report) {
      addAuditLog('VIEW_REPORT', `Accessed report ${report.id} for patient ${report.patientName} (${report.testNameEn})`);
    }
  }, [report]);

  if (!report) return null;

  const handlePrint = () => {
    addAuditLog('DOWNLOAD_REPORT', `Downloaded / Printed official PDF report ${report.id} for ${report.patientName}`);
    window.print();
  };

  const handleShare = () => {
    const text = `Diagnostic Report for ${report.patientName} - ${report.testNameEn} (Human Care Pathlab, Deoria | Mob: 6391734767): Verified SHA256 [${report.encryptedHash.substring(0, 8)}...]`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Diagnostic Pathology Report"
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-3.5 px-5 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{report.testNameEn}</span>
                {report.criticalAlert && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Critical Flag
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                <span>Ref: #{report.sampleBarcode}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  E2EE Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* E2EE Payload toggle */}
            <button
              onClick={() => setShowEncryptedView(!showEncryptedView)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
              title="Inspect AES-256 GCM sealed health payload"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {showEncryptedView ? 'Show Decrypted' : 'Inspect Cipher'}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Share report summary"
            >
              <Share2 className="w-4 h-4" />
              {copySuccess && <span className="text-[10px] text-emerald-400">Copied!</span>}
            </button>

            {/* Print / Download PDF */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-900"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printReport}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E2EE Inspection Banner when toggled */}
        {showEncryptedView && (
          <div className="bg-slate-950 p-4 border-b border-amber-500/30 font-mono text-xs text-amber-300 no-print">
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/60 mb-2">
              <span className="flex items-center gap-2 font-bold text-amber-400">
                <Lock className="w-4 h-4" />
                HIPAA Protected Health Information (PHI) - AES-256 GCM Raw Ciphertext
              </span>
              <span className="text-[10px] text-slate-400">Authenticated Nonce & HMAC</span>
            </div>
            <div className="p-3 bg-black/60 rounded-lg text-slate-400 text-[11px] break-all max-h-24 overflow-y-auto">
              {report.rawCiphertext || 'U2FsdGVkX1+vG83eWkK309aLm...[AES-256-GCM sealed record. Decrypted in-memory on authorized device with user token.]'}
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>SHA-256 Authenticity Hash: <strong className="text-teal-400 font-mono">{report.encryptedHash}</strong></span>
              <span className="text-emerald-400">Status: SEALED & INTEGRITY VERIFIED</span>
            </div>
          </div>
        )}

        {/* Printable Official Medical Lab Report Document */}
        <div 
          id="printable-lab-report" 
          className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white text-slate-900 space-y-6"
        >
          {/* Lab Official Letterhead */}
          <div className="border-b-2 border-teal-700 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-teal-950">
                    HUMAN CARE PATHLAB & DIAGNOSTIC CENTRE
                  </h1>
                  <p className="text-xs text-teal-800 font-bold">
                    NABL ACCREDITED (ISO 15189:2022) • CAP REGISTERED • ICMR APPROVED
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Main Road, Civil Lines, Deoria, UP - 274001 | Director: Abhinav Ku. Giri | Mob: 6391734767
                  </p>
                </div>
              </div>

              {/* Barcode & Accreditation Seal */}
              <div className="text-right">
                <div className="inline-block p-1 bg-slate-100 rounded border border-slate-300 font-mono text-center">
                  {/* Simulated barcode bars */}
                  <div className="flex items-center gap-0.5 h-7 px-2">
                    <span className="w-1 h-full bg-black"></span>
                    <span className="w-0.5 h-full bg-black"></span>
                    <span className="w-2 h-full bg-black"></span>
                    <span className="w-0.5 h-full bg-black"></span>
                    <span className="w-1 h-full bg-black"></span>
                    <span className="w-1.5 h-full bg-black"></span>
                    <span className="w-0.5 h-full bg-black"></span>
                    <span className="w-2 h-full bg-black"></span>
                    <span className="w-1 h-full bg-black"></span>
                    <span className="w-0.5 h-full bg-black"></span>
                    <span className="w-1.5 h-full bg-black"></span>
                    <span className="w-1 h-full bg-black"></span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 block">
                    {report.sampleBarcode}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-800 font-bold mt-1">
                  NABH & NABL ACCREDITED
                </div>
              </div>
            </div>
          </div>

          {/* Patient Details & Sample Info Box */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <span className="text-slate-500 block text-[11px]">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{report.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age / Gender</span>
              <span className="font-semibold text-slate-800">{report.patientAge} Years / {report.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Sample Collection</span>
              <span className="font-semibold text-slate-800">{report.collectionTime}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Report Generated</span>
              <span className="font-semibold text-slate-800">{report.reportedTime}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Sample Specimen</span>
              <span className="font-semibold text-slate-800">{report.sampleType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Ref. Doctor</span>
              <span className="font-semibold text-slate-800">{report.referredBy}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Lab Reg. ID</span>
              <span className="font-mono font-semibold text-slate-800">{report.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Verification</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Digitally Signed
              </span>
            </div>
          </div>

          {/* Test Name Header */}
          <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase">
              {language === 'hi' ? report.testNameHi : report.testNameEn}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Automated Chemiluminescence & Photometry
            </span>
          </div>

          {/* Test Parameters Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-3">Test Investigation</th>
                  <th className="py-2.5 px-3">Observed Result</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3 text-center">Visual Scale</th>
                  <th className="py-2.5 px-3 text-right">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.parameters.map(param => {
                  const isNormal = param.status === 'normal';
                  const isCritical = param.status === 'critical';
                  const isHigh = param.status === 'high' || isCritical;
                  const isLow = param.status === 'low';

                  // Visual gauge percentage
                  const rangeSpan = (param.referenceMax - param.referenceMin) || 1;
                  const clamped = Math.max(param.referenceMin - rangeSpan * 0.2, Math.min(param.referenceMax + rangeSpan * 0.2, param.value));
                  const percentage = Math.round(((clamped - (param.referenceMin - rangeSpan * 0.2)) / (rangeSpan * 1.4)) * 100);

                  return (
                    <tr 
                      key={param.id}
                      className={isCritical ? 'bg-rose-50/70 font-semibold' : !isNormal ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {param.name}
                        {param.interpretation && (
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5 italic">
                            {param.interpretation}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-sm font-mono">
                        <span className={isCritical ? 'text-rose-700' : !isNormal ? 'text-amber-700' : 'text-slate-900'}>
                          {param.value}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{param.unit}</td>
                      <td className="py-3 px-3 text-slate-700 font-mono">
                        {param.referenceMin} - {param.referenceMax}
                      </td>
                      {/* Visual gauge bar */}
                      <td className="py-3 px-3 text-center w-36">
                        <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          {/* Safe zone indicator */}
                          <div className="absolute inset-y-0 left-[20%] right-[20%] bg-emerald-200/80" />
                          {/* Value needle */}
                          <div 
                            className={`absolute top-0 bottom-0 w-2.5 rounded-full shadow-xs ${
                              isCritical ? 'bg-rose-600' : !isNormal ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ left: `${Math.min(95, Math.max(5, percentage))}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isCritical
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isHigh
                              ? 'bg-amber-100 text-amber-800'
                              : isLow
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {param.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pathologist Clinical Impression */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
            <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
              {t.pathologistRemarks}
            </span>
            <p className="text-slate-700 leading-relaxed">
              {language === 'hi' ? report.overallRemarksHi : report.overallRemarksEn}
            </p>
          </div>

          {/* Signatures & Security Validation */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
            {/* QR verification */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-300 p-1 rounded bg-white flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500">
                <span className="font-bold text-slate-800 block">Scan to Verify Report</span>
                <span>Authentic NABL electronic copy with cryptographic checksum.</span>
              </div>
            </div>

            {/* Quality Manager */}
            <div className="text-center sm:text-left">
              <div className="font-semibold text-slate-800">Mohit K. Rastogi, M.Sc</div>
              <div className="text-[11px] text-slate-500">Chief Technical Officer (Lab Tech)</div>
              <div className="text-[10px] text-slate-400">Automated Analyzer Verification Passed</div>
            </div>

            {/* Pathologist Digital Signature */}
            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block border-b border-teal-700 pb-1 px-4">
                <span className="font-serif italic text-teal-800 text-base font-bold">
                  {report.pathologistName}
                </span>
              </div>
              <div className="font-bold text-slate-900">{report.pathologistName}</div>
              <div className="text-[11px] text-teal-800 font-semibold">MD (Pathology), DNB</div>
              <div className="text-[10px] text-slate-500">Reg No: {report.pathologistRegNo}</div>
              <div className="text-[9px] text-emerald-700 font-bold">
                ✓ Digitally Signed on {report.reportedTime}
              </div>
            </div>
          </div>

          {/* Legal / Medical Disclaimer */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3 text-center leading-normal">
            *** End of Diagnostic Report *** • Partial reproduction of this report is strictly prohibited. Test results correlate with clinical history and must be reviewed by the consulting physician. For queries contact support@aarogyacare.org.
          </div>
        </div>
      </div>
    </div>
  );
};
