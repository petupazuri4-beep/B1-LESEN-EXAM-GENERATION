import React, { useState } from 'react';
import { ExamModel, SpaceLineConfig, DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import {
  X,
  Download,
  FileText,
  FileCheck,
  Archive,
  FileCode,
  Loader2,
  CheckCircle2,
  Sparkles,
  AlignJustify,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Printer,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { testOfflinePdfEngine } from '../utils/pdfExport';

interface Props {
  exam: ExamModel;
  onClose: () => void;
  lang?: Language;
  onDownloadZip: (exam: ExamModel) => Promise<void>;
  onDownloadCandidatePdf: (exam: ExamModel) => Promise<void>;
  onDownloadVectorCandidatePdf?: (exam: ExamModel) => Promise<void>;
  onDownloadCandidateDocx: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsPdf: (exam: ExamModel) => Promise<void>;
  onDownloadVectorSolutionsPdf?: (exam: ExamModel) => Promise<void>;
  onDownloadVectorAnswerSheetPdf?: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsDocx: (exam: ExamModel) => Promise<void>;
  onDownloadTxt: (exam: ExamModel) => void;
  onDownloadJson: (exam: ExamModel) => void;
  onUpdateExam?: (exam: ExamModel) => void;
}

export const ExamDownloadModal: React.FC<Props> = ({
  exam,
  onClose,
  lang = 'de',
  onDownloadZip,
  onDownloadCandidatePdf,
  onDownloadVectorCandidatePdf,
  onDownloadCandidateDocx,
  onDownloadSolutionsPdf,
  onDownloadVectorSolutionsPdf,
  onDownloadVectorAnswerSheetPdf,
  onDownloadSolutionsDocx,
  onDownloadTxt,
  onDownloadJson,
  onUpdateExam,
}) => {
  const t = translations[lang];
  const [currentExam, setCurrentExam] = useState<ExamModel>(exam);
  const [showSpaceSettings, setShowSpaceSettings] = useState<boolean>(true);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [offlineStatus, setOfflineStatus] = useState<'verified' | 'testing'>('verified');

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTestOfflineEngine = async () => {
    setOfflineStatus('testing');
    await testOfflinePdfEngine();
    setTimeout(() => setOfflineStatus('verified'), 300);
  };

  const numStr = String(currentExam.examNumber).padStart(2, '0');
  const currentSpaceLines: SpaceLineConfig =
    currentExam.styleConfig?.spaceLines || DEFAULT_SPACE_LINE_CONFIG;

  const updateSpaceLines = (partial: Partial<SpaceLineConfig>) => {
    const updatedExam: ExamModel = {
      ...currentExam,
      styleConfig: {
        ...currentExam.styleConfig,
        spaceLines: {
          ...currentSpaceLines,
          ...partial,
        },
      },
    };
    setCurrentExam(updatedExam);
    onUpdateExam?.(updatedExam);
  };

  const executeDownload = async (taskName: string, action: () => Promise<void> | void) => {
    setActiveTask(taskName);
    setDownloadSuccess(null);
    setDownloadError(null);
    try {
      await action();
      setDownloadSuccess(taskName);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 3500);
    } catch (err: any) {
      console.error(err);
      setDownloadError(err?.message || (lang === 'en' ? 'Export failed. Please try again.' : 'Fehler beim Erstellen der Datei.'));
      setTimeout(() => {
        setDownloadError(null);
      }, 5000);
    } finally {
      setActiveTask(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {lang === 'en' ? `Exam Set ${numStr}` : `Modellsatz ${numStr}`}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {exam.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  30 {lang === 'en' ? 'Items' : 'Aufgaben'} • 65 Min
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                {exam.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {downloadError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{downloadError}</span>
            </div>
          )}

          {/* 100% Client-Side Offline Creation Capabilities Badge */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-white">
                  <span>{lang === 'en' ? '100% Client-Side Offline PDF Engine' : '100% Offline-PDF-Synthese (Client-Side)'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {isOffline ? (lang === 'en' ? 'Offline Mode Active' : 'Offline-Modus aktiv') : (lang === 'en' ? 'Ready' : 'Bereit')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {lang === 'en'
                    ? 'All PDFs and ZIP archives compile 100% in local browser memory with zero network calls or server dependencies.'
                    : 'Alle Prüfungs-PDFs und ZIP-Archive werden 100% lokal im Browser berechnet – ideal für gesicherte Prüfungsräume ohne Internet.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleTestOfflineEngine}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-mono font-bold transition cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
              title="Testet die clientseitige jsPDF-Engine im Browser"
            >
              {offlineStatus === 'testing' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                  <span>Prüfe...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'en' ? 'Engine Verified' : 'Engine Bereit'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-300">
            {t.downloadModalSubtitle}
          </p>

          {/* Space Line & Download Layout Customizer */}
          <div className="bg-slate-800/90 border border-slate-750 rounded-xl overflow-hidden shadow-lg">
            <button
              onClick={() => setShowSpaceSettings(!showSpaceSettings)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <AlignJustify className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {t.downloadLayoutSettings}
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.2 rounded font-semibold">
                      {currentSpaceLines.showNoteLines
                        ? `${currentSpaceLines.linesCount} ${lang === 'en' ? 'Note Lines' : 'Notizzeilen'} (${currentSpaceLines.lineStyle})`
                        : lang === 'en'
                        ? 'Clean (No Note Lines)'
                        : 'Ohne Notizzeilen'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.downloadLayoutDesc}
                  </p>
                </div>
              </div>
              <div className="text-slate-400 ml-2">
                {showSpaceSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showSpaceSettings && (
              <div className="p-4 border-t border-slate-700/80 bg-slate-850 space-y-3.5 text-xs">
                {/* Presets Row */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300">{t.spaceLinePresets}:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      onClick={() => updateSpaceLines({ showNoteLines: false, linesCount: 0 })}
                      className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                        !currentSpaceLines.showNoteLines
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold">Standard Clean</div>
                      <div className="text-[9px] opacity-75">Ohne Notizzeilen</div>
                    </button>
                    <button
                      onClick={() =>
                        updateSpaceLines({
                          showNoteLines: true,
                          linesCount: 4,
                          lineStyle: 'dotted',
                          lineSpacingMm: 8,
                        })
                      }
                      className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'dotted' &&
                        currentSpaceLines.linesCount === 4
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold">4 Gepunktet</div>
                      <div className="text-[9px] opacity-75">Prüfungsstandard</div>
                    </button>
                    <button
                      onClick={() =>
                        updateSpaceLines({
                          showNoteLines: true,
                          linesCount: 6,
                          lineStyle: 'solid',
                          lineSpacingMm: 9,
                        })
                      }
                      className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'solid' &&
                        currentSpaceLines.linesCount === 6
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold">6 Liniert</div>
                      <div className="text-[9px] opacity-75">Viel Schreibplatz</div>
                    </button>
                    <button
                      onClick={() =>
                        updateSpaceLines({
                          showNoteLines: true,
                          linesCount: 2,
                          lineStyle: 'dashed',
                          lineSpacingMm: 6,
                        })
                      }
                      className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'dashed' &&
                        currentSpaceLines.linesCount === 2
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold">2 Kompakt</div>
                      <div className="text-[9px] opacity-75">Papiersparend</div>
                    </button>
                  </div>
                </div>

                {/* Master Toggle & Controls */}
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-750">
                  <span className="font-semibold text-slate-200 text-xs">{t.noteLinesToggle}</span>
                  <input
                    type="checkbox"
                    checked={currentSpaceLines.showNoteLines}
                    onChange={(e) => updateSpaceLines({ showNoteLines: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {currentSpaceLines.showNoteLines && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{t.noteLinesCount}</span>
                        <span className="font-mono text-amber-400 font-bold">{currentSpaceLines.linesCount || 4}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={currentSpaceLines.linesCount || 4}
                        onChange={(e) => updateSpaceLines({ linesCount: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{t.noteLineSpacing}</span>
                        <span className="font-mono text-amber-400 font-bold">{currentSpaceLines.lineSpacingMm || 8} mm</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="14"
                        step="1"
                        value={currentSpaceLines.lineSpacingMm || 8}
                        onChange={(e) => updateSpaceLines({ lineSpacingMm: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[11px] text-slate-300 font-semibold">{t.noteLineStyle}</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['dotted', 'dashed', 'solid'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => updateSpaceLines({ lineStyle: style })}
                            className={`py-1 text-[10px] rounded border transition-all cursor-pointer ${
                              currentSpaceLines.lineStyle === style
                                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {style === 'dotted' ? 'Punkt' : style === 'dashed' ? 'Strich' : 'Linie'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Gap Spacing & Watermark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{t.itemSpacing}</span>
                      <span className="font-mono text-amber-400 font-bold">{currentSpaceLines.itemSpacingRem || 0.75} rem</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.25"
                      value={currentSpaceLines.itemSpacingRem || 0.75}
                      onChange={(e) => updateSpaceLines({ itemSpacingRem: parseFloat(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[11px] text-slate-300 font-semibold">{t.watermarkInput}</span>
                    <input
                      type="text"
                      placeholder="z.B. OFFIZIELLER MUSTERSATZ"
                      value={currentSpaceLines.watermarkText || ''}
                      onChange={(e) => updateSpaceLines({ watermarkText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Live Preview Bar */}
                {currentSpaceLines.showNoteLines && (
                  <div className="p-2.5 bg-white text-slate-900 rounded border border-slate-300">
                    <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase font-bold tracking-wider mb-1">
                      <span>{currentSpaceLines.noteLabel || 'Platz für Notizen / Entwurf'}</span>
                      <span className="italic font-normal">{lang === 'en' ? 'Live Ruled Space Preview' : 'Vorschau der Notizzeilen'}</span>
                    </div>
                    <div className="flex flex-col" style={{ gap: `${Math.min(6, currentSpaceLines.lineSpacingMm || 8)}px` }}>
                      {Array.from({ length: Math.min(3, currentSpaceLines.linesCount || 4) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-full ${
                            currentSpaceLines.lineStyle === 'dashed'
                              ? 'border-b border-dashed border-neutral-400'
                              : currentSpaceLines.lineStyle === 'solid'
                              ? 'border-b border-solid border-neutral-300'
                              : 'border-b-2 border-dotted border-neutral-300'
                          }`}
                          style={{ height: '6px' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Featured: Complete Exam ZIP Bundle */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-amber-500/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{t.downloadCardZipTitle}</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                      ZIP
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t.downloadCardZipDesc}
                  </p>
                </div>
              </div>
              <button
                disabled={activeTask !== null}
                onClick={() => executeDownload('zip', () => onDownloadZip(currentExam))}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {activeTask === 'zip' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.generating}</span>
                  </>
                ) : downloadSuccess === 'zip' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                    <span>Fertig!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.downloadBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section: Candidate Question Paper */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.candidatePaperSection}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* PDF Candidate Paper */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{t.downloadCandidatePdfTitle}</span>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                      PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.downloadCandidatePdfDesc}
                  </p>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button
                    disabled={activeTask !== null}
                    onClick={() => executeDownload('cand-pdf', () => onDownloadCandidatePdf(currentExam))}
                    className="flex-1 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Druckfertiges 7-seitiges Layout"
                  >
                    {activeTask === 'cand-pdf' ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                        <span>Erstelle...</span>
                      </>
                    ) : downloadSuccess === 'cand-pdf' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Geladen!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>Layout-PDF</span>
                      </>
                    )}
                  </button>
                  {onDownloadVectorCandidatePdf && (
                    <button
                      disabled={activeTask !== null}
                      onClick={() => executeDownload('cand-vec', () => onDownloadVectorCandidatePdf(currentExam))}
                      className="py-1.5 px-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                      title="100% Offline-Vektor-PDF (<100 KB, ultraschnell)"
                    >
                      {activeTask === 'cand-vec' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                      ) : downloadSuccess === 'cand-vec' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Zap className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>Vektor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DOCX Candidate Paper */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{t.downloadCandidateDocxTitle}</span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">
                      DOCX
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.downloadCandidateDocxDesc}
                  </p>
                </div>
                <button
                  disabled={activeTask !== null}
                  onClick={() => executeDownload('cand-docx', () => onDownloadCandidateDocx(currentExam))}
                  className="mt-3 w-full py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {activeTask === 'cand-docx' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                      <span>{t.generating}</span>
                    </>
                  ) : downloadSuccess === 'cand-docx' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Geladen!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 text-blue-400" />
                      <span>DOCX laden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Solutions & Answer Key */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.solutionsSection}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* PDF Solutions */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{t.downloadSolutionsPdfTitle}</span>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                      PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.downloadSolutionsPdfDesc}
                  </p>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button
                    disabled={activeTask !== null}
                    onClick={() => executeDownload('sol-pdf', () => onDownloadSolutionsPdf(currentExam))}
                    className="flex-1 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Vollständiges didaktisches Lösungsblatt"
                  >
                    {activeTask === 'sol-pdf' ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                        <span>Erstelle...</span>
                      </>
                    ) : downloadSuccess === 'sol-pdf' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Geladen!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>Layout-PDF</span>
                      </>
                    )}
                  </button>
                  {onDownloadVectorSolutionsPdf && (
                    <button
                      disabled={activeTask !== null}
                      onClick={() => executeDownload('sol-vec', () => onDownloadVectorSolutionsPdf(currentExam))}
                      className="py-1.5 px-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                      title="100% Offline-Lösungsschlüssel (<50 KB)"
                    >
                      {activeTask === 'sol-vec' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                      ) : downloadSuccess === 'sol-vec' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Zap className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>Vektor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DOCX Solutions */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{t.downloadSolutionsDocxTitle}</span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">
                      DOCX
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.downloadSolutionsDocxDesc}
                  </p>
                </div>
                <button
                  disabled={activeTask !== null}
                  onClick={() => executeDownload('sol-docx', () => onDownloadSolutionsDocx(currentExam))}
                  className="mt-3 w-full py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {activeTask === 'sol-docx' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                      <span>{t.generating}</span>
                    </>
                  ) : downloadSuccess === 'sol-docx' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Geladen!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 text-blue-400" />
                      <span>Lösungen DOCX</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Official Answer Sheet S30 (OMR-Anchored) */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>{lang === 'en' ? 'Candidate Answer Sheet S30 (OMR Machine-Readable)' : 'Antwortbogen S30 (Automatisch scannbar / OMR)'}</span>
              </div>
              <span className="text-[10px] font-mono bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1.5 py-0.2 rounded font-semibold">
                Goethe S30
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-white block">
                  {lang === 'en' ? 'Optical Answer Sheet S30 (with 4-Corner OMR Fiducials)' : 'Offizieller Prüfungsbogen S30 mit OMR-Justiermarken'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  {lang === 'en'
                    ? '1-page A4 bubble sheet for all 30 questions. Features corner alignment marks for camera scanner auto-deskewing.'
                    : '1-seitiger A4-Antwortbogen für alle 30 Aufgaben. Mit Justiermarken in den 4 Ecken für automatisches Kamera-Scannen.'}
                </p>
              </div>
              {onDownloadVectorAnswerSheetPdf && (
                <button
                  disabled={activeTask !== null}
                  onClick={() => executeDownload('sheet-vec', () => onDownloadVectorAnswerSheetPdf(currentExam))}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow"
                >
                  {activeTask === 'sheet-vec' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-white" />
                      <span>{t.generating}</span>
                    </>
                  ) : downloadSuccess === 'sheet-vec' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>Geladen!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Download S30 PDF' : 'S30-PDF laden'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Section: Additional Text & Raw Data Exports */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Native Browser Print (100% Vector PDF) */}
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'en' ? 'Browser Print' : 'Vektor-Druck'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Save as PDF via browser print dialogue' : 'Über Druckdialog als PDF sichern'}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => window.print(), 250);
                }}
                className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded border border-emerald-500/40 flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
                title={lang === 'en' ? 'Print or Save as PDF' : 'Drucken oder als PDF sichern'}
              >
                <Printer className="w-3 h-3" />
                <span>{lang === 'en' ? 'Print' : 'Drucken'}</span>
              </button>
            </div>

            {/* Plain Text & Answer Key */}
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.downloadTxtTitle}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.downloadTxtDesc}
                </p>
              </div>
              <button
                onClick={() => onDownloadTxt(currentExam)}
                className="px-2.5 py-1.5 bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>TXT</span>
              </button>
            </div>

            {/* JSON Raw Data */}
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.downloadJsonTitle}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.downloadJsonDesc}
                </p>
              </div>
              <button
                onClick={() => onDownloadJson(currentExam)}
                className="px-2.5 py-1.5 bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Offizielles CEFR B1 Prüfungsformat (65 Min. • 5 Teile • 30 Aufgaben)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
