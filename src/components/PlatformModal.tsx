import { Platform } from '../types';

interface PlatformModalProps {
  platform: Platform;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function PlatformModal({ platform, onClose, isSelected, onToggleSelect }: PlatformModalProps) {
  const priorityClasses: Record<string, string> = {
    baseline: 'bg-[#EFF6FF] text-[#3B82F6]',
    dual: 'bg-[#F5F3FF] text-[#8B5CF6]',
    high: 'bg-[#D1FAE5] text-[#059669]',
    specialized: 'bg-[#FEF3C7] text-[#F59E0B]',
    emerging: 'bg-[#FCE7F3] text-[#EC4899]',
    optional: 'bg-[#F3F4F6] text-[#6B7280]'
  };

  const categoryClasses: Record<string, string> = {
    enterprise: 'bg-[#EFF6FF] text-[#1E40AF]',
    developer: 'bg-[#ECFDF5] text-[#065F46]',
    crm: 'bg-[#FEF3C7] text-[#92400E]',
    research: 'bg-[#F3E8FF] text-[#6B21A8]',
    agentic: 'bg-[#FCE7F3] text-[#BE185D]'
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[800px] max-h-[85vh] overflow-hidden animate-[modalIn_0.3s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#EDE8E3]">
          <h2 className="text-xl text-[#231C19]">{platform.name}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#8B8279] hover:bg-[#F5F5F5] hover:text-[#231C19] transition-all"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center text-[2.5rem] bg-white border border-[#EDE8E3] rounded-xl">
                {platform.logo}
              </div>
              <div>
                <h3 className="text-xl mb-1">{platform.name}</h3>
                <p className="text-[#5C524D]">{platform.provider}</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-block px-3 py-1 text-xs uppercase tracking-wide rounded-full ${
                      priorityClasses[platform.intPriorityClass]
                    }`}
                  >
                    {platform.intPriority}
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${categoryClasses[platform.category]}`}>
                    {platform.categoryLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAFAFA] p-4 rounded-xl">
              <p className="text-[#231C19]">{platform.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAFAFA] p-3 rounded-lg">
                <div className="text-xs text-[#8B8279] mb-1">Market Share</div>
                <div className="text-sm text-[#231C19]">{platform.marketShare}</div>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-lg">
                <div className="text-xs text-[#8B8279] mb-1">Pricing</div>
                <div className="text-sm text-[#231C19]">{platform.pricing}</div>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-lg">
                <div className="text-xs text-[#8B8279] mb-1">Context Window</div>
                <div className="text-sm text-[#231C19]">{platform.contextWindow}</div>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-lg">
                <div className="text-xs text-[#8B8279] mb-1">Implementation</div>
                <div className="text-sm text-[#231C19]">{platform.implementationTime}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wider text-[#5C524D] mb-3">KEY STRENGTHS</h4>
              <ul className="grid gap-2">
                {platform.strengths.map((strength, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#059669]">✓</span> {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wider text-[#5C524D] mb-3">USE CASES</h4>
              <ul className="grid gap-2">
                {platform.useCases.map((useCase, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#E88A1D]">•</span> {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wider text-[#5C524D] mb-3">COMPLIANCE</h4>
              <div className="flex flex-wrap gap-2">
                {platform.compliance.map((cert, i) => (
                  <span key={i} className="px-2 py-1 bg-[#E0F2FE] text-[#0284C7] rounded text-xs">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FEF3E7] p-4 rounded-xl border-l-4 border-[#E88A1D]">
              <h4 className="text-sm text-[#D07614] mb-2">INT Inc. Recommendation</h4>
              <p className="mb-2 text-[#231C19]">{platform.intRecommendation}</p>
              <p className="text-sm italic text-[#5C524D]">"{platform.verdict}"</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-[#EDE8E3] bg-[#FAFAFA]">
          <button
            onClick={() => onToggleSelect(platform.id)}
            className="px-4 py-2 text-sm text-[#231C19] bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] hover:border-[#B5ADA6] transition-all"
          >
            {isSelected ? 'Remove from Compare' : 'Add to Compare'}
          </button>
          <a
            href={platform.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-white bg-[#E88A1D] rounded-lg hover:bg-[#D07614] transition-all"
          >
            Visit Official Site
          </a>
        </div>
      </div>
    </>
  );
}
