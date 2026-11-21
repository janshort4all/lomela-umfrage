# Lomela – Umfrage zum Hören im Alter

Anonyme Online-Umfrage mit zwei Fragebögen:

- `pflege.html` – für Pflege- und Betreuungskräfte
- `alltag.html` – für ältere Menschen
- `auswertung.html` – Auswertung, öffnet sich nur mit dem Auswertungsschlüssel

Die Seite ist statisch und läuft auf GitHub Pages. Die Antworten landen in einer Supabase-Datenbank in Frankfurt. Der Schlüssel in `assets/config.js` ist ein öffentlicher Schlüssel: Er erlaubt nur das Einreichen von Antworten, nicht das Lesen.

Die Fragen stehen in `assets/fragen.js`. Schrift: Atkinson Hyperlegible Next (SIL Open Font License, siehe `assets/fonts/OFL.txt`).
