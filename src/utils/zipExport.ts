import JSZip from 'jszip';
import { ExamModel } from '../types/exam';
import { exportExamToDocx, exportAnswerKeyToDocx } from './docxExport';
import { downloadBlob } from './pdfExport';
import { OFFICIAL_B1_CONVERSION_TABLE } from './scoreConversion';

export function generateExamSummaryText(exam: ExamModel): string {
  const numStr = String(exam.examNumber).padStart(2, '0');
  const lines: string[] = [];

  lines.push('================================================================================');
  lines.push(`GOETHE- / ÖSD-ZERTIFIKAT B1 – MODELLSATZ ${numStr}`);
  lines.push('MODUL LESEN (65 MINUTEN • 5 TEILE • 30 AUFGABEN • 100 ERGEBNISPUNKTE)');
  lines.push(`Titel: ${exam.title}`);
  lines.push(`Prüfungszentrum: ${exam.candidateInfo?.institution || 'Goethe-Institut'}, ${exam.candidateInfo?.city || 'Prüfungszentrum'}`);
  lines.push('================================================================================\n');

  // TEIL 1
  lines.push('--- TEIL 1: KORRESPONDENZ LESEN (Aufgaben 1–6 | 6 Punkte | ca. 10 Min.) ---');
  lines.push(`Anweisung: ${exam.teil1.instruction}\n`);
  lines.push(`${exam.teil1.emailGreeting}\n`);
  lines.push(exam.teil1.emailBody);
  lines.push(`\n${exam.teil1.emailSignoff}\n`);
  lines.push('Aufgaben (Richtig / Falsch):');
  lines.push(`[0] Beispiel: ${exam.teil1.beispiel.statement} --> ${exam.teil1.beispiel.answer}`);
  exam.teil1.items.forEach((item) => {
    lines.push(`[${item.number}] ${item.statement} --> Lösung: ${item.correctAnswer}`);
  });
  lines.push('\n');

  // TEIL 2
  lines.push('--- TEIL 2: PRESSETEXTE & MEHRFACHAUSWAHL (Aufgaben 7–12 | 6 Punkte | ca. 20 Min.) ---');
  lines.push(`Anweisung: ${exam.teil2.instruction}\n`);
  lines.push(`[TEXT A] ${exam.teil2.textA.title}`);
  lines.push(`Quelle: ${exam.teil2.textA.source}`);
  lines.push(exam.teil2.textA.bodyParagraphs.join('\n\n'));
  lines.push('\nAufgaben Text A (7–9):');
  exam.teil2.textA.items.forEach((it) => {
    lines.push(`\n[${it.number}] ${it.question}`);
    lines.push(`    a) ${it.options.a}`);
    lines.push(`    b) ${it.options.b}`);
    lines.push(`    c) ${it.options.c}`);
    lines.push(`    --> Richtige Lösung: ${it.correctAnswer}`);
  });
  lines.push(`\n[TEXT B] ${exam.teil2.textB.title}`);
  lines.push(`Quelle: ${exam.teil2.textB.source}`);
  lines.push(exam.teil2.textB.bodyParagraphs.join('\n\n'));
  lines.push('\nAufgaben Text B (10–12):');
  exam.teil2.textB.items.forEach((it) => {
    lines.push(`\n[${it.number}] ${it.question}`);
    lines.push(`    a) ${it.options.a}`);
    lines.push(`    b) ${it.options.b}`);
    lines.push(`    c) ${it.options.c}`);
    lines.push(`    --> Richtige Lösung: ${it.correctAnswer}`);
  });
  lines.push('\n');

  // TEIL 3
  lines.push('--- TEIL 3: ZUORDNUNG (Situationen 13–19 | 7 Punkte | ca. 10 Min.) ---');
  lines.push(`Anweisung: ${exam.teil3.instruction}`);
  lines.push(`Kontext: ${exam.teil3.contextDescription}\n`);
  lines.push('Situationen:');
  lines.push(`[0] Beispiel: ${exam.teil3.beispiel.situation} --> Anzeige: ${exam.teil3.beispiel.answer.toUpperCase()}`);
  exam.teil3.situations.forEach((sit) => {
    lines.push(`[${sit.number}] ${sit.situation} --> Anzeige: ${sit.correctAnswer.toUpperCase() === '0' ? '0 (Keine passende Anzeige)' : sit.correctAnswer.toUpperCase()}`);
  });
  lines.push('\nAnzeigen (A–J):');
  exam.teil3.advertisements.forEach((ad) => {
    lines.push(`\n[Anzeige ${ad.letter.toUpperCase()}] ${ad.title}`);
    lines.push(ad.body);
    if (ad.contact) lines.push(`Kontakt: ${ad.contact}`);
  });
  lines.push('\n');

  // TEIL 4
  lines.push('--- TEIL 4: LESERBRIEFE (Aufgaben 20–26 | 7 Punkte | ca. 15 Min.) ---');
  lines.push(`Anweisung: ${exam.teil4.instruction}`);
  lines.push(`Thema: ${exam.teil4.contextTopic}\n`);
  lines.push(`[0] Beispiel: ${exam.teil4.beispiel.author} (${exam.teil4.beispiel.city}): "${exam.teil4.beispiel.text}" --> ${exam.teil4.beispiel.answer}`);
  exam.teil4.leserbriefe.forEach((lb) => {
    lines.push(`[${lb.number}] ${lb.author} (${lb.city}): "${lb.text}" --> Lösung: ${lb.correctAnswer}`);
  });
  lines.push('\n');

  // TEIL 5
  lines.push('--- TEIL 5: REGELWERK / HAUSORDNUNG (Aufgaben 27–30 | 4 Punkte | ca. 10 Min.) ---');
  lines.push(`Anweisung: ${exam.teil5.instruction}`);
  lines.push(`Regelwerk: ${exam.teil5.sheetTitle}`);
  lines.push(`Kontext: ${exam.teil5.contextSituation}\n`);
  exam.teil5.sections.forEach((sec) => {
    lines.push(`  ${sec.title}`);
    lines.push(sec.content);
    lines.push('');
  });
  lines.push('Aufgaben (27–30):');
  exam.teil5.items.forEach((it) => {
    lines.push(`\n[${it.number}] ${it.question}`);
    lines.push(`    a) ${it.options.a}`);
    lines.push(`    b) ${it.options.b}`);
    lines.push(`    c) ${it.options.c}`);
    lines.push(`    --> Richtige Lösung: ${it.correctAnswer}`);
  });
  lines.push('\n');

  // OFFIZIELLER LÖSUNGSSCHLÜSSEL
  lines.push('================================================================================');
  lines.push('OFFIZIELLER GESAMTLÖSUNGSSCHLÜSSEL (1–30)');
  lines.push('================================================================================');
  lines.push('Teil 1:');
  exam.teil1.items.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer}`));
  lines.push('Teil 2:');
  exam.teil2.textA.items.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer}`));
  exam.teil2.textB.items.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer}`));
  lines.push('Teil 3:');
  exam.teil3.situations.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer.toUpperCase()}`));
  lines.push('Teil 4:');
  exam.teil4.leserbriefe.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer}`));
  lines.push('Teil 5:');
  exam.teil5.items.forEach((it) => lines.push(`  Aufgabe ${it.number}: ${it.correctAnswer}`));

  lines.push('\n================================================================================');
  lines.push('OFFIZIELLE NOTENUMRECHNUNGSTABELLE (Rohpunkte -> Ergebnispunkte)');
  lines.push('Passmarke: mind. 60 % (mind. 18 / 30 Rohpunkte = 60 / 100 Ergebnispunkte)');
  lines.push('================================================================================');
  OFFICIAL_B1_CONVERSION_TABLE.forEach((row) => {
    lines.push(`  ${String(row.raw).padStart(2, ' ')} Rohpunkte = ${String(row.scaled).padStart(3, ' ')} / 100 Ergebnispunkte ${row.raw >= 18 ? '[BESTANDEN]' : '[NICHT BESTANDEN]'}`);
  });

  return lines.join('\n');
}

export async function exportSingleExamZip(
  exam: ExamModel,
  candidatePdfBlob?: Blob | null,
  solutionsPdfBlob?: Blob | null,
  onProgress?: (percent: number, statusText: string) => void
): Promise<Blob> {
  const numStr = String(exam.examNumber).padStart(2, '0');
  const zip = new JSZip();

  onProgress?.(10, 'Erstelle Kandidatenblatt (DOCX)...');
  const examDocxBlob = await exportExamToDocx(exam);
  zip.file(`b1_lesen_exam_${numStr}_kandidatenblatt.docx`, examDocxBlob);

  onProgress?.(30, 'Erstelle Lösungsbogen (DOCX)...');
  const solDocxBlob = await exportAnswerKeyToDocx(exam);
  zip.file(`b1_lesen_exam_${numStr}_loesungen.docx`, solDocxBlob);

  if (candidatePdfBlob) {
    onProgress?.(50, 'Füge Kandidatenblatt (PDF) hinzu...');
    zip.file(`b1_lesen_exam_${numStr}_kandidatenblatt.pdf`, candidatePdfBlob);
  }

  if (solutionsPdfBlob) {
    onProgress?.(70, 'Füge Lösungsbogen (PDF) hinzu...');
    zip.file(`b1_lesen_exam_${numStr}_loesungen.pdf`, solutionsPdfBlob);
  }

  onProgress?.(85, 'Erstelle strukturierte Prüfungsdaten & Übersichtstext...');
  // Raw JSON
  zip.file(`b1_lesen_exam_${numStr}_daten.json`, JSON.stringify(exam, null, 2));

  // Human-readable summary
  const summaryText = generateExamSummaryText(exam);
  zip.file(`b1_lesen_exam_${numStr}_uebersicht_und_loesungen.txt`, summaryText);

  onProgress?.(95, 'Komprimiere ZIP-Archiv...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.(100, 'Fertiggestellt!');
  return zipBlob;
}

export const exportExamBundleZip = exportSingleExamZip;

export async function exportAllExamsZip(
  exams: ExamModel[],
  onProgress?: (current: number, total: number, statusText: string) => void
): Promise<void> {
  const zip = new JSZip();
  const examsFolder = zip.folder('pruefungen_docx');
  const solutionsFolder = zip.folder('loesungen_docx');
  const jsonFolder = zip.folder('json_daten');
  const txtFolder = zip.folder('uebersichten_txt');

  const total = exams.length;
  for (let i = 0; i < total; i++) {
    const exam = exams[i];
    const numStr = String(exam.examNumber).padStart(2, '0');
    onProgress?.(i + 1, total, `Generiere Prüfung ${numStr} / ${total}...`);

    // 1. Exam DOCX
    const examDocxBlob = await exportExamToDocx(exam);
    examsFolder?.file(`b1_lesen_exam_${numStr}.docx`, examDocxBlob);

    // 2. Solutions DOCX
    const solDocxBlob = await exportAnswerKeyToDocx(exam);
    solutionsFolder?.file(`b1_lesen_exam_${numStr}_loesungen.docx`, solDocxBlob);

    // 3. Raw JSON
    jsonFolder?.file(`b1_lesen_exam_${numStr}.json`, JSON.stringify(exam, null, 2));

    // 4. Clean summary text
    txtFolder?.file(`b1_lesen_exam_${numStr}_uebersicht.txt`, generateExamSummaryText(exam));
  }

  onProgress?.(total, total, 'Erstelle ZIP-Archiv für alle 10 Prüfungen...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, 'Goethe_B1_Lesen_10_Komplette_Uebungssaetze.zip');
}
