import { Platform } from '../../../types';
import { memo, useCallback } from 'react';
import { motion } from 'motion/react';
import PlatformHeader from './platform-card/PlatformHeader';
import PlatformBadges from './platform-card/PlatformBadges';
import PlatformMetrics from './platform-card/PlatformMetrics';
import PlatformScores from './platform-card/PlatformScores';
import PlatformActions from './platform-card/PlatformActions';

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
      // Dropdown trigger handles this naturally, but we keep this for accessibility 
      // if focus is on the card itself, though standard is interactive elements take focus
    }
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border rounded-2xl overflow-hidden transition-all hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[var(--color-primary)] shadow-[0_0_0_2px_#FEF3E7,0_10px_15px_-3px_rgba(0,0,0,0.1)]'
          : 'border-[#EDE8E3]'
      }`}
      role="article"
      aria-label={`${platform.name} by ${platform.provider}`}
    >
      <PlatformHeader 
        platform={platform} 
        isSelected={isSelected} 
        onToggleSelect={handleToggleSelect} 
        disabled={disabled} 
      />

      <div className="px-5 pb-5">
        <PlatformBadges platform={platform} />
        <PlatformMetrics platform={platform} />
        <PlatformScores platform={platform} />
      </div>

      <PlatformActions 
        platform={platform} 
        isSelected={isSelected}
        onViewDetails={handleViewDetails} 
        onToggleSelect={handleToggleSelect}
        onKeyPress={handleKeyPress}
      />
    </motion.article>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(PlatformCard);
