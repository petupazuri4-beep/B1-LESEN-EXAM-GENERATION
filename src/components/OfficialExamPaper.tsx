import React from 'react';
import { ExamModel, DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
import { Language, translations } from '../utils/i18n';
import { BookOpen, Edit3, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { LineNumberedText } from '../utils/lineNumbering';

interface Props {
  exam: ExamModel;
  isEditable?: boolean;
  onUpdateExam?: (updated: ExamModel) => void;
  currentPageFilter?: number | 'all'; // 1 to 7 or 'all'
  lang?: Language;
}

export const OfficialExamPaper: React.FC<Props> = ({
  exam,
  isEditable = false,
  onUpdateExam,
  currentPageFilter = 'all',
  lang = 'de',
}) => {
  const t = translations[lang];
  const { styleConfig } = exam;
  const spaceLines = styleConfig.spaceLines || DEFAULT_SPACE_LINE_CONFIG;

  // Helper to clone and mutate exam
  const updateExam = (updater: (draft: ExamModel) => void) => {
    if (!onUpdateExam) return;
    const draft = JSON.parse(JSON.stringify(exam)) as ExamModel;
    updater(draft);
    onUpdateExam(draft);
  };

  // Reusable inline editable component
  const InlineEditable: React.FC<{
    value: string;
    onChange: (val: string) => void;
    multiline?: boolean;
    rows?: number;
    className?: string;
    placeholder?: string;
    inputClassName?: string;
  }> = ({
    value,
    onChange,
    multiline = false,
    rows = 2,
    className = '',
    placeholder = '',
    inputClassName = '',
  }) => {
    if (!isEditable) {
      return <span className={className}>{value || placeholder}</span>;
    }

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full bg-amber-50/90 focus:bg-white text-neutral-900 border border-dashed border-amber-500 focus:border-amber-600 rounded p-1.5 outline-none font-inherit text-inherit transition-all shadow-sm ${inputClassName}`}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-amber-50/90 focus:bg-white text-neutral-900 border border-dashed border-amber-500 focus:border-amber-600 rounded px-1.5 py-0.5 outline-none font-inherit text-inherit transition-all shadow-sm ${inputClassName}`}
      />
    );
  };

  const fontFamilyClass = {
    'Source Sans 3': 'font-["Source_Sans_3",sans-serif]',
    'Open Sans': 'font-["Open_Sans",sans-serif]',
    'Merriweather': 'font-["Merriweather",serif]',
    'Arial': 'font-[Arial,sans-serif]',
    'Georgia': 'font-[Georgia,serif]',
  }[styleConfig.fontFamily] || 'font-sans';

  const marginClass = {
    normal: 'p-8 md:p-12',
    narrow: 'p-5 md:p-8',
    wide: 'p-10 md:p-16',
  }[styleConfig.marginPreset || 'normal'];

  // Official Grey Header Bar Component
  const HeaderBar: React.FC<{ left: string; middle: string; right: string; pageNumber: number }> = ({
    left,
    middle,
    right,
  }) => (
    <div
      className="w-full py-1.5 px-4 mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider border-b border-t"
      style={{
        backgroundColor: styleConfig.headerBarColor || '#d9d9d9',
        color: styleConfig.headerTextColor || '#111827',
        borderColor: '#9ca3af',
      }}
    >
      <span className="w-1/3 text-left font-bold">{left}</span>
      <span className="w-1/3 text-center tracking-widest">{middle}</span>
      <span className="w-1/3 text-right">{right}</span>
    </div>
  );

  // Official Footer
  const PageFooter: React.FC<{ pageNumber: number }> = ({ pageNumber }) => (
    <div className="mt-auto pt-6 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-200">
      <span className="font-mono text-[10px]">Goethe-/ÖSD-Zertifikat B1 • Modul Lesen</span>
      <span className="font-serif">Seite {pageNumber}</span>
    </div>
  );

  // Candidate Scratchpad / Ruled Note Lines Block (Notizzeilen)
  const NoteLinesBlock: React.FC<{
    show?: boolean;
    title?: string;
  }> = ({ show = true, title }) => {
    if (!spaceLines?.showNoteLines || !show) return null;
    const count = spaceLines.linesCount || 4;
    if (count <= 0) return null;
    const spacingMm = spaceLines.lineSpacingMm || 8;
    const borderStyleClass =
      spaceLines.lineStyle === 'dashed'
        ? 'border-b border-dashed border-neutral-400'
        : spaceLines.lineStyle === 'solid'
        ? 'border-b border-solid border-neutral-300'
        : 'border-b-2 border-dotted border-neutral-300';

    return (
      <div className="mt-4 pt-3 pb-2 border-t border-neutral-200 print:break-inside-avoid relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            {title || spaceLines.noteLabel || 'Platz für Notizen / Entwurf'}
          </span>
          <span className="text-[9px] text-neutral-400 italic">
            (wird nicht bewertet • {count} {lang === 'en' ? 'lines' : 'Zeilen'})
          </span>
        </div>
        <div className="flex flex-col" style={{ gap: `${spacingMm}mm` }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`w-full ${borderStyleClass}`}
              style={{ height: `${spacingMm}mm` }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Watermark Overlay for Printed / Downloaded Papers
  const WatermarkOverlay: React.FC = () => {
    if (!spaceLines?.watermarkText) return null;
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 select-none opacity-[0.06] print:opacity-[0.08]">
        <span className="text-8xl font-black uppercase tracking-widest text-neutral-900 -rotate-45 whitespace-nowrap">
          {spaceLines.watermarkText}
        </span>
      </div>
    );
  };

  const shouldRenderPage = (pageNo: number) => {
    return currentPageFilter === 'all' || currentPageFilter === pageNo;
  };

  return (
    <div
      className={`mx-auto bg-white text-neutral-900 shadow-2xl ${fontFamilyClass} print:shadow-none print:w-full print:m-0`}
      style={{
        maxWidth: '850px',
        fontSize: `${styleConfig.baseFontSizePt || 10.5}pt`,
        lineHeight: styleConfig.lineHeight || 1.45,
      }}
    >
      {/* Live In-Place Editor Banner (Suggestion 1) */}
      {isEditable && (
        <div className="no-print p-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold rounded-t-lg shadow-lg flex items-center justify-between gap-3 text-xs border-b border-amber-600">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4.5 h-4.5 text-slate-950 shrink-0" />
            <span>
              {lang === 'en'
                ? 'WYSIWYG In-Place Paper Editor Active: Click on any text, question, or answer box to edit directly on the page.'
                : 'In-Place Bogen-Editor Aktiv: Klicken Sie direkt auf Texte, Fragen, Absätze oder Lösungsfelder, um sie im Drucklayout anzupassen.'}
            </span>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-slate-950 text-amber-300 font-bold shrink-0">
            {lang === 'en' ? 'Live Auto-Save' : 'Live-Speicherung'}
          </span>
        </div>
      )}

      {/* PAGE 1: OFFICIAL COVER & CANDIDATE REGISTRATION */}
      {shouldRenderPage(1) && (
        <section data-exam-page="1" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={7} />

          {/* Title Hero */}
          <div className="text-center my-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 uppercase mb-1">
              GOETHE- / ÖSD-ZERTIFIKAT B1
            </h1>
            <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase">
              DEUTSCHPRÜFUNG FÜR ERWACHSENE • MODUL LESEN
            </p>
            <p className="text-sm font-bold text-amber-700 mt-2 font-mono">
              Modellsatz #{String(exam.examNumber).padStart(2, '0')}: {exam.title}
            </p>

            {/* CEFR Scale Badge */}
            <div className="inline-flex items-center gap-1 mt-4 p-1 bg-neutral-100 border border-neutral-300 rounded text-xs font-mono">
              <span className="px-2 py-0.5 text-neutral-400">A1</span>
              <span className="px-2 py-0.5 text-neutral-400">A2</span>
              <span className="px-3 py-0.5 bg-orange-500 text-white font-bold rounded shadow-sm">B1</span>
              <span className="px-2 py-0.5 text-neutral-400">B2</span>
              <span className="px-2 py-0.5 text-neutral-400">C1</span>
              <span className="px-2 py-0.5 text-neutral-400">C2</span>
            </div>
          </div>

          {/* Candidate Form & Marking Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 border-2 border-neutral-800 rounded bg-neutral-50/50 mb-8">
            {/* Left 7 cols: Candidate Fields */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                  Nachname, Vorname
                  {lang === 'en' && <span className="text-[10px] text-amber-700 font-normal lowercase ml-1">/ last name, first name</span>}
                </label>
                <div className="h-7 border-b-2 border-neutral-900 bg-white/70 px-2 flex items-center text-sm font-medium">
                  {isEditable ? (
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none font-semibold text-neutral-900"
                      placeholder="Mustermann, Anna"
                      defaultValue="Mustermann, Anna"
                    />
                  ) : (
                    <span className="text-neutral-400 italic">Name des Teilnehmers</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                  Institution, Ort
                  {lang === 'en' && <span className="text-[10px] text-amber-700 font-normal lowercase ml-1">/ institution, city</span>}
                </label>
                <div className="h-7 border-b-2 border-neutral-900 bg-white/70 px-2 flex items-center text-sm">
                  {isEditable ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={exam.candidateInfo?.institution || ''}
                        onChange={(e) => updateExam((d) => { d.candidateInfo.institution = e.target.value; })}
                        placeholder="Institution"
                        className="bg-transparent outline-none w-1/2 font-semibold"
                      />
                      <span>,</span>
                      <input
                        type="text"
                        value={exam.candidateInfo?.city || ''}
                        onChange={(e) => updateExam((d) => { d.candidateInfo.city = e.target.value; })}
                        placeholder="Ort"
                        className="bg-transparent outline-none w-1/2 font-semibold"
                      />
                    </div>
                  ) : (
                    <span>{exam.candidateInfo?.institution || 'Goethe-Institut'}, {exam.candidateInfo?.city || 'Prüfungszentrum'}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 uppercase mb-1">
                    Geburtsdatum (TT.MM.JJJJ)
                    {lang === 'en' && <span className="text-[9px] text-amber-700 font-normal lowercase ml-1">/ birthdate</span>}
                  </label>
                  <div className="flex gap-1">
                    {[' ', ' '].map((_, i) => (
                      <span key={`d-${i}`} className="w-5 h-6 border border-neutral-800 bg-white flex items-center justify-center font-mono text-xs"></span>
                    ))}
                    <span className="self-end pb-1 font-bold">.</span>
                    {[' ', ' '].map((_, i) => (
                      <span key={`m-${i}`} className="w-5 h-6 border border-neutral-800 bg-white flex items-center justify-center font-mono text-xs"></span>
                    ))}
                    <span className="self-end pb-1 font-bold">.</span>
                    {[' ', ' ', ' ', ' '].map((_, i) => (
                      <span key={`y-${i}`} className="w-5 h-6 border border-neutral-800 bg-white flex items-center justify-center font-mono text-xs"></span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 uppercase mb-1">
                    Prüfungsteilnehmer-Nr. (PTN)
                    {lang === 'en' && <span className="text-[9px] text-amber-700 font-normal lowercase ml-1">/ candidate ID</span>}
                  </label>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={`ptn-${i}`} className="w-4 h-6 border border-neutral-800 bg-white flex items-center justify-center font-mono text-[10px]"></span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs">☒</span>
                  <span className="font-semibold text-neutral-800">
                    A Erw. {lang === 'en' ? '(Adults)' : '(Erwachsene ab 16)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-900 bg-white"></span>
                  <span className="text-neutral-500">
                    B Jug. {lang === 'en' ? '(Youth)' : '(Jugendliche)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Official Checkbox Legend */}
            <div className="md:col-span-5 border border-neutral-400 p-3 bg-white text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <span>Markieren Sie so:</span>
                <span className="w-5 h-5 border-2 border-neutral-900 flex items-center justify-center font-black text-sm">☒</span>
                {lang === 'en' && <span className="text-[10px] text-amber-800 font-normal">(Mark like this)</span>}
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                <span>NICHT so:</span>
                <span className="line-through">✔</span>
                <span className="line-through">🗷</span>
                <span className="line-through">●</span>
                <span className="line-through">⯁</span>
              </div>
              <hr className="border-neutral-200" />
              <div className="text-[11px] text-neutral-700 leading-tight">
                <strong>Füllen Sie zur Korrektur das Feld aus:</strong>
                <div className="inline-block w-4 h-4 bg-neutral-900 ml-2 align-middle"></div>
              </div>
              <div className="text-[11px] text-neutral-700 leading-tight">
                <strong>Markieren Sie das richtige Feld neu:</strong>
                <div className="inline-block w-4 h-4 border-2 border-neutral-900 font-bold text-center leading-3 ml-2 align-middle">☒</div>
              </div>
            </div>
          </div>

          {/* Introductory Instructions */}
          <div className="bg-neutral-100 p-6 border-l-4 border-orange-500 rounded text-xs space-y-3">
            <h3 className="font-bold text-sm text-neutral-900">Kandidatenblätter: Modul Lesen (65 Minuten)</h3>
            <p>
              Das Modul <strong>Lesen</strong> hat fünf Teile. Sie lesen mehrere Texte und lösen Aufgaben dazu.
              Sie können mit jeder Aufgabe beginnen. Für jede Aufgabe gibt es nur eine richtige Lösung.
            </p>
            <p>
              Vergessen Sie bitte nicht, Ihre Lösungen innerhalb der Prüfungszeit auf den <strong>Antwortbogen</strong> zu übertragen.
              Bitte schreiben Sie deutlich und verwenden Sie keinen Bleistift.
            </p>
            <p className="text-neutral-500 italic">
              Hilfsmittel wie Wörterbücher oder Mobiltelefone sind während der gesamten Prüfung nicht erlaubt.
            </p>
          </div>

          <PageFooter pageNumber={7} />
        </section>
      )}

      {/* PAGE 2: TEIL 1 (Items 1 - 6) */}
      {shouldRenderPage(2) && (
        <section data-exam-page="2" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={8} />

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-lg font-extrabold text-neutral-900">Teil 1</h2>
              <span className="text-xs font-bold text-neutral-600">Arbeitszeit: {exam.teil1.workTimeMinutes} Minuten</span>
            </div>
            <p className="text-xs text-neutral-700 italic">
              <InlineEditable
                value={exam.teil1.instruction}
                onChange={(val) => updateExam((d) => { d.teil1.instruction = val; })}
              />
            </p>
          </div>

          {/* English Native Speaker Guide */}
          {lang === 'en' && (
            <div className="no-print mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2.5 shadow-sm">
              <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 mb-0.5">Part 1 Guide (10 min • 6 points)</div>
                <div>{t.teil1Guide}</div>
                <div className="text-[11px] text-amber-800 mt-1 italic">
                  💡 Strategy: Questions 1–6 follow the chronological order of the email/post. Watch out for negations (nicht, kein, nie).
                </div>
              </div>
            </div>
          )}

          {/* Browser / Email Frame Mockup */}
          <div className="border border-neutral-400 rounded-t-lg shadow-sm bg-neutral-100 overflow-hidden mb-6">
            <div className="bg-neutral-200 border-b border-neutral-300 px-3 py-1.5 flex items-center justify-between text-[11px] text-neutral-600">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-black cursor-pointer transition"
                  title="Nach oben scrollen"
                >
                  Zurück
                </button>
                <span className="text-neutral-400">Vorwärts</span>
                <button
                  type="button"
                  onClick={() => {
                    const startBtn = document.querySelector('[data-testid="start-tab-btn"]') as HTMLButtonElement | null;
                    if (startBtn) startBtn.click();
                    else window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black font-semibold text-neutral-800 hover:underline cursor-pointer transition"
                  title="Zur Startseite wechseln"
                >
                  Startseite
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hover:text-black hover:underline cursor-pointer transition"
                  title="Druckdialog öffnen"
                >
                  Drucken
                </button>
              </div>
              <div className="bg-white border border-neutral-300 rounded px-2 py-0.5 text-[10px] text-neutral-500 w-52 truncate">
                http://postfach.online-mail.de/inbox/read
              </div>
            </div>
            <div className="bg-neutral-50 border-b border-neutral-300 px-4 py-2 text-xs flex items-center gap-2">
              <span className="font-bold text-neutral-500 uppercase text-[10px]">Betreff:</span>
              <span className="font-semibold text-neutral-800">
                <InlineEditable
                  value={exam.title}
                  onChange={(val) => updateExam((d) => { d.title = val; })}
                /> – Persönliche Nachricht
              </span>
            </div>
            <div className="p-6 bg-white text-xs leading-relaxed text-neutral-800 space-y-3 font-normal">
              <div className="font-bold">
                <InlineEditable
                  value={exam.teil1.emailGreeting}
                  onChange={(val) => updateExam((d) => { d.teil1.emailGreeting = val; })}
                />
              </div>

              {isEditable ? (
                <InlineEditable
                  value={exam.teil1.emailBody}
                  onChange={(val) => updateExam((d) => { d.teil1.emailBody = val; })}
                  multiline
                  rows={8}
                />
              ) : spaceLines.showLineNumbers ? (
                <LineNumberedText
                  text={exam.teil1.emailBody}
                  showLineNumbers={true}
                  interval={spaceLines.lineNumbersInterval || 5}
                  lineHeight={spaceLines.textLineHeight || 1.45}
                />
              ) : (
                exam.teil1.emailBody.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-justify indent-2">
                    {paragraph}
                  </p>
                ))
              )}

              <div className="pt-2 font-bold whitespace-pre-line">
                <InlineEditable
                  value={exam.teil1.emailSignoff}
                  onChange={(val) => updateExam((d) => { d.teil1.emailSignoff = val; })}
                  multiline
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Worked Example (Beispiel 0) */}
          <div className="p-3 bg-neutral-100 border border-neutral-300 rounded mb-4 text-xs flex items-center justify-between">
            <div className="flex items-start gap-2">
              <span className="font-extrabold text-neutral-900">0</span>
              <span className="text-neutral-800 font-medium">Beispiel: {exam.teil1.beispiel.statement}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold pl-4">
              <label className="flex items-center gap-1.5">
                <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold ${exam.teil1.beispiel.answer === 'Richtig' ? 'text-black' : 'text-transparent'}`}>
                  {exam.teil1.beispiel.answer === 'Richtig' ? '☒' : ''}
                </span>
                <span>Richtig</span>
              </label>
              <label className="flex items-center gap-1.5">
                <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold ${exam.teil1.beispiel.answer === 'Falsch' ? 'text-black' : 'text-transparent'}`}>
                  {exam.teil1.beispiel.answer === 'Falsch' ? '☒' : ''}
                </span>
                <span>Falsch</span>
              </label>
            </div>
          </div>

          {/* Statements 1 to 6 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spaceLines.itemSpacingRem || 0.75}rem` }}>
            {exam.teil1.items.map((item) => (
              <div key={item.id} className={`p-3 ${spaceLines.showItemDividers ? 'border-b border-neutral-200' : ''} flex items-center justify-between text-xs hover:bg-neutral-50`}>
                <div className="flex items-start gap-3 max-w-[70%]">
                  <span className="font-extrabold text-neutral-900 min-w-[18px]">{item.number}</span>
                  <span className="text-neutral-900 w-full">
                    <InlineEditable
                      value={item.statement}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil1.items.find(it => it.id === item.id);
                        if (target) target.statement = val;
                      })}
                    />
                  </span>
                </div>

                {/* Clickable Answer Selection */}
                <div className="flex items-center gap-4 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => isEditable && updateExam((d) => {
                      const target = d.teil1.items.find(it => it.id === item.id);
                      if (target) target.correctAnswer = 'Richtig';
                    })}
                    className={`flex items-center gap-1.5 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                    title={isEditable ? 'Klicken, um Richtig als Lösung zu setzen' : undefined}
                  >
                    <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs ${item.correctAnswer === 'Richtig' ? 'text-black' : 'text-transparent'}`}>
                      {item.correctAnswer === 'Richtig' ? '☒' : ''}
                    </span>
                    <span className="text-neutral-700">Richtig</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => isEditable && updateExam((d) => {
                      const target = d.teil1.items.find(it => it.id === item.id);
                      if (target) target.correctAnswer = 'Falsch';
                    })}
                    className={`flex items-center gap-1.5 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                    title={isEditable ? 'Klicken, um Falsch als Lösung zu setzen' : undefined}
                  >
                    <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs ${item.correctAnswer === 'Falsch' ? 'text-black' : 'text-transparent'}`}>
                      {item.correctAnswer === 'Falsch' ? '☒' : ''}
                    </span>
                    <span className="text-neutral-700">Falsch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil1} />
          <PageFooter pageNumber={8} />
        </section>
      )}

      {/* PAGE 3: TEIL 2 - TEXT A (Items 7 - 9) */}
      {shouldRenderPage(3) && (
        <section data-exam-page="3" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={9} />

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-lg font-extrabold text-neutral-900">Teil 2</h2>
              <span className="text-xs font-bold text-neutral-600">Arbeitszeit: {exam.teil2.workTimeMinutes} Minuten</span>
            </div>
            <p className="text-xs text-neutral-700 italic">
              <InlineEditable
                value={exam.teil2.instruction}
                onChange={(val) => updateExam((d) => { d.teil2.instruction = val; })}
              />
            </p>
          </div>

          {/* TEXT A */}
          <div className="border border-neutral-300 p-5 rounded bg-neutral-50 mb-4">
            <div className="border-b border-neutral-300 pb-2 mb-3">
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                <InlineEditable
                  value={exam.teil2.textA.title}
                  onChange={(val) => updateExam((d) => { d.teil2.textA.title = val; })}
                />
              </h3>
              <p className="text-xs font-medium text-neutral-600 italic">
                <InlineEditable
                  value={exam.teil2.textA.kicker}
                  onChange={(val) => updateExam((d) => { d.teil2.textA.kicker = val; })}
                />
              </p>
            </div>
            <div className="text-xs leading-relaxed text-neutral-800 space-y-2 text-justify">
              {isEditable ? (
                <InlineEditable
                  value={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                  onChange={(val) => updateExam((d) => { d.teil2.textA.bodyParagraphs = val.split('\n\n'); })}
                  multiline
                  rows={6}
                />
              ) : spaceLines.showLineNumbers ? (
                <LineNumberedText
                  text={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                  showLineNumbers={true}
                  interval={spaceLines.lineNumbersInterval || 5}
                  lineHeight={spaceLines.textLineHeight || 1.45}
                />
              ) : (
                exam.teil2.textA.bodyParagraphs.map((p, idx) => (
                  <p key={idx} className="indent-3">{p}</p>
                ))
              )}
            </div>
          </div>

          {/* Text A Tasks 7, 8, 9 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spaceLines.itemSpacingRem || 0.75}rem` }} className="mb-4">
            {exam.teil2.textA.items.map((item) => (
              <div key={item.id} className={`p-3 border-l-2 border-neutral-300 pl-4 text-xs ${spaceLines.showItemDividers ? 'border-b border-neutral-200' : ''}`}>
                <div className="font-bold text-neutral-900 mb-2">
                  <span className="mr-1">{item.number}</span>
                  <InlineEditable
                    value={item.question}
                    onChange={(val) => updateExam((d) => {
                      const target = d.teil2.textA.items.find(it => it.id === item.id);
                      if (target) target.question = val;
                    })}
                  />
                </div>
                <div className="space-y-1.5 pl-3">
                  {(['a', 'b', 'c'] as const).map((opt) => (
                    <div
                      key={opt}
                      onClick={() => isEditable && updateExam((d) => {
                        const target = d.teil2.textA.items.find(it => it.id === item.id);
                        if (target) target.correctAnswer = opt;
                      })}
                      className={`flex items-start gap-2 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                      title={isEditable ? `Klicken, um [${opt.toUpperCase()}] als richtige Lösung zu markieren` : undefined}
                    >
                      <span className={`w-4 h-4 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${item.correctAnswer === opt ? 'text-black' : 'text-transparent'}`}>
                        {item.correctAnswer === opt ? '☒' : ''}
                      </span>
                      <span className="text-neutral-800 w-full">
                        <strong className="text-neutral-900">[{opt}]</strong>{' '}
                        <InlineEditable
                          value={item.options[opt]}
                          onChange={(val) => updateExam((d) => {
                            const target = d.teil2.textA.items.find(it => it.id === item.id);
                            if (target) target.options[opt] = val;
                          })}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil2} title="Teil 2A: Notizen / Stichpunkte" />
          <PageFooter pageNumber={9} />
        </section>
      )}

      {/* PAGE 4: TEIL 2 - TEXT B (Items 10 - 12) */}
      {shouldRenderPage(4) && (
        <section data-exam-page="4" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={10} />

          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-neutral-600 uppercase tracking-wider">noch Teil 2</h2>
          </div>

          {/* TEXT B */}
          <div className="border border-neutral-300 p-5 rounded bg-neutral-50 mb-6">
            <div className="border-b border-neutral-300 pb-2 mb-3">
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                <InlineEditable
                  value={exam.teil2.textB.title}
                  onChange={(val) => updateExam((d) => { d.teil2.textB.title = val; })}
                />
              </h3>
              <p className="text-xs font-medium text-neutral-600 italic">
                <InlineEditable
                  value={exam.teil2.textB.kicker}
                  onChange={(val) => updateExam((d) => { d.teil2.textB.kicker = val; })}
                />
              </p>
            </div>
            <div className="text-xs leading-relaxed text-neutral-800 space-y-2 text-justify">
              {isEditable ? (
                <InlineEditable
                  value={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                  onChange={(val) => updateExam((d) => { d.teil2.textB.bodyParagraphs = val.split('\n\n'); })}
                  multiline
                  rows={6}
                />
              ) : spaceLines.showLineNumbers ? (
                <LineNumberedText
                  text={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                  showLineNumbers={true}
                  interval={spaceLines.lineNumbersInterval || 5}
                  lineHeight={spaceLines.textLineHeight || 1.45}
                />
              ) : (
                exam.teil2.textB.bodyParagraphs.map((p, idx) => (
                  <p key={idx} className="indent-3">{p}</p>
                ))
              )}
            </div>
          </div>

          {/* Text B Tasks 10, 11, 12 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spaceLines.itemSpacingRem || 0.75}rem` }} className="mb-4">
            {exam.teil2.textB.items.map((item) => (
              <div key={item.id} className={`p-3 border-l-2 border-neutral-300 pl-4 text-xs ${spaceLines.showItemDividers ? 'border-b border-neutral-200' : ''}`}>
                <div className="font-bold text-neutral-900 mb-2">
                  <span className="mr-1">{item.number}</span>
                  <InlineEditable
                    value={item.question}
                    onChange={(val) => updateExam((d) => {
                      const target = d.teil2.textB.items.find(it => it.id === item.id);
                      if (target) target.question = val;
                    })}
                  />
                </div>
                <div className="space-y-2 pl-3">
                  {(['a', 'b', 'c'] as const).map((opt) => (
                    <div
                      key={opt}
                      onClick={() => isEditable && updateExam((d) => {
                        const target = d.teil2.textB.items.find(it => it.id === item.id);
                        if (target) target.correctAnswer = opt;
                      })}
                      className={`flex items-start gap-2 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                      title={isEditable ? `Klicken, um [${opt.toUpperCase()}] als richtige Lösung zu markieren` : undefined}
                    >
                      <span className={`w-4 h-4 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${item.correctAnswer === opt ? 'text-black' : 'text-transparent'}`}>
                        {item.correctAnswer === opt ? '☒' : ''}
                      </span>
                      <span className="text-neutral-800 w-full">
                        <strong className="text-neutral-900">[{opt}]</strong>{' '}
                        <InlineEditable
                          value={item.options[opt]}
                          onChange={(val) => updateExam((d) => {
                            const target = d.teil2.textB.items.find(it => it.id === item.id);
                            if (target) target.options[opt] = val;
                          })}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil2} title="Teil 2B: Notizen / Stichpunkte" />
          <PageFooter pageNumber={10} />
        </section>
      )}

      {/* PAGE 5: TEIL 3 (Situations 13 - 19 & Ads A - J) */}
      {shouldRenderPage(5) && (
        <section data-exam-page="5" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={11} />

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-lg font-extrabold text-neutral-900">Teil 3</h2>
              <span className="text-xs font-bold text-neutral-600">Arbeitszeit: {exam.teil3.workTimeMinutes} Minuten</span>
            </div>
            <p className="text-xs text-neutral-700 italic mb-2">
              <InlineEditable
                value={exam.teil3.instruction}
                onChange={(val) => updateExam((d) => { d.teil3.instruction = val; })}
              />
            </p>
            <p className="text-xs font-bold text-neutral-900 bg-neutral-100 p-2 border-l-2 border-neutral-800">
              <InlineEditable
                value={exam.teil3.contextDescription}
                onChange={(val) => updateExam((d) => { d.teil3.contextDescription = val; })}
              />
            </p>
          </div>

          {/* Situations 13-19 */}
          <div className="mb-6 space-y-2">
            {/* Beispiel */}
            <div className="p-2.5 bg-neutral-100 border border-neutral-300 rounded text-xs flex items-center justify-between font-medium">
              <div className="flex items-start gap-2 max-w-[80%]">
                <span className="font-extrabold text-neutral-900">0</span>
                <span>{exam.teil3.beispiel.situation}</span>
              </div>
              <div className="font-bold text-xs bg-white px-2 py-0.5 border border-neutral-400">
                Anzeige: <span className="underline font-black">{exam.teil3.beispiel.answer.toUpperCase()}</span>
              </div>
            </div>

            {/* Items 13 to 19 */}
            {exam.teil3.situations.map((sit) => (
              <div key={sit.id} className="p-2 border-b border-neutral-200 flex items-center justify-between text-xs hover:bg-neutral-50">
                <div className="flex items-start gap-2.5 max-w-[75%]">
                  <span className="font-extrabold text-neutral-900 min-w-[20px]">{sit.number}</span>
                  <span className="text-neutral-900 w-full">
                    <InlineEditable
                      value={sit.situation}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil3.situations.find(s => s.id === sit.id);
                        if (target) target.situation = val;
                      })}
                    />
                  </span>
                </div>

                <div className="font-mono text-xs whitespace-nowrap text-neutral-700 font-semibold flex items-center gap-1.5">
                  <span>Anzeige:</span>
                  {isEditable ? (
                    <select
                      value={sit.correctAnswer.toLowerCase()}
                      onChange={(e) => updateExam((d) => {
                        const target = d.teil3.situations.find(s => s.id === sit.id);
                        if (target) target.correctAnswer = e.target.value;
                      })}
                      className="bg-amber-100 border border-amber-500 rounded px-1.5 py-0.5 font-bold font-mono text-xs text-neutral-900"
                    >
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map((l) => (
                        <option key={l} value={l}>
                          [{l.toUpperCase()}]
                        </option>
                      ))}
                      <option value="0">[0] Keine</option>
                    </select>
                  ) : (
                    <span>[ <span className="inline-block w-8 border-b-2 border-neutral-700 text-center font-bold text-black">&nbsp;</span> ]</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Advertisements Grid */}
          <div className="mt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3">
              Anzeigen A bis J
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exam.teil3.advertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="relative p-3.5 bg-amber-50/40 border border-neutral-300 rounded shadow-sm hover:shadow-md transition-shadow text-xs"
                  style={{
                    transform: `rotate(${ad.rotationDeg || 0}deg)`,
                  }}
                >
                  <div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-neutral-900 text-white font-extrabold flex items-center justify-center text-xs rounded border border-white shadow">
                    {ad.letter.toUpperCase()}
                  </div>
                  <h4 className="font-black text-neutral-900 text-xs mb-1 pl-3">
                    <InlineEditable
                      value={ad.title}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil3.advertisements.find(a => a.id === ad.id);
                        if (target) target.title = val;
                      })}
                    />
                  </h4>
                  <div className="text-neutral-700 text-[11px] leading-relaxed mb-2">
                    <InlineEditable
                      value={ad.body}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil3.advertisements.find(a => a.id === ad.id);
                        if (target) target.body = val;
                      })}
                      multiline
                      rows={3}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-neutral-500 italic border-t border-neutral-200 pt-1">
                    <InlineEditable
                      value={ad.contact}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil3.advertisements.find(a => a.id === ad.id);
                        if (target) target.contact = val;
                      })}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil3} />
          <PageFooter pageNumber={12} />
        </section>
      )}

      {/* PAGE 6: TEIL 4 (LESERBRIEFE / Items 20 - 26) */}
      {shouldRenderPage(6) && (
        <section data-exam-page="6" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={13} />

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-lg font-extrabold text-neutral-900">Teil 4</h2>
              <span className="text-xs font-bold text-neutral-600">Arbeitszeit: {exam.teil4.workTimeMinutes} Minuten</span>
            </div>
            <p className="text-xs text-neutral-700 italic mb-2">
              <InlineEditable
                value={exam.teil4.instruction}
                onChange={(val) => updateExam((d) => { d.teil4.instruction = val; })}
              />
            </p>
            <p className="text-xs font-bold text-neutral-800 bg-neutral-100 p-2.5 border-l-2 border-neutral-800">
              <InlineEditable
                value={exam.teil4.contextTopic}
                onChange={(val) => updateExam((d) => { d.teil4.contextTopic = val; })}
              />
            </p>
          </div>

          <div className="w-full text-center py-2 bg-neutral-800 text-white font-black tracking-widest text-sm uppercase rounded mb-4 shadow">
            LESERBRIEFE
          </div>

          {/* Beispiel 0 */}
          <div className="p-3 bg-neutral-100 border border-neutral-300 rounded mb-4 text-xs flex items-center justify-between">
            <div className="max-w-[75%]">
              <span className="font-extrabold text-neutral-900 mr-2">0</span>
              <span className="font-bold text-neutral-800">{exam.teil4.beispiel.author}, {exam.teil4.beispiel.age}, {exam.teil4.beispiel.city}:</span>{' '}
              <span className="italic text-neutral-700">„{exam.teil4.beispiel.text}“</span>
            </div>
            <div className="flex items-center gap-3 font-bold pl-4">
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold ${exam.teil4.beispiel.answer === 'Ja' ? 'text-black' : 'text-transparent'}`}>
                  {exam.teil4.beispiel.answer === 'Ja' ? '☒' : ''}
                </span>
                <span>Ja</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold ${exam.teil4.beispiel.answer === 'Nein' ? 'text-black' : 'text-transparent'}`}>
                  {exam.teil4.beispiel.answer === 'Nein' ? '☒' : ''}
                </span>
                <span>Nein</span>
              </div>
            </div>
          </div>

          {/* Items 20 - 26 */}
          <div className="space-y-3.5">
            {exam.teil4.leserbriefe.map((lb) => (
              <div key={lb.id} className="p-3 border border-neutral-200 rounded hover:bg-neutral-50/70 transition-colors flex items-center justify-between text-xs">
                <div className="max-w-[75%] space-y-1">
                  <div className="font-black text-neutral-900 flex items-center gap-2">
                    <span className="text-sm font-mono">{lb.number}</span>
                    <InlineEditable
                      value={lb.author}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                        if (target) target.author = val;
                      })}
                    />,{' '}
                    <InlineEditable
                      value={String(lb.age)}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                        if (target) target.age = parseInt(val, 10) || 25;
                      })}
                    />,{' '}
                    <InlineEditable
                      value={lb.city}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                        if (target) target.city = val;
                      })}
                    />
                  </div>
                  <div className="text-neutral-800 text-[11px] leading-relaxed italic pl-5">
                    „<InlineEditable
                      value={lb.text}
                      onChange={(val) => updateExam((d) => {
                        const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                        if (target) target.text = val;
                      })}
                      multiline
                      rows={2}
                    />“
                  </div>
                </div>

                {/* Clickable Ja / Nein Answer Selection */}
                <div className="flex items-center gap-3 font-bold pl-4">
                  <button
                    type="button"
                    onClick={() => isEditable && updateExam((d) => {
                      const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                      if (target) target.correctAnswer = 'Ja';
                    })}
                    className={`flex items-center gap-1 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                    title={isEditable ? 'Klicken, um Ja als Lösung zu markieren' : undefined}
                  >
                    <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs ${lb.correctAnswer === 'Ja' ? 'text-black' : 'text-transparent'}`}>
                      {lb.correctAnswer === 'Ja' ? '☒' : ''}
                    </span>
                    <span>Ja</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => isEditable && updateExam((d) => {
                      const target = d.teil4.leserbriefe.find(l => l.id === lb.id);
                      if (target) target.correctAnswer = 'Nein';
                    })}
                    className={`flex items-center gap-1 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                    title={isEditable ? 'Klicken, um Nein als Lösung zu markieren' : undefined}
                  >
                    <span className={`w-5 h-5 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs ${lb.correctAnswer === 'Nein' ? 'text-black' : 'text-transparent'}`}>
                      {lb.correctAnswer === 'Nein' ? '☒' : ''}
                    </span>
                    <span>Nein</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil4} />
          <PageFooter pageNumber={13} />
        </section>
      )}

      {/* PAGE 7: TEIL 5 (Bordered Rules Card & Items 27 - 30) */}
      {shouldRenderPage(7) && (
        <section data-exam-page="7" className={`a4-page min-h-[1120px] flex flex-col relative ${marginClass} border-b-8 border-neutral-300 print:border-none print:min-h-screen print:p-8`}>
          <WatermarkOverlay />
          <HeaderBar left="ZERTIFIKAT B1" middle="LESEN" right="KANDIDATENBLÄTTER" pageNumber={14} />

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-lg font-extrabold text-neutral-900">Teil 5</h2>
              <span className="text-xs font-bold text-neutral-600">Arbeitszeit: {exam.teil5.workTimeMinutes} Minuten</span>
            </div>
            <p className="text-xs text-neutral-700 italic mb-2">
              <InlineEditable
                value={exam.teil5.instruction}
                onChange={(val) => updateExam((d) => { d.teil5.instruction = val; })}
              />
            </p>
            <p className="text-xs font-bold text-neutral-800 bg-neutral-100 p-2 border-l-2 border-neutral-800">
              <InlineEditable
                value={exam.teil5.contextSituation}
                onChange={(val) => updateExam((d) => { d.teil5.contextSituation = val; })}
              />
            </p>
          </div>

          {/* Bordered & Drop-Shadowed Rules Card */}
          <div className="border-2 border-neutral-800 rounded p-6 shadow-md bg-neutral-50/40 mb-6">
            <div className="text-center border-b-2 border-neutral-800 pb-3 mb-4">
              <h3 className="text-base font-black tracking-tight text-neutral-900 uppercase">
                <InlineEditable
                  value={exam.teil5.sheetTitle}
                  onChange={(val) => updateExam((d) => { d.teil5.sheetTitle = val; })}
                />
              </h3>
              {exam.teil5.sheetSubtitle && (
                <p className="text-xs font-medium text-neutral-600 italic mt-0.5">
                  <InlineEditable
                    value={exam.teil5.sheetSubtitle}
                    onChange={(val) => updateExam((d) => { d.teil5.sheetSubtitle = val; })}
                  />
                </p>
              )}
            </div>
            <div className="space-y-3.5 text-xs text-neutral-800 leading-relaxed text-justify">
              {exam.teil5.sections.map((sec, idx) => (
                <div key={idx}>
                  <h4 className="font-extrabold text-neutral-900 text-xs mb-0.5">
                    <InlineEditable
                      value={sec.title}
                      onChange={(val) => updateExam((d) => { d.teil5.sections[idx].title = val; })}
                    />:
                  </h4>
                  {isEditable ? (
                    <InlineEditable
                      value={sec.content}
                      onChange={(val) => updateExam((d) => { d.teil5.sections[idx].content = val; })}
                      multiline
                      rows={3}
                    />
                  ) : spaceLines.showLineNumbers ? (
                    <LineNumberedText
                      text={sec.content}
                      showLineNumbers={true}
                      interval={spaceLines.lineNumbersInterval || 5}
                      lineHeight={spaceLines.textLineHeight || 1.45}
                    />
                  ) : (
                    <p className="text-[11px] text-neutral-800 pl-2">
                      {sec.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items 27 - 30 */}
          <div className="space-y-4">
            {exam.teil5.items.map((item) => (
              <div key={item.id} className="p-3 border-l-2 border-neutral-400 pl-4 text-xs">
                <div className="font-bold text-neutral-900 mb-2">
                  <span className="mr-1">{item.number}</span>
                  <InlineEditable
                    value={item.question}
                    onChange={(val) => updateExam((d) => {
                      const target = d.teil5.items.find(it => it.id === item.id);
                      if (target) target.question = val;
                    })}
                  />
                </div>
                <div className="space-y-1.5 pl-3">
                  {(['a', 'b', 'c'] as const).map((opt) => (
                    <div
                      key={opt}
                      onClick={() => isEditable && updateExam((d) => {
                        const target = d.teil5.items.find(it => it.id === item.id);
                        if (target) target.correctAnswer = opt;
                      })}
                      className={`flex items-start gap-2 ${isEditable ? 'cursor-pointer p-1 rounded hover:bg-amber-100 transition' : ''}`}
                      title={isEditable ? `Klicken, um [${opt.toUpperCase()}] als richtige Lösung zu markieren` : undefined}
                    >
                      <span className={`w-4 h-4 border-2 border-neutral-900 bg-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${item.correctAnswer === opt ? 'text-black' : 'text-transparent'}`}>
                        {item.correctAnswer === opt ? '☒' : ''}
                      </span>
                      <span className="text-neutral-800 w-full">
                        <strong className="text-neutral-900">[{opt}]</strong>{' '}
                        <InlineEditable
                          value={item.options[opt]}
                          onChange={(val) => updateExam((d) => {
                            const target = d.teil5.items.find(it => it.id === item.id);
                            if (target) target.options[opt] = val;
                          })}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <NoteLinesBlock show={spaceLines.includeInTeil5} />
          <PageFooter pageNumber={14} />
        </section>
      )}
    </div>
  );
};
