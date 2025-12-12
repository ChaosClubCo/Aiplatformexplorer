import { Platform } from '../../../types';
import { memo, useCallback } from 'react';
import { motion } from 'motion/react';

interface PlatformCardProps {
  platform: Platform;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (platform: Platform) => void;
  disabled?: boolean;
}

function PlatformCard({
  platform,
  isSelected,
  onToggleSelect,
  onViewDetails,
  disabled
}: PlatformCardProps) {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleToggleSelect = useCallback(() => {
    onToggleSelect(platform.id);
  }, [platform.id, onToggleSelect]);

  const handleViewDetails = useCallback(() => {
    onViewDetails(platform);
  }, [platform, onViewDetails]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  }, [handleViewDetails]);

  const getScoreClass = (score: number) => {
    if (score >= 9) return 'text-[#059669]';
    if (score >= 7) return 'text-[#10B981]';
    if (score >= 5) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const priorityClasses: Record<string, string> = {
    baseline: 'bg-[#EFF6FF] text-[#3B82F6]',
    dual: 'bg-[#F5F3FF] text-[#8B5CF6]',
    high: 'bg-[#D1FAE5] text-[#059669]',
    specialized: 'bg-[#FEF3C7] text-[#F59E0B]',
    emerging: 'bg-[#FCE7F3] text-[#EC4899]',
    optional: 'bg-[#F3F4F6] text-[#6B7280]'
  };

  const categoryClasses: Record<string, string> = {
    enterprise: 'bg-[#EFF6FF] text-[#1E40AF]',
    developer: 'bg-[#ECFDF5] text-[#065F46]',
    crm: 'bg-[#FEF3C7] text-[#92400E]',
    research: 'bg-[#F3E8FF] text-[#6B21A8]',
    agentic: 'bg-[#FCE7F3] text-[#BE185D]'
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border rounded-2xl overflow-hidden transition-all hover:border-[#E88A1D] hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[#E88A1D] shadow-[0_0_0_2px_#FEF3E7,0_10px_15px_-3px_rgba(0,0,0,0.1)]'
          : 'border-[#EDE8E3]'
      }`}
      role="article"
      aria-label={`${platform.name} by ${platform.provider}`}
    >
      <div className="flex items-start justify-between p-5 bg-gradient-to-b from-[#FFF8F1] to-transparent">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 flex items-center justify-center text-[1.75rem] bg-white border border-[#EDE8E3] rounded-xl"
            role="img"
            aria-label={`${platform.name} logo`}
          >
            {platform.logo}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-[#231C19]">{platform.name}</h3>
            <span className="text-sm text-[#8B8279]">{platform.provider}</span>
          </div>
        </div>
        <div className="p-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggleSelect}
            disabled={disabled}
            className="w-[18px] h-[18px] accent-[#E88A1D] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Select ${platform.name} for comparison`}
            aria-describedby={`platform-${platform.id}-description`}
          />
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wide rounded-full ${
              priorityClasses[platform.intPriorityClass]
            }`}
            role="status"
            aria-label={`Priority: ${platform.intPriority}`}
          >
            {platform.intPriority}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${
              categoryClasses[platform.category]
            }`}
            aria-label={`Category: ${platform.categoryLabel}`}
          >
            {platform.categoryLabel}
          </span>
        </div>

        <div 
          className="grid grid-cols-2 gap-3 mb-4"
          id={`platform-${platform.id}-description`}
        >
          <div className="bg-[#FAFAFA] p-3 rounded-lg">
            <div className="text-xs text-[#8B8279] mb-1">Market Share</div>
            <div className="text-sm text-[#231C19]">{platform.marketShare}</div>
          </div>
          <div className="bg-[#FAFAFA] p-3 rounded-lg">
            <div className="text-xs text-[#8B8279] mb-1">Pricing</div>
            <div className="text-sm text-[#231C19]">{platform.pricing}</div>
          </div>
          <div className="bg-[#FAFAFA] p-3 rounded-lg">
            <div className="text-xs text-[#8B8279] mb-1">Context</div>
            <div className="text-sm text-[#231C19]">{platform.contextWindow}</div>
          </div>
          <div className="bg-[#FAFAFA] p-3 rounded-lg">
            <div className="text-xs text-[#8B8279] mb-1">Compliance</div>
            <div className="text-sm text-[#231C19]">{platform.complianceCount} certs</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs uppercase tracking-wider text-[#5C524D] mb-2">Key Scores</div>
          <div className="flex gap-2 flex-wrap" role="list" aria-label="Platform capability scores">
            {(['codeGeneration', 'creativeWriting', 'dataAnalysis', 'reasoning', 'agentCapabilities'] as const).map(
              key => (
                <span 
                  key={key} 
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#F5F5F5] rounded-full"
                  role="listitem"
                >
                  <span className="text-[#5C524D]">
                    {key.replace(/([A-Z])/g, ' $1').trim().split(' ')[0]}
                  </span>
                  <span 
                    className={`min-w-[16px] text-center ${getScoreClass(platform.scores[key])}`}
                    aria-label={`Score: ${platform.scores[key]} out of 10`}
                  >
                    {platform.scores[key]}
                  </span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-t border-[#EDE8E3] bg-[#FAFAFA]">
        <button
          onClick={handleViewDetails}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 text-xs text-[#231C19] bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
          aria-label={`View details for ${platform.name}`}
        >
          Details
        </button>
        <a
          href={platform.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 text-xs text-center text-white bg-[#E88A1D] rounded-lg hover:bg-[#D07614] transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
          aria-label={`Visit ${platform.name} official website (opens in new tab)`}
        >
          Visit Site
        </a>
      </div>
    </motion.article>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(PlatformCard);
