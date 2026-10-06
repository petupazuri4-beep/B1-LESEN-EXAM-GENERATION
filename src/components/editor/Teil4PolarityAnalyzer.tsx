import React from 'react';
import { ExamModel, Leserbrief } from '../../types/exam';
import { Language } from '../../utils/i18n';
import {
  ThumbsUp,
  ThumbsDown,
  Scale,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wand2,
  Sparkles,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  onUpdateExam: (updated: ExamModel) => void;
  lang?: Language;
}

export const Teil4PolarityAnalyzer: React.FC<Props> = ({
  exam,
  onUpdateExam,
  lang = 'de',
}) => {
  const letters = exam.teil4.leserbriefe;
  const beispiel = exam.teil4.beispiel;

  // Counts
  const jaCount = letters.filter((l) => l.correctAnswer === 'Ja').length;
  const neinCount = letters.filter((l) => l.correctAnswer === 'Nein').length;
  const total = letters.length; // 7 items

  // Ratio Assessment (Official Goethe standard: 4:3 or 3:4)
  const isBalanced = (jaCount === 4 && neinCount === 3) || (jaCount === 3 && neinCount === 4);
  const isSlightlySkewed = (jaCount === 5 && neinCount === 2) || (jaCount === 2 && neinCount === 5);
  const isHeavilySkewed = jaCount >= 6 || neinCount >= 6;

  // Sentiment Markers
  const proKeywords = [
    'dafür',
    'befürworte',
    'finde ich gut',
    'tolle idee',
    'absolut richtig',
    'sinnvoll',
    'chance',
    'vorteil',
    'begeistert',
    'unterstütze',
    'wichtig',
    'notwendig',
    'positiv',
    'ja bitte',
  ];

  const contraKeywords = [
    'dagegen',
    'ablehnen',
    'halte ich für falsch',
    'unsinn',
    'nachteil',
    'quatsch',
    'überflüssig',
    'verbieten',
    'schrecklich',
    'gefährlich',
    'problem',
    'schlechte idee',
    'dagegen stimmen',
    'auf keinen fall',
  ];

  const ambiguousKeywords = [
    'einerseits',
    'andererseits',
    'zwar',
    'aber',
    'nicht sicher',
    'sowohl als auch',
    'weiß nicht',
    'schwer zu sagen',
    'vielleicht',
  ];

  const analyzeLetterSentiment = (text: string) => {
    const lower = text.toLowerCase();
    let proHits = proKeywords.filter((w) => lower.includes(w)).length;
    let contraHits = contraKeywords.filter((w) => lower.includes(w)).length;
    let ambigHits = ambiguousKeywords.filter((w) => lower.includes(w)).length;

    let detected: 'Ja' | 'Nein' | 'Ambivalent' = 'Ambivalent';
    if (proHits > contraHits) detected = 'Ja';
    else if (contraHits > proHits) detected = 'Nein';

    return {
      detected,
      isAmbiguous: ambigHits > 0,
      proHits,
      contraHits,
    };
  };

  // Quick 1-click toggle for letter answer
  const handleToggleAnswer = (letterId: string) => {
    const cloned = JSON.parse(JSON.stringify(exam)) as ExamModel;
    const lb = cloned.teil4.leserbriefe.find((l) => l.id === letterId);
    if (!lb) return;
    lb.correctAnswer = lb.correctAnswer === 'Ja' ? 'Nein' : 'Ja';
    onUpdateExam(cloned);
  };

  // Auto-balance to 4:3 ratio based on detected text sentiment
  const handleAutoBalanceRatio = () => {
    const cloned = JSON.parse(JSON.stringify(exam)) as ExamModel;
    // Set 4 Ja and 3 Nein prioritizing text sentiment
    const analyzed = cloned.teil4.leserbriefe.map((lb) => ({
      lb,
      analysis: analyzeLetterSentiment(lb.text),
    }));

    // Sort by pro inclination
    analyzed.sort((a, b) => b.analysis.proHits - a.analysis.proHits);

    // Top 4 get 'Ja', bottom 3 get 'Nein'
    analyzed.forEach((item, idx) => {
      item.lb.correctAnswer = idx < 4 ? 'Ja' : 'Nein';
    });

    onUpdateExam(cloned);
  };

  const jaPercent = Math.round((jaCount / total) * 100);
  const neinPercent = 100 - jaPercent;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{lang === 'en' ? 'Teil 4 Stance & Opinion Polarity Analyzer' : 'Teil 4 Meinungs-Polarität & Haltungs-Wächter'}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  isBalanced
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : isSlightlySkewed
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                }`}
              >
                {isBalanced
                  ? (lang === 'en' ? 'Optimal 4:3 Ratio' : 'Ausgewogen (4:3 / 3:4)')
                  : (lang === 'en' ? 'Skewed Distribution' : 'Ungleichgewicht')}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Target balance for 7 reader letters: 4 Ja vs. 3 Nein (or 3 vs. 4). Avoid one-sided key bias.'
                : 'Zielbalance für 7 Leserbriefe: 4 Ja vs. 3 Nein (oder 3 vs. 4). Einseitige Schlüssel (z.B. 6:1) vermeiden.'}
            </p>
          </div>
        </div>

        {/* 1-Click Auto-Balance Action */}
        <button
          onClick={handleAutoBalanceRatio}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer self-start sm:self-auto shrink-0"
          title="Verteile Ja/Nein automatisch auf 4:3 anhand des Textinhalts"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Auto-Balance 4:3' : '4:3 Polarität balancieren'}</span>
        </button>
      </div>

      {/* Visual Polarity Gauge Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? `YES: ${jaCount} of ${total} (${jaPercent}%)` : `JA: ${jaCount} von ${total} (${jaPercent}%)`}</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span>{lang === 'en' ? `NO: ${neinCount} of ${total} (${neinPercent}%)` : `NEIN: ${neinCount} von ${total} (${neinPercent}%)`}</span>
            <ThumbsDown className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Bi-color Progress Gauge */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${jaPercent}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={lang === 'en' ? `Yes: ${jaCount}` : `Ja: ${jaCount}`}
          />
          <div
            style={{ width: `${neinPercent}%` }}
            className="h-full bg-rose-500 transition-all duration-300"
            title={lang === 'en' ? `No: ${neinCount}` : `Nein: ${neinCount}`}
          />
        </div>
      </div>

      {/* 7 Reader Letters Stance Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2 pt-1">
        {letters.map((lb) => {
          const analysis = analyzeLetterSentiment(lb.text);
          const isKeyAligned = analysis.detected === lb.correctAnswer;

          return (
            <div
              key={lb.id}
              className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 text-xs transition-all ${
                lb.correctAnswer === 'Ja'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-rose-950/20 border-rose-500/40 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono font-bold text-[11px] mb-1">
                  <span className="text-amber-400">#{lb.number}</span>
                  <span className="truncate max-w-[65px] text-slate-400 font-normal" title={lb.author}>
                    {lb.author}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 line-clamp-2 italic" title={lb.text}>
                  &ldquo;{lb.text}&rdquo;
                </div>
              </div>

              {/* Status and 1-Click Toggle */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {analysis.isAmbiguous && (
                    <span
                      className="text-amber-400"
                      title={lang === 'en' ? 'Contains ambivalent connectors (on the one hand / on the other hand). Check for clear B1 stance.' : 'Enthält ambivalente Konnektoren (einerseits/andererseits). Auf eindeutige B1-Positionierung achten.'}
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-slate-400">
                    {lang === 'en' ? `Text: ${analysis.detected === 'Ja' ? 'Yes' : analysis.detected === 'Nein' ? 'No' : 'Ambig'}` : `Text: ${analysis.detected}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAnswer(lb.id)}
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] transition cursor-pointer shadow-sm ${
                    lb.correctAnswer === 'Ja'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                  title={lang === 'en' ? 'Click to toggle Yes ↔ No' : 'Klicken zum Umschalten Ja ↔ Nein'}
                >
                  {lang === 'en' ? (lb.correctAnswer === 'Ja' ? 'Yes' : 'No') : lb.correctAnswer}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
