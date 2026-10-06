import React, { useState } from 'react';
import { lintGermanText, B1LintReport, TEIL_WORD_TARGETS } from '../utils/b1Linter';
import { Language } from '../utils/i18n';
import {
  AlertCircle,
  CheckCircle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  text: string;
  targetType: keyof typeof TEIL_WORD_TARGETS;
  title?: string;
  lang?: Language;
}

export const B1LinterPanel: React.FC<Props> = ({
  text,
  targetType,
  title,
  lang = 'de',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const report: B1LintReport = lintGermanText(text, targetType);
  const isEn = lang === 'en';
  const isGreen = report.b1ComplianceScore >= 85 && report.wordCountStatus === 'optimal';

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden text-xs">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-800 flex items-center justify-between cursor-pointer select-none border-b border-slate-700/60"
      >
        <div className="flex items-center gap-2">
          <FileCheck2 className={`w-4 h-4 ${isGreen ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-bold text-slate-200">
            {title || (isEn ? 'CEFR B1 Vocabulary & Sentence Length Linter' : 'GER B1-Wortschatz- & Satzlängen-Prüfer')}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-700 text-slate-300">
            {report.totalWords} {isEn ? 'words' : 'Wörter'} ({report.targetWordRange[0]}–{report.targetWordRange[1]})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              report.b1ComplianceScore >= 85
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {report.b1ComplianceScore >= 85 ? (
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-400" />
            )}
            <span>{report.b1ComplianceScore}% B1-Score</span>
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 bg-slate-900/50">
          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 bg-slate-800/60 rounded border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {isEn ? 'Word Count' : 'Wortanzahl'}
              </span>
              <div className="font-mono text-xs font-bold text-white mt-0.5">
                {report.totalWords} / {report.targetWordRange[0]}–{report.targetWordRange[1]}
              </div>
              <span
                className={`text-[9px] font-bold ${
                  report.wordCountStatus === 'optimal'
                    ? 'text-emerald-400'
                    : report.wordCountStatus === 'too_short'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {report.wordCountStatus === 'optimal'
                  ? (isEn ? '✓ In target range' : '✓ Im Zielbereich')
                  : report.wordCountStatus === 'too_short'
                  ? (isEn ? '⚠ Too short' : '⚠ Zu kurz')
                  : (isEn ? '⚠ Too long' : '⚠ Zu lang')}
              </span>
            </div>

            <div className="p-2 bg-slate-800/60 rounded border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {isEn ? 'Avg Sentence Length' : 'Ø Satzlänge'}
              </span>
              <div className="font-mono text-xs font-bold text-white mt-0.5">
                {report.avgWordsPerSentence} {isEn ? 'words/sentence' : 'Wörter/Satz'}
              </div>
              <span className="text-[9px] text-slate-400">
                {report.avgWordsPerSentence <= 15
                  ? (isEn ? '✓ B1 compliant (≤15)' : '✓ B1-konform (≤15)')
                  : (isEn ? '⚠ Rather long (>15)' : '⚠ Eher lang (>15)')}
              </span>
            </div>

            <div className="p-2 bg-slate-800/60 rounded border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {isEn ? 'Long Sentences' : 'Lange Sätze'}
              </span>
              <div className="font-mono text-xs font-bold text-white mt-0.5">
                {report.longSentencesCount} &gt;15W / {report.alertSentencesCount} &gt;22W
              </div>
              <span className="text-[9px] text-slate-400">
                {report.alertSentencesCount === 0
                  ? (isEn ? '✓ No extreme sentences' : '✓ Keine Extrem-Sätze')
                  : (isEn ? '⚠ Shortening recommended' : '⚠ Kürzungsbedarf')}
              </span>
            </div>

            <div className="p-2 bg-slate-800/60 rounded border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {isEn ? 'B2/C1 Register' : 'B2/C1-Wortschatz'}
              </span>
              <div className="font-mono text-xs font-bold text-white mt-0.5">
                {report.flaggedWords.length} {isEn ? 'flagged words' : 'Wörter markiert'}
              </div>
              <span className="text-[9px] text-slate-400">
                {report.flaggedWords.length === 0
                  ? (isEn ? '✓ Pure B1 vocabulary' : '✓ Reines B1-Vokabular')
                  : (isEn ? '⚠ B2+ signal words' : '⚠ B2+ Signalwörter')}
              </span>
            </div>
          </div>

          {/* Flagged advanced words */}
          {report.flaggedWords.length > 0 && (
            <div className="p-2.5 bg-amber-950/30 border border-amber-600/30 rounded-lg space-y-1.5">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Higher / B2+ register vocabulary found (review or simplify):'
                    : 'Gehobenes / B2+ Vokabular gefunden (prüfen oder ersetzen):'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {report.flaggedWords.map((fw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-900/60 border border-amber-500/50 rounded text-[11px] text-amber-200"
                  >
                    <strong className="text-white underline">{fw.word}</strong>
                    <span className="text-[10px] text-amber-300 font-mono">({fw.reason})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Long sentences list */}
          {report.sentences.filter((s) => s.level !== 'ok').length > 0 && (
            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>
                  {isEn
                    ? 'Sentences exceeding B1 limit (>15 words):'
                    : 'Sätze über der B1-Empfehlung (>15 Wörter):'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {report.sentences.filter((s) => s.level !== 'ok').length} {isEn ? 'sentences' : 'Sätze'}
                </span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {report.sentences
                  .filter((s) => s.level !== 'ok')
                  .map((s, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded text-[10px] flex items-start gap-2 ${
                        s.level === 'alert'
                          ? 'bg-rose-950/40 border border-rose-600/30 text-rose-200'
                          : 'bg-amber-950/30 border border-amber-600/30 text-amber-200'
                      }`}
                    >
                      <span className="font-mono font-bold px-1 rounded bg-black/40 text-[9px] mt-0.5">
                        {s.wordCount}W
                      </span>
                      <span className="flex-1 leading-tight italic">„{s.text}“</span>
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
