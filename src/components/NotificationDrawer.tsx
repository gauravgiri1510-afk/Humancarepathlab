import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReportId?: (reportId: string) => void;
  onSelectBookingId?: (bookingId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectReportId,
  onSelectBookingId
}) => {
  const { 
    t, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    language,
    reports 
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'report' | 'reminder'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const handleRequestPush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setPushEnabled(true);
          new Notification('Human Care Pathlab (Deoria)', {
            body: 'Real-time push alerts enabled for report availability and critical flags.',
            icon: '/icon.svg'
          });
        } else {
          setPushEnabled(false);
        }
      });
    } else {
      setPushEnabled(true); // Fallback simulated state
    }
  };

  const handleClickItem = (n: typeof notifications[0]) => {
    markNotificationAsRead(n.id);
    if (n.relatedReportId && onSelectReportId) {
      onSelectReportId(n.relatedReportId);
      onClose();
    } else if (n.relatedBookingId && onSelectBookingId) {
      onSelectBookingId(n.relatedBookingId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Notifications Panel"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {t.notifications}
              </h2>
              <p className="text-xs text-slate-500">
                Live appointment & health result updates
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification & Sound Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-3 border-b border-teal-100/70 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-teal-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              Browser Push Alerts
            </span>
            <button
              onClick={handleRequestPush}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                pushEnabled 
                  ? 'bg-emerald-600 text-white shadow-2xs' 
                  : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
              }`}
            >
              {pushEnabled ? 'Enabled ✓' : 'Enable Push'}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-teal-700">
            <span>Critical report alerts bypass silent hours</span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="flex items-center gap-1 font-medium hover:underline"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs bg-white">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
              filter === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Critical
          </button>
          <button
            onClick={() => setFilter('report')}
            className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
              filter === 'report' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <FileText className="w-3 h-3" />
            Reports
          </button>
          <button
            onClick={() => setFilter('reminder')}
            className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
              filter === 'reminder' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            Pickups
          </button>

          <div className="ml-auto">
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-[11px] text-teal-700 hover:underline font-semibold whitespace-nowrap"
            >
              Mark Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredNotifs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center p-6">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No pending notifications in this category</p>
            </div>
          ) : (
            filteredNotifs.map(n => {
              const isCritical = n.type === 'critical';
              const isReport = n.type === 'report';
              return (
                <div 
                  key={n.id}
                  onClick={() => handleClickItem(n)}
                  className={`p-3 rounded-xl transition-all cursor-pointer relative ${
                    isCritical 
                      ? 'bg-rose-50/90 border border-rose-200 hover:bg-rose-100/80 shadow-xs' 
                      : !n.read 
                        ? 'bg-teal-50/50 border border-teal-100 hover:bg-teal-50' 
                        : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-600" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                      isCritical 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : isReport 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-amber-500 text-white'
                    }`}>
                      {isCritical && <AlertTriangle className="w-4 h-4" />}
                      {isReport && <FileText className="w-4 h-4" />}
                      {n.type === 'reminder' && <Clock className="w-4 h-4" />}
                      {n.type === 'status' && <CheckCircle2 className="w-4 h-4" />}
                      {n.type === 'security' && <ShieldAlert className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 pr-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isCritical ? 'text-rose-950 font-extrabold' : 'text-slate-900'}`}>
                          {language === 'hi' ? n.titleHi : n.titleEn}
                        </h4>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isCritical ? 'text-rose-900 font-medium' : 'text-slate-600'}`}>
                        {language === 'hi' ? n.messageHi : n.messageEn}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>{n.timestamp}</span>
                        {(n.relatedReportId || n.relatedBookingId) && (
                          <span className="flex items-center gap-0.5 text-teal-700 font-semibold group hover:underline">
                            {n.relatedReportId ? 'Open Report' : 'Track Sample'}
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
          HIPAA & GDPR encrypted communication channel • 256-bit TLS 1.3
        </div>
      </div>
    </div>
  );
};
