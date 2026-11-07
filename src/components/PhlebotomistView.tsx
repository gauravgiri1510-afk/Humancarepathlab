import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Barcode, 
  ShieldCheck, 
  Clock, 
  ThermometerSnowflake, 
  AlertCircle
} from 'lucide-react';
import { Booking } from '../types';

export const PhlebotomistView: React.FC = () => {
  const { bookings, updateBookingStatus, language, t } = useApp();
  const [activeBarcode, setActiveBarcode] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Active home visits for today
  const pendingVisits = bookings.filter(b => b.status === 'booked' || b.status === 'collector_assigned');
  const completedVisits = bookings.filter(b => b.status === 'sample_collected' || b.status === 'in_lab' || b.status === 'report_ready');

  const handleCollectSample = (b: Booking) => {
    const generatedBarcode = activeBarcode.trim() || `AR-${Math.floor(100000 + Math.random() * 900000)}`;
    updateBookingStatus(b.id, 'sample_collected', {
      sampleBarcode: generatedBarcode,
      phlebotomistName: 'Ramesh Singh (Certified)'
    });
    setSelectedBooking(null);
    setActiveBarcode('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Phlebotomist Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Truck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wide">
                Field Phlebotomy App
              </span>
              <h1 className="text-xl font-bold">Doorstep Sample Collector Queue</h1>
              <p className="text-xs text-amber-100">Ramesh Singh (ID #PHL-9021) • Central Hub Route</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/40 p-2 rounded-xl text-xs">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-300" />
            <span>Carrier Cold-Chain: <strong>4.2°C (Optimal)</strong></span>
          </div>
        </div>
      </div>

      {/* Checklist Reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          <span>Verify 10-12 hr fasting status</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          <span>Apply vacuum tube barcode seal</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          <span>Place specimen immediately in cold pack</span>
        </div>
      </div>

      {/* Pending Visits */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Scheduled Home Pickups Today ({pendingVisits.length})</span>
        </h2>

        {pendingVisits.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No pending pickups for this slot. All assigned samples are collected!
          </div>
        ) : (
          pendingVisits.map(b => (
            <div 
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{b.patientMember.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      {b.patientMember.relation} • {b.patientMember.age} Yrs
                    </span>
                  </div>
                  <span className="text-xs font-mono text-indigo-700 font-bold">#{b.bookingRef}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919876543210"
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Call Patient</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{b.address}, PIN {b.pincode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Scheduled Slot: <strong>{b.scheduledTimeSlot}</strong></span>
                </div>
              </div>

              {b.specialInstructions && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                  <span className="font-semibold text-slate-900">Patient Note:</span> {b.specialInstructions}
                </div>
              )}

              {/* Sample Collection Action Box */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Barcode className="w-5 h-5 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Scan / Enter Tube Barcode..."
                    value={activeBarcode}
                    onChange={e => setActiveBarcode(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:outline-amber-600 w-full sm:w-48"
                  />
                </div>

                <button
                  onClick={() => handleCollectSample(b)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Sample Draw & Cold Seal</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Collection History */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Completed & Dispatched to Central Lab ({completedVisits.length})</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completedVisits.map(b => (
            <div key={b.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{b.patientMember.name}</span>
                <span className="font-mono text-emerald-700">{b.sampleBarcode || 'SEALED'}</span>
              </div>
              <div className="text-slate-500">Ref: #{b.bookingRef} • Status: {b.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
