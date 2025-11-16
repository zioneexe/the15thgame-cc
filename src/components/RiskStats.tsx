import React from 'react';
import { Risk } from '../types/types';

interface RiskStatsProps {
  risks: Risk[];
}

const RiskStats: React.FC<RiskStatsProps> = ({ risks }) => {
  const highRisks = risks.filter(r => r.totalRiskScore > 12).length;
  const mediumRisks = risks.filter(r => r.totalRiskScore >= 7 && r.totalRiskScore <= 12).length;
  const lowRisks = risks.filter(r => r.totalRiskScore <= 6).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500">Total Risks</div>
        <div className="text-2xl font-bold text-gray-900">{risks.length}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500">High (13+)</div>
        <div className="text-2xl font-bold text-red-600">{highRisks}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500">Medium (7-12)</div>
        <div className="text-2xl font-bold text-yellow-600">{mediumRisks}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500">Low (1-6)</div>
        <div className="text-2xl font-bold text-green-600">{lowRisks}</div>
      </div>
    </div>
  );
};

export default RiskStats;