import React, { useState } from 'react';
import { useRiskData } from '../hooks/useRiskData';
import RiskFilters from './RiskFIlters';
import RiskStats from './RiskStats';
import RiskTabs, { TabId } from './RiskTabs';
import GridHeatMap from './GridHeatMap';
import ScatterHeatMap from './ScatterHeatMap';
import RiskBreakdown from './RiskBreakdown';
import RiskTable from './RiskTable';

const RiskManagementDashboard: React.FC = () => {
  const {
    filteredRisks,
    categories,
    statuses,
    filters,
    setFilters,
    loading
  } = useRiskData();

  const [activeTab, setActiveTab] = useState<TabId>('grid-heatmap');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading risks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Risk Management Dashboard</h1>

        <RiskFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          statuses={statuses}
        />

        <RiskStats risks={filteredRisks} />

        <div className="bg-white rounded-lg shadow mb-6">
          <RiskTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === 'grid-heatmap' && <GridHeatMap risks={filteredRisks} />}
            {activeTab === 'scatter-heatmap' && <ScatterHeatMap risks={filteredRisks} />}
            {activeTab === 'breakdown' && <RiskBreakdown risks={filteredRisks} />}
            {activeTab === 'table' && <RiskTable risks={filteredRisks} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementDashboard;