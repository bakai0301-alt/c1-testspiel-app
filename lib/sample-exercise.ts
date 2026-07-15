import type { Exercise } from "./types";

export const sampleExercise: Exercise = {
  id: "demo-mikromobilitaet",
  title: "Wem gehört die Stadt?",
  subtitle:
    "Wie neue Mobilitätsformen den öffentlichen Raum verändern – und warum die Debatte weit über E-Scooter hinausgeht.",
  topic: "Stadt & Mobilität",
  level: "C1",
  estimatedMinutes: 8,
  createdAt: "2026-07-16T00:00:00.000Z",
  paragraphs: [
    "Wer an einem Sommermorgen durch eine deutsche Großstadt fährt, begegnet einer erstaunlichen Vielfalt an Verkehrsmitteln. Neben Autos, Bussen und Fahrrädern prägen inzwischen Lastenräder, Leihroller und elektrisch unterstützte Kleinfahrzeuge das Straßenbild. Diese Entwicklung wird häufig als bloßer Wandel individueller Vorlieben beschrieben. Tatsächlich berührt sie jedoch eine grundlegendere Frage: Nach welchen Kriterien wird der begrenzte öffentliche Raum verteilt?",
    "Über Jahrzehnte orientierte sich die Stadtplanung vor allem am fließenden und ruhenden Autoverkehr. Breite Fahrbahnen und Parkplätze galten als Voraussetzung wirtschaftlicher Modernität. Fußwege und Aufenthaltsflächen mussten sich in die verbleibenden Zwischenräume einfügen. Dieses Modell gerät inzwischen unter Druck. Nicht nur klimapolitische Ziele, sondern auch steigende Einwohnerzahlen und veränderte Lebensweisen zwingen Kommunen dazu, bestehende Flächen neu zu bewerten.",
    "Befürworter einer Neuaufteilung argumentieren, dass ein privates Auto unverhältnismäßig viel Raum beanspruche, obwohl es im Durchschnitt den größten Teil des Tages ungenutzt stehe. Sie fordern deshalb geschützte Radwege, breitere Gehwege und sogenannte Mobilitätsstationen, an denen verschiedene Verkehrsmittel gebündelt werden. Eine solche Infrastruktur könne Menschen dazu bewegen, je nach Strecke flexibel zwischen Bahn, Fahrrad und Leihfahrzeug zu wechseln.",
    "Kritiker wenden ein, diese Vorstellung sei stark von den Lebensbedingungen gut angebundener Innenstadtbewohner geprägt. Wer am Stadtrand arbeite, Kinder transportiere oder körperlich eingeschränkt sei, könne nicht ohne Weiteres auf ein Auto verzichten. Außerdem führten kurzfristig eingerichtete Radspuren mitunter zu unübersichtlichen Kreuzungen und längeren Lieferwegen. Eine gerechte Verkehrspolitik dürfe daher nicht lediglich ein Verkehrsmittel gegen ein anderes austauschen.",
    "Besonders sichtbar wird der Konflikt am Beispiel der Leihroller. Einerseits schließen sie auf kurzen Strecken eine Lücke zwischen Haustür und Bahnhof. Andererseits werden sie häufig so abgestellt, dass sie Gehwege blockieren. Mehrere Städte haben deshalb feste Abstellflächen eingerichtet oder die Zahl der Anbieter begrenzt. Erste Auswertungen deuten darauf hin, dass klare Regeln die Situation verbessern können. Ob Leihroller dadurch dauerhaft einen nennenswerten Beitrag zur Verkehrswende leisten, bleibt allerdings offen.",
    "Die entscheidende Veränderung besteht möglicherweise weniger in einem bestimmten Verkehrsmittel als in einem neuen Planungsprinzip. Statt Straßen ausschließlich als Transportkorridore zu behandeln, betrachten manche Kommunen sie als vielseitige öffentliche Räume. Dort können Menschen unterwegs sein, sich begegnen, Handel treiben oder sich ausruhen. Diese Funktionen gegeneinander abzuwägen, ist zwangsläufig politisch. Gerade deshalb lässt sich die Zukunft urbaner Mobilität nicht allein mit technischen Innovationen beantworten.",
  ],
  mcq: [
    {
      question: "Welche zentrale These entwickelt der Text?",
      options: [
        "Leihroller werden das Auto langfristig vollständig ersetzen.",
        "Neue Verkehrsmittel machen eine politische Neuverteilung des Stadtraums sichtbar.",
        "Deutsche Kommunen investieren zu wenig in technische Innovationen.",
        "Innenstadtbewohner lehnen neue Mobilitätsformen überwiegend ab.",
      ],
      correctIndex: 1,
      explanation:
        "Der Text nutzt neue Mobilitätsformen als Ausgangspunkt für die übergeordnete Frage, wie begrenzter öffentlicher Raum verteilt wird.",
    },
    {
      question: "Welche Einschränkung der autofreien Planung nennt der Text?",
      options: [
        "Sie ist gesetzlich nur in Innenstädten möglich.",
        "Sie erhöht grundsätzlich die Kosten des öffentlichen Verkehrs.",
        "Sie berücksichtigt bestimmte Lebenslagen und Randlagen möglicherweise zu wenig.",
        "Sie setzt voraus, dass Leihroller vollständig verboten werden.",
      ],
      correctIndex: 2,
      explanation:
        "Genannt werden unter anderem Arbeit am Stadtrand, Kindertransport und körperliche Einschränkungen.",
    },
    {
      question: "Was versteht der Text unter einem neuen Planungsprinzip?",
      options: [
        "Straßen sollen mehrere gesellschaftliche Funktionen erfüllen.",
        "Jede Straße soll für genau ein Verkehrsmittel reserviert werden.",
        "Technische Lösungen sollen politische Entscheidungen ersetzen.",
        "Der Handel soll Vorrang vor dem Verkehr erhalten.",
      ],
      correctIndex: 0,
      explanation:
        "Straßen werden nicht nur als Transportwege, sondern auch als Orte der Begegnung, des Handels und der Erholung betrachtet.",
    },
  ],
  evidence: [
    {
      statement:
        "Die deutsche Stadtplanung richtete sich lange vorrangig nach den Bedürfnissen des Autoverkehrs.",
      correctAnswer: "richtig",
      explanation: "Diese historische Ausrichtung wird im zweiten Absatz ausdrücklich beschrieben.",
    },
    {
      statement:
        "Die Mehrheit der Leihroller-Nutzer fährt seit der Einführung weniger mit öffentlichen Verkehrsmitteln.",
      correctAnswer: "nicht_im_text",
      explanation: "Der Text enthält keine Daten zum vorherigen Verkehrsverhalten der Nutzer.",
    },
    {
      statement:
        "Feste Abstellflächen haben nach ersten Auswertungen keinerlei Wirkung gezeigt.",
      correctAnswer: "falsch",
      explanation: "Erste Auswertungen deuten vielmehr auf eine Verbesserung durch klare Regeln hin.",
    },
  ],
  vocabulary: [
    {
      term: "beanspruchen",
      article: "—",
      meaningEn: "to take up; to claim",
      example: "Ein parkendes Auto beansprucht einen Teil des öffentlichen Raums.",
    },
    {
      term: "die Neuaufteilung",
      article: "die",
      meaningEn: "reallocation",
      example: "Die Neuaufteilung der Straße wird kontrovers diskutiert.",
    },
    {
      term: "abwägen",
      article: "—",
      meaningEn: "to weigh up",
      example: "Die Interessen verschiedener Gruppen müssen gegeneinander abgewogen werden.",
    },
    {
      term: "mitunter",
      article: "—",
      meaningEn: "at times; occasionally",
      example: "Provisorische Lösungen führen mitunter zu neuen Problemen.",
    },
    {
      term: "nennenswert",
      article: "—",
      meaningEn: "significant; noteworthy",
      example: "Der Effekt blieb bislang nicht nennenswert.",
    },
    {
      term: "der Einwand",
      article: "der",
      meaningEn: "objection",
      example: "Der Einwand lässt sich nicht vollständig entkräften.",
    },
  ],
  vocabularyQuiz: [
    {
      sentence: "Eine verantwortliche Politik muss unterschiedliche Bedürfnisse sorgfältig ____.",
      options: ["abwägen", "beanspruchen", "bündeln", "verzichten"],
      correctIndex: 0,
      explanation: "„Bedürfnisse abwägen“ bedeutet, ihre Bedeutung vergleichend zu beurteilen.",
    },
    {
      sentence: "Die neue Regelung hatte bislang keinen ____ Einfluss auf den Autoverkehr.",
      options: ["ruhenden", "nennenswerten", "verbleibenden", "fließenden"],
      correctIndex: 1,
      explanation: "„Nennenswert“ bezeichnet etwas, das deutlich oder bedeutend genug ist.",
    },
  ],
};
