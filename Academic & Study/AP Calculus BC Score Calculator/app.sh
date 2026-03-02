#!/bin/bash
set -e

# Create project directory structure
mkdir -p src/components src/types src/utils

# ----- package.json -----
cat <<'EOF' > package.json
{
  "name": "ap-calc-bc-score-calculator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.3.0"
  }
}
EOF

# ----- tsconfig.json -----
cat <<'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# ----- tsconfig.node.json -----
cat <<'EOF' > tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# ----- vite.config.ts -----
cat <<'EOF' > vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

# ----- .gitignore -----
cat <<'EOF' > .gitignore
node_modules
dist
dist-ssr
*.local
EOF

# ----- src/types/index.ts -----
cat <<'EOF' > src/types/index.ts
export interface ScoreInputs {
  mcqCorrect: number;          // 0-45
  frqScores: [number, number, number, number, number, number]; // each 0-9
}

export interface ABSubscoreInputs {
  abMcqCorrect: number;        // 0-30
  abFrqTotal: number;           // 0-36
}

export interface ScoreResult {
  composite: number;
  apScore: 1 | 2 | 3 | 4 | 5;
  percentage: number;
}
EOF

# ----- src/utils/scoreMapping.ts -----
cat <<'EOF' > src/utils/scoreMapping.ts
// Estimated cutoffs based on 2023-2025 data (from markdown)
export function getBCScore(composite: number): 1 | 2 | 3 | 4 | 5 {
  if (composite >= 65) return 5;
  if (composite >= 54) return 4;
  if (composite >= 40) return 3;
  if (composite >= 27) return 2;
  return 1;
}

// Estimated AB subscore cutoffs (AB portion max = 72)
// Based on typical AB exam requirements (slightly stricter than BC)
export function getABScore(abComposite: number): 1 | 2 | 3 | 4 | 5 {
  if (abComposite >= 45) return 5;
  if (abComposite >= 38) return 4;
  if (abComposite >= 30) return 3;
  if (abComposite >= 20) return 2;
  return 1;
}

export function formatPercentage(composite: number, max: number): string {
  return ((composite / max) * 100).toFixed(1);
}
EOF

# ----- src/index.css -----
cat <<'EOF' > src/index.css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --lapis-deep: #0D33A6;
  --lapis-medium: #3258A6;
  --midnight-shale: #141A26;
  --slate-blue: #3B4859;
  --gold-fleck: #D9AE89;
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --border-light: rgba(255, 255, 255, 0.1);
  --surface-hover: rgba(50, 88, 166, 0.2);
  --font-primary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--midnight-shale);
  color: var(--text-primary);
  font-family: var(--font-primary);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

#root {
  width: 100%;
  max-width: 1280px;
}

/* Typography */
h1, h2, h3 {
  font-weight: 600;
  letter-spacing: -0.02em;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--lapis-deep);
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--gold-fleck);
}

/* Cards & Containers */
.card {
  background-color: var(--slate-blue);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-light);
}

.card-accent {
  border-top: 3px solid var(--gold-fleck);
}

/* Form elements */
.input-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input[type="number"] {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--midnight-shale);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 1rem;
  transition: all 0.2s ease;
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--gold-fleck);
  box-shadow: 0 0 0 2px rgba(217, 174, 137, 0.2);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 0.5;
}

/* Buttons */
.btn-primary {
  background-color: var(--lapis-deep);
  color: var(--text-primary);
  border: none;
  border-radius: 4px;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.btn-primary:hover {
  background-color: var(--lapis-medium);
}

.btn-accent {
  background-color: var(--gold-fleck);
  color: var(--midnight-shale);
  font-weight: 700;
}

.btn-accent:hover {
  background-color: #c69b6d;
}

/* Results grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.result-item {
  text-align: center;
  padding: 1rem;
  background-color: var(--midnight-shale);
  border-radius: 6px;
}

.result-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-value {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--gold-fleck);
  line-height: 1.2;
}

.result-note {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* FRQ row */
.frq-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.frq-item {
  text-align: center;
}

.frq-item input {
  text-align: center;
}

/* AB Subscore section */
.ab-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px dashed var(--lapis-medium);
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 640px) {
  body { padding: 1rem; }
  h1 { font-size: 2rem; }
  .frq-row { grid-template-columns: repeat(3, 1fr); }
}
EOF

# ----- src/main.tsx -----
cat <<'EOF' > src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# ----- src/App.tsx -----
cat <<'EOF' > src/App.tsx
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
EOF

# ----- src/components/ScoreCalculator.tsx -----
cat <<'EOF' > src/components/ScoreCalculator.tsx
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
EOF

# ----- Initialize git repository and commit -----
# git init
# git add .
# git commit -m "feat: initialize AP Calculus BC Score Calculator with data-specialist design system"

echo "✅ Project created successfully!"
echo "Next steps:"
echo "  cd $(pwd)"
echo "  npm install"
echo "  npm run dev"
EOF