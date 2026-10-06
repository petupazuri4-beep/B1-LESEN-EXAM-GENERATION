import React, { useState, useEffect } from 'react';
import { ExamModel } from '../types/exam';
import { convertRawToScaledScore, isPassingScore } from '../utils/scoreConversion';
import { Language, translations } from '../utils/i18n';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  onExit: () => void;
  lang?: Language;
}

export const CbtExamScreenPreview: React.FC<Props> = ({
  exam,
  onExit,
  lang = 'de',
}) => {
  const t = translations[lang];

  // State
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(65 * 60); // 65 min
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (num: number, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [num]: val,
    }));
  };

  const toggleFlag = (num: number) => {
    setFlagged((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  // Determine which Teil current question belongs to
  const getTeilForQuestion = (qNum: number): 1 | 2 | 3 | 4 | 5 => {
    if (qNum <= 6) return 1;
    if (qNum <= 12) return 2;
    if (qNum <= 19) return 3;
    if (qNum <= 26) return 4;
    return 5;
  };

  const activeTeil = getTeilForQuestion(currentQuestionNumber);

  // Extract official answer keys for auto-grading
  const officialKey: Record<number, string> = {};
  exam.teil1.items.forEach((i) => (officialKey[i.number] = i.correctAnswer));
  exam.teil2.textA.items.forEach((i) => (officialKey[i.number] = i.correctAnswer));
  exam.teil2.textB.items.forEach((i) => (officialKey[i.number] = i.correctAnswer));
  exam.teil3.situations.forEach((i) => (officialKey[i.number] = i.correctAnswer.toLowerCase()));
  exam.teil4.leserbriefe.forEach((i) => (officialKey[i.number] = i.correctAnswer));
  exam.teil5.items.forEach((i) => (officialKey[i.number] = i.correctAnswer));

  // Score calculation
  let rawScore = 0;
  for (let i = 1; i <= 30; i++) {
    if ((answers[i] || '').toLowerCase() === (officialKey[i] || '').toLowerCase()) {
      rawScore++;
    }
  }
  const scaledScore = convertRawToScaledScore(rawScore);
  const passed = isPassingScore(rawScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col font-sans select-none overflow-hidden">
      {/* 1. OFFICIAL CBT TOP HEADER */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-orange-600 font-black text-sm flex items-center justify-center">
            B1
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Goethe- / ÖSD-Zertifikat B1 • Digital</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                {lang === 'en' ? 'CBT Mode' : 'CBT Modus'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {lang === 'en'
                ? 'Candidate: Sample Candidate (ID: EN-89104) • Module READING (65 Min.)'
                : 'Kandidat: Max Mustermann (ID: DE-89104) • Modul LESEN (65 Min.)'}
            </div>
          </div>
        </div>

        {/* Center Timer & Tools */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono font-bold text-sm border ${
            timeLeft < 300
              ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              : 'bg-slate-800 text-amber-300 border-slate-700'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(90, z - 10))}
              className="p-1 text-slate-300 hover:text-white rounded"
              title={lang === 'en' ? 'Decrease font size' : 'Schrift verkleinern'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1 text-slate-300 hover:text-white rounded"
              title={lang === 'en' ? 'Increase font size' : 'Schrift vergrößern'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-3 py-1 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition"
          >
            {lang === 'en' ? 'Finish Exam' : 'Prüfung beenden'}
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: Teil Indicator & Flag Bookmark */}
      <div className="bg-slate-800 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-700">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white uppercase">
            {lang === 'en' ? `Part ${activeTeil} of 5` : `Teil ${activeTeil} von 5`}
          </span>
          <span className="text-slate-400">
            {lang === 'en' ? `Question ${currentQuestionNumber} of 30` : `Aufgabe ${currentQuestionNumber} von 30`}
          </span>
        </div>

        <button
          onClick={() => toggleFlag(currentQuestionNumber)}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs transition cursor-pointer ${
            flagged[currentQuestionNumber]
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'hover:bg-slate-700 text-slate-400'
          }`}
        >
          <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestionNumber] ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>
            {flagged[currentQuestionNumber]
              ? (lang === 'en' ? 'Flagged for review' : 'Markiert zur Überprüfung')
              : (lang === 'en' ? 'Flag question' : 'Frage vormerken')}
          </span>
        </button>
      </div>

      {/* 3. SPLIT STIMULUS & QUESTION SCREEN */}
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        style={{ fontSize: `${zoomLevel}%` }}
      >
        {/* LEFT COLUMN: Stimulus Text */}
        <div className="border-r border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto">
          {/* TEIL 1 STIMULUS */}
          {activeTeil === 1 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-xs uppercase font-bold text-orange-600 border-b pb-1">
                E-Mail von {exam.teil1.sourceContext}
              </div>
              <div className="font-semibold">{exam.teil1.emailGreeting},</div>
              <div className="leading-relaxed text-justify space-y-3 whitespace-pre-line text-sm text-slate-800 dark:text-slate-200">
                {exam.teil1.emailBody}
              </div>
              <div className="font-semibold pt-2">{exam.teil1.emailSignoff}</div>
            </div>
          )}

          {/* TEIL 2 STIMULUS */}
          {activeTeil === 2 && (
            <div className="max-w-xl mx-auto space-y-4">
              {currentQuestionNumber <= 9 ? (
                <>
                  <div className="text-xs uppercase font-bold text-orange-600">Text A • {exam.teil2.textA.kicker}</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{exam.teil2.textA.title}</h3>
                  <div className="text-xs text-slate-500 italic">Quelle: {exam.teil2.textA.source}</div>
                  <div className="space-y-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                    {exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs uppercase font-bold text-orange-600">Text B • {exam.teil2.textB.kicker}</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{exam.teil2.textB.title}</h3>
                  <div className="text-xs text-slate-500 italic">Quelle: {exam.teil2.textB.source}</div>
                  <div className="space-y-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                    {exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TEIL 3 STIMULUS (Advertisements A–J) */}
          {activeTeil === 3 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-xs uppercase font-bold text-orange-600 mb-2">
                Anzeigenpool (A–J)
              </div>
              <div className="grid grid-cols-1 gap-3">
                {exam.teil3.advertisements.map((ad) => (
                  <div key={ad.letter} className="border border-slate-300 dark:border-slate-700 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono font-bold flex items-center justify-center uppercase text-[11px]">
                        {ad.letter}
                      </span>
                      <strong className="text-slate-900 dark:text-white">{ad.title}</strong>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-1">{ad.body}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{ad.contact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 4 STIMULUS (Discussion topic & Leserbriefe) */}
          {activeTeil === 4 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-xs">
                <strong>Diskussionsthema:</strong> {exam.teil4.contextTopic}
                <div className="mt-1 font-semibold text-amber-900 dark:text-amber-300">
                  Frage: {exam.teil4.questionFraming}
                </div>
              </div>
              {(() => {
                const lb = exam.teil4.leserbriefe.find((l) => l.number === currentQuestionNumber);
                if (!lb) return null;
                return (
                  <div className="border border-slate-300 dark:border-slate-700 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                      Leserbrief von {lb.author}, {lb.age} Jahre ({lb.city}):
                    </div>
                    <p className="text-sm italic text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{lb.text}"
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TEIL 5 STIMULUS (Hausordnung / Rules) */}
          {activeTeil === 5 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-xs uppercase font-bold text-orange-600">Regelwerk / Benutzungsordnung</div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-2">
                {exam.teil5.sheetTitle}
              </h3>
              <div className="space-y-4 text-xs">
                {exam.teil5.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-1">{sec.title}</h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Question & Multiple Choice Input */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-mono font-bold flex items-center justify-center text-sm">
                #{currentQuestionNumber}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {answers[currentQuestionNumber] ? '✓ Beantwortet' : 'Noch offen'}
              </span>
            </div>

            {/* TEIL 1 QUESTION */}
            {activeTeil === 1 && (() => {
              const item = exam.teil1.items.find((i) => i.number === currentQuestionNumber);
              if (!item) return null;
              return (
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.statement}
                  </h4>
                  <div className="space-y-2 pt-2">
                    {(['Richtig', 'Falsch'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(currentQuestionNumber, opt)}
                        className={`w-full p-4 rounded-xl border text-left font-semibold text-sm flex items-center justify-between transition cursor-pointer ${
                          answers[currentQuestionNumber] === opt
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-orange-400'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          answers[currentQuestionNumber] === opt ? 'border-white bg-white text-orange-600 font-bold' : 'border-slate-400'
                        }`}>
                          {answers[currentQuestionNumber] === opt && '✓'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* TEIL 2 & 5 QUESTION (a / b / c) */}
            {(activeTeil === 2 || activeTeil === 5) && (() => {
              const item = activeTeil === 2
                ? [...exam.teil2.textA.items, ...exam.teil2.textB.items].find((i) => i.number === currentQuestionNumber)
                : exam.teil5.items.find((i) => i.number === currentQuestionNumber);
              if (!item) return null;
              return (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.question}
                  </h4>
                  <div className="space-y-2 pt-2">
                    {(['a', 'b', 'c'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(currentQuestionNumber, opt)}
                        className={`w-full p-4 rounded-xl border text-left font-medium text-sm flex items-start gap-3 transition cursor-pointer ${
                          answers[currentQuestionNumber] === opt
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-orange-400'
                        }`}
                      >
                        <span className="font-mono font-bold uppercase w-5">{opt})</span>
                        <span className="flex-1">{item.options[opt]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* TEIL 3 QUESTION (Advertisements A–J or 0) */}
            {activeTeil === 3 && (() => {
              const sit = exam.teil3.situations.find((s) => s.number === currentQuestionNumber);
              if (!sit) return null;
              return (
                <div className="space-y-4">
                  <div className="text-xs uppercase font-bold text-slate-500">Situation:</div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {sit.situation}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Wählen Sie die passende Anzeige (A–J) oder "0", wenn keine passt:
                  </p>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(currentQuestionNumber, opt)}
                        className={`py-3 rounded-xl border font-mono font-bold uppercase text-center text-sm transition cursor-pointer ${
                          (answers[currentQuestionNumber] || '').toLowerCase() === opt
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-orange-400'
                        }`}
                      >
                        {opt === '0' ? '0 (Keine)' : `Anzeige ${opt.toUpperCase()}`}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* TEIL 4 QUESTION (Ja / Nein) */}
            {activeTeil === 4 && (() => {
              const lb = exam.teil4.leserbriefe.find((l) => l.number === currentQuestionNumber);
              if (!lb) return null;
              return (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {exam.teil4.questionFraming}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ist {lb.author} für oder gegen diese Maßnahme?
                  </p>
                  <div className="space-y-2 pt-2">
                    {(['Ja', 'Nein'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(currentQuestionNumber, opt)}
                        className={`w-full p-4 rounded-xl border text-left font-semibold text-sm flex items-center justify-between transition cursor-pointer ${
                          answers[currentQuestionNumber] === opt
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-orange-400'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          answers[currentQuestionNumber] === opt ? 'border-white bg-white text-orange-600 font-bold' : 'border-slate-400'
                        }`}>
                          {answers[currentQuestionNumber] === opt && '✓'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Prev / Next Question Nav buttons */}
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
            <button
              disabled={currentQuestionNumber <= 1}
              onClick={() => setCurrentQuestionNumber((n) => Math.max(1, n - 1))}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'en' ? 'Previous' : 'Zurück'}</span>
            </button>

            <button
              disabled={currentQuestionNumber >= 30}
              onClick={() => setCurrentQuestionNumber((n) => Math.min(30, n + 1))}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow disabled:opacity-30 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Next' : 'Weiter'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM QUESTION NAVIGATOR GRID (1–30) */}
      <footer className="bg-slate-900 border-t border-slate-800 p-2 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((qNum) => {
              const isAnswered = Boolean(answers[qNum]);
              const isFlagged = Boolean(flagged[qNum]);
              const isCurrent = qNum === currentQuestionNumber;

              return (
                <button
                  key={qNum}
                  onClick={() => setCurrentQuestionNumber(qNum)}
                  className={`w-7 h-7 rounded text-[11px] font-mono font-bold flex items-center justify-center relative transition cursor-pointer ${
                    isCurrent
                      ? 'bg-orange-600 text-white ring-2 ring-white scale-110'
                      : isAnswered
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {qNum}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-black" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onExit()}
            className="px-3 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer ml-2"
          >
            {lang === 'en' ? 'Exit CBT' : 'CBT beenden'}
          </button>
        </div>
      </footer>

      {/* REVIEW & SUBMISSION MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-600" />
              <span>{lang === 'en' ? 'Confirm Exam Submission' : 'Prüfungsabgabe bestätigen'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en'
                ? `You have answered ${Object.keys(answers).length} of 30 questions.`
                : `Sie haben ${Object.keys(answers).length} von 30 Fragen beantwortet.`}
              {Object.keys(flagged).length > 0 &&
                (lang === 'en'
                  ? ` ${Object.keys(flagged).length} questions are flagged for review.`
                  : ` ${Object.keys(flagged).length} Fragen sind zur Prüfung markiert.`)}
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {lang === 'en' ? 'Continue Exam' : 'Weiter bearbeiten'}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setIsSubmitted(true);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow"
              >
                {lang === 'en' ? 'Submit Final Answers' : 'Jetzt verbindlich abgeben'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL DIAGNOSTIC REPORT MODAL */}
      {isSubmitted && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-8 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl ${
              passed ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <Award className="w-9 h-9" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                {lang === 'en' ? 'Official Examination Result' : 'Offizielles Prüfungsergebnis'}
              </div>
              <h2 className="text-2xl font-black mt-1">
                {passed
                  ? (lang === 'en' ? 'CONGRATULATIONS!' : 'HERZLICHEN GLÜCKWUNSCH!')
                  : (lang === 'en' ? 'EXAM NOT PASSED' : 'LEIDER NICHT BESTANDEN')}
              </h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {passed
                  ? (lang === 'en' ? 'Certificate B1 Passed (≥ 60 points)' : 'Zertifikat B1 bestanden (≥ 60 Punkte)')
                  : (lang === 'en' ? 'Passing threshold of 60 points not reached' : 'Mindestpunktzahl 60 Punkte verfehlt')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  {lang === 'en' ? 'Raw Score' : 'Rohpunkte'}
                </span>
                <span className="text-2xl font-black font-mono">{rawScore} / 30</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  {lang === 'en' ? 'Scaled Score' : 'Skalierte Punkte'}
                </span>
                <span className={`text-2xl font-black font-mono ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {scaledScore} / 100
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => onExit()}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white shadow-md transition"
              >
                {lang === 'en' ? 'Back to Overview' : 'Zurück zur Übersicht'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
