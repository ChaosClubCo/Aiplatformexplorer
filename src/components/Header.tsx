import { useState, useEffect, useRef } from 'react';
import { ScenarioManager } from '../features/scenarios/components/ScenarioManager';
import { TeamSettings } from '../features/team/components/TeamSettings';

interface HeaderProps {
  compareCount: number;
  onCompare: () => void;
  onExport: (format: string) => void;
  compareDisabled: boolean;
}

export default function Header({ compareCount, onCompare, onExport, compareDisabled }: HeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showExportMenu) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showExportMenu]);

  return (
    <header className="sticky top-0 z-[200] bg-gradient-to-br from-[#FFFCF8] to-[#FEF7F0] border-b border-[#EDE8E3] backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-3 sm:gap-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E88A1D] to-[#D97706] rounded-xl flex items-center justify-center text-white flex-shrink-0">
              AI
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base sm:text-lg text-[#231C19] truncate">INT Inc.</span>
              <span className="text-[10px] sm:text-xs text-[#8B8279] uppercase tracking-wider truncate">
                AI Platform Explorer v3.1
              </span>
            </div>
            <span className="hidden lg:inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3E7] border border-[rgba(232,138,29,0.2)] rounded-full text-xs text-[#D07614] flex-shrink-0">
              <span>🏢</span>
              <span>INT Inc.</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <ScenarioManager />
            <TeamSettings />
            
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm bg-white text-[#231C19] border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
                aria-label="Export data"
                aria-expanded={showExportMenu}
                aria-haspopup="true"
              >
                <span>📥</span>
                <span className="hidden sm:inline">Export</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showExportMenu && (
                <div 
                  className="absolute top-full right-0 mt-2 bg-white border border-[#D9D2CC] rounded-xl shadow-2xl min-w-[200px] z-[100]"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={() => {
                      onExport('csv');
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#231C19] hover:bg-[#FAFAFA] transition-colors first:rounded-t-xl focus:outline-none focus:bg-[#FEF3E7]"
                    role="menuitem"
                  >
                    <span className="w-5 text-center">📊</span>
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      onExport('json');
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#231C19] hover:bg-[#FAFAFA] transition-colors last:rounded-b-xl focus:outline-none focus:bg-[#FEF3E7]"
                    role="menuitem"
                  >
                    <span className="w-5 text-center">{'{ }'}</span>
                    <span>Export as JSON</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onCompare}
              disabled={compareDisabled}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm bg-[#E88A1D] text-white rounded-lg hover:bg-[#D07614] disabled:bg-[#D4D4D4] disabled:cursor-not-allowed transition-all hover:shadow-md hover:-translate-y-[1px] disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#E88A1D] focus:ring-offset-2"
              aria-label={`Compare ${compareCount} selected platforms`}
              aria-disabled={compareDisabled}
            >
              <span>⚖️</span>
              <span className="hidden sm:inline">Compare</span>
              <span className="sm:hidden">({compareCount})</span>
              <span className="hidden sm:inline">({compareCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}