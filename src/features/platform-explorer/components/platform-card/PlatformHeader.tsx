import { memo } from 'react';
import { Platform } from '../../../../types';

interface PlatformHeaderProps {
  platform: Platform;
  isSelected: boolean;
  onToggleSelect: () => void;
  disabled?: boolean;
}

function PlatformHeader({ platform, isSelected, onToggleSelect, disabled }: PlatformHeaderProps) {
  return (
    <div className="flex items-start justify-between p-5 bg-gradient-to-b from-[var(--color-bg-tertiary)] to-transparent">
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
          onChange={onToggleSelect}
          disabled={disabled}
          className="w-[18px] h-[18px] accent-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Select ${platform.name} for comparison`}
          aria-describedby={`platform-${platform.id}-description`}
        />
      </div>
    </div>
  );
}

export default memo(PlatformHeader);
