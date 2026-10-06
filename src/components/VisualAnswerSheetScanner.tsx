import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { OFFICIAL_B1_CONVERSION_TABLE, convertRawToScaledScore, isPassingScore } from '../utils/scoreConversion';
import { Language, translations } from '../utils/i18n';
import {
  CheckCircle2,
  XCircle,
  Scan,
  RefreshCw,
  Award,
  AlertTriangle,
  FileCheck2,
  Printer,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const VisualAnswerSheetScanner: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const t = translations[lang];

  // User input state: key is item number (1 to 30), value is the string answer
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [candidateName, setCandidateName] = useState('Anna Schmidt');
  const [scanned, setScanned] = useState(false);

  // Extract official answer keys from exam
  const officialKey: Record<number, string> = {};
  exam.teil1.items.forEach(i => (officialKey[i.number] = i.correctAnswer));
  exam.teil2.textA.items.forEach(i => (officialKey[i.number] = i.correctAnswer));
  exam.teil2.textB.items.forEach(i => (officialKey[i.number] = i.correctAnswer));
  exam.teil3.situations.forEach(i => (officialKey[i.number] = i.correctAnswer.toLowerCase()));
  exam.teil4.leserbriefe.forEach(i => (officialKey[i.number] = i.correctAnswer));
  exam.teil5.items.forEach(i => (officialKey[i.number] = i.correctAnswer));

  const handleSelectAnswer = (itemNum: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [itemNum]: prev[itemNum] === value ? '' : value,
    }));
  };

  const handleClear = () => {
    setAnswers({});
    setScanned(false);
  };

  // Demo presets for test simulation
  const loadPreset = (type: 'high' | 'pass' | 'fail') => {
    const newAnswers: Record<number, string> = {};

    for (let num = 1; num <= 30; num++) {
      const correct = officialKey[num];
      if (type === 'high') {
        // 27 correct, 3 wrong
        if (num === 4 || num === 11 || num === 22) {
          newAnswers[num] = getWrongAnswer(num, correct);
        } else {
          newAnswers[num] = correct;
        }
      } else if (type === 'pass') {
        // 19 correct (Pass: 19/30 -> 63/100)
        if ([2, 5, 8, 10, 13, 16, 21, 23, 27, 29, 30].includes(num)) {
          newAnswers[num] = getWrongAnswer(num, correct);
        } else {
          newAnswers[num] = correct;
        }
      } else {
        // 15 correct (Fail: 15/30 -> 50/100)
        if (num % 2 === 0) {
          newAnswers[num] = getWrongAnswer(num, correct);
        } else {
          newAnswers[num] = correct;
        }
      }
    }

    setAnswers(newAnswers);
    setScanned(true);
    if (type === 'high') setCandidateName('Lukas Weber (27/30 • Sehr gut)');
    if (type === 'pass') setCandidateName('Elena Petrova (19/30 • Bestanden)');
    if (type === 'fail') setCandidateName('Markus Bauer (15/30 • Nicht bestanden)');
  };

  function getWrongAnswer(num: number, correct: string): string {
    if (num <= 6) return correct === 'Richtig' ? 'Falsch' : 'Richtig';
    if ((num >= 7 && num <= 12) || num >= 27) {
      const opts = ['a', 'b', 'c'];
      return opts.find(o => o !== correct) || 'a';
    }
    if (num >= 13 && num <= 19) {
      const ads = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'];
      return ads.find(a => a !== correct.toLowerCase()) || 'a';
    }
    if (num >= 20 && num <= 26) {
      return correct === 'Ja' ? 'Nein' : 'Ja';
    }
    return 'a';
  }

  // Calculate score
  let rawScore = 0;
  let teil1Score = 0;
  let teil2Score = 0;
  let teil3Score = 0;
  let teil4Score = 0;
  let teil5Score = 0;

  for (let i = 1; i <= 30; i++) {
    const isCorrect = (answers[i] || '').toLowerCase() === (officialKey[i] || '').toLowerCase();
    if (isCorrect) {
      rawScore++;
      if (i <= 6) teil1Score++;
      else if (i <= 12) teil2Score++;
      else if (i <= 19) teil3Score++;
      else if (i <= 26) teil4Score++;
      else teil5Score++;
    }
  }

  const scaledScore = convertRawToScaledScore(rawScore);
  const passed = isPassingScore(rawScore);

  return (
    <div className="max-w-5xl mx-auto my-6 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl mb-6 shadow-lg border border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Scan className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold">
              {lang === 'en' ? 'Optical Answer Sheet Scanner & Auto-Grader' : 'Optischer Antwortbogen-Scanner & Schnellkorrektur'}
            </h1>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            {lang === 'en'
              ? 'Click to bubble candidate answers or load a simulated student test. Instant comparison with official Goethe/ÖSD answer key, scaled score (0-100), and diagnostic report.'
              : 'Tragen Sie die Kandidatenantworten per Klick ein oder laden Sie eine Test-Simulation. Sofortiger Abgleich mit dem offiziellen Lösungsschlüssel, Umrechnung in die 100-Punkte-Skala und Bestehensprüfung.'}
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">{lang === 'en' ? 'Presets:' : 'Demo-Profile:'}</span>
          <button
            onClick={() => loadPreset('high')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium transition"
          >
            27/30 (Sehr gut)
          </button>
          <button
            onClick={() => loadPreset('pass')}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-700/80 hover:bg-amber-600 text-white font-medium transition"
          >
            19/30 (Bestanden)
          </button>
          <button
            onClick={() => loadPreset('fail')}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-700/80 hover:bg-rose-600 text-white font-medium transition"
          >
            15/30 (Defizit)
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            title="Zurücksetzen"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Diagnostic Summary Card */}
      <div className={`p-5 rounded-2xl mb-6 border shadow-sm transition-all ${
        passed
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
              passed ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider opacity-75">
                {lang === 'en' ? 'Evaluation Result' : 'Korrekturergebnis Modul LESEN'}
              </div>
              <div className="text-2xl font-black flex items-center gap-3">
                <span>{candidateName}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                  passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                }`}>
                  {passed
                    ? (lang === 'en' ? 'PASSED (Bestanden)' : 'BESTANDEN')
                    : (lang === 'en' ? 'FAILED (Nicht bestanden)' : 'NICHT BESTANDEN')}
                </span>
              </div>
              <div className="text-xs mt-0.5 opacity-80">
                {lang === 'en'
                  ? `Pass threshold: 60/100 points (minimum 18 of 30 items).`
                  : `Bestehensgrenze: 60 von 100 Punkten (mindestens 18 von 30 Aufgaben).`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase opacity-75">{lang === 'en' ? 'Raw Score' : 'Rohpunkte'}</div>
              <div className="text-2xl font-black font-mono">
                {rawScore} <span className="text-sm font-normal opacity-70">/ 30</span>
              </div>
            </div>
            <div className="w-px h-10 bg-black/15"></div>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase opacity-75">{lang === 'en' ? 'Scaled Score' : 'B1-Skala (100)'}</div>
              <div className={`text-3xl font-black font-mono ${passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {scaledScore} <span className="text-sm font-normal opacity-70">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown by Teil */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-black/10 text-xs">
          <div className="bg-white/70 p-2 rounded border border-black/10">
            <span className="font-bold block">Teil 1 (R/F)</span>
            <span className="font-mono text-sm font-bold">{teil1Score} / 6</span>
            <span className="text-[10px] block opacity-70">Korrespondenz</span>
          </div>
          <div className="bg-white/70 p-2 rounded border border-black/10">
            <span className="font-bold block">Teil 2 (a/b/c)</span>
            <span className="font-mono text-sm font-bold">{teil2Score} / 6</span>
            <span className="text-[10px] block opacity-70">Pressetexte</span>
          </div>
          <div className="bg-white/70 p-2 rounded border border-black/10">
            <span className="font-bold block">Teil 3 (A–J)</span>
            <span className="font-mono text-sm font-bold">{teil3Score} / 7</span>
            <span className="text-[10px] block opacity-70">Anzeigen-Matching</span>
          </div>
          <div className="bg-white/70 p-2 rounded border border-black/10">
            <span className="font-bold block">Teil 4 (Ja/Nein)</span>
            <span className="font-mono text-sm font-bold">{teil4Score} / 7</span>
            <span className="text-[10px] block opacity-70">Lesermeinungen</span>
          </div>
          <div className="bg-white/70 p-2 rounded border border-black/10">
            <span className="font-bold block">Teil 5 (a/b/c)</span>
            <span className="font-mono text-sm font-bold">{teil5Score} / 4</span>
            <span className="text-[10px] block opacity-70">Regelwerk</span>
          </div>
        </div>
      </div>

      {/* Interactive Optical Bubble Sheet Grid */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {lang === 'en' ? 'Interactive Scan Grid (Aufgaben 1–30)' : 'Interaktives Scan-Raster (Aufgaben 1–30)'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en'
                ? 'Click circles to fill or toggle student answers.'
                : 'Klicken Sie auf die Blasen, um Antworten der Teilnehmenden zu setzen.'}
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Correct' : 'Richtig'}
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-700">
              <XCircle className="w-4 h-4" /> {lang === 'en' ? 'Incorrect' : 'Falsch'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COLUMN 1: Teil 1 & Teil 2 & Teil 5 */}
          <div className="space-y-6">
            {/* Teil 1 */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-700 mb-2">
                Teil 1: Richtig / Falsch (Aufgaben 1–6)
              </div>
              <div className="space-y-1.5">
                {exam.teil1.items.map(item => {
                  const userVal = answers[item.number] || '';
                  const correctVal = officialKey[item.number];
                  const hasAnswered = Boolean(userVal);
                  const isCorrect = userVal === correctVal;

                  return (
                    <div key={item.number} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-6">#{item.number}</span>
                        {hasAnswered && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {(['Richtig', 'Falsch'] as const).map(opt => {
                          const isSelected = userVal === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(item.number, opt)}
                              className={`px-3 py-1 rounded border font-medium cursor-pointer transition ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                                    : 'bg-rose-600 text-white border-rose-700 font-bold'
                                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 2 */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-700 mb-2">
                Teil 2: Dreifachauswahl a / b / c (Aufgaben 7–12)
              </div>
              <div className="space-y-1.5">
                {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map(item => {
                  const userVal = answers[item.number] || '';
                  const correctVal = officialKey[item.number];
                  const hasAnswered = Boolean(userVal);
                  const isCorrect = userVal === correctVal;

                  return (
                    <div key={item.number} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-6">#{item.number}</span>
                        {hasAnswered && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        {(['a', 'b', 'c'] as const).map(opt => {
                          const isSelected = userVal === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(item.number, opt)}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold cursor-pointer transition ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                    : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 5 */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-700 mb-2">
                Teil 5: Regelwerk a / b / c (Aufgaben 27–30)
              </div>
              <div className="space-y-1.5">
                {exam.teil5.items.map(item => {
                  const userVal = answers[item.number] || '';
                  const correctVal = officialKey[item.number];
                  const hasAnswered = Boolean(userVal);
                  const isCorrect = userVal === correctVal;

                  return (
                    <div key={item.number} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-6">#{item.number}</span>
                        {hasAnswered && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        {(['a', 'b', 'c'] as const).map(opt => {
                          const isSelected = userVal === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(item.number, opt)}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold cursor-pointer transition ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                    : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Teil 3 & Teil 4 */}
          <div className="space-y-6">
            {/* Teil 3 */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-700 mb-2">
                Teil 3: Anzeigen A–J oder 0 (Aufgaben 13–19)
              </div>
              <div className="space-y-2">
                {exam.teil3.situations.map(item => {
                  const userVal = (answers[item.number] || '').toLowerCase();
                  const correctVal = officialKey[item.number].toLowerCase();
                  const hasAnswered = Boolean(userVal);
                  const isCorrect = userVal === correctVal;

                  return (
                    <div key={item.number} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">#{item.number}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{item.situation}</span>
                        </div>
                        {hasAnswered && (
                          isCorrect ? <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> +1</span> : <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px]"><XCircle className="w-3.5 h-3.5" /> 0 (Lösung: {correctVal.toUpperCase()})</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 font-mono">
                        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map(ltr => {
                          const isSelected = userVal === ltr;
                          return (
                            <button
                              key={ltr}
                              onClick={() => handleSelectAnswer(item.number, ltr)}
                              className={`w-6 h-6 rounded text-[11px] uppercase font-bold border cursor-pointer transition ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : 'bg-rose-600 text-white border-rose-700'
                                  : 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                              }`}
                            >
                              {ltr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 4 */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-700 mb-2">
                Teil 4: Ja / Nein (Aufgaben 20–26)
              </div>
              <div className="space-y-1.5">
                {exam.teil4.leserbriefe.map(item => {
                  const userVal = answers[item.number] || '';
                  const correctVal = officialKey[item.number];
                  const hasAnswered = Boolean(userVal);
                  const isCorrect = userVal === correctVal;

                  return (
                    <div key={item.number} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-6">#{item.number}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{item.author} ({item.city})</span>
                        {hasAnswered && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {(['Ja', 'Nein'] as const).map(opt => {
                          const isSelected = userVal === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(item.number, opt)}
                              className={`px-3 py-1 rounded border font-medium cursor-pointer transition ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                                    : 'bg-rose-600 text-white border-rose-700 font-bold'
                                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
