import React, { useState, useEffect } from 'react';
import { ExamModel } from '../types/exam';
import { convertRawToScaledScore, isPassingScore } from '../utils/scoreConversion';
import { translations, Language } from '../utils/i18n';
import { Clock, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface Props {
  exam: ExamModel;
  onExit: () => void;
  lang?: Language;
}

export const InteractiveTestMode: React.FC<Props> = ({ exam, onExit, lang = 'de' }) => {
  const t = translations[lang];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(65 * 60); // 65 min
  const [timerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTeil, setActiveTeil] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Timer effect
  useEffect(() => {
    if (!timerRunning || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, isSubmitted]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (itemNumber: number, answer: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [itemNumber]: answer,
    }));
  };

  // Calculate results
  const calculateResults = () => {
    let rawScore = 0;
    const itemResults: Record<number, boolean> = {};

    // Teil 1 (1-6)
    exam.teil1.items.forEach(i => {
      const isCorrect = answers[i.number] === i.correctAnswer;
      itemResults[i.number] = isCorrect;
      if (isCorrect) rawScore++;
    });

    // Teil 2 (7-12)
    [...exam.teil2.textA.items, ...exam.teil2.textB.items].forEach(i => {
      const isCorrect = (answers[i.number] || '').toLowerCase() === i.correctAnswer.toLowerCase();
      itemResults[i.number] = isCorrect;
      if (isCorrect) rawScore++;
    });

    // Teil 3 (13-19)
    exam.teil3.situations.forEach(s => {
      const isCorrect = (answers[s.number] || '').toLowerCase() === s.correctAnswer.toLowerCase();
      itemResults[s.number] = isCorrect;
      if (isCorrect) rawScore++;
    });

    // Teil 4 (20-26)
    exam.teil4.leserbriefe.forEach(lb => {
      const isCorrect = answers[lb.number] === lb.correctAnswer;
      itemResults[lb.number] = isCorrect;
      if (isCorrect) rawScore++;
    });

    // Teil 5 (27-30)
    exam.teil5.items.forEach(i => {
      const isCorrect = (answers[i.number] || '').toLowerCase() === i.correctAnswer.toLowerCase();
      itemResults[i.number] = isCorrect;
      if (isCorrect) rawScore++;
    });

    const scaledScore = convertRawToScaledScore(rawScore);
    const passed = isPassingScore(rawScore);
    return { rawScore, scaledScore, passed, itemResults };
  };

  const results = isSubmitted ? calculateResults() : null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 text-slate-100">
      {/* Top Interactive Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-lg">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold tracking-wide">{t.interactiveBadge}</span>
          <h2 className="text-lg font-bold text-white">{exam.title}</h2>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg font-mono text-sm" title={t.timeRemaining}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span className={timeLeftSeconds < 300 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-200'}>
              {formatTime(timeLeftSeconds)}
            </span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
            >
              {t.submitExam}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSubmitted(false);
                setAnswers({});
                setTimeLeftSeconds(65 * 60);
              }}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.restartExam}
            </button>
          )}

          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg cursor-pointer"
          >
            {t.backToOverview}
          </button>
        </div>
      </div>

      {/* Results banner if submitted */}
      {isSubmitted && results && (
        <div className={`p-6 rounded-xl border mb-6 ${results.passed ? 'bg-emerald-950/60 border-emerald-600' : 'bg-rose-950/60 border-rose-600'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${results.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {results.passed ? t.statusPassed : t.statusFailed}
                </h3>
                <p className="text-sm text-slate-300">
                  {t.passCriteria}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">{t.totalScore}</div>
                <div className="text-2xl font-black font-mono text-white">
                  {results.rawScore} / 30
                </div>
              </div>
              <div className="text-center bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">{t.scaledScore}</div>
                <div className={`text-2xl font-black font-mono ${results.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.scaledScore} / 100
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teil Navigation tabs */}
      <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 mb-6 overflow-x-auto">
        {([1, 2, 3, 4, 5] as const).map(pNum => {
          const isActive = activeTeil === pNum;
          const tabLabel = lang === 'en' ? `Part ${pNum}` : `Teil ${pNum}`;
          return (
            <button
              key={pNum}
              onClick={() => setActiveTeil(pNum)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Active Teil Interactive Body */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        {activeTeil === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'en' ? 'Part 1: Reading Correspondence (True / False)' : 'Teil 1: Korrespondenz lesen'}
              </h3>
              <p className="text-xs text-slate-400 italic mb-2">{exam.teil1.instruction}</p>
              {lang === 'en' && (
                <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 mb-4">
                  💡 <strong>Guide:</strong> {t.teil1Guide}
                </p>
              )}
              
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 text-sm leading-relaxed text-slate-200 mb-6 max-h-80 overflow-y-auto font-sans">
                <div className="font-bold text-amber-400 mb-2">{exam.teil1.emailGreeting}</div>
                {exam.teil1.emailBody.split('\n\n').map((p, idx) => (
                  <p key={idx} className="mb-2.5">{p}</p>
                ))}
                <div className="font-bold text-amber-400 whitespace-pre-line mt-3">{exam.teil1.emailSignoff}</div>
              </div>
            </div>

            <div className="space-y-4">
              {exam.teil1.items.map(item => {
                const isSelected = answers[item.number];
                const isCorrect = results?.itemResults[item.number];
                return (
                  <div key={item.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-xs text-amber-400">
                        {item.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-100">{item.statement}</p>
                        {isSubmitted && (
                          <p className="text-xs mt-1 text-slate-400">
                            {lang === 'en' ? 'Official Solution:' : 'Offizielle Lösung:'} <strong className="text-amber-400">{item.correctAnswer}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-9 sm:pl-0">
                      {(['Richtig', 'Falsch'] as const).map(choice => {
                        const displayChoice = choice === 'Richtig' ? t.trueOption : t.falseOption;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelectAnswer(item.number, choice)}
                            className={`px-3 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                              isSelected === choice
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {displayChoice}
                          </button>
                        );
                      })}
                      {isSubmitted && (
                        <div className="ml-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTeil === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'en' ? 'Part 2: Press Articles & 3-Choice Multiple Choice' : 'Teil 2: Artikel lesen & Mehrfachauswahl'}
              </h3>
              <p className="text-xs text-slate-400 italic mb-2">{exam.teil2.instruction}</p>
              {lang === 'en' && (
                <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 mb-4">
                  💡 <strong>Guide:</strong> {t.teil2Guide}
                </p>
              )}
            </div>

            {/* Text A */}
            <div className="border border-slate-700 rounded-lg p-5 bg-slate-900/60 mb-6">
              <h4 className="text-sm font-bold text-amber-400 uppercase mb-2">{exam.teil2.textA.title}</h4>
              <div className="text-xs text-slate-300 leading-relaxed space-y-2 mb-4">
                {exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                {exam.teil2.textA.items.map(item => {
                  const isSelected = answers[item.number];
                  const isCorrect = results?.itemResults[item.number];
                  return (
                    <div key={item.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{item.number} • {item.question}</span>
                        {isSubmitted && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div className="space-y-2 pl-2">
                        {(['a', 'b', 'c'] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(item.number, opt)}
                            className={`w-full text-left p-2 rounded text-xs border flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected === opt
                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <span className="font-bold uppercase font-mono">[{opt}]</span>
                            <span>{item.options[opt]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Text B */}
            <div className="border border-slate-700 rounded-lg p-5 bg-slate-900/60">
              <h4 className="text-sm font-bold text-amber-400 uppercase mb-2">{exam.teil2.textB.title}</h4>
              <div className="text-xs text-slate-300 leading-relaxed space-y-2 mb-4">
                {exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                {exam.teil2.textB.items.map(item => {
                  const isSelected = answers[item.number];
                  const isCorrect = results?.itemResults[item.number];
                  return (
                    <div key={item.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{item.number} • {item.question}</span>
                        {isSubmitted && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div className="space-y-2 pl-2">
                        {(['a', 'b', 'c'] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(item.number, opt)}
                            className={`w-full text-left p-2 rounded text-xs border flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected === opt
                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <span className="font-bold uppercase font-mono">[{opt}]</span>
                            <span>{item.options[opt]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTeil === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'en' ? 'Part 3: Matching Situations to Advertisements (13–19)' : 'Teil 3: Zuordnung (Situationen 13–19)'}
              </h3>
              <p className="text-xs text-slate-400 italic mb-2">{exam.teil3.instruction}</p>
              {lang === 'en' && (
                <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 mb-2">
                  💡 <strong>Guide:</strong> {t.teil3Guide}
                </p>
              )}
              <p className="text-xs font-semibold text-amber-400 bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
                {exam.teil3.contextDescription}
              </p>
            </div>

            {/* Situations with buttons for A-J or 0 */}
            <div className="space-y-4">
              {exam.teil3.situations.map(sit => {
                const selected = answers[sit.number] || '';
                const isCorrect = results?.itemResults[sit.number];
                return (
                  <div key={sit.id} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-200">
                        {sit.number}. {sit.situation}
                      </span>
                      {isSubmitted && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {lang === 'en' ? 'Solution:' : 'Lösung:'} <strong className="text-amber-400">{sit.correctAnswer.toUpperCase()}</strong>
                          </span>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map(letter => {
                        const isZero = letter === '0';
                        const label = isZero ? (lang === 'en' ? '0 (No match)' : '0 (Keine)') : letter.toUpperCase();
                        return (
                          <button
                            key={letter}
                            onClick={() => handleSelectAnswer(sit.number, letter)}
                            className={`h-7 px-2 rounded text-xs font-bold font-mono border transition-all cursor-pointer ${
                              selected.toLowerCase() === letter.toLowerCase()
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ads Reference Grid */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {lang === 'en' ? 'Available Advertisements (A to J)' : 'Verfügbare Anzeigen (A bis J)'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exam.teil3.advertisements.map(ad => (
                  <div key={ad.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-bold font-mono flex items-center justify-center text-xs">
                        {ad.letter.toUpperCase()}
                      </span>
                      <strong className="text-slate-100">{ad.title}</strong>
                    </div>
                    <p className="text-slate-300 text-[11px] mb-1">{ad.body}</p>
                    <p className="text-[10px] text-slate-400 italic">{ad.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTeil === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'en' ? 'Part 4: Reader Letters & Opinion (Items 20–26)' : 'Teil 4: Leserbriefe (Aufgaben 20–26)'}
              </h3>
              <p className="text-xs text-slate-400 italic mb-2">{exam.teil4.instruction}</p>
              {lang === 'en' && (
                <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 mb-2">
                  💡 <strong>Guide:</strong> {t.teil4Guide}
                </p>
              )}
              <p className="text-xs font-semibold text-amber-400 bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
                {exam.teil4.contextTopic}
              </p>
            </div>

            <div className="space-y-4">
              {exam.teil4.leserbriefe.map(lb => {
                const isSelected = answers[lb.number];
                const isCorrect = results?.itemResults[lb.number];
                return (
                  <div key={lb.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-[75%]">
                      <div className="font-bold text-xs text-white mb-1">
                        {lb.number}. {lb.author} ({lb.age}), {lb.city}
                      </div>
                      <p className="text-xs text-slate-300 italic">„{lb.text}“</p>
                      {isSubmitted && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          {lang === 'en' ? 'Solution:' : 'Lösung:'} <strong className="text-amber-400">{lb.correctAnswer}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {(['Ja', 'Nein'] as const).map(choice => {
                        const displayChoice = choice === 'Ja' ? t.yesOption : t.noOption;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelectAnswer(lb.number, choice)}
                            className={`px-4 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                              isSelected === choice
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {displayChoice}
                          </button>
                        );
                      })}
                      {isSubmitted && (
                        <div className="ml-2">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTeil === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'en' ? 'Part 5: Rules & Regulations (Items 27–30)' : 'Teil 5: Hausordnung & Vorschriften'}
              </h3>
              <p className="text-xs text-slate-400 italic mb-2">{exam.teil5.instruction}</p>
              {lang === 'en' && (
                <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 mb-2">
                  💡 <strong>Guide:</strong> {t.teil5Guide}
                </p>
              )}
              <p className="text-xs font-semibold text-amber-400 bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
                {exam.teil5.contextSituation}
              </p>
            </div>

            {/* Rules Sheet */}
            <div className="border border-slate-700 rounded-lg p-5 bg-slate-900/80 mb-6">
              <h4 className="text-sm font-bold text-white uppercase text-center mb-3">
                {exam.teil5.sheetTitle}
              </h4>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                {exam.teil5.sections.map((sec, idx) => (
                  <div key={idx}>
                    <strong className="text-amber-400">{sec.title}: </strong>
                    <span>{sec.content}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 27 - 30 */}
            <div className="space-y-4">
              {exam.teil5.items.map(item => {
                const isSelected = answers[item.number];
                const isCorrect = results?.itemResults[item.number];
                return (
                  <div key={item.id} className="p-4 bg-slate-900/60 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">{item.number}. {item.question}</span>
                      {isSubmitted && (
                        isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div className="space-y-2 pl-2">
                      {(['a', 'b', 'c'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(item.number, opt)}
                          className={`w-full text-left p-2 rounded text-xs border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected === opt
                              ? 'bg-amber-500/20 border-amber-500 text-white'
                              : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="font-bold uppercase font-mono">[{opt}]</span>
                          <span>{item.options[opt]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
