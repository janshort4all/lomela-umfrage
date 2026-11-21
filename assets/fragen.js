/* Fragen der Lomela-Umfrage (Kurzfassung ohne die mit ○ markierten Fragen).
   Die IDs entsprechen dem Dokument „Lomela – Online-Fragebögen Musik und Hörbücher im Alter“.
   typ: "eine" = eine Antwort, "mehrere" = mehrere Antworten, "text" = Freitext (freiwillig)
   sonstiges: true = zusätzliche Antwort „Sonstiges“ mit Textfeld
   exklusiv: Antworten, die alle anderen abwählen
   max: höchstens so viele Antworten
   wenn: Frage nur zeigen, wenn eine frühere Antwort passt */

window.LOMELA_FRAGEN = {
  A: {
    seite: "pflege.html",
    titel: "Fragebogen für Pflege- und Betreuungskräfte",
    kurztitel: "Pflege und Betreuung",
    minuten: 10,
    gross: false,
    einleitung: [
      "Wir möchten verstehen, wie ältere Menschen in Einrichtungen heute Musik, Radio und Hörbücher hören und wo es dabei im Alltag hakt. Ihre Erfahrung aus der Praxis hilft uns sehr.",
      "Die Antworten fließen in die Entwicklung eines Angebots für ältere Menschen ein. Der Fragebogen dauert etwa 10 Minuten und ist anonym."
    ],
    fragen: [
      { id: "A1", teil: "Über Sie und Ihre Einrichtung", text: "Wo arbeiten Sie?", typ: "eine", sonstiges: true,
        optionen: ["Pflegeheim", "Tagespflege", "Betreutes Wohnen oder Service-Wohnen", "Ambulanter Pflegedienst", "Wohneinrichtung der Behindertenhilfe"] },
      { id: "A2", teil: "Über Sie und Ihre Einrichtung", text: "Was ist Ihre Aufgabe?", typ: "eine", sonstiges: true,
        optionen: ["Pflegefachkraft", "Pflegehilfskraft", "Betreuungskraft oder Alltagsbegleitung", "Sozialer Dienst", "Wohnbereichs- oder Pflegedienstleitung", "Einrichtungs- oder Hausleitung"] },
      { id: "A4", teil: "Über Sie und Ihre Einrichtung", text: "Wie viele Bewohner oder Klienten betreut Ihre Einrichtung?", typ: "eine",
        optionen: ["Unter 30", "30 bis 60", "61 bis 100", "Über 100", "Weiß nicht"] },
      { id: "A5", teil: "Über Sie und Ihre Einrichtung", text: "Wie viele davon haben grob geschätzt eine Demenz?", typ: "eine",
        optionen: ["Kaum jemand", "Weniger als ein Viertel", "Ein Viertel bis die Hälfte", "Mehr als die Hälfte", "Weiß nicht"] },

      { id: "A6", teil: "Musik und Hörbücher im Alltag", text: "Wo kommen bei Ihnen Musik, Radio oder Hörbücher im Alltag vor?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Kaum oder gar nicht"],
        optionen: ["Im Gemeinschaftsraum", "In einer Sing- oder Musikgruppe", "Bei Festen und Gottesdiensten", "Im Bewohnerzimmer", "Bei der Pflege, z. B. beim Waschen", "Beim Essen", "Kaum oder gar nicht"] },
      { id: "A7", teil: "Musik und Hörbücher im Alltag", text: "Wer entscheidet, was im Gemeinschaftsraum läuft?", typ: "eine", sonstiges: true,
        optionen: ["Die Bewohner", "Pflegekräfte", "Betreuungskräfte oder Sozialer Dienst", "Wer gerade da ist", "Es läuft immer derselbe Sender", "Dort läuft nichts"] },
      { id: "A8", teil: "Musik und Hörbücher im Alltag", text: "Wie viele Bewohner hören im eigenen Zimmer regelmäßig Musik, Radio oder Hörbücher?", typ: "eine",
        optionen: ["Fast keiner", "Etwa jeder Vierte", "Etwa die Hälfte", "Die meisten", "Weiß nicht"] },
      { id: "A9", teil: "Musik und Hörbücher im Alltag", text: "Bei wie vielen merken Sie, dass sie gern mehr hören würden, es aber allein nicht schaffen?", typ: "eine",
        optionen: ["Fast keiner", "Etwa jeder Vierte", "Etwa die Hälfte", "Die meisten", "Weiß nicht"] },
      { id: "A10", teil: "Musik und Hörbücher im Alltag", text: "Beschreiben Sie kurz die letzte Situation, in der Musik oder ein Hörbuch einem Bewohner geholfen hat. Oder eine, in der es hätte helfen können, aber nicht geklappt hat.", typ: "text" },

      { id: "A11", teil: "Geräte im Zimmer", text: "Welche Geräte zum Hören gibt es in den Bewohnerzimmern?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Keine", "Weiß nicht"],
        optionen: ["Radio", "CD-Player oder Kompaktanlage", "Fernseher", "Tablet", "Smartphone", "Sprachlautsprecher wie Alexa", "Musikgerät speziell für Senioren", "Keine", "Weiß nicht"] },
      { id: "A12", teil: "Geräte im Zimmer", text: "Woher kommen diese Geräte meistens?", typ: "mehrere",
        exklusiv: ["Weiß nicht"],
        optionen: ["Von Angehörigen", "Vom Bewohner selbst mitgebracht", "Von der Einrichtung", "Spende oder Förderverein", "Weiß nicht"] },
      { id: "A13", teil: "Geräte im Zimmer", text: "Was geht mit diesen Geräten am häufigsten schief?", typ: "mehrere", max: 3, sonstiges: true,
        exklusiv: ["Selten Probleme"],
        optionen: ["Sender oder Einstellung verstellt", "Bewohner findet den richtigen Knopf nicht", "Fernbedienung weg", "Batterie oder Akku leer", "Plötzlich zu laut oder zu leise", "Aus Versehen ausgeschaltet", "Stecker gezogen oder Kabel im Weg", "CD zerkratzt oder falsch eingelegt", "Gerät heruntergefallen oder kaputt", "Internet funktioniert nicht", "Selten Probleme"] },
      { id: "A14", teil: "Geräte im Zimmer", text: "Wer richtet ein neues Gerät meistens ein?", typ: "eine", sonstiges: true,
        optionen: ["Angehörige", "Pflegekräfte", "Betreuungskräfte oder Sozialer Dienst", "Haustechnik", "Der Bewohner selbst", "Niemand so richtig"] },
      { id: "A15", teil: "Geräte im Zimmer", text: "Wer hilft meistens, wenn ein Gerät nicht mehr geht?", typ: "eine", sonstiges: true,
        optionen: ["Angehörige", "Pflegekräfte", "Betreuungskräfte oder Sozialer Dienst", "Haustechnik", "Niemand, das Gerät bleibt aus"] },
      { id: "A16", teil: "Geräte im Zimmer", text: "Wie lange bleibt ein Gerät, das nicht mehr geht, meistens ungenutzt?", typ: "eine",
        optionen: ["Es wird am selben Tag gerichtet", "Bis zum nächsten Besuch der Angehörigen", "Länger als eine Woche", "Es wird gar nicht mehr genutzt", "Weiß nicht"] },
      { id: "A18", teil: "Geräte im Zimmer", text: "Gibt es Regeln für Geräte, die Angehörige mitbringen?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Keine Regeln", "Weiß nicht"],
        optionen: ["Prüfung von Elektrogeräten", "Beschriftung mit Namen", "Haftungsausschluss", "Absprache mit der Pflege", "Keine Regeln", "Weiß nicht"] },

      { id: "A19", teil: "Wer sich kümmert", text: "Wer ist bei Ihnen dafür zuständig, dass ein Bewohner seine Musik hören kann?", typ: "eine", sonstiges: true,
        optionen: ["Pflege", "Betreuung oder Sozialer Dienst", "Angehörige", "Alle ein bisschen", "Niemand so richtig"] },
      { id: "A20", teil: "Wer sich kümmert", text: "Denken Sie an Ihre letzten fünf Dienste: Wie oft haben Sie selbst Musik oder Radio für einen Bewohner angemacht, umgestellt oder gewechselt?", typ: "eine",
        optionen: ["Gar nicht", "1 bis 5 Mal", "6 bis 15 Mal", "Mehr als 15 Mal"] },
      { id: "A21", teil: "Wer sich kümmert", text: "Wie lange dauert das meistens?", typ: "eine",
        wenn: { frage: "A20", nicht: ["Gar nicht"] },
        optionen: ["Unter 1 Minute", "1 bis 5 Minuten", "Mehr als 5 Minuten"] },

      { id: "A23", teil: "Wann Musik hilft und wann sie stört", text: "In welchen Situationen setzen Sie Musik gezielt ein?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Gar nicht gezielt"],
        optionen: ["Beim Wachwerden", "Bei der Körperpflege", "Beim Essen", "Bei Unruhe am Nachmittag oder Abend", "Zum Einschlafen", "Gegen Langeweile oder Rückzug", "Zum Erinnern und Erzählen", "In der Sterbebegleitung", "Gar nicht gezielt"] },
      { id: "A24", teil: "Wann Musik hilft und wann sie stört", text: "Wie oft erleben Sie, dass Musik einen Bewohner sichtbar ruhiger oder fröhlicher macht?", typ: "eine",
        optionen: ["Fast täglich", "Mehrmals pro Woche", "Selten", "Nie", "Weiß nicht"] },
      { id: "A25", teil: "Wann Musik hilft und wann sie stört", text: "Haben Sie erlebt, dass Musik oder ein Hörbuch jemanden aufgewühlt, traurig oder unruhig gemacht hat?", typ: "eine",
        optionen: ["Ja, öfter", "Ja, selten", "Nein", "Weiß nicht"] },

      { id: "A27", teil: "Was gehört wird und woher es kommt", text: "Woher wissen Sie, welche Musik ein Bewohner mag?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Wir wissen es meistens nicht"],
        optionen: ["Aus dem Biografiebogen beim Einzug", "Vom Bewohner selbst", "Von Angehörigen", "Durch Ausprobieren und Beobachten", "Wir wissen es meistens nicht"] },
      { id: "A28", teil: "Was gehört wird und woher es kommt", text: "Was hören Ihre Bewohner am liebsten?", typ: "mehrere", sonstiges: true,
        optionen: ["Schlager", "Volkslieder", "Kirchenlieder", "Klassik", "Operette oder Oper", "Tanzmusik und Walzer", "Oldies der 60er bis 80er", "Mundart oder Plattdeutsch", "Hörbücher und Geschichten", "Hörspiele", "Gottesdienste", "Nachrichten und Gesprächsradio"] },
      { id: "A29", teil: "Was gehört wird und woher es kommt", text: "Was mögen Ihre Bewohner erfahrungsgemäß gar nicht?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Nichts davon", "Weiß nicht"],
        optionen: ["Viel Moderation", "Werbung", "Neue oder unbekannte Musik", "Englische Titel", "Laute oder schnelle Musik", "Ständige Nachrichten", "Nichts davon", "Weiß nicht"] },
      { id: "A30", teil: "Was gehört wird und woher es kommt", text: "Woher kommt die Musik ganz konkret?", typ: "mehrere", sonstiges: true,
        optionen: ["Radio", "CDs", "Handy oder Tablet von Mitarbeitenden", "YouTube", "Musikdienst wie Spotify", "Von Angehörigen bespielte Geräte", "Bücherei oder Mediathek"] },
      { id: "A31", teil: "Was gehört wird und woher es kommt", text: "Was passiert meistens, wenn sich ein Bewohner ein bestimmtes Lied wünscht?", typ: "eine", sonstiges: true,
        optionen: ["Wir spielen es gleich ab, z. B. vom Handy", "Angehörige besorgen es", "Es dauert lange oder klappt nicht", "Kommt kaum vor"] },

      { id: "A32", teil: "Hören, Sehen, Hände", text: "Was macht es Ihren Bewohnern schwer, ein Gerät selbst zu bedienen?", typ: "mehrere", max: 3, sonstiges: true,
        optionen: ["Gedächtnis oder Orientierung", "Sehen", "Hände: Kraft, Zittern, Feingefühl", "Hören", "Zu viele oder zu kleine Knöpfe", "Fernbedienung", "Bildschirme oder Menüs", "Angst, etwas kaputtzumachen"] },
      { id: "A34", teil: "Hören, Sehen, Hände", text: "Wie hören Bewohner Musik, die bettlägerig sind oder ihre Hände kaum bewegen können?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Gar nicht", "Weiß nicht"],
        optionen: ["Jemand macht ihnen das Radio an", "Ein Gerät läuft dauerhaft", "Mit Kopfhörern", "Gemeinsam bei Besuchen", "Gar nicht", "Weiß nicht"] },

      { id: "A38", teil: "Angehörige", text: "Wie bringen sich Angehörige beim Thema Musik ein?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Kaum"],
        optionen: ["Bringen Geräte mit", "Bringen Musik oder eigene Aufnahmen mit", "Stellen Geräte bei Besuchen ein", "Hören gemeinsam mit dem Bewohner", "Fragen uns um Rat, was sie mitbringen sollen", "Kaum"] },

      { id: "A40", teil: "Internet, Geld, Entscheidungen", text: "Gibt es WLAN in den Bewohnerzimmern?", typ: "eine",
        optionen: ["Ja, für Bewohner nutzbar und zuverlässig", "Ja, aber unzuverlässig", "Nur für Mitarbeitende", "Nein", "Weiß nicht"] },
      { id: "A41", teil: "Internet, Geld, Entscheidungen", text: "Wer entscheidet bei kleineren Anschaffungen bis etwa 200 € für Betreuung oder Freizeit?", typ: "eine",
        optionen: ["Betreuungskräfte oder Sozialer Dienst selbst", "Wohnbereichs- oder Pflegedienstleitung", "Einrichtungsleitung", "Träger oder Verwaltung", "Förderverein", "Weiß nicht"] },
      { id: "A42", teil: "Internet, Geld, Entscheidungen", text: "Woher kommt das Geld dafür meistens?", typ: "mehrere",
        exklusiv: ["Weiß nicht"],
        optionen: ["Budget der Einrichtung", "Förderverein", "Spenden", "Stiftungen", "Angehörige", "Weiß nicht"] },
      { id: "A43", teil: "Internet, Geld, Entscheidungen", text: "Was haben Sie zuletzt für Betreuung oder Freizeit angeschafft, und hat es sich bewährt?", typ: "text" },

      { id: "A44", teil: "Betreutes Wohnen und ambulante Dienste", text: "Wer hilft Ihren Mietern oder Klienten, wenn das Radio nicht mehr geht?", typ: "mehrere", sonstiges: true,
        wenn: { frage: "A1", in: ["Betreutes Wohnen oder Service-Wohnen", "Ambulanter Pflegedienst"] },
        exklusiv: ["Niemand"],
        optionen: ["Wir", "Angehörige", "Nachbarn", "Hausmeister", "Niemand"] },
      { id: "A45", teil: "Betreutes Wohnen und ambulante Dienste", text: "Wenn jemand geistig abbaut: Was fällt beim Hören zuerst schwer?", typ: "mehrere", sonstiges: true,
        wenn: { frage: "A1", in: ["Betreutes Wohnen oder Service-Wohnen", "Ambulanter Pflegedienst"] },
        exklusiv: ["Fällt kaum auf", "Weiß nicht"],
        optionen: ["Das Gerät einschalten", "Sender oder CD finden", "Die Lautstärke einstellen", "Die Fernbedienung bedienen", "Musik läuft zu ungewöhnlichen Zeiten", "Fällt kaum auf", "Weiß nicht"] },

      { id: "A46", teil: "Zum Schluss", text: "Was ist beim Thema Musik und Hören bei Ihren Bewohnern im Alltag das Ärgerlichste?", typ: "text" }
    ]
  },

  B: {
    seite: "alltag.html",
    titel: "Fragebogen: Musik und Radio in Ihrem Alltag",
    kurztitel: "Ältere Menschen",
    minuten: 9,
    gross: true,
    einleitung: [
      "Wir möchten wissen, wie Sie heute Musik, Radio und Hörbücher hören und was dabei gut oder schlecht klappt. Es gibt keine richtigen oder falschen Antworten.",
      "Die Antworten fließen in die Entwicklung eines Angebots für ältere Menschen ein. Der Fragebogen dauert etwa 10 Minuten und ist anonym. Gern darf Ihnen jemand beim Ausfüllen helfen."
    ],
    fragen: [
      { id: "B1", teil: "Zu Ihnen", text: "Wer füllt diesen Fragebogen aus?", typ: "eine",
        optionen: ["Ich selbst", "Ich selbst, mit Hilfe einer anderen Person", "Eine andere Person für mich, mit meinen Antworten"] },
      { id: "B2", teil: "Zu Ihnen", text: "Wie alt sind Sie?", typ: "eine",
        optionen: ["Unter 65", "65 bis 74", "75 bis 84", "85 oder älter"] },
      { id: "B3", teil: "Zu Ihnen", text: "Wie wohnen Sie?", typ: "eine", sonstiges: true,
        optionen: ["Allein in meiner Wohnung oder meinem Haus", "Mit Partner oder Familie", "Im betreuten Wohnen", "Im Pflegeheim"] },

      { id: "B4", teil: "Musik in Ihrem Leben", text: "Welche Musik hat Sie als junger Mensch begleitet?", typ: "mehrere", sonstiges: true,
        optionen: ["Schlager", "Volkslieder", "Kirchenlieder", "Klassik", "Operette oder Oper", "Tanzmusik und Walzer", "Jazz und Swing", "Rock ’n’ Roll", "Beat und Pop der 60er"] },

      { id: "B6", teil: "Ein normaler Tag", text: "An wie vielen der letzten 7 Tage lief bei Ihnen Musik, Radio oder etwas zum Zuhören?", typ: "eine",
        optionen: ["An keinem", "An 1 bis 2 Tagen", "An 3 bis 5 Tagen", "An jedem oder fast jedem Tag"] },
      { id: "B7", teil: "Ein normaler Tag", text: "Wie lange etwa an einem normalen Tag?", typ: "eine",
        optionen: ["Weniger als eine halbe Stunde", "Eine halbe Stunde bis 2 Stunden", "2 bis 4 Stunden", "Mehr als 4 Stunden"] },
      { id: "B8", teil: "Ein normaler Tag", text: "Wann hören Sie am liebsten etwas?", typ: "mehrere",
        optionen: ["Morgens", "Mittags", "Nachmittags", "Abends", "Zum Einschlafen", "Nachts, wenn ich nicht schlafen kann"] },
      { id: "B9", teil: "Ein normaler Tag", text: "Was hören Sie am liebsten?", typ: "mehrere", sonstiges: true,
        optionen: ["Musik", "Gespräche im Radio", "Nachrichten", "Geschichten und Hörbücher", "Hörspiele", "Gottesdienste"] },

      { id: "B10", teil: "Ihre Geräte", text: "Womit hören Sie?", typ: "mehrere", sonstiges: true,
        optionen: ["Radio", "CD-Player oder Stereoanlage", "Plattenspieler", "Kassettenrekorder", "Fernseher", "Smartphone", "Tablet oder Computer", "Sprachlautsprecher wie Alexa"] },
      { id: "B11", teil: "Ihre Geräte", text: "Wer hat Ihr wichtigstes Gerät ausgesucht?", typ: "eine",
        optionen: ["Ich selbst", "Jemand aus der Familie", "Jemand anderes", "Weiß ich nicht mehr"] },
      { id: "B12", teil: "Ihre Geräte", text: "Wie sind Sie zu dem Gerät gekommen?", typ: "eine", sonstiges: true,
        optionen: ["Selbst gekauft", "Geschenkt bekommen", "Aus dem Haushalt übernommen"] },
      { id: "B13", teil: "Ihre Geräte", text: "Was hat es ungefähr gekostet?", typ: "eine",
        wenn: { frage: "B12", in: ["Selbst gekauft"] },
        optionen: ["Unter 50 €", "50 bis 150 €", "150 bis 300 €", "Über 300 €", "Weiß ich nicht mehr"] },
      { id: "B14", teil: "Ihre Geräte", text: "Wer hat das Gerät eingerichtet?", typ: "eine",
        optionen: ["Ich selbst", "Jemand aus der Familie", "Jemand anderes", "Es musste nichts eingerichtet werden"] },
      { id: "B15", teil: "Ihre Geräte", text: "Was ärgert Sie an Ihren Geräten?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Nichts, alles gut"],
        optionen: ["Zu viele Knöpfe", "Knöpfe zu klein", "Schrift schwer zu lesen", "Ich finde meinen Sender nicht wieder", "Plötzlich zu laut oder zu leise", "Fernbedienung weg oder zu kompliziert", "Batterien leer", "Sprache schlecht zu verstehen", "Ich traue mich nicht, etwas zu verstellen", "Nichts, alles gut"] },
      { id: "B17", teil: "Ihre Geräte", text: "Wenn etwas nicht klappt: Was tun Sie meistens?", typ: "eine",
        optionen: ["Ich löse es selbst", "Ich rufe jemanden an", "Ich warte, bis jemand vorbeikommt", "Ich höre dann eben nichts"] },
      { id: "B18", teil: "Ihre Geräte", text: "Wie lange dauert es meistens, bis Ihnen jemand hilft?", typ: "eine",
        wenn: { frage: "B17", in: ["Ich rufe jemanden an", "Ich warte, bis jemand vorbeikommt"] },
        optionen: ["Am selben Tag", "Ein paar Tage", "Länger als eine Woche"] },

      { id: "B20", teil: "Was Sie gern hören", text: "Kommt im Radio heute noch die Musik vor, die Sie mögen?", typ: "eine",
        optionen: ["Oft", "Manchmal", "Selten", "Nie"] },
      { id: "B21", teil: "Was Sie gern hören", text: "Gibt es Lieder oder Sänger, die Sie gern mal wieder hören würden, aber nicht bekommen?", typ: "eine",
        optionen: ["Ja, öfter", "Ja, manchmal", "Nein"] },
      { id: "B22", teil: "Was Sie gern hören", text: "Was hindert Sie daran?", typ: "mehrere", sonstiges: true,
        wenn: { frage: "B21", in: ["Ja, öfter", "Ja, manchmal"] },
        optionen: ["Ich weiß nicht, wo ich sie finde", "Meine Platten oder Kassetten kann ich nicht mehr abspielen", "Mein Gerät kann das nicht", "Die Technik ist mir zu kompliziert"] },
      { id: "B23", teil: "Was Sie gern hören", text: "Welche Lieder oder Sänger würden Sie gern wieder hören?", typ: "text" },
      { id: "B24", teil: "Was Sie gern hören", text: "Haben Sie noch CDs, Platten oder Kassetten?", typ: "eine",
        optionen: ["Ja, und ich höre sie", "Ja, aber ich höre sie nicht mehr", "Nein"] },
      { id: "B26", teil: "Was Sie gern hören", text: "Hat Ihnen schon einmal jemand aus der Familie Musik zusammengestellt oder etwas für Sie aufgenommen?", typ: "eine",
        optionen: ["Ja, mehrmals", "Ja, einmal", "Nein"] },

      { id: "B27", teil: "Hören", text: "Wie gut verstehen Sie Musik und Sprache aus Ihrem Radio oder Gerät?", typ: "eine",
        optionen: ["Gut", "Es geht", "Schlecht"] },
      { id: "B28", teil: "Hören", text: "Tragen Sie ein Hörgerät?", typ: "eine",
        optionen: ["Ja, und Musik klingt damit gut", "Ja, aber Musik klingt damit nicht gut", "Nein", "Keine Angabe"] },
      { id: "B30", teil: "Hören", text: "Ist es Ihnen schon passiert, dass das Gerät plötzlich sehr laut war oder gar nicht ging und Sie nicht wussten, warum?", typ: "eine",
        optionen: ["Ja, öfter", "Ja, einmal", "Nein"] },

      { id: "B31", teil: "Musik und andere Menschen", text: "Mit wem hören Sie Musik?", typ: "mehrere", sonstiges: true,
        optionen: ["Allein", "Mit Partner oder Partnerin", "Mit Besuch", "In einer Gruppe, z. B. Seniorentreff oder Chor"] },
      { id: "B32", teil: "Musik und andere Menschen", text: "Wie halten Sie Kontakt mit Ihrer Familie, wenn sie nicht da ist?", typ: "mehrere", sonstiges: true,
        exklusiv: ["Kaum Kontakt"],
        optionen: ["Telefon", "Nachrichten auf dem Handy, z. B. WhatsApp", "Videoanrufe", "Briefe oder Karten", "Kaum Kontakt"] },

      { id: "B34", teil: "Zum Schluss", text: "Was ist das Lästigste an Musik und Radio in Ihrem Alltag?", typ: "text" },
      { id: "B35", teil: "Zum Schluss", text: "Welches Lied mögen Sie ganz besonders?", typ: "text" }
    ]
  }
};
