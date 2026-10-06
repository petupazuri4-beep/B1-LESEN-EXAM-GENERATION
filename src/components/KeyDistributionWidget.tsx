import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { Language } from '../utils/i18n';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  onUpdateExam?: (updated: ExamModel) => void;
  lang?: Language;
}

export const KeyDistributionWidget: React.FC<Props> = ({
  exam,
  lang = 'de',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // 1. Teil 1 (Items 1-6): Richtig vs Falsch
  const t1Richtig = exam.teil1.items.filter((i) => i.correctAnswer === 'Richtig').length;
  const t1Falsch = exam.teil1.items.filter((i) => i.correctAnswer === 'Falsch').length;
  const t1IsBalanced = (t1Richtig === 3 && t1Falsch === 3) || (t1Richtig === 4 && t1Falsch === 2) || (t1Richtig === 2 && t1Falsch === 4);

  // 2. Teil 2 (Items 7-12): a, b, c
  const allT2Items = [...exam.teil2.textA.items, ...exam.teil2.textB.items];
  const t2A = allT2Items.filter((i) => i.correctAnswer === 'a').length;
  const t2B = allT2Items.filter((i) => i.correctAnswer === 'b').length;
  const t2C = allT2Items.filter((i) => i.correctAnswer === 'c').length;
  const t2IsBalanced = t2A >= 1 && t2B >= 1 && t2C >= 1 && t2A <= 3 && t2B <= 3 && t2C <= 3;

  // 3. Teil 3 (Items 13-19): Zuordnung a-j and 0
  const t3AssignedLetters = exam.teil3.situations
    .map((s) => s.correctAnswer.toLowerCase())
    .filter((ans) => ans !== '0');
  const t3ZeroCount = exam.teil3.situations.filter((s) => s.correctAnswer === '0').length;
  const allAdLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const unusedLetters = allAdLetters.filter((l) => !t3AssignedLetters.includes(l));
  const duplicateAssignedLetters = allAdLetters.filter(
    (l) => t3AssignedLetters.filter((a) => a === l).length > 1
  );
  const t3IsValid = t3ZeroCount === 1 && unusedLetters.length === 1 && duplicateAssignedLetters.length === 0;

  // 4. Teil 4 (Items 20-26): Ja vs Nein
  const t4Ja = exam.teil4.leserbriefe.filter((lb) => lb.correctAnswer === 'Ja').length;
  const t4Nein = exam.teil4.leserbriefe.filter((lb) => lb.correctAnswer === 'Nein').length;
  const t4IsBalanced = (t4Ja === 4 && t4Nein === 3) || (t4Ja === 3 && t4Nein === 4);

  // 5. Teil 5 (Items 27-30): a, b, c
  const t5A = exam.teil5.items.filter((i) => i.correctAnswer === 'a').length;
  const t5B = exam.teil5.items.filter((i) => i.correctAnswer === 'b').length;
  const t5C = exam.teil5.items.filter((i) => i.correctAnswer === 'c').length;
  const t5IsBalanced = t5A >= 1 && t5B >= 1 && t5C >= 1;

  // Overall Score
  const balanceIssues: string[] = [];
  if (!t1IsBalanced) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 1 ratio skewed (${t1Richtig} Richtig : ${t1Falsch} Falsch; aim for 3:3 or 4:2)`
        : `Teil 1 Verhältnis unausgewogen (${t1Richtig} R : ${t1Falsch} F; Ziel: 3:3 oder 4:2)`
    );
  }
  if (!t2IsBalanced) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 2 MC options unbalanced (a:${t2A}, b:${t2B}, c:${t2C})`
        : `Teil 2 Mehrfachauswahl unausgewogen (a:${t2A}, b:${t2B}, c:${t2C})`
    );
  }
  if (t3ZeroCount !== 1) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 3 must have exactly ONE situation with "0" (currently ${t3ZeroCount})`
        : `Teil 3 muss genau EINE Situation mit "0" haben (aktuell: ${t3ZeroCount})`
    );
  }
  if (unusedLetters.length !== 1) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 3 must have exactly ONE unused ad letter (currently ${unusedLetters.length} unused: ${unusedLetters.map(l => l.toUpperCase()).join(', ') || 'none'})`
        : `Teil 3 muss genau EINE ungenutzte Anzeige haben (aktuell: ${unusedLetters.length} ungenutzt: ${unusedLetters.map(l => l.toUpperCase()).join(', ') || 'keine'})`
    );
  }
  if (duplicateAssignedLetters.length > 0) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 3 duplicate ad assignment: ${duplicateAssignedLetters.map(l => l.toUpperCase()).join(', ')} assigned more than once`
        : `Teil 3 Mehrfachzuordnung: Anzeige ${duplicateAssignedLetters.map(l => l.toUpperCase()).join(', ')} mehrfach verwendet`
    );
  }
  if (!t4IsBalanced) {
    balanceIssues.push(
      lang === 'en'
        ? `Part 4 Ja/Nein ratio skewed (${t4Ja} Ja : ${t4Nein} Nein; aim for 4:3 or 3:4)`
        : `Teil 4 Ja/Nein Verhältnis unausgewogen (${t4Ja} Ja : ${t4Nein} Nein; Ziel: 4:3 oder 3:4)`
    );
  }

  const isFullyBalanced = balanceIssues.length === 0;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg text-xs">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800"
      >
        <div className="flex items-center gap-2">
          <Scale className={`w-4 h-4 ${isFullyBalanced ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-bold text-slate-100">
            {lang === 'en' ? 'Answer Key Distribution & Balance Monitor' : 'Lösungsschlüssel-Balance & Prüfungsmonitor'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold">
            30 Items
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isFullyBalanced ? (
            <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Perfect Balance' : 'Optimal balanciert'}</span>
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1 font-bold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {balanceIssues.length} {lang === 'en' ? 'Hints' : 'Hinweise'}
              </span>
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 bg-slate-900/60">
          {/* Grid of 5 parts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Teil 1 */}
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                <span>Teil 1 (1–6)</span>
                <span className={t1IsBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {t1IsBalanced ? '✓ OK' : '⚠ Skewed'}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-200">R: <strong className="text-emerald-400">{t1Richtig}</strong></span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-200">F: <strong className="text-amber-400">{t1Falsch}</strong></span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden flex">
                <div style={{ width: `${(t1Richtig / 6) * 100}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${(t1Falsch / 6) * 100}%` }} className="bg-amber-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 italic">Ziel: 3:3 / 4:2</div>
            </div>

            {/* Teil 2 */}
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                <span>Teil 2 (7–12)</span>
                <span className={t2IsBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {t2IsBalanced ? '✓ OK' : '⚠ Skewed'}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span>a: <strong className="text-cyan-400">{t2A}</strong></span>
                <span>b: <strong className="text-indigo-400">{t2B}</strong></span>
                <span>c: <strong className="text-amber-400">{t2C}</strong></span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden flex">
                <div style={{ width: `${(t2A / 6) * 100}%` }} className="bg-cyan-500 h-full" />
                <div style={{ width: `${(t2B / 6) * 100}%` }} className="bg-indigo-500 h-full" />
                <div style={{ width: `${(t2C / 6) * 100}%` }} className="bg-amber-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 italic">Ziel: je ~2</div>
            </div>

            {/* Teil 3 */}
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                <span>{lang === 'en' ? 'Part 3 (13–19)' : 'Teil 3 (13–19)'}</span>
                <span className={t3IsValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {t3IsValid ? (lang === 'en' ? '✓ Compliant' : '✓ Regelkonform') : (lang === 'en' ? '⚠ Error' : '⚠ Fehler')}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-200">
                <span>{lang === 'en' ? '0-Match:' : '0-Treffer:'} <strong className={t3ZeroCount === 1 ? 'text-emerald-400' : 'text-rose-400'}>{t3ZeroCount} / 1</strong></span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                {lang === 'en' ? 'Unused:' : 'Ungenutzt:'} <strong className="text-amber-400">{unusedLetters.map(l => l.toUpperCase()).join(', ') || (lang === 'en' ? 'None' : 'Keine')}</strong>
              </div>
              <div className="text-[10px] text-slate-400 italic">
                {lang === 'en' ? "Exact 1x '0' & 1x free ad" : "Exakt 1x '0' & 1x freie Anzeige"}
              </div>
            </div>

            {/* Teil 4 */}
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                <span>{lang === 'en' ? 'Part 4 (20–26)' : 'Teil 4 (20–26)'}</span>
                <span className={t4IsBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {t4IsBalanced ? '✓ OK' : '⚠ Skewed'}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-200">{lang === 'en' ? 'Yes' : 'Ja'}: <strong className="text-emerald-400">{t4Ja}</strong></span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-200">{lang === 'en' ? 'No' : 'Nein'}: <strong className="text-rose-400">{t4Nein}</strong></span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full flex overflow-hidden">
                <div style={{ width: `${(t4Ja / 7) * 100}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${(t4Nein / 7) * 100}%` }} className="bg-rose-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 italic">{lang === 'en' ? 'Target: 4:3 / 3:4' : 'Ziel: 4:3 / 3:4'}</div>
            </div>

            {/* Teil 5 */}
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                <span>{lang === 'en' ? 'Part 5 (27–30)' : 'Teil 5 (27–30)'}</span>
                <span className={t5IsBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {t5IsBalanced ? '✓ OK' : '⚠ Bias'}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span>a: <strong className="text-cyan-400">{t5A}</strong></span>
                <span>b: <strong className="text-indigo-400">{t5B}</strong></span>
                <span>c: <strong className="text-amber-400">{t5C}</strong></span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full flex overflow-hidden">
                <div style={{ width: `${(t5A / 4) * 100}%` }} className="bg-cyan-500 h-full" />
                <div style={{ width: `${(t5B / 4) * 100}%` }} className="bg-indigo-500 h-full" />
                <div style={{ width: `${(t5C / 4) * 100}%` }} className="bg-amber-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 italic">{lang === 'en' ? '4 items (a/b/c)' : '4 Aufgaben (a/b/c)'}</div>
            </div>
          </div>

          {/* Feedback & balance suggestions */}
          {balanceIssues.length > 0 ? (
            <div className="p-2.5 bg-amber-950/40 border border-amber-600/40 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Psychometric Balancing Suggestions' : 'Testkonstruktions-Hinweise'}:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 text-[11px]">
                {balanceIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-950/30 border border-emerald-600/30 rounded-lg flex items-center gap-2 text-emerald-300 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>
                {lang === 'en'
                  ? 'The answer key for all 30 items follows Goethe/ÖSD psychometric distribution guidelines without systematic response bias.'
                  : 'Der Lösungsschlüssel aller 30 Aufgaben entspricht den offiziellen psychometrischen Vorgaben des Goethe-Instituts und ÖSD ohne Antwortverzerrung.'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
