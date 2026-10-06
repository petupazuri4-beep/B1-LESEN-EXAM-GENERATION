import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
} from 'docx';
import { ExamModel, SpaceLineConfig } from '../types/exam';
import { OFFICIAL_B1_CONVERSION_TABLE } from './scoreConversion';

function createDocxNoteLines(
  spaceConfig?: SpaceLineConfig,
  teilKey?: 'teil1' | 'teil2' | 'teil3' | 'teil4' | 'teil5'
): Paragraph[] {
  if (!spaceConfig || !spaceConfig.showNoteLines) return [];
  if (teilKey === 'teil1' && !spaceConfig.includeInTeil1) return [];
  if (teilKey === 'teil2' && !spaceConfig.includeInTeil2) return [];
  if (teilKey === 'teil3' && !spaceConfig.includeInTeil3) return [];
  if (teilKey === 'teil4' && !spaceConfig.includeInTeil4) return [];
  if (teilKey === 'teil5' && !spaceConfig.includeInTeil5) return [];

  const count = spaceConfig.linesCount || 4;
  if (count <= 0) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: (spaceConfig.noteLabel || 'Platz für Notizen / Entwurf').toUpperCase(),
          bold: true,
          size: 16,
          color: '777777',
        }),
        new TextRun({
          text: '  (wird nicht bewertet)',
          italics: true,
          size: 14,
          color: '999999',
        }),
      ],
    }),
  ];

  const linePattern = spaceConfig.lineStyle === 'solid'
    ? '_________________________________________________________________________________'
    : spaceConfig.lineStyle === 'dashed'
    ? '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    : '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .';

  const spacingTwips = Math.round((spaceConfig.lineSpacingMm || 8) * 56.7);

  for (let i = 0; i < count; i++) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: Math.max(100, Math.round(spacingTwips / 2)), after: Math.max(100, Math.round(spacingTwips / 2)) },
        children: [
          new TextRun({
            text: linePattern,
            size: 18,
            color: 'CCCCCC',
          }),
        ],
      })
    );
  }
  return paragraphs;
}

function createGreyHeaderBar(leftText: string, middleText: string, rightText: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9D9D9' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: leftText, bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9D9D9' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: middleText, bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9D9D9' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: rightText, bold: true, size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export async function exportExamToDocx(exam: ExamModel): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }, // ~2cm
          },
        },
        children: [
          // Cover Page
          createGreyHeaderBar('GOETHE-ZERTIFIKAT B1 / ÖSD', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 200, after: 100 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'GOETHE-ZERTIFIKAT B1', bold: true, size: 36, color: 'E15B28' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exam.title.toUpperCase()}`,
                bold: true,
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'KANDIDATENBLÄTTER • MODUL LESEN (65 MINUTEN)',
                size: 22,
                color: '555555',
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 300, after: 200 } }),
          // Candidate Info Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Nachname, Vorname: ____________________________________', size: 20 })] }),
                      new Paragraph({ spacing: { before: 120 } }),
                      new Paragraph({ children: [new TextRun({ text: 'Institution, Ort: _______________________________________', size: 20 })] }),
                      new Paragraph({ spacing: { before: 120 } }),
                      new Paragraph({ children: [new TextRun({ text: 'Geburtsdatum (TT.MM.JJJJ): [  ] [  ] . [  ] [  ] . [  ] [  ] [  ] [  ]', size: 18 })] }),
                      new Paragraph({ spacing: { before: 120 } }),
                      new Paragraph({ children: [new TextRun({ text: 'PTN-Nr.: [  ][  ][  ][  ][  ][  ][  ][  ][  ][  ]', size: 18 })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F3F4F6' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                      bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                      right: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Markieren Sie so: ☒', bold: true, size: 20 })],
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: 'NICHT so: 🗷 ☑ ⯁', size: 18, color: '777777' })],
                      }),
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [new TextRun({ text: 'Füllen Sie zur Korrektur das Feld aus: ⬛', size: 18 })],
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: 'Markieren Sie das richtige Feld neu: ☒', size: 18 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 300 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Das Modul Lesen hat fünf Teile. Sie lesen mehrere Texte und lösen 30 Aufgaben dazu. Für jede Aufgabe gibt es nur eine richtige Lösung. Hilfsmittel wie Wörterbücher oder Mobiltelefone sind nicht erlaubt.',
                italics: true,
                size: 20,
              }),
            ],
          }),
          // Page Break to Teil 1
          new Paragraph({ children: [new PageBreak()] }),
          // TEIL 1
          createGreyHeaderBar('ZERTIFIKAT B1', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: `Teil 1 • Arbeitszeit: ${exam.teil1.workTimeMinutes} Minuten`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil1.instruction, italics: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Teil 1 Text (Email Box)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'FAFAFA' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
                      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
                      right: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: exam.teil1.emailGreeting, bold: true, size: 20 })],
                      }),
                      ...exam.teil1.emailBody.split('\n\n').map(p =>
                        new Paragraph({
                          spacing: { before: 100, after: 100 },
                          children: [new TextRun({ text: p, size: 20 })],
                        })
                      ),
                      new Paragraph({
                        children: [new TextRun({ text: exam.teil1.emailSignoff, bold: true, size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Beispiel: ', bold: true, size: 20 }),
              new TextRun({ text: `0  ${exam.teil1.beispiel.statement}    `, size: 20 }),
              new TextRun({ text: `[${exam.teil1.beispiel.answer === 'Richtig' ? '☒' : '☐'}] Richtig   [${exam.teil1.beispiel.answer === 'Falsch' ? '☒' : '☐'}] Falsch`, bold: true, size: 20 }),
            ],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Teil 1 Items 1-6
          ...exam.teil1.items.map(item =>
            new Paragraph({
              spacing: { before: 120, after: 120 },
              children: [
                new TextRun({ text: `${item.number}  `, bold: true, size: 20 }),
                new TextRun({ text: `${item.statement}    `, size: 20 }),
                new TextRun({ text: '☐ Richtig    ☐ Falsch', bold: true, size: 20 }),
              ],
            })
          ),
          ...createDocxNoteLines(exam.styleConfig?.spaceLines, 'teil1'),

          // Page Break to Teil 2
          new Paragraph({ children: [new PageBreak()] }),
          // TEIL 2
          createGreyHeaderBar('ZERTIFIKAT B1', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: `Teil 2 • Arbeitszeit: ${exam.teil2.workTimeMinutes} Minuten`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.instruction, italics: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Text A
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textA.title, bold: true, size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textA.kicker, italics: true, size: 20, color: '666666' })],
          }),
          ...exam.teil2.textA.bodyParagraphs.map(p =>
            new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [new TextRun({ text: p, size: 20 })],
            })
          ),
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textA.source, italics: true, size: 18, color: '777777' })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Text A Items 7-9
          ...exam.teil2.textA.items.map(item =>
            new Paragraph({
              spacing: { before: 150, after: 100 },
              children: [
                new TextRun({ text: `${item.number}  ${item.question}\n`, bold: true, size: 20 }),
                new TextRun({ text: `    [a]  ${item.options.a}\n`, size: 20 }),
                new TextRun({ text: `    [b]  ${item.options.b}\n`, size: 20 }),
                new TextRun({ text: `    [c]  ${item.options.c}`, size: 20 }),
              ],
            })
          ),
          new Paragraph({ spacing: { before: 200 } }),
          // Text B
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textB.title, bold: true, size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textB.kicker, italics: true, size: 20, color: '666666' })],
          }),
          ...exam.teil2.textB.bodyParagraphs.map(p =>
            new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [new TextRun({ text: p, size: 20 })],
            })
          ),
          new Paragraph({
            children: [new TextRun({ text: exam.teil2.textB.source, italics: true, size: 18, color: '777777' })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Text B Items 10-12
          ...exam.teil2.textB.items.map(item =>
            new Paragraph({
              spacing: { before: 150, after: 100 },
              children: [
                new TextRun({ text: `${item.number}  ${item.question}\n`, bold: true, size: 20 }),
                new TextRun({ text: `    [a]  ${item.options.a}\n`, size: 20 }),
                new TextRun({ text: `    [b]  ${item.options.b}\n`, size: 20 }),
                new TextRun({ text: `    [c]  ${item.options.c}`, size: 20 }),
              ],
            })
          ),
          ...createDocxNoteLines(exam.styleConfig?.spaceLines, 'teil2'),

          // Page Break to Teil 3
          new Paragraph({ children: [new PageBreak()] }),
          // TEIL 3
          createGreyHeaderBar('ZERTIFIKAT B1', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: `Teil 3 • Arbeitszeit: ${exam.teil3.workTimeMinutes} Minuten`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil3.instruction, italics: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 100 } }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil3.contextDescription, bold: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Teil 3 Situations
          new Paragraph({
            children: [
              new TextRun({ text: 'Beispiel: ', bold: true, size: 20 }),
              new TextRun({ text: `0  ${exam.teil3.beispiel.situation}    -->  Anzeige: [ ${exam.teil3.beispiel.answer.toUpperCase()} ]`, bold: true, size: 20 }),
            ],
          }),
          ...exam.teil3.situations.map(s =>
            new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({ text: `${s.number}  ${s.situation}    -->  Anzeige: [ _____ ]`, size: 20 }),
              ],
            })
          ),
          new Paragraph({ spacing: { before: 200 } }),
          new Paragraph({
            children: [new TextRun({ text: 'ANZEIGEN A BIS J', bold: true, size: 22 })],
          }),
          // Advertisements rendered as bordered tables
          ...exam.teil3.advertisements.map(ad =>
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 10, type: WidthType.PERCENTAGE },
                      shading: { fill: 'EEEEEE' },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                        bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                        left: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                        right: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: ad.letter.toUpperCase(), bold: true, size: 24 })],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 90, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                        bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.SINGLE, size: 6, color: '999999' },
                      },
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: ad.title, bold: true, size: 20 })],
                        }),
                        new Paragraph({
                          spacing: { before: 60, after: 60 },
                          children: [new TextRun({ text: ad.body, size: 19 })],
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: ad.contact, italics: true, size: 18, color: '555555' })],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          ),
          ...createDocxNoteLines(exam.styleConfig?.spaceLines, 'teil3'),

          // Page Break to Teil 4
          new Paragraph({ children: [new PageBreak()] }),
          // TEIL 4
          createGreyHeaderBar('ZERTIFIKAT B1', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: `Teil 4 • Arbeitszeit: ${exam.teil4.workTimeMinutes} Minuten`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil4.instruction, italics: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 100 } }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil4.contextTopic, bold: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'LESERBRIEFE', bold: true, size: 24 }),
            ],
          }),
          new Paragraph({ spacing: { before: 100 } }),
          // Beispiel Teil 4
          new Paragraph({
            children: [
              new TextRun({ text: 'Beispiel: ', bold: true, size: 20 }),
              new TextRun({ text: `0  ${exam.teil4.beispiel.author}, ${exam.teil4.beispiel.age}, ${exam.teil4.beispiel.city}: `, bold: true, size: 20 }),
              new TextRun({ text: `"${exam.teil4.beispiel.text}"    -->  `, size: 20 }),
              new TextRun({ text: `[${exam.teil4.beispiel.answer === 'Ja' ? '☒' : '☐'}] Ja   [${exam.teil4.beispiel.answer === 'Nein' ? '☒' : '☐'}] Nein`, bold: true, size: 20 }),
            ],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Leserbriefe 20-26
          ...exam.teil4.leserbriefe.map(lb =>
            new Paragraph({
              spacing: { before: 120, after: 120 },
              children: [
                new TextRun({ text: `${lb.number}  ${lb.author} (${lb.age}), ${lb.city}: `, bold: true, size: 20 }),
                new TextRun({ text: `"${lb.text}"\n`, size: 20 }),
                new TextRun({ text: '    ☐ Ja        ☐ Nein', bold: true, size: 20 }),
              ],
            })
          ),
          ...createDocxNoteLines(exam.styleConfig?.spaceLines, 'teil4'),

          // Page Break to Teil 5
          new Paragraph({ children: [new PageBreak()] }),
          // TEIL 5
          createGreyHeaderBar('ZERTIFIKAT B1', 'LESEN', 'KANDIDATENBLÄTTER'),
          new Paragraph({ spacing: { before: 150 } }),
          new Paragraph({
            children: [
              new TextRun({ text: `Teil 5 • Arbeitszeit: ${exam.teil5.workTimeMinutes} Minuten`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil5.instruction, italics: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 100 } }),
          new Paragraph({
            children: [new TextRun({ text: exam.teil5.contextSituation, bold: true, size: 20 })],
          }),
          new Paragraph({ spacing: { before: 150 } }),
          // Bordered Rules Card
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F9FAFB' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 8, color: '444444' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '444444' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: '444444' },
                      right: { style: BorderStyle.SINGLE, size: 8, color: '444444' },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: exam.teil5.sheetTitle, bold: true, size: 24 }),
                        ],
                      }),
                      ...(exam.teil5.sheetSubtitle
                        ? [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [new TextRun({ text: exam.teil5.sheetSubtitle, italics: true, size: 19, color: '666666' })],
                            }),
                          ]
                        : []),
                      new Paragraph({ spacing: { before: 100, after: 100 } }),
                      ...exam.teil5.sections.flatMap(sec => [
                        new Paragraph({
                          children: [new TextRun({ text: `${sec.title}:`, bold: true, size: 20 })],
                        }),
                        new Paragraph({
                          spacing: { after: 120 },
                          children: [new TextRun({ text: sec.content, size: 19 })],
                        }),
                      ]),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 200 } }),
          // Teil 5 Items 27-30
          ...exam.teil5.items.map(item =>
            new Paragraph({
              spacing: { before: 150, after: 100 },
              children: [
                new TextRun({ text: `${item.number}  ${item.question}\n`, bold: true, size: 20 }),
                new TextRun({ text: `    [a]  ${item.options.a}\n`, size: 20 }),
                new TextRun({ text: `    [b]  ${item.options.b}\n`, size: 20 }),
                new TextRun({ text: `    [c]  ${item.options.c}`, size: 20 }),
              ],
            })
          ),
          ...createDocxNoteLines(exam.styleConfig?.spaceLines, 'teil5'),
        ],
      },
    ],
  });
  return await Packer.toBlob(doc);
}

export async function exportAnswerKeyToDocx(exam: ExamModel): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: [
          createGreyHeaderBar('GOETHE-ZERTIFIKAT B1 / ÖSD', 'LESEN LÖSUNGEN', 'PRÜFERBLÄTTER'),
          new Paragraph({ spacing: { before: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'LÖSUNGSSCHLÜSSEL & BEWERTUNGSBOGEN', bold: true, size: 32, color: 'E15B28' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${exam.title} (Max. 30 Rohpunkte = 100 Ergebnispunkte)`, bold: true, size: 22 }),
            ],
          }),
          new Paragraph({ spacing: { before: 200 } }),
          // Table of Solutions
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'D9D9D9' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Teil / Aufgabe', bold: true, size: 20 })] })],
                  }),
                  new TableCell({
                    shading: { fill: 'D9D9D9' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Aufgabentyp', bold: true, size: 20 })] })],
                  }),
                  new TableCell({
                    shading: { fill: 'D9D9D9' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Offizielle Lösung', bold: true, size: 20 })] })],
                  }),
                ],
              }),
              // Teil 1
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teil 1 (Beispiel 0)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Richtig / Falsch', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: exam.teil1.beispiel.answer, bold: true, size: 19 })] })] }),
                ],
              }),
              ...exam.teil1.items.map(i =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${i.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Richtig / Falsch', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: i.correctAnswer, bold: true, size: 19 })] })] }),
                  ],
                })
              ),
              // Teil 2 Text A
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teil 2A (Beispiel 0)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dreigliedrig (a/b/c)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: exam.teil2.textA.beispiel.answer.toUpperCase(), bold: true, size: 19 })] })] }),
                ],
              }),
              ...exam.teil2.textA.items.map(i =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${i.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dreigliedrig (a/b/c)', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: i.correctAnswer.toUpperCase(), bold: true, size: 19 })] })] }),
                  ],
                })
              ),
              // Teil 2 Text B
              ...exam.teil2.textB.items.map(i =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${i.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dreigliedrig (a/b/c)', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: i.correctAnswer.toUpperCase(), bold: true, size: 19 })] })] }),
                  ],
                })
              ),
              // Teil 3
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teil 3 (Beispiel 0)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Zuordnung (a–j)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Anzeige ${exam.teil3.beispiel.answer.toUpperCase()}`, bold: true, size: 19 })] })] }),
                ],
              }),
              ...exam.teil3.situations.map(s =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${s.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Zuordnung (a–j / 0)', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.correctAnswer === '0' ? '0 (keine passende Anzeige)' : `Anzeige ${s.correctAnswer.toUpperCase()}`, bold: true, size: 19 })] })] }),
                  ],
                })
              ),
              // Teil 4
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teil 4 (Beispiel 0)', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ja / Nein', size: 19 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: exam.teil4.beispiel.answer, bold: true, size: 19 })] })] }),
                ],
              }),
              ...exam.teil4.leserbriefe.map(lb =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${lb.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ja / Nein', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lb.correctAnswer, bold: true, size: 19 })] })] }),
                  ],
                })
              ),
              // Teil 5
              ...exam.teil5.items.map(i =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Aufgabe ${i.number}`, size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dreigliedrig (a/b/c)', size: 19 })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: i.correctAnswer.toUpperCase(), bold: true, size: 19 })] })] }),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ spacing: { before: 300 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'OFFIZIELLE UMRECHNUNGSTABELLE (HÖREN & LESEN)', bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Bestehensgrenze: 60 Punkte (18 von 30 Rohpunkten).',
                italics: true,
                size: 19,
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 100 } }),
          // Score Conversion Table in 2 rows as in original PDF
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Messpunkte', bold: true, size: 16 })] })] }),
                  ...OFFICIAL_B1_CONVERSION_TABLE.slice(0, 16).map(r =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(r.raw), size: 16 })] })] })
                  ),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ergebnispunkte', bold: true, size: 16 })] })] }),
                  ...OFFICIAL_B1_CONVERSION_TABLE.slice(0, 16).map(r =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(r.scaled), size: 16 })] })] })
                  ),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Messpunkte', bold: true, size: 16 })] })] }),
                  ...OFFICIAL_B1_CONVERSION_TABLE.slice(16).map(r =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(r.raw), size: 16 })] })] })
                  ),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ergebnispunkte', bold: true, size: 16 })] })] }),
                  ...OFFICIAL_B1_CONVERSION_TABLE.slice(16).map(r =>
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(r.scaled), size: 16 })] })] })
                  ),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
  return await Packer.toBlob(doc);
}
