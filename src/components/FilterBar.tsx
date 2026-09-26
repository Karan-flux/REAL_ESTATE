import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Building2, DollarSign, Maximize, BedDouble, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types/property';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.priceMin > 1000000 ||
    filters.priceMax < 20000000 ||
    filters.bedrooms !== 'all' ||
    filters.wing !== 'all' ||
    filters.minSize > 1000;

  return (
    <div className="bg-[#101726] border border-white/10 rounded-2xl p-5 shadow-xl">
      {/* Top Row: Search Input, Quick Wings, and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-4 border-b border-white/5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by unit name, exposure, penthouse, terrace, marble..."
            className="w-full bg-[#0b0f17] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Wing / Location Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs text-slate-400 mr-2 shrink-0 font-medium flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /> Tower Wing:
          </span>
          {[
            { id: 'all', label: 'All Wings' },
            { id: 'Waterfront North', label: 'Waterfront North' },
            { id: 'Skyline South', label: 'Skyline South' },
            { id: 'Upper Crest', label: 'Upper Crest' },
            { id: 'Parkside Terrace', label: 'Parkside' }
          ].map((wing) => {
            const isActive = filters.wing === wing.id;
            return (
              <button
                key={wing.id}
                onClick={() => onChange({ wing: wing.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-[#151f33] text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {wing.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Price Slider, Bedroom Selector, Size Selector, Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {/* 1. Price Filter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Max Price:
            </span>
            <span className="font-mono text-white font-semibold tabular-nums">
              {filters.priceMax >= 20000000
                ? '$20M+'
                : `$${(filters.priceMax / 1000000).toFixed(1)}M`}
            </span>
          </div>
          <input
            type="range"
            min="2000000"
            max="20000000"
            step="500000"
            value={filters.priceMax}
            onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>$2.0M</span>
            <span>$10M</span>
            <span>$20M+</span>
          </div>
        </div>

        {/* 2. Bedrooms Filter */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <BedDouble className="w-3.5 h-3.5 text-amber-400" /> Bedrooms:
          </span>
          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 rounded-xl border border-white/5">
            {[
              { id: 'all', label: 'All' },
              { id: '1', label: '1 Bed' },
              { id: '2', label: '2 Bed' },
              { id: '3', label: '3 Bed' },
              { id: '4+', label: '4+ Bed' }
            ].map((bed) => {
              const isActive = filters.bedrooms === bed.id;
              return (
                <button
                  key={bed.id}
                  onClick={() => onChange({ bedrooms: bed.id })}
                  className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {bed.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Minimum Size Filter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Maximize className="w-3.5 h-3.5 text-amber-400" /> Min Interior Size:
            </span>
            <span className="font-mono text-white font-semibold tabular-nums">
              {filters.minSize > 1000 ? `${filters.minSize.toLocaleString()} sq ft` : 'Any Size'}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="6000"
            step="500"
            value={filters.minSize}
            onChange={(e) => onChange({ minSize: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1,000 sq ft</span>
            <span>3,500 sq ft</span>
            <span>6,000+ sq ft</span>
          </div>
        </div>

        {/* 4. Sort Options */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" /> Sort Residences:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
          >
            <option value="price-desc">Price: Highest to Lowest</option>
            <option value="price-asc">Price: Lowest to Highest</option>
            <option value="size-desc">Interior Size: Largest First</option>
            <option value="floor-desc">Floor Level: Highest Stories</option>
          </select>
        </div>
      </div>

      {/* Bottom Status & Reset Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="text-slate-300 font-medium">
          Showing <span className="text-amber-400 font-mono font-bold tabular-nums">{totalResults}</span> Available Residences
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
