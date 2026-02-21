// ============================================================
// BCH CRM - Tab Navigation (Horizontal Scrollable)
// ============================================================

interface TabNavProps {
  tabs: { id: string; label: string; badge?: number }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <div className="sticky top-[52px] z-20 bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto no-scrollbar max-w-mobile mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-shrink-0 px-4 py-3 text-sm font-medium
              border-b-2 transition-colors whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-danger-500 text-white text-[10px] rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
