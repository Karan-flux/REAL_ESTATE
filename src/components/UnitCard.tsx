import React from 'react';
import { Eye, Compass, ArrowUpRight, BedDouble, Bath, Maximize2, Layers } from 'lucide-react';
import { Residence } from '../types/property';

interface UnitCardProps {
  residence: Residence;
  onOpenTour: (residence: Residence) => void;
  onFocusTower: (residence: Residence) => void;
  onSelectDetails: (residence: Residence) => void;
  onOpenDossier?: (residence: Residence) => void;
  onOpenCalculator?: (residence: Residence) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  residence,
  onOpenTour,
  onFocusTower,
  onSelectDetails,
  onOpenDossier,
  onOpenCalculator
}) => {
  return (
    <article className="group bg-[#0e1627] border border-amber-500/15 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 flex flex-col shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Visual Slot: High-Res Real Architectural Photo with 360 Tour Launcher */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={residence.primaryImage}
          alt={residence.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1627] via-transparent to-black/35 pointer-events-none" />

        {/* Quiet Top Metadata (NO PILLS) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-1.5 font-mono text-[11px] drop-shadow">
            <span className="font-semibold text-amber-300">{residence.unitCode}</span>
            <span>·</span>
            <span>Level {residence.floor} of 54</span>
          </div>

          <div className="text-[11px] font-medium tracking-wide drop-shadow text-slate-200">
            {residence.wing}
          </div>
        </div>

        {/* Direct Action Button over Image */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {onOpenDossier && (
            <button
              onClick={() => onOpenDossier(residence)}
              className="bg-black/60 hover:bg-black text-slate-200 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
            >
              Dossier
            </button>
          )}
          <button
            onClick={() => onOpenTour(residence)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>360° Tour</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Kicker */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-mono">
            <span>{residence.exposure}</span>
            <span aria-hidden="true">·</span>
            <span>{residence.ceilingHeight}</span>
          </div>

          {/* Primary Title */}
          <h3 className="text-2xl font-display font-medium text-white group-hover:text-amber-300 transition-colors">
            {residence.title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-light">
            {residence.tagline}
          </p>

          {/* Specification Row with Tabular Figures */}
          <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-white/5 text-center">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Bedrooms</span>
              <span className="font-mono text-sm font-semibold text-white tabular-nums">
                {residence.bedrooms} Beds
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Bathrooms</span>
              <span className="font-mono text-sm font-semibold text-white tabular-nums">
                {residence.bathrooms} Baths
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Interior Area</span>
              <span className="font-mono text-sm font-semibold text-white tabular-nums">
                {residence.sizeSqFt.toLocaleString()} sq ft
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Price & Dual Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
              Acquisition Price
            </span>
            <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
              {residence.priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFocusTower(residence)}
              title="Inspect Floor on 3D Tower"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">3D Tower</span>
            </button>

            <button
              onClick={() => onSelectDetails(residence)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
