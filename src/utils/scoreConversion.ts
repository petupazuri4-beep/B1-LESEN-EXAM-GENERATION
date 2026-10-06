import { ScoreConversionRow } from '../types/exam';

export const OFFICIAL_B1_CONVERSION_TABLE: ScoreConversionRow[] = [
  { raw: 30, scaled: 100 },
  { raw: 29, scaled: 97 },
  { raw: 28, scaled: 93 },
  { raw: 27, scaled: 90 },
  { raw: 26, scaled: 87 },
  { raw: 25, scaled: 83 },
  { raw: 24, scaled: 80 },
  { raw: 23, scaled: 77 },
  { raw: 22, scaled: 73 },
  { raw: 21, scaled: 70 },
  { raw: 20, scaled: 67 },
  { raw: 19, scaled: 63 },
  { raw: 18, scaled: 60 }, // Passing threshold (60%)
  { raw: 17, scaled: 57 },
  { raw: 16, scaled: 53 },
  { raw: 15, scaled: 50 },
  { raw: 14, scaled: 47 },
  { raw: 13, scaled: 43 },
  { raw: 12, scaled: 40 },
  { raw: 11, scaled: 37 },
  { raw: 10, scaled: 33 },
  { raw: 9, scaled: 30 },
  { raw: 8, scaled: 27 },
  { raw: 7, scaled: 23 },
  { raw: 6, scaled: 20 },
  { raw: 5, scaled: 17 },
  { raw: 4, scaled: 13 },
  { raw: 3, scaled: 10 },
  { raw: 2, scaled: 7 },
  { raw: 1, scaled: 3 },
  { raw: 0, scaled: 0 },
];

export function convertRawToScaledScore(rawScore: number): number {
  const bounded = Math.max(0, Math.min(30, Math.round(rawScore)));
  const found = OFFICIAL_B1_CONVERSION_TABLE.find(r => r.raw === bounded);
  return found ? found.scaled : 0;
}

export function isPassingScore(rawScore: number): boolean {
  return rawScore >= 18;
}
