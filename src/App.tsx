import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Compass, 
  Eye, 
  MapPin, 
  Shield, 
  Sparkles, 
  Layers, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Phone,
  Mail,
  Calculator,
  Printer,
  Award,
  Gem
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { ThreeBuildingViewer } from './components/ThreeBuildingViewer';
import { VirtualTour360Modal } from './components/VirtualTour360Modal';
import { UnitCard } from './components/UnitCard';
import { FilterBar } from './components/FilterBar';
import { UnitDetailsModal } from './components/UnitDetailsModal';
import { InquiryModal } from './components/InquiryModal';
import { InvestmentCalculatorModal } from './components/InvestmentCalculatorModal';
import { DossierModal } from './components/DossierModal';

import { 
  RESIDENCES, 
  BUILDING_SPECS,
  imgBuildingDusk,
  imgPenthouseGrand,
  imgMasterSuite,
  imgChefKitchen,
  imgBuildingPlaza,
  imgSkyPool,
  imgMasterBath,
  imgWineVault
} from './data/residences';
import { Residence, FilterState } from './types/property';

export default function App() {
  // Modal states
  const [activeTourResidence, setActiveTourResidence] = useState<Residence | null>(null);
  const [initialTourRoomId, setInitialTourRoomId] = useState<string | undefined>(undefined);
  const [detailsResidence, setDetailsResidence] = useState<Residence | null>(null);
  const [dossierResidence, setDossierResidence] = useState<Residence | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorResidence, setCalculatorResidence] = useState<Residence | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingResidence, setBookingResidence] = useState<Residence | null>(null);

  // 3D Tower viewer synced unit
  const [selectedResidenceId, setSelectedResidenceId] = useState<string>(RESIDENCES[0].id);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceMin: 1000000,
    priceMax: 20000000,
    bedrooms: 'all',
    wing: 'all',
    minSize: 1000,
    sortBy: 'price-desc'
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      priceMin: 1000000,
      priceMax: 20000000,
      bedrooms: 'all',
      wing: 'all',
      minSize: 1000,
      sortBy: 'price-desc'
    });
  };

  // Filter & sort logic
  const filteredResidences = useMemo(() => {
    return RESIDENCES.filter(item => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCode = item.unitCode.toLowerCase().includes(query);
        const matchesExposure = item.exposure.toLowerCase().includes(query);
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesFeatures = item.features.some(f => f.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCode && !matchesExposure && !matchesTagline && !matchesFeatures) {
          return false;
        }
      }

      if (item.price > filters.priceMax) return false;

      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === '4+') {
          if (item.bedrooms < 4) return false;
        } else {
          if (item.bedrooms !== Number(filters.bedrooms)) return false;
        }
      }

      if (filters.wing !== 'all') {
        if (item.wing !== filters.wing) return false;
      }

      if (item.sizeSqFt < filters.minSize) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'size-desc') return b.sizeSqFt - a.sizeSqFt;
      if (filters.sortBy === 'floor-desc') return b.floor - a.floor;
      return 0;
    });
  }, [filters]);

  // Handlers
  const handleLaunchTour = (residence: Residence, roomId?: string) => {
    setInitialTourRoomId(roomId);
    setActiveTourResidence(residence);
  };

  const handleFocusTower = (residence: Residence) => {
    setSelectedResidenceId(residence.id);
    const element = document.getElementById('tower-view');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (residence?: Residence) => {
    setBookingResidence(residence || null);
    setIsBookingOpen(true);
  };

  const handleOpenCalculator = (residence?: Residence) => {
    setCalculatorResidence(residence || null);
    setIsCalculatorOpen(true);
  };

  const handleOpenDossier = (residence: Residence) => {
    setDossierResidence(residence);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200 font-sans">
      {/* Top Bar with Bespoke Luxury Typography */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenCalculator={() => handleOpenCalculator()}
        onNavigateSection={scrollToSection}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="top" className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden border-b border-amber-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Architectural Thesis */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase">
                  <span>Central Waterfront Landmark</span>
                  <span aria-hidden="true">·</span>
                  <span>54 Stories</span>
                  <span aria-hidden="true">·</span>
                  <span>Ready Late 2026</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white leading-[1.06] tracking-tight">
                  Where Pure Architecture Meets Endless Horizon.
                </h1>

                <p className="text-base text-slate-300 max-w-xl font-light leading-relaxed">
                  Sculpted along the central harbor, AURA Sky Residences redefines vertical luxury. 
                  Featuring multi-tiered glass curtain walls, cantilevered private sky terraces, 
                  and bespoke interior design by Studio Liaigre.
                </p>

                {/* Key Architectural Proof Numbers */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-500/15 max-w-md">
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      692<span className="text-amber-400 text-lg">ft</span>
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">Skyline Pinnacle</span>
                  </div>
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      360°
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">Harbor Panoramas</span>
                  </div>
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      124
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">Private Estates</span>
                  </div>
                </div>

                {/* Action CTA Group */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToSection('tower-view')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Launch 3D Building Inspection</span>
                  </button>

                  <button
                    onClick={() => handleLaunchTour(RESIDENCES[0])}
                    className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium px-5 py-3.5 rounded-xl flex items-center gap-2 transition-colors border border-white/10 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>360° Penthouse Tour</span>
                  </button>

                  <button
                    onClick={() => handleOpenCalculator()}
                    className="bg-[#121c2e] hover:bg-[#18253d] text-amber-400 text-xs font-mono px-4 py-3.5 rounded-xl flex items-center gap-2 transition-colors border border-amber-500/30 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Portfolio Calculator</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero High-Res Real Architectural Feature Card */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] bg-slate-900 group">
                  <div className="aspect-[16/11] overflow-hidden">
                    <img
                      src={imgBuildingDusk}
                      alt="AURA Sky Residences Architectural Tower at Dusk"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-black/30 pointer-events-none" />

                  {/* Editorial Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                        Twilight Golden Hour Inspection
                      </span>
                      <h4 className="text-xl font-display text-white font-medium mt-0.5">
                        Cantilevered Sky Pavilion & Plaza Reflection Pool
                      </h4>
                    </div>

                    <button
                      onClick={() => scrollToSection('tower-view')}
                      className="bg-black/60 hover:bg-black text-white text-xs font-medium px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/15 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <span>360° 3D Model</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Building Viewer Section */}
        <section id="tower-view" className="py-16 md:py-24 border-b border-amber-500/10 bg-[#060910]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Interactive 3D Exterior Inspection</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
                  360° Architectural Tower Exploration
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed font-light">
                  Rotate the full 3D tower geometry in real time. Switch between daylight, golden dusk, and midnight illumination. 
                  Click floating pins on the building levels to inspect elevations and enter 360° interior walkthroughs.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>WebGL 3D Core Active</span>
                </span>
              </div>
            </div>

            {/* The 3D Skyscraper Canvas Component */}
            <ThreeBuildingViewer
              selectedResidenceId={selectedResidenceId}
              onSelectResidenceForTour={(res) => handleLaunchTour(res)}
              onSelectResidence={(res) => handleOpenDossier(res)}
            />
          </div>
        </section>

        {/* Virtual Tours Spotlight Section */}
        <section id="tours-section" className="py-16 md:py-24 border-b border-amber-500/10 bg-[#070b13]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>360° Immersive Virtual Walkthroughs</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
                  Curated Interior Sanctuaries
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed font-light">
                  Every available residence features high-resolution 360-degree spherical photography. 
                  Navigate seamlessly between grand living rooms, chef kitchens, sky pools, marble ensuite spas, and sommelier tasting cellars.
                </p>
              </div>

              <button
                onClick={() => handleLaunchTour(RESIDENCES[0])}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 self-start md:self-auto cursor-pointer"
              >
                <span>Launch Full 360° Tour</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 360 Tour Space Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  res: RESIDENCES[0],
                  roomId: 'grand-living',
                  title: 'Grand Great Room',
                  subtitle: 'Double-Height Glass & Travertine Hearth',
                  image: imgPenthouseGrand,
                  tag: 'Penthouse 52A'
                },
                {
                  res: RESIDENCES[0],
                  roomId: 'sky-terrace',
                  title: 'Cantilevered Sky Pool',
                  subtitle: 'Sunset Ocean & Skyline Horizon',
                  image: imgSkyPool,
                  tag: 'Level 50 Pavilion'
                },
                {
                  res: RESIDENCES[0],
                  roomId: 'master-bath',
                  title: 'Primary Marble Spa Bath',
                  subtitle: 'Freestanding Sculpted Travertine Tub',
                  image: imgMasterBath,
                  tag: 'Master Sanctuary'
                },
                {
                  res: RESIDENCES[0],
                  roomId: 'wine-vault',
                  title: 'Sommelier Wine Vault',
                  subtitle: 'Backlit Onyx Tasting Bar (450 Bottles)',
                  image: imgWineVault,
                  tag: 'Private Reserve'
                },
                {
                  res: RESIDENCES[1],
                  roomId: 'chef-kitchen',
                  title: 'Gourmet Chef Kitchen',
                  subtitle: 'Calacatta Oro Waterfall & Gaggenau Suite',
                  image: imgChefKitchen,
                  tag: 'Residence 44B'
                },
                {
                  res: RESIDENCES[2],
                  roomId: 'master-suite',
                  title: 'Sunset Master Retreat',
                  subtitle: 'Poliform Dressing Salon & Loggia',
                  image: imgMasterSuite,
                  tag: 'Residence 38A'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleLaunchTour(item.res, item.roomId)}
                  className="group relative h-84 rounded-3xl overflow-hidden border border-amber-500/15 hover:border-amber-400/50 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 font-mono text-[11px] text-amber-300 drop-shadow">
                    {item.tag}
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:scale-115 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 shadow-2xl">
                    <Eye className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-xl font-display text-white font-medium group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-light">
                      {item.subtitle}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-semibold font-mono">
                      <span>Enter 360° Space</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Residences Section with Intuitive Search Filter */}
        <section id="residences-section" className="py-16 md:py-24 border-b border-amber-500/10 bg-[#0a101c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Curated Residential Portfolio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
                  Available Sky Residences
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed font-light">
                  Filter by price range, tower wing orientation, interior size, and bedroom specifications. 
                  Inspect any unit on the 3D tower model or launch its virtual room tour.
                </p>
              </div>

              <button
                onClick={() => handleOpenCalculator()}
                className="bg-[#121c2e] hover:bg-[#18253d] text-amber-400 text-xs font-mono px-4 py-2.5 rounded-xl border border-amber-500/30 flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
              >
                <Calculator className="w-4 h-4" />
                <span>Investment & Wealth Analysis</span>
              </button>
            </div>

            {/* Intuitive Filter Bar */}
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={filteredResidences.length}
            />

            {/* Results Grid */}
            {filteredResidences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResidences.map((residence) => (
                  <UnitCard
                    key={residence.id}
                    residence={residence}
                    onOpenTour={(res) => handleLaunchTour(res)}
                    onFocusTower={(res) => handleFocusTower(res)}
                    onSelectDetails={(res) => setDetailsResidence(res)}
                    onOpenDossier={(res) => handleOpenDossier(res)}
                    onOpenCalculator={(res) => handleOpenCalculator(res)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#101726] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
                <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-xl font-display text-white">No Matching Residences</h3>
                <p className="text-xs text-slate-400">
                  No current units match the applied price or size parameters. 
                  Try broadening your search or resetting filters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs transition-colors hover:bg-amber-400 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Building Architecture & Amenities Section */}
        <section id="amenities-section" className="py-16 md:py-24 border-b border-amber-500/10 bg-[#070b13]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unrivaled Lifestyle Curation</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
                  50,000 Square Feet of Bespoke Resident Amenities
                </h2>

                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  Every dimension of living at AURA has been conceived to provide effortless comfort, wellness, and discretion. 
                  Residents enjoy full-floor social and health clubs, personalized concierge service, and private sommelier vaults.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {BUILDING_SPECS.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Inquire About Amenity Access & Membership</span>
                  </button>
                </div>
              </div>

              {/* Architectural Imagery Display */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/20 shadow-xl">
                  <img
                    src={imgSkyPool}
                    alt="Level 50 Sky Pool at Sunset"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-mono text-white font-medium">
                    Level 50 Infinity Sky Pool
                  </span>
                </div>

                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/20 shadow-xl translate-y-6">
                  <img
                    src={imgWineVault}
                    alt="Backlit Sommelier Tasting Salon"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-mono text-white font-medium">
                    Sommelier Wine Cellar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Client Advisory Team Strip */}
        <section className="py-16 bg-[#080d16] border-b border-amber-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Sales & Acquisitions Directorate
              </span>
              <h3 className="text-3xl font-display font-medium text-white">
                Personalized White-Glove Advisory
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Direct access to our senior leadership for discrete acquisition consultations and bespoke architectural modifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {BUILDING_SPECS.advisors.map((adv, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e1627] border border-amber-500/20 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-display text-xl font-bold">
                      {adv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-lg font-display text-white font-medium">
                        {adv.name}
                      </h4>
                      <p className="text-xs text-amber-400 font-mono mt-0.5">
                        {adv.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {adv.experience}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBooking()}
                    className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Consult
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architectural Advisory / Contact Banner */}
        <section id="architecture-section" className="py-16 md:py-20 bg-[#070b13]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0d1627] to-[#142036] border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  Sales & Advisory Pavilion
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-white">
                  Schedule an In-Person Showing or 3D Video Walkthrough
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Located on-site at 888 Harbor Crest Boulevard. 
                  Model residence tours and full architectural material samples are available by private appointment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Book Private Showing
                </button>
                <button
                  onClick={() => handleOpenCalculator()}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white text-xs font-medium px-5 py-3.5 rounded-xl transition-colors border border-white/10 cursor-pointer whitespace-nowrap"
                >
                  Portfolio Calculator
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Refined Footer */}
      <footer className="bg-[#05080e] border-t border-amber-500/10 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="font-display text-white text-base tracking-widest font-medium">
              AURA SKY RESIDENCES
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span>888 Harbor Crest Boulevard, Central Waterfront</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => scrollToSection('tower-view')} className="hover:text-white transition-colors cursor-pointer">
              3D Tower
            </button>
            <button onClick={() => scrollToSection('residences-section')} className="hover:text-white transition-colors cursor-pointer">
              Residences
            </button>
            <button onClick={() => scrollToSection('tours-section')} className="hover:text-white transition-colors cursor-pointer">
              Virtual Tours
            </button>
            <button onClick={() => handleOpenCalculator()} className="hover:text-white transition-colors cursor-pointer">
              Portfolio
            </button>
            <button onClick={() => handleOpenBooking()} className="hover:text-amber-400 transition-colors cursor-pointer">
              Contact Advisory
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 AURA Residences Development LLC. Architectural copyright registered.</p>
          <p>Equal Housing Opportunity. Offering by Prospectus Only.</p>
        </div>
      </footer>

      {/* 360 Virtual Tour Modal */}
      {activeTourResidence && (
        <VirtualTour360Modal
          residence={activeTourResidence}
          initialRoomId={initialTourRoomId}
          onClose={() => setActiveTourResidence(null)}
          onBookTour={(res) => {
            setActiveTourResidence(null);
            handleOpenBooking(res);
          }}
        />
      )}

      {/* Unit Details Modal */}
      {detailsResidence && (
        <UnitDetailsModal
          residence={detailsResidence}
          onClose={() => setDetailsResidence(null)}
          onOpenTour={(res, roomId) => handleLaunchTour(res, roomId)}
          onBookShowing={(res) => handleOpenBooking(res)}
          onFocusOnTower={(res) => handleFocusTower(res)}
        />
      )}

      {/* Dossier Modal */}
      {dossierResidence && (
        <DossierModal
          residence={dossierResidence}
          onClose={() => setDossierResidence(null)}
          onLaunchTour={(res) => handleLaunchTour(res)}
          onScheduleShowing={(res) => handleOpenBooking(res)}
        />
      )}

      {/* Portfolio & Wealth Investment Calculator Modal */}
      {isCalculatorOpen && (
        <InvestmentCalculatorModal
          initialResidence={calculatorResidence}
          onClose={() => setIsCalculatorOpen(false)}
          onBookAdvisory={(res) => handleOpenBooking(res)}
        />
      )}

      {/* Inquiry & Booking Modal */}
      {isBookingOpen && (
        <InquiryModal
          initialResidence={bookingResidence}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}

