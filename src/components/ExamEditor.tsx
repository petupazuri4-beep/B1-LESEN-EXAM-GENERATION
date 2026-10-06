import React, { useState } from 'react';
import {
  ExamModel,
  Teil1Item,
  Teil2Item,
  Teil3Item,
  Leserbrief,
  Teil5Item,
  SpaceLineConfig,
  DEFAULT_SPACE_LINE_CONFIG,
} from '../types/exam';
import { Language } from '../utils/i18n';
import { B1LinterPanel } from './B1LinterPanel';
import { KeyDistributionWidget } from './KeyDistributionWidget';
import { GermanTtsPlayer } from './GermanTtsPlayer';
import { ProctorProtocolModal } from './ProctorProtocolModal';
import { Teil3MatchingMatrix } from './editor/Teil3MatchingMatrix';
import { DistractorTrapAnalyzer } from './editor/DistractorTrapAnalyzer';
import { Teil4PolarityAnalyzer } from './editor/Teil4PolarityAnalyzer';
import {
  Shuffle,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Mail,
  Newspaper,
  LayoutGrid,
  MessageSquare,
  ShieldCheck,
  FileText,
  AlignJustify,
  BookOpen,
  ArrowRightLeft,
  Settings,
  Hash,
  Award,
  Layers,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  onUpdateExam: (updated: ExamModel) => void;
  lang?: Language;
}

export const ExamEditor: React.FC<Props> = ({ exam, onUpdateExam, lang = 'de' }) => {
  const [activeTab, setActiveTab] = useState<
    'teil1' | 'teil2' | 'teil3' | 'teil4' | 'teil5' | 'spaceLines' | 'settings' | 'meta'
  >('teil1');
  const [showProctorModal, setShowProctorModal] = useState<boolean>(false);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const [swapAdIndex1, setSwapAdIndex1] = useState<number>(0);
  const [swapAdIndex2, setSwapAdIndex2] = useState<number>(1);

  const cloneExam = (): ExamModel => JSON.parse(JSON.stringify(exam));

  const toggleEvidence = (itemId: string) => {
    setExpandedEvidence((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Auto-renumber items in Teil 1
  const updateTeil1Items = (items: Teil1Item[]) => {
    const renumbered = items.map((it, idx) => ({ ...it, number: idx + 1 }));
    const cloned = cloneExam();
    cloned.teil1.items = renumbered;
    onUpdateExam(cloned);
  };

  // Auto-renumber items in Teil 2
  const updateTeil2Items = (itemsA: Teil2Item[], itemsB: Teil2Item[]) => {
    const renumberedA = itemsA.map((it, idx) => ({ ...it, number: 7 + idx }));
    const renumberedB = itemsB.map((it, idx) => ({ ...it, number: 7 + itemsA.length + idx }));
    const cloned = cloneExam();
    cloned.teil2.textA.items = renumberedA;
    cloned.teil2.textB.items = renumberedB;
    onUpdateExam(cloned);
  };

  // Auto-renumber situations in Teil 3
  const updateTeil3Situations = (situations: Teil3Item[]) => {
    const renumbered = situations.map((s, idx) => ({ ...s, number: 13 + idx }));
    const cloned = cloneExam();
    cloned.teil3.situations = renumbered;
    onUpdateExam(cloned);
  };

  // Auto-renumber reader letters in Teil 4
  const updateTeil4Letters = (letters: Leserbrief[]) => {
    const renumbered = letters.map((lb, idx) => ({ ...lb, number: 20 + idx }));
    const cloned = cloneExam();
    cloned.teil4.leserbriefe = renumbered;
    onUpdateExam(cloned);
  };

  // Auto-renumber items in Teil 5
  const updateTeil5Items = (items: Teil5Item[]) => {
    const renumbered = items.map((it, idx) => ({ ...it, number: 27 + idx }));
    const cloned = cloneExam();
    cloned.teil5.items = renumbered;
    onUpdateExam(cloned);
  };

  // Shuffle mode for Teil 1
  const shuffleTeil1 = () => {
    const shuffled = [...exam.teil1.items].sort(() => Math.random() - 0.5);
    updateTeil1Items(shuffled);
  };

  // Shuffle mode for Teil 3 situations
  const shuffleTeil3 = () => {
    const shuffled = [...exam.teil3.situations].sort(() => Math.random() - 0.5);
    updateTeil3Situations(shuffled);
  };

  // Shuffle advertisements in Teil 3 AND rebind situation keys safely!
  const shuffleTeil3AdsAndRebind = () => {
    const cloned = cloneExam();
    const oldAds = [...cloned.teil3.advertisements];
    const letters: Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'> = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'
    ];
    const oldMap = new Map(oldAds.map((a) => [a.letter, { ...a }]));
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);

    const newAds = letters.map((letter, idx) => {
      const donorOldLetter = shuffledLetters[idx];
      const donor = oldMap.get(donorOldLetter)!;
      return {
        id: donor.id,
        letter,
        title: donor.title,
        body: donor.body,
        contact: donor.contact,
        rotationDeg: donor.rotationDeg,
      };
    });

    // Rebind situations
    cloned.teil3.situations = cloned.teil3.situations.map((s) => {
      const curAns = s.correctAnswer.toLowerCase();
      if (curAns === '0') return s;
      const donorIdx = shuffledLetters.indexOf(curAns as any);
      if (donorIdx !== -1) {
        return { ...s, correctAnswer: letters[donorIdx] };
      }
      return s;
    });

    cloned.teil3.advertisements = newAds;
    onUpdateExam(cloned);
  };

  // Swap any two ads and safely swap situation answer keys
  const swapTwoAdsAndRebind = (idx1: number, idx2: number) => {
    if (idx1 === idx2 || idx1 < 0 || idx2 < 0) return;
    const cloned = cloneExam();
    const ads = [...cloned.teil3.advertisements];
    const let1 = ads[idx1].letter;
    const let2 = ads[idx2].letter;
    const tTitle = ads[idx1].title;
    const tBody = ads[idx1].body;
    const tContact = ads[idx1].contact;

    ads[idx1].title = ads[idx2].title;
    ads[idx1].body = ads[idx2].body;
    ads[idx1].contact = ads[idx2].contact;

    ads[idx2].title = tTitle;
    ads[idx2].body = tBody;
    ads[idx2].contact = tContact;

    cloned.teil3.situations = cloned.teil3.situations.map((s) => {
      if (s.correctAnswer.toLowerCase() === let1) return { ...s, correctAnswer: let2 };
      if (s.correctAnswer.toLowerCase() === let2) return { ...s, correctAnswer: let1 };
      return s;
    });

    cloned.teil3.advertisements = ads;
    onUpdateExam(cloned);
  };

  // Shuffle mode for Teil 4
  const shuffleTeil4 = () => {
    const shuffled = [...exam.teil4.leserbriefe].sort(() => Math.random() - 0.5);
    updateTeil4Letters(shuffled);
  };

  const currentSpaceLines: SpaceLineConfig = exam.styleConfig?.spaceLines || DEFAULT_SPACE_LINE_CONFIG;
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

  // Teil 4 demographics statistics
  const t4JaCount = exam.teil4.leserbriefe.filter((lb) => lb.correctAnswer === 'Ja').length;
  const t4NeinCount = exam.teil4.leserbriefe.filter((lb) => lb.correctAnswer === 'Nein').length;
  const ages = exam.teil4.leserbriefe.map((lb) => lb.age);
  const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

  // Unused ad detection in Teil 3
  const assignedLetters = exam.teil3.situations
    .map((s) => s.correctAnswer.toLowerCase())
    .filter((a) => a !== '0');
  const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const unusedLetters = allLetters.filter((l) => !assignedLetters.includes(l));

  return (
    <div className="space-y-6">
      {/* 1. Item Key Distribution & Balance Monitor (Top Dashboard Widget) */}
      <KeyDistributionWidget exam={exam} onUpdateExam={onUpdateExam} lang={lang} />

      {/* Main Editor Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden text-slate-200">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-700 overflow-x-auto text-xs font-bold scrollbar-thin">
          <button
            onClick={() => setActiveTab('teil1')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teil1'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            {lang === 'en' ? 'Part 1 (1–6)' : 'Teil 1 (1–6)'}
          </button>
          <button
            onClick={() => setActiveTab('teil2')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teil2'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            {lang === 'en' ? 'Part 2 (7–12)' : 'Teil 2 (7–12)'}
          </button>
          <button
            onClick={() => setActiveTab('teil3')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teil3'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            {lang === 'en' ? 'Part 3 (13–19 & Ads)' : 'Teil 3 (13–19 & Anzeigen)'}
          </button>
          <button
            onClick={() => setActiveTab('teil4')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teil4'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {lang === 'en' ? 'Part 4 (20–26 Letters)' : 'Teil 4 (20–26 Leserbriefe)'}
          </button>
          <button
            onClick={() => setActiveTab('teil5')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teil5'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {lang === 'en' ? 'Part 5 (27–30 Rules)' : 'Teil 5 (27–30 Hausordnung)'}
          </button>
          <button
            onClick={() => setActiveTab('spaceLines')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'spaceLines'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlignJustify className="w-4 h-4" />
            {lang === 'en' ? 'Lines & Scratchpad' : 'Zeilennummer & Notizzeilen'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            {lang === 'en' ? 'Lesen Settings' : 'Lesen Einstellungen'}
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'meta'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            {lang === 'en' ? 'Header & Metadata' : 'Kopfzeile & Metadaten'}
          </button>
        </div>

        {/* Editor Body */}
        <div className="p-6">
          {/* TEIL 1 TAB */}
          {activeTab === 'teil1' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Part 1: Correspondence & True/False' : 'Teil 1: Korrespondenz & Richtig/Falsch'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Tasks 1 to 6 (Working time: 10 minutes)' : 'Aufgaben 1 bis 6 (Arbeitszeit: 10 Minuten)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <GermanTtsPlayer text={exam.teil1.emailBody} label={lang === 'en' ? 'Read Email Aloud' : 'E-Mail vorlesen'} lang={lang} />
                  <button
                    onClick={shuffleTeil1}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-200 cursor-pointer shadow-sm"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Shuffle Tasks' : 'Aufgaben mischen'}
                  </button>
                </div>
              </div>

              {/* CEFR B1 Linter Panel for Teil 1 */}
              <B1LinterPanel
                text={exam.teil1.emailBody}
                targetType="teil1"
                title={lang === 'en' ? 'CEFR B1 Linter: Part 1 Email Text (Target: 200–260 words)' : 'GER B1-Linter: Teil 1 E-Mail-Text (Ziel: 200–260 Wörter)'}
                lang={lang}
              />

              {/* Email Greeting & Body */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Salutation & Email Body' : 'Anrede & Text'}
                </label>
                <input
                  type="text"
                  value={exam.teil1.emailGreeting}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil1.emailGreeting = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <textarea
                  rows={7}
                  value={exam.teil1.emailBody}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil1.emailBody = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white font-mono leading-relaxed"
                />
                <input
                  type="text"
                  value={exam.teil1.emailSignoff}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil1.emailSignoff = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Beispiel 0 */}
              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    {lang === 'en' ? 'Example (0)' : 'Beispiel (0)'}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    {lang === 'en' ? 'Official Model Example' : 'Offizielles Musterbeispiel'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={exam.teil1.beispiel.statement}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil1.beispiel.statement = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                  <select
                    value={exam.teil1.beispiel.answer}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil1.beispiel.answer = e.target.value as any;
                      onUpdateExam(cloned);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                  >
                    <option value="Richtig">{lang === 'en' ? 'True (Richtig)' : 'Richtig'}</option>
                    <option value="Falsch">{lang === 'en' ? 'False (Falsch)' : 'Falsch'}</option>
                  </select>
                </div>
              </div>

              {/* Items 1 - 6 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    {lang === 'en' ? `Tasks 1 to ${exam.teil1.items.length}` : `Aufgaben 1 bis ${exam.teil1.items.length}`}
                  </label>
                  <button
                    onClick={() => {
                      const newItems = [
                        ...exam.teil1.items,
                        {
                          id: `t1-${Date.now()}`,
                          number: exam.teil1.items.length + 1,
                          statement: 'Neue B1-Aussage...',
                          correctAnswer: 'Richtig' as const,
                          textReference: 'E-Mail Zeile 10',
                          justification: 'Bestätigt im Text.',
                        },
                      ];
                      updateTeil1Items(newItems);
                    }}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Add Task' : 'Aufgabe hinzufügen'}
                  </button>
                </div>

                {exam.teil1.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 font-bold text-amber-400 font-mono text-center">{item.number}</span>
                      <input
                        type="text"
                        value={item.statement}
                        onChange={(e) => {
                          const updated = [...exam.teil1.items];
                          updated[idx].statement = e.target.value;
                          updateTeil1Items(updated);
                        }}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                      <select
                        value={item.correctAnswer}
                        onChange={(e) => {
                          const updated = [...exam.teil1.items];
                          updated[idx].correctAnswer = e.target.value as any;
                          updateTeil1Items(updated);
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-bold"
                      >
                        <option value="Richtig">{lang === 'en' ? 'True (Richtig)' : 'Richtig'}</option>
                        <option value="Falsch">{lang === 'en' ? 'False (Falsch)' : 'Falsch'}</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => toggleEvidence(item.id)}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          expandedEvidence[item.id]
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={lang === 'en' ? 'Edit text quote & examiner justification' : 'Textbeleg & Prüferbegründung bearbeiten'}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            const copy = [...exam.teil1.items];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            updateTeil1Items(copy);
                          }}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === exam.teil1.items.length - 1}
                          onClick={() => {
                            const copy = [...exam.teil1.items];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            updateTeil1Items(copy);
                          }}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const copy = exam.teil1.items.filter((_, i) => i !== idx);
                            updateTeil1Items(copy);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Evidence & Justification input */}
                    {expandedEvidence[item.id] && (
                      <div className="p-2.5 bg-slate-800/80 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                            {lang === 'en' ? 'Text Reference (Line / Quote)' : 'Textbeleg (Zeile / Zitat)'}
                          </label>
                          <input
                            type="text"
                            placeholder={lang === 'en' ? "e.g. Email line 8–10: '...only open on weekends'" : "z.B. E-Mail Zeile 8–10: '...nur am Wochenende geöffnet'"}
                            value={item.textReference || ''}
                            onChange={(e) => {
                              const updated = [...exam.teil1.items];
                              updated[idx].textReference = e.target.value;
                              updateTeil1Items(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                            {lang === 'en' ? 'Examiner Rationale (Pedagogical Explanation)' : 'Prüferbegründung (Teacher Explanation)'}
                          </label>
                          <input
                            type="text"
                            placeholder={lang === 'en' ? 'e.g. Contradicts statement 1 because the date was postponed.' : 'z.B. Widerspricht Aussage 1, da der Termin verschoben wurde.'}
                            value={item.justification || ''}
                            onChange={(e) => {
                              const updated = [...exam.teil1.items];
                              updated[idx].justification = e.target.value;
                              updateTeil1Items(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 2 TAB */}
          {activeTab === 'teil2' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Part 2: Two Press Articles & Multiple Choice' : 'Teil 2: Zwei Pressetexte & Mehrfachauswahl'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Tasks 7 to 12 (Working time: 20 minutes)' : 'Aufgaben 7 bis 12 (Arbeitszeit: 20 Minuten)'}
                  </p>
                </div>
              </div>

              {/* Text A */}
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    {lang === 'en' ? 'Text A (Tasks 7–9)' : 'Text A (Aufgaben 7–9)'}
                  </span>
                  <GermanTtsPlayer text={exam.teil2.textA.bodyParagraphs.join(' ')} label={lang === 'en' ? 'Read Text A Aloud' : 'Text A vorlesen'} lang={lang} />
                </div>
                <B1LinterPanel
                  text={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                  targetType="teil2_textA"
                  title={lang === 'en' ? 'CEFR B1 Linter: Text A (Target: 130–180 words)' : 'GER B1-Linter: Text A (Ziel: 130–180 Wörter)'}
                  lang={lang}
                />
                <input
                  type="text"
                  value={exam.teil2.textA.title}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil2.textA.title = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-bold"
                  placeholder={lang === 'en' ? 'Title Text A' : 'Titel Text A'}
                />
                <textarea
                  rows={5}
                  value={exam.teil2.textA.bodyParagraphs.join('\n\n')}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil2.textA.bodyParagraphs = e.target.value.split('\n\n');
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-xs text-white font-mono leading-relaxed"
                />

                {/* Items A */}
                <div className="space-y-3 pt-2">
                  {exam.teil2.textA.items.map((item, idx) => {
                    return (
                      <div key={item.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 text-xs">
                            {lang === 'en' ? `Task ${item.number}` : `Aufgabe ${item.number}`}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-400">
                                {lang === 'en' ? 'Correct Key:' : 'Richtige Lösung:'}
                              </span>
                              <select
                                value={item.correctAnswer}
                                onChange={(e) => {
                                  const cloned = cloneExam();
                                  cloned.teil2.textA.items[idx].correctAnswer = e.target.value as any;
                                  onUpdateExam(cloned);
                                }}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-amber-400"
                              >
                                <option value="a">A</option>
                                <option value="b">B</option>
                                <option value="c">C</option>
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleEvidence(item.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                expandedEvidence[item.id]
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                              title={lang === 'en' ? 'Edit text quote & examiner justification' : 'Textbeleg & Prüferbegründung bearbeiten'}
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const cloned = cloneExam();
                            cloned.teil2.textA.items[idx].question = e.target.value;
                            onUpdateExam(cloned);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-semibold"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {(['a', 'b', 'c'] as const).map((opt) => (
                            <div key={opt} className="flex items-center gap-1.5">
                              <span
                                className={`font-bold font-mono px-1 rounded uppercase ${
                                  item.correctAnswer === opt ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                                }`}
                              >
                                [{opt}]
                              </span>
                              <input
                                type="text"
                                value={item.options[opt]}
                                onChange={(e) => {
                                  const cloned = cloneExam();
                                  cloned.teil2.textA.items[idx].options[opt] = e.target.value;
                                  onUpdateExam(cloned);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Evidence & Justification input */}
                        {expandedEvidence[item.id] && (
                          <div className="p-2.5 bg-slate-900/90 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                            <div>
                              <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                                {lang === 'en' ? 'Text Reference (Text A)' : 'Textbeleg (Text A)'}
                              </label>
                              <input
                                type="text"
                                placeholder={lang === 'en' ? "e.g. Paragraph 2: '...already 80 percent of graduates'" : "z.B. Absatz 2: '...bereits 80 Prozent der Absolventen'"}
                                value={item.textReference || ''}
                                onChange={(e) => {
                                  const cloned = cloneExam();
                                  cloned.teil2.textA.items[idx].textReference = e.target.value;
                                  onUpdateExam(cloned);
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                                {lang === 'en' ? 'Rationale & Distractor Elimination' : 'Begründung & Distraktor-Ausschluss'}
                              </label>
                              <input
                                type="text"
                                placeholder={lang === 'en' ? "e.g. Option [a] matches text verbatim; [b] contradicts trend." : "z.B. Option [a] stimmt wörtlich überein; [b] widerspricht dem Trend."}
                                value={item.justification || ''}
                                onChange={(e) => {
                                  const cloned = cloneExam();
                                  cloned.teil2.textA.items[idx].justification = e.target.value;
                                  onUpdateExam(cloned);
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Distractor Quality & Trap Analyzer */}
                        <DistractorTrapAnalyzer
                          questionNumber={item.number}
                          questionText={item.question}
                          options={item.options}
                          correctAnswer={item.correctAnswer}
                          passageText={exam.teil2.textA.bodyParagraphs.join(' ')}
                          lang={lang}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Text B */}
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    {lang === 'en' ? 'Text B (Tasks 10–12)' : 'Text B (Aufgaben 10–12)'}
                  </span>
                  <GermanTtsPlayer text={exam.teil2.textB.bodyParagraphs.join(' ')} label={lang === 'en' ? 'Read Text B Aloud' : 'Text B vorlesen'} lang={lang} />
                </div>
                <B1LinterPanel
                  text={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                  targetType="teil2_textB"
                  title={lang === 'en' ? 'CEFR B1 Linter: Text B (Target: 130–180 words)' : 'GER B1-Linter: Text B (Ziel: 130–180 Wörter)'}
                  lang={lang}
                />
                <input
                  type="text"
                  value={exam.teil2.textB.title}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil2.textB.title = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-bold"
                  placeholder={lang === 'en' ? 'Title Text B' : 'Titel Text B'}
                />
                <textarea
                  rows={5}
                  value={exam.teil2.textB.bodyParagraphs.join('\n\n')}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil2.textB.bodyParagraphs = e.target.value.split('\n\n');
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-xs text-white font-mono leading-relaxed"
                />

                {/* Items B */}
                <div className="space-y-3 pt-2">
                  {exam.teil2.textB.items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 text-xs">
                          {lang === 'en' ? `Task ${item.number}` : `Aufgabe ${item.number}`}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400">
                              {lang === 'en' ? 'Correct Key:' : 'Richtige Lösung:'}
                            </span>
                            <select
                              value={item.correctAnswer}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil2.textB.items[idx].correctAnswer = e.target.value as any;
                                onUpdateExam(cloned);
                              }}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-amber-400"
                            >
                              <option value="a">A</option>
                              <option value="b">B</option>
                              <option value="c">C</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleEvidence(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              expandedEvidence[item.id]
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                            title={lang === 'en' ? 'Edit text quote & examiner justification' : 'Textbeleg & Prüferbegründung bearbeiten'}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil2.textB.items[idx].question = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-semibold"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {(['a', 'b', 'c'] as const).map((opt) => (
                          <div key={opt} className="flex items-center gap-1.5">
                            <span
                              className={`font-bold font-mono px-1 rounded uppercase ${
                                item.correctAnswer === opt ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                              }`}
                            >
                              [{opt}]
                            </span>
                            <input
                              type="text"
                              value={item.options[opt]}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil2.textB.items[idx].options[opt] = e.target.value;
                                onUpdateExam(cloned);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Evidence & Justification input */}
                      {expandedEvidence[item.id] && (
                        <div className="p-2.5 bg-slate-900/90 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Text Reference (Text B)' : 'Textbeleg (Text B)'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? "e.g. Paragraph 1: '...event takes place in all weather'" : "z.B. Absatz 1: '...Veranstaltung findet bei jedem Wetter statt'"}
                              value={item.textReference || ''}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil2.textB.items[idx].textReference = e.target.value;
                                onUpdateExam(cloned);
                              }}
                              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Rationale & Distractor Elimination' : 'Begründung & Distraktor-Ausschluss'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? "e.g. Option [c] is correct; [a] cites wrong date." : "z.B. Option [c] ist korrekt; [a] nennt falsches Datum."}
                              value={item.justification || ''}
                              onChange={(e) => {
                                const cloned = cloneExam();
                                cloned.teil2.textB.items[idx].justification = e.target.value;
                                onUpdateExam(cloned);
                              }}
                              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Distractor Quality & Trap Analyzer */}
                      <DistractorTrapAnalyzer
                        questionNumber={item.number}
                        questionText={item.question}
                        options={item.options}
                        correctAnswer={item.correctAnswer}
                        passageText={exam.teil2.textB.bodyParagraphs.join(' ')}
                        lang={lang}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEIL 3 TAB (Classified Ads Matrix & Layout Shuffler) */}
          {activeTab === 'teil3' && (
            <div className="space-y-6">
              {/* Interactive Matching Matrix & Zero Guard */}
              <Teil3MatchingMatrix
                exam={exam}
                onUpdateExam={onUpdateExam}
                lang={lang}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Part 3: Situation & Classified Ad Matching' : 'Teil 3: Zuordnung Situationen & Anzeigen'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? '7 Situations (13–19) & 10 Advertisements (A–J, exactly 1x "0")' : '7 Situationen (13–19) & 10 Anzeigen (A–J, exakt 1x \'0\')'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={shuffleTeil3AdsAndRebind}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    title={lang === 'en' ? 'Shuffle ads and automatically rebind answer keys for situations' : 'Mische die Anzeigen und passe die Lösungsbuchstaben der Situationen automatisch an'}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Shuffle & Rebind Ads' : 'Anzeigen mischen & synchronisieren'}</span>
                  </button>
                  <button
                    onClick={shuffleTeil3}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-200 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Shuffle Situations' : 'Situationen mischen'}</span>
                  </button>
                </div>
              </div>

              {/* Status bar for unused ad & 0 situation */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">
                    {lang === 'en' ? 'Rule Verification:' : 'Regelüberprüfung:'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      unusedLetters.length === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {lang === 'en' ? `Unused Ad: ${unusedLetters.map((l) => l.toUpperCase()).join(', ') || 'None'}` : `Ungenutzte Anzeige: ${unusedLetters.map((l) => l.toUpperCase()).join(', ') || 'Keine'}`}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 font-mono">
                    {lang === 'en'
                      ? `Situation without match: Task ${exam.teil3.situations.find((s) => s.correctAnswer === '0')?.number || 'None'}`
                      : `Situation ohne Treffer: Aufgabe ${exam.teil3.situations.find((s) => s.correctAnswer === '0')?.number || 'Keine'}`}
                  </span>
                </div>

                {/* 1-click swap any two ads */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">{lang === 'en' ? 'Swap:' : 'Tausche:'}</span>
                  <select
                    value={swapAdIndex1}
                    onChange={(e) => setSwapAdIndex1(parseInt(e.target.value, 10))}
                    className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-400 font-bold"
                  >
                    {exam.teil3.advertisements.map((ad, i) => (
                      <option key={ad.id} value={i}>
                        {lang === 'en' ? `Ad ${ad.letter.toUpperCase()}` : `Anzeige ${ad.letter.toUpperCase()}`}
                      </option>
                    ))}
                  </select>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={swapAdIndex2}
                    onChange={(e) => setSwapAdIndex2(parseInt(e.target.value, 10))}
                    className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-400 font-bold"
                  >
                    {exam.teil3.advertisements.map((ad, i) => (
                      <option key={ad.id} value={i}>
                        {lang === 'en' ? `Ad ${ad.letter.toUpperCase()}` : `Anzeige ${ad.letter.toUpperCase()}`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => swapTwoAdsAndRebind(swapAdIndex1, swapAdIndex2)}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs cursor-pointer"
                  >
                    {lang === 'en' ? 'Swap' : 'Tauschen'}
                  </button>
                </div>
              </div>

              {/* Situations 13-19 */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Situations 13 to 19' : 'Situationen 13 bis 19'}
                </label>
                {exam.teil3.situations.map((sit, idx) => {
                  const matchingAd = exam.teil3.advertisements.find(
                    (a) => a.letter.toLowerCase() === sit.correctAnswer.toLowerCase()
                  );
                  return (
                    <div key={sit.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 font-bold text-amber-400 font-mono text-center">{sit.number}</span>
                        <input
                          type="text"
                          value={sit.situation}
                          onChange={(e) => {
                            const updated = [...exam.teil3.situations];
                            updated[idx].situation = e.target.value;
                            updateTeil3Situations(updated);
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">
                            {lang === 'en' ? 'Key:' : 'Lösung:'}
                          </span>
                          <select
                            value={sit.correctAnswer.toLowerCase()}
                            onChange={(e) => {
                              const updated = [...exam.teil3.situations];
                              updated[idx].correctAnswer = e.target.value;
                              updateTeil3Situations(updated);
                            }}
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono font-bold"
                          >
                            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0'].map((letChoice) => (
                              <option key={letChoice} value={letChoice}>
                                {letChoice.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleEvidence(sit.id)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            expandedEvidence[sit.id]
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title={lang === 'en' ? 'Edit text quote & examiner justification' : 'Textbeleg & Prüferbegründung bearbeiten'}
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                        </button>
                      </div>

                      {matchingAd && (
                        <div className="text-[11px] text-slate-400 pl-9 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>
                            {lang === 'en'
                              ? <>Assigned to: <strong>Advertisement {matchingAd.letter.toUpperCase()}</strong> (&ldquo;{matchingAd.title}&rdquo;)</>
                              : <>Zugeordnet zu: <strong>Anzeige {matchingAd.letter.toUpperCase()}</strong> („{matchingAd.title}“)</>}
                          </span>
                        </div>
                      )}

                      {/* Evidence input */}
                      {expandedEvidence[sit.id] && (
                        <div className="p-2.5 bg-slate-800/80 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ml-9">
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Text Reference (Ad / Feature)' : 'Textbeleg (Anzeige / Merkmal)'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? 'e.g. Ad B highlights evening classes and trial courses.' : 'z.B. Anzeige B hebt Abendtermine und Schnupperkurse hervor.'}
                              value={sit.textReference || ''}
                              onChange={(e) => {
                                const updated = [...exam.teil3.situations];
                                updated[idx].textReference = e.target.value;
                                updateTeil3Situations(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Examiner Rationale' : 'Begründung'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? 'e.g. Matches all search criteria of Person 13.' : 'z.B. Erfüllt alle Kriterien der Person 13.'}
                              value={sit.justification || ''}
                              onChange={(e) => {
                                const updated = [...exam.teil3.situations];
                                updated[idx].justification = e.target.value;
                                updateTeil3Situations(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 10 Advertisements (A bis J) Visual Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    {lang === 'en' ? '10 Advertisements (A to J)' : '10 Anzeigen (A bis J)'}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'Click letter to view status' : 'Klick auf Buchstaben zeigt Status'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exam.teil3.advertisements.map((ad, idx) => {
                    const isUnused = unusedLetters.includes(ad.letter);
                    const matchingSit = exam.teil3.situations.find(
                      (s) => s.correctAnswer.toLowerCase() === ad.letter.toLowerCase()
                    );
                    return (
                      <div
                        key={ad.id}
                        className={`p-3 rounded-lg space-y-2 text-xs border ${
                          isUnused
                            ? 'bg-slate-900 border-amber-500/50 shadow-sm'
                            : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded font-bold font-mono flex items-center justify-center ${
                                isUnused ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-700 text-slate-200'
                              }`}
                            >
                              {ad.letter.toUpperCase()}
                            </span>
                            {isUnused ? (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                                {lang === 'en' ? 'Free / Unused Ad (Distractor)' : 'Freie Anzeige (Nicht zugeordnet)'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                ➔ {lang === 'en' ? `Situation ${matchingSit?.number}` : `Situation ${matchingSit?.number}`}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ad.body.split(/\s+/).length} {lang === 'en' ? 'words' : 'Wörter'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={ad.title}
                          onChange={(e) => {
                            const cloned = cloneExam();
                            cloned.teil3.advertisements[idx].title = e.target.value;
                            onUpdateExam(cloned);
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                          placeholder={lang === 'en' ? 'Advertisement Title' : 'Titel der Anzeige'}
                        />
                        <textarea
                          rows={3}
                          value={ad.body}
                          onChange={(e) => {
                            const cloned = cloneExam();
                            cloned.teil3.advertisements[idx].body = e.target.value;
                            onUpdateExam(cloned);
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-[11px] text-slate-200 leading-relaxed"
                        />
                        <input
                          type="text"
                          value={ad.contact}
                          onChange={(e) => {
                            const cloned = cloneExam();
                            cloned.teil3.advertisements[idx].contact = e.target.value;
                            onUpdateExam(cloned);
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-400 font-mono"
                          placeholder={lang === 'en' ? 'Contact line (Phone, Email, Web)' : 'Kontaktzeile (Tel., E-Mail, Web)'}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TEIL 4 TAB */}
          {activeTab === 'teil4' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Part 4: Reader Letters & Yes/No Stances' : 'Teil 4: Leserbriefe & Ja/Nein Meinungen'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Tasks 20 to 26 (Working time: 15 minutes)' : 'Aufgaben 20 bis 26 (Arbeitszeit: 15 Minuten)'}
                  </p>
                </div>
                <button
                  onClick={shuffleTeil4}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-200 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Shuffle Letters' : 'Briefe mischen'}
                </button>
              </div>

              {/* Demographics & Stance Dashboard */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {lang === 'en' ? 'Opinion Distribution' : 'Meinungsverteilung'}
                  </span>
                  <div className="font-mono font-bold text-white mt-0.5">
                    <span className="text-emerald-400">{t4JaCount} {lang === 'en' ? 'Yes' : 'Ja'}</span> :{' '}
                    <span className="text-rose-400">{t4NeinCount} {lang === 'en' ? 'No' : 'Nein'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'en' ? 'Target: 4:3 or 3:4' : 'Ziel: 4:3 oder 3:4'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {lang === 'en' ? 'Average Age' : 'Altersdurchschnitt'}
                  </span>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {avgAge} {lang === 'en' ? 'years' : 'Jahre'}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'en' ? `Range: ${Math.min(...ages)}–${Math.max(...ages)} yrs` : `Spanne: ${Math.min(...ages)}–${Math.max(...ages)} J.`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {lang === 'en' ? 'Total Letters' : 'Leserbriefe gesamt'}
                  </span>
                  <div className="font-mono font-bold text-white mt-0.5">
                    7 {lang === 'en' ? 'comments' : 'Kommentare'}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'en' ? 'Target: 40–70 words/text' : 'Ziel: 40–70 Wörter/Text'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {lang === 'en' ? 'Topic Context' : 'Themenkontext'}
                  </span>
                  <div className="font-semibold text-amber-400 truncate mt-0.5">{exam.theme || (lang === 'en' ? 'Everyday Topic' : 'Alltagsthema')}</div>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'en' ? 'Debate topic' : 'Aktuelles Debattenthema'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Guiding Question (Yes / No Stance Decision)' : 'Fragestellung (Ja / Nein Entscheidung)'}
                </label>
                <input
                  type="text"
                  value={exam.teil4.questionFraming}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil4.questionFraming = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Beispiel 0 */}
              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    {lang === 'en' ? 'Example (0)' : 'Beispiel (0)'}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    {lang === 'en' ? 'Model Reader Letter' : 'Muster-Leserbrief'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={exam.teil4.beispiel.author}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil4.beispiel.author = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    placeholder={lang === 'en' ? 'Author' : 'Autor'}
                  />
                  <input
                    type="number"
                    value={exam.teil4.beispiel.age}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil4.beispiel.age = parseInt(e.target.value) || 30;
                      onUpdateExam(cloned);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    placeholder={lang === 'en' ? 'Age' : 'Alter'}
                  />
                  <input
                    type="text"
                    value={exam.teil4.beispiel.city}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil4.beispiel.city = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    placeholder={lang === 'en' ? 'City' : 'Stadt'}
                  />
                  <select
                    value={exam.teil4.beispiel.answer}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.teil4.beispiel.answer = e.target.value as any;
                      onUpdateExam(cloned);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                  >
                    <option value="Ja">{lang === 'en' ? 'Yes (Ja)' : 'Ja'}</option>
                    <option value="Nein">{lang === 'en' ? 'No (Nein)' : 'Nein'}</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={exam.teil4.beispiel.text}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil4.beispiel.text = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200"
                />
              </div>

              {/* Reader Opinion Polarity & Stance Analyzer */}
              <Teil4PolarityAnalyzer
                exam={exam}
                onUpdateExam={onUpdateExam}
                lang={lang}
              />

              {/* Leserbriefe 20 - 26 */}
              <div className="space-y-3">
                {exam.teil4.leserbriefe.map((lb, idx) => {
                  const wordCount = lb.text.split(/\s+/).filter((w) => w.length > 0).length;
                  const isWordCountOptimal = wordCount >= 40 && wordCount <= 70;
                  return (
                    <div key={lb.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400 font-mono text-xs">{lb.number}</span>
                          <input
                            type="text"
                            value={lb.author}
                            onChange={(e) => {
                              const updated = [...exam.teil4.leserbriefe];
                              updated[idx].author = e.target.value;
                              updateTeil4Letters(updated);
                            }}
                            className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder={lang === 'en' ? 'First name' : 'Vorname'}
                          />
                          <input
                            type="number"
                            value={lb.age}
                            onChange={(e) => {
                              const updated = [...exam.teil4.leserbriefe];
                              updated[idx].age = parseInt(e.target.value) || 25;
                              updateTeil4Letters(updated);
                            }}
                            className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder={lang === 'en' ? 'Age' : 'Alter'}
                          />
                          <input
                            type="text"
                            value={lb.city}
                            onChange={(e) => {
                              const updated = [...exam.teil4.leserbriefe];
                              updated[idx].city = e.target.value;
                              updateTeil4Letters(updated);
                            }}
                            className="w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder={lang === 'en' ? 'City' : 'Wohnort'}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isWordCountOptimal
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {wordCount} {lang === 'en' ? 'words' : 'Wörter'}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-400">
                              {lang === 'en' ? 'Answer:' : 'Antwort:'}
                            </span>
                            <select
                              value={lb.correctAnswer}
                              onChange={(e) => {
                                const updated = [...exam.teil4.leserbriefe];
                                updated[idx].correctAnswer = e.target.value as any;
                                updateTeil4Letters(updated);
                              }}
                              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                            >
                              <option value="Ja">{lang === 'en' ? 'Yes (Ja)' : 'Ja'}</option>
                              <option value="Nein">{lang === 'en' ? 'No (Nein)' : 'Nein'}</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleEvidence(lb.id)}
                            className={`px-2 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              expandedEvidence[lb.id]
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={lang === 'en' ? 'Edit text quote & examiner justification' : 'Textbeleg & Prüferbegründung bearbeiten'}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={lb.text}
                        onChange={(e) => {
                          const updated = [...exam.teil4.leserbriefe];
                          updated[idx].text = e.target.value;
                          updateTeil4Letters(updated);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200"
                      />
                      {/* Evidence input */}
                      {expandedEvidence[lb.id] && (
                        <div className="p-2.5 bg-slate-800/80 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Text Reference (Key opinion statement)' : 'Textbeleg (Kernsatz der Meinung)'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? "e.g. 'I find this rule completely unnecessary and restrictive.'" : "z.B. 'Ich finde diese Regelung absolut überflüssig und einschränkend.'"}
                              value={lb.textReference || ''}
                              onChange={(e) => {
                                const updated = [...exam.teil4.leserbriefe];
                                updated[idx].textReference = e.target.value;
                                updateTeil4Letters(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                              {lang === 'en' ? 'Examiner Rationale' : 'Begründung'}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === 'en' ? 'e.g. Expresses clear rejection of the proposal (No).' : 'z.B. Drückt klare Ablehnung aus (Nein).'}
                              value={lb.justification || ''}
                              onChange={(e) => {
                                const updated = [...exam.teil4.leserbriefe];
                                updated[idx].justification = e.target.value;
                                updateTeil4Letters(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEIL 5 TAB */}
          {activeTab === 'teil5' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Part 5: House Rules & Regulations (Tasks 27–30)' : 'Teil 5: Hausordnung / Regelwerk (Aufgaben 27–30)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Bordered Rules Card & 4 MCQs (Working time: 10 minutes)' : 'Bordered Rules Card & 4 MCQs (Arbeitszeit: 10 Minuten)'}
                  </p>
                </div>
                <GermanTtsPlayer
                  text={exam.teil5.sections.map((s) => `${s.title}: ${s.content}`).join(' ')}
                  label={lang === 'en' ? 'Read Rules Aloud' : 'Regelwerk vorlesen'}
                  lang={lang}
                />
              </div>

              {/* CEFR B1 Linter Panel for Teil 5 */}
              <B1LinterPanel
                text={exam.teil5.sections.map((s) => s.content).join('\n\n')}
                targetType="teil5_rules"
                title={lang === 'en' ? 'CEFR B1-Linter: Part 5 Rules (Target: 250–320 words)' : 'GER B1-Linter: Teil 5 Regelwerk (Ziel: 250–320 Wörter)'}
                lang={lang}
              />

              {/* Rules Card Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Title of Rules Sheet' : 'Titel des Regelwerks'}
                </label>
                <input
                  type="text"
                  value={exam.teil5.sheetTitle}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.teil5.sheetTitle = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  placeholder={lang === 'en' ? 'e.g. Library House Rules and Terms of Use' : 'z.B. Haus- und Benutzungsordnung'}
                />
              </div>

              {/* Clause template builder buttons */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">
                  {lang === 'en' ? 'Add Quick Clause Templates:' : 'Regel-Abschnitt Schnellvorlagen hinzufügen:'}
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { title: '§ 1 Allgemeine Bestimmungen', text: 'Diese Ordnung gilt für alle Besucher und Nutzer der Einrichtung. Den Anweisungen des Personals ist Folge zu leisten.' },
                    { title: 'Öffnungszeiten & Zutritt', text: 'Die Räumlichkeiten sind montags bis freitags von 08:00 bis 20:00 Uhr geöffnet. Der Zutritt ist nur mit gültigem Ausweis gestattet.' },
                    { title: 'Ruhezeiten & Lärmschutz', text: 'In allen Lesebereichen und Fluren ist angemessene Ruhe einzuhalten. Das Telefonieren mit Mobilgeräten ist untersagt.' },
                    { title: 'Haftung, Fundsachen & Notfall', text: 'Für Garderobe und Wertgegenstände wird keine Haftung übernommen. Fundsachen sind unverzüglich am Empfang abzugeben.' },
                    { title: 'Hausrecht & Zuwiderhandlungen', text: 'Bei groben Verstößen gegen die Hausordnung kann ein befristetes oder dauerhaftes Hausverbot ausgesprochen werden.' },
                  ].map((tpl, tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => {
                        const cloned = cloneExam();
                        cloned.teil5.sections.push({ title: tpl.title, content: tpl.text });
                        onUpdateExam(cloned);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>{tpl.title.split(' ')[0]} {tpl.title.split(' ')[1] || ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections list */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Rule Sections' : 'Regelabschnitte'}
                </label>
                {exam.teil5.sections.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => {
                          const cloned = cloneExam();
                          cloned.teil5.sections[idx].title = e.target.value;
                          onUpdateExam(cloned);
                        }}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-amber-400 font-bold"
                        placeholder={lang === 'en' ? 'Section Title' : 'Titel des Abschnitts'}
                      />
                      <button
                        onClick={() => {
                          const cloned = cloneExam();
                          cloned.teil5.sections = cloned.teil5.sections.filter((_, i) => i !== idx);
                          onUpdateExam(cloned);
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer ml-2"
                        title={lang === 'en' ? 'Delete Section' : 'Abschnitt löschen'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.teil5.sections[idx].content = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 leading-relaxed"
                      placeholder={lang === 'en' ? 'Section text...' : 'Abschnittstext...'}
                    />
                  </div>
                ))}
              </div>

              {/* Items 27 - 30 */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Tasks 27 to 30' : 'Aufgaben 27 bis 30'}
                </label>
                {exam.teil5.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs">
                        {lang === 'en' ? `Task ${item.number}` : `Aufgabe ${item.number}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">
                            {lang === 'en' ? 'Key:' : 'Lösung:'}
                          </span>
                          <select
                            value={item.correctAnswer}
                            onChange={(e) => {
                              const updated = [...exam.teil5.items];
                              updated[idx].correctAnswer = e.target.value as any;
                              updateTeil5Items(updated);
                            }}
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-amber-400"
                          >
                            <option value="a">A</option>
                            <option value="b">B</option>
                            <option value="c">C</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleEvidence(item.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            expandedEvidence[item.id]
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title={lang === 'en' ? 'Edit text quote & examiner rationale' : 'Textbeleg & Prüferbegründung bearbeiten'}
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Rationale' : 'Beleg'}</span>
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const updated = [...exam.teil5.items];
                        updated[idx].question = e.target.value;
                        updateTeil5Items(updated);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-semibold"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {(['a', 'b', 'c'] as const).map((opt) => (
                        <div key={opt} className="flex items-center gap-1.5">
                          <span
                            className={`font-bold font-mono px-1 rounded uppercase ${
                              item.correctAnswer === opt ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                            }`}
                          >
                            [{opt}]
                          </span>
                          <input
                            type="text"
                            value={item.options[opt]}
                            onChange={(e) => {
                              const updated = [...exam.teil5.items];
                              updated[idx].options[opt] = e.target.value;
                              updateTeil5Items(updated);
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Evidence & Justification input */}
                    {expandedEvidence[item.id] && (
                      <div className="p-2.5 bg-slate-800/90 rounded border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                        <div>
                          <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                            {lang === 'en' ? 'Text Reference (House Rules)' : 'Textbeleg (Hausordnung)'}
                          </label>
                          <input
                            type="text"
                            placeholder={lang === 'en' ? "e.g. Section 'Quiet Hours': 'Mobile phones must be muted'" : "z.B. Abschnitt 'Ruhezeiten': 'Mobiltelefone sind stummzuschalten'"}
                            value={item.textReference || ''}
                            onChange={(e) => {
                              const updated = [...exam.teil5.items];
                              updated[idx].textReference = e.target.value;
                              updateTeil5Items(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                            {lang === 'en' ? 'Examiner Rationale' : 'Begründung'}
                          </label>
                          <input
                            type="text"
                            placeholder={lang === 'en' ? 'e.g. Only Option [b] allowed; others prohibited.' : 'z.B. Erlaubt nur Option [b]; andere Optionen sind verboten.'}
                            value={item.justification || ''}
                            onChange={(e) => {
                              const updated = [...exam.teil5.items];
                              updated[idx].justification = e.target.value;
                              updateTeil5Items(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Distractor Quality & Trap Analyzer */}
                    <DistractorTrapAnalyzer
                      questionNumber={item.number}
                      questionText={item.question}
                      options={item.options}
                      correctAnswer={item.correctAnswer}
                      passageText={exam.teil5.sections.map((s) => `${s.title}: ${s.content}`).join(' ')}
                      lang={lang}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPACE LINES & LAYOUT TAB (Zeilennummerierung & Notizzeilen) */}
          {activeTab === 'spaceLines' && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Line Numbering & Scratchpad Notes' : 'Zeilennummerierung & Notizzeilen'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en'
                      ? 'Configure margin line numbers (lines 5, 10, 15...), blank scratchpad note lines, and formatting'
                      : 'Konfigurieren Sie Zeilennummern am Seitenrand (Zeile 5, 10, 15...), freie Notizzeilen und Wasserzeichen'}
                  </p>
                </div>
              </div>

              {/* Zeilennummerierung */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        {lang === 'en'
                          ? 'Line Numbers for Reading Texts (Margin Line Numbers)'
                          : 'Zeilennummerierung für Lesetexte (Margin Line Numbers)'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'en'
                          ? 'Shows 5-line interval numbers (5, 10, 15, 20...) along the margin of Parts 1, 2, and 5'
                          : 'Zeigt 5er-Intervall-Nummern (5, 10, 15, 20...) am Rand von Teil 1, Teil 2 und Teil 5 an'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSpaceLines.showLineNumbers ?? true}
                    onChange={(e) => updateSpaceLines({ showLineNumbers: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {currentSpaceLines.showLineNumbers && (
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        {lang === 'en' ? 'Line number counting interval:' : 'Zählintervall der Zeilennummern:'}
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { val: 5, label: lang === 'en' ? 'Every 5 lines (5, 10, 15...)' : 'Alle 5 Zeilen (5, 10, 15, 20...)' },
                          { val: 10, label: lang === 'en' ? 'Every 10 lines (10, 20, 30...)' : 'Alle 10 Zeilen (10, 20, 30...)' },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => updateSpaceLines({ lineNumbersInterval: opt.val })}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all ${
                              (currentSpaceLines.lineNumbersInterval || 5) === opt.val
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-white text-slate-900 rounded-lg text-[10px] font-sans">
                      <span className="font-bold block uppercase text-neutral-500 mb-1">
                        {lang === 'en' ? 'Sample Preview:' : 'Muster-Vorschau:'}
                      </span>
                      <div className="relative pl-6 leading-relaxed font-normal">
                        <span className="absolute left-0 text-neutral-400 font-mono font-bold">5</span>
                        <div>Liebe Freundinnen und Freunde, gestern bin ich endlich...</div>
                        <div className="text-neutral-500">angekommen und habe mein neues Zimmer bezogen.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Master Toggle for Scratchpad Note Lines */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-white">
                    {lang === 'en'
                      ? 'Enable blank scratchpad note lines at the end of each part'
                      : 'Freie Notizzeilen am Ende jedes Teils aktivieren'}
                  </span>
                  <p className="text-xs text-slate-400">
                    {lang === 'en'
                      ? 'Allows candidates to write notes and drafts directly on exam sheets'
                      : 'Erlaubt Kandidaten Notizen und Skizzen auf den Prüfungsblättern'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentSpaceLines.showNoteLines}
                  onChange={(e) => updateSpaceLines({ showNoteLines: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {currentSpaceLines.showNoteLines && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          {lang === 'en' ? 'Line Count' : 'Zeilenanzahl'}
                        </span>
                        <span className="font-mono text-amber-400 font-bold">
                          {currentSpaceLines.linesCount || 4} {lang === 'en' ? 'lines' : 'Zeilen'}
                        </span>
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

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          {lang === 'en' ? 'Line Height (Spacing)' : 'Zeilenhöhe (Abstand)'}
                        </span>
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

                    <div className="space-y-1.5">
                      <span className="block text-xs font-semibold text-slate-300">
                        {lang === 'en' ? 'Line Style' : 'Linienstil'}
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['dotted', 'dashed', 'solid'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateSpaceLines({ lineStyle: style })}
                            className={`py-1.5 text-xs rounded border transition-all cursor-pointer ${
                              currentSpaceLines.lineStyle === style
                                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {style === 'dotted'
                              ? (lang === 'en' ? 'Dotted' : 'Gepunktet')
                              : style === 'dashed'
                              ? (lang === 'en' ? 'Dashed' : 'Gestrichelt')
                              : (lang === 'en' ? 'Solid' : 'Linie')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 space-y-3">
                    <span className="block text-xs font-bold text-slate-200">
                      {lang === 'en' ? 'Enable note lines by exam part:' : 'Notizzeilen nach Prüfungsteilen aktivieren:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { key: 'includeInTeil1', label: lang === 'en' ? 'Part 1' : 'Teil 1' },
                        { key: 'includeInTeil2', label: lang === 'en' ? 'Part 2 (A & B)' : 'Teil 2 (A & B)' },
                        { key: 'includeInTeil3', label: lang === 'en' ? 'Part 3' : 'Teil 3' },
                        { key: 'includeInTeil4', label: lang === 'en' ? 'Part 4' : 'Teil 4' },
                        { key: 'includeInTeil5', label: lang === 'en' ? 'Part 5' : 'Teil 5' },
                      ].map(({ key, label }) => {
                        const isChecked = (currentSpaceLines as any)[key] ?? true;
                        return (
                          <label
                            key={key}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            <span className="font-semibold">{label}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => updateSpaceLines({ [key]: e.target.checked })}
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* LESEN SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en'
                      ? 'Goethe- / ÖSD-Certificate B1 Reading Settings'
                      : 'Goethe- / ÖSD-Zertifikat B1 Lesen Einstellungen'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en'
                      ? 'Test center metadata, layout presets, answer sheet style, and proctoring protocol'
                      : 'Prüfungszentrum-Metadaten, Layout-Presets, Antwortbogen-Stil und Aufsichts-Protokoll'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProctorModal(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Print Proctoring Script' : 'Aufsichts-Protokoll drucken'}</span>
                </button>
              </div>

              {/* 1. Institutional Layout Standard */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <h4 className="font-bold text-white text-xs">
                    {lang === 'en' ? 'Official Layout Standard (Exam Authority)' : 'Offizieller Layout-Standard (Prüfungsträger)'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => updateSpaceLines({ layoutStandard: 'goethe' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      (currentSpaceLines.layoutStandard || 'goethe') === 'goethe'
                        ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">
                      {lang === 'en' ? 'Goethe-Institut Standard' : 'Goethe-Institut Standard'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {lang === 'en'
                        ? 'Classic German color scheme, official header, standardized typography'
                        : 'Klassische deutsche Farbgebung, Goethe-Logo Header, standardisierte Schriftgröße'}
                    </div>
                  </div>
                  <div
                    onClick={() => updateSpaceLines({ layoutStandard: 'osd' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      currentSpaceLines.layoutStandard === 'osd'
                        ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">
                      {lang === 'en' ? 'ÖSD (Austrian Language Diploma)' : 'ÖSD (Österreichisches Sprachdiplom)'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {lang === 'en'
                        ? 'ÖSD testing center layout with Univ. Fribourg/Switzerland certification seal.'
                        : 'ÖSD Prüfungsstellen-Layout mit Universität Freiburg/Schweiz Zertifizierungs-Stempel.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Official Answer Sheet Style */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-xs">
                    {lang === 'en' ? 'Answer Sheet Style (Scan-Sheet S30)' : 'Antwortbogen-Stil (Scan-Sheet S30)'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSpaceLines({ answerSheetStyle: 'checkboxes' })}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      (currentSpaceLines.answerSheetStyle || 'checkboxes') === 'checkboxes'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      {lang === 'en' ? 'Standard Checkboxes [ ☒ ]' : 'Standard Kästchen [ ☒ ]'}
                    </div>
                    <div className="text-[10px] opacity-75">
                      {lang === 'en'
                        ? 'Official Goethe answer sheet format with check-boxes'
                        : 'Offizieller Goethe-Antwortbogen mit Ankreuzfeldern'}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSpaceLines({ answerSheetStyle: 'bubbles' })}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      currentSpaceLines.answerSheetStyle === 'bubbles'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      {lang === 'en' ? 'OMR-Scan Bubble Matrix ( ● )' : 'OMR-Scan Bubble Raster ( ● )'}
                    </div>
                    <div className="text-[10px] opacity-75">
                      {lang === 'en'
                        ? 'Optical mark reader layout for automated digital grading'
                        : 'Optische Belegleser-Formatierung für automatisierte Auswertung'}
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Pass Mark Threshold */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">
                    {lang === 'en' ? 'Passing Mark for Module READING:' : 'Bestehensgrenze Modul LESEN (Pass Mark):'}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {lang === 'en'
                      ? `${currentSpaceLines.passMarkPoints || 18} of 30 points (60%)`
                      : `${currentSpaceLines.passMarkPoints || 18} von 30 Punkten (60%)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="24"
                  step="1"
                  value={currentSpaceLines.passMarkPoints || 18}
                  onChange={(e) => updateSpaceLines({ passMarkPoints: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 italic">
                  {lang === 'en'
                    ? 'Standard Goethe/ÖSD guideline: 60% = minimum 18 of 30 raw points (equivalent to 60/100 scaled score).'
                    : 'Standard Goethe/ÖSD Richtlinie: 60% = mindestens 18 von 30 Rohpunkten (entspricht 60/100 Ergebnispunkten).'}
                </div>
              </div>

              {/* 4. Test Center Administration & Metadata Stamping */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-white text-xs">
                  {lang === 'en' ? 'Test Center & Institutional Stamping' : 'Prüfungszentrum & Institutional Stamping'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">
                      {lang === 'en' ? 'Test Center Name' : 'Prüfungszentrum Name'}
                    </label>
                    <input
                      type="text"
                      value={exam.candidateInfo.institution}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.candidateInfo.institution = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      placeholder={lang === 'en' ? 'e.g. Goethe-Center / Testing Center' : 'z.B. Goethe-Zentrum / ÖSD Prüfungsstelle'}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">
                      {lang === 'en' ? 'Center Code / Testing ID' : 'Center Code / Prüfstellen-ID'}
                    </label>
                    <input
                      type="text"
                      value={exam.candidateInfo.centerCode || 'PZ-8392'}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.candidateInfo.centerCode = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                      placeholder="z.B. PZ-8392"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">
                      {lang === 'en' ? 'Proctor Name' : 'Name der Prüfungsaufsicht'}
                    </label>
                    <input
                      type="text"
                      value={exam.candidateInfo.proctorName || ''}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.candidateInfo.proctorName = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      placeholder={lang === 'en' ? 'e.g. Dr. M. Schneider' : 'z.B. Dr. M. Schneider'}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">
                      {lang === 'en' ? 'Exam Room / Test Date' : 'Prüfungsraum / Test Date'}
                    </label>
                    <input
                      type="text"
                      value={exam.candidateInfo.roomNumber || ''}
                      onChange={(e) => {
                        const cloned = cloneExam();
                        cloned.candidateInfo.roomNumber = e.target.value;
                        onUpdateExam(cloned);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      placeholder={lang === 'en' ? 'e.g. Room 204 • 29.09.2026' : 'z.B. Raum 204 • 29.09.2026'}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* METADATA TAB */}
          {activeTab === 'meta' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-bold text-white text-base">
                {lang === 'en' ? 'Metadata & Cover Page' : 'Metadaten & Deckblatt'}
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'en' ? 'Exam Title' : 'Prüfungstitel'}
                </label>
                <input
                  type="text"
                  value={exam.title}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.title = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'en' ? 'Thematic Topic' : 'Themenfeld'}
                </label>
                <input
                  type="text"
                  value={exam.theme}
                  onChange={(e) => {
                    const cloned = cloneExam();
                    cloned.theme = e.target.value;
                    onUpdateExam(cloned);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'en' ? 'Testing Institution' : 'Prüfungsinstitution'}
                  </label>
                  <input
                    type="text"
                    value={exam.candidateInfo.institution}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.candidateInfo.institution = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'en' ? 'Exam Location / City' : 'Prüfungsort / Stadt'}
                  </label>
                  <input
                    type="text"
                    value={exam.candidateInfo.city}
                    onChange={(e) => {
                      const cloned = cloneExam();
                      cloned.candidateInfo.city = e.target.value;
                      onUpdateExam(cloned);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proctor Protocol & Verbatim Script Modal */}
      {showProctorModal && (
        <ProctorProtocolModal
          exam={exam}
          onClose={() => setShowProctorModal(false)}
          lang={lang}
        />
      )}
    </div>
  );
};
