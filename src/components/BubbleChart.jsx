import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts'
import './BubbleChart.css'

const BubbleChart = ({ risks }) => {
  const [selectedRisk, setSelectedRisk] = useState(null)

  // Prepare data for bubble chart
  const bubbleData = risks.map((risk, index) => ({
    ...risk,
    x: risk.probability,
    y: risk.impact,
    z: risk.score * 100, // Size multiplier for visibility
    index: index + 1
  }))

  // Sort by risk score for ranking
  const rankedRisks = [...risks]
    .sort((a, b) => b.score - a.score)
    .map((risk, index) => ({ ...risk, rank: index + 1 }))

  const getRiskColor = (score) => {
    if (score <= 6) return '#4caf50'
    if (score <= 12) return '#ffeb3b'
    if (score <= 16) return '#ff9800'
    return '#f44336'
  }

  const getRiskLevel = (score) => {
    if (score <= 6) return 'Low'
    if (score <= 12) return 'Medium'
    if (score <= 16) return 'High'
    return 'Critical'
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bubble-tooltip">
          <p className="tooltip-title"><strong>{data.category}</strong></p>
          <p className="tooltip-risk">{data.risk.substring(0, 80)}{data.risk.length > 80 ? '...' : ''}</p>
          <div className="tooltip-stats">
            <p>Probability: {data.probability} ({(data.probability * 20).toFixed(1)}%)</p>
            <p>Impact: {data.impact} ({(data.impact * 20).toFixed(1)}%)</p>
            <p>Risk Score: {data.score}</p>
            <p style={{ fontWeight: 'bold', color: getRiskColor(data.score) }}>
              Level: {getRiskLevel(data.score)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const handleRiskClick = (risk) => {
    setSelectedRisk(selectedRisk?.id === risk.id ? null : risk)
  }

  return (
    <div className="bubble-container">
      <div className="bubble-chart-wrapper">
        <ResponsiveContainer width="100%" height={600}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Probability"
              domain={[0, 6]}
              ticks={[0, 1, 2, 3, 4, 5]}
              label={{ value: 'Probability (Likelihood)', position: 'insideBottom', offset: -10, style: { fontWeight: 'bold' } }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Impact"
              domain={[0, 6]}
              ticks={[0, 1, 2, 3, 4, 5]}
              label={{ value: 'Impact', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
            />
            <ZAxis type="number" dataKey="z" range={[400, 2000]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Risks"
              data={bubbleData}
              fill="#8884d8"
            >
              {bubbleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getRiskColor(entry.score)}
                  stroke={selectedRisk?.id === entry.id ? '#000' : '#333'}
                  strokeWidth={selectedRisk?.id === entry.id ? 3 : 1}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRiskClick(entry)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#4caf50' }}></div>
            <span>Low (1-6)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#ffeb3b' }}></div>
            <span>Medium (7-12)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#ff9800' }}></div>
            <span>High (13-16)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#f44336' }}></div>
            <span>Critical (17-25)</span>
          </div>
        </div>
      </div>

      <div className="risk-ranking">
        <h3>Risk Heat Ranking</h3>
        <ol>
          {rankedRisks.map((risk) => (
            <li
              key={risk.id}
              className={selectedRisk?.id === risk.id ? 'selected' : ''}
              onClick={() => handleRiskClick(risk)}
              style={{ borderLeft: `4px solid ${getRiskColor(risk.score)}` }}
            >
              <div className="rank-header">
                <span className="risk-score">{risk.score}</span>
                <span className="risk-category">{risk.category}</span>
              </div>
              <div className="risk-title">{risk.risk}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default BubbleChart
