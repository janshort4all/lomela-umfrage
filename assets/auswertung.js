/* Lomela-Umfrage: Auswertung. Öffnet sich nur mit dem geheimen Auswertungsschlüssel. */
(function () {
  "use strict";

  var DATEN = window.LOMELA_FRAGEN;
  var CONFIG = window.LOMELA_CONFIG;
  var SONSTIGES = "Sonstiges";

  var anmeldung = document.getElementById("anmeldung");
  var form = document.getElementById("anmelde-form");
  var feld = document.getElementById("schluessel");
  var anmeldeMeldung = document.getElementById("anmelde-meldung");
  var ergebnis = document.getElementById("ergebnis");

  var zustand = { schluessel: null, zeilen: [], reiter: "A", filter: {}, geladen: null };

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "text") node.textContent = v;
        else if (k.indexOf("on") === 0) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var kind = arguments[i];
      if (kind === null || kind === undefined || kind === false) continue;
      node.appendChild(typeof kind === "string" ? document.createTextNode(kind) : kind);
    }
    return node;
  }

  function werte(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

  function datum(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) + ", " +
      d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
  }

  function prozent(teil, ganz) {
    if (!ganz) return "0 %";
    return Math.round(teil / ganz * 100) + " %";
  }

  /* ---------- Laden ---------- */

  function lade(schluessel) {
    anmeldeMeldung.hidden = true;
    return fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/lomela_auswertung", {
      method: "POST",
      headers: { "apikey": CONFIG.supabaseKey, "Content-Type": "application/json" },
      body: JSON.stringify({ schluessel: schluessel })
    }).then(function (antwort) {
      if (antwort.status === 401 || antwort.status === 403 || antwort.status === 400) {
        throw new Error("schluessel");
      }
      if (!antwort.ok) throw new Error("server");
      return antwort.json();
    }).then(function (zeilen) {
      zustand.schluessel = schluessel;
      zustand.zeilen = Array.isArray(zeilen) ? zeilen : [];
      zustand.geladen = new Date();
      anmeldung.hidden = true;
      ergebnis.hidden = false;
      zeichne();
    }).catch(function (fehler) {
      anmeldung.hidden = false;
      ergebnis.hidden = true;
      anmeldeMeldung.textContent = fehler.message === "schluessel"
        ? "Der Schlüssel passt nicht. Bitte prüfen Sie ihn und versuchen Sie es noch einmal."
        : "Die Auswertung konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung.";
      anmeldeMeldung.hidden = false;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var s = feld.value.trim();
    if (s) lade(s);
  });

  /* ---------- Auswerten ---------- */

  function gefiltert(kennung) {
    var filter = zustand.filter[kennung] || {};
    return zustand.zeilen.filter(function (z) {
      if (z.fragebogen !== kennung) return false;
      return Object.keys(filter).every(function (fid) {
        var soll = filter[fid];
        if (!soll) return true;
        return werte(z.antworten[fid]).indexOf(soll) !== -1;
      });
    });
  }

  function median(zahlen) {
    var z = zahlen.filter(function (x) { return typeof x === "number"; }).sort(function (a, b) { return a - b; });
    if (!z.length) return null;
    var m = Math.floor(z.length / 2);
    return z.length % 2 ? z[m] : Math.round((z[m - 1] + z[m]) / 2);
  }

  function zeichne() {
    ergebnis.innerHTML = "";
    var alle = zustand.zeilen;
    var anzahlA = alle.filter(function (z) { return z.fragebogen === "A"; }).length;
    var anzahlB = alle.filter(function (z) { return z.fragebogen === "B"; }).length;
    var letzte = alle.length ? alle[alle.length - 1].erstellt : null;
    var dauer = median(alle.map(function (z) { return z.dauer; }));

    var basis = location.href.replace(/[#?].*$/, "").replace(/auswertung\.html$/, "");

    ergebnis.appendChild(el("div", { class: "auswertung-kopf" },
      el("div", null,
        el("h1", { class: "titel", text: "Auswertung" }),
        el("p", { class: "stand", text: "Stand: " + datum(zustand.geladen.toISOString()) })
      ),
      el("button", { type: "button", class: "knopf knopf-leise", text: "Aktualisieren", onclick: function () { lade(zustand.schluessel); } })
    ));

    ergebnis.appendChild(el("dl", { class: "kennzahlen" },
      el("div", null, el("dt", { text: "Pflege und Betreuung" }), el("dd", { text: String(anzahlA) })),
      el("div", null, el("dt", { text: "Ältere Menschen" }), el("dd", { text: String(anzahlB) })),
      el("div", null, el("dt", { text: "Mittlere Dauer" }), el("dd", { text: dauer === null ? "–" : Math.max(1, Math.round(dauer / 60)) + " Min." })),
      el("div", null, el("dt", { text: "Letzte Antwort" }), el("dd", { class: "klein", text: letzte ? datum(letzte) : "–" }))
    ));

    var links = el("div", { class: "verteilen" },
      el("h2", { text: "Links zum Verteilen" }),
      linkZeile("Pflege und Betreuung", basis + "pflege.html"),
      linkZeile("Ältere Menschen", basis + "alltag.html"),
      linkZeile("Startseite mit beiden", basis)
    );
    ergebnis.appendChild(links);

    var reiter = el("div", { class: "reiter", role: "tablist", "aria-label": "Ansicht" });
    [
      { k: "A", text: "Pflege und Betreuung (" + anzahlA + ")" },
      { k: "B", text: "Ältere Menschen (" + anzahlB + ")" },
      { k: "einzeln", text: "Einzelne Antworten" }
    ].forEach(function (r) {
      var aktiv = zustand.reiter === r.k;
      reiter.appendChild(el("button", {
        type: "button", role: "tab", "aria-selected": aktiv ? "true" : "false",
        class: aktiv ? "aktiv" : null,
        text: r.text,
        onclick: function () { zustand.reiter = r.k; zustand.meldung = null; zeichne(); }
      }));
    });
    ergebnis.appendChild(reiter);

    if (zustand.reiter === "einzeln") zeichneEinzelne();
    else zeichneFragebogen(zustand.reiter);
  }

  /* ---------- Einzelne Antworten ansehen und löschen ---------- */

  function antwortText(f, z) {
    var a = z.antworten[f.id];
    if (a === undefined || a === null || a === "") return null;
    var text = Array.isArray(a) ? a.join(", ") : String(a);
    var sonst = z.antworten[f.id + "_sonstiges"];
    if (sonst) text += " (Sonstiges: " + sonst + ")";
    return text;
  }

  function zeichneEinzelne() {
    zustand.auswahl = zustand.auswahl || {};
    var bereich = el("section", { class: "einzelne", role: "tabpanel" });
    var zeilen = zustand.zeilen.slice().reverse();

    // Auswahl auf vorhandene Antworten begrenzen
    var vorhanden = {};
    zeilen.forEach(function (z) { vorhanden[z.id] = true; });
    Object.keys(zustand.auswahl).forEach(function (id) { if (!vorhanden[id]) delete zustand.auswahl[id]; });

    bereich.appendChild(el("p", { text: "Hier steht jede Antwort einzeln, die neueste zuerst. Testantworten wählen Sie aus und löschen sie. Gelöschte Antworten lassen sich nicht wiederherstellen." }));

    if (zustand.meldung) bereich.appendChild(el("p", { class: "erfolg", role: "status", text: zustand.meldung }));

    if (!zeilen.length) {
      bereich.appendChild(el("p", { class: "leer", text: "Es gibt keine Antworten." }));
      ergebnis.appendChild(bereich);
      return;
    }

    var anzahlGewaehlt = function () { return Object.keys(zustand.auswahl).length; };
    var loeschKnopf = el("button", { type: "button", class: "knopf knopf-loeschen" });
    var bestaetigung = el("div", { class: "bestaetigung", hidden: true });
    var alleBox = el("input", { type: "checkbox", id: "alle-waehlen" });

    function aktualisiere() {
      var n = anzahlGewaehlt();
      loeschKnopf.textContent = n ? "Ausgewählte löschen (" + n + ")" : "Ausgewählte löschen";
      loeschKnopf.disabled = n === 0;
      alleBox.checked = n === zeilen.length;
      alleBox.indeterminate = n > 0 && n < zeilen.length;
      if (!n) bestaetigung.hidden = true;
    }

    alleBox.addEventListener("change", function () {
      zustand.auswahl = {};
      if (alleBox.checked) zeilen.forEach(function (z) { zustand.auswahl[z.id] = true; });
      liste.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = alleBox.checked; });
      aktualisiere();
    });

    loeschKnopf.addEventListener("click", function () {
      var n = anzahlGewaehlt();
      bestaetigung.innerHTML = "";
      var ja = el("button", { type: "button", class: "knopf knopf-loeschen", text: "Ja, endgültig löschen" });
      var nein = el("button", { type: "button", class: "knopf knopf-leise", text: "Abbrechen", onclick: function () { bestaetigung.hidden = true; loeschKnopf.focus(); } });
      var fehler = el("p", { class: "meldung", role: "alert", hidden: true });
      ja.addEventListener("click", function () {
        ja.disabled = true;
        ja.textContent = "Wird gelöscht …";
        loesche(Object.keys(zustand.auswahl)).then(function (geloescht) {
          zustand.auswahl = {};
          zustand.meldung = geloescht === 1 ? "1 Antwort gelöscht." : geloescht + " Antworten gelöscht.";
          return lade(zustand.schluessel);
        }).catch(function () {
          ja.disabled = false;
          ja.textContent = "Ja, endgültig löschen";
          fehler.textContent = "Das Löschen hat nicht geklappt. Bitte prüfen Sie die Internetverbindung und versuchen Sie es noch einmal.";
          fehler.hidden = false;
        });
      });
      bestaetigung.appendChild(el("p", null, el("strong", { text: (n === 1 ? "1 Antwort" : n + " Antworten") + " endgültig löschen?" })));
      bestaetigung.appendChild(el("div", { class: "bestaetigung-knoepfe" }, ja, nein));
      bestaetigung.appendChild(fehler);
      bestaetigung.hidden = false;
      nein.focus();
    });

    bereich.appendChild(el("div", { class: "werkzeugleiste" },
      el("label", { "for": "alle-waehlen", class: "alle" }, alleBox, " Alle auswählen"),
      loeschKnopf
    ));
    bereich.appendChild(bestaetigung);

    var liste = el("ul", { class: "antwort-liste" });
    zeilen.forEach(function (z) {
      var fb = DATEN[z.fragebogen];
      var cb = el("input", { type: "checkbox", id: "w-" + z.id });
      cb.checked = !!zustand.auswahl[z.id];
      cb.addEventListener("change", function () {
        if (cb.checked) zustand.auswahl[z.id] = true;
        else delete zustand.auswahl[z.id];
        aktualisiere();
      });

      var kurz = [];
      fb.fragen.slice(0, 4).forEach(function (f) {
        var t = antwortText(f, z);
        if (t && f.typ !== "text") kurz.push(t);
      });
      var beantwortet = fb.fragen.filter(function (f) { return antwortText(f, z); }).length;

      var details = el("details", null, el("summary", { text: "Alle Antworten ansehen" }));
      var dl = el("dl", { class: "antwort-details" });
      fb.fragen.forEach(function (f) {
        var t = antwortText(f, z);
        if (!t) return;
        dl.appendChild(el("dt", null, el("span", { class: "frage-id", text: f.id }), " " + f.text));
        dl.appendChild(el("dd", { text: t }));
      });
      if (!dl.childNodes.length) dl.appendChild(el("dd", { text: "Alle Fragen übersprungen." }));
      details.appendChild(dl);

      liste.appendChild(el("li", { class: "antwort" },
        el("label", { "for": "w-" + z.id, class: "antwort-kopf" },
          cb,
          el("span", { class: "antwort-titel" },
            el("strong", { text: fb.kurztitel }),
            el("span", { text: datum(z.erstellt) + (z.dauer ? ", " + Math.max(1, Math.round(z.dauer / 60)) + " Min." : "") })
          )
        ),
        el("p", { class: "antwort-kurz", text: beantwortet + " Fragen beantwortet" + (kurz.length ? ": " + kurz.join(" / ") : "") }),
        details
      ));
    });
    bereich.appendChild(liste);
    ergebnis.appendChild(bereich);
    aktualisiere();
  }

  function loesche(ids) {
    return fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/lomela_loeschen", {
      method: "POST",
      headers: { "apikey": CONFIG.supabaseKey, "Content-Type": "application/json" },
      body: JSON.stringify({ schluessel: zustand.schluessel, antwort_ids: ids })
    }).then(function (antwort) {
      if (!antwort.ok) throw new Error("server");
      return antwort.json();
    });
  }

  function linkZeile(name, url) {
    var meldung = el("span", { class: "kopiert", role: "status" });
    return el("div", { class: "link-zeile" },
      el("span", { class: "link-name", text: name }),
      el("a", { href: url, text: url }),
      el("button", {
        type: "button", class: "knopf-klein", text: "Kopieren",
        onclick: function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              meldung.textContent = "Kopiert";
              setTimeout(function () { meldung.textContent = ""; }, 2000);
            }, function () { meldung.textContent = "Bitte von Hand kopieren"; });
          } else {
            meldung.textContent = "Bitte von Hand kopieren";
          }
        }
      }),
      meldung
    );
  }

  function zeichneFragebogen(kennung) {
    var fb = DATEN[kennung];
    var bereich = el("section", { class: "fragebogen-ergebnis", role: "tabpanel" });

    var filterFrage = kennung === "A" ? ["A1"] : ["B3", "B1"];
    var filterZeile = el("div", { class: "filter" });
    filterFrage.forEach(function (fid) {
      var f = fb.fragen.filter(function (x) { return x.id === fid; })[0];
      var auswahl = el("select", {
        id: "filter-" + fid,
        onchange: function (e) {
          zustand.filter[kennung] = zustand.filter[kennung] || {};
          zustand.filter[kennung][fid] = e.target.value;
          zeichne();
        }
      });
      auswahl.appendChild(el("option", { value: "", text: "Alle" }));
      f.optionen.concat(f.sonstiges ? [SONSTIGES] : []).forEach(function (o) {
        var opt = el("option", { value: o, text: o });
        if ((zustand.filter[kennung] || {})[fid] === o) opt.selected = true;
        auswahl.appendChild(opt);
      });
      filterZeile.appendChild(el("label", { "for": "filter-" + fid },
        el("span", { text: fid === "A1" ? "Einrichtung" : fid === "B3" ? "Wohnform" : "Ausgefüllt von" }), auswahl));
    });

    var zeilen = gefiltert(kennung);
    filterZeile.appendChild(el("button", {
      type: "button", class: "knopf knopf-leise", text: "Als CSV herunterladen",
      onclick: function () { csv(kennung, zeilen); }
    }));
    bereich.appendChild(filterZeile);

    if (!zeilen.length) {
      bereich.appendChild(el("p", { class: "leer", text: zustand.zeilen.some(function (z) { return z.fragebogen === kennung; })
        ? "Für diese Auswahl gibt es keine Antworten."
        : "Noch keine Antworten. Sobald jemand den Fragebogen absendet, erscheint das Ergebnis hier." }));
      ergebnis.appendChild(bereich);
      return;
    }

    bereich.appendChild(el("p", { class: "basis", text: zeilen.length + (zeilen.length === 1 ? " Antwort" : " Antworten") + " in dieser Auswahl." }));

    fb.fragen.forEach(function (f) {
      var block = el("article", { class: "ergebnis-frage" },
        el("div", { class: "frage-kopf" },
          el("span", { class: "frage-id", text: f.id }),
          el("h3", { text: f.text })
        )
      );
      var beantwortet = zeilen.filter(function (z) {
        var a = z.antworten[f.id];
        return f.typ === "text" ? (typeof a === "string" && a.trim()) : werte(a).length > 0;
      });

      if (f.typ === "text") {
        block.appendChild(el("p", { class: "basis", text: beantwortet.length + " von " + zeilen.length + " haben etwas geschrieben." }));
        if (beantwortet.length) {
          var liste = el("ul", { class: "freitexte" });
          beantwortet.slice().reverse().forEach(function (z) {
            liste.appendChild(el("li", null, el("p", { text: z.antworten[f.id] }), el("span", { text: datum(z.erstellt) })));
          });
          block.appendChild(liste);
        }
        bereich.appendChild(block);
        return;
      }

      var zaehler = {};
      var reihenfolge = f.optionen.slice();
      if (f.sonstiges) reihenfolge.push(SONSTIGES);
      beantwortet.forEach(function (z) {
        werte(z.antworten[f.id]).forEach(function (w) {
          zaehler[w] = (zaehler[w] || 0) + 1;
          if (reihenfolge.indexOf(w) === -1) reihenfolge.push(w);
        });
      });

      var hinweis = f.typ === "mehrere" ? " Mehrfachnennung, Prozent bezogen auf alle, die geantwortet haben." : "";
      block.appendChild(el("p", { class: "basis", text: beantwortet.length + " von " + zeilen.length + " haben geantwortet." + hinweis }));

      var balken = el("div", { class: "balken-liste" });
      reihenfolge.forEach(function (o) {
        var n = zaehler[o] || 0;
        var anteil = beantwortet.length ? n / beantwortet.length : 0;
        var fuellung = el("span");
        fuellung.style.width = (anteil * 100).toFixed(1) + "%";
        balken.appendChild(el("div", { class: "balken-zeile" + (n ? "" : " null") },
          el("span", { class: "balken-name", text: o }),
          el("span", { class: "balken", "aria-hidden": "true" }, fuellung),
          el("span", { class: "balken-wert", text: n + " (" + prozent(n, beantwortet.length) + ")" })
        ));
      });
      block.appendChild(balken);

      if (f.sonstiges) {
        var texte = zeilen.map(function (z) { return z.antworten[f.id + "_sonstiges"]; }).filter(Boolean);
        if (texte.length) {
          var details = el("details", { class: "sonstiges-liste" },
            el("summary", { text: "Sonstiges: " + texte.length + (texte.length === 1 ? " Angabe" : " Angaben") }));
          var ul = el("ul");
          texte.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
          details.appendChild(ul);
          block.appendChild(details);
        }
      }
      bereich.appendChild(block);
    });

    ergebnis.appendChild(bereich);
  }

  /* ---------- CSV ---------- */

  function csvFeld(v) {
    var s = v === null || v === undefined ? "" : String(v);
    if (/[";\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function csv(kennung, zeilen) {
    var fb = DATEN[kennung];
    var spalten = [];
    fb.fragen.forEach(function (f) {
      spalten.push(f.id);
      if (f.sonstiges) spalten.push(f.id + "_sonstiges");
    });
    var kopfzeile = ["Fragebogen", "Abgesendet", "Dauer (Sekunden)"].concat(spalten);
    var text = [kopfzeile.map(csvFeld).join(";")];
    zeilen.forEach(function (z) {
      var reihe = [z.fragebogen, datum(z.erstellt), z.dauer];
      spalten.forEach(function (s) {
        var a = z.antworten[s];
        reihe.push(Array.isArray(a) ? a.join(" | ") : a);
      });
      text.push(reihe.map(csvFeld).join(";"));
    });
    var blob = new Blob(["﻿" + text.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "lomela-umfrage-" + (kennung === "A" ? "pflege" : "aeltere-menschen") + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------- Start ---------- */

  var hash = location.hash || "";
  if (hash.indexOf("#k=") === 0) {
    lade(decodeURIComponent(hash.slice(3)));
  } else {
    anmeldung.hidden = false;
  }
})();
