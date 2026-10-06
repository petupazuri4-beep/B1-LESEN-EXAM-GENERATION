import React, { useState } from 'react';
import { Language } from '../../utils/i18n';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Scale,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  questionNumber: number;
  questionText: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: 'a' | 'b' | 'c';
  passageText?: string;
  lang?: Language;
}

export const DistractorTrapAnalyzer: React.FC<Props> = ({
  questionNumber,
  questionText,
  options,
  correctAnswer,
  passageText = '',
  lang = 'de',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Absolute signal words that frequently give away false options
  const absoluteSignalWords = [
    'nie',
    'niemals',
    'immer',
    'stets',
    'ausschließlich',
    'ausnahmslos',
    'keinesfalls',
    'auf keinen fall',
    'jederzeit',
    'völlig',
    'vollständig',
    'alle',
    'keiner',
    'niemand',
  ];

  const optA = options.a?.trim() || '';
  const optB = options.b?.trim() || '';
  const optC = options.c?.trim() || '';

  const lenA = optA.length;
  const lenB = optB.length;
  const lenC = optC.length;

  const lengths: Record<'a' | 'b' | 'c', number> = { a: lenA, b: lenB, c: lenC };
  const wordsA = optA.split(/\s+/).filter(Boolean);
  const wordsB = optB.split(/\s+/).filter(Boolean);
  const wordsC = optC.split(/\s+/).filter(Boolean);

  const wordCounts: Record<'a' | 'b' | 'c', number> = {
    a: wordsA.length,
    b: wordsB.length,
    c: wordsC.length,
  };

  // 1. Length Disparity Check
  const correctLen = lengths[correctAnswer] || 1;
  const otherKeys = (['a', 'b', 'c'] as const).filter((k) => k !== correctAnswer);
  const avgDistractorLen = (lengths[otherKeys[0]] + lengths[otherKeys[1]]) / 2 || 1;
  const lengthRatio = correctLen / avgDistractorLen;

  let lengthWarning: string | null = null;
  if (lengthRatio > 1.55) {
    lengthWarning =
      lang === 'en'
        ? `Option (${correctAnswer.toUpperCase()}) is significantly longer (+${Math.round((lengthRatio - 1) * 100)}%) than distractors. Candidates often spot this 'tell'.`
        : `Die richtige Option (${correctAnswer.toUpperCase()}) ist deutlich länger (+${Math.round((lengthRatio - 1) * 100)}%) als die Distraktoren. Signalisiert Testteilnehmern oft die richtige Antwort.`;
  } else if (lengthRatio < 0.6) {
    lengthWarning =
      lang === 'en'
        ? `Option (${correctAnswer.toUpperCase()}) is noticeably shorter than distractors.`
        : `Die richtige Option (${correctAnswer.toUpperCase()}) ist auffallend kürzer als die Distraktoren.`;
  }

  // 2. Absolutes & Signal Trap Words
  const detectedSignals: Array<{ key: 'a' | 'b' | 'c'; word: string }> = [];
  (['a', 'b', 'c'] as const).forEach((key) => {
    const textLower = options[key]?.toLowerCase() || '';
    absoluteSignalWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(textLower)) {
        detectedSignals.push({ key, word });
      }
    });
  });

  // 3. Verbatim Passage Keyword Overlap (Lure check)
  const passageWords = new Set(
    passageText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4) // filter short common words
  );

  const overlapCheck = (['a', 'b', 'c'] as const).map((key) => {
    const optsWords = options[key]
      ?.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4) || [];

    const matchedWords = optsWords.filter((w) => passageWords.has(w));
    return {
      key,
      isCorrect: key === correctAnswer,
      matchedCount: matchedWords.length,
      matchedWords: matchedWords.slice(0, 3),
    };
  });

  // Calculate Quality Score (out of 100)
  let qualityScore = 100;
  if (lengthWarning) qualityScore -= 20;
  qualityScore -= Math.min(30, detectedSignals.length * 15);
  if (optA.length < 5 || optB.length < 5 || optC.length < 5) qualityScore -= 30;
  if (optA === optB || optB === optC || optA === optC) qualityScore -= 50;
  qualityScore = Math.max(0, qualityScore);

  const getBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 65) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse';
  };

  return (
    <div className="mt-2 text-xs font-sans">
      {/* Trigger Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 flex items-center justify-between text-slate-300 hover:text-white transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-[11px]">
            {lang === 'en' ? 'Distractor Quality & Trap Inspector' : 'Distraktor- & Fallen-Inspektor'}
          </span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${getBadgeColor(qualityScore)}`}>
            {qualityScore}% {qualityScore >= 85 ? (lang === 'en' ? 'Optimal' : 'Qualität OK') : (lang === 'en' ? 'Attention' : 'Hinweise')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>{isOpen ? (lang === 'en' ? 'Collapse' : 'Schließen') : (lang === 'en' ? 'Inspect' : 'Prüfen')}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Analysis Drawer */}
      {isOpen && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-b-lg border-t-0 space-y-2.5 text-[11px]">
          {/* 1. Length Comparison Bar */}
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3 h-3 text-amber-400" />
                {lang === 'en' ? 'Option Length Balance:' : 'Längenbalance der 3 Optionen:'}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                A: {lengths.a}z ({wordCounts.a}w) • B: {lengths.b}z ({wordCounts.b}w) • C: {lengths.c}z ({wordCounts.c}w)
              </span>
            </div>

            {lengthWarning ? (
              <div className="text-amber-400 flex items-start gap-1.5 bg-amber-950/30 p-1.5 rounded border border-amber-800/40">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{lengthWarning}</span>
              </div>
            ) : (
              <div className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'en' ? 'Balanced option lengths. No giveaway tell detected.' : 'Ausgewogene Längen. Keine verräterische Längendiskrepanz.'}</span>
              </div>
            )}
          </div>

          {/* 2. Absolute Words Check */}
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              {lang === 'en' ? 'Extreme Words & Signal Fallacies:' : 'Signalwörter & Verabsolutierungen:'}
            </div>

            {detectedSignals.length > 0 ? (
              <div className="space-y-1">
                {detectedSignals.map((sig, i) => (
                  <div key={i} className="text-rose-400 flex items-center gap-1.5 bg-rose-950/30 p-1 rounded border border-rose-900/30 font-mono text-[10px]">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>
                      {lang === 'en' ? (
                        <>Option ({sig.key.toUpperCase()}): Signal word &ldquo;<strong>{sig.word}</strong>&rdquo; frequently gives away this option as an obvious distractor for B1 candidates.</>
                      ) : (
                        <>Option ({sig.key.toUpperCase()}): Signalwort „<strong>{sig.word}</strong>“ macht diese Option für B1-Kandidaten oft zu leicht als Distraktor erkennbar.</>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'en' ? 'No simplistic absolute trap words (e.g. nie, immer) found.' : 'Keine simplifizierenden Signalwörter (nie, immer, ausschließlich) gefunden.'}</span>
              </div>
            )}
          </div>

          {/* 3. Keyword Paraphrase vs Literal Trap Diagnosis */}
          {passageText && (
            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {lang === 'en' ? 'Passage Lexical Overlap (Paraphrase vs. Literal Trap):' : 'Wortlaut-Übereinstimmung mit dem Lesetext:'}
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                {overlapCheck.map((oc) => (
                  <div
                    key={oc.key}
                    className={`p-1.5 rounded border ${
                      oc.isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{lang === 'en' ? `Option ${oc.key.toUpperCase()}` : `Option ${oc.key.toUpperCase()}`}</span>
                      {oc.isCorrect && <span className="text-[9px] text-emerald-400">{lang === 'en' ? '✓ Solution' : '✓ Lösung'}</span>}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {oc.matchedCount} {lang === 'en' ? 'passage words' : 'Textwörter'}
                      {oc.matchedWords.length > 0 && ` (${oc.matchedWords.join(', ')})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
