import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import HeatMap from './components/HeatMap'
import RiskBreakdown from './components/RiskBreakdown'
import BubbleChart from './components/BubbleChart'
import './App.css'

function App() {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load and parse CSV
    fetch('/risks.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedRisks = results.data.map((row, index) => ({
              id: index,
              category: row.Category,
              risk: row.Risk,
              probability: parseInt(row['Probability (1-5)']) || 0,
              impact: parseInt(row['Impact (1-5)']) || 0,
              score: parseInt(row['Probability (1-5)']) * parseInt(row['Impact (1-5)']),
              mitigation: row['Mitigation Strategy'],
              status: row.Status,
              comments: row.Comments
            })).filter(r => r.probability > 0 && r.impact > 0)
            setRisks(parsedRisks)
            setLoading(false)
          }
        })
      })
      .catch(error => {
        console.error('Error loading CSV:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading">Loading risk data...</div>
  }

  return (
    <div className="container">
      <h1>Risk Management Dashboard</h1>

      <div className="dashboard">
        <div className="card">
          <h2>Risk Heat Map</h2>
          <HeatMap risks={risks} />
        </div>

        <div className="card">
          <h2>Risk Breakdown</h2>
          <RiskBreakdown risks={risks} />
        </div>

        <div className="card full-width">
          <h2>Risk Heatmap - Interactive Bubble Chart</h2>
          <BubbleChart risks={risks} />
        </div>
      </div>
    </div>
  )
}

export default App
