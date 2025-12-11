interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  platformCount: number;
}

export default function Navigation({ currentTab, onTabChange, platformCount }: NavigationProps) {
  const tabs = [
    { id: 'explorer', label: 'Platform Explorer', icon: '🔍', badge: platformCount },
    { id: 'matrix', label: 'Feature Matrix', icon: '📊' },
    { id: 'financial', label: 'ROI Calculator', icon: '💰' },
    { id: 'assessment', label: 'Get Recommendation', icon: '🤖' },
    { id: 'glossary', label: 'Glossary', icon: '📚' }
  ];

  return (
    <nav className="flex items-center gap-1 bg-white border-b border-[#EDE8E3] px-6 overflow-x-auto scrollbar-none">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex items-center gap-2 px-5 py-4 text-sm transition-all whitespace-nowrap ${
            currentTab === tab.id
              ? 'text-[#E88A1D]'
              : 'text-[#5C524D] hover:text-[#231C19] hover:bg-[#FAFAFA]'
          }`}
          aria-selected={currentTab === tab.id}
          role="tab"
        >
          <span className="text-[1.1em]">{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-xs bg-[#FEF3E7] text-[#E88A1D] rounded-full">
              {tab.badge}
            </span>
          )}
          {currentTab === tab.id && (
            <span className="absolute bottom-0 left-5 right-5 h-[3px] bg-[#E88A1D] rounded-t-full" />
          )}
        </button>
      ))}
    </nav>
  );
}