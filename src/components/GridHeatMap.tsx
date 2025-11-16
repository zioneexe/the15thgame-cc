// src/components/RiskManagement/GridHeatMap.tsx
import React, { useState, useMemo } from 'react';
import { Risk, GridHeatmapData } from '../types/types';

interface GridHeatMapProps {
  risks: Risk[];
}

const GridHeatMap: React.FC<GridHeatMapProps> = ({ risks }) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const gridData = useMemo<GridHeatmapData>(() => {
    const grid: GridHeatmapData = {};
    for (let prob = 1; prob <= 5; prob++) {
      for (let imp = 1; imp <= 5; imp++) {
        grid[`${prob}-${imp}`] = [];
      }
    }
    risks.forEach(risk => {
      const key = `${risk.probability}-${risk.impact}`;
      if (grid[key]) grid[key].push(risk);
    });
    return grid;
  }, [risks]);

  const getCellColor = (prob: number, imp: number): string => {
    const score = prob * imp;
    if (score <= 6) return '#86efac';
    if (score <= 12) return '#fde047';
    return '#fca5a5';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Heat Map (Grid)</h2>
      <div className="flex justify-center">
        <div className="inline-block">
          <div className="mb-2 text-center font-semibold">Impact →</div>
          <div className="flex">
            <div className="flex flex-col justify-center mr-2">
              <div className="text-sm font-semibold rotate-180" style={{ writingMode: 'vertical-lr' }}>
                Likelihood →
              </div>
            </div>
            <div className="border-2 border-gray-800">
              {[5, 4, 3, 2, 1].map(prob => (
                <div key={prob} className="flex">
                  {[1, 2, 3, 4, 5].map(imp => {
                    const key = `${prob}-${imp}`;
                    const cellRisks = gridData[key] || [];
                    return (
                      <div
                        key={key}
                        className="relative border border-gray-400 cursor-pointer transition-transform hover:scale-105"
                        style={{
                          width: '120px',
                          height: '120px',
                          backgroundColor: getCellColor(prob, imp)
                        }}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="absolute top-1 left-1 text-xs font-semibold">
                          {prob},{imp}
                        </div>
                        {cellRisks.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{cellRisks.length}</div>
                              <div className="text-xs">{cellRisks.length === 1 ? 'risk' : 'risks'}</div>
                            </div>
                          </div>
                        )}
                        {hoveredCell === key && cellRisks.length > 0 && (
                          <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 bg-white border-2 border-gray-800 rounded-lg shadow-xl p-3 w-80">
                            <div className="font-semibold text-sm mb-2">Risks ({cellRisks.length}):</div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {cellRisks.map((risk, idx) => (
                                <div key={idx} className="text-xs border-l-2 border-blue-500 pl-2 py-1">
                                  <div className="font-medium">{risk.risk}</div>
                                  <div className="text-gray-600 mt-1">
                                    Score: {risk.totalRiskScore} | {risk.category}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#86efac' }}></div>
              <span className="text-sm">Low (≤6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fde047' }}></div>
              <span className="text-sm">Medium (7-12)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fca5a5' }}></div>
              <span className="text-sm">High (≥13)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridHeatMap;