import { memo } from 'react';
import { Platform } from '../../../../types';

interface PlatformMetricsProps {
  platform: Platform;
}

function PlatformMetrics({ platform }: PlatformMetricsProps) {
  return (
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
  );
}

export default memo(PlatformMetrics);
