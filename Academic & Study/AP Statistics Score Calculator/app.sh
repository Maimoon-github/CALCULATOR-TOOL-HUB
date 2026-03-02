#!/bin/bash

set -e  # exit on error

echo "🚀 Creating AP Statistics Score Calculator with 'The Data Specialist' design..."

PROJECT_DIR="ap-stats-calculator"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Create necessary folders
mkdir -p src/components src/types src/utils

echo "📁 Project structure created."

# ------------------------- package.json -------------------------
cat > package.json << 'EOF'
{
  "name": "ap-stats-calculator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vite": "^5.4.0"
  }
}
EOF

echo "✅ package.json created."

# ------------------------- tsconfig.json -------------------------
cat > tsconfig.json << 'EOF'
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

echo "✅ tsconfig.json created."

# ------------------------- tsconfig.node.json -------------------------
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
EOF

echo "✅ tsconfig.node.json created."

# ------------------------- vite.config.ts -------------------------
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

echo "✅ vite.config.ts created."

# ------------------------- tailwind.config.ts -------------------------
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lapis-deep': '#0D33A6',
        'lapis-medium': '#3258A6',
        'midnight-shale': '#141A26',
        'slate-blue': '#3B4859',
        'gold-fleck': '#D9AE89',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
EOF

echo "✅ tailwind.config.ts created."

# ------------------------- postcss.config.js -------------------------
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "✅ postcss.config.js created."

# ------------------------- index.html -------------------------
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AP Statistics Score Calculator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-midnight-shale text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "✅ index.html created."

# ------------------------- src/main.tsx -------------------------
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo "✅ src/main.tsx created."

# ------------------------- src/index.css -------------------------
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-midnight-shale text-white font-sans antialiased;
  }

  /* custom scrollbar for data‑specialist vibe */
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
    @apply bg-slate-blue/80 backdrop-blur-sm rounded-lg border border-white/5 p-6 shadow-xl;
  }

  .stat-value {
    @apply font-mono text-gold-fleck font-medium;
  }

  .input-field {
    @apply w-full bg-midnight-shale/60 border border-white/10 rounded px-4 py-2 font-mono text-white focus:outline-none focus:ring-2 focus:ring-gold-fleck/50 transition-all;
  }

  .btn-primary {
    @apply bg-lapis-deep hover:bg-lapis-medium text-white font-medium px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gold-fleck/50;
  }

  .btn-accent {
    @apply bg-gold-fleck hover:bg-gold-fleck/90 text-midnight-shale font-medium px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gold-fleck/50;
  }
}
EOF

echo "✅ src/index.css created."

# ------------------------- src/utils/scoreUtils.ts -------------------------
cat > src/utils/scoreUtils.ts << 'EOF'
// Score conversion utilities

export const MCQ_MAX = 40;
export const FRQ_MAX = 24; // 6 questions × 4 points
export const MCQ_WEIGHT = 50; // 50% of total
export const FRQ_WEIGHT = 50;

export function computeScaledMCQ(rawMCQ: number): number {
  if (rawMCQ < 0 || rawMCQ > MCQ_MAX) throw new Error('Invalid MCQ raw score');
  return (rawMCQ / MCQ_MAX) * MCQ_WEIGHT;
}

export function computeScaledFRQ(rawFRQ: number): number {
  if (rawFRQ < 0 || rawFRQ > FRQ_MAX) throw new Error('Invalid FRQ raw total');
  return (rawFRQ / FRQ_MAX) * FRQ_WEIGHT;
}

export function computeComposite(mcqRaw: number, frqRawTotal: number): number {
  return computeScaledMCQ(mcqRaw) + computeScaledFRQ(frqRawTotal);
}

// AP score mapping based on 2023–2025 averages (from provided doc)
export function getAPScore(composite: number): { score: 1 | 2 | 3 | 4 | 5; label: string } {
  if (composite >= 65) return { score: 5, label: 'Extremely Well Qualified' };
  if (composite >= 50) return { score: 4, label: 'Well Qualified' };
  if (composite >= 38) return { score: 3, label: 'Qualified' };
  if (composite >= 27) return { score: 2, label: 'Possibly Qualified' };
  return { score: 1, label: 'No Recommendation' };
}

// Helper to sum FRQ array
export function sumFRQ(scores: number[]): number {
  return scores.reduce((a, b) => a + b, 0);
}
EOF

echo "✅ src/utils/scoreUtils.ts created."

# ------------------------- src/components/Calculator.tsx -------------------------
cat > src/components/Calculator.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { computeComposite, getAPScore, sumFRQ, MCQ_MAX, FRQ_MAX } from '../utils/scoreUtils';

export default function Calculator() {
  const [mcqRaw, setMcqRaw] = useState<number>(0);
  const [frqScores, setFrqScores] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  const [composite, setComposite] = useState<number>(0);
  const [apResult, setApResult] = useState<{ score: 1|2|3|4|5; label: string }>({ score: 1, label: 'No Recommendation' });

  useEffect(() => {
    const totalFRQ = sumFRQ(frqScores);
    const comp = computeComposite(mcqRaw, totalFRQ);
    setComposite(comp);
    setApResult(getAPScore(comp));
  }, [mcqRaw, frqScores]);

  const handleFRQChange = (index: number, value: number) => {
    const newScores = [...frqScores];
    newScores[index] = Math.min(4, Math.max(0, value));
    setFrqScores(newScores);
  };

  const setPerfect = () => {
    setMcqRaw(40);
    setFrqScores([4, 4, 4, 4, 4, 4]);
  };

  const reset = () => {
    setMcqRaw(0);
    setFrqScores([0, 0, 0, 0, 0, 0]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gold-fleck to-lapis-medium bg-clip-text text-transparent">
          AP® Statistics Score Calculator
        </h1>
        <p className="text-gray-400 mt-2 font-mono text-sm">estimate your 1–5 with precision</p>
      </div>

      {/* Main card */}
      <div className="data-card">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Multiple Choice (0–40)</label>
              <input
                type="number"
                min={0}
                max={40}
                step={1}
                value={mcqRaw}
                onChange={(e) => setMcqRaw(Math.min(40, Math.max(0, parseInt(e.target.value) || 0)))}
                className="input-field"
              />
              <div className="mt-1 text-xs text-gray-400 font-mono">
                scaled: {((mcqRaw / 40) * 50).toFixed(2)} / 50
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Free Response (each 0–4)</span>
                <span className="text-xs text-gray-400 font-mono">total: {sumFRQ(frqScores)} / 24</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {frqScores.map((score, idx) => (
                  <div key={idx}>
                    <label className="block text-xs text-gray-400 mb-1">FRQ {idx + 1}</label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      step={1}
                      value={score}
                      onChange={(e) => handleFRQChange(idx, Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="input-field py-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="btn-primary flex-1">Reset</button>
              <button onClick={setPerfect} className="btn-accent flex-1">Perfect Score</button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="flex flex-col justify-center items-center space-y-4 border-l border-white/10 pl-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase tracking-wider">Composite Score</div>
              <div className="text-5xl font-mono font-bold text-gold-fleck mt-1">
                {composite.toFixed(2)}
              </div>
              <div className="w-full bg-midnight-shale/50 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gold-fleck transition-all duration-300"
                  style={{ width: `${Math.min(100, composite)}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase tracking-wider">Predicted AP Score</div>
              <div className="text-7xl font-mono font-bold text-gold-fleck mt-1">
                {apResult.score}
              </div>
              <div className="text-lg text-gray-300 mt-1">{apResult.label}</div>
            </div>

            <div className="text-xs text-gray-500 text-center italic border-t border-white/5 pt-4 w-full">
              Based on 2023–2025 College Board curves. Actual cutoffs may vary by ±2–3 points.
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center bg-slate-blue/30 p-3 rounded border border-white/5">
        ⚡ This is an estimation tool. The College Board sets official cutoffs after each exam. Use only as a study guide.
      </div>
    </div>
  );
}
EOF

echo "✅ src/components/Calculator.tsx created."

# ------------------------- src/App.tsx -------------------------
cat > src/App.tsx << 'EOF'
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-midnight-shale flex items-center justify-center p-4">
      <div className="w-full">
        <Calculator />
        <footer className="text-center mt-8 text-xs text-gray-600 font-mono">
          <span className="border-t border-white/5 pt-4 inline-block px-8">
            designed with precision · the data specialist
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
EOF

echo "✅ src/App.tsx created."

# ------------------------- README.md -------------------------
cat > README.md << 'EOF'
# AP Statistics Score Calculator

A production‑grade web app to estimate your AP Statistics exam score (1–5) based on raw multiple‑choice and free‑response performance. Built with React + TypeScript + Tailwind, following the **"Data Specialist"** design system.

## Features

- Real‑time composite score calculation (MCQ 50% / FRQ 50%)
- Six individual FRQ inputs (0–4 each) plus MCQ input (0–40)
- Perfect score / reset buttons for quick simulation
- Visual progress bar and AP score mapping with qualification labels
- Dark, data‑centric UI with lapis lazuli and gold accents

## Design System

- **Colors**: Lapis Deep `#0D33A6`, Lapis Medium `#3258A6`, Midnight Shale `#141A26`, Slate Blue `#3B4859`, Gold Fleck `#D9AE89`
- **Typography**: Inter (UI) and JetBrains Mono (numbers)
- **Mood**: precise, authoritative, understated luxury

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for styling
- All logic client‑side, no external API calls

## Getting Started

# ```bash
# # install dependencies
# npm install

# # start dev server
# npm run dev

# # build for production
# npm run build