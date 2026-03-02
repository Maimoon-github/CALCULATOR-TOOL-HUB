import React from 'react'
import ScoreCalculator from './components/ScoreCalculator'

function App() {
  return (
    <div className="app">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>AP Calculus BC <span style={{ color: 'var(--gold-fleck)' }}>Score Calculator</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Estimate your AP score (1–5) using official weighting. Enter your raw performance below.
        </p>
      </header>
      <ScoreCalculator />
      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <p>Based on historical College Board curves. Actual cutoffs may vary ±2–3 points.</p>
        <p style={{ marginTop: '0.5rem' }}>Design: The Data Specialist • Lapis & Gold</p>
      </footer>
    </div>
  )
}

export default App
