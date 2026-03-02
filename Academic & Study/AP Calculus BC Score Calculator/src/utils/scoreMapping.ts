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
