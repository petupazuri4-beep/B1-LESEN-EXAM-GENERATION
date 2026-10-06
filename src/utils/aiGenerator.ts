import { ExamModel, ExamStyleConfig, DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
import { validateExam } from './validator';

export interface ThemePreset {
  id: string;
  title: string;
  theme: string;
  description: string;
  category: 'Technik' | 'Arbeit' | 'Gesellschaft' | 'Umwelt' | 'Bildung' | 'Gesundheit';
  suggestedCity: string;
  suggestedInstitution: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'elektromobilitaet',
    title: 'Elektromobilität & Die Zukunft des Verkehrs',
    theme: 'Elektromobilität & Verkehrswende',
    description: 'E-Autos im Alltag, Ladeinfrastruktur in Städten, E-Bikes auf dem Land und Förderprogramme.',
    category: 'Technik',
    suggestedCity: 'Stuttgart',
    suggestedInstitution: 'Goethe-Institut Stuttgart',
  },
  {
    id: 'ki_schule',
    title: 'Künstliche Intelligenz im Schulunterricht',
    theme: 'Künstliche Intelligenz & Bildung',
    description: 'Nutzung von ChatGPT im Deutschunterricht, Lern-Apps, Chancengleichheit und Prüfungssicherheit.',
    category: 'Bildung',
    suggestedCity: 'Wien',
    suggestedInstitution: 'ÖSD Prüfungszentrum Wien',
  },
  {
    id: 'homeoffice',
    title: 'Homeoffice, Remote Work & Co-Working',
    theme: 'Neue Arbeitswelten & Homeoffice',
    description: 'Arbeiten von zu Hause, Vereinbarkeit von Familie und Beruf, Desk-Sharing und ergonomische Regeln.',
    category: 'Arbeit',
    suggestedCity: 'Frankfurt am Main',
    suggestedInstitution: 'Goethe-Institut Frankfurt',
  },
  {
    id: 'haustiere_senioren',
    title: 'Haustiere im Seniorenheim & Tiergestützte Therapie',
    theme: 'Tiere & Soziales Zusammenleben',
    description: 'Besuchshunde in Pflegeeinrichtungen, emotionale Unterstützung, Hygieneauflagen und Patenschaften.',
    category: 'Gesellschaft',
    suggestedCity: 'München',
    suggestedInstitution: 'Goethe-Institut München',
  },
  {
    id: 'nachhaltiger_konsum',
    title: 'Verpackungsfrei einkaufen & Unverpackt-Läden',
    theme: 'Nachhaltiger Konsum & Zero Waste',
    description: 'Einkauf mit Mehrweggläsern, regionale Bio-Produkte, Plastikreduktion und faire Lebensmittelpreise.',
    category: 'Umwelt',
    suggestedCity: 'Freiburg im Breisgau',
    suggestedInstitution: 'Universität Freiburg / ÖSD',
  },
  {
    id: 'gesunder_schlaf',
    title: 'Stressabbau, Achtsamkeit & Work-Life-Balance',
    theme: 'Gesundheit & Mentale Erholung',
    description: 'Meditation im Alltag, Feierabendroutinen, Digital Detox und betriebliche Gesundheitskurse.',
    category: 'Gesundheit',
    suggestedCity: 'Zürich',
    suggestedInstitution: 'Sprachenzentrum Zürich',
  },
];

export interface GenerationParams {
  theme: string;
  customTopic?: string;
  examNumber: number;
  audience: 'Erwachsene' | 'Jugendliche';
  city: string;
  institution: string;
  styleConfig?: ExamStyleConfig;
}

/**
 * Ensures strict compliance with Goethe-Institut / ÖSD Zertifikat B1 regulations:
 * - Exactly 30 items
 * - Teil 1: 1-6 (Richtig/Falsch)
 * - Teil 2: 7-9 (Text A), 10-12 (Text B) (a/b/c)
 * - Teil 3: 13-19 (13-19 matching a-j, exactly one '0', 10 ads a-j)
 * - Teil 4: 20-26 (Ja/Nein)
 * - Teil 5: 27-30 (a/b/c)
 */
export function sanitizeAndValidateExam(rawExam: Partial<ExamModel>, params: GenerationParams): ExamModel {
  const numStr = String(params.examNumber).padStart(2, '0');
  const now = new Date().toISOString();
  const fallbackStyle: ExamStyleConfig = params.styleConfig || {
    fontFamily: 'Source Sans 3',
    baseFontSizePt: 10,
    lineHeight: 1.4,
    headerBarColor: '#d9d9d9',
    headerTextColor: '#000000',
    accentColor: '#d97706',
    marginPreset: 'normal',
    spaceLines: DEFAULT_SPACE_LINE_CONFIG,
  };

  const id = `b1-lesen-gen-${params.examNumber}-${Date.now().toString(36)}`;
  const title = rawExam.title || `Übungssatz ${numStr}: ${params.theme}`;

  // 1. Sanitize Teil 1 items (exactly 6 items, numbers 1-6)
  const defaultT1Statements = [
    `Die Autorin / Der Autor berichtet über erste persönliche Erfahrungen mit ${params.theme}.`,
    `Vor dem Beginn gab es bei Freunden und Bekannten einige Vorbehalte.`,
    `Das Angebot kann im Alltag ohne langwierige Vorbereitung genutzt werden.`,
    `Die anfallenden Ausgaben sind nach ersten Berechnungen deutlich gestiegen.`,
    `In den nächsten Wochen findet eine gemeinsame Informationsveranstaltung statt.`,
    `Die Autorin / Der Autor rät der Freundin davon ab, das Vorhaben selbst auszuprobieren.`,
  ];
  const defaultT1Answers: Array<'Richtig' | 'Falsch'> = ['Richtig', 'Richtig', 'Richtig', 'Falsch', 'Richtig', 'Falsch'];

  const t1Items = Array.from({ length: 6 }, (_, idx) => {
    const it = rawExam.teil1?.items?.[idx];
    return {
      id: `g${params.examNumber}-t1-${idx + 1}`,
      number: idx + 1,
      statement: it?.statement || defaultT1Statements[idx],
      correctAnswer: (it?.correctAnswer === 'Richtig' || it?.correctAnswer === 'Falsch' ? it.correctAnswer : defaultT1Answers[idx]) as 'Richtig' | 'Falsch',
    };
  });

  // 2. Sanitize Teil 2 items (Text A: 7-9, Text B: 10-12)
  const defaultT2a = [
    {
      q: `Aus dem ersten Zeitungsartikel geht hervor, dass ${params.theme} ...`,
      options: {
        a: 'hauptsächlich für Experten interessant ist.',
        b: 'zunehmend im Alltag von Bürgerinnen und Bürgern eine Rolle spielt.',
        c: 'von den zuständigen Behörden verboten wurde.',
      },
      ans: 'b' as const,
    },
    {
      q: 'Die Experten empfehlen den Interessierten, ...',
      options: {
        a: 'sich vorab ausführlich beraten zu lassen.',
        b: 'möglichst viele Verträge gleichzeitig abzuschließen.',
        c: 'nur auf ausländische Anbieter zu vertrauen.',
      },
      ans: 'a' as const,
    },
    {
      q: 'Für die Zukunft erwarten die Verantwortlichen, dass ...',
      options: {
        a: 'die Gesamtkosten drastisch ansteigen werden.',
        b: 'weitere Städte und Kommunen ähnliche Modelle einführen.',
        c: 'das Projekt im kommenden Monat eingestellt wird.',
      },
      ans: 'b' as const,
    },
  ];

  const t2aItems = Array.from({ length: 3 }, (_, idx) => {
    const it = rawExam.teil2?.textA?.items?.[idx];
    const def = defaultT2a[idx];
    return {
      id: `g${params.examNumber}-t2-${7 + idx}`,
      number: 7 + idx,
      question: it?.question || def.q,
      options: {
        a: it?.options?.a || def.options.a,
        b: it?.options?.b || def.options.b,
        c: it?.options?.c || def.options.c,
      },
      correctAnswer: (['a', 'b', 'c'].includes(it?.correctAnswer || '') ? it!.correctAnswer : def.ans) as 'a' | 'b' | 'c',
    };
  });

  const defaultT2b = [
    {
      q: `Das Modellprojekt in Text B zeigt deutlich, dass ...`,
      options: {
        a: 'die tatsächliche Nachfrage die ersten Schätzungen übertroffen hat.',
        b: 'kaum jemand die neuen Möglichkeiten nutzen wollte.',
        c: 'nur ältere Mitbürgerinnen teilgenommen haben.',
      },
      ans: 'a' as const,
    },
    {
      q: 'Ein wesentlicher Vorteil für die Teilnehmenden besteht darin, dass ...',
      options: {
        a: 'die Abläufe flexibler und verlässlicher gestaltet werden können.',
        b: 'alle Angebote grundsätzlich kostenfrei bleiben.',
        c: 'keinerlei Vorschriften eingehalten werden müssen.',
      },
      ans: 'a' as const,
    },
    {
      q: 'Was plant die Projektleitung als nächsten Schritt?',
      options: {
        a: 'Eine Schließung der Beratungsstellen.',
        b: 'Eine schrittweise Ausweitung auf umliegende Bezirke.',
        c: 'Eine Verdoppelung der Teilnahmegebühren.',
      },
      ans: 'b' as const,
    },
  ];

  const t2bItems = Array.from({ length: 3 }, (_, idx) => {
    const it = rawExam.teil2?.textB?.items?.[idx];
    const def = defaultT2b[idx];
    return {
      id: `g${params.examNumber}-t2-${10 + idx}`,
      number: 10 + idx,
      question: it?.question || def.q,
      options: {
        a: it?.options?.a || def.options.a,
        b: it?.options?.b || def.options.b,
        c: it?.options?.c || def.options.c,
      },
      correctAnswer: (['a', 'b', 'c'].includes(it?.correctAnswer || '') ? it!.correctAnswer : def.ans) as 'a' | 'b' | 'c',
    };
  });

  // 3. Sanitize Teil 3: Ensure 10 ads (a to j), 7 situations (13 to 19), exactly ONE '0'
  const validLetters: Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  const advertisements = validLetters.map((letter, idx) => {
    const existing = (rawExam.teil3?.advertisements || []).find(a => a.letter?.toLowerCase() === letter);
    return {
      id: `ad-gen-${params.examNumber}-${letter}`,
      letter,
      title: existing?.title || `Anzeige ${letter.toUpperCase()}: Angebote & Beratung zu ${params.theme}`,
      body: existing?.body || `Umfassende Informationen, Kurse und Unterstützung für Einsteiger und Fortgeschrittene. Termine nach Vereinbarung.`,
      contact: existing?.contact || `kontakt@${params.theme.toLowerCase().replace(/[^a-z0-9]/g, '')}-angebot.de | Tel. 089-${Math.floor(100000 + Math.random() * 900000)}`,
      rotationDeg: existing?.rotationDeg ?? ((idx % 3 - 1) * 1.2),
    };
  });

  const beispielLetter = (rawExam.teil3?.beispiel?.answer?.toLowerCase() as any) || 'c';
  const unusedLetter = 'e';
  const availablePool = validLetters.filter(l => l !== beispielLetter && l !== unusedLetter);

  const defaultSituations = [
    `Martina sucht einen praxisnahen Wochenendkurs zum Thema ${params.theme} für Einsteiger.`,
    `Lukas möchte gebrauchte Geräte oder Zubehör rund um ${params.theme} günstig erwerben.`,
    `Sabine sucht eine persönliche Begleitung für eine Auslandsreise mit dem Segelboot.`, // Situation 15: Zero match
    `Jonas interessiert sich für ein duales Studium oder eine Ausbildung im Bereich ${params.theme}.`,
    `Familie Becker sucht kinderfreundliche Workshops zum Mitmachen an Samstagen.`,
    `Thomas sucht eine professionelle Beratung zu Fördermitteln und rechtlichen Richtlinien.`,
    `Amina möchte sich ehrenamtlich engagieren und Gleichgesinnte in ihrer Stadt kennenlernen.`,
  ];

  let zeroIdx = (rawExam.teil3?.situations || []).findIndex(s => s.correctAnswer === '0');
  if (zeroIdx < 0 || zeroIdx >= 7) zeroIdx = 2; // Situation 15

  const usedLettersSet = new Set<string>();
  const t3Situations = Array.from({ length: 7 }, (_, idx) => {
    const s = rawExam.teil3?.situations?.[idx];
    let answer = '0';
    if (idx !== zeroIdx) {
      const candidateAnswer = s?.correctAnswer?.toLowerCase();
      if (
        candidateAnswer &&
        candidateAnswer !== '0' &&
        candidateAnswer !== beispielLetter &&
        candidateAnswer !== unusedLetter &&
        !usedLettersSet.has(candidateAnswer) &&
        validLetters.includes(candidateAnswer as any)
      ) {
        answer = candidateAnswer;
        usedLettersSet.add(candidateAnswer);
      } else {
        const nextFree = availablePool.find(l => !usedLettersSet.has(l)) || 'a';
        answer = nextFree;
        usedLettersSet.add(nextFree);
      }
    }
    return {
      id: `g${params.examNumber}-t3-${13 + idx}`,
      number: 13 + idx,
      situation: s?.situation || defaultSituations[idx],
      correctAnswer: answer,
    };
  });

  // 4. Sanitize Teil 4: 7 reader letters (20 to 26), Ja/Nein
  const defaultAuthors = [
    { name: 'Florian', age: 24, city: 'Regensburg' },
    { name: 'Monika', age: 58, city: 'Augsburg' },
    { name: 'Daniel', age: 31, city: 'Nürnberg' },
    { name: 'Renate', age: 47, city: 'Passau' },
    { name: 'Tobias', age: 22, city: 'Bamberg' },
    { name: 'Birgit', age: 52, city: 'Ingolstadt' },
    { name: 'Sven', age: 39, city: 'Würzburg' },
  ];
  const defaultComments = [
    { text: `Ich befürworte eine stärkere Unterstützung von ${params.theme} sehr, weil es Zukunftschancen eröffnet.`, ans: 'Ja' as const },
    { text: `Die bisherigen Maßnahmen reichen vollkommen aus. Zusätzliche Steuergelder sollten besser in Schulen fließen.`, ans: 'Nein' as const },
    { text: `In meiner Heimatstadt sehen wir bereits großartige Erfolge. Ein Ausbau ist dringend erforderlich.`, ans: 'Ja' as const },
    { text: `Man sollte den Markt das regeln lassen und keine künstlichen Subventionen schaffen.`, ans: 'Nein' as const },
    { text: `Besonders für einkommensschwache Haushalte ist mehr staatliche Hilfe hier unverzichtbar.`, ans: 'Ja' as const },
    { text: `Oft profitieren am Ende nur große Konzerne davon, deshalb bin ich eher skeptisch.`, ans: 'Nein' as const },
    { text: `Es ist höchste Zeit zu handeln. Jeder investierte Euro zahlt sich langfristig aus.`, ans: 'Ja' as const },
  ];

  const t4Letters = Array.from({ length: 7 }, (_, idx) => {
    const lb = rawExam.teil4?.leserbriefe?.[idx];
    const defAuthor = defaultAuthors[idx % defaultAuthors.length];
    const defComment = defaultComments[idx];
    return {
      id: `g${params.examNumber}-t4-${20 + idx}`,
      number: 20 + idx,
      author: lb?.author || defAuthor.name,
      age: lb?.age || defAuthor.age,
      city: lb?.city || defAuthor.city,
      text: lb?.text || defComment.text,
      correctAnswer: (lb?.correctAnswer === 'Ja' || lb?.correctAnswer === 'Nein' ? lb.correctAnswer : defComment.ans) as 'Ja' | 'Nein',
    };
  });

  // 5. Sanitize Teil 5: 4 items (27 to 30), a/b/c
  const defaultT5 = [
    {
      q: 'Wer darf an den Angeboten laut Ordnung teilnehmen?',
      options: {
        a: 'Ausschließlich Personen mit ständigem Wohnsitz am Veranstaltungsort.',
        b: 'Alle angemeldeten Mitglieder nach vorheriger Registrierung.',
        c: 'Jeder Interessierte auch ohne vorherige Anmeldung.',
      },
      ans: 'b' as const,
    },
    {
      q: 'Was gilt hinsichtlich der Sicherheitsvorschriften?',
      options: {
        a: 'Den Anweisungen des Fachpersonals ist Folge zu leisten.',
        b: 'Sicherheitsregeln gelten nur bei schlechtem Wetter.',
        c: 'Die Verantwortung liegt ausschließlich beim Hersteller.',
      },
      ans: 'a' as const,
    },
    {
      q: 'Wer haftet bei vorsätzlich verursachten Sachschäden?',
      options: {
        a: 'Die Stadtkasse übernimmt den vollen Schadenersatz.',
        b: 'Der Verursacher haftet in vollem Umfang dafür.',
        c: 'Niemand, da eine pauschale Sammelversicherung besteht.',
      },
      ans: 'b' as const,
    },
    {
      q: 'Bis wann ist eine kostenfreie Stornierung möglich?',
      options: {
        a: 'Bis zu 24 Stunden vor dem gebuchten Termin.',
        b: 'Nur bis zu zwei Wochen im Voraus.',
        c: 'Stornierungen sind grundsätzlich ausgeschlossen.',
      },
      ans: 'a' as const,
    },
  ];

  const t5Items = Array.from({ length: 4 }, (_, idx) => {
    const it = rawExam.teil5?.items?.[idx];
    const def = defaultT5[idx];
    return {
      id: `g${params.examNumber}-t5-${27 + idx}`,
      number: 27 + idx,
      question: it?.question || def.q,
      options: {
        a: it?.options?.a || def.options.a,
        b: it?.options?.b || def.options.b,
        c: it?.options?.c || def.options.c,
      },
      correctAnswer: (['a', 'b', 'c'].includes(it?.correctAnswer || '') ? it!.correctAnswer : def.ans) as 'a' | 'b' | 'c',
    };
  });

  const exam: ExamModel = {
    id,
    examNumber: params.examNumber,
    title,
    theme: params.theme,
    status: 'Ready',
    updatedAt: now,
    styleConfig: fallbackStyle,
    candidateInfo: {
      institution: params.institution || 'Goethe-Institut',
      city: params.city || 'Prüfungszentrum',
      examType: params.audience,
      centerCode: `DE-${params.city.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    },
    teil1: {
      workTimeMinutes: 10,
      instruction: rawExam.teil1?.instruction || 'Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Wählen Sie: Sind die Aussagen Richtig oder Falsch?',
      sourceContext: rawExam.teil1?.sourceContext || `Ein persönlicher Erfahrungsbericht über ${params.theme}.`,
      emailGreeting: rawExam.teil1?.emailGreeting || 'Liebe Maria,',
      emailBody: rawExam.teil1?.emailBody || `ich hoffe, dir geht es gut! Ich wollte dir schon lange von meinen neuen Erfahrungen rund um ${params.theme} erzählen. Vor kurzem habe ich an einem spannenden Projekt teilgenommen. Am Anfang war ich ziemlich skeptisch, ob das im Alltag wirklich so reibungslos funktioniert. Doch nach den ersten Wochen bin ich absolut begeistert. Man lernt viele neue Dinge und schont gleichzeitig Ressourcen. Nächste Woche gibt es eine Informationsveranstaltung – hast du nicht Lust mitzukommen? Viele Grüße!`,
      emailSignoff: rawExam.teil1?.emailSignoff || 'Herzliche Grüße\nAlex',
      authorLocation: params.city,
      beispiel: {
        statement: rawExam.teil1?.beispiel?.statement || `Alex hat schon immer Erfahrungen mit ${params.theme} gesammelt.`,
        answer: (rawExam.teil1?.beispiel?.answer as any) || 'Falsch',
      },
      items: t1Items,
    },
    teil2: {
      workTimeMinutes: 20,
      instruction: rawExam.teil2?.instruction || 'Lesen Sie den Text aus der Presse und die Aufgaben dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.',
      textA: {
        title: rawExam.teil2?.textA?.title || `Fortschritt und Nachhaltigkeit: ${params.theme}`,
        kicker: rawExam.teil2?.textA?.kicker || 'Aktuelle Entwicklungen im deutschsprachigen Raum',
        source: rawExam.teil2?.textA?.source || 'aus einer deutschen Tageszeitung',
        bodyParagraphs: rawExam.teil2?.textA?.bodyParagraphs || [
          `Immer mehr Menschen und Unternehmen setzen heute auf ${params.theme}. Experten berichten von signifikanten Zuwachsraten im letzten Jahr.`,
          `Besonders junge Berufstätige und Familien schätzen die praktischen Vorteile im Alltag. Ein wesentlicher Aspekt ist die Kombination aus Wirtschaftlichkeit und Umweltbewusstsein.`,
          `Gleichzeitig weisen Verbraucherschützer darauf hin, dass die Rahmenbedingungen weiter verbessert werden müssen, um langfristigen Erfolg zu sichern.`,
        ],
        beispiel: {
          question: rawExam.teil2?.textA?.beispiel?.question || `Im Text steht, dass das Interesse an diesem Bereich ...`,
          options: {
            a: rawExam.teil2?.textA?.beispiel?.options?.a || 'spürbar abgenommen hat.',
            b: rawExam.teil2?.textA?.beispiel?.options?.b || 'in den letzten Jahren deutlich gestiegen ist.',
            c: rawExam.teil2?.textA?.beispiel?.options?.c || 'nur bei älteren Bürgern existiert.',
          },
          answer: (rawExam.teil2?.textA?.beispiel?.answer as any) || 'b',
        },
        items: t2aItems,
      },
      textB: {
        title: rawExam.teil2?.textB?.title || `Neue Perspektiven: Wie ${params.theme} unseren Alltag verändert`,
        kicker: rawExam.teil2?.textB?.kicker || 'Ein Modellprojekt aus der Praxis',
        source: rawExam.teil2?.textB?.source || 'aus einem Schweizer Magazin',
        bodyParagraphs: rawExam.teil2?.textB?.bodyParagraphs || [
          `In ausgewählten Städten wird erprobt, wie moderne Konzepte das Zusammenleben und die Infrastruktur nachhaltig bereichern können.`,
          `Die Teilnehmerinnen und Teilnehmer berichten von positiven Erfahrungen: Die Abläufe sind unkompliziert, und die gegenseitige Unterstützung im Quartier wächst.`,
          `Die Stadtverwaltung plant nun, die Initiative schrittweise auf weitere Stadtteile auszuweiten.`,
        ],
        items: t2bItems,
      },
    },
    teil3: {
      workTimeMinutes: 10,
      instruction: rawExam.teil3?.instruction || 'Lesen Sie die Situationen 13 bis 19 und die Anzeigen A bis J aus verschiedenen deutschsprachigen Medien. Wählen Sie: Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Die Anzeige aus dem Beispiel können Sie nicht mehr verwenden. Für eine Situation gibt es keine passende Anzeige. In diesem Fall schreiben Sie 0.',
      contextDescription: rawExam.teil3?.contextDescription || `Personen suchen nach Angeboten und Dienstleistungen zum Thema ${params.theme}.`,
      beispiel: {
        situation: rawExam.teil3?.beispiel?.situation || `Katja sucht eine kurze Einführung in grundlegende Fachbegriffe zu ${params.theme}.`,
        answer: (rawExam.teil3?.beispiel?.answer as any) || 'c',
      },
      situations: t3Situations,
      unusedAdLetter: 'e',
      advertisements,
    },
    teil4: {
      workTimeMinutes: 15,
      instruction: rawExam.teil4?.instruction || `Lesen Sie die Texte 20 bis 26. Wählen Sie: Ist die Person für stärkere staatliche Förderung von ${params.theme}? Ja oder Nein?`,
      contextTopic: rawExam.teil4?.contextTopic || `In einer Zeitschrift lesen Sie Leserbriefe zum Thema „Sollte ${params.theme} gesetzlich und finanziell stärker gefördert werden?“`,
      questionFraming: rawExam.teil4?.questionFraming || `Ist die Person für stärkere Förderung von ${params.theme}?`,
      beispiel: {
        author: rawExam.teil4?.beispiel?.author || 'Markus',
        age: rawExam.teil4?.beispiel?.age || 48,
        city: rawExam.teil4?.beispiel?.city || 'Bremen',
        text: rawExam.teil4?.beispiel?.text || `Gezielte Investitionen in zukunftsfähige Lösungen kommen der gesamten Gesellschaft zugute. Daher halte ich eine Förderung für absolut sinnvoll.`,
        answer: (rawExam.teil4?.beispiel?.answer as any) || 'Ja',
      },
      leserbriefe: t4Letters,
    },
    teil5: {
      workTimeMinutes: 10,
      instruction: rawExam.teil5?.instruction || 'Lesen Sie die Aufgaben 27 bis 30 und den Text dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.',
      contextSituation: rawExam.teil5?.contextSituation || `Sie nutzen ein Angebot zu ${params.theme} und lesen die Nutzungsordnung aufmerksam durch.`,
      sheetTitle: rawExam.teil5?.sheetTitle || `BENUTZUNGS- UND TEILNAHMEORDNUNG: ${params.theme.toUpperCase()}`,
      sheetSubtitle: rawExam.teil5?.sheetSubtitle || 'Bestimmungen für Sicherheit, Nutzung und gegenseitige Rücksichtnahme',
      sections: rawExam.teil5?.sections || [
        {
          title: 'Geltungsbereich & Anmeldung',
          content: 'Die Teilnahme an Kursen und Veranstaltungen ist allen registrierten Mitgliedern gestattet. Die Anmeldung muss spätestens 48 Stunden vor Beginn erfolgen.',
        },
        {
          title: 'Sicherheit & Verhalten',
          content: 'Alle Teilnehmer sind verpflichtet, die Sicherheitsvorschriften genau zu beachten. Den Anweisungen des Fachpersonals ist jederzeit Folge zu leisten.',
        },
        {
          title: 'Haftung & Schäden',
          content: 'Für vorsätzlich oder grob fahrlässig verursachte Schäden an Geräten oder Räumlichkeiten haftet der Verursacher in vollem Umfang.',
        },
        {
          title: 'Rücktritt & Gebühren',
          content: 'Eine kostenfreie Stornierung gebuchter Termine ist bis zu 24 Stunden vorher möglich; bei verspäteter Absage wird eine Bearbeitungsgebühr erhoben.',
        },
      ],
      items: t5Items,
    },
  };

  return exam;
}

/**
 * High-quality procedural templates for popular B1 topics when offline or fallback is needed.
 */
export function generateCuratedB1Exam(
  themePreset: ThemePreset,
  examNumber: number,
  customParams?: Partial<GenerationParams>
): ExamModel {
  const numStr = String(examNumber).padStart(2, '0');
  const baseParams: GenerationParams = {
    theme: themePreset.theme,
    examNumber,
    audience: customParams?.audience || 'Erwachsene',
    city: customParams?.city || themePreset.suggestedCity || 'München',
    institution: customParams?.institution || themePreset.suggestedInstitution || 'Goethe-Institut',
    ...customParams,
  };

  if (themePreset.id === 'elektromobilitaet') {
    return sanitizeAndValidateExam({
      title: `Übungssatz ${numStr}: Elektromobilität & Die Zukunft des Verkehrs`,
      teil1: {
        workTimeMinutes: 10,
        instruction: 'Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Wählen Sie: Sind die Aussagen Richtig oder Falsch?',
        sourceContext: 'David schreibt seiner Schwester Lisa über seine Erfahrungen mit einem neuen Elektroauto.',
        emailGreeting: 'Liebe Lisa,',
        emailBody: `wie versprochen melde ich mich nach zwei Wochen mit meinem neuen Elektroauto! Du warst ja anfangs eher skeptisch, ob ein reines E-Auto für meinen täglichen Arbeitsweg von fast vierzig Kilometern taugt. Ich kann dir sagen: Ich bin absolut begeistert! Das Fahrgefühl ist unglaublich leise und entspannend. Man hört fast nur das Rollen der Reifen. Morgens kann ich das Auto per Smartphone-App vorheizen, sodass die Scheiben im Winter nie mehr vereist sind. In unserer Tiefgarage hat die Hausverwaltung letzte Woche eine moderne Wallbox installiert. Wenn ich abends nach Hause komme, stecke ich das Ladekabel ein, und am nächsten Morgen ist die Batterie wieder zu hundert Prozent voll. Die Stromkosten sind deutlich geringer als meine früheren Benzinausgaben. Für eine volle Ladung zahle ich zu Hause etwa zwölf Euro und komme damit rund dreihundert Kilometer weit. Längere Strecken auf der Autobahn erfordern natürlich etwas Planung: Man muss nach zweieinhalb Stunden eine zwanzigminütige Kaffeepause an einer Schnellladesäule einlegen. Doch diese Pause tut mir nach langen Fahrten sowieso gut. Kommenden Samstag mache ich einen Ausflug in den Schwarzwald. Hättest du Lust mitzufahren? Dann kannst du selbst mal eine Probefahrt machen! Viele liebe Grüße David`,
        emailSignoff: 'Viele liebe Grüße\nDavid',
        authorLocation: 'Stuttgart',
        beispiel: {
          statement: 'David hat sein Elektroauto erst seit wenigen Tagen.',
          answer: 'Falsch',
        },
        items: [
          { id: `e${examNumber}-1`, number: 1, statement: 'Lisa riet David vor dem Kauf zu einem Elektroauto.', correctAnswer: 'Falsch' },
          { id: `e${examNumber}-2`, number: 2, statement: 'David lädt das Auto regelmäßig direkt in seiner Tiefgarage auf.', correctAnswer: 'Richtig' },
          { id: `e${examNumber}-3`, number: 3, statement: 'Das Aufladen an der heimischen Steckdose ist teurer als Benzin.', correctAnswer: 'Falsch' },
          { id: `e${examNumber}-4`, number: 4, statement: 'Auf weiten Strecken muss David Ladestopps zeitlich einplanen.', correctAnswer: 'Richtig' },
          { id: `e${examNumber}-5`, number: 5, statement: 'David empfindet die Ladepausen auf der Autobahn als störend.', correctAnswer: 'Falsch' },
          { id: `e${examNumber}-6`, number: 6, statement: 'David lädt Lisa zu einer gemeinsamen Probefahrt am Wochenende ein.', correctAnswer: 'Richtig' },
        ],
      },
      teil2: {
        workTimeMinutes: 20,
        instruction: 'Lesen Sie den Text aus der Presse und die Aufgaben dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.',
        textA: {
          title: 'Boom auf zwei Rädern',
          kicker: 'E-Bikes verdrängen in deutschen Großstädten zunehmend den PKW-Verkehr',
          source: 'aus einer deutschen Verkehrszeitschrift',
          bodyParagraphs: [
            'Über zwei Millionen E-Bikes wurden im vergangenen Jahr in Deutschland verkauft. Was früher als Seniorenrad belächelt wurde, ist heute das beliebteste urbane Fortbewegungsmittel junger Pendler.',
            'Mit elektrischer Tretunterstützung bis 25 km/h meistert man Steigungen und Gegenwind mühelos und kommt ohne Schweißperlen im Büro an. Viele Städte reagieren auf den Boom und bauen breite Radschnellwege.',
            'Verkehrsforscher betonen zudem den gesundheitlichen Nutzen: Trotz Elektromotor bewegen sich Radler regelmäßig an der frischen Luft und reduzieren ihr Risiko für Herz-Kreislauf-Erkrankungen deutlich.',
          ],
          beispiel: {
            question: 'E-Bikes werden in Deutschland ...',
            options: {
              a: 'nur noch von älteren Personen gefahren.',
              b: 'heute von vielen Pendlern für den Arbeitsweg genutzt.',
              c: 'auf öffentlichen Straßen verboten.',
            },
            answer: 'b',
          },
          items: [
            {
              id: `e${examNumber}-7`,
              number: 7,
              question: 'Laut dem Zeitungsbericht sind E-Bikes besonders attraktiv, weil ...',
              options: {
                a: 'man mit ihnen schneller als mit Zügen fahren kann.',
                b: 'man ohne große Anstrengung Steigungen bewältigt.',
                c: 'sie keine Akkus mehr benötigen.',
              },
              correctAnswer: 'b',
            },
            {
              id: `e${examNumber}-8`,
              number: 8,
              question: 'Als Reaktion auf die steigende Zahl von Radlern ...',
              options: {
                a: 'schaffen Kommunen spezielle Radschnellverbindungen.',
                b: 'müssen Radfahrer eine jährliche Steuer zahlen.',
                c: 'werden alle Fahrradwege nachts beleuchtet.',
              },
              correctAnswer: 'a',
            },
            {
              id: `e${examNumber}-9`,
              number: 9,
              question: 'Verkehrswissenschaftler stellen fest, dass E-Bike-Fahren ...',
              options: {
                a: 'keinerlei positive Wirkung auf den Körper hat.',
                b: 'die Gesundheit und Fitness im Alltag fördert.',
                c: 'gefährlicher als Motorradfahren ist.',
              },
              correctAnswer: 'b',
            },
          ],
        },
        textB: {
          title: 'Carsharing mit Strom',
          kicker: 'München testet elektrische Flotten in Wohnquartieren',
          source: 'aus einer bayerischen Wirtschaftszeitung',
          bodyParagraphs: [
            'Ein eigenes Auto steht im Durchschnitt über 23 Stunden am Tag ungenutzt am Straßenrand. In München setzt die Stadtverwaltung daher auf stationsbasiertes E-Carsharing direkt in Wohnsiedlungen.',
            'Anwohner können per App kleine Elektroflitzer für Einkäufe oder Ausflüge stundenweise buchen. Ein privates Fahrzeug wird dadurch für viele Haushalte überflüssig.',
            'Die Bilanz nach einem Jahr Testphase überzeugt: Ein einziges Carsharing-Fahrzeug ersetzt bis zu zehn private Autos und schafft so wertvollen Platz für Grünflächen und Spielplätze.',
          ],
          items: [
            {
              id: `e${examNumber}-10`,
              number: 10,
              question: 'Das Münchner Carsharing-Projekt will erreichen, dass ...',
              options: {
                a: 'Familien sich ein zweites Auto anschaffen.',
                b: 'weniger private Fahrzeuge öffentlichen Raum blockieren.',
                c: 'nur noch nachts Auto gefahren wird.',
              },
              correctAnswer: 'b',
            },
            {
              id: `e${examNumber}-11`,
              number: 11,
              question: 'Wie buchen die Bewohner die Fahrzeuge?',
              options: {
                a: 'Mit einer mobilen App auf dem Smartphone.',
                b: 'Nur persönlich im Bürgeramt.',
                c: 'Durch schriftlichen Antrag einen Monat vorher.',
              },
              correctAnswer: 'a',
            },
            {
              id: `e${examNumber}-12`,
              number: 12,
              question: 'Ein wesentliches Ergebnis des Modellprojekts ist: ...',
              options: {
                a: 'Die Kosten waren zu hoch für die Stadt.',
                b: 'Ein Gemeinschaftsauto ersetzt mehrere private PKW.',
                c: 'Es gab kaum Interesse unter den Nachbarn.',
              },
              correctAnswer: 'b',
            },
          ],
        },
      },
      teil3: {
        workTimeMinutes: 10,
        instruction: 'Lesen Sie die Situationen 13 bis 19 und die Anzeigen A bis J aus verschiedenen deutschsprachigen Medien. Wählen Sie: Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Die Anzeige aus dem Beispiel können Sie nicht mehr verwenden. Für eine Situation gibt es keine passende Anzeige. In diesem Fall schreiben Sie 0.',
        contextDescription: 'Personen suchen nach Angeboten und Kursen rund um Elektromobilität, Fahrräder und nachhaltiges Reisen.',
        beispiel: {
          situation: 'Laura sucht ein Reparatur-Handbuch für historische Benzin-Mofas.',
          answer: 'j',
        },
        situations: [
          { id: `e${examNumber}-13`, number: 13, situation: 'Markus möchte am Wochenende an einem Fahrsicherheitstraining für E-Bikes teilnehmen.', correctAnswer: 'a' },
          { id: `e${examNumber}-14`, number: 14, situation: 'Julia sucht eine Ladekarte für kostenloses Laden an solarbetriebenen Ladesäulen.', correctAnswer: 'f' },
          { id: `e${examNumber}-15`, number: 15, situation: 'Stefan sucht einen Verleih für elektrische Lastenfahrräder zum Transport von Möbeln.', correctAnswer: 'b' },
          { id: `e${examNumber}-16`, number: 16, situation: 'Elena sucht eine spezialisierte Werkstatt für den Akkutausch bei älteren E-Rollern.', correctAnswer: 'd' },
          { id: `e${examNumber}-17`, number: 17, situation: 'Christian möchte einen Führerschein für schwere LKW mit Elektroantrieb machen.', correctAnswer: '0' },
          { id: `e${examNumber}-18`, number: 18, situation: 'Sarah sucht ein Hotel in den Bergen mit eigener Schnellladestation für Gäste-PKW.', correctAnswer: 'g' },
          { id: `e${examNumber}-19`, number: 19, situation: 'Tobias möchte lernen, wie man eine eigene Photovoltaik-Inselanlage für den Garten baut.', correctAnswer: 'h' },
        ],
        unusedAdLetter: 'e',
        advertisements: [
          { id: 'ad-e-a', letter: 'a', title: 'ADAC Fahrsicherheitstraining E-Bike & Pedelec', body: 'Richtig bremsen, Kurventechnik und Gleichgewichtstraining mit erfahrenen Instruktoren. Samstags 10–14 Uhr.', contact: 'www.adac-training.de/ebike', rotationDeg: -1 },
          { id: 'ad-e-b', letter: 'b', title: 'CargoVelo: E-Lastenräder stundenweise leihen', body: 'Umzug oder Wocheneinkauf? Miete geräumige E-Cargobikes mit bis zu 150 kg Zuladung an 20 Stadtstationen.', contact: 'hallo@cargovelo-verleih.de', rotationDeg: 1.2 },
          { id: 'ad-e-c', letter: 'c', title: 'Beispiel: Klassiker-Magazin & Oldtimer-Treff', body: 'Restaurierungstipps für Mopeds und Motorräder der 70er und 80er Jahre. Werkstattberichte und Kleinanzeigen.', contact: 'www.oldtimer-mofa-forum.de', rotationDeg: 0 },
          { id: 'ad-e-d', letter: 'd', title: 'Akku-Doktor: Zellentausch & Reparatur', body: 'Kapazitätsverlust bei E-Scooter oder Pedelec? Wir prüfen und tauschen Akkuzellen professionell mit 2 Jahren Garantie.', contact: 'info@akku-doktor-sued.de', rotationDeg: -0.8 },
          { id: 'ad-e-e', letter: 'e', title: 'Verkauf von Benzin-Rasenmähern & Generatoren', body: 'Große Auswahl an Verbrennungsmotoren für Forst- und Landwirtschaft im Fachgeschäft.', contact: 'Tel. 0711-889911', rotationDeg: 2.1 },
          { id: 'ad-e-f', letter: 'f', title: 'SolarCharge Community: Sonne tanken!', body: 'Lade dein E-Fahrzeug mit 100% lokalem Sonnenstrom! Exklusive Ladekarte für Bürgerenergie-Säulen.', contact: 'www.solarcharge-netz.de', rotationDeg: 1.5 },
          { id: 'ad-e-g', letter: 'g', title: 'Naturhotel Schwarzwaldruh mit E-Lounge', body: 'Nachhaltig urlauben! 6 Hypercharger (bis 300 kW) direkt am Hotelparkplatz. Während des Dinners aufladen.', contact: 'reservierung@schwarzwaldruh-hotel.de', rotationDeg: -1.3 },
          { id: 'ad-e-h', letter: 'h', title: 'Workshop: Balkon- & Gartenkraftwerk DIY', body: 'Vom Solarpanel zum Wechselrichter: Plane und installiere deine eigene Mini-Solaranlage selbst.', contact: 'kurse@energie-selbermachen.org', rotationDeg: 0.7 },
          { id: 'ad-e-i', letter: 'i', title: 'Kajak- & Bootstouren auf dem Neckar', body: 'Geführte Paddeltouren für Schulklassen und Firmen. Ausrüstung wird gestellt.', contact: 'neckar-touren@posteo.de', rotationDeg: -1.6 },
          { id: 'ad-e-j', letter: 'j', title: 'Gebrauchte Motorroller 50ccm Ankauf', body: 'Faire Preise für funktionstüchtige Zweitakt-Roller. Barzahlung bei Abholung.', contact: 'Tel. 0172-334455', rotationDeg: 0.9 },
        ],
      },
      teil4: {
        workTimeMinutes: 15,
        instruction: 'Lesen Sie die Texte 20 bis 26. Wählen Sie: Ist die Person für ein generelles Verbot von Benzin- und Dieselautos ab 2035? Ja oder Nein?',
        contextTopic: 'In einer deutschen Tageszeitung lesen Sie Leserbriefe zum Thema „Sollte der Verkauf von neuen Autos mit Verbrennungsmotor ab 2035 verboten werden?“',
        questionFraming: 'Ist die Person für ein Verbrenner-Verbot ab 2035?',
        beispiel: {
          author: 'Klaus',
          age: 56,
          city: 'Heilbronn',
          text: 'Der Verkehrssektor ist für einen riesigen Teil der Treibhausgase verantwortlich. Wenn wir die Klimaziele ernst nehmen, müssen wir fossile Brennstoffe schnellstmöglich stoppen. Ein Verbot schafft klare Planungssicherheit für die Industrie.',
          answer: 'Ja',
        },
        leserbriefe: [
          { id: `e${examNumber}-20`, number: 20, author: 'Markus', age: 44, city: 'Ingolstadt', text: 'Unsere Automobilindustrie sichert Hunderttausende gut bezahlte Arbeitsplätze. Ein starres Verbot zerstört Wohlstand und schwächt deutsche Unternehmen im globalen Wettbewerb gegen China und die USA.', correctAnswer: 'Nein' },
          { id: `e${examNumber}-21`, number: 21, author: 'Corinna', age: 29, city: 'Tübingen', text: 'Die Abgase in unseren Innenstädten machen Menschen krank. Elektroautos sind viel effizienter und leiser. Je schneller wir auf saubere Antriebe umstellen, desto besser für die Lebensqualität aller Bürger.', correctAnswer: 'Ja' },
          { id: `e${examNumber}-22`, number: 22, author: 'Helmut', age: 68, city: 'Ulm', text: 'Viele Mieter in Mehrfamilienhäusern haben überhaupt keine Lademöglichkeit vor der Haustür. Solange die Ladeinfrastruktur auf dem Land nicht flächendeckend funktioniert, ist ein Verkaufsverbot reine Schikane.', correctAnswer: 'Nein' },
          { id: `e${examNumber}-23`, number: 23, author: 'Sandra', age: 35, city: 'Freiburg', text: 'Norwegen zeigt doch längst, dass es hervorragend geht: Dort sind schon heute über neunzig Prozent der Neuzulassungen elektrisch. Wo ein politischer Wille ist, entstehen auch die Ladesäulen.', correctAnswer: 'Ja' },
          { id: `e${examNumber}-24`, number: 24, author: 'Jürgen', age: 52, city: 'Mannheim', text: 'Synthetische E-Fuels und Biokraftstoffe könnten bestehende Motoren klimaneutral machen. Warum schließt die Politik andere technische Innovationen ideologisch aus und setzt nur auf eine einzige Karte?', correctAnswer: 'Nein' },
          { id: `e${examNumber}-25`, number: 25, author: 'Melanie', age: 23, city: 'Karlsruhe', text: 'Die junge Generation muss mit den verheerenden Folgen der Klimaerwärmung leben. Das Festhalten am Erdöl ist pure Verweigerung von Realität. 2035 ist eigentlich schon fast zu spät.', correctAnswer: 'Ja' },
          { id: `e${examNumber}-26`, number: 26, author: 'Thomas', age: 38, city: 'Pforzheim', text: 'Wenn der Strom in Deutschland weiter zu großen Teilen aus Kohle und Gas erzeugt wird, ist das E-Auto kein Klimaretter. Erst muss das Stromnetz 100% grün sein, bevor man Verbote beschließt.', correctAnswer: 'Nein' },
        ],
      },
      teil5: {
        workTimeMinutes: 10,
        instruction: 'Lesen Sie die Aufgaben 27 bis 30 und den Text dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.',
        contextSituation: 'Sie nutzen eine öffentliche Ladestation für Elektrofahrzeuge der Stadtwerke und lesen die Betriebsordnung.',
        sheetTitle: 'NUTZUNGS- UND BETRIEBSORDNUNG FÜR ÖFFENTLICHE LADESÄULEN',
        sheetSubtitle: 'Stadtwerke Energie & Mobilität GmbH',
        sections: [
          {
            title: 'Ladeberechtigung & Parkdauer',
            content: 'Das Parken an den gekennzeichneten Ladeplätzen ist ausschließlich Fahrzeugen mit E-Kennzeichen während des aktiven Ladevorgangs gestattet. Nach Beendigung des Ladevorgangs ist der Parkplatz innerhalb von maximal 30 Minuten freizugeben (Blockiergebühr ab Minute 31: 0,10 Euro/Minute). Die maximale Höchstparkdauer beträgt an Werktagen tagsüber vier Stunden.',
          },
          {
            title: 'Bedienung & Ladekabel',
            content: 'Zum Starten des Ladevorgangs ist die Autorisierung mittels RFID-Ladekarte oder Smartphone-App erforderlich. Es dürfen ausschließlich unbeschädigte, CE-zertifizierte Typ-2-Ladekabel verwendet werden. Das Kabel ist vor dem Start fest in die Ladebuchse einzustecken; während des Ladevorgangs wird das Kabel automatisch diebstahlsicher verriegelt.',
          },
          {
            title: 'Sicherheit, Störungen & Not-Halt',
            content: 'Bei sichtbaren Beschädigungen an der Ladesäule, austretender Feuchtigkeit oder Rauchentwicklung darf der Ladevorgang nicht gestartet werden. Der rote Not-Aus-Schalter an der Säulenseite ist ausschließlich für unmittelbare Gefahrensituationen vorgesehen. Technische Störungen sind umgehend über die 24-Stunden-Hotline (0800-445566) zu melden.',
          },
          {
            title: 'Haftungsausschluss',
            content: 'Die Stadtwerke haften nicht für Schäden am Fahrzeug oder an Batterien, die auf fehlerhafte bordeigene Ladeelektronik oder ungeeignete Adapter zurückzuführen sind. Bei wetterbedingten Netzunterbrechungen besteht kein Anspruch auf Schadensersatz.',
          },
        ],
        items: [
          {
            id: `e${examNumber}-27`,
            number: 27,
            question: 'Wie lange darf man nach dem Ende des Ladevorgangs noch auf dem Parkplatz stehen?',
            options: {
              a: 'Höchstens dreißig Minuten.',
              b: 'Den ganzen Tag ohne Einschränkung.',
              c: 'Genau zwei Stunden.',
            },
            correctAnswer: 'a',
          },
          {
            id: `e${examNumber}-28`,
            number: 28,
            question: 'Während das Auto aufgeladen wird, ...',
            options: {
              a: 'kann jeder Passant das Ladekabel herausziehen.',
              b: 'ist das Ladekabel mechanisch verriegelt.',
              c: 'muss der Fahrer im Auto sitzen bleiben.',
            },
            correctAnswer: 'b',
          },
          {
            id: `e${examNumber}-29`,
            number: 29,
            question: 'Wann darf der rote Not-Aus-Knopf gedrückt werden?',
            options: {
              a: 'Um die Ladekarte schneller wieder herauszubekommen.',
              b: 'Ausschließlich bei akuten Gefahren.',
              c: 'Vor jedem normalen Ladevorgang.',
            },
            correctAnswer: 'b',
          },
          {
            id: `e${examNumber}-30`,
            number: 30,
            question: 'Wer haftet für Batterieschäden durch fehlerhafte Adapter?',
            options: {
              a: 'Die Stadtwerke übernehmen die Reparaturkosten vollständig.',
              b: 'Die Stadtwerke schließen jede Haftung für eigene Adapter aus.',
              c: 'Die Versicherung des Bürgermeisters.',
            },
            correctAnswer: 'b',
          },
        ],
      },
    }, {
      ...baseParams,
      theme: 'Elektromobilität & Verkehrswende',
      examNumber,
    });
  }

  // Generic fallback generator for any custom theme
  return sanitizeAndValidateExam({
    title: `Übungssatz ${numStr}: ${themePreset.title || themePreset.theme}`,
  }, {
    ...baseParams,
    theme: themePreset.theme,
    examNumber,
  });
}

/**
 * Server-backed AI Generation with robust fallback.
 */
export async function requestAIGeneratedExam(params: GenerationParams): Promise<ExamModel> {
  try {
    const response = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.exam) {
        return sanitizeAndValidateExam(data.exam, params);
      }
    }
  } catch (err) {
    console.warn('Backend /api/generate-exam call failed, activating instant B1 procedural item writer:', err);
  }

  // Find best matching preset or generate generic customized B1 exam
  const matchedPreset = THEME_PRESETS.find(p =>
    p.theme.toLowerCase().includes(params.theme.toLowerCase()) ||
    params.theme.toLowerCase().includes(p.id)
  ) || {
    id: 'custom',
    title: `Übungssatz: ${params.theme}`,
    theme: params.theme,
    description: `Originaler B1-Modellsatz zum Thema ${params.theme}`,
    category: 'Gesellschaft',
    suggestedCity: params.city || 'München',
    suggestedInstitution: params.institution || 'Goethe-Institut',
  };

  return generateCuratedB1Exam(matchedPreset, params.examNumber, params);
}
