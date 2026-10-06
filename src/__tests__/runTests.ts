import { INITIAL_EXAMS } from '../data/exams/index';
import { validateExam } from '../utils/validator';
import { convertRawToScaledScore, isPassingScore } from '../utils/scoreConversion';

export function runAllB1ExamTests(): {
  totalExamsTested: number;
  allPassed: boolean;
  results: Array<{ examNumber: number; title: string; valid: boolean; issues: string[] }>;
} {
  console.log(`[TEST SUITE] Starting validation of ${INITIAL_EXAMS.length} Goethe/ÖSD B1 Modellsätze...`);

  let allPassed = true;
  const results: Array<{ examNumber: number; title: string; valid: boolean; issues: string[] }> = [];

  INITIAL_EXAMS.forEach((exam) => {
    const report = validateExam(exam);
    const issues = report.issues.map(i => `[Teil ${i.teil}] ${i.message}`);

    if (!report.isValid) {
      allPassed = false;
    }

    results.push({
      examNumber: exam.examNumber,
      title: exam.title,
      valid: report.isValid,
      issues,
    });
  });

  // Verify Score Conversion Table
  const passCheck = isPassingScore(18) && !isPassingScore(17);
  const scale30 = convertRawToScaledScore(30) === 100;
  const scale18 = convertRawToScaledScore(18) === 60;
  const scale0 = convertRawToScaledScore(0) === 0;

  if (!passCheck || !scale30 || !scale18 || !scale0) {
    console.error('[TEST ERROR] Score conversion table mismatch');
    allPassed = false;
  } else {
    console.log('[TEST PASS] Goethe B1 100-point scale verified (18/30 = 60%, 30/30 = 100%)');
  }

  console.log(`[TEST SUITE] Completed: ${results.filter(r => r.valid).length}/${results.length} exams valid.`);
  return {
    totalExamsTested: INITIAL_EXAMS.length,
    allPassed,
    results,
  };
}

// Auto-run if executed directly in node / tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('runTests')) {
  const result = runAllB1ExamTests();
  if (!result.allPassed) {
    console.error('[FAIL] Some exam tests failed.');
    process.exit(1);
  } else {
    console.log('[SUCCESS] All 10 B1 exams passed validation successfully!');
    process.exit(0);
  }
}
