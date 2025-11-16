import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelProps
} from 'recharts';
import { Risk, BreakdownData, CategoryCounts } from '../types/types';

interface RiskBreakdownProps {
  risks: Risk[];
}

interface CustomLabelProps extends LabelProps {
  fill?: string;
}

const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ risks }) => {
  const breakdownData = useMemo<BreakdownData[]>(() => {
    const categoryGroups: { [key: string]: CategoryCounts } = {};
    risks.forEach(risk => {
      if (!categoryGroups[risk.category]) {
        categoryGroups[risk.category] = { low: 0, medium: 0, high: 0 };
      }
      if (risk.totalRiskScore <= 6) categoryGroups[risk.category].low++;
      else if (risk.totalRiskScore <= 12) categoryGroups[risk.category].medium++;
      else categoryGroups[risk.category].high++;
    });

    return Object.entries(categoryGroups)
      .map(([category, counts]) => ({
        category,
        Low: counts.low,
        Medium: counts.medium,
        High: counts.high,
        total: counts.low + counts.medium + counts.high
      }))
      .sort((a, b) => b.total - a.total);
  }, [risks]);

  const renderCustomLabel = (props: CustomLabelProps): React.ReactElement<SVGElement> => {
    const { x, y, width, height, value, fill } = props;
    
    // Повертаємо порожній елемент замість null
    if (!value || value === 0 || typeof value !== 'number') {
      return <g />;
    }
    if (typeof width !== 'number' || width < 25) {
      return <g />;
    }
    if (typeof x !== 'number' || typeof y !== 'number' || typeof height !== 'number') {
      return <g />;
    }

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill={fill === '#ef4444' ? '#fff' : '#333'}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Breakdown by Category</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={breakdownData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="Low" 
            stackId="a" 
            fill="#22c55e" 
            label={renderCustomLabel as any}
          />
          <Bar 
            dataKey="Medium" 
            stackId="a" 
            fill="#eab308" 
            label={renderCustomLabel as any}
          />
          <Bar
            dataKey="High"
            stackId="a"
            fill="#ef4444"
            label={(props: any) => renderCustomLabel({ ...props, fill: '#ef4444' })}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskBreakdown;