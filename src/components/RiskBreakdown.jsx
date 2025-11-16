import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import './RiskBreakdown.css'

const RiskBreakdown = ({ risks }) => {
  const [hoveredBar, setHoveredBar] = useState(null)

  // Categorize risks by score
  const categorizeRisk = (score) => {
    if (score <= 6) return 'Low'
    if (score <= 12) return 'Medium'
    return 'High'
  }

  // Group risks by category
  const categories = {}
  risks.forEach(risk => {
    if (!categories[risk.category]) {
      categories[risk.category] = { Low: 0, Medium: 0, High: 0 }
    }
    const level = categorizeRisk(risk.score)
    categories[risk.category][level]++
  })

  // Convert to chart data
  const chartData = Object.entries(categories).map(([category, counts]) => ({
    category,
    Low: counts.Low,
    Medium: counts.Medium,
    High: counts.High,
    total: counts.Low + counts.Medium + counts.High
  })).sort((a, b) => b.total - a.total)

  const colors = {
    Low: '#9bc53d',
    Medium: '#fdc02f',
    High: '#e67e22'
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)
      return (
        <div className="custom-tooltip">
          <p className="label"><strong>{label}</strong></p>
          {payload.map((entry, index) => (
            entry.value > 0 && (
              <p key={index} style={{ color: entry.fill }}>
                {entry.name}: {entry.value}
              </p>
            )
          ))}
          <p style={{ marginTop: '4px', borderTop: '1px solid #ccc', paddingTop: '4px' }}>
            <strong>Total: {total}</strong>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="risk-breakdown">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar
            dataKey="Low"
            stackId="a"
            fill={colors.Low}
            label={{ position: 'inside', fill: '#333', fontSize: 14, fontWeight: 'bold' }}
            onMouseEnter={() => setHoveredBar('Low')}
            onMouseLeave={() => setHoveredBar(null)}
          />
          <Bar
            dataKey="Medium"
            stackId="a"
            fill={colors.Medium}
            label={{ position: 'inside', fill: '#333', fontSize: 14, fontWeight: 'bold' }}
            onMouseEnter={() => setHoveredBar('Medium')}
            onMouseLeave={() => setHoveredBar(null)}
          />
          <Bar
            dataKey="High"
            stackId="a"
            fill={colors.High}
            label={{ position: 'inside', fill: '#fff', fontSize: 14, fontWeight: 'bold' }}
            onMouseEnter={() => setHoveredBar('High')}
            onMouseLeave={() => setHoveredBar(null)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RiskBreakdown
