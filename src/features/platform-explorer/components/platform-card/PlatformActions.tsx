import { memo } from 'react';
import { Platform } from '../../../../types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../../components/ui/dropdown-menu';
import { Button } from '../../../../components/ui/button';
import { ChevronDown, ExternalLink, FileText, PlusCircle, Share2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PlatformActionsProps {
  platform: Platform;
  isSelected: boolean;
  onViewDetails: () => void;
  onToggleSelect: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

function PlatformActions({ 
  platform, 
  isSelected,
  onViewDetails, 
  onToggleSelect,
  onKeyPress 
}: PlatformActionsProps) {

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/platform/${platform.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="flex gap-2 p-4 border-t border-[#EDE8E3] bg-[#FAFAFA]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-[#231C19] bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
            onKeyDown={onKeyPress}
            aria-label={`Actions for ${platform.name}`}
          >
            Details <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onViewDetails} className="cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            View Full Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleSelect} className="cursor-pointer">
            {isSelected ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-[var(--color-primary)]" />
                Selected
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add to Compare
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
            <Share2 className="w-4 h-4 mr-2" />
            Share Platform
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <a
        href={platform.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-center text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
        aria-label={`Visit ${platform.name} official website (opens in new tab)`}
      >
        Visit Site <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

export default memo(PlatformActions);
