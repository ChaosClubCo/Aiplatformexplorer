import { Platform } from '../types';
import { useState } from 'react';
import { DecisionMatrix } from '../features/comparison/components/DecisionMatrix';
import { cn } from '../components/ui/utils';

interface ComparisonModalProps {
  platformIds: string[];
  platforms: Platform[];
  onClose: () => void;
  onExport: (format: string) => void;
}

export default function ComparisonModal({ platformIds, platforms, onClose }: ComparisonModalProps) {
  const [viewMode, setViewMode] = useState<'simple' | 'matrix'>('simple');
  const selectedPlatforms = platformIds.map(id => platforms.find(p => p.id === id)).filter(Boolean) as Platform[];

  if (selectedPlatforms.length === 0) return null;

  const scoreFeatures = [
    'codeGeneration',
    'creativeWriting',
    'dataAnalysis',
    'customerService',
    'complianceWork',
    'reasoning',
    'agentCapabilities',
    'apiAccess',
    'customization',
    'multilingual'
  ] as const;

  const getScoreClass = (score: number) => {
    if (score >= 9) return 'text-[#059669]';
    if (score >= 7) return 'text-[#10B981]';
    if (score >= 5) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] bg-white rounded-2xl shadow-2xl w-[95vw] max-w-[1200px] max-h-[95vh] overflow-hidden animate-[modalIn_0.3s_ease] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#EDE8E3] shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-[#231C19]">⚖️ Platform Comparison</h2>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('simple')}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all",
                  viewMode === 'simple' ? "bg-white text-[#231C19] shadow-sm font-medium" : "text-[#8B8279] hover:text-[#5C524D]"
                )}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all",
                  viewMode === 'matrix' ? "bg-white text-[#E88A1D] shadow-sm font-medium" : "text-[#8B8279] hover:text-[#5C524D]"
                )}
              >
                Decision Matrix
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#8B8279] hover:bg-[#F5F5F5] hover:text-[#231C19] transition-all"
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {viewMode === 'matrix' ? (
             <DecisionMatrix platforms={selectedPlatforms} />
          ) : (
            <>
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `200px repeat(${selectedPlatforms.length}, 1fr)` }}>
                <div></div>
                {selectedPlatforms.map(platform => (
                  <div key={platform.id} className="bg-white border border-[#EDE8E3] rounded-xl p-4 text-center">
                    <div className="w-14 h-14 flex items-center justify-center text-[2rem] mx-auto mb-3 bg-white border border-[#EDE8E3] rounded-xl">
                      {platform.logo}
                    </div>
                    <div className="text-base mb-1">{platform.name}</div>
                    <span className="inline-block px-3 py-1 text-xs uppercase tracking-wide rounded-full bg-[var(--priority-${platform.intPriorityClass}-bg)] text-[var(--priority-${platform.intPriorityClass})] mt-2">
                      {platform.intPriority}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedPlatforms.length}, 1fr)` }}>
                <div className="col-span-full text-sm uppercase tracking-wider text-[#5C524D] py-2 border-b-2 border-[#D9D2CC]">
                  General Information
                </div>
                
                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Provider</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center text-center text-sm">
                    {p.provider}
                  </div>
                ))}

                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Market Share</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center text-center text-sm">
                    {p.marketShare}
                  </div>
                ))}

                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Pricing</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center text-center text-sm">
                    {p.pricing}
                  </div>
                ))}

                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Context Window</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center text-center text-sm">
                    {p.contextWindow}
                  </div>
                ))}

                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Implementation</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center text-center text-sm">
                    {p.implementationTime}
                  </div>
                ))}
              </div>

              <div className="grid gap-2" style={{ gridTemplateColumns: `200px repeat(${selectedPlatforms.length}, 1fr)` }}>
                <div className="col-span-full text-sm uppercase tracking-wider text-[#5C524D] py-2 border-b-2 border-[#D9D2CC] mt-4">
                  Capability Scores (1-10)
                </div>
                
                {scoreFeatures.map(feature => (
                  <React.Fragment key={feature}>
                    <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    {selectedPlatforms.map(p => {
                      const score = p.scores[feature] || 0;
                      return (
                        <div key={`${p.id}-${feature}`} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 flex items-center justify-center">
                          <span className={`text-lg ${getScoreClass(score)}`}>{score}</span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid gap-2 mt-6" style={{ gridTemplateColumns: `200px repeat(${selectedPlatforms.length}, 1fr)` }}>
                <div className="col-span-full text-sm uppercase tracking-wider text-[#5C524D] py-2 border-b-2 border-[#D9D2CC]">
                  Verdict
                </div>
                
                <div className="bg-[#F5F5F5] px-4 py-3 rounded-lg flex items-center">Recommendation</div>
                {selectedPlatforms.map(p => (
                  <div key={p.id} className="bg-white border border-[#EDE8E3] rounded-lg px-4 py-3 text-left text-xs">
                    <em>"{p.verdict}"</em>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-[#EDE8E3] bg-[#FAFAFA] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-[#E88A1D] rounded-lg hover:bg-[#D07614] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
