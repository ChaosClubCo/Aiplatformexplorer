import { memo } from 'react';
import { Platform } from '../../../../types';
import { priorityClasses, categoryClasses } from '../../constants/styles';

interface PlatformBadgesProps {
  platform: Platform;
}

function PlatformBadges({ platform }: PlatformBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wide rounded-full ${
          priorityClasses[platform.intPriorityClass] || priorityClasses.optional
        }`}
        role="status"
        aria-label={`Priority: ${platform.intPriority}`}
      >
        {platform.intPriority}
      </span>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${
          categoryClasses[platform.category] || categoryClasses.enterprise
        }`}
        aria-label={`Category: ${platform.categoryLabel}`}
      >
        {platform.categoryLabel}
      </span>
    </div>
  );
}

export default memo(PlatformBadges);
