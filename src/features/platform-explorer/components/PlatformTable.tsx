import { Platform } from '../../../types';

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
    <div className="overflow-x-auto bg-white border border-[#EDE8E3] rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="w-[40px] px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3]"></th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Platform
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Provider
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Category
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Market Share
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Pricing
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Context
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Priority
            </th>
            <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {platforms.map(platform => {
            const isSelected = selectedPlatforms.includes(platform.id);
            const isDisabled = !isSelected && selectedPlatforms.length >= maxCompare;

            return (
              <tr
                key={platform.id}
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
                    className="w-[18px] h-[18px] accent-[#E88A1D] cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-4 py-3 text-[#231C19]">
                  <div className="flex items-center gap-2">
                    <span className="text-[1.25rem]">{platform.logo}</span>
                    <span>{platform.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#231C19]">{platform.provider}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${categoryClasses[platform.category]}`}>
                    {platform.categoryLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#231C19]">{platform.marketShare}</td>
                <td className="px-4 py-3 text-[#231C19]">{platform.pricing}</td>
                <td className="px-4 py-3 text-[#231C19]">{platform.contextWindow}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs uppercase tracking-wide rounded-full ${
                      priorityClasses[platform.intPriorityClass]
                    }`}
                  >
                    {platform.intPriority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onViewDetails(platform)}
                    className="w-9 h-9 flex items-center justify-center text-[#5C524D] hover:bg-[#F5F5F5] rounded-lg transition-colors"
                    aria-label="View details"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
