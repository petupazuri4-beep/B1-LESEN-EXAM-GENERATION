import React from 'react';
import { ExamModel, Teil3Item, Advertisement } from '../../types/exam';
import { Language } from '../../utils/i18n';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wand2,
  Info,
  ShieldCheck,
  Hash,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  onUpdateExam: (updated: ExamModel) => void;
  lang?: Language;
}

export const Teil3MatchingMatrix: React.FC<Props> = ({
  exam,
  onUpdateExam,
  lang = 'de',
}) => {
  const { situations, advertisements } = exam.teil3;
  const adLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  // Current assignments
  const assignedLetters = situations.map((s) => s.correctAnswer.toLowerCase());
  const zeroMatches = situations.filter((s) => s.correctAnswer === '0');
  const zeroCount = zeroMatches.length;

  // Unused advertisements
  const unusedAds = advertisements.filter(
    (ad) => !assignedLetters.includes(ad.letter.toLowerCase())
  );
  const unusedCount = unusedAds.length;

  // Duplicate assigned ads
  const letterCounts: Record<string, number> = {};
  assignedLetters.forEach((l) => {
    if (l !== '0') {
      letterCounts[l] = (letterCounts[l] || 0) + 1;
    }
  });
  const duplicateLetters = Object.keys(letterCounts).filter((l) => letterCounts[l] > 1);

  // Official Goethe B1 Rules:
  // 1. Exactly one situation has "0"
  // 2. Exactly one advertisement is unused (10 ads - 6 mapped situations - 1 zero = 1 unused ad)
  // 3. No duplicate advertisements across situations
  const isZeroRuleValid = zeroCount === 1;
  const isUnusedRuleValid = unusedCount === 1;
  const hasNoDuplicates = duplicateLetters.length === 0;
  const isFullyCompliant = isZeroRuleValid && isUnusedRuleValid && hasNoDuplicates;

  // Assign an ad or '0' to a situation
  const handleAssign = (situationNumber: number, targetAnswer: string) => {
    const cloned = JSON.parse(JSON.stringify(exam)) as ExamModel;
    const sit = cloned.teil3.situations.find((s) => s.number === situationNumber);
    if (!sit) return;

    sit.correctAnswer = targetAnswer;

    // Recalculate unusedAdLetter
    const newAssigned = cloned.teil3.situations.map((s) => s.correctAnswer.toLowerCase());
    const remainingUnused = adLetters.find((l) => !newAssigned.includes(l)) || 'j';
    cloned.teil3.unusedAdLetter = remainingUnused;

    onUpdateExam(cloned);
  };

  // 1-Click Auto-Fix to ensure official Goethe rules
  const handleAutoBalance = () => {
    const cloned = JSON.parse(JSON.stringify(exam)) as ExamModel;
    // Choose one situation to be '0' (keep existing if valid, otherwise pick situation 16)
    let zeroSitIndex = cloned.teil3.situations.findIndex((s) => s.correctAnswer === '0');
    if (zeroSitIndex < 0) zeroSitIndex = 3; // index 3 is situation 16

    // Distribute available ad letters to the other 6 situations uniquely
    const availableLetters = [...adLetters];
    // Keep 1 ad letter unused (e.g. ad 'j' or last one)
    const unusedLetter = 'j';
    const lettersToAssign = availableLetters.filter((l) => l !== unusedLetter);

    let assignIdx = 0;
    cloned.teil3.situations.forEach((sit, idx) => {
      if (idx === zeroSitIndex) {
        sit.correctAnswer = '0';
      } else {
        sit.correctAnswer = lettersToAssign[assignIdx] || 'a';
        assignIdx++;
      }
    });

    cloned.teil3.unusedAdLetter = unusedLetter;
    onUpdateExam(cloned);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{lang === 'en' ? 'Teil 3 Matching Matrix & Zero Guard' : 'Teil 3 Zuordnungs-Matrix & Null-Wächter'}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  isFullyCompliant
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                }`}
              >
                {isFullyCompliant
                  ? (lang === 'en' ? 'Goethe B1 Standard' : '100% Goethe-Standard')
                  : (lang === 'en' ? 'Rule Violations' : 'Regelkonflikte')}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Official B1 Rule: Exactly 1 situation with "0" (no match) and exactly 1 unused advertisement.'
                : 'Offizielle B1-Prüfung: Exakt 1 Situation mit „0“ (keine Anzeige) und exakt 1 unbenutzte Anzeige.'}
            </p>
          </div>
        </div>

        {/* 1-Click Auto Balance Action */}
        <button
          onClick={handleAutoBalance}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer self-start sm:self-auto shrink-0"
          title="Automatisch 1x Null-Zuordnung und 1x freie Anzeige regelkonform balancieren"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Auto-Balance Matrix' : 'Matrix regelkonform balancieren'}</span>
        </button>
      </div>

      {/* Real-time Diagnostics Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            isZeroRuleValid
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {isZeroRuleValid ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
          <div>
            <div className="font-bold">{lang === 'en' ? 'Zero-Match Situation ("0"):' : 'Null-Treffer-Situation ("0"): '}</div>
            <div className="text-[11px] opacity-90">
              {zeroCount === 1
                ? (lang === 'en' ? `Task #${zeroMatches[0].number} has no matching advertisement` : `Aufgabe #${zeroMatches[0].number} hat keine passende Anzeige`)
                : (lang === 'en' ? `${zeroCount} situations with "0" (Exactly 1 required!)` : `${zeroCount} Situationen mit "0" (Exakt 1 erforderlich!)`)}
            </div>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            isUnusedRuleValid
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {isUnusedRuleValid ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
          <div>
            <div className="font-bold">{lang === 'en' ? 'Unused Advertisement:' : 'Freie / Ungenutzte Anzeige:'}</div>
            <div className="text-[11px] opacity-90">
              {unusedCount === 1
                ? (lang === 'en' ? `Ad [${unusedAds[0]?.letter?.toUpperCase()}] is unused (spare)` : `Anzeige [${unusedAds[0]?.letter?.toUpperCase()}] ist ungenutzt`)
                : (lang === 'en' ? `${unusedCount} unused ads (Exactly 1 required!)` : `${unusedCount} ungenutzte Anzeigen (Exakt 1 erforderlich!)`)}
            </div>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            hasNoDuplicates
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {hasNoDuplicates ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
          <div>
            <div className="font-bold">{lang === 'en' ? 'Conflict Check:' : 'Doppelbelegung:'}</div>
            <div className="text-[11px] opacity-90">
              {hasNoDuplicates
                ? (lang === 'en' ? 'No duplicate assignments' : 'Keine Doppelzuordnungen')
                : (lang === 'en' ? `Conflict on ad(s): ${duplicateLetters.map((l) => l.toUpperCase()).join(', ')}` : `Konflikt bei Anzeige(n): ${duplicateLetters.map((l) => l.toUpperCase()).join(', ')}`)}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 7 x 11 Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/70">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-800/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2.5 px-3 min-w-[130px] font-bold text-white">
                {lang === 'en' ? 'Situation (13–19)' : 'Situation (13–19)'}
              </th>
              {adLetters.map((l) => {
                const isUnused = unusedAds.some((ad) => ad.letter.toLowerCase() === l);
                return (
                  <th
                    key={l}
                    className={`py-2.5 px-2 text-center min-w-[38px] font-bold ${
                      isUnused ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' : 'text-slate-300'
                    }`}
                    title={lang === 'en' ? `Ad ${l.toUpperCase()}${isUnused ? ' (Free / Unused)' : ''}` : `Anzeige ${l.toUpperCase()}${isUnused ? ' (Frei / Ungenutzt)' : ''}`}
                  >
                    <span>{l.toUpperCase()}</span>
                    {isUnused && <div className="text-[8px] text-amber-400 font-normal">{lang === 'en' ? 'free' : 'frei'}</div>}
                  </th>
                );
              })}
              <th
                className={`py-2.5 px-3 text-center min-w-[50px] font-bold ${
                  isZeroRuleValid ? 'bg-orange-500/20 text-orange-300' : 'bg-rose-500/20 text-rose-400'
                }`}
                title={lang === 'en' ? 'No matching ad (Answer "0")' : 'Keine passende Anzeige (Antwort \'0\')'}
              >
                0 <span className="text-[8px] block font-normal">{lang === 'en' ? '(none)' : '(keine)'}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {situations.map((sit) => {
              const currentAns = sit.correctAnswer.toLowerCase();

              return (
                <tr key={sit.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-amber-400">#{sit.number}</span>
                      <span className="truncate max-w-[200px] text-slate-200" title={sit.situation}>
                        {sit.situation}
                      </span>
                    </div>
                  </td>

                  {/* Ad Option Cells A-J */}
                  {adLetters.map((l) => {
                    const isChecked = currentAns === l;
                    const isDuplicate = isChecked && letterCounts[l] > 1;

                    return (
                      <td key={l} className="py-1.5 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleAssign(sit.number, l)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center mx-auto ${
                            isChecked
                              ? isDuplicate
                                ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400 scale-105'
                                : 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-105'
                              : 'bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title={lang === 'en' ? `Assign Ad ${l.toUpperCase()} to Task ${sit.number}` : `Weise Anzeige ${l.toUpperCase()} der Aufgabe ${sit.number} zu`}
                        >
                          {l.toUpperCase()}
                        </button>
                      </td>
                    );
                  })}

                  {/* Option "0" (No Match) */}
                  <td className="py-1.5 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleAssign(sit.number, '0')}
                      className={`w-8 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center mx-auto ${
                        currentAns === '0'
                          ? 'bg-orange-600 text-white shadow-lg ring-2 ring-orange-400 scale-105'
                          : 'bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={lang === 'en' ? `No matching ad for Task ${sit.number} ("0")` : `Keine passende Anzeige für Aufgabe ${sit.number} ("0")`}
                    >
                      0
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Box */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {lang === 'en'
              ? 'Clicking a cell instantly reassigns the correct key and automatically updates the candidate answer sheet.'
              : 'Ein Klick auf ein Feld setzt die Lösungszuordnung und synchronisiert sofort den Antwortbogen S30.'}
          </span>
        </div>
        <div className="font-mono text-slate-500">
          Unused: <strong className="text-amber-400">{exam.teil3.unusedAdLetter?.toUpperCase()}</strong>
        </div>
      </div>
    </div>
  );
};
