import React from 'react';
import { AppThemeId, APP_THEMES } from '../utils/theme';
import { Language } from '../utils/i18n';
import {
  Palette,
  Moon,
  Sun,
  Check,
  Sparkles,
  Eye,
  Settings,
} from 'lucide-react';

interface Props {
  currentThemeId: AppThemeId;
  onChangeTheme: (themeId: AppThemeId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  onScrollToInspector?: () => void;
}

export const AppSettingsSection: React.FC<Props> = ({
  currentThemeId,
  onChangeTheme,
  darkMode,
  onToggleDarkMode,
  lang,
  onScrollToInspector,
}) => {
  const themeList = Object.values(APP_THEMES);
  const currentTheme = APP_THEMES[currentThemeId] || APP_THEMES.goethe;

  return (
    <section
      id="app-settings-section"
      className={`rounded-2xl border transition-colors duration-200 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-8 ${
        darkMode
          ? 'bg-slate-850/90 border-slate-700/80 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800 shadow-md'
      }`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-700/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${currentTheme.badgeBg} flex items-center justify-center`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'System & Studio Preferences' : 'Studio-Einstellungen & Personalisierung'}
            </span>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'en' ? 'App Settings & Display Options' : 'Einstellungen & Farbschemata'}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'Customize the appearance of the B1 Exam Studio with 5 authentic institutional themes, toggle between Dark Mode and Light Mode, and configure visual layout defaults.'
              : 'Passen Sie das Erscheinungsbild des Prüfungsstudios mit 5 authentischen Farbschemata an, wechseln Sie zwischen Dunkel- und Hellmodus und konfigurieren Sie Standard-Vorgaben.'}
          </p>
        </div>
        {onScrollToInspector && (
          <button
            onClick={onScrollToInspector}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer shadow-md ${
              currentTheme.buttonClass
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{lang === 'en' ? 'Go to Exam Inspector ➔' : 'Zur Prüfungsvorschau ➔'}</span>
          </button>
        )}
      </div>

      {/* Grid of Main Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setting 1: 5 Color Themes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className={`w-4 h-4 ${currentTheme.accentText}`} />
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'en' ? '1. Color Themes of the App (5 Variations)' : '1. Farbschemata der App (5 Designs)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              {currentTheme.nameEn.split('(')[0].trim()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {themeList.map((th) => {
              const isSelected = th.id === currentThemeId;
              return (
                <div
                  key={th.id}
                  onClick={() => onChangeTheme(th.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? `${th.accentBorder} ${
                          darkMode ? 'bg-slate-800 shadow-lg' : 'bg-slate-50 shadow-md ring-2 ring-offset-1'
                        }`
                      : darkMode
                      ? 'border-slate-750 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/70'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Color Preview Swatch */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full shadow-inner border border-white/20"
                          style={{ backgroundColor: th.primaryColor }}
                        />
                        <span
                          className={`h-2.5 w-12 rounded-full bg-gradient-to-r ${th.accentGradient}`}
                        />
                      </div>
                      {isSelected && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${th.badgeBg}`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Active' : 'Aktiv'}</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {lang === 'en' ? th.nameEn : th.nameDe}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {lang === 'en' ? th.descriptionEn : th.descriptionDe}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Hex: {th.primaryColor}</span>
                    <span className="font-semibold">{th.id.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setting 2: Dark Mode & Display Environment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {darkMode ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'en' ? '2. Display & Dark Mode' : '2. Anzeige & Dunkelmodus'}
            </h3>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-4 ${
              darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {darkMode
                    ? lang === 'en'
                      ? 'Dark Mode Active'
                      : 'Dunkelmodus Aktiv'
                    : lang === 'en'
                    ? 'Light Mode Active'
                    : 'Hellmodus Aktiv'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {darkMode
                    ? lang === 'en'
                      ? 'Reduces eye strain during long authoring sessions.'
                      : 'Schont die Augen bei längeren Korrekturarbeiten.'
                    : lang === 'en'
                    ? 'Crisp, high-contrast display for daytime editing.'
                    : 'Klarer Kontrast für die Bearbeitung bei Tageslicht.'}
                </div>
              </div>

              {/* Visual Toggle Pill */}
              <button
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? 'bg-indigo-600' : 'bg-amber-500'
                }`}
                title="Toggle Dark / Light Mode"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs ${
                    darkMode ? 'translate-x-7 text-indigo-900' : 'translate-x-0 text-amber-600'
                  }`}
                >
                  {darkMode ? <Moon className="w-3.5 h-3.5 fill-current" /> : <Sun className="w-3.5 h-3.5 fill-current" />}
                </span>
              </button>
            </div>

            {/* Quick Mode Switch Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40">
              <button
                onClick={() => !darkMode && onToggleDarkMode()}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-slate-900 text-white border border-indigo-500 shadow'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Dark Mode' : 'Dunkel'}</span>
              </button>
              <button
                onClick={() => darkMode && onToggleDarkMode()}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !darkMode
                    ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Light Mode' : 'Hell'}</span>
              </button>
            </div>
          </div>

          {/* Quick Notice about Live Document Simulator */}
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Pre-Download Inspector Ready' : 'Druck-Vorschau aktiv'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {lang === 'en'
                ? 'The section below enables you to inspect the full exam in PDF or DOCX format before downloading, with customizable line spacing and scratchpad rules.'
                : 'Im Abschnitt darunter sehen Sie die vollständige Prüfung im PDF- oder DOCX-Format vor dem Herunterladen, inklusive Notizzeilen & Zeilenabstand-Editor.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
