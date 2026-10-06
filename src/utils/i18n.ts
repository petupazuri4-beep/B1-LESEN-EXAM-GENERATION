export type Language = 'de' | 'en';

export interface TranslationDictionary {
  // Navigation & Header
  appTitle: string;
  studioTitle: string;
  officialSubtitle: string;
  tenSets: string;
  saved: string;
  saving: string;
  dashboard: string;
  paper: string;
  solutions: string;
  editor: string;
  interactive: string;
  validate: string;
  validateNorm: string;
  download: string;
  downloadPdf: string;
  downloadDocx: string;
  downloadSolPdf: string;
  downloadSolDocx: string;
  downloadAllZip: string;
  exportPdf: string;
  exportDocx: string;
  exportSolPdf: string;
  exportSolDocx: string;
  bulkZip: string;
  candidatePaperSection: string;
  solutionsSection: string;

  // Subtoolbar
  activeSet: string;
  pageFilter: string;
  allPages: string;
  coverPage: string;
  teil1: string;
  teil2a: string;
  teil2b: string;
  teil3: string;
  teil4: string;
  teil5: string;
  undo: string;
  redo: string;
  zoomOut: string;
  zoomIn: string;
  designStyles: string;
  print: string;
  englishGuideToggle: string;
  englishGuideDesc: string;

  // Dashboard
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  downloadAllBtn: string;
  resetAllBtn: string;
  readinessTitle: string;
  readinessCount: string;
  passMarkInfo: string;
  completedInfo: string;
  searchPlaceholder: string;
  statusAll: string;
  statusReady: string;
  statusDraft: string;
  sortNumber: string;
  sortTitle: string;
  sortUpdated: string;
  openExam: string;
  solutionsBtn: string;
  editBtn: string;
  simulateBtn: string;
  duplicateBtn: string;
  items30: string;
  min65: string;

  // Interactive Test Mode
  interactiveBadge: string;
  timeRemaining: string;
  submitExam: string;
  restartExam: string;
  backToOverview: string;
  testResults: string;
  totalScore: string;
  scaledScore: string;
  statusPassed: string;
  statusFailed: string;
  passCriteria: string;
  detailedBreakdown: string;
  correctAnswers: string;
  wrongAnswers: string;
  unanswered: string;
  answeredCount: string;
  nextTeil: string;
  prevTeil: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  trueOption: string;
  falseOption: string;
  yesOption: string;
  noOption: string;
  noMatchingAd: string;

  // Style Panel
  stylePanelTitle: string;
  globalSync: string;
  customStyle: string;
  fontFamily: string;
  fontFamilyHelp: string;
  fontSize: string;
  lineHeight: string;
  margins: string;
  headerBarColor: string;
  headerTextColor: string;
  applyToAll: string;
  resetStyles: string;

  // Validation Modal
  validationTitle: string;
  validationValid: string;
  validationInvalid: string;
  validationTotalItems: string;
  ruleTeil1: string;
  ruleTeil2: string;
  ruleTeil3: string;
  ruleTeil4: string;
  ruleTeil5: string;
  ruleAdsCount: string;
  ruleZeroSituation: string;
  ruleWordCount: string;
  rulePassed: string;
  ruleFailed: string;
  closeBtn: string;

  // Candidate Details Labels & Subtitles
  surname: string;
  firstName: string;
  institutionCity: string;
  birthdate: string;
  candidateNumber: string;
  testCenter: string;
  adultsVariant: string;
  youthVariant: string;
  markingInstructions: string;

  // Exam Parts Guides for English Speakers
  teil1Guide: string;
  teil2Guide: string;
  teil3Guide: string;
  teil4Guide: string;
  teil5Guide: string;

  // Single Exam Download Modal
  downloadExamTitle: string;
  downloadModalSubtitle: string;
  downloadSingleExamBtn: string;
  downloadCardZipTitle: string;
  downloadCardZipDesc: string;
  downloadCandidatePdfTitle: string;
  downloadCandidatePdfDesc: string;
  downloadCandidateDocxTitle: string;
  downloadCandidateDocxDesc: string;
  downloadSolutionsPdfTitle: string;
  downloadSolutionsPdfDesc: string;
  downloadSolutionsDocxTitle: string;
  downloadSolutionsDocxDesc: string;
  downloadTxtTitle: string;
  downloadTxtDesc: string;
  downloadJsonTitle: string;
  downloadJsonDesc: string;
  downloadBtn: string;
  generating: string;
  downloadExamPackage: string;

  // Space Line & Print Layout Editor
  spaceLineEditorTitle: string;
  spaceLineEditorSubtitle: string;
  noteLinesToggle: string;
  noteLinesCount: string;
  noteLineStyle: string;
  noteLineSpacing: string;
  noteLineLabel: string;
  itemSpacing: string;
  itemDividersToggle: string;
  watermarkInput: string;
  watermarkHelp: string;
  spaceLinePresets: string;
  presetOfficialClean: string;
  presetCandidateNotes: string;
  presetNotebookLined: string;
  presetCompactEco: string;
  downloadLayoutSettings: string;
  downloadLayoutDesc: string;
  applySpaceLinesToAll: string;
  liveSpaceLinePreview: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  de: {
    appTitle: 'B1 Lesen Exam Studio',
    studioTitle: 'B1 Lesen Exam Studio',
    officialSubtitle: '10 Offizielle Modellsätze',
    tenSets: 'Prüfungsübersicht (10 Sätze)',
    saved: 'Gespeichert',
    saving: 'Speichert...',
    dashboard: 'Prüfungsübersicht',
    paper: 'Kandidatenblatt',
    solutions: 'Lösungen & Bogen',
    editor: 'Bogen-Editor',
    interactive: 'Prüfung simulieren',
    validate: 'Prüfen (Norm)',
    validateNorm: 'Prüfen (Norm)',
    download: 'Download',
    downloadPdf: 'PDF Kandidatenblatt',
    downloadDocx: 'DOCX Kandidatenblatt',
    downloadSolPdf: 'PDF Lösungen',
    downloadSolDocx: 'DOCX Lösungen',
    downloadAllZip: 'Alle 10 als ZIP',
    exportPdf: 'PDF Kandidatenblatt',
    exportDocx: 'DOCX Kandidatenblatt',
    exportSolPdf: 'PDF Lösungen',
    exportSolDocx: 'DOCX Lösungen',
    bulkZip: 'Alle 10 als ZIP',
    candidatePaperSection: 'Kandidatenblatt',
    solutionsSection: 'Lösungen & Scan-Bogen',
    activeSet: 'Aktiver Satz:',
    pageFilter: 'Seite:',
    allPages: 'Alle (1–7)',
    coverPage: 'Deckblatt',
    teil1: 'Teil 1',
    teil2a: 'Teil 2A',
    teil2b: 'Teil 2B',
    teil3: 'Teil 3',
    teil4: 'Teil 4',
    teil5: 'Teil 5',
    undo: 'Rückgängig (Ctrl+Z)',
    redo: 'Wiederholen (Ctrl+Y)',
    zoomOut: 'Verkleinern',
    zoomIn: 'Vergrößern',
    designStyles: 'Design & Stile',
    print: 'Drucken',
    englishGuideToggle: 'Englische Hinweise & Leitfaden',
    englishGuideDesc: 'Zeigt Prüfungshinweise und Übersetzungen für Englischsprachige an',
    heroBadge: 'Offizielles Prüfungsformat • CEFR B1 • 65 Min / 30 Aufgaben',
    heroTitle: '10 Vollständige Goethe-/ÖSD-Zertifikat B1 Modellsätze',
    heroDescription:
      'Hochpräzise Übungssätze mit originalgetreuem Layout (graue Sektionsbalken, Anzeigen-Tabs, Hausordnungs-Karten, Prüfer-Lösungsbogen & Umrechnungstabelle). Editierbar, druckbereit und als PDF/DOCX exportierbar.',
    downloadAllBtn: 'Alle 10 Prüfungen als ZIP laden',
    resetAllBtn: 'Auf Werkseinstellungen zurücksetzen',
    readinessTitle: 'Prüfungsbereitschaft',
    readinessCount: 'bereit',
    passMarkInfo: 'Passmarke: 60 % (18 / 30 Punkte)',
    completedInfo: 'abgeschlossen',
    searchPlaceholder: 'Thema, Stadt oder Titel suchen...',
    statusAll: 'Alle',
    statusReady: 'Bereit',
    statusDraft: 'Entwurf',
    sortNumber: 'Nach Prüfungsnummer (1–10)',
    sortTitle: 'Nach Titel',
    sortUpdated: 'Zuletzt bearbeitet',
    openExam: 'Kandidatenblatt',
    solutionsBtn: 'Lösungen',
    editBtn: 'Editor',
    simulateBtn: 'Test simulieren',
    duplicateBtn: 'Duplizieren',
    items30: '30 Aufgaben',
    min65: '65 Minuten',
    interactiveBadge: 'Interaktiver Übungsmodus',
    timeRemaining: 'Verbleibende Zeit',
    submitExam: 'Prüfung abgeben',
    restartExam: 'Neu starten',
    backToOverview: 'Zurück zur Übersicht',
    testResults: 'Prüfungsauswertung (Zertifikat B1)',
    totalScore: 'Rohpunkte Gesamt:',
    scaledScore: 'Skalierte Punkte (100er-Skala):',
    statusPassed: 'BESTANDEN! Herzlichen Glückwunsch!',
    statusFailed: 'NICHT BESTANDEN (Mindestens 60 Punkte erforderlich)',
    passCriteria: 'Bestanden ab 60 Punkten (mindestens 18 von 30 Rohpunkten).',
    detailedBreakdown: 'Detaillierte Auswertung nach Teilen',
    correctAnswers: 'Richtig',
    wrongAnswers: 'Falsch',
    unanswered: 'Unbeantwortet',
    answeredCount: 'Beantwortet:',
    nextTeil: 'Nächster Teil',
    prevTeil: 'Vorheriger Teil',
    yourAnswer: 'Ihre Antwort:',
    correctAnswer: 'Richtige Lösung:',
    explanation: 'Erklärung:',
    trueOption: 'Richtig',
    falseOption: 'Falsch',
    yesOption: 'Ja',
    noOption: 'Nein',
    noMatchingAd: 'Keine Anzeige (0)',
    stylePanelTitle: 'Prüfungsdesign & Layout-Stile',
    globalSync: '● Global synchron',
    customStyle: '○ Individuell angepasst',
    fontFamily: 'Schriftart (Offizielle Goethe-Typografie)',
    fontFamilyHelp: 'Source Sans 3 entspricht der echten Prüfungsschrift.',
    fontSize: 'Basis-Schriftgröße',
    lineHeight: 'Zeilenabstand',
    margins: 'Seitenränder (Drucklayout)',
    headerBarColor: 'Farbe des Sektionsbalkens',
    headerTextColor: 'Textfarbe im Balken',
    applyToAll: 'Auf alle 10 Prüfungen übertragen',
    resetStyles: 'Auf Goethe-Standard zurücksetzen',
    validationTitle: 'Prüfungs-Validierungsbericht (Goethe-Norm B1)',
    validationValid: 'Prüfung ist vollständig & normkonform',
    validationInvalid: 'Prüfungsnorm-Warnungen vorhanden',
    validationTotalItems: 'Gesamtaufgaben:',
    ruleTeil1: 'Teil 1: Genau 6 Richtig/Falsch-Aufgaben (1–6)',
    ruleTeil2: 'Teil 2: Genau 6 Dreifachauswahl-Aufgaben (7–12)',
    ruleTeil3: 'Teil 3: Genau 7 Zuordnungs-Aufgaben (13–19)',
    ruleTeil4: 'Teil 4: Genau 7 Ja/Nein-Aufgaben (20–26)',
    ruleTeil5: 'Teil 5: Genau 4 Dreifachauswahl-Aufgaben (27–30)',
    ruleAdsCount: 'Teil 3: Genau 10 Anzeigen (a bis j)',
    ruleZeroSituation: 'Teil 3: Genau 1 Situation mit Lösung 0 (keine Anzeige)',
    ruleWordCount: 'Wortanzahl & Sprachniveau B1 konform',
    rulePassed: 'Bestanden',
    ruleFailed: 'Fehlerhaft',
    closeBtn: 'Schließen',
    surname: 'Nachname',
    firstName: 'Vorname',
    institutionCity: 'Institution, Ort',
    birthdate: 'Geburtsdatum (TT.MM.JJJJ)',
    candidateNumber: 'PTN-Nr.',
    testCenter: 'Prüfungszentrum',
    adultsVariant: 'A – Erwachsene',
    youthVariant: 'B – Jugendliche',
    markingInstructions: 'Markieren Sie so: [X]  NICHT so: [/] [\\] [.] [o]',
    teil1Guide: 'Teil 1 (10 Min. • 6 Punkte): Lesen Sie eine persönliche Korrespondenz (E-Mail/Blog) und entscheiden Sie bei Aussagen 1–6, ob sie Richtig oder Falsch sind.',
    teil2Guide: 'Teil 2 (20 Min. • 6 Punkte): Lesen Sie zwei Pressetexte. Beantworten Sie jeweils 3 Dreifachauswahl-Fragen (a / b / c).',
    teil3Guide: 'Teil 3 (10 Min. • 7 Punkte): Ordnen Sie 7 Personen die passenden Anzeigen (a–j) zu. Achtung: Eine Anzeige bleibt ungenutzt, und genau eine Person hat KEINE passende Anzeige (Antwort: "0").',
    teil4Guide: 'Teil 4 (15 Min. • 7 Punkte): Lesen Sie 7 Leserbriefe zu einem kontroversen Thema. Entscheiden Sie: Ist die Person dafür (Ja) oder dagegen (Nein)?',
    teil5Guide: 'Teil 5 (10 Min. • 4 Punkte): Lesen Sie eine offizielle Hausordnung / Kursordnung. Beantworten Sie 4 Aufgaben (a / b / c).',
    downloadExamTitle: 'Prüfung einzeln herunterladen',
    downloadModalSubtitle: 'Wählen Sie das gewünschte Format für diesen Modellsatz:',
    downloadSingleExamBtn: 'Herunterladen',
    downloadCardZipTitle: 'Komplettes Prüfungspaket (ZIP)',
    downloadCardZipDesc: 'Enthält Kandidatenblatt (DOCX), Lösungsbogen (DOCX), Prüfungsdaten (JSON) & Klartext-Übersicht',
    downloadCandidatePdfTitle: 'Kandidatenblatt (PDF)',
    downloadCandidatePdfDesc: 'Druckfertiges 7-seitiges Prüfungsheft (Deckblatt + Teile 1–5 im originalgetreuen Goethe-Layout)',
    downloadCandidateDocxTitle: 'Kandidatenblatt (Word / DOCX)',
    downloadCandidateDocxDesc: 'Vollständig editierbares Dokument mit authentischen Kopfzeilen, Tabellen & Aufgaben',
    downloadSolutionsPdfTitle: 'Lösungsbogen & Prüferblatt (PDF)',
    downloadSolutionsPdfDesc: 'Vollständiger Lösungsschlüssel 1–30, optischer Scan-Bogen & offizielle 100-Punkte-Skala',
    downloadSolutionsDocxTitle: 'Lösungsbogen (Word / DOCX)',
    downloadSolutionsDocxDesc: 'Word-Vorlage mit Lösungen, Bewertungskriterien und Notenumrechnungstabelle',
    downloadTxtTitle: 'Text-Übersicht & Schlüssel (TXT)',
    downloadTxtDesc: 'Sauber formatierter Klartext aller Lesetexte, Fragen, Optionen und Lösungen für LMS/Unterricht',
    downloadJsonTitle: 'Strukturierte Daten (JSON)',
    downloadJsonDesc: 'Vollständiges Datenmodell für Backups und digitale Weiterverarbeitung',
    downloadBtn: 'Herunterladen',
    generating: 'Wird vorbereitet...',
    downloadExamPackage: 'Prüfungspaket herunterladen',
    spaceLineEditorTitle: 'Zeilenabstand & Notizzeilen-Editor',
    spaceLineEditorSubtitle: 'Layout- & Zeilenabstands-Einstellungen für Download & Druck (PDF & DOCX)',
    noteLinesToggle: 'Kandidaten-Notizzeilen anzeigen',
    noteLinesCount: 'Anzahl der Notizzeilen',
    noteLineStyle: 'Linienstil der Notizzeilen',
    noteLineSpacing: 'Zeilenhöhe / Linienabstand',
    noteLineLabel: 'Beschriftung des Notizfelds',
    itemSpacing: 'Aufgaben-Abstand (Zwischenraum)',
    itemDividersToggle: 'Dezente Trennlinien zwischen Aufgaben',
    watermarkInput: 'Wasserzeichen-Text (Download)',
    watermarkHelp: 'z.B. OFFIZIELLER MUSTERSATZ, PROBEEXAMEN, ENTWURF (leer lassen für kein Wasserzeichen)',
    spaceLinePresets: 'Layout-Vorlagen',
    presetOfficialClean: 'Offiziell Schlicht (Ohne Notizzeilen)',
    presetCandidateNotes: 'Prüfungsstandard (4 Notizzeilen gepunktet)',
    presetNotebookLined: 'Erweitertes Notizfeld (6 durchgezogene Zeilen)',
    presetCompactEco: 'Kompakt / Papiersparend',
    downloadLayoutSettings: 'Download-Layout & Zeilenabstand anpassen',
    downloadLayoutDesc: 'Konfigurieren Sie Zeilenabstand, Notizzeilen und Aufgabenabstand für den Ausdruck und Export.',
    applySpaceLinesToAll: 'Auf alle 10 Modellsätze anwenden',
    liveSpaceLinePreview: 'Live-Vorschau der Notizzeilen:',
  },
  en: {
    appTitle: 'B1 Lesen Exam Studio',
    studioTitle: 'B1 Lesen Exam Studio',
    officialSubtitle: '10 Official Practice Exam Sets',
    tenSets: 'Exam Library (10 Sets)',
    saved: 'Saved',
    saving: 'Saving...',
    dashboard: 'Exams Dashboard',
    paper: 'Question Paper',
    solutions: 'Answer Key & Sheet',
    editor: 'Paper Editor',
    interactive: 'Simulate Exam',
    validate: 'Validate Norm',
    validateNorm: 'Validate Norm',
    download: 'Download',
    downloadPdf: 'Candidate Paper PDF',
    downloadDocx: 'Candidate Paper DOCX',
    downloadSolPdf: 'Answer Key PDF',
    downloadSolDocx: 'Answer Key DOCX',
    downloadAllZip: 'Download All 10 (ZIP)',
    exportPdf: 'Candidate Paper PDF',
    exportDocx: 'Candidate Paper DOCX',
    exportSolPdf: 'Answer Key PDF',
    exportSolDocx: 'Answer Key DOCX',
    bulkZip: 'Download All 10 (ZIP)',
    candidatePaperSection: 'Candidate Question Paper',
    solutionsSection: 'Answer Key & Scan Sheet',
    activeSet: 'Active Set:',
    pageFilter: 'Page:',
    allPages: 'All (1–7)',
    coverPage: 'Cover Page',
    teil1: 'Part 1',
    teil2a: 'Part 2A',
    teil2b: 'Part 2B',
    teil3: 'Part 3',
    teil4: 'Part 4',
    teil5: 'Part 5',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    designStyles: 'Design & Styles',
    print: 'Print',
    englishGuideToggle: 'English Task Guide & Explanations',
    englishGuideDesc: 'Shows English instructions, task strategies, and field translations',
    heroBadge: 'Official Exam Standard • CEFR B1 • 65 Min / 30 Items',
    heroTitle: '10 Complete Goethe / ÖSD Zertifikat B1 Practice Exam Sets',
    heroDescription:
      'High-fidelity practice papers matching the authentic Goethe/ÖSD layout (grey header bars, cut-out advertisement badges, framed building rules cards, examiner scan sheet & official conversion scale). Fully editable, printable, and downloadable in PDF and DOCX.',
    downloadAllBtn: 'Download All 10 Exams (ZIP)',
    resetAllBtn: 'Reset All to Defaults',
    readinessTitle: 'Exam Readiness',
    readinessCount: 'ready',
    passMarkInfo: 'Pass Mark: 60% (18 / 30 raw items)',
    completedInfo: 'completed',
    searchPlaceholder: 'Search by topic, city or title...',
    statusAll: 'All',
    statusReady: 'Ready',
    statusDraft: 'Draft',
    sortNumber: 'By Exam Number (1–10)',
    sortTitle: 'By Title',
    sortUpdated: 'Recently Modified',
    openExam: 'Question Paper',
    solutionsBtn: 'Solutions',
    editBtn: 'Editor',
    simulateBtn: 'Practice Test',
    duplicateBtn: 'Duplicate',
    items30: '30 Items',
    min65: '65 Minutes',
    interactiveBadge: 'Interactive Practice Mode',
    timeRemaining: 'Time Remaining',
    submitExam: 'Submit Exam',
    restartExam: 'Restart Test',
    backToOverview: 'Back to Overview',
    testResults: 'Exam Evaluation (Zertifikat B1)',
    totalScore: 'Total Raw Score:',
    scaledScore: 'Scaled Score (out of 100):',
    statusPassed: 'PASSED! Congratulations!',
    statusFailed: 'NOT PASSED (Minimum 60 points required)',
    passCriteria: 'Passing standard is 60 points (at least 18 out of 30 raw items).',
    detailedBreakdown: 'Detailed Breakdown by Part',
    correctAnswers: 'Correct',
    wrongAnswers: 'Incorrect',
    unanswered: 'Unanswered',
    answeredCount: 'Answered:',
    nextTeil: 'Next Part',
    prevTeil: 'Previous Part',
    yourAnswer: 'Your Answer:',
    correctAnswer: 'Correct Answer:',
    explanation: 'Explanation & Translation:',
    trueOption: 'Richtig (True)',
    falseOption: 'Falsch (False)',
    yesOption: 'Ja (In Favor)',
    noOption: 'Nein (Against)',
    noMatchingAd: 'No Matching Ad (0)',
    stylePanelTitle: 'Exam Design & Layout Styles',
    globalSync: '● Global Sync',
    customStyle: '○ Custom per Exam',
    fontFamily: 'Font Family (Goethe Typography)',
    fontFamilyHelp: 'Source Sans 3 matches the authentic Goethe exam typeface.',
    fontSize: 'Base Font Size',
    lineHeight: 'Line Height Spacing',
    margins: 'Page Margins (Print Geometry)',
    headerBarColor: 'Header Bar Background Color',
    headerTextColor: 'Header Bar Text Color',
    applyToAll: 'Apply Styles to All 10 Exams',
    resetStyles: 'Reset to Official Goethe Standard',
    validationTitle: 'Exam Norm Validation Report (Goethe B1 Standard)',
    validationValid: 'Exam is 100% complete & conforms to official norm',
    validationInvalid: 'Validation warnings detected',
    validationTotalItems: 'Total Items:',
    ruleTeil1: 'Part 1: Exactly 6 True/False items (1–6)',
    ruleTeil2: 'Part 2: Exactly 6 Multiple Choice items (7–12)',
    ruleTeil3: 'Part 3: Exactly 7 Matching items (13–19)',
    ruleTeil4: 'Part 4: Exactly 7 Yes/No reader opinion items (20–26)',
    ruleTeil5: 'Part 5: Exactly 4 Multiple Choice regulations items (27–30)',
    ruleAdsCount: 'Part 3: Exactly 10 Advertisements (a through j)',
    ruleZeroSituation: 'Part 3: Exactly 1 situation with answer 0 (no matching ad)',
    ruleWordCount: 'Word counts & CEFR B1 vocabulary conformant',
    rulePassed: 'Passed',
    ruleFailed: 'Failed',
    closeBtn: 'Close',
    surname: 'Last Name / Nachname',
    firstName: 'First Name / Vorname',
    institutionCity: 'Institution & City / Ort',
    birthdate: 'Birthdate (DD.MM.YYYY) / Geburtsdatum',
    candidateNumber: 'Candidate ID (PTN-Nr.)',
    testCenter: 'Test Center / Prüfungszentrum',
    adultsVariant: 'A – Adults (Erwachsene)',
    youthVariant: 'B – Youth (Jugendliche)',
    markingInstructions: 'Mark boxes like this: [X]  DO NOT mark: [/] [\\] [.] [o]',
    teil1Guide: 'Part 1 (10 min • 6 points): Read a personal letter or blog post. Decide whether statements 1–6 are Richtig (True) or Falsch (False).',
    teil2Guide: 'Part 2 (20 min • 6 points): Read two authentic press articles. Answer 3 multiple choice questions (a / b / c) for each text.',
    teil3Guide: 'Part 3 (10 min • 7 points): Match 7 people to suitable advertisements (a–j). Note: One ad remains unused, and exactly one person has NO matching ad (answer: "0").',
    teil4Guide: 'Part 4 (15 min • 7 points): Read 7 reader comments on a controversial topic. Decide: Is the writer IN FAVOR of the measure/ban (Ja) or AGAINST (Nein)?',
    teil5Guide: 'Part 5 (10 min • 4 points): Read formal building/house rules (Hausordnung). Answer 4 multiple choice questions (a / b / c).',
    downloadExamTitle: 'Download Exam Individually',
    downloadModalSubtitle: 'Select the desired format for this practice test set:',
    downloadSingleExamBtn: 'Download',
    downloadCardZipTitle: 'Complete Exam Package (ZIP)',
    downloadCardZipDesc: 'Includes Candidate Paper (DOCX), Solutions Sheet (DOCX), Raw Data (JSON) & Full Text Summary',
    downloadCandidatePdfTitle: 'Candidate Question Paper (PDF)',
    downloadCandidatePdfDesc: 'Print-ready 7-page exam booklet (Cover page + Parts 1–5 in official Goethe layout)',
    downloadCandidateDocxTitle: 'Candidate Question Paper (Word / DOCX)',
    downloadCandidateDocxDesc: 'Fully editable Microsoft Word document with authentic grey bars, tables & questions',
    downloadSolutionsPdfTitle: 'Answer Key & Examiner Sheet (PDF)',
    downloadSolutionsPdfDesc: 'Complete solution key 1–30, optical bubble scan sheet & official 100-point scale',
    downloadSolutionsDocxTitle: 'Answer Key (Word / DOCX)',
    downloadSolutionsDocxDesc: 'Word document with solutions, marking guidelines, and score conversion table',
    downloadTxtTitle: 'Text Summary & Key (TXT)',
    downloadTxtDesc: 'Clean formatted plain text of all reading texts, questions, options and answers for LMS/teaching',
    downloadJsonTitle: 'Structured Data (JSON)',
    downloadJsonDesc: 'Full JSON schema representation for backups and developer workflows',
    downloadBtn: 'Download',
    generating: 'Generating...',
    downloadExamPackage: 'Download Exam Package',
    spaceLineEditorTitle: 'Space Line & Download Spacing Editor',
    spaceLineEditorSubtitle: 'Layout & space line controls for printed and downloaded exams (PDF & DOCX)',
    noteLinesToggle: 'Enable Candidate Note Space Lines',
    noteLinesCount: 'Number of Note Lines',
    noteLineStyle: 'Note Line Style',
    noteLineSpacing: 'Line Height / Spacing',
    noteLineLabel: 'Note Space Header Label',
    itemSpacing: 'Item / Question Spacing Gap',
    itemDividersToggle: 'Subtle Dividers Between Questions',
    watermarkInput: 'Watermark Text (Download)',
    watermarkHelp: 'e.g. OFFICIAL PRACTICE TEST, TRIAL EXAM, DRAFT (leave empty for none)',
    spaceLinePresets: 'Spacing Presets',
    presetOfficialClean: 'Official Minimal (No Note Lines)',
    presetCandidateNotes: 'Exam Standard (4 Dotted Note Lines)',
    presetNotebookLined: 'Extended Ruled Notes (6 Solid Lines)',
    presetCompactEco: 'Compact / Eco-Print Spacing',
    downloadLayoutSettings: 'Download Layout & Space Line Editor',
    downloadLayoutDesc: 'Customize line spacing, candidate scratchpad note lines, and question gaps for download.',
    applySpaceLinesToAll: 'Apply Spacing & Layout to All 10 Sets',
    liveSpaceLinePreview: 'Live Space Lines Preview:',
  },
};
