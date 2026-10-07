import React from 'react';
import { translations, Language } from '../utils/i18n';

interface Props {
  selectedExamTitle?: string;
  currentExamNumber?: number;
  lang: Language;
  isSaving?: boolean;
  onNavigateHome?: () => void;
}

export const Header: React.FC<Props> = ({
  selectedExamTitle,
  currentExamNumber = 1,
  lang,
  isSaving = false,
  onNavigateHome,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b bg-slate-900/95 border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Clean Title */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg text-white font-black text-sm flex items-center justify-center shadow-md group-hover:scale-105 transition-transform bg-orange-600">
            B1
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight flex items-center gap-2 text-white">
              <span>{t.studioTitle}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border font-bold bg-amber-500/20 text-amber-300 border-amber-500/30">
                Goethe / ÖSD
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[280px]">
              {selectedExamTitle || (lang === 'en' ? `Exam Set #${String(currentExamNumber).padStart(2, '0')}` : `Modellsatz #${String(currentExamNumber).padStart(2, '0')}`)}
            </div>
          </div>
        </div>

        {/* Status on Right */}
        <div className="flex items-center gap-3">
          {/* Offline Capabilities Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-semibold select-none"
            title={lang === 'en' ? '100% Client-side offline engine: works in secure exam rooms without Wi-Fi' : '100% Lokale Offline-Engine: funktioniert im Prüfungsraum ohne Internet'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{lang === 'en' ? 'Offline Ready' : 'Offline Bereit'}</span>
          </div>

          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="hidden sm:inline text-[11px] font-mono">{isSaving ? t.saving : t.saved}</span>
          </div>

          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden md:block">
            {lang === 'en' ? 'Module READING • 65 Min.' : 'Modul LESEN • 65 Min.'}
          </div>
        </div>
      </div>
    </header>
  );
};
