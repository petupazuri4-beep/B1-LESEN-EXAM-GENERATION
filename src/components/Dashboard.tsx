import React from 'react';
import { ExamModel } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import {
  BookOpen,
  FileText,
  KeyRound,
  Play,
  Edit3,
  Download,
  CheckCircle2,
  Sparkles,
  Archive,
  Clock,
  Layers,
  Award,
  ShieldCheck,
  ChevronRight,
  Split,
  Scan,
} from 'lucide-react';

interface Props {
  exams: ExamModel[];
  selectedExamIndex: number;
  onSelectExam: (index: number) => void;
  onNavigateTab: (tab: 'paper' | 'answerSheet' | 'key' | 'split' | 'scanner' | 'editor' | 'test') => void;
  onOpenDownloadModal: (exam: ExamModel) => void;
  onDownloadAllZip: () => void;
  onOpenAiGenerator: () => void;
  lang?: Language;
}

export const Dashboard: React.FC<Props> = ({
  exams,
  selectedExamIndex,
  onSelectExam,
  onNavigateTab,
  onOpenDownloadModal,
  onDownloadAllZip,
  onOpenAiGenerator,
  lang = 'de',
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-orange-950 text-white p-6 sm:p-10 border border-slate-700/60 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Offizieller Goethe- & ÖSD-Prüfungsstandard B1</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            10 Vollständige Modellsätze <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Zertifikat B1 • Modul LESEN
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {lang === 'en'
              ? 'Complete authentic mock exam collection matching official test specifications: 5 parts, 30 items per set, 65 minutes, printable A4 candidate papers, S30 answer sheets, rationale explanations, and instant auto-grading.'
              : 'Vollständige Sammlung prüfungskonformer Modellsätze nach den offiziellen Vorgaben: 5 Teile, 30 Aufgaben pro Satz, 65 Minuten, druckfertige A4-Kandidatenbögen, Antwortbögen S30, didaktische Begründungen und automatische Korrektur.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('paper')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-95 cursor-pointer ring-2 ring-orange-400/40"
              title={lang === 'en' ? 'Start Active Exam' : 'Prüfung starten'}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'en' ? 'Start Active Exam' : 'Prüfung starten (Start)'}</span>
            </button>

            <button
              onClick={onDownloadAllZip}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Archive className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'en' ? 'Download All 10 Sets (ZIP)' : 'Alle 10 Sätze exportieren (ZIP)'}</span>
            </button>

            <button
              onClick={onOpenAiGenerator}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>{lang === 'en' ? 'Create with AI' : 'KI-Generator'}</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics on Right */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/60 backdrop-blur p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">
              {lang === 'en' ? 'Mock Sets' : 'Modellsätze'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">10</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Fully articulated' : 'Komplett ausgearbeitet'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">
              {lang === 'en' ? 'Exam Questions' : 'Prüfungsfragen'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-orange-400 font-mono">300</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'With rationale & quotes' : 'Mit Begründung & Beleg'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">
              {lang === 'en' ? 'Exam Duration' : 'Prüfungszeit'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">65 Min</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Per READING module' : 'Pro Modul LESEN'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">
              {lang === 'en' ? 'Passing Mark' : 'Bestehensgrenze'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">60%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Min. 18 / 30 tasks' : 'Min. 18 / 30 Aufgaben'}
            </span>
          </div>
        </div>
      </div>

      {/* Exam Grid: 10 Authentic Sets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-600" />
              <span>{lang === 'en' ? 'Overview of All 10 Exam Sets' : 'Übersicht der 10 Modellsätze'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'en'
                ? 'Select any exam set to review candidate papers, solutions, teacher rationale, or run interactive simulation.'
                : 'Wählen Sie einen Modellsatz für Prüfungspapier, Antwortbogen S30, Lösungen oder Simulation.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam, index) => {
            const isSelected = index === selectedExamIndex;

            return (
              <div
                key={exam.id}
                className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-500 shadow-md ring-1 ring-orange-500/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-9 h-9 rounded-xl font-mono font-bold flex items-center justify-center text-sm ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}>
                        #{String(exam.examNumber).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {exam.title}
                        </h3>
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {exam.theme}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 shrink-0">
                      {lang === 'en' ? 'B1 Ready' : 'B1 Bereit'}
                    </span>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-3 gap-2 my-3 text-[11px] bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="block text-slate-400 text-[10px]">
                        {lang === 'en' ? 'Location' : 'Prüfungsort'}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {exam.candidateInfo.city}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">
                        {lang === 'en' ? 'Institution' : 'Institution'}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {exam.candidateInfo.institution.split(' ')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">
                        {lang === 'en' ? 'Scope' : 'Umfang'}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {lang === 'en' ? '5 Parts • 30 Pts.' : '5 Teile • 30 Pkt.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('paper');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-orange-400/50"
                      title={lang === 'en' ? 'Start this exam' : 'Diesen Satz starten'}
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{lang === 'en' ? 'Start' : 'Start'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('paper');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'en' ? 'Open Exam Paper' : 'Prüfungspapier öffnen'}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Paper' : 'Papier'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('answerSheet');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'en' ? 'Open Answer Sheet S30' : 'Antwortbogen S30 öffnen'}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>S30</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('key');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'en' ? 'Answer Key & Didactics' : 'Lösungsschlüssel & Didaktik'}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Key' : 'Lösung'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('test');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'en' ? 'Start 65-min simulation' : '65-Minuten Prüfungssimulation starten'}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Test' : 'Test'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectExam(index);
                        onNavigateTab('editor');
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      title={lang === 'en' ? 'Edit in Exam Editor' : 'Im Editor bearbeiten'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenDownloadModal(exam)}
                      className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-sm transition cursor-pointer"
                      title={lang === 'en' ? 'Export (PDF, DOCX, ZIP)' : 'Exportieren (PDF, DOCX, ZIP)'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
