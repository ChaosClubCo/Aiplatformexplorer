import { Platform } from '../../../types';
import PlatformTableHeader from './platform-table/PlatformTableHeader';
import PlatformTableRow from './platform-table/PlatformTableRow';

interface PlatformTableProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onToggleSelect: (id: string) => void;
  onViewDetails: (platform: Platform) => void;
  maxCompare: number;
}

export default function PlatformTable({
  platforms,
  selectedPlatforms,
  onToggleSelect,
  onViewDetails,
  maxCompare
}: PlatformTableProps) {
  return (
    <div className="overflow-x-auto bg-white border border-[#EDE8E3] rounded-xl">
      <table className="w-full text-sm">
        <PlatformTableHeader />
        <tbody>
          {platforms.map(platform => {
            const isSelected = selectedPlatforms.includes(platform.id);
            const isDisabled = !isSelected && selectedPlatforms.length >= maxCompare;

            return (
              <PlatformTableRow
                key={platform.id}
                platform={platform}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onToggleSelect={onToggleSelect}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
