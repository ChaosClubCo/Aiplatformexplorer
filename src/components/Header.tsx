import { useState } from 'react';

interface HeaderProps {
  compareCount: number;
  onCompare: () => void;
  onExport: (format: string) => void;
  compareDisabled: boolean;
}

export default function Header({ compareCount, onCompare, onExport, compareDisabled }: HeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-[200] bg-gradient-to-br from-[#FFFCF8] to-[#FEF7F0] border-b border-[#EDE8E3] backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-[72px] gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E88A1D] to-[#D97706] rounded-xl flex items-center justify-center text-white">
              AI
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg text-[#231C19]">INT Inc.</span>
              <span className="text-xs text-[#8B8279] uppercase tracking-wider">AI Platform Explorer v3.1</span>
            </div>
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3E7] border border-[rgba(232,138,29,0.2)] rounded-full text-xs text-[#D07614]">
              <span>🏢</span>
              <span>INT Inc.</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-[#231C19] border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all"
              >
                <span>📥</span>
                <span>Export</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-white border border-[#D9D2CC] rounded-xl shadow-2xl min-w-[200px] z-[100]">
                    <button
                      onClick={() => {
                        onExport('csv');
                        setShowExportMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#231C19] hover:bg-[#FAFAFA] transition-colors first:rounded-t-xl"
                    >
                      <span className="w-5 text-center">📊</span>
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        onExport('json');
                        setShowExportMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#231C19] hover:bg-[#FAFAFA] transition-colors last:rounded-b-xl"
                    >
                      <span className="w-5 text-center">{'{ }'}</span>
                      <span>Export as JSON</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onCompare}
              disabled={compareDisabled}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#E88A1D] text-white rounded-lg hover:bg-[#D07614] disabled:bg-[#D4D4D4] disabled:cursor-not-allowed transition-all hover:shadow-md hover:-translate-y-[1px]"
            >
              <span>⚖️</span>
              <span>Compare ({compareCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
