import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { OFFICIAL_B1_CONVERSION_TABLE } from '../utils/scoreConversion';
import { Language } from '../utils/i18n';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, FileSearch } from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const AnswerKeyPaper: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const { styleConfig } = exam;
  const [showDetailedEvidence, setShowDetailedEvidence] = useState<boolean>(true);

  // Helper to get fallback justification if not yet customized
  const getFallbackEvidence = (partNum: number, itemNum: number, answer: string): { textRef: string; explanation: string } => {
    switch (partNum) {
      case 1:
        return {
          textRef: `E-Mail Abschnitt ${Math.min(3, Math.ceil(itemNum / 2))}`,
          explanation: answer === 'Richtig'
            ? 'Aussage stimmt mit den Angaben im Text wörtlich/sinngemäß überein.'
            : 'Textangabe widerspricht der Aussage (z.B. andere Zeit/Absicht).',
        };
      case 2:
        return {
          textRef: itemNum <= 9 ? 'Text A' : 'Text B',
          explanation: `Option [${answer}] wird durch die Textpassage direkt gestützt; Distraktoren sind unzutreffend oder nicht erwähnt.`,
        };
      case 3:
        return {
          textRef: answer === '0' ? 'Keine passende Anzeige' : `Anzeige [${answer.toUpperCase()}]`,
          explanation: answer === '0'
            ? 'Für dieses Anforderungsprofil existiert im gesamten Anzeigenteil kein passendes Angebot.'
            : `Schlüsselbegriffe der Situation stimmen mit dem Angebot in Anzeige ${answer.toUpperCase()} überein.`,
        };
      case 4:
        return {
          textRef: 'Leserbrief-Stellungnahme',
          explanation: answer === 'Ja'
            ? 'Die Person befürwortet die Maßnahme/Regelung ausdrücklich.'
            : 'Die Person lehnt die Maßnahme/Regelung ab oder äußert gravierende Bedenken.',
        };
      case 5:
        return {
          textRef: 'Hausordnung / Regelabschnitt',
          explanation: `Option [${answer}] entspricht exakt der Vorschrift; alternative Optionen verstoßen gegen die Regel.`,
        };
      default:
        return { textRef: 'Textbeleg', explanation: 'Offizielle B1-Lösung.' };
    }
  };

  return (
    <div
      className="answer-key-container mx-auto text-neutral-900 bg-white shadow-2xl p-8 md:p-12 print:p-6"
      style={{
        maxWidth: '850px',
        fontSize: '10pt',
      }}
      data-exam-page="solutions-1"
    >
      {/* Top Header Bar */}
      <div
        className="w-full py-1.5 px-4 mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider border-b border-t"
        style={{
          backgroundColor: styleConfig.headerBarColor || '#d9d9d9',
          color: styleConfig.headerTextColor || '#111827',
          borderColor: '#9ca3af',
        }}
      >
        <span className="w-1/3 text-left">ZERTIFIKAT B1</span>
        <span className="w-1/3 text-center tracking-widest font-black">
          {lang === 'en' ? 'LESEN LÖSUNGEN (ANSWER KEY)' : 'LESEN LÖSUNGEN'}
        </span>
        <span className="w-1/3 text-right">PRÜFERBLÄTTER</span>
      </div>

      {/* Header with Title, Logos & Center Metadata */}
      <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono text-neutral-400">Prüfungsbogen-ID: {exam.id}</span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
            Offizielle Prüferlösungen {lang === 'en' && <span className="text-lg font-bold text-amber-700">/ Official Examiner Answer Key</span>}
          </h1>
          <p className="text-xs font-semibold text-neutral-600">
            {exam.title} • Modul LESEN (30 Rohpunkte = 100 Ergebnispunkte)
            {lang === 'en' && <span className="text-neutral-500 font-normal"> • Reading Module (30 raw = 100 scaled)</span>}
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500 mt-1">
            <span>Zentrum: {exam.candidateInfo.institution || 'Goethe-Zentrum'}</span>
            <span>•</span>
            <span>Ort: {exam.candidateInfo.city || 'Berlin'}</span>
            <span>•</span>
            <span>Code: {exam.candidateInfo.centerCode || 'PZ-8392'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-orange-600 tracking-wider">GOETHE-ZERTIFIKAT B1</div>
          <div className="text-[11px] font-bold text-neutral-600">ÖSD • UNIVERSITÄT FREIBURG</div>
          <div className="text-[10px] text-neutral-400 mt-1 font-mono">Modellsatz 2026</div>
        </div>
      </div>

      {/* Toggle Bar for Rich Evidence Key */}
      <div className="no-print mb-6 p-3 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-neutral-800">
            {lang === 'en' ? 'Evidence & Text Reference Citations (Textbelege)' : 'Textbelege & Lehrer-Begründungen (Rich Teacher Key)'}
          </span>
        </div>
        <button
          onClick={() => setShowDetailedEvidence(!showDetailedEvidence)}
          className="px-3 py-1 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>
            {showDetailedEvidence
              ? (lang === 'en' ? 'Hide Proof Citations' : 'Textbelege einklappen')
              : (lang === 'en' ? 'Show Proof Citations' : 'Textbelege anzeigen')}
          </span>
          {showDetailedEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* OFFICIAL FILLED-IN SCAN-SHEET (ANTWORTBOGEN MOCK) */}
      <div className="border-2 border-neutral-900 p-5 rounded bg-neutral-50/50 mb-8">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              37357
            </div>
            <div>
              <div className="text-sm font-black tracking-tight uppercase">Zertifikat B1</div>
              <div className="text-xs font-bold text-neutral-500 uppercase">
                {lang === 'en' ? 'Reading • Optical Answer Sheet (Key)' : 'Lesen • Antwortbogen (Muster)'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>PS: <span className="border border-neutral-800 px-1 font-bold">1</span> <span className="border border-neutral-800 px-1 font-bold">S</span></div>
            <div>A <span className="border border-neutral-800 px-1 font-bold">☒</span> Erw.</div>
          </div>
        </div>

        {/* Scan sheet grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Teil 1 and Teil 2 */}
          <div className="space-y-6">
            {/* Teil 1 */}
            <div className="border border-neutral-300 p-3 bg-white rounded">
              <div className="font-extrabold text-[11px] bg-neutral-200 px-2 py-0.5 mb-2 uppercase">
                Teil 1 (Richtig / Falsch)
              </div>
              <div className="space-y-1 pl-1">
                {exam.teil1.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-0.5 border-b border-neutral-100">
                    <span className="font-bold w-6">{item.number}</span>
                    <div className="flex items-center gap-6 font-mono text-xs">
                      <span className="flex items-center gap-1">
                        <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${item.correctAnswer === 'Richtig' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                          {item.correctAnswer === 'Richtig' ? '☒' : ''}
                        </span>
                        <span className="text-[10px]">R</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${item.correctAnswer === 'Falsch' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                          {item.correctAnswer === 'Falsch' ? '☒' : ''}
                        </span>
                        <span className="text-[10px]">F</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teil 2 */}
            <div className="border border-neutral-300 p-3 bg-white rounded">
              <div className="font-extrabold text-[11px] bg-neutral-200 px-2 py-0.5 mb-2 uppercase">
                Teil 2 (Mehrfachauswahl a/b/c)
              </div>
              <div className="space-y-1 pl-1">
                {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map(item => (
                  <div key={item.id} className="flex items-center justify-between py-0.5 border-b border-neutral-100">
                    <span className="font-bold w-6">{item.number}</span>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      {(['a', 'b', 'c'] as const).map(opt => (
                        <span key={opt} className="flex items-center gap-1">
                          <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${item.correctAnswer === opt ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                            {item.correctAnswer === opt ? '☒' : ''}
                          </span>
                          <span className="text-[10px]">{opt}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teil 5 */}
            <div className="border border-neutral-300 p-3 bg-white rounded">
              <div className="font-extrabold text-[11px] bg-neutral-200 px-2 py-0.5 mb-2 uppercase">
                Teil 5 (Hausordnung 27–30)
              </div>
              <div className="space-y-1 pl-1">
                {exam.teil5.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-0.5 border-b border-neutral-100">
                    <span className="font-bold w-6">{item.number}</span>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      {(['a', 'b', 'c'] as const).map(opt => (
                        <span key={opt} className="flex items-center gap-1">
                          <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${item.correctAnswer === opt ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                            {item.correctAnswer === opt ? '☒' : ''}
                          </span>
                          <span className="text-[10px]">{opt}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Teil 3 and Teil 4 */}
          <div className="space-y-6">
            {/* Teil 3 */}
            <div className="border border-neutral-300 p-3 bg-white rounded">
              <div className="font-extrabold text-[11px] bg-neutral-200 px-2 py-0.5 mb-2 uppercase">
                Teil 3 (Zuordnung a–j & 0)
              </div>
              <div className="space-y-1.5 pl-1">
                {exam.teil3.situations.map(sit => (
                  <div key={sit.id} className="py-1 border-b border-neutral-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{sit.number}</span>
                      <span className="text-[11px] font-semibold text-neutral-600">
                        Lösung: <strong className="text-black">{sit.correctAnswer.toUpperCase()}</strong>
                      </span>
                    </div>
                    {/* Compact bubble row for a through j + 0 */}
                    <div className="flex items-center gap-1 font-mono text-[9px]">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map(letChoice => {
                        const isSelected = sit.correctAnswer.toLowerCase() === letChoice.toLowerCase();
                        return (
                          <span
                            key={letChoice}
                            className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${isSelected ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-500'}`}
                          >
                            {isSelected ? '☒' : letChoice}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teil 4 */}
            <div className="border border-neutral-300 p-3 bg-white rounded">
              <div className="font-extrabold text-[11px] bg-neutral-200 px-2 py-0.5 mb-2 uppercase">
                Teil 4 (Leserbriefe Ja / Nein)
              </div>
              <div className="space-y-1 pl-1">
                {exam.teil4.leserbriefe.map(lb => (
                  <div key={lb.id} className="flex items-center justify-between py-0.5 border-b border-neutral-100">
                    <span className="font-bold w-6">{lb.number}</span>
                    <span className="text-[10px] text-neutral-500 truncate max-w-[80px]">{lb.author}</span>
                    <div className="flex items-center gap-6 font-mono text-xs">
                      <span className="flex items-center gap-1">
                        <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${lb.correctAnswer === 'Ja' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                          {lb.correctAnswer === 'Ja' ? '☒' : ''}
                        </span>
                        <span className="text-[10px]">Ja</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-4 h-4 border border-neutral-800 flex items-center justify-center font-bold ${lb.correctAnswer === 'Nein' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
                          {lb.correctAnswer === 'Nein' ? '☒' : ''}
                        </span>
                        <span className="text-[10px]">Nein</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scan Sheet Scoring and Signature Block */}
        <div className="mt-6 pt-4 border-t-2 border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-6">
            <div className="border-2 border-neutral-900 p-2 bg-white text-center">
              <div className="text-[10px] uppercase font-bold text-neutral-500">
                {lang === 'en' ? 'Score Parts 1 to 5' : 'Punkte Teile 1 bis 5'}
              </div>
              <div className="text-xl font-black font-mono">30 / 30</div>
            </div>
            <div className="border-2 border-neutral-900 p-2 bg-neutral-900 text-white text-center">
              <div className="text-[10px] uppercase font-bold text-neutral-300">
                {lang === 'en' ? 'Total Scaled Score' : 'Gesamtergebnis (skaliert)'}
              </div>
              <div className="text-xl font-black font-mono">100 / 100</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600">
            <div>
              <div className="border-b border-neutral-400 w-28 h-5"></div>
              <span>{lang === 'en' ? 'Examiner 1 Signature' : 'Unterschrift Prüfer 1'}</span>
            </div>
            <div>
              <div className="border-b border-neutral-400 w-28 h-5"></div>
              <span>{lang === 'en' ? 'Examiner 2 Signature' : 'Unterschrift Prüfer 2'}</span>
            </div>
            <div>
              <div className="border-b border-neutral-400 w-20 h-5"></div>
              <span>{lang === 'en' ? 'Date' : 'Datum'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT SOLUTIONS SUMMARY TABLE */}
      <div className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3 border-b border-neutral-300 pb-1">
          {lang === 'en' ? 'Compact Solutions Key: Questions 1 to 30' : 'Kompakte Lösungen: Aufgaben 1 bis 30'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {/* Teil 1 */}
          <div className="border border-neutral-300 p-2 bg-neutral-50 rounded">
            <div className="font-bold text-[11px] text-neutral-700 border-b pb-1 mb-1">Teil 1 (1–6)</div>
            <div className="text-[10px] text-neutral-500">0: {exam.teil1.beispiel.answer}</div>
            {exam.teil1.items.map(i => (
              <div key={i.id} className="flex justify-between py-0.5">
                <span className="font-bold">{i.number}:</span>
                <span className="font-mono font-bold text-neutral-900">{i.correctAnswer}</span>
              </div>
            ))}
          </div>

          {/* Teil 2 */}
          <div className="border border-neutral-300 p-2 bg-neutral-50 rounded">
            <div className="font-bold text-[11px] text-neutral-700 border-b pb-1 mb-1">Teil 2 (7–12)</div>
            <div className="text-[10px] text-neutral-500">0: {exam.teil2.textA.beispiel.answer.toUpperCase()}</div>
            {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map(i => (
              <div key={i.id} className="flex justify-between py-0.5">
                <span className="font-bold">{i.number}:</span>
                <span className="font-mono font-bold text-neutral-900">{i.correctAnswer.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* Teil 3 */}
          <div className="border border-neutral-300 p-2 bg-neutral-50 rounded">
            <div className="font-bold text-[11px] text-neutral-700 border-b pb-1 mb-1">Teil 3 (13–19)</div>
            <div className="text-[10px] text-neutral-500">0: {exam.teil3.beispiel.answer.toUpperCase()}</div>
            {exam.teil3.situations.map(s => (
              <div key={s.id} className="flex justify-between py-0.5">
                <span className="font-bold">{s.number}:</span>
                <span className="font-mono font-bold text-neutral-900">{s.correctAnswer.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* Teil 4 */}
          <div className="border border-neutral-300 p-2 bg-neutral-50 rounded">
            <div className="font-bold text-[11px] text-neutral-700 border-b pb-1 mb-1">Teil 4 (20–26)</div>
            <div className="text-[10px] text-neutral-500">0: {exam.teil4.beispiel.answer}</div>
            {exam.teil4.leserbriefe.map(lb => (
              <div key={lb.id} className="flex justify-between py-0.5">
                <span className="font-bold">{lb.number}:</span>
                <span className="font-mono font-bold text-neutral-900">{lb.correctAnswer}</span>
              </div>
            ))}
          </div>

          {/* Teil 5 */}
          <div className="border border-neutral-300 p-2 bg-neutral-50 rounded">
            <div className="font-bold text-[11px] text-neutral-700 border-b pb-1 mb-1">Teil 5 (27–30)</div>
            {exam.teil5.items.map(i => (
              <div key={i.id} className="flex justify-between py-0.5">
                <span className="font-bold">{i.number}:</span>
                <span className="font-mono font-bold text-neutral-900">{i.correctAnswer.toUpperCase()}</span>
              </div>
            ))}
            <div className="text-[10px] text-neutral-400 mt-2 italic">Max: 4 Punkte</div>
          </div>
        </div>
      </div>

      {/* DETAILED EVIDENCE & TEXTBELEGE SECTION (TEACHER KEY) */}
      {showDetailedEvidence && (
        <div className="mb-8 border border-neutral-300 rounded-xl p-4 bg-neutral-50/70 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Ausführliche Textbelege & Begründungen (30 Aufgaben)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              Prüferkommentar & Zitate
            </span>
          </div>

          {/* 5 Collapsible / Organized sections */}
          <div className="space-y-3 text-xs">
            {/* Teil 1 Items */}
            <div className="p-3 bg-white rounded border border-neutral-200 space-y-2">
              <span className="font-bold text-[11px] text-neutral-800 uppercase block border-b pb-1">
                Teil 1: Korrespondenz (1–6)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exam.teil1.items.map(it => {
                  const ev = getFallbackEvidence(1, it.number, it.correctAnswer);
                  return (
                    <div key={it.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Aufgabe {it.number}: <strong className="text-orange-600">{it.correctAnswer}</strong></span>
                        <span className="text-[10px] font-mono text-neutral-500">{it.textReference || ev.textRef}</span>
                      </div>
                      <p className="text-neutral-700 italic">
                        „{it.statement}“
                      </p>
                      <p className="text-neutral-600 text-[10px] mt-1 pt-1 border-t border-neutral-200">
                        {it.justification || ev.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 2 Items */}
            <div className="p-3 bg-white rounded border border-neutral-200 space-y-2">
              <span className="font-bold text-[11px] text-neutral-800 uppercase block border-b pb-1">
                Teil 2: Pressetexte (7–12)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map(it => {
                  const ev = getFallbackEvidence(2, it.number, it.correctAnswer);
                  return (
                    <div key={it.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Aufgabe {it.number}: <strong className="text-orange-600">[{it.correctAnswer.toUpperCase()}]</strong></span>
                        <span className="text-[10px] font-mono text-neutral-500">{it.textReference || ev.textRef}</span>
                      </div>
                      <p className="text-neutral-800 font-medium">
                        {it.question}
                      </p>
                      <p className="text-neutral-600 text-[10px] mt-1 pt-1 border-t border-neutral-200">
                        {it.justification || ev.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 3 Items */}
            <div className="p-3 bg-white rounded border border-neutral-200 space-y-2">
              <span className="font-bold text-[11px] text-neutral-800 uppercase block border-b pb-1">
                Teil 3: Anzeigen-Zuordnung (13–19)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exam.teil3.situations.map(sit => {
                  const ev = getFallbackEvidence(3, sit.number, sit.correctAnswer);
                  return (
                    <div key={sit.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Aufgabe {sit.number}: <strong className="text-orange-600">[{sit.correctAnswer.toUpperCase()}]</strong></span>
                        <span className="text-[10px] font-mono text-neutral-500">{sit.textReference || ev.textRef}</span>
                      </div>
                      <p className="text-neutral-700 italic">
                        {sit.situation}
                      </p>
                      <p className="text-neutral-600 text-[10px] mt-1 pt-1 border-t border-neutral-200">
                        {sit.justification || ev.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 4 Items */}
            <div className="p-3 bg-white rounded border border-neutral-200 space-y-2">
              <span className="font-bold text-[11px] text-neutral-800 uppercase block border-b pb-1">
                Teil 4: Leserbriefe (20–26)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exam.teil4.leserbriefe.map(lb => {
                  const ev = getFallbackEvidence(4, lb.number, lb.correctAnswer);
                  return (
                    <div key={lb.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Aufgabe {lb.number} ({lb.author}): <strong className="text-orange-600">{lb.correctAnswer}</strong></span>
                        <span className="text-[10px] font-mono text-neutral-500">{lb.textReference || ev.textRef}</span>
                      </div>
                      <p className="text-neutral-700 italic">
                        „{lb.text.slice(0, 110)}...“
                      </p>
                      <p className="text-neutral-600 text-[10px] mt-1 pt-1 border-t border-neutral-200">
                        {lb.justification || ev.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teil 5 Items */}
            <div className="p-3 bg-white rounded border border-neutral-200 space-y-2">
              <span className="font-bold text-[11px] text-neutral-800 uppercase block border-b pb-1">
                Teil 5: Hausordnung / Regelwerk (27–30)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exam.teil5.items.map(it => {
                  const ev = getFallbackEvidence(5, it.number, it.correctAnswer);
                  return (
                    <div key={it.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Aufgabe {it.number}: <strong className="text-orange-600">[{it.correctAnswer.toUpperCase()}]</strong></span>
                        <span className="text-[10px] font-mono text-neutral-500">{it.textReference || ev.textRef}</span>
                      </div>
                      <p className="text-neutral-800 font-medium">
                        {it.question}
                      </p>
                      <p className="text-neutral-600 text-[10px] mt-1 pt-1 border-t border-neutral-200">
                        {it.justification || ev.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL SCORING CONVERSION TABLE (UMRECHNUNGSTABELLE) */}
      <div className="border border-neutral-400 p-4 rounded bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
            {lang === 'en' ? 'Official Score Conversion Table: Reading & Listening (Goethe/ÖSD B1)' : 'Offizielle Umrechnungstabelle Hören und Lesen (Goethe/ÖSD B1)'}
          </h3>
          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            {lang === 'en' ? 'Pass Mark: 60 Points (min. 18 / 30 raw items)' : 'Bestehensgrenze: 60 Punkte (mind. 18 / 30 Rohpunkte)'}
          </span>
        </div>

        {/* 2-tier table matching official PDF page 34 */}
        <div className="overflow-x-auto text-[10px] font-mono">
          <table className="w-full text-center border-collapse border border-neutral-300 mb-2">
            <tbody>
              <tr className="bg-neutral-100 font-bold border-b border-neutral-300">
                <td className="p-1 border-r border-neutral-300 text-left font-sans">{lang === 'en' ? 'Raw Score' : 'Messpunkte'}</td>
                {OFFICIAL_B1_CONVERSION_TABLE.slice(0, 16).map(r => (
                  <td key={r.raw} className={`p-1 border-r border-neutral-300 ${r.raw === 18 ? 'bg-amber-100 font-extrabold' : ''}`}>{r.raw}</td>
                ))}
              </tr>
              <tr className="border-b border-neutral-300">
                <td className="p-1 border-r border-neutral-300 text-left font-sans font-bold">{lang === 'en' ? 'Scaled Pts' : 'Ergebnispunkte'}</td>
                {OFFICIAL_B1_CONVERSION_TABLE.slice(0, 16).map(r => (
                  <td key={r.raw} className={`p-1 border-r border-neutral-300 ${r.raw === 18 ? 'bg-amber-100 font-extrabold' : ''}`}>{r.scaled}</td>
                ))}
              </tr>
              <tr className="bg-neutral-100 font-bold border-b border-neutral-300">
                <td className="p-1 border-r border-neutral-300 text-left font-sans">{lang === 'en' ? 'Raw Score' : 'Messpunkte'}</td>
                {OFFICIAL_B1_CONVERSION_TABLE.slice(16).map(r => (
                  <td key={r.raw} className="p-1 border-r border-neutral-300">{r.raw}</td>
                ))}
              </tr>
              <tr>
                <td className="p-1 border-r border-neutral-300 text-left font-sans font-bold">{lang === 'en' ? 'Scaled Pts' : 'Ergebnispunkte'}</td>
                {OFFICIAL_B1_CONVERSION_TABLE.slice(16).map(r => (
                  <td key={r.raw} className="p-1 border-r border-neutral-300">{r.scaled}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
