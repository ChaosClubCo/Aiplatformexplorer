/**
 * Enhanced ROI Calculator with Validated Industry Benchmarks
 * 
 * This component integrates real-world data from:
 * - Capgemini June 2025 (1.7x average ROI)
 * - Gartner July 2024 (30% POC abandonment)
 * - IDC 2024 ($3.70 return per $1)
 * - Multiple case studies (ClickUp, YAZIO, H&H Purchasing, etc.)
 * 
 * Features:
 * - Real benchmark integration
 * - Scenario planning (Conservative, Midpoint, Optimistic)
 * - Industry-specific calculations
 * - Executive talking points
 * - Export functionality
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';

interface ROICalculatorProps {
  onToast: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export default function EnhancedROICalculator({ onToast }: ROICalculatorProps) {
  const [inputs, setInputs] = useState({
    employeeCount: 100,
    avgSalary: 75000,
    platformCost: 30,
    implementationCost: 50000,
    adoptionRate: 70,
    productivityGain: 'midpoint' as 'conservative' | 'midpoint' | 'optimistic',
    timeHorizon: 12,
    industry: 'general' as 'general' | 'financial' | 'healthcare' | 'technology' | 'manufacturing'
  });

  const [showBenchmarks, setShowBenchmarks] = useState(true);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);

  // Validated industry benchmarks from research
  const industryMultipliers = {
    general: 1.0,
    financial: 1.15, // JPMorgan Chase, Bank of America examples
    healthcare: 1.10, // GE Healthcare example
    technology: 1.20, // Higher adoption rates
    manufacturing: 1.05  // Toyota example
  };

  // Calculate ROI with comprehensive methodology
  const results = useMemo(() => {
    // Productivity values from research ($/employee/year)
    const productivityValues = {
      conservative: 8700,   // Larridin 2025
      midpoint: 13350,      // Blended average
      optimistic: 18000     // LSE/Protiviti 2024
    };

    const baseProductivityValue = productivityValues[inputs.productivityGain];
    const industryMultiplier = industryMultipliers[inputs.industry];
    const productivityValue = baseProductivityValue * industryMultiplier;

    // Adoption rate impact (Axis Intelligence 2025)
    // C-suite sponsored: 89%, IT-only: 34%
    const effectiveUsers = Math.round(inputs.employeeCount * (inputs.adoptionRate / 100));
    
    // Cost calculations
    const annualPlatformCost = inputs.employeeCount * inputs.platformCost * 12;
    const supportCost = annualPlatformCost * 0.15; // 15% ongoing support
    const changeManagementCost = inputs.implementationCost; // 1:1 ratio (McKinsey)
    
    const totalInvestment =
      inputs.implementationCost +
      changeManagementCost +
      (annualPlatformCost * inputs.timeHorizon) / 12 +
      (supportCost * inputs.timeHorizon) / 12;

    // Benefit calculations
    const grossSavings = effectiveUsers * productivityValue * (inputs.timeHorizon / 12);
    const netBenefit = grossSavings - totalInvestment;
    const roi = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackMonths = grossSavings > 0 ? (totalInvestment / (grossSavings / inputs.timeHorizon)) : 0;

    // Benchmark comparison (Capgemini 2025: 1.7x average)
    const roiMultiplier = (100 + roi) / 100;
    const benchmarkDifference = roiMultiplier - 1.7;
    const performanceCategory = 
      roiMultiplier >= 3.0 ? 'Excellent (Top 5%)' :
      roiMultiplier >= 1.7 ? 'Above Average' :
      roiMultiplier >= 1.0 ? 'Below Average' :
      'Negative ROI';

    return {
      roi,
      netBenefit,
      paybackMonths,
      grossSavings,
      totalInvestment,
      effectiveUsers,
      productivityValue,
      annualPlatformCost,
      supportCost,
      changeManagementCost,
      roiMultiplier,
      benchmarkDifference,
      performanceCategory
    };
  }, [inputs]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  // Generate executive summary
  const generateExecutiveSummary = () => {
    const summary = `
AI INVESTMENT EXECUTIVE SUMMARY
Generated: ${new Date().toLocaleDateString()}

ORGANIZATION PROFILE
• Employees: ${inputs.employeeCount}
• Industry: ${inputs.industry.charAt(0).toUpperCase() + inputs.industry.slice(1)}
• Analysis Period: ${inputs.timeHorizon} months

PROJECTED RESULTS
• ROI: ${Math.round(results.roi)}%
• Net Benefit: ${formatCurrency(results.netBenefit)}
• Payback Period: ${results.paybackMonths.toFixed(1)} months
• Performance vs Benchmark: ${results.performanceCategory}

INVESTMENT BREAKDOWN
• Implementation: ${formatCurrency(inputs.implementationCost)}
• Change Management: ${formatCurrency(results.changeManagementCost)}
• Platform Costs: ${formatCurrency((results.annualPlatformCost * inputs.timeHorizon) / 12)}
• Support: ${formatCurrency((results.supportCost * inputs.timeHorizon) / 12)}
• Total Investment: ${formatCurrency(results.totalInvestment)}

EXPECTED BENEFITS
• Effective Users: ${results.effectiveUsers} (${inputs.adoptionRate}% adoption)
• Savings per User: ${formatCurrency(results.productivityValue)}
• Gross Savings: ${formatCurrency(results.grossSavings)}

BENCHMARK COMPARISON (Capgemini 2025)
• Industry Average ROI: 1.7x (170%)
• Your Projected ROI: ${results.roiMultiplier.toFixed(2)}x (${Math.round(results.roi)}%)
• Difference: ${formatPercent(results.benchmarkDifference * 100)}

RISK FACTORS
• Gartner projects 30% POC abandonment rate
• Main causes: Poor data quality (43%), Unclear objectives (35%)
• Mitigation: Executive sponsorship increases success rate from 34% to 89%

RECOMMENDATION
${results.roi >= 100 ? 'PROCEED - Strong ROI justifies investment' :
  results.roi >= 50 ? 'PROCEED WITH CAUTION - Ensure adoption strategy is solid' :
  results.roi >= 0 ? 'RECONSIDER - Explore lower-cost alternatives' :
  'DO NOT PROCEED - Negative ROI projected'}
`;

    navigator.clipboard.writeText(summary);
    onToast('Executive summary copied to clipboard', 'success');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl mb-2 font-serif">
          ROI Calculator with Validated Benchmarks
        </h2>
        <p className="text-base sm:text-lg text-[#5C524D]">
          Calculate projected return using real industry data from Capgemini, Gartner, and enterprise case studies.
        </p>
      </motion.div>

      {/* Benchmark Cards */}
      {showBenchmarks && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {[
            { 
              value: '1.7x', 
              label: 'Average AI ROI', 
              source: '(Capgemini 2025, n=1,607)',
              color: 'bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white'
            },
            { 
              value: '$3.70', 
              label: 'Return per $1 Invested', 
              source: '(IDC 2024)',
              color: 'bg-white border-2 border-[#E88A1D]'
            },
            { 
              value: '3-6mo', 
              label: 'Quick Win Payback Period', 
              source: '(ClickUp, H&H case studies)',
              color: 'bg-white border-2 border-[#E88A1D]'
            },
            { 
              value: '89%', 
              label: 'Success w/ Exec Sponsorship', 
              source: '(Axis Intelligence 2025)',
              color: 'bg-white border-2 border-[#E88A1D]'
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.color} rounded-xl p-4 sm:p-5 hover:shadow-lg transition-all`}
            >
              <div className={`text-xl sm:text-2xl mb-1 font-serif ${stat.color.includes('white') ? 'text-[#E88A1D]' : ''}`}>
                {stat.value}
              </div>
              <div className={`text-xs sm:text-sm mb-2 ${stat.color.includes('white') ? 'text-[#5C524D]' : 'opacity-90'}`}>
                {stat.label}
              </div>
              <div className={`text-[10px] sm:text-xs italic ${stat.color.includes('white') ? 'text-[#8B8279]' : 'opacity-75'}`}>
                {stat.source}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Input Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-[#EDE8E3] rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl mb-4 sm:mb-6">📊 Organization Parameters</h3>

          <div className="space-y-4 sm:space-y-5">
            {/* Number of Users */}
            <div>
              <label htmlFor="employee-count" className="block text-sm text-[#5C524D] mb-2">
                Number of AI Users
              </label>
              <input
                id="employee-count"
                type="number"
                value={inputs.employeeCount}
                onChange={e => setInputs({ ...inputs, employeeCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
                aria-describedby="employee-count-help"
              />
              <div id="employee-count-help" className="text-xs text-[#8B8279] mt-1">
                Employees who will actively use AI tools
              </div>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm text-[#5C524D] mb-2">
                Industry Sector
              </label>
              <select
                id="industry"
                value={inputs.industry}
                onChange={e => setInputs({ ...inputs, industry: e.target.value as any })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
                aria-describedby="industry-help"
              >
                <option value="general">General / Other</option>
                <option value="financial">Financial Services (+15%)</option>
                <option value="healthcare">Healthcare (+10%)</option>
                <option value="technology">Technology (+20%)</option>
                <option value="manufacturing">Manufacturing (+5%)</option>
              </select>
              <div id="industry-help" className="text-xs text-[#8B8279] mt-1">
                Industry multiplier based on case study data
              </div>
            </div>

            {/* Average Salary */}
            <div>
              <label htmlFor="avg-salary" className="block text-sm text-[#5C524D] mb-2">
                Average Annual Salary ($)
              </label>
              <input
                id="avg-salary"
                type="number"
                value={inputs.avgSalary}
                onChange={e => setInputs({ ...inputs, avgSalary: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
                aria-describedby="salary-help"
              />
              <div id="salary-help" className="text-xs text-[#8B8279] mt-1">
                Loaded cost including benefits (~1.3× base salary)
              </div>
            </div>

            {/* Monthly Cost per User */}
            <div>
              <label htmlFor="platform-cost" className="block text-sm text-[#5C524D] mb-2">
                Monthly Cost per User ($)
              </label>
              <input
                id="platform-cost"
                type="number"
                value={inputs.platformCost}
                onChange={e => setInputs({ ...inputs, platformCost: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
                aria-describedby="platform-cost-help"
              />
              <div id="platform-cost-help" className="text-xs text-[#8B8279] mt-1">
                Typical: $10-60/user/month depending on platform
              </div>
            </div>

            {/* Implementation Cost */}
            <div>
              <label htmlFor="implementation-cost" className="block text-sm text-[#5C524D] mb-2">
                Implementation Cost ($)
              </label>
              <input
                id="implementation-cost"
                type="number"
                value={inputs.implementationCost}
                onChange={e => setInputs({ ...inputs, implementationCost: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
                aria-describedby="implementation-help"
              />
              <div id="implementation-help" className="text-xs text-[#8B8279] mt-1">
                One-time setup, training, integration costs
              </div>
            </div>

            {/* Adoption Rate */}
            <div>
              <label htmlFor="adoption-rate" className="block text-sm text-[#5C524D] mb-2">
                Expected Adoption Rate
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="adoption-rate"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={inputs.adoptionRate}
                  onChange={e => setInputs({ ...inputs, adoptionRate: parseInt(e.target.value) })}
                  className="flex-1 accent-[#E88A1D]"
                  aria-valuemin={10}
                  aria-valuemax={100}
                  aria-valuenow={inputs.adoptionRate}
                />
                <span className="min-w-[60px] text-right text-[#E88A1D] font-semibold">
                  {inputs.adoptionRate}%
                </span>
              </div>
              <div className="text-xs text-[#8B8279] mt-1">
                Industry avg: 34% (IT-driven) to 89% (C-suite sponsored)
              </div>
            </div>

            {/* Productivity Model */}
            <div>
              <label htmlFor="productivity-gain" className="block text-sm text-[#5C524D] mb-2">
                Productivity Savings Model
              </label>
              <select
                id="productivity-gain"
                value={inputs.productivityGain}
                onChange={e => setInputs({ ...inputs, productivityGain: e.target.value as any })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              >
                <option value="conservative">Conservative ($8,700/employee/year - Larridin)</option>
                <option value="midpoint">Midpoint ($13,350/employee/year - Blended)</option>
                <option value="optimistic">Optimistic ($18,000/employee/year - LSE/Protiviti)</option>
              </select>
            </div>

            {/* Time Horizon */}
            <div>
              <label htmlFor="time-horizon" className="block text-sm text-[#5C524D] mb-2">
                Analysis Period (Months)
              </label>
              <select
                id="time-horizon"
                value={inputs.timeHorizon}
                onChange={e => setInputs({ ...inputs, timeHorizon: parseInt(e.target.value) })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#FEF3E7] to-[#FFF8F1] border border-[#E88A1D] rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl mb-4 sm:mb-6">💰 Projected Results</h3>

          {/* Main ROI Display */}
          <motion.div 
            key={results.roi}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white rounded-xl p-5 mb-4 text-center"
          >
            <div className="text-3xl sm:text-4xl font-serif mb-2">
              {Math.round(results.roi)}%
            </div>
            <div className="text-sm opacity-90">Projected ROI</div>
            <div className="text-xs opacity-75 mt-2">
              {results.roiMultiplier.toFixed(2)}x return on investment
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-serif mb-2">
                {formatCurrency(results.netBenefit)}
              </div>
              <div className="text-xs sm:text-sm text-[#5C524D]">Net Benefit</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-serif mb-2">
                {results.paybackMonths > 0 ? `${results.paybackMonths.toFixed(1)}mo` : 'N/A'}
              </div>
              <div className="text-xs sm:text-sm text-[#5C524D]">Payback Period</div>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-white rounded-xl p-4 mb-4">
            <h4 className="text-sm font-semibold text-[#5C524D] mb-2">
              📊 Benchmark Comparison
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8B8279]">Industry Average (Capgemini):</span>
                <span className="font-semibold">1.7x (170%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8B8279]">Your Projection:</span>
                <span className="font-semibold text-[#E88A1D]">
                  {results.roiMultiplier.toFixed(2)}x ({Math.round(results.roi)}%)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-[#EDE8E3]">
                <span className="text-[#8B8279]">Performance Category:</span>
                <span className={`font-semibold ${
                  results.roiMultiplier >= 3.0 ? 'text-[#059669]' :
                  results.roiMultiplier >= 1.7 ? 'text-[#10B981]' :
                  results.roiMultiplier >= 1.0 ? 'text-[#F59E0B]' :
                  'text-[#EF4444]'
                }`}>
                  {results.performanceCategory}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6">
            <h4 className="text-xs sm:text-sm uppercase tracking-wider text-[#5C524D] mb-3">
              DETAILED BREAKDOWN
            </h4>
            <div className="space-y-0">
              {[
                { label: 'Gross Productivity Savings', value: formatCurrency(results.grossSavings), positive: true },
                { label: 'Platform Costs', value: `-${formatCurrency((results.annualPlatformCost * inputs.timeHorizon) / 12)}` },
                { label: 'Implementation Cost', value: `-${formatCurrency(inputs.implementationCost)}` },
                { label: 'Change Management (1:1)', value: `-${formatCurrency(results.changeManagementCost)}` },
                { label: 'Ongoing Support (15%)', value: `-${formatCurrency((results.supportCost * inputs.timeHorizon) / 12)}` },
                { label: 'Total Investment', value: formatCurrency(results.totalInvestment), bold: true },
                { label: 'Effective Users', value: results.effectiveUsers.toString(), bold: true },
                { label: 'Savings per Effective User', value: formatCurrency(results.productivityValue), bold: true }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center py-2 sm:py-3 border-b border-[#EDE8E3] last:border-b-0 text-xs sm:text-sm ${
                    item.bold ? 'border-t-2 border-[#B5ADA6] mt-2 pt-3' : ''
                  }`}
                >
                  <span className={`text-[#5C524D] ${item.bold ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  <span className={`text-[#231C19] ${item.bold ? 'font-semibold' : ''} ${
                    item.positive ? 'text-[#059669]' : ''
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <button
              onClick={generateExecutiveSummary}
              className="w-full px-4 py-3 bg-[#E88A1D] text-white rounded-lg hover:bg-[#D07614] transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
            >
              📋 Copy Executive Summary
            </button>
            <button
              onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
              className="w-full px-4 py-3 bg-white border border-[#D9D2CC] text-[#231C19] rounded-lg hover:bg-[#FAFAFA] transition-all text-sm focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
            >
              {showExecutiveSummary ? '📊 Hide' : '📊 Show'} Talking Points
            </button>
          </div>
        </motion.div>
      </div>

      {/* Executive Talking Points */}
      {showExecutiveSummary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-8 bg-[#E0F2FE] border border-[#0284C7] rounded-2xl p-6 overflow-hidden"
        >
          <h3 className="text-xl text-[#0284C7] mb-4">💼 Executive Talking Points</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-[#0284C7] mb-2">✅ Strengths to Highlight</h4>
              <ul className="space-y-2 text-[#5C524D]">
                <li>• {results.roi >= 100 ? 'Strong' : results.roi >= 50 ? 'Moderate' : 'Limited'} ROI justification ({Math.round(results.roi)}%)</li>
                <li>• Payback in {results.paybackMonths.toFixed(1)} months</li>
                <li>• {inputs.adoptionRate >= 70 ? 'High' : inputs.adoptionRate >= 50 ? 'Moderate' : 'Low'} adoption target ({inputs.adoptionRate}%)</li>
                <li>• Performance vs benchmark: {results.performanceCategory}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0284C7] mb-2">⚠️ Risk Mitigation</h4>
              <ul className="space-y-2 text-[#5C524D]">
                <li>• Gartner: 30% POC abandonment (address proactively)</li>
                <li>• Executive sponsorship critical (89% vs 34% success)</li>
                <li>• Change management budget included ({formatCurrency(results.changeManagementCost)})</li>
                <li>• {results.paybackMonths <= 6 ? 'Quick win timeline reduces risk' : 'Monitor progress at 3-month intervals'}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Methodology Note */}
      <div className="bg-white border border-[#EDE8E3] rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
        <h4 className="text-sm text-[#5C524D] mb-2">📚 Methodology & Sources</h4>
        <p className="text-xs sm:text-sm text-[#8B8279] leading-relaxed mb-3">
          This calculator uses validated benchmarks from primary research sources including Capgemini (June 2025, n=1,607 executives), 
          Gartner (July 2024), IDC, and documented case studies from ClickUp, YAZIO, H&H Purchasing, Toyota, and JPMorgan Chase. 
          Calculations follow McKinsey's 1:1 change management ratio and include 15% ongoing support costs.
        </p>
        <p className="text-xs text-[#8B8279] italic">
          Results are projections based on industry averages. Actual ROI varies by implementation quality, user training, 
          organizational readiness, and data quality. Gartner research shows 43% of failed implementations cite poor data quality as root cause.
        </p>
      </div>
    </div>
  );
}
