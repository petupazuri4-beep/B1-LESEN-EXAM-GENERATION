import React, { useState } from 'react';
import { ExamModel, TeilType } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import { LineNumberedText } from '../utils/lineNumbering';
import { GermanTtsPlayer } from './GermanTtsPlayer';
import {
  Split,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Volume2,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const TeacherSplitPreview: React.FC<Props> = ({ exam, lang = 'de' }) => {
  const t = translations[lang];
  const [activeTeil, setActiveTeil] = useState<TeilType>(1);

  return (
    <div className="max-w-7xl mx-auto my-6 px-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-orange-600/30 text-orange-400 border border-orange-500/30">
              <Split className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold">
              {lang === 'en' ? 'Teacher Split Dual-View & Pedagogical Rationale' : 'Lehrer-Dualansicht & Didaktische Begründungen'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            {lang === 'en'
              ? 'Synchronized side-by-side reading text and question analysis. View original text evidence, justification, and distractor rationale for every item.'
              : 'Synchronisierte Gegenüberstellung von Lesetext und Aufgabenanalyse. Einsicht in Textbelege, didaktische Begründungen und Distraktoren-Erklärungen für alle 30 Aufgaben.'}
          </p>
        </div>

        {/* Teil Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          {([1, 2, 3, 4, 5] as TeilType[]).map(num => (
            <button
              key={num}
              onClick={() => setActiveTeil(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTeil === num
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Teil {num}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Reading Stimulus & TTS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-20 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-600" />
              {lang === 'en' ? 'Authentic Reading Text (Stimulus)' : 'Original-Lesetext (Stimulus)'}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Zeilennummerierung (alle 5 Zeilen)
            </span>
          </div>

          {/* TEIL 1 STIMULUS */}
          {activeTeil === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Situationskontext:</span>
                <p className="text-slate-600 italic">{exam.teil1.sourceContext}</p>
                <div className="mt-2">
                  <GermanTtsPlayer text={`${exam.teil1.emailGreeting}. ${exam.teil1.emailBody}`} label="E-Mail vorlesen" />
                </div>
              </div>

              <div className="text-sm border border-slate-200 p-4 rounded-xl bg-amber-50/20">
                <div className="font-semibold text-slate-800 mb-3">{exam.teil1.emailGreeting},</div>
                <LineNumberedText text={exam.teil1.emailBody} interval={5} />
                <div className="mt-4 font-semibold text-slate-800">{exam.teil1.emailSignoff}</div>
                <div className="text-xs text-slate-500 mt-1">{exam.teil1.authorLocation}</div>
              </div>
            </div>
          )}

          {/* TEIL 2 STIMULUS */}
          {activeTeil === 2 && (
            <div className="space-y-6">
              {/* Text A */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="text-[10px] uppercase font-bold text-orange-600 mb-1">Text A • {exam.teil2.textA.kicker}</div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{exam.teil2.textA.title}</h3>
                <div className="text-xs text-slate-500 mb-3 italic">Quelle: {exam.teil2.textA.source}</div>
                <GermanTtsPlayer text={exam.teil2.textA.bodyParagraphs.join(' ')} label="Text A anhören" />
                <div className="mt-3 text-sm">
                  {exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                    <div key={idx} className="mb-2">
                      <LineNumberedText text={p} interval={5} startLineNumber={idx * 6 + 1} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Text B */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="text-[10px] uppercase font-bold text-orange-600 mb-1">Text B • {exam.teil2.textB.kicker}</div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{exam.teil2.textB.title}</h3>
                <div className="text-xs text-slate-500 mb-3 italic">Quelle: {exam.teil2.textB.source}</div>
                <GermanTtsPlayer text={exam.teil2.textB.bodyParagraphs.join(' ')} label="Text B anhören" />
                <div className="mt-3 text-sm">
                  {exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                    <div key={idx} className="mb-2">
                      <LineNumberedText text={p} interval={5} startLineNumber={idx * 6 + 1} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEIL 3 STIMULUS (10 Ads) */}
          {activeTeil === 3 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border">
                <strong>Anzeigenpool (A–J):</strong> 10 Anzeigen aus deutschsprachigen Medien. Eine Anzeige bleibt ungenutzt (Anzeige {exam.teil3.unusedAdLetter.toUpperCase()}). Für eine Situation gibt es keine passende Anzeige (Lösung 0).
              </div>
              <div className="space-y-3">
                {exam.teil3.advertisements.map(ad => (
                  <div key={ad.letter} className="border border-slate-300 rounded-lg p-3 bg-white hover:border-orange-500 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-6 h-6 rounded bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs uppercase">
                        {ad.letter}
                      </span>
                      <span className="font-bold text-xs text-slate-800">{ad.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{ad.body}</p>
                    <div className="text-[10px] text-slate-400 font-mono border-t pt-1">{ad.contact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 4 STIMULUS (Leserbriefe) */}
          {activeTeil === 4 && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Diskussionsthema:</span>
                <p className="text-amber-800">{exam.teil4.contextTopic}</p>
                <div className="mt-1 font-semibold text-amber-950">Leitfrage: {exam.teil4.questionFraming}</div>
              </div>

              <div className="space-y-3">
                {exam.teil4.leserbriefe.map(lb => (
                  <div key={lb.number} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-900">
                        {lb.author}, {lb.age} Jahre ({lb.city})
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">Aufgabe #{lb.number}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{lb.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 5 STIMULUS (Hausordnung / Regelwerk) */}
          {activeTeil === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block">Kontext & Situation:</span>
                <p className="text-slate-600">{exam.teil5.contextSituation}</p>
              </div>

              <div className="border border-slate-300 rounded-xl p-4 bg-white">
                <h3 className="font-black text-sm uppercase text-slate-900 border-b pb-2 mb-3">
                  {exam.teil5.sheetTitle}
                </h3>
                {exam.teil5.sections.map((sec, idx) => (
                  <div key={idx} className="mb-4">
                    <h4 className="font-bold text-xs text-orange-700 mb-1">{sec.title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Question Items, Answer Badges, Text Evidence & Pedagogical Rationale */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              {lang === 'en' ? 'Task Analysis, Evidence & Distractor Rationale' : 'Aufgabenanalyse, Belege & Distraktorenbegründung'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Lösungen & Didaktik
            </span>
          </div>

          {/* TEIL 1 ITEMS */}
          {activeTeil === 1 && (
            <div className="space-y-4">
              {exam.teil1.items.map(item => (
                <div key={item.number} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{item.number}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{item.statement}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                      item.correctAnswer === 'Richtig'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {item.correctAnswer}
                    </span>
                  </div>

                  {item.textReference && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                      <span className="font-bold text-slate-600 block mb-0.5">📌 Textbeleg / Zitat:</span>
                      <span className="italic text-slate-700">"{item.textReference}"</span>
                    </div>
                  )}

                  {item.justification && (
                    <div className="text-xs bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200 mt-2 text-emerald-950">
                      <span className="font-bold block mb-0.5">💡 Didaktische Begründung:</span>
                      <span>{item.justification}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 2 ITEMS */}
          {activeTeil === 2 && (
            <div className="space-y-4">
              {[...exam.teil2.textA.items, ...exam.teil2.textB.items].map(item => (
                <div key={item.number} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{item.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.question}</h4>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                      Lösung: {item.correctAnswer}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 mb-3 text-xs">
                    {(['a', 'b', 'c'] as const).map(opt => {
                      const isCorrect = item.correctAnswer === opt;
                      return (
                        <div
                          key={opt}
                          className={`p-2 rounded border flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-mono font-bold uppercase w-4">{opt})</span>
                          <span>{item.options[opt]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {item.distractorRationale && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block mb-1">🔍 Distraktoren-Analyse:</span>
                      {item.distractorRationale.a && (
                        <p><strong className="uppercase">a:</strong> {item.distractorRationale.a}</p>
                      )}
                      {item.distractorRationale.b && (
                        <p><strong className="uppercase">b:</strong> {item.distractorRationale.b}</p>
                      )}
                      {item.distractorRationale.c && (
                        <p><strong className="uppercase">c:</strong> {item.distractorRationale.c}</p>
                      )}
                    </div>
                  )}

                  {item.justification && (
                    <div className="text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 mt-2 text-emerald-950">
                      <span className="font-bold block mb-0.5">💡 Erklärung:</span>
                      <span>{item.justification}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 3 ITEMS */}
          {activeTeil === 3 && (
            <div className="space-y-4">
              {exam.teil3.situations.map(item => (
                <div key={item.number} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{item.number}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900">{item.situation}</h4>
                    </div>
                    <span className="px-3 py-1 rounded bg-orange-100 text-orange-900 border border-orange-300 text-xs font-black font-mono uppercase">
                      Anzeige {item.correctAnswer.toUpperCase()}
                    </span>
                  </div>

                  {item.justification && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                      <span className="font-bold text-slate-700 block mb-0.5">💡 Passungsgrund:</span>
                      <span className="text-slate-600">{item.justification}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 4 ITEMS */}
          {activeTeil === 4 && (
            <div className="space-y-4">
              {exam.teil4.leserbriefe.map(item => (
                <div key={item.number} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{item.number}
                      </span>
                      <span className="font-bold text-xs text-slate-800">{item.author} ({item.city})</span>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                      item.correctAnswer === 'Ja'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {item.correctAnswer}
                    </span>
                  </div>

                  {item.justification && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                      <span className="font-bold text-slate-700 block mb-0.5">💡 Haltung der Person:</span>
                      <span className="text-slate-600">{item.justification}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TEIL 5 ITEMS */}
          {activeTeil === 5 && (
            <div className="space-y-4">
              {exam.teil5.items.map(item => (
                <div key={item.number} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{item.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.question}</h4>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                      Lösung: {item.correctAnswer}
                    </span>
                  </div>

                  <div className="space-y-1 mb-2 text-xs">
                    {(['a', 'b', 'c'] as const).map(opt => (
                      <div
                        key={opt}
                        className={`p-2 rounded border flex items-start gap-2 ${
                          item.correctAnswer === opt
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono font-bold uppercase w-4">{opt})</span>
                        <span>{item.options[opt]}</span>
                      </div>
                    ))}
                  </div>

                  {item.justification && (
                    <div className="text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 mt-2 text-emerald-950">
                      <span className="font-bold block mb-0.5">💡 Paragraphen-Bezug:</span>
                      <span>{item.justification}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
