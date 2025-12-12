import { useState } from 'react';
import { PLATFORMS_DATA } from '../data/platforms';
import { Platform } from '../types';
import { useAppContext } from '../context/AppContext';
import { WeightControls } from '../features/comparison/components/WeightControls';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export default function FeatureMatrix() {
  const { state } = useAppContext();
  const { weights } = state.preferences;
  const [categoryFilter, setCategoryFilter] = useState('all');

  const calculateWeightedScore = (platform: typeof PLATFORMS_DATA[0]) => {
    // Normalize scores to 0-100 scale for calculation
    
    // Capabilities: Average of technical scores * 10
    const techScores = Object.values(platform.scores);
    const avgTechScore = techScores.reduce((a, b) => a + b, 0) / techScores.length * 10;
    
    // Security: Based on compliance count (approx 4 is max currently in data)
    // 4 -> 100, 0 -> 0.
    const securityScore = Math.min(platform.complianceCount * 25, 100);
    
    // Cost: Pricing 1 ($) -> 100, 5 ($$$$$) -> 20.
    const costScore = (6 - platform.pricingValue) * 20;
    
    // Customization: Direct score * 10
    const customizationScore = platform.scores.customization * 10;

    const totalWeight = weights.capabilities + weights.security + weights.cost + weights.customization;
    if (totalWeight === 0) return 0;

    const weightedSum = 
      (avgTechScore * weights.capabilities) +
      (securityScore * weights.security) +
      (costScore * weights.cost) +
      (customizationScore * weights.customization);
      
    return Math.round(weightedSum / totalWeight);
  };

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

  // Sales Win Themes mapping
  const winThemes: Record<string, Record<string, string>> = {
    complianceWork: {
      claude: "Win Theme: Constitutional AI & Safety Focus",
      watsonx: "Win Theme: Enterprise Governance & Risk Management",
      microsoft: "Win Theme: Enterprise Security & M365 Compliance"
    },
    codeGeneration: {
      'github-copilot': "Win Theme: 55% Developer Productivity Gain",
      gemini: "Win Theme: 2M Token Context for Large Codebases"
    },
    creativeWriting: {
      chatgpt: "Win Theme: Market Leader in Creativity & Versatility",
      claude: "Win Theme: Natural, Human-like Tone"
    },
    multilingual: {
      gemini: "Win Theme: Industry Leading Multilingual Capabilities",
    },
    customerService: {
      agentforce: "Win Theme: Native CRM Integration & Data Context",
      'now-assist': "Win Theme: IT Service Management Automation"
    },
    agentCapabilities: {
      'copilot-studio': "Win Theme: No-code Agent Building for M365",
      uipath: "Win Theme: End-to-End Process Automation"
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 9) return 'bg-[#D1FAE5] text-[#065F46]';
    if (score >= 7) return 'bg-[#ECFDF5] text-[#047857]';
    if (score >= 5) return 'bg-[#FEF3C7] text-[#92400E]';
    if (score >= 3) return 'bg-[#FEE2E2] text-[#DC2626]';
    return 'bg-[#F5F5F5] text-[#A3A3A3]';
  };

  return (
    <TooltipProvider>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-3xl mb-2 font-serif">Feature Comparison Matrix</h2>
          <p className="text-lg text-[#5C524D]">
            Compare capabilities across all 16 platforms with detailed evaluation criteria. Scores range from 1-10 (10 =
            excellent).
          </p>
        </div>

        <WeightControls />

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
              {/* Weighted Score Row */}
              <tr className="bg-orange-50/50">
                <th className="sticky left-0 z-10 px-3 py-3 text-left bg-orange-50 border-b border-r border-orange-200 font-bold text-orange-900 shadow-sm">
                  Weighted Score (0-100)
                </th>
                {PLATFORMS_DATA.map(platform => {
                  const score = calculateWeightedScore(platform as any);
                  return (
                    <td key={platform.id} className="px-3 py-3 text-center border-b border-r border-orange-200 font-bold text-orange-800 bg-orange-50/30">
                      {score}
                    </td>
                  );
                })}
              </tr>
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
                    const winTheme = winThemes[feature.id]?.[platform.id];
                    
                    const cell = (
                      <td
                        className={`px-3 py-2 text-center border-b border-r border-[#EDE8E3] last:border-r-0 ${getScoreClass(
                          score
                        )} ${winTheme ? 'cursor-help ring-inset ring-2 ring-orange-400/30' : ''}`}
                      >
                        {score}
                      </td>
                    );

                    if (winTheme) {
                      return (
                        <Tooltip key={platform.id}>
                          <TooltipTrigger asChild>
                            {cell}
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] bg-[#E88A1D] text-white border-0">
                            <p className="font-semibold">💡 Sales Tip:</p>
                            <p>{winTheme}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <React.Fragment key={platform.id}>{cell}</React.Fragment>;
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
          <div className="flex items-center gap-2 text-xs ml-4">
            <div className="w-4 h-4 border-2 border-orange-400/50 rounded"></div>
            <span className="font-medium text-orange-700">Has Sales Tip (Hover)</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
