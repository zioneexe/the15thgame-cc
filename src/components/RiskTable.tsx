import React from 'react';
import { Risk } from '../types/types';

interface RiskTableProps {
  risks: Risk[];
}

const RiskTable: React.FC<RiskTableProps> = ({ risks }) => {
  const getColorForScore = (score: number): string => {
    if (score <= 6) return '#22c55e';
    if (score <= 12) return '#eab308';
    return '#ef4444';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Risks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {risks.map((risk, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                  <div className="font-medium">{risk.risk}</div>
                  <div className="text-xs text-gray-500 mt-1">{risk.comments}</div>
                </td>
                <td className="px-4 py-3 text-sm">{risk.category}</td>
                <td className="px-4 py-3 text-sm">{risk.probability}</td>
                <td className="px-4 py-3 text-sm">{risk.impact}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getColorForScore(risk.totalRiskScore) }}
                  >
                    {risk.totalRiskScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {risk.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;