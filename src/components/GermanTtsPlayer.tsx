import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { Language } from '../utils/i18n';

interface Props {
  text: string;
  label?: string;
  lang?: Language;
}

export const GermanTtsPlayer: React.FC<Props> = ({ text, label, lang = 'de' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0.95); // B1 reading speed: slightly measured

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const handlePlay = () => {
    if (!isSupported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = rate;

    // Pick German voice if available
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find((v) => v.lang.startsWith('de') || v.lang.includes('DE'));
    if (deVoice) {
      utterance.voice = deVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isSupported) return null;

  const defaultLabel = lang === 'en' ? 'Audio Reader (German TTS)' : 'Audio-Vorleser (de-DE)';
  const playTitle = lang === 'en' ? 'Listen to text in German' : 'Text auf Deutsch vorlesen lassen';
  const stopTitle = lang === 'en' ? 'Stop playback' : 'Vorlesen beenden';
  const speedLabel = lang === 'en' ? 'Speed:' : 'Tempo:';
  const slowLabel = lang === 'en' ? 'B1 (Slow)' : 'B1 (Langsam)';

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300">
      <div className="flex items-center gap-1.5 font-semibold text-[11px] text-amber-400">
        <Volume2 className="w-3.5 h-3.5" />
        <span>{label || defaultLabel}</span>
      </div>
      <div className="flex items-center gap-1">
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            className="p-1 hover:bg-slate-700 text-emerald-400 rounded cursor-pointer transition-colors"
            title={playTitle}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="p-1 hover:bg-slate-700 text-rose-400 rounded cursor-pointer transition-colors"
            title={stopTitle}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1 pl-1 text-[10px] text-slate-400 border-l border-slate-700">
        <span>{speedLabel}</span>
        <button
          type="button"
          onClick={() => setRate(rate === 0.85 ? 1.0 : 0.85)}
          className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer ${
            rate === 0.85 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
          }`}
        >
          {rate === 0.85 ? slowLabel : 'Standard'}
        </button>
      </div>
    </div>
  );
};
