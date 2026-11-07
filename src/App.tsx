import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PatientView } from './components/PatientView';
import { AdminPanel } from './components/AdminPanel';
import { PhlebotomistView } from './components/PhlebotomistView';
import { BookingModal } from './components/BookingModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { TrendChartModal } from './components/TrendChartModal';
import { SecurityComplianceModal } from './components/SecurityComplianceModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { DownloadModal } from './components/DownloadModal';
import { LoginGate } from './components/LoginGate';
import { OfflineBanner } from './components/OfflineBanner';
import { LabTest, LabReport } from './types';
import { 
  ShieldCheck, 
  Activity, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    role, 
    setRole, 
    selectedReport, 
    setSelectedReport, 
    reports, 
    highContrast, 
    fontSize, 
    language, 
    setLanguage, 
    t,
    isAuthenticated
  } = useApp();

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingTest, setSelectedBookingTest] = useState<LabTest | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Mandatory Authentication Check: If user is not logged in via Mobile & OTP, show Login Gate!
  if (!isAuthenticated) {
    return <LoginGate />;
  }

  const handleOpenBooking = (test?: LabTest) => {
    setSelectedBookingTest(test || null);
    setIsBookingOpen(true);
  };

  const handleOpenReportById = (reportId: string) => {
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      setSelectedReport(rep);
    }
  };

  const fontSizeClass = 
    fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-900 transition-colors ${highContrast ? 'high-contrast bg-white' : ''} ${fontSizeClass}`}>
      {/* Offline Network Notification */}
      <OfflineBanner />

      {/* Main Top Header */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCompliance={() => setIsComplianceOpen(true)}
        onOpenTrends={() => setIsTrendsOpen(true)}
        onOpenMyReports={() => {
          if (reports.length > 0) {
            setSelectedReport(reports[0]);
          }
        }}
        onOpenMfa={() => setIsAuthOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Primary Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        {role === 'patient' && (
          <PatientView
            onOpenBooking={handleOpenBooking}
            onOpenReport={handleOpenReportById}
            onOpenTrends={() => setIsTrendsOpen(true)}
          />
        )}

        {role === 'admin' && <AdminPanel />}

        {role === 'phlebotomist' && <PhlebotomistView />}
      </main>

      {/* Trust & Legal Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand & Accreditation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span>Human Care Pathlab</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                NABL & ISO accredited reference pathology laboratory in Deoria, Uttar Pradesh. Owned and directed by <strong>Abhinav Ku. Giri</strong>. Doorstep blood sample collection with sealed cold-chain transit and rapid reporting.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-teal-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deoria Reg: HCP-UP-274001 / Lab ID: 639173</span>
              </div>
            </div>

            {/* Column 2: Popular Health Panels */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Popular Tests</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">Complete Blood Count (CBC) with ESR</button></li>
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">Full Body Comprehensive Health Panel</button></li>
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">HbA1c & Fasting Glucose Profile</button></li>
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">Lipid & Cardiovascular Risk Profile</button></li>
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">Thyroid Ultra-Sensitive Profile (T3, T4, TSH)</button></li>
                <li><button onClick={() => handleOpenBooking()} className="hover:text-teal-400">Vitamin D (25-OH) & Vitamin B12</button></li>
              </ul>
            </div>

            {/* Column 3: Security & Compliance */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">HIPAA & GDPR Privacy</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setIsComplianceOpen(true)} className="hover:text-teal-400">Security & Privacy Audit Ledger</button></li>
                <li><button onClick={() => setIsComplianceOpen(true)} className="hover:text-teal-400">AES-256 GCM Client Encryption</button></li>
                <li><button onClick={() => setIsComplianceOpen(true)} className="hover:text-teal-400">Export Health Data (GDPR Art 20)</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:text-teal-400">Two-Factor Authentication (MFA)</button></li>
                <li><button onClick={() => setIsTrendsOpen(true)} className="hover:text-teal-400">Biomarker History & Trends</button></li>
              </ul>
            </div>

            {/* Column 4: 24x7 Support & Contact */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Deoria Lab Contact</h4>
              <div className="text-[11px] space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <a href="tel:6391734767" className="hover:text-teal-300 font-bold">+91 6391734767 (Abhinav Ku. Giri)</a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>care@humancarepathlab.com</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Civil Lines / Main Road, Deoria, Uttar Pradesh - 274001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Human Care Pathlab (Prop: Abhinav Ku. Giri, Deoria). All rights reserved.</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">HIPAA & GDPR Standards Verified</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="hover:text-teal-400 flex items-center gap-1 font-semibold"
              >
                <Globe className="w-3 h-3 text-teal-400" />
                <span>{language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}</span>
              </button>
              <button onClick={() => setIsComplianceOpen(true)} className="hover:text-teal-400">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedTest={selectedBookingTest}
      />

      <ReportViewerModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <TrendChartModal
        isOpen={isTrendsOpen}
        onClose={() => setIsTrendsOpen(false)}
      />

      <SecurityComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectReportId={handleOpenReportById}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onOpenAdmin={() => setRole('admin')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
