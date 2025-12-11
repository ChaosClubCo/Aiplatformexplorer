import { Platform } from '../types';

interface ComparisonSidebarProps {
  selectedPlatforms: string[];
  platforms: Platform[];
  maxCompare: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function ComparisonSidebar({
  selectedPlatforms,
  platforms,
  maxCompare,
  onRemove,
  onClear,
  onCompare
}: ComparisonSidebarProps) {
  if (selectedPlatforms.length === 0) return null;

  return (
    <aside
      className="fixed bottom-6 right-6 z-[300] bg-white border border-[#D9D2CC] rounded-2xl shadow-2xl p-4 min-w-[280px] max-w-[360px] animate-[slideUp_0.3s_ease]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#231C19]">Compare Platforms</span>
        <span className="text-xs text-[#8B8279]">
          {selectedPlatforms.length}/{maxCompare} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedPlatforms.map(id => {
          const platform = platforms.find(p => p.id === id);
          if (!platform) return null;

          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#FEF3E7] rounded-full text-xs text-[#D07614]"
            >
              {platform.logo} {platform.name}
              <button
                onClick={() => onRemove(id)}
                className="w-3.5 h-3.5 flex items-center justify-center bg-[rgba(232,138,29,0.2)] rounded-full text-[10px] hover:bg-[rgba(232,138,29,0.4)] transition-colors"
                aria-label={`Remove ${platform.name}`}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-2 text-sm text-[#231C19] bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all"
        >
          Clear All
        </button>
        <button
          onClick={onCompare}
          className="flex-1 px-3 py-2 text-sm text-white bg-[#E88A1D] rounded-lg hover:bg-[#D07614] transition-all"
        >
          Compare Now
        </button>
      </div>
    </aside>
  );
}
