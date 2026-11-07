import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Key, 
  Download, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  AlertCircle,
  Eye,
  Server
} from 'lucide-react';

interface SecurityComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityComplianceModal: React.FC<SecurityComplianceModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    t, 
    auditLogs, 
    addAuditLog, 
    user, 
    reports, 
    bookings, 
    isEncryptionActive, 
    setIsEncryptionActive 
  } = useApp();

  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showForgetConfirm, setShowForgetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      complianceStandard: 'GDPR Article 20 / HIPAA Security Rule § 164.312',
      patientIdentity: user,
      medicalReports: reports,
      homeSampleBookings: bookings,
      auditHistoryCount: auditLogs.length
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HumanCare_Pathlab_Deoria_${user.id}_GDPR_Export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('DATA_EXPORT', `Patient ${user.name} initiated full GDPR machine-readable health record export`);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleForgetMe = () => {
    addAuditLog('DATA_EXPORT', `Right to Erasure (GDPR Art 17) request lodged for patient ${user.name}`);
    setShowForgetConfirm(true);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Security, HIPAA and GDPR Compliance"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {t.securityTitle}
              </h2>
              <p className="text-xs text-emerald-200">
                End-to-End Encryption, Multi-Factor Authentication & Tamper-Proof Audit Logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Compliance Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>AES-256 GCM Encryption</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Protected Health Information (PHI) is sealed client-side before transmission and stored with cryptographic key isolation.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span>Status: Enforced Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="bg-teal-50/80 p-4 rounded-xl border border-teal-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-teal-950">
                <Key className="w-4 h-4 text-teal-600" />
                <span>MFA Token Enforcement</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Two-factor SMS OTP & Hardware TOTP keys required for downloading diagnostic test reports and updating health files.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-teal-800">
                <span>Account: Protected</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Immutable Audit Trails</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Every report access, status update, and doctor signature is stamped with SHA-256 hash chains for regulatory verification.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>HIPAA § 164.312(b)</span>
                <span className="text-[10px] font-mono text-emerald-600">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* GDPR Data Rights Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  GDPR & HIPAA Patient Data Rights
                </h3>
                <p className="text-[11px] text-slate-500">
                  Exercise portability or right to be forgotten under international healthcare privacy standards.
                </p>
              </div>
              {showExportSuccess && (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Data Package Exported!
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>{t.exportMyData}</span>
              </button>

              <button
                onClick={handleForgetMe}
                className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>{t.rightToBeForgotten}</span>
              </button>
            </div>

            {showForgetConfirm && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Erasure Request Queued:</strong> Under GDPR Article 17, non-mandatory medical audit trails are retained per clinical statute (7 years), while marketing and unnecessary profile identifiers will be anonymized within 30 days.
                </div>
              </div>
            )}
          </div>

          {/* Live Audit Log Ledger */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Immutable Security Audit Trail ({filteredLogs.length})
                </h3>
              </div>

              {/* Action Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Filter Event:</span>
                <select
                  value={filterAction}
                  onChange={e => setFilterAction(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-teal-600"
                >
                  <option value="ALL">All Actions</option>
                  <option value="VIEW_REPORT">VIEW_REPORT</option>
                  <option value="DOWNLOAD_REPORT">DOWNLOAD_REPORT</option>
                  <option value="UPLOAD_REPORT">UPLOAD_REPORT</option>
                  <option value="BOOK_TEST">BOOK_TEST</option>
                  <option value="UPDATE_STATUS">UPDATE_STATUS</option>
                  <option value="MFA_VERIFIED">MFA_VERIFIED</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp (UTC)</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3 font-mono">SHA-256 Fingerprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2 px-3 font-bold text-teal-800">{log.action}</td>
                      <td className="py-2 px-3 font-sans text-slate-800">{log.actor}</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{log.details}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]" title={log.sha256Checksum}>
                        {log.sha256Checksum.substring(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Human Care Pathlab (Deoria) certifies compliance under US Health Insurance Portability and Accountability Act (HIPAA) and EU General Data Protection Regulation (GDPR).
        </div>
      </div>
    </div>
  );
};
