import React, { useState } from 'react';
import { Menu, X, Calendar, Compass, Building, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenCalculator: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenCalculator, onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '3D Tower', id: 'tower-view' },
    { label: 'Residences', id: 'residences-section' },
    { label: 'Virtual Tours', id: 'tours-section' },
    { label: 'Amenities', id: 'amenities-section' },
    { label: 'Architecture', id: 'architecture-section' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080d16]/90 backdrop-blur-xl border-b border-amber-500/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with bespoke gold typography */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl sm:text-2xl font-display font-medium tracking-widest text-white hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
          <span>AURA SKY RESIDENCES</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onOpenCalculator}
            className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400/90"
          >
            Portfolio Calculator
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Private Showing</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="bg-amber-500 text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            Tour
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a101cf8] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculator();
            }}
            className="block w-full text-left py-2 text-sm text-amber-400 font-medium"
          >
            Portfolio Calculator
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-amber-500 text-slate-950 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Private Showing</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
