import { ExamModel } from '../types/exam';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  teil: number;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalItems: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function validateExam(exam: ExamModel): ValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Check Teil 1 (6 items)
  const t1Count = exam.teil1?.items?.length || 0;
  if (t1Count !== 6) {
    issues.push({
      type: 'error',
      teil: 1,
      message: `Teil 1 muss genau 6 Aufgaben haben (aktuell: ${t1Count}).`,
    });
  }

  if (!exam.teil1?.beispiel?.statement) {
    issues.push({
      type: 'error',
      teil: 1,
      message: 'Teil 1 fehlt das Beispiel (0).',
    });
  }

  const t1Words = countWords(exam.teil1?.emailBody || '');
  if (t1Words < 140 || t1Words > 280) {
    issues.push({
      type: 'warning',
      teil: 1,
      message: `Wortanzahl in Teil 1 (${t1Words} Wörter) weicht vom B1-Zielwert (180–220 Wörter) ab.`,
    });
  }

  // 2. Check Teil 2 (6 items: 3 in Text A, 3 in Text B)
  const t2aCount = exam.teil2?.textA?.items?.length || 0;
  const t2bCount = exam.teil2?.textB?.items?.length || 0;
  if (t2aCount !== 3) {
    issues.push({
      type: 'error',
      teil: 2,
      message: `Teil 2 Text A muss genau 3 Aufgaben (7–9) haben (aktuell: ${t2aCount}).`,
    });
  }
  if (t2bCount !== 3) {
    issues.push({
      type: 'error',
      teil: 2,
      message: `Teil 2 Text B muss genau 3 Aufgaben (10–12) haben (aktuell: ${t2bCount}).`,
    });
  }
  if (!exam.teil2?.textA?.beispiel?.question) {
    issues.push({
      type: 'error',
      teil: 2,
      message: 'Teil 2 Text A fehlt das Beispiel (0).',
    });
  }

  // 3. Check Teil 3 (7 situations, 10 ads a-j, exactly one '0', exactly one unused ad)
  const t3Count = exam.teil3?.situations?.length || 0;
  if (t3Count !== 7) {
    issues.push({
      type: 'error',
      teil: 3,
      message: `Teil 3 muss genau 7 Situationen (13–19) haben (aktuell: ${t3Count}).`,
    });
  }

  const ads = exam.teil3?.advertisements || [];
  if (ads.length !== 10) {
    issues.push({
      type: 'error',
      teil: 3,
      message: `Teil 3 muss genau 10 Anzeigen (a–j) enthalten (aktuell: ${ads.length}).`,
    });
  }

  // Check unique ad letters
  const letters = ads.map(a => a.letter.toLowerCase());
  const dupLetters = letters.filter((l, idx) => letters.indexOf(l) !== idx);
  if (dupLetters.length > 0) {
    issues.push({
      type: 'error',
      teil: 3,
      message: `Doppelte Anzeigen-Buchstaben gefunden: ${dupLetters.join(', ')}.`,
    });
  }

  // Check zero-match situation in Teil 3
  const zeroMatches = exam.teil3?.situations?.filter(s => s.correctAnswer === '0') || [];
  if (zeroMatches.length !== 1) {
    issues.push({
      type: 'error',
      teil: 3,
      message: `In Teil 3 muss genau eine Situation keine passende Anzeige haben (Antwort '0'). Gefunden: ${zeroMatches.length}.`,
    });
  }

  // Check used ads vs unused ads
  const usedLetters = (exam.teil3?.situations || [])
    .map(s => s.correctAnswer.toLowerCase())
    .filter(a => a !== '0');

  // Check for duplicate assignments of the same ad letter among situations
  const dupAssignments = usedLetters.filter((l, idx) => usedLetters.indexOf(l) !== idx);
  if (dupAssignments.length > 0) {
    issues.push({
      type: 'error',
      teil: 3,
      message: `Eine Anzeige darf nur einmal verwendet werden. Doppelt zugeordnet: ${dupAssignments.join(', ')}.`,
    });
  }

  // 4. Check Teil 4 (7 items 20-26)
  const t4Count = exam.teil4?.leserbriefe?.length || 0;
  if (t4Count !== 7) {
    issues.push({
      type: 'error',
      teil: 4,
      message: `Teil 4 muss genau 7 Leserbriefe (20–26) haben (aktuell: ${t4Count}).`,
    });
  }
  if (!exam.teil4?.beispiel?.text) {
    issues.push({
      type: 'error',
      teil: 4,
      message: 'Teil 4 fehlt das Beispiel (0).',
    });
  }

  // 5. Check Teil 5 (4 items 27-30)
  const t5Count = exam.teil5?.items?.length || 0;
  if (t5Count !== 4) {
    issues.push({
      type: 'error',
      teil: 5,
      message: `Teil 5 muss genau 4 Aufgaben (27–30) haben (aktuell: ${t5Count}).`,
    });
  }

  const rulesWords = (exam.teil5?.sections || []).reduce((acc, sec) => acc + countWords(sec.content), 0);
  if (rulesWords < 180 || rulesWords > 450) {
    issues.push({
      type: 'warning',
      teil: 5,
      message: `Wortanzahl der Hausordnung (${rulesWords} Wörter) weicht vom empfohlenen Bereich (250–350 Wörter) ab.`,
    });
  }

  const totalItems = t1Count + t2aCount + t2bCount + t3Count + t4Count + t5Count;
  if (totalItems !== 30) {
    issues.push({
      type: 'error',
      teil: 0,
      message: `Gesamtanzahl Aufgaben muss exakt 30 betragen (aktuell: ${totalItems}).`,
    });
  }

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  return {
    isValid: errorCount === 0,
    totalItems,
    errorCount,
    warningCount,
    issues,
  };
}
