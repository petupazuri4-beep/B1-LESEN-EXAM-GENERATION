import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import { Printer, CheckCircle2, Eye, EyeOff, FileText, Download } from 'lucide-react';
import { OFFICIAL_B1_CONVERSION_TABLE } from '../utils/scoreConversion';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const AnswerSheetPaper: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const t = translations[lang];
  const [showSolutions, setShowSolutions] = useState(false);
  const [candidateName, setCandidateName] = useState('Mustermann');
  const [candidateFirstName, setCandidateFirstName] = useState('Max');
  const [birthDate, setBirthDate] = useState('15.04.1996');
  const [examId, setExamId] = useState('DE-812049');

  const handlePrint = () => {
    window.print();
  };

  // Convert answers for quick lookup
  const teil1Answers = exam.teil1.items.map(i => ({ num: i.number, ans: i.correctAnswer }));
  const teil2Answers = [
    ...exam.teil2.textA.items.map(i => ({ num: i.number, ans: i.correctAnswer })),
    ...exam.teil2.textB.items.map(i => ({ num: i.number, ans: i.correctAnswer })),
  ];
  const teil3Answers = exam.teil3.situations.map(i => ({ num: i.number, ans: i.correctAnswer }));
  const teil4Answers = exam.teil4.leserbriefe.map(i => ({ num: i.number, ans: i.correctAnswer }));
  const teil5Answers = exam.teil5.items.map(i => ({ num: i.number, ans: i.correctAnswer }));

  return (
    <div className="max-w-4xl mx-auto my-6 px-2 sm:px-4">
      {/* Control Toolbar */}
      <div className="no-print bg-slate-800 text-slate-100 p-4 rounded-xl mb-6 shadow flex flex-wrap items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center font-black text-lg">
            S30
          </div>
          <div>
            <h2 className="font-bold text-base flex items-center gap-2">
              <span>{lang === 'en' ? 'Official Answer Sheet (Antwortbogen S30)' : 'Offizieller Antwortbogen (S30)'}</span>
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-mono border border-orange-500/30">
                Goethe / ÖSD B1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Print-ready A4 candidate answer sheet for Modul LESEN'
                : 'Druckfertiger A4-Antwortbogen für Prüfungsteilnehmer Modul LESEN'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showSolutions
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
            }`}
          >
            {showSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSolutions
              ? (lang === 'en' ? 'Hide Solution Key' : 'Musterlösung ausblenden')
              : (lang === 'en' ? 'Show Solution Key' : 'Musterlösung einblenden')}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Print Sheet (A4)' : 'Antwortbogen drucken'}
          </button>
        </div>
      </div>

      {/* Sheet Container (A4 Printable Area) */}
      <div className="bg-white text-slate-900 border border-slate-300 shadow-xl rounded-sm p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0 print:m-0 relative">
        {/* OMR Alignment Fiducial Anchors (Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
        <div className="hidden print:block absolute top-2 left-2 w-3.5 h-3.5 bg-black" aria-hidden="true" />
        <div className="hidden print:block absolute top-2 right-2 w-3.5 h-3.5 bg-black" aria-hidden="true" />
        <div className="hidden print:block absolute bottom-2 left-2 w-3.5 h-3.5 bg-black" aria-hidden="true" />
        <div className="hidden print:block absolute bottom-2 right-2 w-3.5 h-3.5 bg-black" aria-hidden="true" />
        {/* Top Header */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black">
                Zertifikat B1 • Modul LESEN
              </div>
              <div className="text-sm font-bold uppercase text-slate-700 tracking-wide mt-0.5">
                Antwortbogen S30 • Prüfungsteilnehmende
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Goethe-Institut & ÖSD Prüfungsstandard • Gesamtdauer: 65 Minuten
              </div>
            </div>

            <div className="text-right border-2 border-black p-2 rounded">
              <div className="text-[10px] uppercase font-bold text-slate-500">Prüfungssatz</div>
              <div className="text-lg font-black font-mono">#{String(exam.examNumber).padStart(2, '0')}</div>
              <div className="text-[9px] text-slate-600 truncate max-w-[130px]">{exam.candidateInfo.centerCode || 'GI-B1-EXAM'}</div>
            </div>
          </div>

          {/* Candidate Form Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="border border-slate-400 p-2 rounded-sm bg-slate-50/50">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Familienname / Surname</span>
              <span className="font-semibold">{candidateName}</span>
            </div>
            <div className="border border-slate-400 p-2 rounded-sm bg-slate-50/50">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Vorname / First Name</span>
              <span className="font-semibold">{candidateFirstName}</span>
            </div>
            <div className="border border-slate-400 p-2 rounded-sm bg-slate-50/50">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Geburtsdatum / Birthdate</span>
              <span className="font-mono">{birthDate}</span>
            </div>
            <div className="border border-slate-400 p-2 rounded-sm bg-slate-50/50">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Teilnehmer-Nr. / Candidate ID</span>
              <span className="font-mono">{examId}</span>
            </div>
          </div>

          {/* Visual Instruction Notice */}
          <div className="mt-4 p-2.5 bg-slate-100 border border-slate-300 rounded text-xs flex items-center justify-between">
            <div className="text-slate-700">
              <strong>Wichtiger Ausfüllhinweis:</strong> Bitte nur mit weichem Bleistift ausfüllen. Kreuzen Sie das gewünschte Feld sauber an:
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-xs">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="inline-block w-4 h-4 border-2 border-black text-center leading-3 font-bold bg-white text-black">[X]</span> Richtig
              </span>
              <span className="flex items-center gap-1 text-rose-800">
                <span className="inline-block w-4 h-4 border border-black text-center leading-3 bg-white text-rose-600">[✓]</span> Falsch
              </span>
            </div>
          </div>
        </div>

        {/* 5 TEILE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Teil 1 & Teil 2 */}
          <div className="space-y-6">
            {/* TEIL 1 */}
            <div className="border border-slate-300 rounded p-4 bg-slate-50/30">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-black uppercase">
                  Teil 1 <span className="text-xs font-normal text-slate-600">(Aufgaben 1–6 • max. 6 Punkte)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">Richtig / Falsch</span>
              </div>

              {/* Beispiel 0 */}
              <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-100 rounded mb-2 border border-slate-200">
                <span className="font-bold font-mono text-slate-500">Beispiel [ 0 ]</span>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded border text-[11px] ${exam.teil1.beispiel.answer === 'Richtig' ? 'bg-black text-white font-bold' : 'border-black text-black'}`}>
                    Richtig
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] ${exam.teil1.beispiel.answer === 'Falsch' ? 'bg-black text-white font-bold' : 'border-black text-black'}`}>
                    Falsch
                  </span>
                </div>
              </div>

              {/* Items 1 to 6 */}
              <div className="space-y-2">
                {teil1Answers.map(item => (
                  <div key={item.num} className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200 hover:bg-slate-100/50">
                    <span className="font-bold font-mono text-black w-8">#{item.num}</span>
                    <div className="flex items-center gap-4">
                      <span className={`w-20 text-center py-1 rounded border text-xs cursor-pointer ${
                        showSolutions && item.ans === 'Richtig'
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                          : 'border-slate-400 bg-white hover:border-black'
                      }`}>
                        {showSolutions && item.ans === 'Richtig' ? '[ X ] Richtig' : '[   ] Richtig'}
                      </span>
                      <span className={`w-20 text-center py-1 rounded border text-xs cursor-pointer ${
                        showSolutions && item.ans === 'Falsch'
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                          : 'border-slate-400 bg-white hover:border-black'
                      }`}>
                        {showSolutions && item.ans === 'Falsch' ? '[ X ] Falsch' : '[   ] Falsch'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEIL 2 */}
            <div className="border border-slate-300 rounded p-4 bg-slate-50/30">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-black uppercase">
                  Teil 2 <span className="text-xs font-normal text-slate-600">(Aufgaben 7–12 • max. 6 Punkte)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">Dreifachauswahl a / b / c</span>
              </div>

              <div className="space-y-2">
                {teil2Answers.map(item => (
                  <div key={item.num} className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200 hover:bg-slate-100/50">
                    <span className="font-bold font-mono text-black w-8">#{item.num}</span>
                    <div className="flex items-center gap-3">
                      {(['a', 'b', 'c'] as const).map(opt => (
                        <span
                          key={opt}
                          className={`w-12 text-center py-1 rounded border text-xs uppercase font-mono ${
                            showSolutions && item.ans === opt
                              ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                              : 'border-slate-400 bg-white hover:border-black'
                          }`}
                        >
                          {showSolutions && item.ans === opt ? `[X] ${opt}` : `[ ] ${opt}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEIL 5 */}
            <div className="border border-slate-300 rounded p-4 bg-slate-50/30">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-black uppercase">
                  Teil 5 <span className="text-xs font-normal text-slate-600">(Aufgaben 27–30 • max. 4 Punkte)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">Anweisungen a / b / c</span>
              </div>

              <div className="space-y-2">
                {teil5Answers.map(item => (
                  <div key={item.num} className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200 hover:bg-slate-100/50">
                    <span className="font-bold font-mono text-black w-8">#{item.num}</span>
                    <div className="flex items-center gap-3">
                      {(['a', 'b', 'c'] as const).map(opt => (
                        <span
                          key={opt}
                          className={`w-12 text-center py-1 rounded border text-xs uppercase font-mono ${
                            showSolutions && item.ans === opt
                              ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                              : 'border-slate-400 bg-white hover:border-black'
                          }`}
                        >
                          {showSolutions && item.ans === opt ? `[X] ${opt}` : `[ ] ${opt}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Teil 3 & Teil 4 & Evaluator Box */}
          <div className="space-y-6">
            {/* TEIL 3 */}
            <div className="border border-slate-300 rounded p-4 bg-slate-50/30">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-black uppercase">
                  Teil 3 <span className="text-xs font-normal text-slate-600">(Aufgaben 13–19 • max. 7 Punkte)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">Anzeigen A–J oder 0</span>
              </div>

              {/* Beispiel 0 */}
              <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-100 rounded mb-2 border border-slate-200">
                <span className="font-bold font-mono text-slate-500">Beispiel [ 0 ]</span>
                <span className="font-mono font-bold bg-black text-white px-3 py-0.5 rounded text-xs uppercase">
                  Anzeige {exam.teil3.beispiel.answer.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                {teil3Answers.map(item => (
                  <div key={item.num} className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200">
                    <span className="font-bold font-mono text-black w-8">#{item.num}</span>
                    <div className="flex flex-wrap gap-1 items-center justify-end font-mono">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map(ltr => {
                        const isMatch = item.ans.toLowerCase() === ltr;
                        return (
                          <span
                            key={ltr}
                            className={`w-6 h-6 flex items-center justify-center rounded border text-[11px] uppercase ${
                              showSolutions && isMatch
                                ? 'bg-emerald-600 text-white font-bold border-emerald-700'
                                : 'border-slate-300 bg-white hover:border-black'
                            }`}
                          >
                            {ltr}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEIL 4 */}
            <div className="border border-slate-300 rounded p-4 bg-slate-50/30">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-black uppercase">
                  Teil 4 <span className="text-xs font-normal text-slate-600">(Aufgaben 20–26 • max. 7 Punkte)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">Ja / Nein</span>
              </div>

              {/* Beispiel 0 */}
              <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-100 rounded mb-2 border border-slate-200">
                <span className="font-bold font-mono text-slate-500">Beispiel [ 0 ]</span>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded border text-[11px] ${exam.teil4.beispiel.answer === 'Ja' ? 'bg-black text-white font-bold' : 'border-black text-black'}`}>
                    Ja
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] ${exam.teil4.beispiel.answer === 'Nein' ? 'bg-black text-white font-bold' : 'border-black text-black'}`}>
                    Nein
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {teil4Answers.map(item => (
                  <div key={item.num} className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200 hover:bg-slate-100/50">
                    <span className="font-bold font-mono text-black w-8">#{item.num}</span>
                    <div className="flex items-center gap-4">
                      <span className={`w-20 text-center py-1 rounded border text-xs cursor-pointer ${
                        showSolutions && item.ans === 'Ja'
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                          : 'border-slate-400 bg-white hover:border-black'
                      }`}>
                        {showSolutions && item.ans === 'Ja' ? '[ X ] Ja' : '[   ] Ja'}
                      </span>
                      <span className={`w-20 text-center py-1 rounded border text-xs cursor-pointer ${
                        showSolutions && item.ans === 'Nein'
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                          : 'border-slate-400 bg-white hover:border-black'
                      }`}>
                        {showSolutions && item.ans === 'Nein' ? '[ X ] Nein' : '[   ] Nein'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OFFICIAL EVALUATION BOX FOR EXAMINERS */}
            <div className="border-2 border-black rounded p-4 bg-slate-50">
              <div className="text-xs font-black uppercase tracking-wider text-black border-b border-black pb-1 mb-2 flex justify-between">
                <span>Nur von den Prüfenden auszufüllen</span>
                <span>Bewertungsfeld</span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-center text-xs mb-3">
                <div className="border border-slate-400 p-1 bg-white">
                  <div className="text-[10px] text-slate-500 font-bold">Teil 1</div>
                  <div className="font-mono font-bold">/ 6</div>
                </div>
                <div className="border border-slate-400 p-1 bg-white">
                  <div className="text-[10px] text-slate-500 font-bold">Teil 2</div>
                  <div className="font-mono font-bold">/ 6</div>
                </div>
                <div className="border border-slate-400 p-1 bg-white">
                  <div className="text-[10px] text-slate-500 font-bold">Teil 3</div>
                  <div className="font-mono font-bold">/ 7</div>
                </div>
                <div className="border border-slate-400 p-1 bg-white">
                  <div className="text-[10px] text-slate-500 font-bold">Teil 4</div>
                  <div className="font-mono font-bold">/ 7</div>
                </div>
                <div className="border border-slate-400 p-1 bg-white">
                  <div className="text-[10px] text-slate-500 font-bold">Teil 5</div>
                  <div className="font-mono font-bold">/ 4</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="border border-black p-2 bg-white rounded-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-600">Gesamtpunkte Lesen</div>
                  <div className="text-base font-black font-mono">____ / 30</div>
                </div>
                <div className="border border-black p-2 bg-white rounded-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-600">Skalierte Punkte (100er-Skala)</div>
                  <div className="text-base font-black font-mono">____ / 100</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-300">
                <div>
                  <span className="font-bold">Bestehensgrenze:</span> 60 Punkte (mind. 18 / 30)
                </div>
                <div className="text-slate-600 italic">
                  Unterschrift Prüfer/in: __________________
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
