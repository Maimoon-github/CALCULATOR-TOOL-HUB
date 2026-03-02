#!/bin/bash


# Create the directory structure first
mkdir -p src/components src/types src/utils

cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Load fonts (Inter and JetBrains Mono)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

cat > src/App.tsx << 'EOF'
import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen bg-midnight-shale text-white flex flex-col">
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <Calculator />
      </main>
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-white/5 font-mono">
        <span className="inline-block px-6">precision data · the specialist</span>
      </footer>
    </div>
  )
}

export default App
EOF

cat > src/components/Calculator.tsx << 'EOF'
import { useState, useMemo } from 'react'
import { computeComposite, getAPScore, sumFRQ, MCQ_MAX, FRQ_MAX, FRQ_LONG_MAX, FRQ_SHORT_MAX } from '../utils/scoreUtils'

export default function Calculator() {
  const [mcq, setMcq] = useState<number>(0)
  const [frq, setFrq] = useState<number[]>([0, 0, 0, 0, 0, 0]) // indices: 0,1 = long (0-10), 2-5 = short (0-4)

  const totalFRQ = useMemo(() => sumFRQ(frq), [frq])
  const composite = useMemo(() => computeComposite(mcq, totalFRQ), [mcq, totalFRQ])
  const apResult = useMemo(() => getAPScore(composite), [composite])

  const handleMcqChange = (value: number) => {
    const clamped = Math.min(MCQ_MAX, Math.max(0, value))
    setMcq(clamped)
  }

  const handleFrqChange = (index: number, value: number) => {
    const max = index < 2 ? FRQ_LONG_MAX : FRQ_SHORT_MAX
    const clamped = Math.min(max, Math.max(0, value))
    setFrq(prev => {
      const next = [...prev]
      next[index] = clamped
      return next
    })
  }

  const setPerfect = () => {
    setMcq(60)
    setFrq([10, 10, 4, 4, 4, 4])
  }

  const reset = () => {
    setMcq(0)
    setFrq([0, 0, 0, 0, 0, 0])
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gold-fleck to-lapis-medium bg-clip-text text-transparent">
          AP® Biology Score Calculator
        </h1>
        <p className="text-gray-400 mt-3 font-mono text-sm uppercase tracking-wider">
          estimate your 1–5 with precision
        </p>
      </div>

      {/* Main card */}
      <div className="data-card rounded-2xl border border-white/5">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Input section */}
          <div className="space-y-8">
            {/* MCQ */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Multiple Choice <span className="text-gold-fleck font-mono">(0–60)</span>
              </label>
              <input
                type="number"
                min={0}
                max={60}
                step={1}
                value={mcq}
                onChange={(e) => handleMcqChange(parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
              <div className="mt-1 text-xs text-gray-400 font-mono flex justify-between">
                <span>raw: {mcq}</span>
                <span>scaled: {((mcq / 60) * 50).toFixed(2)} / 50</span>
              </div>
            </div>

            {/* FRQs */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-300">Free Response</span>
                <span className="text-xs text-gray-400 font-mono">total: {totalFRQ} / 36</span>
              </div>

              {/* Long FRQs */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Long (0–10 each)</p>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1].map((idx) => (
                    <div key={`long-${idx}`}>
                      <label className="block text-xs text-gray-400 mb-1">FRQ {idx + 1}</label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={frq[idx]}
                        onChange={(e) => handleFrqChange(idx, parseInt(e.target.value) || 0)}
                        className="input-field w-full py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Short FRQs */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Short (0–4 each)</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[2, 3, 4, 5].map((idx) => (
                    <div key={`short-${idx}`}>
                      <label className="block text-xs text-gray-400 mb-1">FRQ {idx + 1}</label>
                      <input
                        type="number"
                        min={0}
                        max={4}
                        step={1}
                        value={frq[idx]}
                        onChange={(e) => handleFrqChange(idx, parseInt(e.target.value) || 0)}
                        className="input-field w-full py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button onClick={reset} className="btn-primary flex-1">Reset</button>
              <button onClick={setPerfect} className="btn-accent flex-1">Perfect Score</button>
            </div>
          </div>

          {/* Results section */}
          <div className="flex flex-col justify-center items-center space-y-6 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
            {/* Composite */}
            <div className="text-center w-full">
              <div className="text-sm text-gray-400 uppercase tracking-wider">Composite Score</div>
              <div className="text-5xl font-mono font-bold text-gold-fleck mt-1">
                {composite.toFixed(2)}
              </div>
              <div className="w-full bg-midnight-shale/50 h-2.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gold-fleck transition-all duration-300"
                  style={{ width: `${Math.min(100, (composite / 120) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                <span>0</span>
                <span>60</span>
                <span>120</span>
              </div>
            </div>

            {/* AP Score */}
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase tracking-wider">Predicted AP Score</div>
              <div className="text-7xl font-mono font-bold text-gold-fleck mt-1">
                {apResult.score}
              </div>
              <div className="text-lg text-gray-300 mt-1">{apResult.label}</div>
            </div>

            {/* Qualification breakdown */}
            <div className="grid grid-cols-5 gap-1 w-full text-center text-xs font-mono">
              {[5, 4, 3, 2, 1].map(score => (
                <div key={score} className="flex flex-col">
                  <span className="text-gray-400">{score}</span>
                  <span
                    className={`h-1 w-full rounded-full mt-1 transition-all ${
                      apResult.score === score ? 'bg-gold-fleck' : 'bg-white/10'
                    }`}
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 italic border-t border-white/5 pt-4 w-full text-center">
              Based on 2022–2025 College Board data. Actual cutoffs may vary.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center bg-slate-blue/30 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
        ⚡ This is an estimation tool. Official cutoffs are set by the College Board after each exam. Use only as a study guide.
      </div>
    </div>
  )
}
EOF

cat > src/types/index.ts << 'EOF'
export interface ScoreState {
  mcq: number
  frq: number[] // length 6
}
EOF

cat > src/utils/scoreUtils.ts << 'EOF'
// AP Biology scoring constants
export const MCQ_MAX = 60
export const FRQ_MAX = 36            // total raw points
export const FRQ_LONG_MAX = 10
export const FRQ_SHORT_MAX = 4

// Composite calculation: FRQ scaled to 60, composite out of 120
export function computeComposite(mcqRaw: number, frqRawTotal: number): number {
  if (mcqRaw < 0 || mcqRaw > MCQ_MAX) throw new Error('Invalid MCQ')
  if (frqRawTotal < 0 || frqRawTotal > FRQ_MAX) throw new Error('Invalid FRQ total')
  const frqScaled = (frqRawTotal / FRQ_MAX) * 60
  return mcqRaw + frqScaled
}

// AP score mapping (based on 2022–2025 approximate cutoffs)
export function getAPScore(composite: number): { score: 1 | 2 | 3 | 4 | 5; label: string } {
  if (composite >= 90) return { score: 5, label: 'Extremely Well Qualified' }
  if (composite >= 75) return { score: 4, label: 'Well Qualified' }
  if (composite >= 59) return { score: 3, label: 'Qualified' }
  if (composite >= 43) return { score: 2, label: 'Possibly Qualified' }
  return { score: 1, label: 'No Recommendation' }
}

// Sum FRQ array
export function sumFRQ(scores: number[]): number {
  return scores.reduce((acc, val) => acc + val, 0)
}
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-lapis-deep: #0D33A6;
    --color-lapis-medium: #3258A6;
    --color-midnight-shale: #141A26;
    --color-slate-blue: #3B4859;
    --color-gold-fleck: #D9AE89;
  }

  body {
    @apply bg-midnight-shale text-white font-sans antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #1E2633;
  }
  ::-webkit-scrollbar-thumb {
    background: #3B4859;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3258A6;
  }
}

@layer components {
  .data-card {
    @apply bg-slate-blue/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-xl;
  }

  .input-field {
    @apply bg-midnight-shale/60 border border-white/10 rounded-lg px-4 py-2 font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-fleck/50 transition-all;
  }

  .btn-primary {
    @apply bg-lapis-deep hover:bg-lapis-medium text-white font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-fleck/50;
  }

  .btn-accent {
    @apply bg-gold-fleck hover:bg-gold-fleck/90 text-midnight-shale font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-fleck/50;
  }
}
EOF

echo ""
echo "=== Precise Git Commit Message ==="
echo 'git commit -m "feat(ap-bio): add score calculator with Data Specialist design — dark theme, gold accents, monospaced numbers"'