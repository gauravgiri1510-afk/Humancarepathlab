import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  UserRole, 
  UserProfile, 
  PatientMember, 
  LabTest, 
  LabReport, 
  Booking, 
  HealthMetricPoint, 
  AppNotification, 
  AuditLogEntry,
  BookingStatus
} from '../types';
import { 
  INITIAL_PATIENT_MEMBERS, 
  LAB_TESTS, 
  INITIAL_REPORTS, 
  INITIAL_BOOKINGS, 
  HEALTH_TRENDS_DATA, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { translations } from '../translations/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  isMfaAuthenticated: boolean;
  setIsMfaAuthenticated: (val: boolean) => void;
  patientMembers: PatientMember[];
  addPatientMember: (member: Omit<PatientMember, 'id'>) => PatientMember;
  tests: LabTest[];
  bookings: Booking[];
  addBooking: (newBooking: Omit<Booking, 'id' | 'bookingRef' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, extra?: Partial<Booking>) => void;
  reports: LabReport[];
  addReport: (report: LabReport) => void;
  selectedReport: LabReport | null;
  setSelectedReport: (report: LabReport | null) => void;
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  healthTrends: HealthMetricPoint[];
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: AuditLogEntry['action'], details: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (val: 'normal' | 'large' | 'xlarge') => void;
  isEncryptionActive: boolean;
  setIsEncryptionActive: (val: boolean) => void;
  showMfaModal: boolean;
  setShowMfaModal: (val: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('aarogya_lang') as Language) || 'hi';
  });

  const [role, setRole] = useState<UserRole>('patient');
  const [isMfaAuthenticated, setIsMfaAuthenticated] = useState<boolean>(true);
  const [showMfaModal, setShowMfaModal] = useState<boolean>(false);

  // Mandatory Mobile & OTP Authentication Gate state (defaults to false when app is opened!)
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    return sessionStorage.getItem('humancare_auth') === 'true';
  });
  const [userPhone, setUserPhoneState] = useState<string>(() => {
    return sessionStorage.getItem('humancare_phone') || '';
  });

  const setIsAuthenticated = (val: boolean) => {
    setIsAuthenticatedState(val);
    sessionStorage.setItem('humancare_auth', val ? 'true' : 'false');
  };

  const setUserPhone = (val: string) => {
    setUserPhoneState(val);
    sessionStorage.setItem('humancare_phone', val);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserPhone('');
    sessionStorage.removeItem('humancare_auth');
    sessionStorage.removeItem('humancare_phone');
  };

  const [user] = useState<UserProfile>({
    id: 'usr-901',
    name: 'Abhinav Ku. Giri',
    email: 'abhinav.giri@humancarepathlab.com',
    phone: '+91 6391734767',
    gender: 'male',
    age: 32,
    bloodGroup: 'B Positive',
    address: 'Civil Lines, Deoria, Uttar Pradesh - 274001',
    mfaEnabled: true,
    role: 'patient'
  });

  const [patientMembers, setPatientMembers] = useState<PatientMember[]>(() => {
    const saved = localStorage.getItem('aarogya_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENT_MEMBERS;
  });

  const [tests] = useState<LabTest[]>(LAB_TESTS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aarogya_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reports, setReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('aarogya_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('aarogya_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [healthTrends] = useState<HealthMetricPoint[]>(HEALTH_TRENDS_DATA);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('aarogya_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isEncryptionActive, setIsEncryptionActive] = useState<boolean>(true);

  // Sync language preference
  useEffect(() => {
    localStorage.setItem('aarogya_lang', language);
  }, [language]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('aarogya_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aarogya_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('aarogya_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('aarogya_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aarogya_patients', JSON.stringify(patientMembers));
  }, [patientMembers]);

  // Network offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = translations[language];

  const addAuditLog = (action: AuditLogEntry['action'], details: string) => {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action,
      actor: role === 'patient' ? user.name : role === 'admin' ? 'Dr. Sunita Kulkarni (MD Path)' : 'Phlebotomist Team',
      role,
      details,
      ipHash: '7a13c901e1295b90f4c8996fa127ae41e4649b934ca495991b7852b855909121',
      sha256Checksum: randomHex,
      hipaaCompliant: true
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addPatientMember = (member: Omit<PatientMember, 'id'>): PatientMember => {
    const newMember: PatientMember = {
      ...member,
      id: `p-${Date.now()}`
    };
    setPatientMembers(prev => [...prev, newMember]);
    addAuditLog('BOOK_TEST', `Added patient profile: ${newMember.name} (${newMember.relation})`);
    return newMember;
  };

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'bookingRef' | 'createdAt'>): Booking => {
    const id = `bk-${Date.now()}`;
    const bookingRef = `AAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 16);

    const booking: Booking = {
      ...newBookingData,
      id,
      bookingRef,
      createdAt
    };

    setBookings(prev => [booking, ...prev]);

    // Send confirmation notification
    addNotification({
      titleEn: `Home Sample Booked: ${booking.bookingRef}`,
      titleHi: `होम सैंपल कलेक्शन बुक हुआ: ${booking.bookingRef}`,
      messageEn: `Scheduled for ${booking.scheduledDate} (${booking.scheduledTimeSlot}). Phlebotomist will be dispatched with sterile gear.`,
      messageHi: `${booking.scheduledDate} (${booking.scheduledTimeSlot}) के लिए तय। फ्लेबोटोमिस्ट सुरक्षा किट के साथ आएगा।`,
      type: 'status',
      relatedBookingId: id
    });

    addAuditLog('BOOK_TEST', `Home collection booked ${booking.bookingRef} for ${booking.patientMember.name}`);
    return booking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, extra?: Partial<Booking>) => {
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return {
          ...bk,
          status,
          ...extra
        };
      }
      return bk;
    }));

    // Trigger appropriate notification
    const matched = bookings.find(b => b.id === bookingId);
    if (matched) {
      if (status === 'collector_assigned') {
        addNotification({
          titleEn: `Phlebotomist Dispatched for ${matched.bookingRef}`,
          titleHi: `सैंपल कलेक्टर रवाना हुआ (${matched.bookingRef})`,
          messageEn: `Your phlebotomist ${extra?.phlebotomistName || 'Collector'} is en route for doorstep sample draw.`,
          messageHi: `आपके पते पर सैंपल लेने के लिए कलेक्टर निकल चुके हैं।`,
          type: 'reminder',
          relatedBookingId: bookingId
        });
      } else if (status === 'sample_collected') {
        addNotification({
          titleEn: `Sample Collected & Barcoded: ${extra?.sampleBarcode || matched.sampleBarcode || 'SEALED'}`,
          titleHi: `सैंपल सफलतापूर्वक कलेक्ट व बारकोड सील हुआ`,
          messageEn: 'Blood tube placed in temperature-monitored cold-chain carrier bag to central testing hub.',
          messageHi: 'रक्त सैंपल को तापमान-नियंत्रित बैग में सुरक्षित रख दिया गया है।',
          type: 'status',
          relatedBookingId: bookingId
        });
      } else if (status === 'in_lab') {
        addNotification({
          titleEn: 'Sample Processing on Automated Analyzers',
          titleHi: 'सैंपल की लैब में स्वचालित जांच शुरू',
          messageEn: 'Sample verified by laboratory technician and fed to automated analyzer.',
          messageHi: 'सैंपल लैब पहुंच चुका है और मशीनों द्वारा परीक्षण प्रक्रिया जारी है।',
          type: 'status',
          relatedBookingId: bookingId
        });
      } else if (status === 'report_ready') {
        addNotification({
          titleEn: 'Diagnostic Report Ready to Download!',
          titleHi: 'जांच रिपोर्ट तैयार है, तुरंत डाउनलोड करें!',
          messageEn: `Pathologist verified report for ${matched.bookingRef} is ready in your dashboard.`,
          messageHi: `आपकी टेस्ट रिपोर्ट डॉ. द्वारा हस्ताक्षरित होकर उपलब्ध है।`,
          type: 'report',
          relatedBookingId: bookingId,
          relatedReportId: extra?.reportId || matched.reportId
        });
      }
    }

    addAuditLog('UPDATE_STATUS', `Status updated to ${status} for booking ${bookingId}`);
  };

  const addReport = (report: LabReport) => {
    setReports(prev => [report, ...prev]);

    // Update the booking with reportId and status report_ready
    if (report.bookingId) {
      updateBookingStatus(report.bookingId, 'report_ready', { reportId: report.id });
    }

    // Check for critical alert
    if (report.criticalAlert) {
      addNotification({
        titleEn: `CRITICAL ALERT: ${report.testNameEn}`,
        titleHi: `गंभीर स्वास्थ्य चेतावनी: ${report.testNameHi}`,
        messageEn: `One or more biomarkers in ${report.patientName}'s report exceed safe clinical thresholds. Please consult a doctor immediately.`,
        messageHi: `${report.patientName} की रिपोर्ट में कुछ पैरामीटर सामान्य से अधिक या कम हैं। कृपया तुरंत चिकित्सक से संपर्क करें।`,
        type: 'critical',
        relatedReportId: report.id,
        relatedBookingId: report.bookingId
      });
    }

    addAuditLog('UPLOAD_REPORT', `New verified report ${report.id} released for ${report.patientName} (${report.testNameEn})`);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Audio chime or toast can be played
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch {
      // Audio playback fails silently in non-interacted tab
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        role,
        setRole,
        user,
        isMfaAuthenticated,
        setIsMfaAuthenticated,
        patientMembers,
        addPatientMember,
        tests,
        bookings,
        addBooking,
        updateBookingStatus,
        reports,
        addReport,
        selectedReport,
        setSelectedReport,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        healthTrends,
        auditLogs,
        addAuditLog,
        isOffline,
        setIsOffline,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        isEncryptionActive,
        setIsEncryptionActive,
        showMfaModal,
        setShowMfaModal,
        isAuthenticated,
        setIsAuthenticated,
        userPhone,
        setUserPhone,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
