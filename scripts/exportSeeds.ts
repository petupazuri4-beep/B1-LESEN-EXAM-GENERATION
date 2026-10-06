import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_EXAMS } from '../src/data/exams/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/seeds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

INITIAL_EXAMS.forEach((exam) => {
  const numStr = String(exam.examNumber).padStart(2, '0');
  const filePath = path.join(targetDir, `exam_${numStr}.json`);
  fs.writeFileSync(filePath, JSON.stringify(exam, null, 2), 'utf-8');
  console.log(`Generated seed: ${filePath}`);
});

console.log(`Successfully exported all ${INITIAL_EXAMS.length} exam seeds to public/seeds/`);
