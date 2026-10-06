import React from 'react';
import { ExamModel } from '../types/exam';
import { validateExam, ValidationReport } from '../utils/validator';
import { translations, Language } from '../utils/i18n';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface Props {
  exam: ExamModel;
  onClose: () => void;
  lang?: Language;
}

export const ValidationModal: React.FC<Props> = ({ exam, onClose, lang = 'de' }) => {
  const t = translations[lang];
  const report: ValidationReport = validateExam(exam);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {report.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="font-bold text-base text-white">
              {t.validationTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          {/* Summary Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            report.isValid ? 'bg-emerald-950/40 border-emerald-600/50' : 'bg-amber-950/40 border-amber-600/50'
          }`}>
            <div>
              <h4 className="font-bold text-white text-base">
                {report.isValid ? t.validationValid : t.validationInvalid}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {exam.title}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">{t.validationTotalItems}</span>
              <div className="text-2xl font-mono font-black text-amber-400">
                {report.totalItems} / 30
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Module Breakdown (30 Items)' : 'Modul-Aufschlüsselung (30 Aufgaben)'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200">{lang === 'en' ? 'Part 1: True / False' : 'Teil 1: Richtig/Falsch'}</div>
                <div className="text-slate-400">
                  {exam.teil1.items.length} {lang === 'en' ? 'of 6 items (with example)' : 'von 6 Aufgaben (mit Beispiel)'}
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200">{lang === 'en' ? 'Part 2: Press Articles (a/b/c)' : 'Teil 2: Presse-Texte (a/b/c)'}</div>
                <div className="text-slate-400">
                  {exam.teil2.textA.items.length + exam.teil2.textB.items.length} {lang === 'en' ? 'of 6 items' : 'von 6 Aufgaben'}
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200">{lang === 'en' ? 'Part 3: Matching A–J' : 'Teil 3: Zuordnung A–J'}</div>
                <div className="text-slate-400">
                  {exam.teil3.situations.length} {lang === 'en' ? 'situations & 10 ads (1x "0")' : 'Situationen & 10 Anzeigen (1x "0")'}
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200">{lang === 'en' ? 'Part 4: Reader Letters (Yes/No)' : 'Teil 4: Leserbriefe (Ja/Nein)'}</div>
                <div className="text-slate-400">
                  {exam.teil4.leserbriefe.length} {lang === 'en' ? 'of 7 opinions' : 'von 7 Meinungen'}
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 col-span-2">
                <div className="font-bold text-slate-200">{lang === 'en' ? 'Part 5: Regulations (a/b/c)' : 'Teil 5: Hausordnung (a/b/c)'}</div>
                <div className="text-slate-400">
                  {exam.teil5.items.length} {lang === 'en' ? 'of 4 items • ' : 'von 4 Aufgaben • '}
                  {exam.teil5.sections.length} {lang === 'en' ? 'rule sections' : 'Regelabschnitte'}
                </div>
              </div>
            </div>
          </div>

          {/* Issues List */}
          {report.issues.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {lang === 'en' ? `Validation Checklist (${report.issues.length})` : `Gefundene Hinweise & Prüfpunkte (${report.issues.length})`}
              </h4>
              <div className="space-y-2">
                {report.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      issue.type === 'error'
                        ? 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                        : issue.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-700/60 text-amber-200'
                        : 'bg-blue-950/30 border-blue-700/60 text-blue-200'
                    }`}
                  >
                    {issue.type === 'error' ? (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      {issue.teil > 0 && <span className="font-bold mr-1">[{lang === 'en' ? `Part ${issue.teil}` : `Teil ${issue.teil}`}]</span>}
                      <span>{issue.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'en'
                  ? 'All quality and norm criteria for the Goethe/ÖSD Zertifikat B1 exam have been successfully verified!'
                  : 'Alle Qualitäts- und Normkriterien für das Goethe-/ÖSD-Zertifikat B1 wurden erfolgreich geprüft!'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
