import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  TrendingUp, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  CheckCircle2,
  Info
} from 'lucide-react';
import { HealthMetricPoint } from '../types';

interface TrendChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MetricKey = 'sugarFasting' | 'hbA1c' | 'cholesterol' | 'hemoglobin' | 'creatinine' | 'tsh';

interface MetricMeta {
  key: MetricKey;
  labelEn: string;
  labelHi: string;
  unit: string;
  refMin: number;
  refMax: number;
  normalRangeText: string;
  optimalText: string;
}

const METRICS_META: Record<MetricKey, MetricMeta> = {
  sugarFasting: {
    key: 'sugarFasting',
    labelEn: 'Fasting Blood Glucose',
    labelHi: 'फास्टिंग ब्लड ग्लूकोज',
    unit: 'mg/dL',
    refMin: 70,
    refMax: 100,
    normalRangeText: '70 - 100 mg/dL',
    optimalText: '< 100 mg/dL Normal, 100-125 Impaired, ≥ 126 Diabetic'
  },
  hbA1c: {
    key: 'hbA1c',
    labelEn: 'HbA1c (Glycated Hemoglobin)',
    labelHi: 'HbA1c (ग्लाइकेटेड हीमोग्लोबिन)',
    unit: '%',
    refMin: 4.0,
    refMax: 5.6,
    normalRangeText: '4.0% - 5.6%',
    optimalText: '< 5.7% Normal, 5.7%-6.4% Pre-diabetic, ≥ 6.5% Diabetic'
  },
  cholesterol: {
    key: 'cholesterol',
    labelEn: 'Total Cholesterol',
    labelHi: 'टोटल कोलेस्ट्रॉल',
    unit: 'mg/dL',
    refMin: 125,
    refMax: 200,
    normalRangeText: '< 200 mg/dL',
    optimalText: '< 200 Desirable, 200-239 Borderline, ≥ 240 High Risk'
  },
  hemoglobin: {
    key: 'hemoglobin',
    labelEn: 'Hemoglobin (Hb)',
    labelHi: 'हीमोग्लोबिन (Hb)',
    unit: 'g/dL',
    refMin: 13.0,
    refMax: 17.0,
    normalRangeText: '13.0 - 17.0 g/dL',
    optimalText: '13-17 g/dL for adult males, 12-15 g/dL for females'
  },
  creatinine: {
    key: 'creatinine',
    labelEn: 'Serum Creatinine',
    labelHi: 'सीरम क्रिएटिनिन',
    unit: 'mg/dL',
    refMin: 0.7,
    refMax: 1.3,
    normalRangeText: '0.7 - 1.3 mg/dL',
    optimalText: 'Critical marker of glomerular filtration rate (GFR)'
  },
  tsh: {
    key: 'tsh',
    labelEn: 'TSH (Thyroid Stimulating Hormone)',
    labelHi: 'TSH (थायरॉइड स्टिम्युलेटिंग हॉर्मोन)',
    unit: 'µIU/mL',
    refMin: 0.45,
    refMax: 4.5,
    normalRangeText: '0.45 - 4.5 µIU/mL',
    optimalText: 'Low indicates hyperthyroidism, high indicates hypothyroidism'
  }
};

export const TrendChartModal: React.FC<TrendChartModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t, language, healthTrends, patientMembers } = useApp();
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricKey>('sugarFasting');
  const [selectedMember, setSelectedMember] = useState<string>('Gaurav Giri');

  if (!isOpen) return null;

  const currentMeta = METRICS_META[selectedMetricKey];

  // Prepare chart points
  const points = healthTrends.map((d, index) => ({
    date: d.date,
    val: d[selectedMetricKey] as number,
    index
  })).filter(p => p.val !== undefined);

  const values = points.map(p => p.val);
  const minVal = Math.min(...values, currentMeta.refMin * 0.9);
  const maxVal = Math.max(...values, currentMeta.refMax * 1.1);
  const range = (maxVal - minVal) || 1;

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const getX = (idx: number) => paddingX + (idx / (points.length - 1)) * chartW;
  const getY = (val: number) => paddingY + chartH - ((val - minVal) / range) * chartH;

  // Safe zone shading Y
  const safeTopY = Math.max(paddingY, Math.min(svgHeight - paddingY, getY(currentMeta.refMax)));
  const safeBottomY = Math.max(paddingY, Math.min(svgHeight - paddingY, getY(currentMeta.refMin)));
  const safeHeight = Math.abs(safeBottomY - safeTopY);

  // SVG polyline string
  const polylinePoints = points.map(p => `${getX(p.index)},${getY(p.val)}`).join(' ');

  // Latest vs Initial delta
  const firstVal = points[0]?.val;
  const latestVal = points[points.length - 1]?.val;
  const delta = latestVal !== undefined && firstVal !== undefined ? Number((latestVal - firstVal).toFixed(2)) : 0;
  const isLatestNormal = latestVal !== undefined && latestVal >= currentMeta.refMin && latestVal <= currentMeta.refMax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Health Parameter Trends"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <TrendingUp className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {t.trendsTitle}
              </h2>
              <p className="text-xs text-cyan-200/90">
                {t.trendsSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Member & Metric Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            {/* Patient Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Patient:</span>
              <select
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-teal-600"
              >
                {patientMembers.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.relation})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Metric Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              {(Object.keys(METRICS_META) as MetricKey[]).map(key => {
                const meta = METRICS_META[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMetricKey(key)}
                    className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                      selectedMetricKey === key
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {language === 'hi' ? meta.labelHi : meta.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biomarker Stats Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Latest Test Value</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                {latestVal} <span className="text-xs font-normal text-slate-500">{currentMeta.unit}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Normal Reference Range</span>
              <span className="font-bold text-emerald-700 text-sm font-mono">
                {currentMeta.normalRangeText}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Overall Change</span>
              <span className={`font-bold text-sm flex items-center gap-1 ${
                delta > 0 ? 'text-amber-700' : delta < 0 ? 'text-emerald-700' : 'text-slate-600'
              }`}>
                {delta > 0 ? <ArrowUpRight className="w-4 h-4" /> : delta < 0 ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                {delta > 0 ? `+${delta}` : delta} {currentMeta.unit}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Health Status</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                isLatestNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isLatestNormal ? 'In Target Range ✓' : 'Monitor Recommended'}
              </span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>Biomarker Trajectory Over Last 5 Tests</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm inline-block" />
                Target Healthy Zone
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg 
                className="w-full min-w-[500px] h-56" 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              >
                {/* Safe zone background band */}
                <rect 
                  x={paddingX} 
                  y={safeTopY} 
                  width={chartW} 
                  height={safeHeight} 
                  fill="#ecfdf5" 
                  opacity="0.8" 
                />

                {/* Upper and Lower threshold reference dashed lines */}
                <line 
                  x1={paddingX} 
                  y1={getY(currentMeta.refMax)} 
                  x2={paddingX + chartW} 
                  y2={getY(currentMeta.refMax)} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={paddingX + 5} 
                  y={getY(currentMeta.refMax) - 5} 
                  fontSize="10" 
                  fill="#047857" 
                  fontWeight="bold"
                >
                  Max Normal: {currentMeta.refMax} {currentMeta.unit}
                </text>

                <line 
                  x1={paddingX} 
                  y1={getY(currentMeta.refMin)} 
                  x2={paddingX + chartW} 
                  y2={getY(currentMeta.refMin)} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  strokeWidth="1.5" 
                />

                {/* Trend Polyline */}
                <polyline
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />

                {/* Data Points */}
                {points.map((p) => {
                  const x = getX(p.index);
                  const y = getY(p.val);
                  return (
                    <g key={p.index} className="group cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#0d9488"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      {/* Value label */}
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#0f172a"
                      >
                        {p.val}
                      </text>
                      {/* Date label */}
                      <text
                        x={x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#64748b"
                      >
                        {p.date.split(' ')[0]} {p.date.split(' ')[1]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Clinical Context & Guidance */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong>Pathologist Clinical Guidance:</strong> {currentMeta.optimalText}. Maintaining consistent lifestyle, hydration, and regular 3-to-6 month monitoring prevents long-term vascular or metabolic risk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
