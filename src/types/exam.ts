export type TeilType = 1 | 2 | 3 | 4 | 5;

export interface Teil1Item {
  id: string;
  number: number;
  statement: string;
  correctAnswer: 'Richtig' | 'Falsch';
  userAnswer?: 'Richtig' | 'Falsch';
  textReference?: string;
  justification?: string;
}

export interface Teil2Item {
  id: string;
  number: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: 'a' | 'b' | 'c';
  userAnswer?: 'a' | 'b' | 'c';
  textReference?: string;
  justification?: string;
  distractorRationale?: {
    a?: string;
    b?: string;
    c?: string;
  };
}

export interface Advertisement {
  id: string;
  letter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j';
  title: string;
  body: string;
  contact: string;
  rotationDeg?: number;
}

export interface Teil3Item {
  id: string;
  number: number;
  situation: string;
  correctAnswer: string; // 'a' - 'j' or '0'
  userAnswer?: string;
  textReference?: string;
  justification?: string;
}

export interface Leserbrief {
  id: string;
  number: number;
  author: string;
  age: number;
  city: string;
  text: string;
  correctAnswer: 'Ja' | 'Nein';
  userAnswer?: 'Ja' | 'Nein';
  textReference?: string;
  justification?: string;
}

export interface RuleSection {
  title: string;
  content: string;
}

export interface Teil5Item {
  id: string;
  number: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: 'a' | 'b' | 'c';
  userAnswer?: 'a' | 'b' | 'c';
  textReference?: string;
  justification?: string;
  distractorRationale?: {
    a?: string;
    b?: string;
    c?: string;
  };
}

export interface SpaceLineConfig {
  showNoteLines: boolean; // whether to show ruled note lines for student scratchpad/draft work
  linesCount: number; // e.g. 1 to 8 lines (default 4)
  lineStyle: 'dotted' | 'dashed' | 'solid'; // style of the ruled lines
  lineSpacingMm: number; // vertical height between lines: 6, 8, 10, 12, 14 mm
  noteLabel: string; // e.g. "Platz für Notizen / Entwurf"
  showItemDividers: boolean; // whether to put extra spacing or subtle line between questions
  itemSpacingRem: number; // margin bottom on question items: 0.5 to 2.5 rem
  textLineHeight: number; // line height for reading texts: 1.2 to 2.2
  includeInTeil1: boolean;
  includeInTeil2: boolean;
  includeInTeil3: boolean;
  includeInTeil4: boolean;
  includeInTeil5: boolean;
  watermarkText?: string; // watermark for downloaded/printed exams
  showLineNumbers?: boolean; // Zeilennummerierung (every 5 lines)
  lineNumbersInterval?: number; // 5 or 10
  layoutStandard?: 'goethe' | 'osd'; // Goethe-Institut or ÖSD styling
  answerSheetStyle?: 'bubbles' | 'checkboxes'; // Scan-Sheet bubble grid vs standard checkboxes
  passMarkPoints?: number; // standard pass mark (18 out of 30)
}

export const DEFAULT_SPACE_LINE_CONFIG: SpaceLineConfig = {
  showNoteLines: true,
  linesCount: 4,
  lineStyle: 'dotted',
  lineSpacingMm: 8,
  noteLabel: 'Platz für Notizen / Entwurf',
  showItemDividers: true,
  itemSpacingRem: 1.0,
  textLineHeight: 1.45,
  includeInTeil1: true,
  includeInTeil2: true,
  includeInTeil3: true,
  includeInTeil4: true,
  includeInTeil5: true,
  watermarkText: '',
  showLineNumbers: true,
  lineNumbersInterval: 5,
  layoutStandard: 'goethe',
  answerSheetStyle: 'checkboxes',
  passMarkPoints: 18,
};

export interface ExamStyleConfig {
  fontFamily: 'Source Sans 3' | 'Open Sans' | 'Merriweather' | 'Arial' | 'Georgia';
  baseFontSizePt: number; // 9 - 14
  lineHeight: number; // 1.2 - 2.0
  headerBarColor: string; // default '#d9d9d9'
  headerTextColor: string; // default '#000000' or '#ffffff'
  accentColor: string; // default '#d97706' (amber) or '#2563eb'
  marginPreset: 'normal' | 'narrow' | 'wide';
  spaceLines?: SpaceLineConfig;
}

export interface ExamModel {
  id: string;
  examNumber: number; // 1 to 10
  title: string;
  theme: string;
  status: 'Draft' | 'Ready' | 'Exported';
  updatedAt: string;
  styleConfig: ExamStyleConfig;
  // Header & Impressum Info
  candidateInfo: {
    institution: string;
    city: string;
    examType: 'Erwachsene' | 'Jugendliche';
    centerCode: string;
    proctorName?: string;
    testDate?: string;
    roomNumber?: string;
    proctorNotes?: string;
  };
  // Teil 1 (Items 1-6)
  teil1: {
    workTimeMinutes: number;
    instruction: string;
    sourceContext: string;
    emailGreeting: string;
    emailBody: string;
    emailSignoff: string;
    authorLocation: string;
    footnote?: string;
    beispiel: {
      statement: string;
      answer: 'Richtig' | 'Falsch';
    };
    items: Teil1Item[];
  };
  // Teil 2 (Items 7-12)
  teil2: {
    workTimeMinutes: number;
    instruction: string;
    textA: {
      title: string;
      kicker: string;
      bodyParagraphs: string[];
      source: string;
      beispiel: {
        question: string;
        options: { a: string; b: string; c: string };
        answer: 'a' | 'b' | 'c';
      };
      items: Teil2Item[]; // 7, 8, 9
    };
    textB: {
      title: string;
      kicker: string;
      bodyParagraphs: string[];
      source: string;
      footnote?: string;
      items: Teil2Item[]; // 10, 11, 12
    };
  };
  // Teil 3 (Items 13-19)
  teil3: {
    workTimeMinutes: number;
    instruction: string;
    contextDescription: string;
    beispiel: {
      situation: string;
      answer: string;
    };
    situations: Teil3Item[]; // 13-19
    advertisements: Advertisement[]; // a to j (10 ads)
    unusedAdLetter: string;
  };
  // Teil 4 (Items 20-26)
  teil4: {
    workTimeMinutes: number;
    instruction: string;
    contextTopic: string;
    questionFraming: string; // e.g. "Ist die Person für ein Verbot / für ..."
    beispiel: {
      author: string;
      age: number;
      city: string;
      text: string;
      answer: 'Ja' | 'Nein';
    };
    leserbriefe: Leserbrief[]; // 20-26
  };
  // Teil 5 (Items 27-30)
  teil5: {
    workTimeMinutes: number;
    instruction: string;
    contextSituation: string;
    sheetTitle: string;
    sheetSubtitle?: string;
    sections: RuleSection[];
    items: Teil5Item[]; // 27-30
  };
}

export interface ScoreConversionRow {
  raw: number;
  scaled: number;
}
