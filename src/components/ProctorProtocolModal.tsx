import React from 'react';
import { ExamModel } from '../types/exam';
import { Language } from '../utils/i18n';
import { Printer, X, Clock, FileText } from 'lucide-react';

interface Props {
  exam: ExamModel;
  onClose: () => void;
  lang?: Language;
}

export const ProctorProtocolModal: React.FC<Props> = ({
  exam,
  onClose,
  lang = 'de',
}) => {
  const handlePrint = () => {
    window.print();
  };

  const todayStr = exam.candidateInfo.testDate || new Date().toLocaleDateString('de-DE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-300">
        {/* Modal Top Bar (Screen only) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {lang === 'en'
                  ? 'Aufsichts-Protokoll & Ansagetext für Prüfende (Goethe / ÖSD)'
                  : 'Aufsichts-Protokoll & Prüfungsansage für Prüfende'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Printable 1-page official examination proctor script & attendance protocol'
                  : 'Offizielles Prüfungs- und Aufsichtsprotokoll mit wörtlichem Ansagetext (DIN A4)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print Protocol' : 'Protokoll drucken'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable DIN A4 Document */}
        <div className="p-8 sm:p-12 print:p-0 space-y-6 text-xs font-sans leading-relaxed select-text">
          {/* Official Header */}
          <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Goethe-Institut / ÖSD Zertifikat B1 • Modul LESEN (65 Minuten)
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1">
                Aufsichts-Protokoll & Ansagetext
              </h1>
              <p className="text-xs text-neutral-700 font-semibold">
                Prüfungsexemplar: #{String(exam.examNumber).padStart(2, '0')} • {exam.title}
              </p>
            </div>
            <div className="text-right border-l-2 border-neutral-300 pl-4 space-y-0.5 text-[11px]">
              <div><strong>Prüfungszentrum:</strong> {exam.candidateInfo.institution || 'Goethe-Zentrum'}</div>
              <div><strong>Ort / Raum:</strong> {exam.candidateInfo.city || 'Berlin'} / {exam.candidateInfo.roomNumber || 'Raum 101'}</div>
              <div><strong>Datum:</strong> {todayStr}</div>
              <div><strong>Aufsicht / Prüfer:</strong> {exam.candidateInfo.proctorName || 'M. Mustermann'}</div>
            </div>
          </div>

          {/* Section 1: Zeittakt & Ablauf */}
          <div className="border border-neutral-400 p-4 rounded bg-neutral-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase border-b border-neutral-300 pb-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>1. Zeitplan & Prüfungsablauf (65 Minuten reine Arbeitszeit)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div className="border-r border-neutral-300 pr-2">
                <span className="text-neutral-500 block">Vorbereitung & Belehrung:</span>
                <strong>10 Minuten vor Beginn</strong>
              </div>
              <div className="border-r border-neutral-300 pr-2">
                <span className="text-neutral-500 block">Start Arbeitszeit (Lesen):</span>
                <span className="border-b border-neutral-800 inline-block w-16 text-center font-mono">__:__ Uhr</span>
              </div>
              <div className="border-r border-neutral-300 pr-2">
                <span className="text-neutral-500 block">Ansage 10 Minuten vor Ende:</span>
                <span className="border-b border-neutral-800 inline-block w-16 text-center font-mono">__:__ Uhr</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Ende & Einsammeln:</span>
                <span className="border-b border-neutral-800 inline-block w-16 text-center font-mono">__:__ Uhr</span>
              </div>
            </div>
          </div>

          {/* Section 2: Wörtlicher Ansagetext für die Aufsicht (Verbatim Proctor Script) */}
          <div className="border-2 border-neutral-900 p-5 rounded space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase">
                2. Wörtlicher Ansagetext für die Aufsicht führende Person
              </h2>
              <span className="text-[10px] uppercase font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Wörtlich vorzulesen
              </span>
            </div>
            <div className="space-y-2.5 text-[11.5px] leading-relaxed text-neutral-800">
              <p className="p-2.5 bg-neutral-100 border-l-4 border-neutral-800 italic">
                „Guten Tag meine Damen und Herren. Bitte schalten Sie jetzt alle Mobiltelefone, Smartwatches und elektronischen Geräte vollständig aus und verstauen Sie diese in Ihren Taschen. Wörterbücher, Notizen oder sonstige Hilfsmittel sind nicht gestattet.“
              </p>
              <p className="p-2.5 bg-neutral-100 border-l-4 border-neutral-800 italic">
                „Sie erhalten nun die Prüfungsblätter für das <strong>Modul Lesen</strong> und den <strong>Antwortbogen</strong>. Bitte tragen Sie zuerst Ihren Namen, Ihr Geburtsdatum und Ihre Teilnehmernummer leserlich in Druckbuchstaben ein. Öffnen Sie das Aufgabenheft noch nicht.“
              </p>
              <p className="p-2.5 bg-neutral-100 border-l-4 border-neutral-800 italic">
                „Die Gesamtarbeitszeit beträgt <strong>65 Minuten</strong>. Das Modul umfasst fünf Teile mit 30 Aufgaben. Es gibt für jede Aufgabe nur eine richtige Lösung. Achten Sie darauf, Ihre Antworten rechtzeitig auf den <strong>Antwortbogen</strong> zu übertragen – es gibt dafür keine zusätzliche Übertragungszeit. Verwenden Sie einen Kugelschreiber, keinen Bleistift. Zehn Minuten vor Prüfungsende werde ich Sie an die Zeit erinnern.“
              </p>
              <p className="p-2.5 bg-neutral-100 border-l-4 border-orange-500 font-semibold italic text-orange-950">
                „Sie dürfen das Aufgabenheft jetzt öffnen und mit der Bearbeitung beginnen. Viel Erfolg!“
              </p>
            </div>
          </div>

          {/* Section 3: Protokoll über Vorkommnisse / Unterschriften */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-400 p-3 rounded space-y-2">
              <span className="font-bold text-xs uppercase block text-neutral-800">
                3. Besondere Vorkommnisse / Unregelmäßigkeiten
              </span>
              <div className="space-y-1 text-[11px]">
                <label className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-neutral-700 flex items-center justify-center"></span>
                  <span>Prüfung ordnungsgemäß und ohne Zwischenfälle durchgeführt</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-neutral-700 flex items-center justify-center"></span>
                  <span>Täuschungsversuch / unerlaubte Hilfsmittel (Protokoll beigefügt)</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-neutral-700 flex items-center justify-center"></span>
                  <span>Vorzeitige Prüfungsabgabe oder Raumverlassen vermerkt</span>
                </label>
              </div>
              <div className="border-b border-neutral-300 h-8"></div>
            </div>

            <div className="border border-neutral-400 p-3 rounded space-y-3">
              <span className="font-bold text-xs uppercase block text-neutral-800">
                4. Bestätigung & Unterschrift der Aufsicht
              </span>
              <div className="grid grid-cols-2 gap-3 text-[10px] pt-2">
                <div>
                  <div className="border-b border-neutral-800 h-6"></div>
                  <span className="text-neutral-500">Unterschrift Aufsicht 1</span>
                </div>
                <div>
                  <div className="border-b border-neutral-800 h-6"></div>
                  <span className="text-neutral-500">Unterschrift Aufsicht 2</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] pt-2 text-neutral-600 border-t border-neutral-200">
                <span>Eingesammelte Antwortbögen: ______</span>
                <span>Vollzähligkeit bestätigt: [  ] Ja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
