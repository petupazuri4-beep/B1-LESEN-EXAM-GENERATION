import React, { useState } from 'react';
import { Language } from '../utils/i18n';
import { ExamModel } from '../types/exam';
import { PreviewMode } from './preview/StreamlinedPreviewBar';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  KeyRound,
  Clock,
  Split,
  Scan,
  Edit3,
  FileCheck2,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  ShieldCheck,
  Maximize2,
  Monitor,
  Eye,
  Layers,
  Sparkles,
  Archive,
  Languages,
  RotateCcw,
  FolderOpen,
  X,
  SlidersHorizontal,
  ClipboardCheck,
  Moon,
  Sun,
  AlertTriangle,
  Check,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  lang?: Language;
  exams?: ExamModel[];
  currentExamIndex?: number;
  currentExamNumber?: number;
  totalExams?: number;
  onSelectExam?: (index: number) => void;
  onPrevExam?: () => void;
  onNextExam?: () => void;
  onOpenExport?: () => void;
  onOpenValidation?: () => void;
  onTriggerFullScreenCbt?: () => void;
  previewMode?: PreviewMode;
  onChangePreviewMode?: (mode: PreviewMode) => void;
  onOpenAiGenerator?: () => void;
  onDownloadAllTenZip?: () => void;
  onToggleLang?: () => void;
  onResetDefaults?: () => void;
  onOpenProctorProtocol?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const BottomNavBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  lang = 'de',
  exams = [],
  currentExamIndex = 0,
  currentExamNumber = 1,
  totalExams = 10,
  onSelectExam,
  onPrevExam,
  onNextExam,
  onOpenExport,
  onOpenValidation,
  onTriggerFullScreenCbt,
  previewMode = 'paper',
  onChangePreviewMode,
  onOpenAiGenerator,
  onDownloadAllTenZip,
  onToggleLang,
  onResetDefaults,
  onOpenProctorProtocol,
  darkMode = false,
  onToggleDarkMode,
}) => {
  // State for the slide-up shelf directly above the bottom dock
  const [isShelfOpen, setIsShelfOpen] = useState<boolean>(false);
  // State for the consolidated 'Actions' overflow menu
  const [isActionsOpen, setIsActionsOpen] = useState<boolean>(false);
  // State for safety confirmation inside Actions reset
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  // Temporary indicator after action
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const isExamActive = activeTab === 'paper' || activeTab === 'split';
  const effectiveMode: PreviewMode = activeTab === 'split' ? 'split' : previewMode;

  const handleSelectExamMode = (mode: PreviewMode) => {
    onSelectTab('paper');
    onChangePreviewMode?.(mode);
  };

  // Main navigation tabs (Start button explicitly labeled and primary)
  const navItems = [
    {
      id: 'dashboard',
      labelDe: 'Start',
      labelEn: 'Start',
      shortDe: 'Start',
      shortEn: 'Start',
      icon: LayoutDashboard,
    },
    {
      id: 'answerSheet',
      labelDe: 'Antwortbogen S30',
      labelEn: 'Answer Sheet',
      shortDe: 'S30',
      shortEn: 'S30',
      icon: BookOpen,
    },
    {
      id: 'key',
      labelDe: 'Lösungsschlüssel',
      labelEn: 'Answer Key',
      shortDe: 'Lösung',
      shortEn: 'Key',
      icon: KeyRound,
    },
    {
      id: 'scanner',
      labelDe: 'Antwort-Scanner',
      labelEn: 'OMR Scanner',
      shortDe: 'Scan',
      shortEn: 'Scan',
      icon: Scan,
    },
    {
      id: 'editor',
      labelDe: 'Editor',
      labelEn: 'Editor',
      shortDe: 'Edit',
      shortEn: 'Edit',
      icon: Edit3,
    },
    {
      id: 'test',
      labelDe: 'CBT Simulation (65m)',
      labelEn: 'CBT Simulation (65m)',
      shortDe: 'CBT',
      shortEn: 'CBT',
      icon: Clock,
    },
    {
      id: 'linter',
      labelDe: 'B1 Prüfungs-Linter',
      labelEn: 'B1 Exam Linter',
      shortDe: 'Linter',
      shortEn: 'Linter',
      icon: FileCheck2,
    },
    {
      id: 'distribution',
      labelDe: 'Schlüssel-Balance',
      labelEn: 'Key Balance',
      shortDe: 'Statistik',
      shortEn: 'Stats',
      icon: BarChart3,
    },
    {
      id: 'style',
      labelDe: 'Layout & Stil',
      labelEn: 'Style & Layout',
      shortDe: 'Stil',
      shortEn: 'Style',
      icon: Sliders,
    },
  ];

  return (
    <footer className="no-print fixed bottom-0 left-0 right-0 z-40 text-slate-200 select-none">
      {/* Feedback Toast */}
      {actionNotice && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. EXPANDED BOTTOM SHELF: Cleaned up to focus on Exam Sets and Batch Actions */}
      {isShelfOpen && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900/98 dark:bg-slate-950/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Exam Set Pills (#01 - #10) */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-thin">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  {lang === 'en' ? 'Exam Sets:' : 'Übungssätze:'}
                </span>

                {exams.map((exam, idx) => {
                  const isSelected = idx === currentExamIndex;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => {
                        onSelectExam?.(idx);
                        if (activeTab === 'dashboard') {
                          onSelectTab('paper');
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30 scale-102 ring-1 ring-orange-400/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                      }`}
                      title={`${exam.title} (${exam.theme})`}
                    >
                      <span className="font-mono">#{String(exam.examNumber).padStart(2, '0')}</span>
                      <span className="hidden xl:inline text-[11px] opacity-90 max-w-[110px] truncate">
                        {exam.theme.split('&')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Utility Tools Cluster: Primary Batch Operations */}
              <div className="flex items-center gap-2 self-end lg:self-auto shrink-0 flex-wrap">
                {onDownloadAllTenZip && (
                  <button
                    type="button"
                    onClick={onDownloadAllTenZip}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1.5 border border-emerald-600 transition shadow-sm cursor-pointer"
                    title={lang === 'en' ? 'Download all 10 exams as ZIP' : 'Alle 10 Prüfungen als ZIP herunterladen'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {lang === 'en' ? 'Export 10 Sets (ZIP)' : 'Alle 10 Sätze (ZIP)'}
                    </span>
                  </button>
                )}

                {onOpenAiGenerator && (
                  <button
                    type="button"
                    onClick={onOpenAiGenerator}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-1.5 border border-purple-500 transition shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                    <span>{lang === 'en' ? 'AI Generator' : 'KI-Generator'}</span>
                  </button>
                )}

                {/* Direct link to Actions from shelf */}
                <button
                  type="button"
                  onClick={() => {
                    setIsShelfOpen(false);
                    setIsActionsOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  title={lang === 'en' ? 'Open Actions & Settings' : 'Aktionen & Einstellungen öffnen'}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">
                    {lang === 'en' ? 'Actions...' : 'Aktionen...'}
                  </span>
                </button>

                {/* Close Shelf Button */}
                <button
                  type="button"
                  onClick={() => setIsShelfOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer ml-1"
                  title={lang === 'en' ? 'Close Shelf' : 'Schließen'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONSOLIDATED 'ACTIONS' OVERFLOW MENU POPOVER */}
      {isActionsOpen && (
        <>
          {/* Backdrop for click-away */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => {
              setIsActionsOpen(false);
              setShowResetConfirm(false);
            }}
          />

          {/* Frosted Actions Popover Panel */}
          <div className="fixed bottom-14 right-2 sm:right-4 z-50 w-[95vw] max-w-[390px] bg-slate-900/98 dark:bg-slate-950/98 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Actions & Settings' : 'Aktionen & Einstellungen'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'en' ? 'Consolidated tools & exam options' : 'Globale Werkzeuge & Prüfungsoptionen'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsActionsOpen(false);
                  setShowResetConfirm(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={lang === 'en' ? 'Close' : 'Schließen'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="space-y-2">
              {/* Item 1: Language Switcher */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-600/40 flex items-center justify-center text-blue-400 shrink-0">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{lang === 'en' ? 'Language' : 'Sprachauswahl'}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 uppercase font-semibold">
                        {lang}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'de'
                        ? 'Offizielle deutsche Prüfungsbegriffe'
                        : 'English instructions & guides active'}
                    </div>
                  </div>
                </div>

                {onToggleLang && (
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (lang !== 'de') onToggleLang();
                        triggerNotice('Sprache: Deutsch (DE)');
                      }}
                      className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                        lang === 'de'
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      DE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (lang !== 'en') onToggleLang();
                        triggerNotice('Language: English (EN)');
                      }}
                      className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                        lang === 'en'
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>

              {/* Item 2: Proctor Protocol Viewing */}
              {onOpenProctorProtocol && (
                <button
                  type="button"
                  onClick={() => {
                    setIsActionsOpen(false);
                    onOpenProctorProtocol();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 transition flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-900/50 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{lang === 'en' ? 'Proctor Protocol (Aufsicht)' : 'Prüfungsprotokoll & Aufsicht'}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/40 border border-amber-700/60 text-amber-300 font-semibold">
                          A4
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'en'
                          ? 'Printable verbatim script, room protocol & timing log'
                          : 'Wörtlicher Ansagetext, Raumprotokoll & Zeittabelle (1-Seiter)'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition" />
                </button>
              )}

              {/* Item 3: Appearance / Dark Mode Toggle */}
              {onToggleDarkMode && (
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-600/40 flex items-center justify-center text-indigo-400 shrink-0">
                      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {lang === 'en' ? 'Theme / Dark Mode' : 'Erscheinungsbild'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {darkMode
                          ? (lang === 'en' ? 'Dark mode enabled • Switch to Light' : 'Dunkelmodus aktiv • Zu Hell wechseln')
                          : (lang === 'en' ? 'Light mode enabled • Switch to Dark' : 'Hellmodus aktiv • Zu Dunkel wechseln')}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {darkMode ? 'Dark' : 'Light'}
                  </div>
                </button>
              )}

              {/* Item 4: Exam Reset Functionality (with confirmation safety) */}
              {onResetDefaults && (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 transition">
                  {!showResetConfirm ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 shrink-0">
                          <RotateCcw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            {lang === 'en' ? 'Reset Exam Defaults' : 'Auf Werkseinstellungen zurücksetzen'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {lang === 'en'
                              ? 'Revert all 10 mock sets to official Goethe/ÖSD baseline'
                              : 'Stellt alle 10 Modellsätze & Antworten auf den Originalzustand zurück'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-700 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-600 hover:border-rose-500 transition cursor-pointer shrink-0"
                      >
                        {lang === 'en' ? 'Reset' : 'Reset'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 py-1">
                      <div className="flex items-start gap-2 text-rose-300 text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">
                            {lang === 'en' ? 'Confirm Full Reset?' : 'Wirklich zurücksetzen?'}
                          </span>
                          <span className="text-[10px] text-rose-200/80">
                            {lang === 'en'
                              ? 'All custom edits across all 10 exams will be reverted to pristine official state.'
                              : 'Alle manuellen Bearbeitungen und Texte werden auf die Standard-Prüfungsdaten zurückgesetzt.'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(false)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition cursor-pointer"
                        >
                          {lang === 'en' ? 'Cancel' : 'Abbrechen'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowResetConfirm(false);
                            setIsActionsOpen(false);
                            onResetDefaults();
                            triggerNotice(lang === 'en' ? 'All exams reset to defaults' : 'Alle Sätze auf Werkseinstellungen zurückgesetzt');
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-sm"
                        >
                          {lang === 'en' ? 'Yes, Reset Now' : 'Ja, zurücksetzen'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Examination Quick Specs Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Goethe- / ÖSD-Zertifikat B1 • Modul LESEN</span>
              <span className="font-mono text-slate-300">65 Min • 30 Pkt</span>
            </div>
          </div>
        </>
      )}

      {/* 3. DOCKED BOTTOM NAVIGATION BAR (Always visible) */}
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-1 sm:gap-2">
          {/* Left: Expandable Exam Set Trigger & Stepper */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsShelfOpen(!isShelfOpen);
                if (isActionsOpen) setIsActionsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                isShelfOpen
                  ? 'bg-orange-600 text-white border-orange-500 shadow-orange-600/30 ring-2 ring-orange-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700/80 hover:border-slate-600'
              }`}
              title={
                lang === 'en'
                  ? 'Toggle 10 Exam Sets & AI Generator Tools Shelf'
                  : '10 Übungssätze & KI-Tools Leiste ein-/ausklappen'
              }
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 hidden sm:inline">
                {lang === 'en' ? 'Set' : 'Satz'}
              </span>
              <span className="font-mono text-xs font-bold text-orange-400">
                #{String(currentExamNumber).padStart(2, '0')}/{totalExams}
              </span>
              {isShelfOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Previous / Next Stepper */}
            {onPrevExam && onNextExam && (
              <div className="hidden sm:flex items-center gap-0.5 bg-slate-800/80 border border-slate-700/80 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={onPrevExam}
                  disabled={currentExamNumber <= 1}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition cursor-pointer"
                  title={lang === 'en' ? 'Previous Exam' : 'Vorheriger Satz'}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNextExam}
                  disabled={currentExamNumber >= totalExams}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition cursor-pointer"
                  title={lang === 'en' ? 'Next Exam' : 'Nächster Satz'}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Center: Primary Navigation Tabs with Integrated "Together / Dual" Segmented Pill */}
          <nav
            aria-label="Hauptnavigation unten"
            className="flex-1 flex items-center justify-start sm:justify-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-1"
          >
            {/* 1. START / DASHBOARD TAB - Accessible, Touch-Friendly, and Explicitly Clickable */}
            {(() => {
              const item = navItems[0];
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid="start-tab-btn"
                  onClick={() => {
                    setIsShelfOpen(false);
                    setIsActionsOpen(false);
                    if (activeTab === 'dashboard') {
                      onSelectTab('paper');
                    } else {
                      onSelectTab(item.id);
                    }
                  }}
                  className={`flex flex-col items-center justify-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer shrink-0 relative group min-w-[50px] min-h-[44px] ${
                    isActive
                      ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/30 ring-1 ring-orange-400/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-700'
                  }`}
                  title={
                    lang === 'en'
                      ? (isActive ? 'Start Active Exam' : 'Start / Dashboard')
                      : (isActive ? 'Prüfung starten' : 'Start / Übersicht')
                  }
                  aria-label="Start"
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                  <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight font-bold">
                    Start
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                  )}
                </button>
              );
            })()}

            {/* 2. CONSOLIDATED EXAM PILL: [ 📄 Einzeln (A4) | 👥 Zusammen (Dual) | 💻 CBT | 👁️ Reader ] */}
            <div
              className={`flex items-center shrink-0 rounded-xl p-0.5 sm:p-1 gap-0.5 transition-all ${
                isExamActive
                  ? 'bg-slate-800/95 border border-orange-500/50 ring-1 ring-orange-500/30 shadow-md shadow-orange-950/30'
                  : 'bg-slate-800/60 border border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="hidden xl:flex items-center gap-1 px-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {lang === 'en' ? 'Exam' : 'Bogen'}
                </span>
              </div>

              {/* Segment 1: Einzeln (A4 Official Paper) */}
              <button
                type="button"
                onClick={() => handleSelectExamMode('paper')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  isExamActive && effectiveMode === 'paper'
                    ? 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/30 ring-1 ring-orange-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title={
                  lang === 'en'
                    ? 'Single A4 Official Exam Paper (Print layout)'
                    : 'Einzeln: Offizieller A4 Prüfungsbogen (Drucklayout)'
                }
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] whitespace-nowrap">
                  <span className="hidden sm:inline">
                    {lang === 'en' ? 'Single (A4)' : 'Einzeln (A4)'}
                  </span>
                  <span className="inline sm:hidden">A4</span>
                </span>
                {isExamActive && effectiveMode === 'paper' && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </button>

              {/* Segment 2: Zusammen (Teacher Split Dual-View) */}
              <button
                type="button"
                onClick={() => handleSelectExamMode('split')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  isExamActive && effectiveMode === 'split'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-md shadow-amber-600/30 ring-1 ring-amber-400/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title={
                  lang === 'en'
                    ? 'Together: Synchronized side-by-side reading text and pedagogical rationale'
                    : 'Zusammen: Lesetext und didaktische Aufgabenanalyse synchron nebeneinander (Dualansicht)'
                }
              >
                <Split className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                <span className="text-[10px] sm:text-[11px] whitespace-nowrap">
                  <span className="hidden md:inline">
                    {lang === 'en' ? 'Together (Dual)' : 'Zusammen (Dual)'}
                  </span>
                  <span className="inline md:hidden">Dual</span>
                </span>
                {isExamActive && effectiveMode === 'split' && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-300 ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Segment 3: Digital CBT Screen */}
              <button
                type="button"
                onClick={() => handleSelectExamMode('digital')}
                className={`hidden sm:flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  isExamActive && effectiveMode === 'digital'
                    ? 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/30 ring-1 ring-orange-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title={
                  lang === 'en'
                    ? 'Digital CBT Screen Preview'
                    : 'Digitaler CBT-Prüfungsbildschirm'
                }
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] whitespace-nowrap">CBT</span>
                {isExamActive && effectiveMode === 'digital' && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </button>

              {/* Segment 4: Accessible Reader Mode */}
              <button
                type="button"
                onClick={() => handleSelectExamMode('accessible')}
                className={`hidden md:flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  isExamActive && effectiveMode === 'accessible'
                    ? 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/30 ring-1 ring-orange-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title={
                  lang === 'en'
                    ? 'Accessible Reader Mode (High contrast & focus)'
                    : 'Barrierefreier Lesemodus (Großschrift & Kontrast)'
                }
              >
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] whitespace-nowrap">Reader</span>
                {isExamActive && effectiveMode === 'accessible' && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </button>
            </div>

            {/* 3. Remaining Main Tabs */}
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsShelfOpen(false);
                    setIsActionsOpen(false);
                    onSelectTab(item.id);
                  }}
                  className={`flex flex-col items-center justify-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer shrink-0 relative group min-h-[44px] ${
                    isActive
                      ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/30 ring-1 ring-orange-400/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-700'
                  }`}
                  title={lang === 'en' ? item.labelEn : item.labelDe}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                  <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight font-medium">
                    <span className="hidden sm:inline">
                      {lang === 'en' ? item.labelEn : item.labelDe}
                    </span>
                    <span className="inline sm:hidden">
                      {lang === 'en' ? item.shortEn : item.shortDe}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Action Shortcuts & 'Actions' Overflow Menu Trigger */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1 border-l border-slate-800">
            {/* AI Generator Shortcut (Desktop) */}
            {onOpenAiGenerator && (
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="hidden xl:flex px-2 py-1 rounded-lg text-xs font-semibold bg-purple-700/80 hover:bg-purple-600 text-purple-100 hover:text-white border border-purple-500/70 items-center gap-1 transition shadow-sm cursor-pointer"
                title={lang === 'en' ? 'AI Exam Generator' : 'KI-Prüfungsgenerator'}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span className="text-[11px]">{lang === 'en' ? 'AI Gen' : 'KI-Gen'}</span>
              </button>
            )}

            {/* Validation / Audit Shortcut (Desktop) */}
            {onOpenValidation && (
              <button
                type="button"
                onClick={onOpenValidation}
                className="hidden lg:flex px-2 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 items-center gap-1 transition shadow-sm cursor-pointer"
                title={lang === 'en' ? 'Check Exam Rules' : 'Prüfung validieren'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">{lang === 'en' ? 'Audit' : 'Prüfen'}</span>
              </button>
            )}

            {/* Export Bundle Shortcut (Desktop & Tablet) */}
            {onOpenExport && (
              <button
                type="button"
                onClick={onOpenExport}
                className="hidden md:flex px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white items-center gap-1.5 shadow-sm transition cursor-pointer"
                title={lang === 'en' ? 'Export Exam Bundle' : 'Prüfung exportieren'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px]">{lang === 'en' ? 'Export' : 'Export'}</span>
              </button>
            )}

            {/* CONSOLIDATED 'ACTIONS' OVERFLOW MENU TRIGGER (Visible on ALL devices) */}
            <button
              type="button"
              onClick={() => {
                setIsActionsOpen(!isActionsOpen);
                if (isShelfOpen) setIsShelfOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm shrink-0 min-h-[38px] ${
                isActionsOpen
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30 ring-2 ring-orange-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700/80 hover:border-slate-600'
              }`}
              title={
                lang === 'en'
                  ? 'Actions & Global Settings (Language, Proctor Protocol, Reset)'
                  : 'Aktionen & Globale Einstellungen (Sprache, Aufsichtsprotokoll, Reset)'
              }
              aria-label="Aktionen Menü"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-semibold hidden sm:inline">
                {lang === 'en' ? 'Actions' : 'Aktionen'}
              </span>
              {isActionsOpen ? (
                <ChevronDown className="w-3 h-3 text-slate-300" />
              ) : (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
