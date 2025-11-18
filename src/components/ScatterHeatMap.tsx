import React, { useMemo } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ZAxis, 
  Cell, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Risk, ScatterDataPoint } from '../types/types';

interface ScatterHeatMapProps {
  risks: Risk[];
}

const ScatterHeatMap: React.FC<ScatterHeatMapProps> = ({ risks }) => {
  const scatterData = useMemo<ScatterDataPoint[]>(() => {
    const grouped: { [key: string]: { x: number; y: number; risks: Risk[] } } = {};
    risks.forEach(risk => {
      const key = `${risk.impact}-${risk.probability}`;
      if (!grouped[key]) {
        grouped[key] = { x: risk.impact, y: risk.probability, risks: [] };
      }
      grouped[key].risks.push(risk);
    });
    return Object.values(grouped).map(group => ({
      x: group.x,
      y: group.y,
      z: group.risks.length,
      risks: group.risks,
      totalScore: group.risks.reduce((sum, r) => sum + r.totalRiskScore, 0) / group.risks.length
    }));
  }, [risks]);

  const getColorForScore = (score: number): string => {
    if (score <= 6) return '#22c55e';
    if (score <= 12) return '#eab308';
    return '#ef4444';
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ScatterDataPoint;
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded shadow-lg max-w-md">
          <p className="font-bold text-sm mb-2">
            Probability: {data.y} | Impact: {data.x}
          </p>
          <p className="font-semibold text-sm mb-2">
            {data.risks.length} {data.risks.length === 1 ? 'Risk' : 'Risks'}:
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-2 py-1">
                <p className="text-xs font-semibold">
                  {risk.risk.length > 50 ? `${risk.risk.substring(0, 50)}...` : risk.risk}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Probability: {risk.probability} | Impact: {risk.impact} | Score: {risk.totalRiskScore} | {risk.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Heat Map (Scatter)</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Impact"
            domain={[0, 6]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: 'Impact', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Probability"
            domain={[0, 6]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis type="number" dataKey="z" range={[200, 1000]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForScore(entry.totalScore)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterHeatMap;