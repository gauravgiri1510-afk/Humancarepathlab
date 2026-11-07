import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline, setIsOffline, t } = useApp();

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2.5 max-w-4xl">
        <div className="p-1 rounded-full bg-white/20">
          <WifiOff className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span className="font-extrabold">{t.offlineMode}: </span>
          <span className="text-amber-100">{t.offlineNotice}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block text-[11px] text-amber-200 font-mono">
          [IndexedDB / Local Encrypted Storage]
        </span>
        <button
          onClick={() => setIsOffline(false)}
          className="px-2.5 py-1 rounded bg-white text-amber-900 font-bold hover:bg-amber-100 text-[11px] flex items-center gap-1 transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Go Online</span>
        </button>
      </div>
    </div>
  );
};
