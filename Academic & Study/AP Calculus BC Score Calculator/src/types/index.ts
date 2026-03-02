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
