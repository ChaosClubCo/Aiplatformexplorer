import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { useROICalculator } from '../hooks/useROICalculator';

// Sub-components would ideally be in separate files, but keeping them here for context in this turn
const ResultCard = ({ label, value, subtext, highlight = false }: any) => (
  <div className={`rounded-xl p-4 text-center ${highlight ? 'bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white' : 'bg-white'}`}>
    <div className={`text-xl sm:text-2xl font-serif mb-2`}>{value}</div>
    <div className={`text-xs sm:text-sm ${highlight ? 'opacity-90' : 'text-[#5C524D]'}`}>{label}</div>
    {subtext && <div className={`text-xs mt-2 ${highlight ? 'opacity-75' : 'text-[#8B8279]'}`}>{subtext}</div>}
  </div>
);

interface ROICalculatorProps {
  onToast: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export default function ROICalculator({ onToast }: ROICalculatorProps) {
  const { inputs, setInputs, results, activeScenario, loadScenario } = useROICalculator(onToast);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 font-sans">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2 font-serif text-[#231C19]">ROI Calculator</h2>
          <p className="text-base sm:text-lg text-[#5C524D]">Strategic investment analysis with validated benchmarks.</p>
        </div>
        
        <div className="flex gap-2" role="group" aria-label="Scenario Selection">
           {['microsoft', 'google', 'hybrid'].map((sc) => (
             <button 
               key={sc}
               onClick={() => loadScenario(sc as any)}
               className={`px-3 py-1 text-xs rounded border transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#E88A1D] ${
                 activeScenario === sc ? 'bg-[#E88A1D] text-white border-[#E88A1D]' : 'bg-white text-[#5C524D] hover:bg-gray-50'
               }`}
               aria-pressed={activeScenario === sc}
             >
               Scenario {sc === 'microsoft' ? 'A' : sc === 'google' ? 'B' : 'C'} ({sc.charAt(0).toUpperCase() + sc.slice(1)})
             </button>
           ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Input Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-[#EDE8E3] rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <h3 className="text-lg sm:text-xl mb-4 sm:mb-6 font-semibold text-[#231C19]">📊 Parameters</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="emp-count" className="block text-sm font-medium text-[#5C524D] mb-1">Total Users</label>
              <input
                id="emp-count"
                type="number"
                min="1"
                value={inputs.employeeCount}
                onChange={e => setInputs({ ...inputs, employeeCount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#D9D2CC] rounded-lg focus:ring-2 focus:ring-[#E88A1D] outline-none transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-[#5C524D] mb-1">Industry</label>
              <select
                id="industry"
                value={inputs.industry}
                onChange={e => setInputs({ ...inputs, industry: e.target.value as any })}
                className="w-full px-3 py-2 border border-[#D9D2CC] rounded-lg focus:ring-2 focus:ring-[#E88A1D] outline-none"
              >
                <option value="general">General</option>
                <option value="financial">Financial Services</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
              </select>
            </div>

            <div>
              <label htmlFor="adoption" className="block text-sm font-medium text-[#5C524D] mb-1">
                Adoption Rate: <span className="text-[#E88A1D]">{inputs.adoptionRate}%</span>
              </label>
              <input
                id="adoption"
                type="range"
                min="0"
                max="100"
                value={inputs.adoptionRate}
                onChange={e => setInputs({ ...inputs, adoptionRate: Number(e.target.value) })}
                className="w-full accent-[#E88A1D]"
              />
            </div>
            
             <div>
              <label htmlFor="horizon" className="block text-sm font-medium text-[#5C524D] mb-1">Time Horizon (Months)</label>
              <select
                id="horizon"
                value={inputs.timeHorizon}
                onChange={e => setInputs({ ...inputs, timeHorizon: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#D9D2CC] rounded-lg focus:ring-2 focus:ring-[#E88A1D] outline-none"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <ResultCard 
            label="Projected ROI" 
            value={`${Math.round(results.roi)}%`} 
            subtext={`${results.roiMultiplier.toFixed(2)}x Multiplier`} 
            highlight 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Net Benefit" value={formatCurrency(results.netBenefit)} />
            <ResultCard label="Payback Period" value={`${results.paybackMonths.toFixed(1)} mo`} />
          </div>

          <div className="bg-white border border-[#EDE8E3] rounded-2xl p-6 shadow-sm">
             <h4 className="text-sm uppercase tracking-wider text-[#5C524D] mb-4 font-semibold">Financial Breakdown</h4>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-[#5C524D]">Productivity Savings</span>
                 <span className="font-medium text-green-600">+{formatCurrency(results.grossSavings)}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-[#5C524D]">Total Investment</span>
                 <span className="font-medium text-red-600">-{formatCurrency(results.totalInvestment)}</span>
               </div>
               <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold">
                 <span>Net Benefit</span>
                 <span>{formatCurrency(results.netBenefit)}</span>
               </div>
             </div>
          </div>

          <button
             onClick={() => {
               const summary = `Executive Summary\nROI: ${Math.round(results.roi)}%\nNet Benefit: ${formatCurrency(results.netBenefit)}`;
               navigator.clipboard.writeText(summary);
               onToast('Summary copied to clipboard', 'success');
             }}
             className="w-full py-3 bg-[#231C19] text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            Copy Executive Summary
          </button>
        </motion.div>
      </div>
    </div>
  );
}
