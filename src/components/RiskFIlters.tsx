import React from 'react';
import { RiskFilters as RiskFiltersType } from '../types/types';

interface RiskFiltersProps {
  filters: RiskFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<RiskFiltersType>>;
  categories: string[];
  statuses: string[];
}

const RiskFilters: React.FC<RiskFiltersProps> = ({ 
  filters, 
  setFilters, 
  categories, 
  statuses 
}) => {
  const handleReset = () => {
    setFilters({
      category: '',
      status: '',
      minRiskScore: '',
      maxRiskScore: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" key="category-all">All</option>
            {categories.map(cat => (
              <option key={`category-${cat}`} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" key="status-all">All</option>
            {statuses.map(stat => (
              <option key={`status-${stat}`} value={stat}>{stat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
          <input
            type="number"
            value={filters.minRiskScore}
            onChange={(e) => setFilters({ ...filters, minRiskScore: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0"
            min={0}
            max={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
          <input
            type="number"
            value={filters.maxRiskScore}
            onChange={(e) => setFilters({ ...filters, maxRiskScore: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="20"
            min={0}
            max={100}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskFilters;