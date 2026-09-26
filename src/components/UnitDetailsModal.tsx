import React from 'react';
import { X, Eye, Calendar, Check, Compass, Download, ShieldCheck, MapPin } from 'lucide-react';
import { Residence } from '../types/property';

interface UnitDetailsModalProps {
  residence: Residence;
  onClose: () => void;
  onOpenTour: (residence: Residence, roomId?: string) => void;
  onBookShowing: (residence: Residence) => void;
  onFocusOnTower: (residence: Residence) => void;
}

export const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({
  residence,
  onClose,
  onOpenTour,
  onBookShowing,
  onFocusOnTower
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0e1626] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header Hero Area */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={residence.primaryImage}
            alt={residence.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1626] via-[#0e1626]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero text overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
              <span>{residence.unitCode}</span>
              <span>·</span>
              <span>Level {residence.floor}</span>
              <span>·</span>
              <span>{residence.wing}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
              {residence.title}
            </h2>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {residence.priceFormatted}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {residence.hoaMonthly}
              </span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141f33] border border-white/5">
            <div>
              <span className="text-xs text-slate-400 block">Interior Area</span>
              <span className="text-base font-mono font-semibold text-white">
                {residence.sizeSqFt.toLocaleString()} sq ft
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Layout</span>
              <span className="text-base font-mono font-semibold text-white">
                {residence.bedrooms} Bed / {residence.bathrooms} Bath
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Ceiling Height</span>
              <span className="text-base font-mono font-semibold text-white">
                {residence.ceilingHeight}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Exposure</span>
              <span className="text-base text-amber-400 font-medium truncate block">
                {residence.exposure}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-display text-white mb-2">Architectural Statement</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {residence.description}
            </p>
          </div>

          {/* 360 Tour Interactive Rooms Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-display text-white">
                360° Virtual Tour Spaces ({residence.rooms.length} Rooms)
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenTour(residence);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Launch Full 360 Tour</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {residence.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    onClose();
                    onOpenTour(residence, room.id);
                  }}
                  className="group relative h-28 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/50 transition-all shadow-md"
                >
                  <img
                    src={room.panoramaImage}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors block">
                        {room.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {room.hotspots.length} interactive navigation points
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Bespoke Features */}
          <div>
            <h3 className="text-lg font-display text-white mb-3">Key Features & Finishes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {residence.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onFocusOnTower(residence);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Inspect on 3D Tower Model</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenTour(residence);
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Launch 360° Tour</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookShowing(residence);
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Showing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
