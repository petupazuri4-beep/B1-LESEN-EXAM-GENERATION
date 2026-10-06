import React, { useState, useEffect, useRef } from 'react';
import { ExamModel, ExamStyleConfig, DEFAULT_SPACE_LINE_CONFIG } from './types/exam';
import { loadAllExams, saveExam, saveAllExams, resetToDefaultExams } from './utils/storage';
import { exportExamToDocx, exportAnswerKeyToDocx } from './utils/docxExport';
import { exportExamBundleZip, exportAllExamsZip, generateExamSummaryText } from './utils/zipExport';
import {
  generatePdfFromHtmlElement,
  downloadBlob,
  generateVectorCandidatePdf,
  generateVectorSolutionsPdf,
  generateVectorAnswerSheetPdf,
} from './utils/pdfExport';
import { Language, translations } from './utils/i18n';
import { AppThemeId, APP_THEMES } from './utils/theme';

// Components
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OfficialExamPaper } from './components/OfficialExamPaper';
import { AnswerSheetPaper } from './components/AnswerSheetPaper';
import { AnswerKeyPaper } from './components/AnswerKeyPaper';
import { ExamEditor } from './components/ExamEditor';
import { InteractiveTestMode } from './components/InteractiveTestMode';
import { TeacherSplitPreview } from './components/TeacherSplitPreview';
import { VisualAnswerSheetScanner } from './components/VisualAnswerSheetScanner';
import { B1LinterPanel } from './components/B1LinterPanel';
import { KeyDistributionWidget } from './components/KeyDistributionWidget';
import { StylePanel } from './components/StylePanel';
import { AppSettingsSection } from './components/AppSettingsSection';
import { ValidationModal } from './components/ValidationModal';
import { ProctorProtocolModal } from './components/ProctorProtocolModal';
import { ExamDownloadModal } from './components/ExamDownloadModal';
import { AiTestGeneratorModal } from './components/AiTestGeneratorModal';
import { BottomNavBar } from './components/BottomNavBar';
import { CbtExamScreenPreview } from './components/CbtExamScreenPreview';
import { StreamlinedPreviewBar, PreviewMode } from './components/preview/StreamlinedPreviewBar';
import { AccessibleReaderPreview } from './components/preview/AccessibleReaderPreview';
import { DigitalExamPreview } from './components/preview/DigitalExamPreview';

// Icons
import {
  LayoutDashboard,
  FileText,
  KeyRound,
  Edit3,
  Clock,
  Split,
  Scan,
  FileCheck2,
  BarChart3,
  Sliders,
  Download,
  Printer,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  RotateCcw,
  Languages,
  CheckCircle2,
  ChevronRight,
  Layers,
  Archive,
  BookOpen,
  Info,
  Monitor,
} from 'lucide-react';

export default function App() {
  const [exams, setExams] = useState<ExamModel[]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'paper' | 'answerSheet' | 'key' | 'split' | 'scanner' | 'editor' | 'test' | 'linter' | 'distribution' | 'style'
  >('dashboard');

  // Preview sub-mode for the paper tab
  const [previewMode, setPreviewMode] = useState<PreviewMode>('paper');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Full-screen CBT mode trigger
  const [isFullScreenCbt, setIsFullScreenCbt] = useState<boolean>(false);

  // Modals state
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState<boolean>(false);
  const [showProctorModal, setShowProctorModal] = useState<boolean>(false);

  // Appearance & Theme State
  const [lang, setLang] = useState<Language>('de');
  const [themeId, setThemeId] = useState<AppThemeId>('goethe');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const t = translations[lang];
  const currentTheme = APP_THEMES[themeId] || APP_THEMES.goethe;

  // Refs for PDF capturing
  const examPaperRef = useRef<HTMLDivElement>(null);
  const answerKeyRef = useRef<HTMLDivElement>(null);
  const offscreenCandidateRef = useRef<HTMLDivElement>(null);
  const offscreenAnswerKeyRef = useRef<HTMLDivElement>(null);

  // Load exams from storage on startup
  useEffect(() => {
    loadAllExams().then((loadedExams) => {
      setExams(loadedExams);
      setLoading(false);
    });
  }, []);

  const currentExam = exams[currentExamIndex] || null;

  // Auto-save exam updates
  const handleUpdateCurrentExam = (updated: ExamModel) => {
    setIsSaving(true);
    setExams((prev) => {
      const copy = [...prev];
      copy[currentExamIndex] = updated;
      return copy;
    });

    saveExam(updated).then(() => {
      setTimeout(() => setIsSaving(false), 400);
    });
  };

  // Reset to original 10 Goethe B1 exams
  const handleResetDefaults = async () => {
    const confirmText = lang === 'en'
      ? 'Reset all 10 exams to official defaults? Any custom edits will be replaced.'
      : 'Alle 10 Prüfungen auf den offiziellen Originalzustand zurücksetzen? Ihre Änderungen werden überschrieben.';
    if (window.confirm(confirmText)) {
      setLoading(true);
      const defaults = await resetToDefaultExams();
      setExams(defaults);
      setCurrentExamIndex(0);
      setLoading(false);
    }
  };

  // Export handlers
  const handleDownloadCandidateDocx = async (exam: ExamModel) => {
    const blob = await exportExamToDocx(exam);
    const numStr = String(exam.examNumber).padStart(2, '0');
    downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Kandidatenblatt.docx`);
  };

  const handleDownloadSolutionsDocx = async (exam: ExamModel) => {
    const blob = await exportAnswerKeyToDocx(exam);
    const numStr = String(exam.examNumber).padStart(2, '0');
    downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Loesungen.docx`);
  };

  const handleDownloadCandidatePdf = async (exam: ExamModel) => {
    // Prefer visible DOM if currently on active unzoomed paper tab, otherwise use dedicated offscreen container
    const targetEl = (activeTab === 'paper' && previewMode === 'paper' && zoomLevel === 100 && examPaperRef.current)
      ? examPaperRef.current
      : offscreenCandidateRef.current;

    const numStr = String(exam.examNumber).padStart(2, '0');
    if (targetEl) {
      try {
        const blob = await generatePdfFromHtmlElement(targetEl, `Goethe_B1_Lesen_Satz_${numStr}.pdf`);
        downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Kandidatenblatt.pdf`);
        return;
      } catch (err) {
        console.warn('DOM PDF generation failed, switching to offline vector engine:', err);
      }
    }
    // High-reliability offline vector fallback
    const vectorBlob = await generateVectorCandidatePdf(exam);
    downloadBlob(vectorBlob, `Goethe_B1_Lesen_Satz_${numStr}_Kandidatenblatt_Vektor.pdf`);
  };

  const handleDownloadVectorCandidatePdf = async (exam: ExamModel) => {
    const numStr = String(exam.examNumber).padStart(2, '0');
    const blob = await generateVectorCandidatePdf(exam);
    downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Kandidatenblatt_Vektor.pdf`);
  };

  const handleDownloadSolutionsPdf = async (exam: ExamModel) => {
    const targetEl = (activeTab === 'key' && answerKeyRef.current)
      ? answerKeyRef.current
      : offscreenAnswerKeyRef.current;

    const numStr = String(exam.examNumber).padStart(2, '0');
    if (targetEl) {
      try {
        const blob = await generatePdfFromHtmlElement(targetEl, `Goethe_B1_Lesen_Loesungen_Satz_${numStr}.pdf`);
        downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Loesungen.pdf`);
        return;
      } catch (err) {
        console.warn('DOM Solutions PDF failed, switching to offline vector engine:', err);
      }
    }
    // High-reliability offline vector fallback
    const vectorBlob = await generateVectorSolutionsPdf(exam);
    downloadBlob(vectorBlob, `Goethe_B1_Lesen_Satz_${numStr}_Loesungen_Vektor.pdf`);
  };

  const handleDownloadVectorSolutionsPdf = async (exam: ExamModel) => {
    const numStr = String(exam.examNumber).padStart(2, '0');
    const blob = await generateVectorSolutionsPdf(exam);
    downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Loesungen_Vektor.pdf`);
  };

  const handleDownloadVectorAnswerSheetPdf = async (exam: ExamModel) => {
    const numStr = String(exam.examNumber).padStart(2, '0');
    const blob = await generateVectorAnswerSheetPdf(exam);
    downloadBlob(blob, `Goethe_B1_Lesen_Satz_${numStr}_Antwortbogen_S30_OMR.pdf`);
  };

  const handleDownloadZip = async (exam: ExamModel) => {
    const candidateEl = (activeTab === 'paper' && previewMode === 'paper' && zoomLevel === 100 && examPaperRef.current)
      ? examPaperRef.current
      : offscreenCandidateRef.current;

    const solutionsEl = (activeTab === 'key' && answerKeyRef.current)
      ? answerKeyRef.current
      : offscreenAnswerKeyRef.current;

    let candidatePdfBlob: Blob | undefined;
    let solutionsPdfBlob: Blob | undefined;

    if (candidateEl) {
      try {
        candidatePdfBlob = await generatePdfFromHtmlElement(candidateEl, 'kandidat.pdf');
      } catch (err) {
        console.warn('Could not compile candidate PDF for zip:', err);
      }
    }
    // Offline Vector fallback for zip candidate booklet
    if (!candidatePdfBlob) {
      try {
        candidatePdfBlob = await generateVectorCandidatePdf(exam);
      } catch (e) {
        console.warn('Vector candidate fallback failed:', e);
      }
    }

    if (solutionsEl) {
      try {
        solutionsPdfBlob = await generatePdfFromHtmlElement(solutionsEl, 'loesung.pdf');
      } catch (err) {
        console.warn('Could not compile solutions PDF for zip:', err);
      }
    }
    // Offline Vector fallback for zip solutions guide
    if (!solutionsPdfBlob) {
      try {
        solutionsPdfBlob = await generateVectorSolutionsPdf(exam);
      } catch (e) {
        console.warn('Vector solutions fallback failed:', e);
      }
    }

    const zipBlob = await exportExamBundleZip(exam, candidatePdfBlob, solutionsPdfBlob);
    const numStr = String(exam.examNumber).padStart(2, '0');
    downloadBlob(zipBlob, `Goethe_B1_Lesen_Satz_${numStr}_Gesamtpaket.zip`);
  };

  const handleDownloadJson = (exam: ExamModel) => {
    const numStr = String(exam.examNumber).padStart(2, '0');
    const jsonStr = JSON.stringify(exam, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, `b1_lesen_exam_${numStr}.json`);
  };

  const handleDownloadTxt = (exam: ExamModel) => {
    const numStr = String(exam.examNumber).padStart(2, '0');
    const text = generateExamSummaryText(exam);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `b1_lesen_exam_${numStr}_uebersicht.txt`);
  };

  const handleDownloadAllTenZip = async () => {
    await exportAllExamsZip(exams);
  };

  // AI Exam generation callback
  const handleExamCreated = (newExam: ExamModel) => {
    setExams((prev) => {
      const existingIdx = prev.findIndex((e) => e.examNumber === newExam.examNumber);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newExam;
        return copy;
      }
      return [...prev, newExam];
    });
    setCurrentExamIndex(exams.length);
    saveExam(newExam);
  };

  if (loading || !currentExam) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center font-black text-2xl shadow-xl animate-pulse mb-4">
          B1
        </div>
        <h2 className="text-xl font-bold tracking-tight">B1 Lesen Exam Studio</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">10 authentische Goethe- & ÖSD-Modellsätze laden...</p>
      </div>
    );
  }

  // Full-screen CBT Mode
  if (isFullScreenCbt) {
    return <CbtExamScreenPreview exam={currentExam} onExit={() => setIsFullScreenCbt(false)} lang={lang} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 pb-20 sm:pb-24 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* 1. TOP HEADER */}
      <Header
        selectedExamTitle={currentExam.title}
        currentExamNumber={currentExam.examNumber}
        lang={lang}
        isSaving={isSaving}
        themeConfig={currentTheme}
        darkMode={darkMode}
        onNavigateHome={() => setActiveTab('dashboard')}
      />

      {/* 2. SUB-BAR: EXAM CAROUSEL / SELECTOR */}
      <div className="no-print bg-slate-900 border-b border-slate-800 py-2.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* 10 Exam Pills Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              {lang === 'en' ? 'Exam Sets:' : 'Übungssätze:'}
            </span>
            {exams.map((exam, idx) => {
              const isSelected = idx === currentExamIndex;
              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    setCurrentExamIndex(idx);
                    if (activeTab === 'dashboard') setActiveTab('paper');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${exam.title} (${exam.theme})`}
                >
                  <span className="font-mono">#{String(exam.examNumber).padStart(2, '0')}</span>
                  <span className="hidden lg:inline text-[11px] opacity-90 max-w-[120px] truncate">
                    {exam.theme.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Utility Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={handleDownloadAllTenZip}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1.5 border border-emerald-600 transition shadow-sm cursor-pointer"
              title="Alle 10 Prüfungen als DOCX, JSON & TXT herunterladen"
            >
              <Archive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Export 10 Sets (ZIP)' : 'Alle 10 Sätze (ZIP)'}</span>
            </button>

            <button
              onClick={() => setShowAiGeneratorModal(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-1.5 border border-purple-500 transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>{lang === 'en' ? 'AI Generator' : 'KI-Generator'}</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
              title="Sprache wechseln / Switch Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Reset button */}
            <button
              onClick={handleResetDefaults}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition cursor-pointer"
              title={lang === 'en' ? 'Reset to defaults' : 'Auf Werkseinstellungen zurücksetzen'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY VIEW NAVIGATION TABS */}
      <div className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-14 z-30 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 py-2">
            {[
              { id: 'dashboard', labelDe: 'Übersicht', labelEn: 'Dashboard', icon: LayoutDashboard },
              { id: 'paper', labelDe: 'Prüfungsbogen', labelEn: 'Exam Paper', icon: FileText },
              { id: 'answerSheet', labelDe: 'Antwortbogen S30', labelEn: 'Answer Sheet', icon: BookOpen },
              { id: 'key', labelDe: 'Lösungsschlüssel', labelEn: 'Answer Key', icon: KeyRound },
              { id: 'split', labelDe: 'Lehrer-Dualansicht', labelEn: 'Teacher Split View', icon: Split },
              { id: 'scanner', labelDe: 'Antwort-Scanner', labelEn: 'Answer Scanner', icon: Scan },
              { id: 'editor', labelDe: 'Editor', labelEn: 'Editor', icon: Edit3 },
              { id: 'test', labelDe: 'CBT Simulation', labelEn: 'CBT Simulation', icon: Clock },
              { id: 'linter', labelDe: 'B1-Linter', labelEn: 'B1 Linter', icon: FileCheck2 },
              { id: 'distribution', labelDe: 'Schlüssel-Balance', labelEn: 'Key Distribution', icon: BarChart3 },
              { id: 'style', labelDe: 'Layout & Stil', labelEn: 'Style & Layout', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? tab.labelEn : tab.labelDe}</span>
                </button>
              );
            })}
          </div>

          {/* Action Bar on the right */}
          <div className="flex items-center gap-2 shrink-0 py-2">
            <button
              onClick={() => setShowValidationModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">{lang === 'en' ? 'Validate' : 'Validierung'}</span>
            </button>

            <button
              onClick={() => setShowProctorModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">{lang === 'en' ? 'Proctor Log' : 'Protokoll'}</span>
            </button>

            <button
              onClick={() => setShowDownloadModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Export' : 'Exportieren'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        {/* TAB 0: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard
            exams={exams}
            selectedExamIndex={currentExamIndex}
            onSelectExam={(idx) => setCurrentExamIndex(idx)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenDownloadModal={(exam) => {
              setCurrentExamIndex(exams.findIndex((e) => e.id === exam.id));
              setShowDownloadModal(true);
            }}
            onDownloadAllZip={handleDownloadAllTenZip}
            onOpenAiGenerator={() => setShowAiGeneratorModal(true)}
            lang={lang}
          />
        )}

        {/* TAB 1: OFFICIAL EXAM PAPER & PREVIEWS */}
        {activeTab === 'paper' && (
          <div className="space-y-6">
            {/* Streamlined Multi-Modal Preview Bar */}
            <StreamlinedPreviewBar
              mode={previewMode}
              onChangeMode={(m) => setPreviewMode(m)}
              zoomLevel={zoomLevel}
              onChangeZoom={(z) => setZoomLevel(z)}
              onPrint={() => window.print()}
              lang={lang}
            />

            {/* Mode 1: A4 Official Paper */}
            {previewMode === 'paper' && (
              <div ref={examPaperRef} id="exam-paper-container" style={{ zoom: `${zoomLevel}%` }}>
                <OfficialExamPaper
                  exam={currentExam}
                  lang={lang}
                  onUpdateExam={handleUpdateCurrentExam}
                />
              </div>
            )}

            {/* Mode 2: Digital CBT Screen */}
            {previewMode === 'digital' && (
              <DigitalExamPreview exam={currentExam} lang={lang} />
            )}

            {/* Mode 3: Split Dual-View */}
            {previewMode === 'split' && (
              <TeacherSplitPreview exam={currentExam} lang={lang} />
            )}

            {/* Mode 4: Accessible Reader */}
            {previewMode === 'accessible' && (
              <AccessibleReaderPreview exam={currentExam} lang={lang} />
            )}
          </div>
        )}

        {/* TAB 2: ANSWER SHEET S30 */}
        {activeTab === 'answerSheet' && (
          <AnswerSheetPaper exam={currentExam} lang={lang} />
        )}

        {/* TAB 3: ANSWER KEY & RATIONALE */}
        {activeTab === 'key' && (
          <div className="space-y-6">
            <div ref={answerKeyRef} id="solutions-container">
              <AnswerKeyPaper exam={currentExam} lang={lang} />
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER SPLIT DUAL VIEW */}
        {activeTab === 'split' && (
          <TeacherSplitPreview exam={currentExam} lang={lang} />
        )}

        {/* TAB 5: OPTICAL ANSWER SHEET SCANNER */}
        {activeTab === 'scanner' && (
          <VisualAnswerSheetScanner exam={currentExam} lang={lang} />
        )}

        {/* TAB 6: FULL EXAM EDITOR */}
        {activeTab === 'editor' && (
          <ExamEditor
            exam={currentExam}
            onUpdateExam={handleUpdateCurrentExam}
            lang={lang}
          />
        )}

        {/* TAB 7: INTERACTIVE TEST MODE / CBT */}
        {activeTab === 'test' && (
          <DigitalExamPreview exam={currentExam} lang={lang} />
        )}

        {/* TAB 8: CEFR B1 LINTER */}
        {activeTab === 'linter' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-600" />
                <span>{lang === 'en' ? 'CEFR B1 Vocabulary & Sentence Length Linter' : 'GER B1-Wortschatz- & Satzlängen-Prüfer'}</span>
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'en'
                  ? 'Official Goethe/ÖSD B1 level criteria: sentence lengths (8–15 words optimal), word counts per Teil, and CEFR vocabulary distribution.'
                  : 'Offizielle Goethe/ÖSD B1-Kriterien: Satzlängen (8–15 Wörter optimal), Wortzahl-Vorgaben je Teil und Wortschatz-Einstufung.'}
              </p>

              <div className="space-y-4">
                <B1LinterPanel
                  text={`${currentExam.teil1.emailGreeting}\n\n${currentExam.teil1.emailBody}\n\n${currentExam.teil1.emailSignoff}`}
                  targetType="teil1"
                  title="Teil 1: E-Mail / Persönliche Korrespondenz (Ziel: 200–260 Wörter)"
                  lang={lang}
                />

                <B1LinterPanel
                  text={currentExam.teil2.textA.bodyParagraphs.join('\n\n')}
                  targetType="teil2A"
                  title={`Teil 2: Text A – ${currentExam.teil2.textA.title} (Ziel: 130–180 Wörter)`}
                  lang={lang}
                />

                <B1LinterPanel
                  text={currentExam.teil2.textB.bodyParagraphs.join('\n\n')}
                  targetType="teil2B"
                  title={`Teil 2: Text B – ${currentExam.teil2.textB.title} (Ziel: 130–180 Wörter)`}
                  lang={lang}
                />

                <B1LinterPanel
                  text={currentExam.teil5.sections.map((s) => `${s.title}\n${s.content}`).join('\n\n')}
                  targetType="teil5"
                  title={`Teil 5: Regelwerk – ${currentExam.teil5.sheetTitle} (Ziel: 250–320 Wörter)`}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: KEY DISTRIBUTION & BALANCE */}
        {activeTab === 'distribution' && (
          <div className="max-w-4xl mx-auto">
            <KeyDistributionWidget exam={currentExam} lang={lang} />
          </div>
        )}

        {/* TAB 10: STYLE & LAYOUT */}
        {activeTab === 'style' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <StylePanel
              styleConfig={currentExam.styleConfig}
              onChangeStyle={(newConfig) => {
                handleUpdateCurrentExam({
                  ...currentExam,
                  styleConfig: newConfig,
                });
              }}
              onApplyToAll={() => {
                const updatedAll = exams.map((e) => ({
                  ...e,
                  styleConfig: currentExam.styleConfig,
                }));
                setExams(updatedAll);
                saveAllExams(updatedAll);
                alert(lang === 'en' ? 'Style applied to all 10 exams!' : 'Stil auf alle 10 Prüfungen übertragen!');
              }}
              lang={lang}
            />

            <AppSettingsSection
              currentThemeId={themeId}
              onChangeTheme={(newId) => setThemeId(newId)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* 5. BOTTOM NAVIGATION BAR DOCK */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        lang={lang}
        exams={exams}
        currentExamIndex={currentExamIndex}
        currentExamNumber={currentExam.examNumber}
        totalExams={exams.length}
        onSelectExam={(idx) => setCurrentExamIndex(idx)}
        onPrevExam={() => setCurrentExamIndex(Math.max(0, currentExamIndex - 1))}
        onNextExam={() => setCurrentExamIndex(Math.min(exams.length - 1, currentExamIndex + 1))}
        onOpenExport={() => setShowDownloadModal(true)}
        onOpenValidation={() => setShowValidationModal(true)}
        onTriggerFullScreenCbt={() => setIsFullScreenCbt(true)}
        previewMode={previewMode}
        onChangePreviewMode={(mode) => setPreviewMode(mode)}
        onOpenAiGenerator={() => setShowAiGeneratorModal(true)}
        onDownloadAllTenZip={handleDownloadAllTenZip}
        onToggleLang={() => setLang(lang === 'de' ? 'en' : 'de')}
        onResetDefaults={handleResetDefaults}
        onOpenProctorProtocol={() => setShowProctorModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* 6. MODALS */}
      {showDownloadModal && (
        <ExamDownloadModal
          exam={currentExam}
          onClose={() => setShowDownloadModal(false)}
          lang={lang}
          onDownloadZip={handleDownloadZip}
          onDownloadCandidatePdf={handleDownloadCandidatePdf}
          onDownloadVectorCandidatePdf={handleDownloadVectorCandidatePdf}
          onDownloadCandidateDocx={handleDownloadCandidateDocx}
          onDownloadSolutionsPdf={handleDownloadSolutionsPdf}
          onDownloadVectorSolutionsPdf={handleDownloadVectorSolutionsPdf}
          onDownloadVectorAnswerSheetPdf={handleDownloadVectorAnswerSheetPdf}
          onDownloadSolutionsDocx={handleDownloadSolutionsDocx}
          onDownloadTxt={handleDownloadTxt}
          onDownloadJson={handleDownloadJson}
          onUpdateExam={handleUpdateCurrentExam}
        />
      )}

      {showValidationModal && (
        <ValidationModal
          exam={currentExam}
          onClose={() => setShowValidationModal(false)}
          lang={lang}
        />
      )}

      {showProctorModal && (
        <ProctorProtocolModal
          exam={currentExam}
          onClose={() => setShowProctorModal(false)}
          lang={lang}
        />
      )}

      {showAiGeneratorModal && (
        <AiTestGeneratorModal
          nextExamNumber={exams.length + 1}
          onClose={() => setShowAiGeneratorModal(false)}
          onExamCreated={handleExamCreated}
          onOpenExamView={(id, mode) => {
            const idx = exams.findIndex((e) => e.id === id);
            if (idx >= 0) setCurrentExamIndex(idx);
            if (mode === 'solutions') setActiveTab('key');
            else if (mode === 'editor') setActiveTab('editor');
            else if (mode === 'interactive') setActiveTab('test');
            else setActiveTab('paper');
          }}
          onDownloadZip={handleDownloadZip}
          onDownloadCandidatePdf={handleDownloadCandidatePdf}
          onDownloadCandidateDocx={handleDownloadCandidateDocx}
          onDownloadSolutionsPdf={handleDownloadSolutionsPdf}
          lang={lang}
        />
      )}

      {/* Dedicated off-screen render host for tab-independent, pristine PDF generation */}
      <div
        id="offscreen-pdf-host"
        aria-hidden="true"
        className="fixed pointer-events-none select-none overflow-hidden"
        style={{
          top: 0,
          left: '-99999px',
          width: '794px', // Standard 96 DPI A4 width (210mm)
          zIndex: -9999,
          opacity: 0,
        }}
      >
        <div ref={offscreenCandidateRef}>
          <OfficialExamPaper exam={currentExam} lang={lang} />
        </div>
        <div ref={offscreenAnswerKeyRef}>
          <AnswerKeyPaper exam={currentExam} lang={lang} />
        </div>
      </div>
    </div>
  );
}
