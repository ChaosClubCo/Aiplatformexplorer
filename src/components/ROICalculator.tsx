import { useState, useEffect } from 'react';

interface ROICalculatorProps {
  onToast: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export default function ROICalculator({ onToast }: ROICalculatorProps) {
  const [inputs, setInputs] = useState({
    employeeCount: 100,
    avgSalary: 75000,
    platformCost: 30,
    implementationCost: 50000,
    adoptionRate: 70,
    productivityGain: 'midpoint' as 'conservative' | 'midpoint' | 'optimistic',
    timeHorizon: 12
  });

  const [results, setResults] = useState({
    roi: 0,
    netBenefit: 0,
    paybackMonths: 0,
    grossSavings: 0,
    totalInvestment: 0,
    effectiveUsers: 0,
    productivityValue: 0,
    annualPlatformCost: 0,
    supportCost: 0
  });

  const calculateROI = () => {
    const productivityValues = {
      conservative: 8700,
      midpoint: 13350,
      optimistic: 18000
    };

    const productivityValue = productivityValues[inputs.productivityGain];
    const effectiveUsers = Math.round(inputs.employeeCount * (inputs.adoptionRate / 100));
    const annualPlatformCost = inputs.employeeCount * inputs.platformCost * 12;
    const supportCost = annualPlatformCost * 0.15;
    const totalInvestment =
      inputs.implementationCost +
      (annualPlatformCost * inputs.timeHorizon) / 12 +
      (supportCost * inputs.timeHorizon) / 12;
    const grossSavings = effectiveUsers * productivityValue * (inputs.timeHorizon / 12);
    const netBenefit = grossSavings - totalInvestment;
    const roi = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackMonths = grossSavings > 0 ? (totalInvestment / (grossSavings / inputs.timeHorizon)) : 0;

    setResults({
      roi,
      netBenefit,
      paybackMonths,
      grossSavings,
      totalInvestment,
      effectiveUsers,
      productivityValue,
      annualPlatformCost,
      supportCost
    });

    onToast('ROI calculation updated', 'success');
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2 font-serif">ROI Calculator & Financial Analysis</h2>
        <p className="text-lg text-[#5C524D]">
          Calculate projected return on investment using verified 2025 industry benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {[
          { value: '$8.7K–$18K', label: 'Productivity Savings/Employee/Year', source: '(Larridin 2025; LSE/Protiviti 2024)' },
          { value: '$1.41–$3.50', label: 'Return per $1 Invested', source: '(Snowflake/ESG 2025)' },
          { value: '107%', label: 'ROI by Month 18 (10K+ employees)', source: '(Axis Intelligence 2025)' },
          { value: '89%', label: 'Adoption w/ C-Suite Sponsorship', source: '(Axis Intelligence 2025)' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#EDE8E3] rounded-xl p-5 hover:border-[#B5ADA6] hover:shadow-md transition-all">
            <div className="text-2xl text-[#E88A1D] mb-1 font-serif">{stat.value}</div>
            <div className="text-sm text-[#5C524D] mb-3">{stat.label}</div>
            <div className="text-xs text-[#8B8279] italic">{stat.source}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#EDE8E3] rounded-2xl p-6">
          <h3 className="text-xl mb-6">📊 Organization Parameters</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Number of AI Users</label>
              <input
                type="number"
                value={inputs.employeeCount}
                onChange={e => setInputs({ ...inputs, employeeCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              />
              <div className="text-xs text-[#8B8279] mt-1">Employees who will actively use AI tools</div>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Average Annual Salary ($)</label>
              <input
                type="number"
                value={inputs.avgSalary}
                onChange={e => setInputs({ ...inputs, avgSalary: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              />
              <div className="text-xs text-[#8B8279] mt-1">Loaded cost including benefits (~1.3× base salary)</div>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Monthly Cost per User ($)</label>
              <input
                type="number"
                value={inputs.platformCost}
                onChange={e => setInputs({ ...inputs, platformCost: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              />
              <div className="text-xs text-[#8B8279] mt-1">Typical: $10-60/user/month depending on platform</div>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Implementation Cost ($)</label>
              <input
                type="number"
                value={inputs.implementationCost}
                onChange={e => setInputs({ ...inputs, implementationCost: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              />
              <div className="text-xs text-[#8B8279] mt-1">One-time setup, training, integration costs</div>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Expected Adoption Rate</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={inputs.adoptionRate}
                  onChange={e => setInputs({ ...inputs, adoptionRate: parseInt(e.target.value) })}
                  className="flex-1 accent-[#E88A1D]"
                />
                <span className="min-w-[60px] text-right text-[#E88A1D]">{inputs.adoptionRate}%</span>
              </div>
              <div className="text-xs text-[#8B8279] mt-1">Industry avg: 34% (IT-driven) to 89% (C-suite sponsored)</div>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Productivity Savings Model</label>
              <select
                value={inputs.productivityGain}
                onChange={e => setInputs({ ...inputs, productivityGain: e.target.value as any })}
                className="w-full px-3 py-3 text-base border border-[#D9D2CC] rounded-lg focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] outline-none"
              >
                <option value="conservative">Conservative ($8,700/employee/year - Larridin)</option>
                <option value="midpoint">Midpoint ($13,350/employee/year - Blended)</option>
                <option value="optimistic">Optimistic ($18,000/employee/year - LSE/Protiviti)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#5C524D] mb-2">Analysis Period (Months)</label>
              <select
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
        </div>

        <div className="bg-gradient-to-br from-[#FEF3E7] to-[#FFF8F1] border border-[#E88A1D] rounded-2xl p-6">
          <h3 className="text-xl mb-6">💰 Projected Results</h3>

          <div className="bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white rounded-xl p-5 mb-4 text-center">
            <div className="text-4xl font-serif mb-2">{Math.round(results.roi)}%</div>
            <div className="text-sm opacity-90">Projected ROI</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 text-center">
              <div className="text-2xl font-serif mb-2">{formatCurrency(results.netBenefit)}</div>
              <div className="text-sm text-[#5C524D]">Net Benefit</div>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <div className="text-2xl font-serif mb-2">{results.paybackMonths > 0 ? `${results.paybackMonths.toFixed(1)} mo` : 'N/A'}</div>
              <div className="text-sm text-[#5C524D]">Payback Period</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm uppercase tracking-wider text-[#5C524D] mb-3">BREAKDOWN</h4>
            <div className="space-y-0">
              {[
                { label: 'Gross Productivity Savings', value: formatCurrency(results.grossSavings) },
                { label: 'Annual Platform Cost', value: `-${formatCurrency((results.annualPlatformCost * inputs.timeHorizon) / 12)}` },
                { label: 'Implementation Cost', value: `-${formatCurrency(inputs.implementationCost)}` },
                { label: 'Ongoing Support (est. 15%)', value: `-${formatCurrency((results.supportCost * inputs.timeHorizon) / 12)}` },
                { label: 'Total Investment', value: formatCurrency(results.totalInvestment), bold: true },
                { label: 'Effective Users (w/ adoption)', value: results.effectiveUsers.toString(), bold: true },
                { label: 'Savings per Effective User', value: formatCurrency(results.productivityValue), bold: true }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-3 border-b border-[#EDE8E3] last:border-b-0 text-sm ${item.bold ? 'border-t-2 border-[#B5ADA6] mt-2 pt-3' : ''}`}>
                  <span className={`text-[#5C524D] ${item.bold ? 'font-semibold' : ''}`}>{item.label}</span>
                  <span className={`text-[#231C19] ${item.bold ? 'font-semibold' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E0F2FE] border border-[#0284C7] rounded-xl p-4 mt-6">
            <h4 className="text-sm text-[#0284C7] mb-2">📚 Methodology & Sources</h4>
            <p className="text-xs text-[#5C524D] leading-relaxed">
              Calculator uses midpoint values for conservative estimates. Actual results may vary based on implementation quality, user training, and organizational readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
