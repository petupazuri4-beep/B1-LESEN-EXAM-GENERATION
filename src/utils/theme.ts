export type AppThemeId = 'goethe' | 'osd' | 'alpen' | 'berlin' | 'wien';

export interface AppThemeConfig {
  id: AppThemeId;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  descriptionEn: string;
  primaryColor: string; // Hex for badge/accents
  accentGradient: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  activeTabClass: string;
  buttonClass: string;
}

export const APP_THEMES: Record<AppThemeId, AppThemeConfig> = {
  goethe: {
    id: 'goethe',
    nameDe: 'Goethe Klassik (Bernstein / Gold)',
    nameEn: 'Goethe Classic (Warm Amber & Slate)',
    descriptionDe: 'Authentisches Goethe-Institut Prüfungscenter Farbschema mit warmem Bernstein.',
    descriptionEn: 'Authentic Goethe-Institut exam center palette with warm amber highlights.',
    primaryColor: '#f59e0b',
    accentGradient: 'from-amber-500 to-orange-500',
    accentBg: 'bg-amber-500',
    accentBorder: 'border-amber-500',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    activeTabClass: 'bg-amber-500 text-slate-950 font-bold shadow-md',
    buttonClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
  },
  osd: {
    id: 'osd',
    nameDe: 'ÖSD Königsblau (Saphir & Kobalt)',
    nameEn: 'ÖSD Royal Blue (Sapphire & Cobalt)',
    descriptionDe: 'Offizielles Österreichisches Sprachdiplom Deutsch Design in Königsblau.',
    descriptionEn: 'Official Austrian Language Diploma (ÖSD) signature in royal sapphire blue.',
    primaryColor: '#3b82f6',
    accentGradient: 'from-blue-500 to-indigo-600',
    accentBg: 'bg-blue-600',
    accentBorder: 'border-blue-500',
    accentText: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    activeTabClass: 'bg-blue-600 text-white font-bold shadow-md',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white font-bold',
  },
  alpen: {
    id: 'alpen',
    nameDe: 'Alpen Smaragd (Waldgrün & Teal)',
    nameEn: 'Alpine Emerald (Forest Teal & Pine)',
    descriptionDe: 'Frisches Schweizer & Alpenländisches Natur-Design mit Smaragd- und Türkisgrün.',
    descriptionEn: 'Crisp Swiss & Alpine nature aesthetic with emerald and pine green.',
    primaryColor: '#10b981',
    accentGradient: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-600',
    accentBorder: 'border-emerald-500',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    activeTabClass: 'bg-emerald-600 text-white font-bold shadow-md',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold',
  },
  berlin: {
    id: 'berlin',
    nameDe: 'Berlin Karmesin (Bordeaux & Rubin)',
    nameEn: 'Berlin Crimson (Bordeaux Ruby & Charcoal)',
    descriptionDe: 'Urbanes Berliner Design mit elegantem Bordeauxrot und samtigen Akzenten.',
    descriptionEn: 'Urban Berlin aesthetic with rich bordeaux ruby and charcoal contrast.',
    primaryColor: '#f43f5e',
    accentGradient: 'from-rose-500 to-red-600',
    accentBg: 'bg-rose-600',
    accentBorder: 'border-rose-500',
    accentText: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    activeTabClass: 'bg-rose-600 text-white font-bold shadow-md',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white font-bold',
  },
  wien: {
    id: 'wien',
    nameDe: 'Wiener Platin (Monochrom & Gold)',
    nameEn: 'Viennese Platinum (Monochrome & Gold)',
    descriptionDe: 'Elegantes Wiener Kaffeehaus-Design mit edlem Silber, Platin und feinem Gold.',
    descriptionEn: 'Sophisticated Viennese contrast with platinum silver and champagne gold accents.',
    primaryColor: '#eab308',
    accentGradient: 'from-yellow-500 to-amber-600',
    accentBg: 'bg-yellow-500',
    accentBorder: 'border-yellow-500',
    accentText: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    activeTabClass: 'bg-yellow-500 text-slate-950 font-bold shadow-md',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold',
  },
};
