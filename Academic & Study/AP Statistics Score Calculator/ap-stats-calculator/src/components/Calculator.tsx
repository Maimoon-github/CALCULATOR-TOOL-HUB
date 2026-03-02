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
