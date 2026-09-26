import React, { useState } from 'react';
import { X, Check, Calendar, Clock, User, Mail, Phone, Building } from 'lucide-react';
import { Residence } from '../types/property';
import { RESIDENCES } from '../data/residences';

interface InquiryModalProps {
  initialResidence?: Residence | null;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  initialResidence,
  onClose
}) => {
  const [selectedResId, setSelectedResId] = useState(initialResidence?.id || RESIDENCES[0].id);
  const [tourType, setTourType] = useState<'in-person' | 'live-virtual'>('in-person');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '2026-10-05',
    time: '14:00',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedRes = RESIDENCES.find(r => r.id === selectedResId) || RESIDENCES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display text-white">
              Private Appointment Confirmed
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="text-white font-medium">{formData.name || 'Valued Guest'}</span>. Our Senior Residential Advisor has received your reservation for{' '}
              <span className="text-amber-400 font-semibold">{selectedRes.title} ({selectedRes.unitCode})</span>.
              A calendar invitation and tailored building dossier will be sent to your email.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs transition-colors hover:bg-amber-400"
              >
                Return to Showcase
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                AURA Concierge Desk
              </span>
              <h3 className="text-2xl font-display font-medium text-white mt-0.5">
                Reserve Private Showing
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Experience the panoramic views, model residences, and architectural finishes firsthand.
              </p>
            </div>

            {/* Tour Format Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#141f33] rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setTourType('in-person')}
                className={`py-2 text-xs font-medium rounded-lg transition-colors ${
                  tourType === 'in-person'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                In-Person Tower Visit
              </button>
              <button
                type="button"
                onClick={() => setTourType('live-virtual')}
                className={`py-2 text-xs font-medium rounded-lg transition-colors ${
                  tourType === 'live-virtual'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Guided 3D Virtual Tour
              </button>
            </div>

            {/* Residence Select */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Residence of Interest
              </label>
              <select
                value={selectedResId}
                onChange={(e) => setSelectedResId(e.target.value)}
                className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
              >
                {RESIDENCES.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.title} - {res.unitCode} ({res.priceFormatted})
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="eleanor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-[#141f33] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="18:00">6:00 PM (Sunset)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
              >
                Confirm Private Showing Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
