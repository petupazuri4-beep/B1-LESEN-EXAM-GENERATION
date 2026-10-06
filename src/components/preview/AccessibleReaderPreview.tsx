import React, { useState } from 'react';
import { ExamModel, TeilType } from '../../types/exam';
import { GermanTtsPlayer } from '../GermanTtsPlayer';
import { Language } from '../../utils/i18n';
import {
  Eye,
  Type,
  Sun,
  Moon,
  Volume2,
  BookOpen,
} from 'lucide-react';

interface Props {
  exam: ExamModel;
  lang?: Language;
}

export const AccessibleReaderPreview: React.FC<Props> = ({
  exam,
  lang = 'de',
}) => {
  const [themeMode, setThemeMode] = useState<'cream' | 'dark' | 'contrast'>('cream');
  const [fontSizePx, setFontSizePx] = useState<number>(18);
  const [activeTeil, setActiveTeil] = useState<TeilType>(1);

  const themeClasses = {
    cream: 'bg-amber-50/70 text-amber-950 border-amber-200',
    dark: 'bg-slate-900 text-slate-100 border-slate-700',
    contrast: 'bg-black text-yellow-300 border-yellow-500 font-bold',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls */}
      <div className="bg-slate-800 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="font-bold text-sm">
              {lang === 'en' ? 'Barrierefreier Lesemodus (Accessible Reader)' : 'Barrierefreier Lesemodus (Inklusiv)'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Dyslexia-friendly spacing & high contrast' : 'Optimierte Zeilenabstände & Sprachausgabe'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg">
            <button
              onClick={() => setThemeMode('cream')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${themeMode === 'cream' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-slate-400'}`}
            >
              Sepia
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${themeMode === 'dark' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              Dunkel
            </button>
            <button
              onClick={() => setThemeMode('contrast')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${themeMode === 'contrast' ? 'bg-yellow-400 text-black font-bold' : 'text-slate-400'}`}
            >
              Kontrast
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-2 py-1 rounded-lg">
            <button
              onClick={() => setFontSizePx((s) => Math.max(14, s - 2))}
              className="px-1 text-slate-300 hover:text-white"
            >
              A-
            </button>
            <span className="font-mono">{fontSizePx}px</span>
            <button
              onClick={() => setFontSizePx((s) => Math.min(26, s + 2))}
              className="px-1 text-slate-300 hover:text-white"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Teil Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {([1, 2, 3, 4, 5] as TeilType[]).map((num) => (
          <button
            key={num}
            onClick={() => setActiveTeil(num)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTeil === num
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Teil {num}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div
        className={`p-8 rounded-3xl border shadow-xl leading-relaxed space-y-6 transition-all ${themeClasses[themeMode]}`}
        style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.85, letterSpacing: '0.03em' }}
      >
        {activeTeil === 1 && (
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold tracking-wider opacity-75">
              Teil 1 • E-Mail Korrespondenz
            </div>
            <GermanTtsPlayer text={`${exam.teil1.emailGreeting}. ${exam.teil1.emailBody}`} label="Abschnitt vorlesen" />
            <div className="font-bold">{exam.teil1.emailGreeting},</div>
            <p className="whitespace-pre-line">{exam.teil1.emailBody}</p>
            <div className="font-bold">{exam.teil1.emailSignoff}</div>
          </div>
        )}

        {activeTeil === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs uppercase font-bold block opacity-75">Text A</span>
              <h3 className="font-black text-xl mb-2">{exam.teil2.textA.title}</h3>
              <GermanTtsPlayer text={exam.teil2.textA.bodyParagraphs.join(' ')} label="Text A vorlesen" />
              <div className="space-y-3 mt-3">
                {exam.teil2.textA.bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-bold block opacity-75">Text B</span>
              <h3 className="font-black text-xl mb-2">{exam.teil2.textB.title}</h3>
              <GermanTtsPlayer text={exam.teil2.textB.bodyParagraphs.join(' ')} label="Text B vorlesen" />
              <div className="space-y-3 mt-3">
                {exam.teil2.textB.bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTeil === 3 && (
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold opacity-75">Teil 3 • Anzeigen A–J</div>
            <div className="grid grid-cols-1 gap-4">
              {exam.teil3.advertisements.map((ad) => (
                <div key={ad.letter} className="p-4 rounded-xl border border-current/20">
                  <div className="font-bold text-base mb-1">
                    [{ad.letter.toUpperCase()}] {ad.title}
                  </div>
                  <p className="text-sm">{ad.body}</p>
                  <div className="text-xs font-mono opacity-80 mt-1">{ad.contact}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTeil === 4 && (
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold opacity-75">Teil 4 • Lesermeinungen</div>
            <div className="p-4 rounded-xl border border-current/30 font-bold mb-4">
              {exam.teil4.contextTopic} — {exam.teil4.questionFraming}
            </div>
            {exam.teil4.leserbriefe.map((lb) => (
              <div key={lb.number} className="p-4 rounded-xl border border-current/20">
                <div className="font-bold mb-1">
                  #{lb.number} {lb.author}, {lb.age} Jahre ({lb.city}):
                </div>
                <p className="italic">"{lb.text}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTeil === 5 && (
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold opacity-75">Teil 5 • Benutzungsordnung</div>
            <h3 className="font-black text-xl mb-3">{exam.teil5.sheetTitle}</h3>
            {exam.teil5.sections.map((sec, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold text-base mb-1">{sec.title}</h4>
                <p>{sec.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
