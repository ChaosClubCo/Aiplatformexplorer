import { Filters } from '../types';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
  currentView: 'cards' | 'table';
  onViewChange: (view: 'cards' | 'table') => void;
  visibleCount: number;
  totalCount: number;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  currentView,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-4 bg-white border-b border-[#EDE8E3]">
      <div className="flex items-center gap-2">
        <label className="text-sm text-[#5C524D]">Provider:</label>
        <select
          value={filters.provider}
          onChange={e => onFilterChange({ ...filters, provider: e.target.value })}
          className="px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] min-w-[160px]"
        >
          <option value="all">All Providers</option>
          <optgroup label="Enterprise Foundation">
            <option value="microsoft">Microsoft</option>
            <option value="google">Google</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </optgroup>
          <optgroup label="Developer & Code">
            <option value="github">GitHub</option>
            <option value="amazon">Amazon (AWS)</option>
          </optgroup>
          <optgroup label="CRM & Business">
            <option value="salesforce">Salesforce</option>
            <option value="hubspot">HubSpot</option>
            <option value="ibm">IBM</option>
          </optgroup>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-[#5C524D]">Category:</label>
        <select
          value={filters.category}
          onChange={e => onFilterChange({ ...filters, category: e.target.value })}
          className="px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] min-w-[160px]"
        >
          <option value="all">All Categories</option>
          <option value="enterprise">🏢 Enterprise Foundation</option>
          <option value="developer">💻 Developer & Code</option>
          <option value="crm">📊 CRM & Business</option>
          <option value="research">🔍 Research & Productivity</option>
          <option value="agentic">🤖 Agentic AI</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-[#5C524D]">Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] min-w-[160px]"
        >
          <optgroup label="Market & Adoption">
            <option value="marketShare-desc">Market Share (Highest)</option>
            <option value="marketShare-asc">Market Share (Lowest)</option>
            <option value="growthRate-desc">Growth Rate (Fastest)</option>
          </optgroup>
          <optgroup label="Pricing">
            <option value="price-asc">Price (Lowest First)</option>
            <option value="price-desc">Price (Highest First)</option>
          </optgroup>
          <optgroup label="Capabilities">
            <option value="contextWindow-desc">Context Window (Largest)</option>
            <option value="compliance-desc">Compliance Certs (Most)</option>
            <option value="avgScore-desc">Avg Capability Score (Highest)</option>
          </optgroup>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Search platforms..."
          className="px-3 py-2 pl-10 text-sm bg-white border border-[#D9D2CC] rounded-lg min-w-[240px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Im0yMSAyMS00LjM1LTQuMzUiIHN0cm9rZT0iIzczNzM3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] bg-[left_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="inline-flex bg-[#F5F5F5] rounded-lg p-0.5">
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
              currentView === 'cards' ? 'bg-white text-[#E88A1D] shadow-sm' : 'text-[#A89F97] hover:text-[#5C524D]'
            }`}
            aria-label="Card view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
              currentView === 'table' ? 'bg-white text-[#E88A1D] shadow-sm' : 'text-[#A89F97] hover:text-[#5C524D]'
            }`}
            aria-label="Table view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <button
          onClick={onClearFilters}
          className="px-3 py-2 text-sm text-[#5C524D] hover:bg-[#F5F5F5] rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
