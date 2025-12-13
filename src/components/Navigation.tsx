import { useAppContext } from '../context/AppContext';

export default function Navigation() {
  const { state, actions } = useAppContext();
  const currentTab = state.navigation.currentRoute;
  const platformCount = state.platforms.filtered.length;

  const tabs = [
    { id: 'explorer', label: 'Platform Explorer', icon: '🔍', badge: platformCount },
    { id: 'comparison', label: 'Feature Matrix', icon: '📊' },
    { id: 'roi', label: 'ROI Calculator', icon: '💰' },
    { id: 'intelligence', label: 'Intelligence', icon: '🧠' },
    { id: 'ecosystem', label: 'Ecosystem', icon: '🌐' },
  ];

  const handleTabChange = (tabId: string) => {
    actions.navigate(tabId);
  };

  return (
    <nav className="flex items-center gap-1 bg-white border-b border-[#EDE8E3] px-6 overflow-x-auto scrollbar-none">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
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
