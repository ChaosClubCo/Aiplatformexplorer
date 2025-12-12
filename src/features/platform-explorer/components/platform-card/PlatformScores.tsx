import { memo } from 'react';
import { Platform } from '../../../../types';

interface PlatformScoresProps {
  platform: Platform;
}

const getScoreClass = (score: number) => {
  if (score >= 9) return 'text-[#059669]';
  if (score >= 7) return 'text-[#10B981]';
  if (score >= 5) return 'text-[#F59E0B]';
  return 'text-[#EF4444]';
};

const SCORE_KEYS = ['codeGeneration', 'creativeWriting', 'dataAnalysis', 'reasoning', 'agentCapabilities'] as const;

function PlatformScores({ platform }: PlatformScoresProps) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wider text-[#5C524D] mb-2">Key Scores</div>
      <div className="flex gap-2 flex-wrap" role="list" aria-label="Platform capability scores">
        {SCORE_KEYS.map(key => (
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
        ))}
      </div>
    </div>
  );
}

export default memo(PlatformScores);
