import { useState } from 'react'
import './HeatMap.css'

const HeatMap = ({ risks }) => {
  const [hoveredCell, setHoveredCell] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Create a 5x5 grid
  const gridSize = 5

  // Calculate risk score for each cell
  const getRiskLevel = (probability, impact) => {
    const score = probability * impact
    if (score <= 6) return 'low'
    if (score <= 12) return 'medium'
    if (score <= 16) return 'high'
    return 'critical'
  }

  const getColor = (level) => {
    const colors = {
      low: '#4caf50',
      medium: '#ffeb3b',
      high: '#ff9800',
      critical: '#f44336'
    }
    return colors[level] || '#e0e0e0'
  }

  // Get risks in each cell
  const getRisksInCell = (probability, impact) => {
    return risks.filter(r => r.probability === probability && r.impact === impact)
  }

  const handleMouseEnter = (prob, imp, e) => {
    const cellRisks = getRisksInCell(prob, imp)
    if (cellRisks.length > 0) {
      setHoveredCell({ probability: prob, impact: imp, risks: cellRisks })
      setTooltipPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-container">
        <div className="y-axis-label">Impact (Likelihood)</div>
        <div className="heatmap-content">
          <div className="y-axis">
            {[5, 4, 3, 2, 1].map(i => (
              <div key={i} className="axis-label">{i}</div>
            ))}
          </div>
          <div className="heatmap-grid">
            {[5, 4, 3, 2, 1].map(impact => (
              <div key={impact} className="heatmap-row">
                {[1, 2, 3, 4, 5].map(probability => {
                  const level = getRiskLevel(probability, impact)
                  const cellRisks = getRisksInCell(probability, impact)
                  const count = cellRisks.length
                  return (
                    <div
                      key={`${probability}-${impact}`}
                      className={`heatmap-cell ${level}`}
                      style={{ backgroundColor: getColor(level) }}
                      onMouseEnter={(e) => handleMouseEnter(probability, impact, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {count > 0 && <span className="risk-count">{count}</span>}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="x-axis">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="axis-label">{i}</div>
          ))}
        </div>
        <div className="x-axis-label">Probability (Impact)</div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#4caf50' }}></div>
          <span>Low (1-6)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ffeb3b' }}></div>
          <span>Medium (7-12)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ff9800' }}></div>
          <span>High (13-16)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#f44336' }}></div>
          <span>Critical (17-25)</span>
        </div>
      </div>

      {hoveredCell && (
        <div
          className="tooltip show"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y + 10}px`
          }}
        >
          <strong>Probability: {hoveredCell.probability} | Impact: {hoveredCell.impact}</strong>
          <div style={{ marginTop: '8px' }}>
            {hoveredCell.risks.map((risk, idx) => (
              <div key={idx} style={{ marginBottom: '6px', fontSize: '12px' }}>
                <strong>{risk.category}:</strong> {risk.risk.substring(0, 60)}
                {risk.risk.length > 60 ? '...' : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeatMap
