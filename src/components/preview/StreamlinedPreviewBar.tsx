import React from 'react';
import { Language } from '../../utils/i18n';
import {
  FileText,
  Monitor,
  Split,
  Eye,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Edit3,
} from 'lucide-react';

export type PreviewMode = 'paper' | 'digital' | 'split' | 'accessible';

interface Props {
  mode: PreviewMode;
  onChangeMode: (mode: PreviewMode) => void;
  zoomLevel: number;
  onChangeZoom: (level: number) => void;
  onPrint: () => void;
  lang?: Language;
  isEditable?: boolean;
  onToggleEditable?: () => void;
}

export const StreamlinedPreviewBar: React.FC<Props> = ({
  mode,
  onChangeMode,
  zoomLevel,
  onChangeZoom,
  onPrint,
  lang = 'de',
  isEditable = false,
  onToggleEditable,
}) => {
  const modes: Array<{ id: PreviewMode; labelDe: string; labelEn: string; icon: any }> = [
    { id: 'paper', labelDe: 'Offizieller Prüfungsbogen (A4)', labelEn: 'A4 Official Paper', icon: FileText },
    { id: 'digital', labelDe: 'Digitaler CBT-Prüfungsmodus', labelEn: 'Digital CBT Mode', icon: Monitor },
    { id: 'split', labelDe: 'Dual-Ansicht (Text & Didaktik)', labelEn: 'Split Dual-View', icon: Split },
    { id: 'accessible', labelDe: 'Barrierefreier Lesemodus', labelEn: 'Accessible Reader', icon: Eye },
  ];

  return (
    <div className="no-print bg-slate-900/95 backdrop-blur text-white border border-slate-700/80 rounded-2xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Mode Switches */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;

          return (
            <button
              key={m.id}
              onClick={() => onChangeMode(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? m.labelEn : m.labelDe}</span>
            </button>
          );
        })}
      </div>

      {/* Zoom & Print */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
          <button
            onClick={() => onChangeZoom(Math.max(80, zoomLevel - 10))}
            className="p-1 text-slate-300 hover:text-white rounded"
            title="Verkleinern"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono px-1">{zoomLevel}%</span>
          <button
            onClick={() => onChangeZoom(Math.min(140, zoomLevel + 10))}
            className="p-1 text-slate-300 hover:text-white rounded"
            title="Vergrößern"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* In-Place WYSIWYG Editor Button (Suggestion 1) */}
        {mode === 'paper' && onToggleEditable && (
          <button
            type="button"
            onClick={onToggleEditable}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer border ${
              isEditable
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                : 'bg-slate-800 text-slate-200 hover:text-white border-slate-700 hover:bg-slate-750'
            }`}
            title="Texte und Aufgaben direkt auf dem A4-Prüfungsbogen bearbeiten"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>
              {isEditable
                ? (lang === 'en' ? 'Exit WYSIWYG' : 'Direkt-Editor beenden')
                : (lang === 'en' ? 'Edit on Paper' : 'Direkt im Bogen bearbeiten')}
            </span>
            {isEditable && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping ml-0.5" />
            )}
          </button>
        )}

        <button
          onClick={onPrint}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'en' ? 'Print' : 'Drucken'}</span>
        </button>
      </div>
    </div>
  );
};
