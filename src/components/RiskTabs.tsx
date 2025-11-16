import React from 'react';

type TabId = 'grid-heatmap' | 'scatter-heatmap' | 'breakdown' | 'table';

interface Tab {
  id: TabId;
  label: string;
}

interface RiskTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const tabs: Tab[] = [
  { id: 'grid-heatmap', label: 'Grid Heat Map' },
  { id: 'scatter-heatmap', label: 'Scatter Heat Map' },
  { id: 'breakdown', label: 'Risk Breakdown' },
  { id: 'table', label: 'All Risks' }
];

const RiskTabs: React.FC<RiskTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default RiskTabs;
export type { TabId };