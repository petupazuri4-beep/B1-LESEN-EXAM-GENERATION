/**
 * CEFR B1 Vocabulary & Sentence Length Linter for Goethe- / ÖSD-Zertifikat B1 Modul LESEN
 */

export interface SentenceAnalysis {
  text: string;
  wordCount: number;
  level: 'ok' | 'warning' | 'alert'; // ok <= 15, warning 16-22, alert > 22
}

export interface FlaggedWord {
  word: string;
  category: 'connector' | 'academic' | 'advanced_lexis';
  reason: string;
  b1Alternative?: string;
}

export interface B1LintReport {
  totalWords: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  longSentencesCount: number;
  alertSentencesCount: number;
  sentences: SentenceAnalysis[];
  flaggedWords: FlaggedWord[];
  targetWordRange: [number, number];
  wordCountStatus: 'optimal' | 'too_short' | 'too_long';
  b1ComplianceScore: number; // 0 - 100
  estimatedLevel: 'A2' | 'B1 (Standard)' | 'B2+' | 'C1';
}

// Advanced German vocabulary / connectors typically B2 or C1
export const ADVANCED_B2_C1_WORDS: Record<string, { category: 'connector' | 'academic' | 'advanced_lexis'; reason: string; b1Alternative?: string }> = {
  beziehungsweise: { category: 'connector', reason: 'B2+ Konnektor', b1Alternative: 'oder / bzw.' },
  folglich: { category: 'connector', reason: 'B2+ Konjunktionaladverb', b1Alternative: 'deshalb / also' },
  insofern: { category: 'connector', reason: 'B2+ Konnektor', b1Alternative: 'daher / weil' },
  nichtsdestotrotz: { category: 'connector', reason: 'B2+ Konnektor', b1Alternative: 'trotzdem' },
  verhältnismäßig: { category: 'advanced_lexis', reason: 'B2 gehobenes Adverb', b1Alternative: 'ziemlich / relativ' },
  demzufolge: { category: 'connector', reason: 'B2+ Konnektor', b1Alternative: 'deshalb' },
  gewissermaßen: { category: 'advanced_lexis', reason: 'B2+ Partikel', b1Alternative: 'fast / sozusagen' },
  zugrunde: { category: 'academic', reason: 'Gehobenes Idiom', b1Alternative: 'als Basis' },
  implizieren: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'bedeuten' },
  differenzieren: { category: 'academic', reason: 'B2+ Fachwort', b1Alternative: 'unterscheiden' },
  postulieren: { category: 'academic', reason: 'C1 Fachwort', b1Alternative: 'behaupten / fordern' },
  abzielen: { category: 'advanced_lexis', reason: 'B2 Verb', b1Alternative: 'als Ziel haben' },
  diskrepanz: { category: 'academic', reason: 'B2+ Nomen', b1Alternative: 'Unterschied' },
  paradigma: { category: 'academic', reason: 'C1 Fachwort', b1Alternative: 'Muster / Modell' },
  ubiquitär: { category: 'academic', reason: 'C1/C2 Fachwort', b1Alternative: 'überall vorhanden' },
  konträr: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'ganz anders / gegenteilig' },
  prägnant: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'kurz und klar' },
  adäquat: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'passend / geeignet' },
  essentiell: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'sehr wichtig / zentral' },
  fundamental: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'grundlegend' },
  signifikant: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'deutlich / wichtig' },
  konsequent: { category: 'advanced_lexis', reason: 'B2 Adjektiv', b1Alternative: 'zielstrebig' },
  prognostizieren: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'voraussagen' },
  elaborieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'ausarbeiten' },
  sukzessive: { category: 'advanced_lexis', reason: 'B2+ Adverb', b1Alternative: 'nach und nach / schrittweise' },
  obligatorisch: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'Pflicht / verpflichtend' },
  rudimentär: { category: 'academic', reason: 'C1 Adjektiv', b1Alternative: 'einfach / unvollständig' },
  substantiell: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'wesentlich / wichtig' },
  tangieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'betreffen' },
  evaluieren: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'bewerten / prüfen' },
  integrieren: { category: 'advanced_lexis', reason: 'B2 Fremdwort', b1Alternative: 'einbinden' },
  kompensieren: { category: 'academic', reason: 'B2+ Fremdwort', b1Alternative: 'ausgleichen' },
  plausibel: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'verständlich / nachvollziehbar' },
  heterogen: { category: 'academic', reason: 'C1 Fachwort', b1Alternative: 'gemischt / unterschiedlich' },
  homogen: { category: 'academic', reason: 'C1 Fachwort', b1Alternative: 'einheitlich' },
  latent: { category: 'academic', reason: 'C1 Adjektiv', b1Alternative: 'unsichtbar vorhanden' },
  manifest: { category: 'academic', reason: 'C1 Adjektiv', b1Alternative: 'offenkundig / sichtbar' },
  konditional: { category: 'academic', reason: 'C1 Grammatikbegriff', b1Alternative: 'Bedingung' },
  restriktiv: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'streng / einschränkend' },
  ambivalent: { category: 'academic', reason: 'B2+ Adjektiv', b1Alternative: 'widersprüchlich / geteilt' },
  partizipieren: { category: 'academic', reason: 'B2+ Verb', b1Alternative: 'teilnehmen / mitmachen' },
  authentifizieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'Identität nachweisen' },
  frequentieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'oft besuchen' },
  akkreditieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'anerkennen' },
  antizipieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'vorwegnehmen / erwarten' },
  eruieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'herausfinden' },
  intervenieren: { category: 'academic', reason: 'B2+ Verb', b1Alternative: 'eingreifen' },
  modifizieren: { category: 'academic', reason: 'B2+ Verb', b1Alternative: 'verändern / anpassen' },
  subsumieren: { category: 'academic', reason: 'C1 Fachwort', b1Alternative: 'unterordnen / zusammenfassen' },
  divergieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'auseinandergehen' },
  konvergieren: { category: 'academic', reason: 'C1 Verb', b1Alternative: 'sich annähern' },
  maßgeblich: { category: 'advanced_lexis', reason: 'B2 Adverb/Adjektiv', b1Alternative: 'sehr wichtig / entscheidend' },
  vorbehaltlich: { category: 'connector', reason: 'B2+ juristischer Ausdruck', b1Alternative: 'wenn / unter der Bedingung' },
  widerrufen: { category: 'advanced_lexis', reason: 'B2 Rechtswort', b1Alternative: 'zurücknehmen' },
  reglementieren: { category: 'academic', reason: 'B2+ Verb', b1Alternative: 'regeln' },
};

/**
 * Standard Reading Text Word Targets for Zertifikat B1
 */
export const TEIL_WORD_TARGETS: Record<string, [number, number]> = {
  teil1: [200, 260],
  teil2_textA: [130, 180],
  teil2_textB: [130, 180],
  teil3_ads: [25, 60],
  teil4_comment: [40, 70],
  teil5_rules: [250, 320],
};

/**
 * Splits text into sentences handling German abbreviations
 */
export function splitGermanSentences(text: string): string[] {
  if (!text.trim()) return [];
  // Protect abbreviations: z.B., bzw., ca., Nr., Dr., Prof., usw., etc., vgl., inkl.
  let protectedText = text
    .replace(/z\.B\./gi, 'z__B__')
    .replace(/bzw\./gi, 'b__z__w__')
    .replace(/ca\./gi, 'c__a__')
    .replace(/Nr\./gi, 'N__r__')
    .replace(/Dr\./gi, 'D__r__')
    .replace(/Prof\./gi, 'P__r__o__f__')
    .replace(/usw\./gi, 'u__s__w__')
    .replace(/vgl\./gi, 'v__g__l__')
    .replace(/inkl\./gi, 'i__n__k__l__')
    .replace(/(\d+)\./g, '$1__DOT__'); // Ordinals like 1., 2.

  // Split on sentence boundaries: . ! ? followed by space or newline
  const rawSentences = protectedText.split(/(?<=[.!?])\s+/);
  return rawSentences
    .map(s =>
      s
        .replace(/z__B__/g, 'z.B.')
        .replace(/b__z__w__/g, 'bzw.')
        .replace(/c__a__/g, 'ca.')
        .replace(/N__r__/g, 'Nr.')
        .replace(/D__r__/g, 'Dr.')
        .replace(/P__r__o__f__/g, 'Prof.')
        .replace(/u__s__w__/g, 'usw.')
        .replace(/v__g__l__/g, 'vgl.')
        .replace(/i__n__k__l__/g, 'inkl.')
        .replace(/(\d+)__DOT__/g, '$1.')
        .trim()
    )
    .filter(s => s.length > 0);
}

/**
 * Analyzes a German text against CEFR B1 criteria
 */
export function lintGermanText(
  text: string,
  targetType: keyof typeof TEIL_WORD_TARGETS = 'teil1'
): B1LintReport {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);
  const totalWords = words.length;

  const rawSentences = splitGermanSentences(text);
  const sentenceAnalyses: SentenceAnalysis[] = rawSentences.map(sent => {
    const sentWords = sent.split(/\s+/).filter(w => w.length > 0).length;
    let level: 'ok' | 'warning' | 'alert' = 'ok';
    if (sentWords > 22) {
      level = 'alert';
    } else if (sentWords > 15) {
      level = 'warning';
    }
    return {
      text: sent,
      wordCount: sentWords,
      level,
    };
  });

  const longSentences = sentenceAnalyses.filter(s => s.level === 'warning');
  const alertSentences = sentenceAnalyses.filter(s => s.level === 'alert');

  // Flagged B2/C1 lexis
  const flaggedWordsMap = new Map<string, FlaggedWord>();
  for (const rawWord of words) {
    const cleanWord = rawWord.toLowerCase().replace(/[^a-zäöüß]/g, '');
    if (ADVANCED_B2_C1_WORDS[cleanWord] && !flaggedWordsMap.has(cleanWord)) {
      const match = ADVANCED_B2_C1_WORDS[cleanWord];
      flaggedWordsMap.set(cleanWord, {
        word: rawWord.replace(/[^a-zA-ZäöüÄÖÜß]/g, ''),
        category: match.category,
        reason: match.reason,
        b1Alternative: match.b1Alternative,
      });
    }
  }

  const flaggedWords = Array.from(flaggedWordsMap.values());
  const targetWordRange = TEIL_WORD_TARGETS[targetType] || [200, 260];

  let wordCountStatus: 'optimal' | 'too_short' | 'too_long' = 'optimal';
  if (totalWords < targetWordRange[0]) {
    wordCountStatus = 'too_short';
  } else if (totalWords > targetWordRange[1]) {
    wordCountStatus = 'too_long';
  }

  const avgWordsPerSentence =
    sentenceAnalyses.length > 0
      ? Math.round((totalWords / sentenceAnalyses.length) * 10) / 10
      : 0;

  // B1 Compliance Score deduction
  let score = 100;
  score -= alertSentences.length * 8; // Heavy penalty for >22 words
  score -= longSentences.length * 3; // Minor penalty for 16-22 words
  score -= flaggedWords.length * 5; // Penalty for B2/C1 terms
  if (wordCountStatus !== 'optimal') {
    score -= 10;
  }
  score = Math.max(20, Math.min(100, score));

  let estimatedLevel: 'A2' | 'B1 (Standard)' | 'B2+' | 'C1' = 'B1 (Standard)';
  if (score >= 85 && avgWordsPerSentence <= 14) {
    estimatedLevel = 'B1 (Standard)';
  } else if (flaggedWords.length >= 3 || avgWordsPerSentence > 18) {
    estimatedLevel = 'B2+';
  } else if (flaggedWords.some(f => f.reason.includes('C1'))) {
    estimatedLevel = 'C1';
  } else if (totalWords < targetWordRange[0] * 0.6 && avgWordsPerSentence < 8) {
    estimatedLevel = 'A2';
  }

  return {
    totalWords,
    sentenceCount: sentenceAnalyses.length,
    avgWordsPerSentence,
    longSentencesCount: longSentences.length,
    alertSentencesCount: alertSentences.length,
    sentences: sentenceAnalyses,
    flaggedWords,
    targetWordRange,
    wordCountStatus,
    b1ComplianceScore: score,
    estimatedLevel,
  };
}
