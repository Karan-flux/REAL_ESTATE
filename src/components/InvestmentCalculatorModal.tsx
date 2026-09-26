import React, { useState } from 'react';
import { X, Calculator, DollarSign, TrendingUp, ShieldCheck, ArrowRight, Building, Percent } from 'lucide-react';
import { Residence } from '../types/property';
import { RESIDENCES } from '../data/residences';

interface InvestmentCalculatorModalProps {
  initialResidence?: Residence | null;
  onClose: () => void;
  onBookAdvisory: (res: Residence) => void;
}

type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'AED';

const CURRENCY_RATES: { [key in Currency]: { symbol: string; rate: number; label: string } } = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  CHF: { symbol: 'CHF ', rate: 0.88, label: 'CHF (Fr)' },
  AED: { symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)' }
};

export const InvestmentCalculatorModal: React.FC<InvestmentCalculatorModalProps> = ({
  initialResidence,
  onClose,
  onBookAdvisory
}) => {
  const [selectedResId, setSelectedResId] = useState<string>(initialResidence?.id || RESIDENCES[0].id);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // 30% default for jumbo luxury
  const [interestRate, setInterestRate] = useState<number>(5.6); // 5.6% private wealth jumbo
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [appreciationRate, setAppreciationRate] = useState<number>(4.8); // 4.8% prime waterfront annual

  const residence = RESIDENCES.find(r => r.id === selectedResId) || RESIDENCES[0];
  const rateInfo = CURRENCY_RATES[currency];

  const priceUSD = residence.price;
  const convertedPrice = priceUSD * rateInfo.rate;
  const downPaymentAmount = convertedPrice * (downPaymentPercent / 100);
  const loanAmount = convertedPrice - downPaymentAmount;

  // Monthly mortgage calculation (P&I)
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyMortgage = loanAmount > 0 && monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  // Estimated monthly taxes (~1.1% annual) and insurance (~0.35% annual)
  const monthlyTaxes = (convertedPrice * 0.011) / 12;
  const monthlyInsurance = (convertedPrice * 0.0035) / 12;
  
  // HOA from residence string (parse number)
  const hoaMatch = residence.hoaMonthly.replace(/[^0-9]/g, '');
  const baseHoa = (parseInt(hoaMatch, 10) || 2000) * rateInfo.rate;

  const totalMonthlyCarrying = monthlyMortgage + monthlyTaxes + monthlyInsurance + baseHoa;

  // 5-Year Estimated Value
  const estimated5YearValue = convertedPrice * Math.pow(1 + appreciationRate / 100, 5);
  const projectedAppreciationGain = estimated5YearValue - convertedPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0a101cf8] border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase mb-1">
          <Calculator className="w-3.5 h-3.5" />
          <span>Private Wealth & Asset Allocation Analysis</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-medium text-white">
          Residence Investment Calculator
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Evaluate capital outlay, private banking jumbo financing, carrying expenses, and multi-year appreciation forecasts.
        </p>

        {/* Currency & Unit Selector Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-[#101827] border border-white/10">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Select Sky Residence
            </label>
            <select
              value={selectedResId}
              onChange={(e) => setSelectedResId(e.target.value)}
              className="w-full bg-[#080d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {RESIDENCES.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.title} · {res.unitCode} ({res.priceFormatted})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Settlement Currency
            </label>
            <div className="flex items-center gap-1 bg-[#080d16] p-1 rounded-xl border border-white/10">
              {(['USD', 'EUR', 'GBP', 'CHF', 'AED'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    currency === cur
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 border-b border-white/10">
          {/* Down Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Equity Down Payment:</span>
              <span className="font-mono text-amber-400 font-bold">{downPaymentPercent}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="text-[11px] font-mono text-slate-400">
              {rateInfo.symbol}{Math.round(downPaymentAmount).toLocaleString()}
            </div>
          </div>

          {/* Jumbo Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Private Bank Rate:</span>
              <span className="font-mono text-white font-bold">{interestRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="3.5"
              max="8.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="text-[11px] font-mono text-slate-400">
              {loanTermYears}-Year Fixed Term
            </div>
          </div>

          {/* Annual Appreciation Forecast */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Appreciation Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">+{appreciationRate.toFixed(1)}% / yr</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="8.0"
              step="0.2"
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="text-[11px] font-mono text-slate-400">
              Historic Prime Waterfront
            </div>
          </div>
        </div>

        {/* Results Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          {/* Monthly Carrying Cost Box */}
          <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Estimated Monthly Outlay
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
              {rateInfo.symbol}{Math.round(totalMonthlyCarrying).toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal & Interest:</span>
                <span className="font-mono">{rateInfo.symbol}{Math.round(monthlyMortgage).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HOA & White-Glove Concierge:</span>
                <span className="font-mono">{rateInfo.symbol}{Math.round(baseHoa).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Property Tax:</span>
                <span className="font-mono">{rateInfo.symbol}{Math.round(monthlyTaxes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hazard & Coastal Insurance:</span>
                <span className="font-mono">{rateInfo.symbol}{Math.round(monthlyInsurance).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 5-Year Asset Growth Forecast */}
          <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              5-Year Projected Asset Valuation
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
              {rateInfo.symbol}{Math.round(estimated5YearValue).toLocaleString()}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Acquisition Basis:</span>
                <span className="font-mono">{rateInfo.symbol}{Math.round(convertedPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Equity Appreciation:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{rateInfo.symbol}{Math.round(projectedAppreciationGain).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compound 5-Year Return:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{(((estimated5YearValue - convertedPrice) / convertedPrice) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Confidential private wealth financing consultation available with J.P. Morgan & Morgan Stanley Private Banking.</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookAdvisory(residence);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap"
          >
            Connect with Private Client Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
