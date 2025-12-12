import { memo } from 'react';
import { Platform } from '../../../../types';
import { priorityClasses, categoryClasses } from '../../constants/styles';
import { Button } from '../../../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../../components/ui/dropdown-menu';
import { MoreHorizontal, FileText, PlusCircle, CheckCircle, Share2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PlatformTableRowProps {
  platform: Platform;
  isSelected: boolean;
  isDisabled: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (platform: Platform) => void;
}

function PlatformTableRow({
  platform,
  isSelected,
  isDisabled,
  onToggleSelect,
  onViewDetails
}: PlatformTableRowProps) {

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/platform/${platform.id}`; // Note: This will need routing support
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <tr
      className={`border-b border-[#EDE8E3] last:border-b-0 hover:bg-[#FEF3E7] transition-colors ${
        isSelected ? 'bg-[#FEF3E7]' : ''
      }`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(platform.id)}
          disabled={isDisabled}
          className="w-[18px] h-[18px] accent-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Select ${platform.name}`}
        />
      </td>
      <td className="px-4 py-3 text-[#231C19]">
        <div className="flex items-center gap-2">
          <span className="text-[1.25rem]">{platform.logo}</span>
          <span className="font-medium">{platform.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[#231C19]">{platform.provider}</td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-0.5 text-xs rounded ${categoryClasses[platform.category] || categoryClasses.enterprise}`}>
          {platform.categoryLabel}
        </span>
      </td>
      <td className="px-4 py-3 text-[#231C19]">{platform.marketShare}</td>
      <td className="px-4 py-3 text-[#231C19]">{platform.pricing}</td>
      <td className="px-4 py-3 text-[#231C19]">{platform.contextWindow}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-block px-3 py-1 text-xs uppercase tracking-wide rounded-full ${
            priorityClasses[platform.intPriorityClass] || priorityClasses.optional
          }`}
        >
          {platform.intPriority}
        </span>
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-[#5C524D]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(platform)}>
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleSelect(platform.id)}>
              {isSelected ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                  Selected
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to Compare
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Platform
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={platform.officialUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default memo(PlatformTableRow);
