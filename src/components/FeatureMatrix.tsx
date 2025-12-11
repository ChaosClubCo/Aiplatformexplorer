import { useState } from 'react';
import { PLATFORMS_DATA } from '../data/platforms';

export default function FeatureMatrix() {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const features = [
    { id: 'codeGeneration', name: 'Code Generation', category: 'core' },
    { id: 'creativeWriting', name: 'Creative Writing', category: 'core' },
    { id: 'dataAnalysis', name: 'Data Analysis', category: 'core' },
    { id: 'customerService', name: 'Customer Service', category: 'core' },
    { id: 'complianceWork', name: 'Compliance Work', category: 'core' },
    { id: 'reasoning', name: 'Reasoning', category: 'core' },
    { id: 'multilingual', name: 'Multilingual', category: 'core' },
    { id: 'agentCapabilities', name: 'Agent Capabilities', category: 'core' }
  ];

  const filteredFeatures = categoryFilter === 'all' 
    ? features 
    : features.filter(f => f.category === categoryFilter);

  const getScoreClass = (score: number) => {
    if (score >= 9) return 'bg-[#D1FAE5] text-[#065F46]';
    if (score >= 7) return 'bg-[#ECFDF5] text-[#047857]';
    if (score >= 5) return 'bg-[#FEF3C7] text-[#92400E]';
    if (score >= 3) return 'bg-[#FEE2E2] text-[#DC2626]';
    return 'bg-[#F5F5F5] text-[#A3A3A3]';
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2 font-serif">Feature Comparison Matrix</h2>
        <p className="text-lg text-[#5C524D]">
          Compare capabilities across all 16 platforms with detailed evaluation criteria. Scores range from 1-10 (10 =
          excellent).
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#5C524D]">Filter Category:</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] min-w-[160px]"
          >
            <option value="all">All Features</option>
            <option value="core">Core Capabilities</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-[#EDE8E3] rounded-xl">
        <table className="w-full text-xs border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-30 min-w-[200px] px-3 py-2 text-left bg-[#262626] text-white border-b border-r border-[#EDE8E3]">
                Feature
              </th>
              {PLATFORMS_DATA.map(platform => (
                <th
                  key={platform.id}
                  className="sticky top-0 z-20 min-w-[80px] px-3 py-2 text-center bg-[#262626] text-white border-b border-r border-[#EDE8E3] last:border-r-0"
                  title={platform.name}
                >
                  {platform.logo} {platform.name.split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                colSpan={PLATFORMS_DATA.length + 1}
                className="px-3 py-2 text-left bg-[#F0EDF3] text-[#6B5B7A] uppercase tracking-wider border-b border-[#EDE8E3]"
              >
                Core Capabilities
              </th>
            </tr>
            {filteredFeatures.map(feature => (
              <tr key={feature.id} className="hover:bg-[#FEF3E7]">
                <th className="sticky left-0 z-10 px-3 py-2 text-left bg-[#FAFAFA] border-b border-r border-[#EDE8E3] hover:bg-[#FEF3E7]">
                  {feature.name}
                </th>
                {PLATFORMS_DATA.map(platform => {
                  const score = platform.scores[feature.id as keyof typeof platform.scores];
                  return (
                    <td
                      key={platform.id}
                      className={`px-3 py-2 text-center border-b border-r border-[#EDE8E3] last:border-r-0 ${getScoreClass(
                        score
                      )}`}
                    >
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-[#FAFAFA] border-t border-[#EDE8E3] rounded-b-xl">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 bg-[#D1FAE5] rounded"></div>
          <span>Excellent (9-10)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 bg-[#ECFDF5] rounded"></div>
          <span>Good (7-8)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 bg-[#FEF3C7] rounded"></div>
          <span>Average (5-6)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 bg-[#FEE2E2] rounded"></div>
          <span>Limited (1-4)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 bg-[#F5F5F5] rounded"></div>
          <span>N/A</span>
        </div>
      </div>
    </div>
  );
}
