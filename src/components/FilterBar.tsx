import { Filters } from '../types';
import { useState } from 'react';

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
  visibleCount,
  totalCount
}: FilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-[#EDE8E3]">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white border border-[#D9D2CC] rounded-lg hover:border-[#B5ADA6] focus:outline-none focus:ring-2 focus:ring-[#E88A1D]"
          aria-label="Toggle filters"
          aria-expanded={showMobileFilters}
        >
          <span>🔍</span>
          <span>Filters</span>
          <span className="text-[10px]">{showMobileFilters ? '▲' : '▼'}</span>
        </button>

        {/* Desktop Filters - Always Visible */}
        <div className={`${showMobileFilters ? 'flex' : 'hidden lg:flex'} flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="provider-filter" className="text-sm text-[#5C524D] whitespace-nowrap">
              Provider:
            </label>
            <select
              id="provider-filter"
              value={filters.provider}
              onChange={e => onFilterChange({ ...filters, provider: e.target.value })}
              className="w-full sm:w-auto px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] focus:outline-none min-w-[160px]"
              aria-label="Filter by provider"
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="category-filter" className="text-sm text-[#5C524D] whitespace-nowrap">
              Category:
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={e => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full sm:w-auto px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] focus:outline-none min-w-[160px]"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="enterprise">🏢 Enterprise Foundation</option>
              <option value="developer">💻 Developer & Code</option>
              <option value="crm">📊 CRM & Business</option>
              <option value="research">🔍 Research & Productivity</option>
              <option value="agentic">🤖 Agentic AI</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sort-filter" className="text-sm text-[#5C524D] whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-filter"
              value={filters.sortBy}
              onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="w-full sm:w-auto px-3 py-2 pr-8 text-sm bg-white border border-[#D9D2CC] rounded-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA4TDIgNGg4eiIgZmlsbD0iIzczNzM3MyIvPjwvc3ZnPg==')] bg-[right_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] focus:outline-none min-w-[160px]"
              aria-label="Sort platforms"
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="search-filter" className="sr-only">
              Search platforms
            </label>
            <input
              id="search-filter"
              type="text"
              value={filters.search}
              onChange={e => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search platforms..."
              className="w-full sm:w-auto px-3 py-2 pl-10 text-sm bg-white border border-[#D9D2CC] rounded-lg min-w-[240px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Im0yMSAyMS00LjM1LTQuMzUiIHN0cm9rZT0iIzczNzM3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] bg-[left_12px_center] bg-no-repeat hover:border-[#B5ADA6] focus:border-[#E88A1D] focus:ring-2 focus:ring-[rgba(232,138,29,0.1)] focus:outline-none"
              aria-label="Search platforms by name, provider, or description"
            />
          </div>
        </div>

        {/* View Toggle and Clear - Always Visible */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="inline-flex bg-[#F5F5F5] rounded-lg p-0.5" role="group" aria-label="View mode">
            <button
              onClick={() => onViewChange('cards')}
              className={`flex items-center justify-center w-8 h-8 rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] ${
                currentView === 'cards' ? 'bg-white text-[#E88A1D] shadow-sm' : 'text-[#A89F97] hover:text-[#5C524D]'
              }`}
              aria-label="Card view"
              aria-pressed={currentView === 'cards'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => onViewChange('table')}
              className={`flex items-center justify-center w-8 h-8 rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#E88A1D] ${
                currentView === 'table' ? 'bg-white text-[#E88A1D] shadow-sm' : 'text-[#A89F97] hover:text-[#5C524D]'
              }`}
              aria-label="Table view"
              aria-pressed={currentView === 'table'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-sm text-[#5C524D] hover:bg-[#F5F5F5] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E88A1D]"
            aria-label="Clear all filters"
          >
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {visibleCount !== totalCount && (
        <div 
          className="px-4 sm:px-6 py-2 bg-[#FEF3E7] border-b border-[#E88A1D]/20 text-sm text-[#D07614]"
          role="status"
          aria-live="polite"
        >
          Showing {visibleCount} of {totalCount} platforms
        </div>
      )}
    </>
  );
}