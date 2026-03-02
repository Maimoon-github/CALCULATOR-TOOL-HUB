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
