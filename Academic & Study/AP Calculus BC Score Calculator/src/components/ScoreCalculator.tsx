import React, { useState, useEffect } from 'react'
import { ScoreInputs, ABSubscoreInputs, ScoreResult } from '../types'
import { getBCScore, getABScore, formatPercentage } from '../utils/scoreMapping'

const MCQ_MAX = 45
const FRQ_MAX_PER = 9
const FRQ_COUNT = 6
const BC_COMPOSITE_MAX = 108

const AB_MCQ_MAX = 30
const AB_FRQ_MAX = 36
const AB_COMPOSITE_MAX = 72

export default function ScoreCalculator() {
  const [mcqCorrect, setMcqCorrect] = useState<number>(25)
  const [frqScores, setFrqScores] = useState<[number, number, number, number, number, number]>([5,5,5,5,5,5])
  const [abMcqCorrect, setAbMcqCorrect] = useState<number>(18)
  const [abFrqTotal, setAbFrqTotal] = useState<number>(24)

  // Derived BC values
  const mcqWeighted = mcqCorrect * 1.2
  const frqTotal = frqScores.reduce((a, b) => a + b, 0)
  const composite = mcqWeighted + frqTotal
  const bcScore = getBCScore(composite)
  const bcPercentage = formatPercentage(composite, BC_COMPOSITE_MAX)

  // Derived AB subscore values
  const abComposite = abMcqCorrect * 1.2 + abFrqTotal
  const abScore = getABScore(abComposite)
  const abPercentage = formatPercentage(abComposite, AB_COMPOSITE_MAX)

  // Handlers
  const handleFrqChange = (index: number, value: number) => {
    const newScores = [...frqScores] as typeof frqScores
    newScores[index] = Math.min(9, Math.max(0, value || 0))
    setFrqScores(newScores)
  }

  const handleMcqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setMcqCorrect(isNaN(val) ? 0 : Math.min(MCQ_MAX, Math.max(0, val)))
  }

  const handleAbMcqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setAbMcqCorrect(isNaN(val) ? 0 : Math.min(AB_MCQ_MAX, Math.max(0, val)))
  }

  const handleAbFrqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setAbFrqTotal(isNaN(val) ? 0 : Math.min(AB_FRQ_MAX, Math.max(0, val)))
  }

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* BC Score Section */}
      <section>
        <h2>BC Score</h2>
        <div className="input-group">
          <label htmlFor="mcq-correct">MCQ Correct (0–45)</label>
          <input
            type="number"
            id="mcq-correct"
            min={0}
            max={45}
            value={mcqCorrect}
            onChange={handleMcqChange}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label>FRQ Scores (0–9 each)</label>
          <div className="frq-row">
            {frqScores.map((score, idx) => (
              <div key={idx} className="frq-item">
                <label htmlFor={`frq-${idx+1}`} style={{ fontSize: '0.7rem' }}>Q{idx+1}</label>
                <input
                  type="number"
                  id={`frq-${idx+1}`}
                  min={0}
                  max={9}
                  value={score}
                  onChange={(e) => handleFrqChange(idx, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="results-grid">
          <div className="result-item">
            <div className="result-label">Composite</div>
            <div className="result-value">{composite.toFixed(1)}</div>
            <div className="result-note">/108</div>
          </div>
          <div className="result-item">
            <div className="result-label">AP Score</div>
            <div className="result-value" style={{ fontSize: '3rem' }}>{bcScore}</div>
            <div className="result-note">{bcPercentage}%</div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--lapis-deep)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>MCQ weighted: </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-fleck)' }}>{mcqWeighted.toFixed(1)}</span>
          </div>
          <div style={{ backgroundColor: 'var(--lapis-deep)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>FRQ total: </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-fleck)' }}>{frqTotal}</span>
          </div>
        </div>
      </section>

      {/* AB Subscore Section */}
      <section className="ab-section">
        <h3>AB Subscore (estimated)</h3>
        <p className="disclaimer">
          Enter your estimated performance on AB‑only questions (approx 30 MCQ + 4 FRQ). 
          Max AB composite = 72.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="input-group">
            <label htmlFor="ab-mcq">AB MCQ Correct (0–30)</label>
            <input
              type="number"
              id="ab-mcq"
              min={0}
              max={30}
              value={abMcqCorrect}
              onChange={handleAbMcqChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="ab-frq">AB FRQ Total (0–36)</label>
            <input
              type="number"
              id="ab-frq"
              min={0}
              max={36}
              value={abFrqTotal}
              onChange={handleAbFrqChange}
            />
          </div>
        </div>

        <div className="results-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="result-item">
            <div className="result-label">AB Composite</div>
            <div className="result-value">{abComposite.toFixed(1)}</div>
            <div className="result-note">/72</div>
          </div>
          <div className="result-item">
            <div className="result-label">AB Subscore</div>
            <div className="result-value" style={{ fontSize: '3rem' }}>{abScore}</div>
            <div className="result-note">{abPercentage}%</div>
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <div style={{ marginTop: '2rem', backgroundColor: 'var(--midnight-shale)', padding: '1.5rem', borderRadius: '6px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Score Benchmarks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
          <div>
            <div style={{ color: 'var(--gold-fleck)', fontWeight: 700, fontSize: '1.5rem' }}>5</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>65–108</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>~27–28 MCQ + 32–35 FRQ</div>
          </div>
          <div>
            <div style={{ color: 'var(--gold-fleck)', fontWeight: 700, fontSize: '1.5rem' }}>4</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>54–64</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>~22–26 MCQ + 27–31 FRQ</div>
          </div>
          <div>
            <div style={{ color: 'var(--gold-fleck)', fontWeight: 700, fontSize: '1.5rem' }}>3</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>40–53</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>~15–21 MCQ + 19–26 FRQ</div>
          </div>
        </div>
      </div>
    </div>
  )
}
