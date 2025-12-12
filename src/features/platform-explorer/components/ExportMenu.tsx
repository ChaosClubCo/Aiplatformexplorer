import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { useAppContext } from '../../../context/AppContext';
import { pdfService } from '../../../services/pdfService';
import { useToast } from '../../../contexts/ToastContext';

export function ExportMenu() {
  const { state } = useAppContext();
  const { showToast } = useToast();

  const handleExport = (format: string) => {
    try {
      if (format === 'pdf') {
        const stats = {
          total: state.platforms.all.length,
          providers: new Set(state.platforms.all.map(p => p.provider)).size,
        };
        
        // Use filtered platforms if available, otherwise all
        const platformsToExport = state.platforms.filtered.length > 0 
          ? state.platforms.filtered 
          : state.platforms.all;
          
        pdfService.generateExecutiveSummary(stats, platformsToExport);
        showToast('Executive Summary PDF generated successfully', 'success');
      } else {
        // Placeholder for other formats
        console.log(`Exporting as ${format}...`);
        showToast(`${format.toUpperCase()} export started`, 'info');
      }
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to generate export', 'error');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <span className="mr-2">📄</span> Executive Summary (PDF)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          <span className="mr-2">📝</span> Technical Specs (Markdown)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <span className="mr-2">📊</span> ROI Data (CSV)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
