import React, { useState } from 'react';
import { X, Download, Printer, Check, Compass, Building2, Sparkles, MapPin, Shield, Layers } from 'lucide-react';
import { Residence } from '../types/property';
import { BUILDING_SPECS } from '../data/residences';

interface DossierModalProps {
  residence: Residence;
  onClose: () => void;
  onLaunchTour: (res: Residence) => void;
  onScheduleShowing: (res: Residence) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  residence,
  onClose,
  onLaunchTour,
  onScheduleShowing
}) => {
  const [metricUnits, setMetricUnits] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeFormatted = metricUnits
    ? `${Math.round(residence.sizeSqFt * 0.092903)} m²`
    : `${residence.sizeSqFt.toLocaleString()} sq ft`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0a101cf8] border border-amber-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto">
        {/* Dossier Header */}
        <div className="relative p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-[#0d1524] to-[#121c30]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-amber-400 uppercase mb-1">
                <span>Architectural Monograph & Private Dossier</span>
                <span>·</span>
                <span>Confidential</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
                {residence.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                <span className="text-amber-400 font-semibold">{residence.unitCode}</span>
                <span>·</span>
                <span>Elevation: Level {residence.floor} of 54</span>
                <span>·</span>
                <span>{residence.exposure}</span>
                <span>·</span>
                <span className="text-white font-bold">{residence.priceFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                title="Print or Save PDF"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Hero Visual Presentation */}
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-900">
            <img
              src={residence.primaryImage}
              alt={residence.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="font-mono text-amber-300 drop-shadow">High-Resolution Architectural Capture</span>
              <button
                onClick={() => {
                  onClose();
                  onLaunchTour(residence);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-lg"
              >
                <span>Launch 360° Walkthrough</span>
              </button>
            </div>
          </div>

          {/* Unit Metric Toggle Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#101827] border border-white/10">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Total Residence Area</span>
                <button
                  onClick={() => setMetricUnits(!metricUnits)}
                  className="text-[10px] text-amber-400 hover:underline font-mono"
                >
                  {metricUnits ? 'FT²' : 'M²'}
                </button>
              </div>
              <span className="text-xl font-mono font-bold text-white tabular-nums">
                {sizeFormatted}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Floor-to-Ceiling Height</span>
              <span className="text-xl font-mono font-bold text-white">
                {residence.ceilingHeight}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Layout Configuration</span>
              <span className="text-xl font-mono font-bold text-white">
                {residence.bedrooms} Bed · {residence.bathrooms} Bath
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Estimated Monthly HOA</span>
              <span className="text-xl font-mono font-bold text-amber-400">
                {residence.hoaMonthly}
              </span>
            </div>
          </div>

          {/* Architectural Intent Statement */}
          <div>
            <h3 className="text-xl font-display text-white mb-2">Architectural Intent & Philosophy</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {residence.description}
            </p>
          </div>

          {/* Finishes & Engineering Specifications */}
          <div>
            <h3 className="text-xl font-display text-white mb-3">Finishes & Structural Engineering</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {residence.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-[#101827]/60 p-3 rounded-xl border border-white/5">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Private Client Advisor */}
          <div className="p-5 rounded-2xl bg-[#101827] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-display text-lg font-bold">
                VS
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                  Lead Residential Advisor
                </span>
                <h4 className="text-base font-display font-medium text-white">
                  Victoria Vance-Sinclair
                </h4>
                <p className="text-xs text-slate-400">
                  Senior Managing Director · Private Estates (+1 212-890-4100)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onScheduleShowing(residence);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap"
            >
              Request Private Showing
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#080d16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Offering by Prospectus Only. 888 Harbor Crest Boulevard.</span>
          </div>

          <button
            onClick={handleShareLink}
            className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
          >
            {copied ? '✓ Dossier Link Copied' : 'Share Confidential Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
