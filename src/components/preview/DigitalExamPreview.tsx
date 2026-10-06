import React, { useState } from 'react';
import { ExamModel } from '../../types/exam';
import { CbtExamScreenPreview } from '../CbtExamScreenPreview';
import { Language } from '../../utils/i18n';
import { Monitor, Maximize2, Sparkles, Play } from 'lucide-react';

interface Props {
  exam: ExamModel;
  onExit?: () => void;
  lang?: Language;
}

export const DigitalExamPreview: React.FC<Props> = ({
  exam,
  onExit = () => {},
  lang = 'de',
}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  if (isFullScreen) {
    return <CbtExamScreenPreview exam={exam} onExit={() => setIsFullScreen(false)} lang={lang} />;
  }

  return (
    <div className="space-y-4">
      {/* Launch Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-slate-700/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Monitor className="w-4 h-4" />
            <span>Digitales Testzentrum • Computer-Based Testing (CBT)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {lang === 'en' ? 'Digital B1 Exam Simulation' : 'Offizielle Digitale Prüfungssimulation'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            {lang === 'en'
              ? 'Realistic full-screen exam client matching the Goethe-Institut / ÖSD digital testing environment: question progress bar, flagging, 65-min timer, and instant automated evaluation.'
              : 'Realitätsnahe Vollbild-Prüfungsoberfläche wie am Goethe-Institut / ÖSD: Aufgabenleiste 1–30, Merken-Funktion, 65-Minuten-Countdown und direkte Testauswertung.'}
          </p>
        </div>

        <button
          onClick={() => setIsFullScreen(true)}
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{lang === 'en' ? 'Launch Digital Exam' : 'Simulation im Vollbild starten'}</span>
        </button>
      </div>

      {/* Embedded Laptop Preview Frame */}
      <div className="border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl h-[700px] flex flex-col">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono text-[11px] ml-2 text-slate-300">
              Goethe-Institut Exam Browser • Modellsatz #{String(exam.examNumber).padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => setIsFullScreen(true)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Fullscreen' : 'Vollbild'}</span>
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <CbtExamScreenPreview exam={exam} onExit={() => {}} lang={lang} />
        </div>
      </div>
    </div>
  );
};
