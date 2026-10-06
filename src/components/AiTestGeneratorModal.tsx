import React, { useState } from 'react';
import { ExamModel } from '../types/exam';
import { THEME_PRESETS, ThemePreset, GenerationParams, requestAIGeneratedExam } from '../utils/aiGenerator';
import { Language, translations } from '../utils/i18n';
import {
  Sparkles,
  X,
  CheckCircle2,
  Download,
  Play,
  ArrowRight,
  Building,
  MapPin,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';

interface Props {
  nextExamNumber: number;
  onClose: () => void;
  onExamCreated: (newExam: ExamModel) => void;
  onOpenExamView: (examId: string, mode: 'paper' | 'solutions' | 'editor' | 'interactive') => void;
  onDownloadZip: (exam: ExamModel) => Promise<void>;
  onDownloadCandidatePdf: (exam: ExamModel) => Promise<void>;
  onDownloadCandidateDocx: (exam: ExamModel) => Promise<void>;
  onDownloadSolutionsPdf: (exam: ExamModel) => Promise<void>;
  lang?: Language;
}

export const AiTestGeneratorModal: React.FC<Props> = ({
  nextExamNumber,
  onClose,
  onExamCreated,
  onOpenExamView,
  onDownloadZip,
  onDownloadCandidatePdf,
  onDownloadCandidateDocx,
  onDownloadSolutionsPdf,
  lang = 'de',
}) => {
  const t = translations[lang];

  // Wizard state: 1: Theme & Topic, 2: Settings, 3: Generating, 4: Success & Download
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [selectedPresetId, setSelectedPresetId] = useState<string>('elektromobilitaet');
  const [customTheme, setCustomTheme] = useState<string>('');
  const [audience, setAudience] = useState<'Erwachsene' | 'Jugendliche'>('Erwachsene');
  const [city, setCity] = useState<string>('Stuttgart');
  const [institution, setInstitution] = useState<string>('Goethe-Institut Stuttgart');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedExam, setGeneratedExam] = useState<ExamModel | null>(null);

  // Active theme name
  const currentPreset = THEME_PRESETS.find(p => p.id === selectedPresetId);
  const effectiveTheme = customTheme.trim() ? customTheme.trim() : (currentPreset?.theme || 'Elektromobilität');

  const handleSelectPreset = (preset: ThemePreset) => {
    setSelectedPresetId(preset.id);
    setCustomTheme('');
    setCity(preset.suggestedCity);
    setInstitution(preset.suggestedInstitution);
  };

  const handleStartGeneration = async () => {
    setStep(3);
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage(lang === 'en' ? 'Initializing AI Item Writer (Goethe B1 Norm)...' : 'Initialisiere KI-Prüfungsautor (Goethe B1 Norm)...');

    // Simulated progress steps for smooth UX while awaiting model response
    const stageTimer1 = setTimeout(() => {
      setGenerationProgress(28);
      setGenerationStage(lang === 'en' ? 'Writing Teil 1: Personal email & 6 True/False items...' : 'Schreibe Teil 1: Persönliche E-Mail & 6 Richtig/Falsch-Aufgaben...');
    }, 700);

    const stageTimer2 = setTimeout(() => {
      setGenerationProgress(48);
      setGenerationStage(lang === 'en' ? 'Writing Teil 2: 2 authentic press articles & multiple-choice items...' : 'Schreibe Teil 2: 2 Presseartikel & Dreifachauswahl (7–12)...');
    }, 1500);

    const stageTimer3 = setTimeout(() => {
      setGenerationProgress(68);
      setGenerationStage(lang === 'en' ? 'Designing Teil 3: 7 situations & 10 ads (with 1x unmatched "0")...' : 'Erstelle Teil 3: 7 Situationen & 10 Anzeigen (A–J, 1x "0")...');
    }, 2400);

    const stageTimer4 = setTimeout(() => {
      setGenerationProgress(84);
      setGenerationStage(lang === 'en' ? 'Constructing Teil 4 (Reader debate) & Teil 5 (House regulations)...' : 'Konstruiere Teil 4 (Leserbriefe) & Teil 5 (Hausordnung)...');
    }, 3200);

    const stageTimer5 = setTimeout(() => {
      setGenerationProgress(95);
      setGenerationStage(lang === 'en' ? 'Verifying 30-item sequence, scoring rubric & answer key...' : 'Prüfe 30-Aufgaben-Sequenz, Punkteumrechnung & Lösungsbogen...');
    }, 3800);

    try {
      const params: GenerationParams = {
        theme: effectiveTheme,
        examNumber: nextExamNumber,
        audience,
        city,
        institution,
      };

      const newExam = await requestAIGeneratedExam(params);

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);
      clearTimeout(stageTimer5);

      setGenerationProgress(100);
      setGeneratedExam(newExam);
      onExamCreated(newExam);
      setIsGenerating(false);
      setStep(4);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setStep(1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-850 via-slate-800 to-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {lang === 'en' ? 'AI Test Generator' : 'KI-Prüfungsautor'}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                  Goethe & ÖSD B1
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{String(nextExamNumber).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {lang === 'en' ? 'Instant B1 Reading Exam Creator' : 'Vollständigen B1-Lesesatz generieren'}
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

        {/* Wizard Progress Stepper */}
        {step !== 3 && (
          <div className="px-6 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                1
              </span>
              <span className={step === 1 ? 'text-white font-bold' : 'text-slate-400'}>
                {lang === 'en' ? 'Select Theme' : 'Thema wählen'}
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                2
              </span>
              <span className={step === 2 ? 'text-white font-bold' : 'text-slate-400'}>
                {lang === 'en' ? 'Institution & Options' : 'Optionen & Prüfungsort'}
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step === 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                3
              </span>
              <span className={step === 4 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {lang === 'en' ? 'Download Exam' : 'Fertig & Download'}
              </span>
            </div>
          </div>
        )}

        {/* Body Content by Step */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: THEME SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {lang === 'en' ? '1. Choose a Curated B1 Topic or Type Your Own' : '1. Wählen Sie ein bewährtes B1-Themenfeld oder ein eigenes Thema'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'The generator will produce 5 complete Teile with 30 items strictly calibrated to CEFR B1 German vocabulary.'
                    : 'Der KI-Autor erstellt 5 vollständige Teile mit 30 Aufgaben, exakt abgestimmt auf den Goethe-/ÖSD-B1-Wortschatz.'}
                </p>
              </div>

              {/* Grid of Theme Presets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id && !customTheme.trim();
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-white ring-2 ring-amber-500/20'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900/80 text-amber-400 border border-slate-700">
                            {preset.category}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <h5 className="font-extrabold text-sm text-white leading-tight mb-1">
                          {preset.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{preset.suggestedCity}</span>
                        <span>30 Aufgaben • 65 Min</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Theme Input */}
              <div className="p-4 bg-slate-850 border border-slate-700/80 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'en' ? 'Or enter any custom topic:' : 'Oder eigenes Thema eingeben:'}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'e.g. Künstliche Intelligenz in der Schule, Tiny Houses, Repair-Cafés...' : 'z.B. Künstliche Intelligenz in der Schule, Tiny Houses, Repair-Cafés...'}
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  {customTheme.trim() && (
                    <button
                      onClick={() => setCustomTheme('')}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      {lang === 'en' ? 'Clear' : 'Zurücksetzen'}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  {lang === 'en'
                    ? 'The model will automatically generate authentic German articles, emails, reader letters, and building rules tailored to this theme.'
                    : 'Das Modell generiert selbstständig passende Texte, Anzeigen, Leserbriefe und Hausordnungen zu diesem Thema.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: SETTINGS & INSTITUTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {lang === 'en' ? '2. Exam Information & Settings' : '2. Prüfungsangaben & Personalisierung'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'These details will appear on the official candidate cover sheet, headers, and answer documents.'
                    : 'Diese Angaben erscheinen auf dem Deckblatt, in den Kopfzeilen und auf dem Prüfer-Lösungsbogen.'}
                </p>
              </div>

              {/* Selected Topic Recap */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    {lang === 'en' ? 'Selected Theme:' : 'Ausgewähltes Thema:'}
                  </span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {effectiveTheme}
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 rounded-lg border border-slate-700 cursor-pointer"
                >
                  {lang === 'en' ? 'Change' : 'Ändern'}
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'en' ? 'Target Audience / Variant' : 'Prüfungsvariante'}
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Erwachsene">Erwachsene (Goethe-Zertifikat B1 Standard)</option>
                    <option value="Jugendliche">Jugendliche (ab 12 Jahren)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'en' ? 'City / Test Location' : 'Prüfungsort / Stadt'}</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    placeholder="z.B. München, Stuttgart, Wien, Zürich"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'en' ? 'Institution / Examination Center' : 'Prüfungsinstitution'}</span>
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    placeholder="z.B. Goethe-Institut, ÖSD Prüfungszentrum, Volkshochschule"
                  />
                </div>
              </div>

              {/* Regulatory Checklist Card */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-700 text-xs space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  {lang === 'en' ? 'Automatic Quality Guarantees (Goethe-Norm B1)' : 'Automatische Qualitätsgarantien (Goethe-Norm B1)'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Exakt 30 durchnummerierte Aufgaben (1–30)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Teil 3: Genau 1x keine Anzeige (Antwort „0“)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>10 Anzeigen (A–J) mit 1 ungenutzten Anzeige</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Vollständiger Lösungsbogen & 100-Punkte-Skala</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GENERATION IN PROGRESS */}
          {step === 3 && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-extrabold text-white">
                  {lang === 'en' ? 'Generating Complete B1 Reading Exam...' : 'Generiere vollständigen B1-Prüfungssatz...'}
                </h4>
                <p className="text-xs text-amber-400 font-mono min-h-[20px] transition-all">
                  {generationStage}
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-md mx-auto space-y-1">
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Goethe-Standard B1</span>
                  <span>{generationProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS HUB & IMMEDIATE DOWNLOAD */}
          {step === 4 && generatedExam && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-850 to-slate-850 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {lang === 'en' ? 'Norm Verified' : 'Norm geprüft'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        30 Aufgaben • 65 Minuten • 100 Punkte
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-0.5">
                      {generatedExam.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Direct Download Actions Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {lang === 'en' ? 'Instant Downloads' : 'Sofort-Downloads'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Candidate Paper PDF */}
                  <button
                    onClick={() => onDownloadCandidatePdf(generatedExam)}
                    className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                          {lang === 'en' ? 'Candidate Booklet (PDF)' : 'Kandidatenheft (PDF)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'en' ? '7 print-ready A4 pages' : '7 druckfertige A4-Seiten'}
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </button>

                  {/* Candidate Paper DOCX */}
                  <button
                    onClick={() => onDownloadCandidateDocx(generatedExam)}
                    className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                        DOCX
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                          {lang === 'en' ? 'Word Document (DOCX)' : 'Word-Vorlage (DOCX)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'en' ? 'Fully editable in MS Word' : 'Vollständig editierbar'}
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </button>

                  {/* Answer Key PDF */}
                  <button
                    onClick={() => onDownloadSolutionsPdf(generatedExam)}
                    className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                        LÖS
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                          {lang === 'en' ? 'Answer Key & Scan Sheet (PDF)' : 'Lösungsbogen & Scan-Blatt (PDF)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'en' ? '1–30 key & 100-point table' : 'Schlüssel 1–30 & Notenskala'}
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </button>

                  {/* Complete ZIP Bundle */}
                  <button
                    onClick={() => onDownloadZip(generatedExam)}
                    className="p-3.5 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent hover:bg-amber-500/25 border-2 border-amber-500/40 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                        ZIP
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                          {lang === 'en' ? 'Complete Exam Bundle (ZIP)' : 'Komplettpaket (ZIP)'}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          PDF, DOCX, JSON & Text
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-amber-400 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* View in App buttons */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300 block">
                  {lang === 'en' ? 'Or open directly in Studio:' : 'Oder direkt im Studio öffnen:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onOpenExamView(generatedExam.id, 'paper');
                      onClose();
                    }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg border border-slate-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.paper}</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenExamView(generatedExam.id, 'editor');
                      onClose();
                    }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg border border-slate-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.editor}</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenExamView(generatedExam.id, 'interactive');
                      onClose();
                    }}
                    className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-bold rounded-lg border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t.interactive}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Back' : 'Zurück'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <span>{lang === 'en' ? 'Next: Options' : 'Weiter: Einstellungen'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 2 && (
              <button
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'en' ? 'Generate 30-Item Exam Now' : 'Jetzt 30-Aufgaben-Satz generieren'}</span>
              </button>
            )}
            {step === 4 && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                {t.closeBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
