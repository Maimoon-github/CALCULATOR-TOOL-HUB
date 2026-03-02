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
