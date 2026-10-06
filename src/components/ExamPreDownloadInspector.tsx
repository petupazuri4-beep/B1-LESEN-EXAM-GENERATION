import React, { useState } from 'react';
import { ExamModel, SpaceLineConfig, DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import { OfficialExamPaper } from './OfficialExamPaper';
import { AppThemeConfig } from '../utils/theme';
import {
  Eye,
  FileText,
  Download,
  Sliders,
  Type,
  AlignJustify,
  ZoomIn,
  ZoomOut,
  Edit3,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  Copy,
} from 'lucide-react';

interface Props {
  exams: ExamModel[];
  selectedExamId: string;
  onSelectExam: (id: string) => void;
  onUpdateExam: (updated: ExamModel) => void;
  onDownloadPdf: (exam: ExamModel) => Promise<void>;
  onDownloadDocx: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsPdf: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsDocx: (exam: ExamModel) => Promise<void>;
  onOpenDownloadModal?: (exam: ExamModel) => void;
  onApplyToAll?: () => void;
  lang: Language;
  themeConfig: AppThemeConfig;
  darkMode?: boolean;
}

export const ExamPreDownloadInspector: React.FC<Props> = ({
  exams,
  selectedExamId,
  onSelectExam,
  onUpdateExam,
  onDownloadPdf,
  onDownloadDocx,
  onOpenDownloadModal,
  onApplyToAll,
  lang,
  themeConfig,
  darkMode = true,
}) => {
  const t = translations[lang];
  // Visual Simulator Format: PDF Print Booklet vs Microsoft Word DOCX
  const [simulatorFormat, setSimulatorFormat] = useState<'pdf' | 'docx'>('pdf');
  const [pageFilter, setPageFilter] = useState<number | 'all'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showEditDrawer, setShowEditDrawer] = useState<boolean>(true);
  const [activeEditTab, setActiveEditTab] = useState<'spaceLines' | 'typography' | 'metadata' | 'content'>('spaceLines');
  const [contentTeil, setContentTeil] = useState<'t1' | 't2' | 't3' | 't4' | 't5'>('t1');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const numStr = String(currentExam.examNumber).padStart(2, '0');
  const currentSpaceLines: SpaceLineConfig =
    currentExam.styleConfig?.spaceLines || DEFAULT_SPACE_LINE_CONFIG;

  const cloneExam = (): ExamModel => JSON.parse(JSON.stringify(currentExam));

  const updateSpaceLines = (partial: Partial<SpaceLineConfig>) => {
    const cloned = cloneExam();
    cloned.styleConfig = {
      ...cloned.styleConfig,
      spaceLines: {
        ...currentSpaceLines,
        ...partial,
      },
    };
    onUpdateExam(cloned);
  };

  const updateStyle = (key: keyof ExamModel['styleConfig'], val: any) => {
    const cloned = cloneExam();
    cloned.styleConfig = {
      ...cloned.styleConfig,
      [key]: val,
    };
    onUpdateExam(cloned);
  };

  const handleExecuteExport = async (key: string, action: () => Promise<void>) => {
    setIsExporting(key);
    try {
      await action();
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <section className="space-y-6 pt-4 border-t border-slate-700/60" id="pre-download-inspector">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${themeConfig.badgeBg}`}>
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Live Document Visualizer' : 'Vollansicht & Format-Vorschau'}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-inherit">
            {lang === 'en'
              ? 'Pre-Download Full Exam Inspector & Simulator'
              : 'Prüfungs-Vollansicht & Druckvorschau vor dem Download'}
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl mt-0.5 leading-relaxed">
            {lang === 'en'
              ? 'Inspect and edit the complete examination exactly as it will look when exported. Toggle between PDF Booklet and Microsoft Word (DOCX) visual modes with live space-line adjustments.'
              : 'Überprüfen und bearbeiten Sie den kompletten Modellsatz vor dem Download. Simulieren Sie das exakte visuelle Erscheinungsbild im PDF-Druckheft oder Word-DOCX-Format mit Zeilenabstand & Notizzeilen.'}
          </p>
        </div>

        {/* Exam Picker Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-400">{t.activeSet}</span>
          <select
            value={selectedExamId}
            onChange={(e) => onSelectExam(e.target.value)}
            className={`border font-bold rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 shadow-lg cursor-pointer ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                #{String(ex.examNumber).padStart(2, '0')}: {ex.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Inspector Container */}
      <div
        className={`border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          darkMode ? 'bg-slate-850 border-slate-700/90' : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        {/* Top Simulator Control Bar */}
        <div
          className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            darkMode ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Format Simulator Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{lang === 'en' ? 'Format:' : 'Format-Simulation:'}</span>
            <div className={`flex items-center p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
              <button
                onClick={() => setSimulatorFormat('pdf')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  simulatorFormat === 'pdf'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Print-Booklet</span>
              </button>
              <button
                onClick={() => setSimulatorFormat('docx')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  simulatorFormat === 'docx'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Microsoft Word (DOCX)</span>
              </button>
            </div>
          </div>

          {/* Page Filter Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-400 font-semibold hidden sm:inline">{t.pageFilter}</span>
            <div className={`flex items-center p-1 rounded-xl border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
              <button
                onClick={() => setPageFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  pageFilter === 'all' ? themeConfig.activeTabClass : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.allPages}
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map((p) => {
                const label =
                  p === 1
                    ? 'Cover'
                    : p === 2
                    ? 'T1'
                    : p === 3
                    ? 'T2A'
                    : p === 4
                    ? 'T2B'
                    : p === 5
                    ? 'T3'
                    : p === 6
                    ? 'T4'
                    : 'T5';
                return (
                  <button
                    key={p}
                    onClick={() => setPageFilter(p)}
                    className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      pageFilter === p ? themeConfig.activeTabClass : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons & Zoom */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className={`hidden md:flex items-center gap-1 border px-2 py-1 rounded-xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Editing Toolbar */}
            <button
              onClick={() => setShowEditDrawer(!showEditDrawer)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                showEditDrawer
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Quick Editor' : 'Prüfung anpassen'}</span>
              {showEditDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Direct Download Triggers */}
            <button
              disabled={isExporting !== null}
              onClick={() => handleExecuteExport('pdf', () => onDownloadPdf(currentExam))}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition-colors disabled:opacity-50 cursor-pointer"
              title="Download Candidate PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              disabled={isExporting !== null}
              onClick={() => handleExecuteExport('docx', () => onDownloadDocx(currentExam))}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition-colors disabled:opacity-50 cursor-pointer"
              title="Download Word DOCX"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word</span>
            </button>
            {onOpenDownloadModal && (
              <button
                onClick={() => onOpenDownloadModal(currentExam)}
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 cursor-pointer ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="All Formats / ZIP"
              >
                <span>ZIP / Alle</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Live Editing Toolbar */}
        {showEditDrawer && (
          <div
            className={`border-b p-4 space-y-4 text-xs transition-all ${
              darkMode ? 'bg-slate-900/95 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Tab switch inside toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveEditTab('spaceLines')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'spaceLines'
                      ? themeConfig.activeTabClass
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Space Lines & Scratchpad' : 'Zeilenabstand & Notizzeilen'}</span>
                </button>
                <button
                  onClick={() => setActiveEditTab('typography')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'typography'
                      ? themeConfig.activeTabClass
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Typography & Layout' : 'Typografie & Seiten'}</span>
                </button>
                <button
                  onClick={() => setActiveEditTab('metadata')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'metadata'
                      ? themeConfig.activeTabClass
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Title & Header' : 'Titel & Prüfungsangaben'}</span>
                </button>
                <button
                  onClick={() => setActiveEditTab('content')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'content'
                      ? themeConfig.activeTabClass
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Tasks & Texts Content' : 'Aufgaben-Inhalte schnell bearbeiten'}</span>
                </button>
              </div>

              {onApplyToAll && (
                <button
                  onClick={onApplyToAll}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Apply current styling & space lines to all 10 exams"
                >
                  <Copy className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'en' ? 'Apply to all 10 exams' : 'Auf alle 10 übertragen'}</span>
                </button>
              )}
            </div>

            {/* Tab Content: Space Lines */}
            {activeEditTab === 'spaceLines' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Presets */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-300 block">{t.spaceLinePresets}:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => updateSpaceLines({ showNoteLines: false, linesCount: 0 })}
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                        !currentSpaceLines.showNoteLines
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold">Standard Clean</div>
                      <div className="text-[9px] opacity-75">Ohne Notizen</div>
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
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'dotted' &&
                        currentSpaceLines.linesCount === 4
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold">4 Gepunktet</div>
                      <div className="text-[9px] opacity-75">8mm Standard</div>
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
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'solid' &&
                        currentSpaceLines.linesCount === 6
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold">6 Liniert</div>
                      <div className="text-[9px] opacity-75">Viel Platz</div>
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
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                        currentSpaceLines.showNoteLines &&
                        currentSpaceLines.lineStyle === 'dashed' &&
                        currentSpaceLines.linesCount === 2
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold">2 Kompakt</div>
                      <div className="text-[9px] opacity-75">Papiersparend</div>
                    </button>
                  </div>
                </div>

                {/* Slider Controls: Lines Count & Spacing */}
                <div className="space-y-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
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
                      onChange={(e) => updateSpaceLines({ linesCount: parseInt(e.target.value, 10), showNoteLines: true })}
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
                </div>

                {/* Line Style & Item Spacing */}
                <div className="space-y-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-300 block">{t.noteLineStyle}</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['dotted', 'dashed', 'solid'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateSpaceLines({ lineStyle: st })}
                          className={`py-1 text-[10px] rounded border transition-all cursor-pointer ${
                            currentSpaceLines.lineStyle === st
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          {st === 'dotted' ? 'Punkt' : st === 'dashed' ? 'Strich' : 'Linie'}
                        </button>
                      ))}
                    </div>
                  </div>
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
                </div>

                {/* Watermark & Individual Teil Toggles */}
                <div className="space-y-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-300 block">{t.watermarkInput}</span>
                  <input
                    type="text"
                    placeholder="z.B. PROBEEXAMEN"
                    value={currentSpaceLines.watermarkText || ''}
                    onChange={(e) => updateSpaceLines({ watermarkText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Trennlinien zw. Fragen:</span>
                    <input
                      type="checkbox"
                      checked={currentSpaceLines.showItemDividers ?? true}
                      onChange={(e) => updateSpaceLines({ showItemDividers: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Typography */}
            {activeEditTab === 'typography' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">{t.fontFamily}</label>
                  <select
                    value={currentExam.styleConfig.fontFamily}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Source Sans 3">Source Sans 3 (Offiziell Goethe)</option>
                    <option value="Open Sans">Open Sans (Humanist Sans)</option>
                    <option value="Arial">Arial (Standard DIN)</option>
                    <option value="Merriweather">Merriweather (Serife)</option>
                    <option value="Georgia">Georgia (Buch-Serife)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-semibold">{t.fontSize}</span>
                    <span className="font-mono text-amber-400 font-bold">{currentExam.styleConfig.baseFontSizePt} pt</span>
                  </div>
                  <input
                    type="range"
                    min="9"
                    max="14"
                    step="0.5"
                    value={currentExam.styleConfig.baseFontSizePt}
                    onChange={(e) => updateStyle('baseFontSizePt', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-semibold">{t.lineHeight}</span>
                    <span className="font-mono text-amber-400 font-bold">{currentExam.styleConfig.lineHeight}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.05"
                    value={currentExam.styleConfig.lineHeight}
                    onChange={(e) => updateStyle('lineHeight', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tab Content: Metadata */}
            {activeEditTab === 'metadata' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Titel der Prüfung</label>
                  <input
                    type="text"
                    value={currentExam.title}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.title = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Themenfeld</label>
                  <input
                    type="text"
                    value={currentExam.theme}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.theme = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Prüfungszentrum / Institution</label>
                  <input
                    type="text"
                    value={currentExam.candidateInfo.institution}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.candidateInfo.institution = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Stadt / Ort</label>
                  <input
                    type="text"
                    value={currentExam.candidateInfo.city}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.candidateInfo.city = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Tab Content: Content Quick Editor */}
            {activeEditTab === 'content' && (
              <div className="space-y-3">
                {/* Sub-tabs for Teile */}
                <div className="flex items-center gap-1.5">
                  {(['t1', 't2', 't3', 't4', 't5'] as const).map((tk) => {
                    const label = tk === 't1' ? 'Teil 1 (E-Mail/Blog)' : tk === 't2' ? 'Teil 2 (Zeitungen)' : tk === 't3' ? 'Teil 3 (Anzeigen)' : tk === 't4' ? 'Teil 4 (Leserbriefe)' : 'Teil 5 (Hausordnung)';
                    return (
                      <button
                        key={tk}
                        onClick={() => setContentTeil(tk)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          contentTeil === tk ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Teil 1 quick editor */}
                {contentTeil === 't1' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold block">E-Mail Text (Teil 1)</label>
                      <textarea
                        rows={6}
                        value={currentExam.teil1.emailBody}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil1.emailBody = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-sans leading-relaxed outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold block">Aussagen 1–6 (Richtig / Falsch)</label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {currentExam.teil1.items.map((it, idx) => (
                          <div key={it.id} className="flex items-center gap-2 bg-slate-900 p-1.5 rounded border border-slate-750">
                            <span className="font-bold text-amber-400 font-mono w-4">{it.number}</span>
                            <input
                              type="text"
                              value={it.statement}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil1.items[idx].statement = e.target.value;
                                onUpdateExam(cloned);
                              }}
                              className="flex-1 bg-transparent text-xs text-white outline-none"
                            />
                            <select
                              value={it.correctAnswer}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil1.items[idx].correctAnswer = e.target.value as 'Richtig' | 'Falsch';
                                onUpdateExam(cloned);
                              }}
                              className="bg-slate-800 text-[10px] rounded px-1.5 py-0.5 text-white border border-slate-700 font-mono"
                            >
                              <option value="Richtig">Richtig</option>
                              <option value="Falsch">Falsch</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Teil 2 quick editor */}
                {contentTeil === 't2' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold block">Text A: {currentExam.teil2.textA.title}</label>
                      <input
                        type="text"
                        value={currentExam.teil2.textA.title}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil2.textA.title = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white mb-2"
                      />
                      <textarea
                        rows={4}
                        value={currentExam.teil2.textA.bodyParagraphs[0]}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil2.textA.bodyParagraphs[0] = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 font-sans"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold block">Text B: {currentExam.teil2.textB.title}</label>
                      <input
                        type="text"
                        value={currentExam.teil2.textB.title}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil2.textB.title = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white mb-2"
                      />
                      <textarea
                        rows={4}
                        value={currentExam.teil2.textB.bodyParagraphs[0]}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil2.textB.bodyParagraphs[0] = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* Teil 3 quick editor */}
                {contentTeil === 't3' && (
                  <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-2">
                    <label className="text-slate-300 font-semibold block">Situationen 13–19 & Anzeigen A–J (Zuordnung)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {currentExam.teil3.situations.map((sit, idx) => (
                        <div key={sit.id} className="flex items-center gap-2 bg-slate-900 p-1.5 rounded border border-slate-750 text-xs">
                          <span className="font-bold text-amber-400 font-mono w-4">{sit.number}</span>
                          <input
                            type="text"
                            value={sit.situation}
                            onChange={(e) => {
                              const cloned = cloneExam();
                              cloned.teil3.situations[idx].situation = e.target.value;
                              onUpdateExam(cloned);
                            }}
                            className="flex-1 bg-transparent text-xs text-white outline-none"
                          />
                          <span className="text-[10px] font-mono text-slate-400">Lsg: {sit.correctAnswer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teil 4 quick editor */}
                {contentTeil === 't4' && (
                  <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 font-semibold">Thema der Diskussion: {currentExam.teil4.contextTopic}</label>
                      <input
                        type="text"
                        value={currentExam.teil4.contextTopic}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil4.contextTopic = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-64"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {currentExam.teil4.leserbriefe.map((cm, idx) => (
                        <div key={cm.id} className="bg-slate-900 p-2 rounded border border-slate-750 text-xs space-y-1">
                          <div className="flex justify-between font-bold text-slate-300">
                            <span>{cm.number}. {cm.author} ({cm.city})</span>
                            <span className="font-mono text-amber-400">{cm.correctAnswer}</span>
                          </div>
                          <input
                            type="text"
                            value={cm.text}
                            onChange={(e) => {
                              const cloned = cloneExam();
                              cloned.teil4.leserbriefe[idx].text = e.target.value;
                              onUpdateExam(cloned);
                            }}
                            className="w-full bg-slate-800 text-[11px] text-white p-1 rounded border border-slate-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teil 5 quick editor */}
                {contentTeil === 't5' && (
                  <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-2">
                    <label className="text-slate-300 font-semibold block">Titel der Regelung / Hausordnung</label>
                    <input
                      type="text"
                      value={currentExam.teil5.sheetTitle}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.teil5.sheetTitle = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white mb-2"
                    />
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {currentExam.teil5.items.map((q, idx) => (
                        <div key={q.id} className="bg-slate-900 p-2 rounded border border-slate-750 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">{q.number}.</span>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil5.items[idx].question = e.target.value;
                                onUpdateExam(cloned);
                              }}
                              className="flex-1 bg-transparent text-xs text-white outline-none font-bold"
                            />
                            <span className="text-[10px] font-mono text-slate-400">Lsg: [{q.correctAnswer}]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live Visual Canvas Area */}
        <div className="p-4 sm:p-8 bg-neutral-900/90 overflow-x-auto min-h-[600px] flex justify-center items-start">
          {/* Format: PDF Print Booklet View */}
          {simulatorFormat === 'pdf' && (
            <div
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
              className="transition-transform duration-200"
            >
              <div className="relative">
                {/* PDF Header Pill */}
                <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-800/90 px-4 py-1.5 rounded-lg border border-slate-700">
                  <span className="flex items-center gap-1.5 font-bold text-rose-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Print Format (DIN A4 • 210 × 297 mm • 300 DPI)</span>
                  </span>
                  <span>Modellsatz #{numStr} • {currentExam.title}</span>
                </div>
                {/* Render Official Paper */}
                <OfficialExamPaper
                  exam={currentExam}
                  isEditable={true}
                  onUpdateExam={onUpdateExam}
                  currentPageFilter={pageFilter}
                  lang={lang}
                />
              </div>
            </div>
          )}

          {/* Format: Microsoft Word (DOCX) Document View */}
          {simulatorFormat === 'docx' && (
            <div
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
              className="w-full max-w-[850px] transition-transform duration-200"
            >
              {/* Word Ribbon Header Simulation */}
              <div className="bg-[#2b579a] text-white px-4 py-2 rounded-t-xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-200" />
                  <span className="font-semibold text-xs tracking-wide">
                    Microsoft Word • b1_lesen_exam_{numStr}.docx
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-blue-100 font-medium">
                  <span className="px-2 py-0.5 rounded bg-blue-700/60">Drucklayout</span>
                  <span>Schriftart: {currentExam.styleConfig.fontFamily}</span>
                  <span>Seiten: 7</span>
                </div>
              </div>

              {/* Word Ribbon Menu items simulation */}
              <div className="bg-slate-100 border-x border-slate-300 px-4 py-1.5 flex items-center gap-4 text-[11px] text-slate-700 border-b">
                <span className="font-bold text-[#2b579a]">Datei</span>
                <button
                  type="button"
                  onClick={() => setPageFilter(1)}
                  className="hover:text-black font-semibold text-slate-900 cursor-pointer transition hover:underline"
                  title="Zur ersten Seite (Start)"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => setPageFilter('all')}
                  className="hover:text-black cursor-pointer transition"
                  title="Alle Seiten anzeigen"
                >
                  Ansicht (Alle)
                </button>
              </div>

              {/* Word Document Paper Sheet */}
              <div className="bg-white text-slate-900 p-8 sm:p-14 shadow-2xl border-x border-b border-slate-300 rounded-b-xl space-y-8 font-sans">
                {/* Word Page 1: Header (Visible on All or Cover) */}
                {(pageFilter === 'all' || pageFilter === 1) && (
                  <div className="border-b-2 border-slate-300 pb-4">
                    <div className="bg-neutral-200 py-1.5 px-4 flex justify-between text-xs font-bold uppercase tracking-wider text-slate-800 mb-6">
                      <span>GOETHE-ZERTIFIKAT B1 / ÖSD</span>
                      <span>LESEN</span>
                      <span>KANDIDATENBLÄTTER</span>
                    </div>
                    <div className="text-center space-y-1 mb-6">
                      <div className="text-2xl font-black text-orange-600">GOETHE-ZERTIFIKAT B1</div>
                      <div className="text-lg font-bold text-slate-800">{currentExam.title.toUpperCase()}</div>
                      <div className="text-xs text-slate-500 font-mono">Modul Lesen • Arbeitszeit: 65 Minuten • 30 Aufgaben</div>
                    </div>

                    {/* Word-style Candidate Metadata Table */}
                    <table className="w-full text-xs border border-slate-400 mb-6">
                      <tbody>
                        <tr className="border-b border-slate-300 bg-slate-50">
                          <td className="p-2 font-bold w-1/3 border-r border-slate-300">Prüfungszentrum / Ort:</td>
                          <td className="p-2">{currentExam.candidateInfo.institution}, {currentExam.candidateInfo.city}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 font-bold border-r border-slate-300">Kandidat / Name:</td>
                          <td className="p-2 italic text-slate-500">______________________________________</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border-r border-slate-300">Prüfungsdatum & PTN:</td>
                          <td className="p-2 font-mono">____ . ____ . ________  |  [ _ _ _ _ _ _ _ _ ]</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Simulated Word Content: Teil 1 */}
                {(pageFilter === 'all' || pageFilter === 2) && (
                  <div className="space-y-4">
                    <div className="bg-neutral-200 py-1 px-3 text-xs font-bold flex justify-between">
                      <span>Teil 1 • Aufgaben 1 bis 6</span>
                      <span>Arbeitszeit: 10 Minuten</span>
                    </div>
                    <p className="text-xs italic text-slate-600 leading-relaxed">
                      {currentExam.teil1.instruction}
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-300 rounded text-xs leading-relaxed">
                      <div className="font-bold mb-2">{currentExam.teil1.emailGreeting}</div>
                      <p className="whitespace-pre-line text-slate-800">{currentExam.teil1.emailBody}</p>
                      <div className="font-bold mt-2">{currentExam.teil1.emailSignoff}</div>
                    </div>

                    {/* Questions 1-6 with checkboxes */}
                    <div className="space-y-2 pt-2">
                      {currentExam.teil1.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200">
                          <span className="font-medium text-slate-800">
                            <strong>{it.number}</strong> • {it.statement}
                          </span>
                          <div className="flex items-center gap-3 font-mono font-bold text-[11px] flex-shrink-0 ml-4">
                            <span>[  ] Richtig</span>
                            <span>[  ] Falsch</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ruled space lines representation in Word */}
                    {currentSpaceLines.showNoteLines && (
                      <div className="pt-3 border-t border-slate-300">
                        <div className="text-[10px] font-bold uppercase text-slate-500 mb-2">
                          {currentSpaceLines.noteLabel || 'Platz für Notizen / Entwurf (wird nicht bewertet)'}
                        </div>
                        <div className="flex flex-col" style={{ gap: `${currentSpaceLines.lineSpacingMm || 8}px` }}>
                          {Array.from({ length: currentSpaceLines.linesCount || 4 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-full ${
                                currentSpaceLines.lineStyle === 'dashed'
                                  ? 'border-b border-dashed border-slate-400'
                                  : currentSpaceLines.lineStyle === 'solid'
                                  ? 'border-b border-solid border-slate-300'
                                  : 'border-b-2 border-dotted border-slate-300'
                              }`}
                              style={{ height: '6px' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Word Page Break Indicator */}
                {pageFilter === 'all' && (
                  <div className="py-2 text-center border-y-2 border-dashed border-slate-300 my-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50">
                    ─── Seitenumbruch (Word Page Break) ───
                  </div>
                )}

                {/* Word Content: Teil 2 */}
                {(pageFilter === 'all' || pageFilter === 3 || pageFilter === 4) && (
                  <div className="space-y-4">
                    <div className="bg-neutral-200 py-1 px-3 text-xs font-bold flex justify-between">
                      <span>Teil 2 • Aufgaben 7 bis 12</span>
                      <span>Arbeitszeit: 20 Minuten</span>
                    </div>

                    {/* Text A */}
                    {(pageFilter === 'all' || pageFilter === 3) && (
                      <div className="border border-slate-300 p-4 rounded bg-slate-50/50 mb-3">
                        <h4 className="font-bold text-sm text-slate-900">{currentExam.teil2.textA.title}</h4>
                        <p className="text-[11px] italic text-slate-500 mb-2">{currentExam.teil2.textA.kicker}</p>
                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                          {currentExam.teil2.textA.bodyParagraphs[0]}
                        </p>
                        <div className="space-y-2 text-xs">
                          {currentExam.teil2.textA.items.map((it) => (
                            <div key={it.id} className="p-2 border-l-2 border-slate-400 pl-3">
                              <div className="font-bold text-slate-800 mb-1">{it.number} • {it.question}</div>
                              <div className="flex flex-col gap-1 font-mono text-[11px]">
                                <span>[  ] a) {it.options.a}</span>
                                <span>[  ] b) {it.options.b}</span>
                                <span>[  ] c) {it.options.c}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Text B */}
                    {(pageFilter === 'all' || pageFilter === 4) && (
                      <div className="border border-slate-300 p-4 rounded bg-slate-50/50">
                        <h4 className="font-bold text-sm text-slate-900">{currentExam.teil2.textB.title}</h4>
                        <p className="text-[11px] italic text-slate-500 mb-2">{currentExam.teil2.textB.kicker}</p>
                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                          {currentExam.teil2.textB.bodyParagraphs[0]}
                        </p>
                        <div className="space-y-2 text-xs">
                          {currentExam.teil2.textB.items.map((it) => (
                            <div key={it.id} className="p-2 border-l-2 border-slate-400 pl-3">
                              <div className="font-bold text-slate-800 mb-1">{it.number} • {it.question}</div>
                              <div className="flex flex-col gap-1 font-mono text-[11px]">
                                <span>[  ] a) {it.options.a}</span>
                                <span>[  ] b) {it.options.b}</span>
                                <span>[  ] c) {it.options.c}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Word Page Break Indicator */}
                {pageFilter === 'all' && (
                  <div className="py-2 text-center border-y-2 border-dashed border-slate-300 my-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50">
                    ─── Seitenumbruch (Word Page Break) ───
                  </div>
                )}

                {/* Word Content: Teil 3 */}
                {(pageFilter === 'all' || pageFilter === 5) && (
                  <div className="space-y-4">
                    <div className="bg-neutral-200 py-1 px-3 text-xs font-bold flex justify-between">
                      <span>Teil 3 • Aufgaben 13 bis 19</span>
                      <span>Arbeitszeit: 10 Minuten</span>
                    </div>
                    <p className="text-xs italic text-slate-600">
                      Lesen Sie die Situationen 13 bis 19 und die Anzeigen A bis J. Finden Sie für jede Situation die passende Anzeige.
                    </p>
                    <table className="w-full text-xs border border-slate-300">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-2 border-b border-r text-left w-16">Aufgabe</th>
                          <th className="p-2 border-b text-left">Person / Situation</th>
                          <th className="p-2 border-b border-l text-center w-24">Anzeige (A–J)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentExam.teil3.situations.map((sit) => (
                          <tr key={sit.id} className="border-b border-slate-200">
                            <td className="p-2 border-r font-bold font-mono">{sit.number}</td>
                            <td className="p-2">{sit.situation}</td>
                            <td className="p-2 border-l text-center font-mono font-bold">[ &nbsp; &nbsp; ]</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Word Page Break Indicator */}
                {pageFilter === 'all' && (
                  <div className="py-2 text-center border-y-2 border-dashed border-slate-300 my-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50">
                    ─── Seitenumbruch (Word Page Break) ───
                  </div>
                )}

                {/* Word Content: Teil 4 & 5 */}
                {(pageFilter === 'all' || pageFilter === 6 || pageFilter === 7) && (
                  <div className="space-y-6">
                    {/* Teil 4 */}
                    {(pageFilter === 'all' || pageFilter === 6) && (
                      <div className="space-y-3">
                        <div className="bg-neutral-200 py-1 px-3 text-xs font-bold flex justify-between">
                          <span>Teil 4 • Aufgaben 20 bis 26 (Ja / Nein)</span>
                          <span>Arbeitszeit: 15 Minuten</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                          <strong>Thema:</strong> {currentExam.teil4.contextTopic}
                        </div>
                        <div className="space-y-2">
                          {currentExam.teil4.leserbriefe.map((it) => (
                            <div key={it.id} className="p-2 border-b border-slate-200 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold mr-2">{it.number}</span>
                                <span className="font-semibold text-slate-700 mr-2">{it.author}:</span>
                                <span className="italic text-slate-600">„{it.text.slice(0, 90)}...“</span>
                              </div>
                              <div className="flex gap-3 font-mono font-bold text-[11px] flex-shrink-0 ml-4">
                                <span>[  ] Ja</span>
                                <span>[  ] Nein</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teil 5 */}
                    {(pageFilter === 'all' || pageFilter === 7) && (
                      <div className="space-y-3 pt-4 border-t border-slate-300">
                        <div className="bg-neutral-200 py-1 px-3 text-xs font-bold flex justify-between">
                          <span>Teil 5 • Aufgaben 27 bis 30</span>
                          <span>Arbeitszeit: 10 Minuten</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                          <strong>{currentExam.teil5.sheetTitle}</strong>
                        </div>
                        <div className="space-y-2">
                          {currentExam.teil5.items.map((it) => (
                            <div key={it.id} className="p-2 border-l-2 border-slate-400 pl-3 text-xs">
                              <div className="font-bold text-slate-800 mb-1">{it.number} • {it.question}</div>
                              <div className="flex flex-col gap-1 font-mono text-[11px]">
                                <span>[  ] a) {it.options.a}</span>
                                <span>[  ] b) {it.options.b}</span>
                                <span>[  ] c) {it.options.c}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer indication */}
                <div className="pt-6 border-t border-slate-200 flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Goethe-/ÖSD-Zertifikat B1 • Modul Lesen</span>
                  <span>Microsoft Word Dokument • Druckfertig</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
