import React from 'react';
import { ExamStyleConfig, SpaceLineConfig, DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
import { translations, Language } from '../utils/i18n';
import { Palette, Type, Sliders, Check, AlignJustify } from 'lucide-react';

interface Props {
  styleConfig: ExamStyleConfig;
  onChangeStyle: (newConfig: ExamStyleConfig) => void;
  onApplyToAll?: () => void;
  isLockedToGlobal?: boolean;
  onToggleLock?: () => void;
  lang?: Language;
}

export const StylePanel: React.FC<Props> = ({
  styleConfig,
  onChangeStyle,
  onApplyToAll,
  isLockedToGlobal = false,
  onToggleLock,
  lang = 'de',
}) => {
  const t = translations[lang];
  const currentSpaceLines: SpaceLineConfig = styleConfig.spaceLines || DEFAULT_SPACE_LINE_CONFIG;

  const updateProp = <K extends keyof ExamStyleConfig>(key: K, val: ExamStyleConfig[K]) => {
    onChangeStyle({
      ...styleConfig,
      [key]: val,
    });
  };

  const updateSpaceLines = (partial: Partial<SpaceLineConfig>) => {
    const updated: SpaceLineConfig = {
      ...currentSpaceLines,
      ...partial,
    };
    updateProp('spaceLines', updated);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-slate-200 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">{t.stylePanelTitle}</h3>
        </div>
        {onToggleLock && (
          <button
            onClick={onToggleLock}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              isLockedToGlobal
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            {isLockedToGlobal ? t.globalSync : t.customStyle}
          </button>
        )}
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Type className="w-4 h-4 text-slate-400" />
          <span>{t.fontFamily}</span>
        </label>
        <select
          value={styleConfig.fontFamily}
          onChange={(e) => updateProp('fontFamily', e.target.value as any)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
        >
          <option value="Source Sans 3">Source Sans 3 {lang === 'en' ? '(Official Goethe Standard)' : '(Standard Goethe)'}</option>
          <option value="Open Sans">Open Sans (Humanist Sans)</option>
          <option value="Arial">Arial (Standard DIN)</option>
          <option value="Merriweather">Merriweather {lang === 'en' ? '(Classic Serif)' : '(Klassische Serife)'}</option>
          <option value="Georgia">Georgia {lang === 'en' ? '(Book Serif)' : '(Elegante Leseschrift)'}</option>
        </select>
        <p className="text-[10px] text-slate-400 italic">{t.fontFamilyHelp}</p>
      </div>

      {/* Sliders: Base Font Size & Line Height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-300">{t.fontSize}</span>
            <span className="font-mono text-amber-400 font-bold">{styleConfig.baseFontSizePt} pt</span>
          </div>
          <input
            type="range"
            min="9"
            max="14"
            step="0.5"
            value={styleConfig.baseFontSizePt}
            onChange={(e) => updateProp('baseFontSizePt', parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-300">{t.lineHeight}</span>
            <span className="font-mono text-amber-400 font-bold">{styleConfig.lineHeight}x</span>
          </div>
          <input
            type="range"
            min="1.2"
            max="2.0"
            step="0.05"
            value={styleConfig.lineHeight}
            onChange={(e) => updateProp('lineHeight', parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Color Customizations */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sliders className="w-4 h-4 text-slate-400" />
          <span>{lang === 'en' ? 'Color Accents & Section Bars' : 'Farbakzente & Sektionsbalken'}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[11px] text-slate-400 mb-1">{t.headerBarColor}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleConfig.headerBarColor || '#d9d9d9'}
                onChange={(e) => updateProp('headerBarColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-600 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs uppercase text-slate-300">
                {styleConfig.headerBarColor || '#d9d9d9'}
              </span>
            </div>
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 mb-1">{lang === 'en' ? 'Accent Color (Title)' : 'Akzentfarbe (Prüfungstitel)'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleConfig.accentColor || '#d97706'}
                onChange={(e) => updateProp('accentColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-600 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs uppercase text-slate-300">
                {styleConfig.accentColor || '#d97706'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Margin Presets */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-300">{t.margins}</span>
        <div className="grid grid-cols-3 gap-2">
          {(['narrow', 'normal', 'wide'] as const).map(preset => {
            const isSelected = styleConfig.marginPreset === preset;
            const labels = {
              narrow: lang === 'en' ? 'Narrow (1.5 cm)' : 'Schmal (1.5 cm)',
              normal: lang === 'en' ? 'Normal (2.0 cm)' : 'Normal (2.0 cm)',
              wide: lang === 'en' ? 'Wide (2.5 cm)' : 'Breit (2.5 cm)',
            };
            return (
              <button
                key={preset}
                onClick={() => updateProp('marginPreset', preset)}
                className={`py-1.5 px-2 text-xs rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Space Line & Download Layout Editor */}
      <div className="pt-4 border-t border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlignJustify className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.spaceLineEditorTitle}
            </h4>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">
            PDF / DOCX
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          {t.spaceLineEditorSubtitle}
        </p>

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">
            {t.spaceLinePresets}
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => updateSpaceLines({ showNoteLines: false, linesCount: 0 })}
              className={`p-2 rounded border text-left cursor-pointer transition-all ${
                !currentSpaceLines.showNoteLines
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">{lang === 'en' ? 'Clean Layout' : 'Standard Clean'}</div>
              <div className="text-[10px] text-slate-400">{lang === 'en' ? 'No note lines' : 'Keine Notizzeilen'}</div>
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
              className={`p-2 rounded border text-left cursor-pointer transition-all ${
                currentSpaceLines.showNoteLines &&
                currentSpaceLines.lineStyle === 'dotted' &&
                currentSpaceLines.linesCount === 4
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">{lang === 'en' ? '4 Dotted Lines' : '4 Zeilen Gepunktet'}</div>
              <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Exam standard (8mm)' : 'Prüfungsstandard (8mm)'}</div>
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
              className={`p-2 rounded border text-left cursor-pointer transition-all ${
                currentSpaceLines.showNoteLines &&
                currentSpaceLines.lineStyle === 'solid' &&
                currentSpaceLines.linesCount === 6
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">{lang === 'en' ? '6 Solid Lines' : '6 Linien Liniert'}</div>
              <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Ample writing space' : 'Viel Schreibplatz'}</div>
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
              className={`p-2 rounded border text-left cursor-pointer transition-all ${
                currentSpaceLines.showNoteLines &&
                currentSpaceLines.lineStyle === 'dashed' &&
                currentSpaceLines.linesCount === 2
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">{lang === 'en' ? '2 Dashed Lines' : '2 Zeilen Kompakt'}</div>
              <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Paper-saving' : 'Papiersparend'}</div>
            </button>
          </div>
        </div>

        {/* Zeilennummerierung (Margin Line Numbers) */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              {lang === 'en' ? 'Margin Line Numbers (5, 10, 15...)' : 'Zeilennummerierung (5, 10...)'}
            </span>
            <input
              type="checkbox"
              checked={currentSpaceLines.showLineNumbers ?? true}
              onChange={(e) => updateSpaceLines({ showLineNumbers: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
          {currentSpaceLines.showLineNumbers && (
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
              <span className="text-slate-400">{lang === 'en' ? 'Interval:' : 'Intervall:'}</span>
              <div className="flex gap-1">
                {[5, 10].map((intVal) => (
                  <button
                    key={intVal}
                    type="button"
                    onClick={() => updateSpaceLines({ lineNumbersInterval: intVal })}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer ${
                      (currentSpaceLines.lineNumbersInterval || 5) === intVal
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? `Every ${intVal}` : `Alle ${intVal}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-700">
          <span className="text-xs font-semibold text-slate-200">
            {t.noteLinesToggle}
          </span>
          <input
            type="checkbox"
            checked={currentSpaceLines.showNoteLines}
            onChange={(e) => updateSpaceLines({ showNoteLines: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {currentSpaceLines.showNoteLines && (
          <div className="space-y-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/80">
            {/* Number of Lines & Line Height */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Line Style (Dotted, Dashed, Solid) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300">{t.noteLineStyle}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['dotted', 'dashed', 'solid'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => updateSpaceLines({ lineStyle: style })}
                    className={`py-1 px-2 text-[11px] rounded border transition-all cursor-pointer ${
                      currentSpaceLines.lineStyle === style
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {style === 'dotted'
                      ? (lang === 'en' ? 'Dotted' : 'Gepunktet')
                      : style === 'dashed'
                      ? (lang === 'en' ? 'Dashed' : 'Gestrichelt')
                      : (lang === 'en' ? 'Solid' : 'Durchgezogen')}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Space Header Label */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">{t.noteLineLabel}</label>
              <input
                type="text"
                value={currentSpaceLines.noteLabel || (lang === 'en' ? 'Space for notes / draft' : 'Platz für Notizen / Entwurf')}
                onChange={(e) => updateSpaceLines({ noteLabel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Item Gap Spacing & Dividers */}
        <div className="space-y-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/80">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-300">{t.itemSpacing}</span>
              <span className="font-mono text-amber-400 font-bold">
                {currentSpaceLines.itemSpacingRem || 0.75} rem
              </span>
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
          <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
            <span>{t.itemDividersToggle}</span>
            <input
              type="checkbox"
              checked={currentSpaceLines.showItemDividers ?? true}
              onChange={(e) => updateSpaceLines({ showItemDividers: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Watermark for Download */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">{t.watermarkInput}</label>
          <input
            type="text"
            placeholder={lang === 'en' ? 'e.g. OFFICIAL MOCK SET (optional)' : 'z.B. OFFIZIELLER MUSTERSATZ (optional)'}
            value={currentSpaceLines.watermarkText || ''}
            onChange={(e) => updateSpaceLines({ watermarkText: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-mono"
          />
          <p className="text-[10px] text-slate-400">{t.watermarkHelp}</p>
        </div>

        {/* Live Ruled Lines Preview Card */}
        {currentSpaceLines.showNoteLines && (
          <div className="p-3 bg-white text-slate-900 rounded-lg border border-slate-300 shadow-inner">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {currentSpaceLines.noteLabel || 'Platz für Notizen / Entwurf'}
              </span>
              <span className="text-[9px] text-neutral-400 italic">
                {lang === 'en' ? 'Live Preview' : 'Vorschau'}
              </span>
            </div>
            <div className="flex flex-col" style={{ gap: `${currentSpaceLines.lineSpacingMm || 8}px` }}>
              {Array.from({ length: Math.min(4, currentSpaceLines.linesCount || 4) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full ${
                    currentSpaceLines.lineStyle === 'dashed'
                      ? 'border-b border-dashed border-neutral-400'
                      : currentSpaceLines.lineStyle === 'solid'
                      ? 'border-b border-solid border-neutral-300'
                      : 'border-b-2 border-dotted border-neutral-300'
                  }`}
                  style={{ height: `${Math.min(10, currentSpaceLines.lineSpacingMm || 8)}px` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Propagate to all exams button */}
      {onApplyToAll && (
        <div className="pt-2 border-t border-slate-700">
          <button
            onClick={onApplyToAll}
            className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            {t.applyToAll}
          </button>
        </div>
      )}
    </div>
  );
};
