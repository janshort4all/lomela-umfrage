/* Lomela-Umfrage: eine Frage pro Bildschirm, Antworten werden anonym abgeschickt. */
(function () {
  "use strict";

  var DATEN = window.LOMELA_FRAGEN;
  var CONFIG = window.LOMELA_CONFIG;
  var schluessel = document.body.getAttribute("data-fragebogen");
  var FB = DATEN[schluessel];
  var buehne = document.getElementById("buehne");
  var zaehler = document.getElementById("zaehler");
  var balken = document.getElementById("fortschritt-balken");
  var SONSTIGES = "Sonstiges";
  var BUCHSTABEN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var NS = "http://www.w3.org/2000/svg";

  if (FB.gross) document.body.classList.add("gross");

  var zustand = {
    antworten: {},
    sonstiges: {},
    schritt: "start",
    beginn: null,
    gesendet: false,
    sendet: false,
    falle: "",
    aktuell: null
  };

  /* ---------- Hilfsfunktionen ---------- */

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

  function svg(viewBox, pfade, klasse, attrs) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", viewBox);
    s.setAttribute("aria-hidden", "true");
    if (klasse) s.setAttribute("class", klasse);
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    pfade.forEach(function (p) {
      var node = document.createElementNS(NS, p.tag || "path");
      Object.keys(p).forEach(function (k) { if (k !== "tag") node.setAttribute(k, p[k]); });
      s.appendChild(node);
    });
    return s;
  }

  var icon = {
    pfeilRechts: function () {
      return svg("0 0 24 24", [{ d: "M5 12h13M13 6l6 6-6 6" }], null,
        { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" });
    },
    pfeilLinks: function () {
      return svg("0 0 24 24", [{ d: "M19 12H6M11 6l-6 6 6 6" }], null,
        { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" });
    },
    haken: function () {
      return svg("0 0 24 24", [{ tag: "circle", cx: "12", cy: "12", r: "11", fill: "#D17E49" }, { d: "M7 12.5l3.2 3.2L17 9", fill: "none", stroke: "#2E2824", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round" }], "haken");
    },
    impulse: function () {
      return svg("0 0 24 24", [{ d: "M8.5 9 L10.2 2.6" }, { d: "M12.6 10.6 L18.4 4.4" }, { d: "M14.6 14.4 L21.4 11" }], "impulse");
    },
    fakt: function (art) {
      var rahmen = { tag: "rect", x: "0", y: "0", width: "40", height: "40", rx: "12", fill: "#F1EAE0" };
      var strich = { fill: "none", stroke: "#A35426", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" };
      var pfade = {
        uhr: [rahmen, Object.assign({ tag: "circle", cx: "20", cy: "20", r: "9" }, strich), Object.assign({ d: "M20 15v5l3 2" }, strich)],
        schloss: [rahmen, Object.assign({ tag: "rect", x: "13", y: "18", width: "14", height: "10", rx: "2.5" }, strich), Object.assign({ d: "M16 18v-3a4 4 0 0 1 8 0v3" }, strich)],
        frei: [rahmen, Object.assign({ d: "M13 20.5l4.5 4.5L27 15.5" }, strich)]
      };
      return svg("0 0 40 40", pfade[art]);
    }
  };

  function werte(v) {
    if (Array.isArray(v)) return v;
    return v ? [v] : [];
  }

  function istSichtbar(f) {
    if (!f.wenn) return true;
    var a = werte(zustand.antworten[f.wenn.frage]);
    if (f.wenn["in"]) return a.some(function (x) { return f.wenn["in"].indexOf(x) !== -1; });
    if (f.wenn.nicht) return a.length > 0 && !a.some(function (x) { return f.wenn.nicht.indexOf(x) !== -1; });
    return true;
  }

  function sichtbareFragen() { return FB.fragen.filter(istSichtbar); }

  function frageNachId(id) {
    for (var i = 0; i < FB.fragen.length; i++) if (FB.fragen[i].id === id) return FB.fragen[i];
    return null;
  }

  function istBeantwortet(f) {
    var a = zustand.antworten[f.id];
    if (f.typ === "text") return typeof a === "string" && a.trim() !== "";
    return werte(a).length > 0;
  }

  function hatAngefangen() {
    return Object.keys(zustand.antworten).some(function (k) { return werte(zustand.antworten[k]).length > 0; });
  }

  /* ---------- Fortschritt ---------- */

  function zeigeFortschritt(nr, gesamt, voll) {
    if (voll) {
      balken.style.width = "100%";
      zaehler.textContent = "";
      return;
    }
    if (!nr) {
      balken.style.width = "0";
      zaehler.textContent = "";
      return;
    }
    balken.style.width = Math.round((nr - 1) / gesamt * 100) + "%";
    zaehler.textContent = "Frage " + nr + " von " + gesamt;
  }

  /* ---------- Navigation ---------- */

  function gehe(schritt, ohneVerlauf) {
    if (zustand.gesendet && schritt !== "danke") schritt = "danke";
    zustand.schritt = schritt;
    if (!ohneVerlauf) {
      try { history.pushState({ schritt: schritt }, ""); } catch (e) { /* ohne Verlauf weiter */ }
    }
    zeichne();
  }

  window.addEventListener("popstate", function (e) {
    var s = e.state && e.state.schritt ? e.state.schritt : "start";
    if (zustand.gesendet) s = "danke";
    zustand.schritt = s;
    zeichne();
  });

  window.addEventListener("beforeunload", function (e) {
    if (!zustand.gesendet && hatAngefangen()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  function weiter() {
    var liste = sichtbareFragen();
    if (zustand.schritt === "start") {
      if (!zustand.beginn) zustand.beginn = Date.now();
      gehe(liste[0].id);
      return;
    }
    var idx = liste.map(function (f) { return f.id; }).indexOf(zustand.schritt);
    if (idx === -1 || idx + 1 >= liste.length) gehe("ende");
    else gehe(liste[idx + 1].id);
  }

  function zurueck() {
    var liste = sichtbareFragen();
    if (zustand.schritt === "ende") { gehe(liste[liste.length - 1].id); return; }
    var idx = liste.map(function (f) { return f.id; }).indexOf(zustand.schritt);
    if (idx <= 0) gehe("start");
    else gehe(liste[idx - 1].id);
  }

  /* ---------- Tastatur ---------- */

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.metaKey && e.key !== "Enter" || e.ctrlKey && e.key !== "Enter") return;
    var f = zustand.aktuell;
    var ziel = e.target;
    var inFeld = ziel && (ziel.tagName === "TEXTAREA" || (ziel.tagName === "INPUT" && ziel.type === "text"));

    if (e.key === "Enter") {
      if (!f) return;
      if (ziel && ziel.tagName === "TEXTAREA" && !(e.ctrlKey || e.metaKey)) return;
      if (ziel && ziel.tagName === "BUTTON") return;
      e.preventDefault();
      weiter();
      return;
    }
    if (!f || inFeld || f.typ === "text" || e.key.length !== 1) return;
    var i = BUCHSTABEN.indexOf(e.key.toUpperCase());
    var eingaben = buehne.querySelectorAll(".option input");
    if (i >= 0 && i < eingaben.length && !eingaben[i].disabled) {
      e.preventDefault();
      eingaben[i].click();
    }
  });

  /* ---------- Zeichnen ---------- */

  function zeichne() {
    buehne.innerHTML = "";
    zustand.aktuell = null;
    var s = zustand.schritt;
    if (s === "start") zeichneStart();
    else if (s === "ende") zeichneEnde();
    else if (s === "danke") zeichneDanke();
    else {
      var f = frageNachId(s);
      if (!f || !istSichtbar(f)) { zustand.schritt = "start"; zeichneStart(); }
      else zeichneFrage(f);
    }
    window.scrollTo(0, 0);
    var ziel = document.getElementById("ueberschrift");
    if (ziel) {
      try { ziel.focus({ preventScroll: true }); } catch (e) { ziel.focus(); }
    }
  }

  function zeichneStart() {
    zeigeFortschritt(0);
    var falle = el("input", {
      type: "text", name: "webseite", id: "webseite", tabindex: "-1", autocomplete: "off",
      oninput: function (e) { zustand.falle = e.target.value; }
    });
    var start = el("button", { type: "button", class: "knopf knopf-haupt", onclick: weiter }, "Einverstanden, los geht’s", icon.pfeilRechts());
    buehne.appendChild(el("div", { class: "schritt" },
      el("span", { class: "chip", text: "Etwa " + FB.minuten + " Minuten" }),
      el("h1", { id: "ueberschrift", tabindex: "-1", class: "titel", text: FB.titel }),
      el("p", { class: "vorspann", text: FB.einleitung[0] }),
      FB.einleitung[1] ? el("p", { text: FB.einleitung[1] }) : null,
      el("ul", { class: "fakten" },
        el("li", null, icon.fakt("uhr"), el("div", null, el("strong", { text: "Eine Frage pro Seite" }), el("span", { text: "Mit „Zurück“ können Sie jederzeit etwas ändern." }))),
        el("li", null, icon.fakt("schloss"), el("div", null, el("strong", { text: "Anonym" }), el("span", { text: "Kein Name, keine Cookies, keine Werbung." }))),
        el("li", null, icon.fakt("frei"), el("div", null, el("strong", { text: "Freiwillig" }), el("span", { text: "Jede Frage lässt sich überspringen." })))
      ),
      el("label", { class: "falle", "aria-hidden": "true" }, "Bitte leer lassen ", falle),
      el("p", { class: "einwilligung" },
        "Mit dem Start sind Sie einverstanden, dass Ihre Antworten anonym gespeichert und ausgewertet werden. Mehr dazu in der ",
        el("a", { href: "datenschutz.html", text: "Datenschutzerklärung" }), "."
      ),
      el("div", { class: "navi navi-start" }, start)
    ));
  }

  function zeichneFrage(f) {
    zustand.aktuell = f;
    var liste = sichtbareFragen();
    var nr = liste.indexOf(f) + 1;
    zeigeFortschritt(nr, liste.length);

    var hinweis;
    if (f.typ === "text") hinweis = "Freiwillig. Bitte nennen Sie keine Namen.";
    else if (f.typ === "eine") hinweis = "Bitte wählen Sie eine Antwort.";
    else if (f.max) hinweis = "Bis zu " + f.max + " Antworten.";
    else hinweis = "Mehrere Antworten möglich.";

    var feld = el("fieldset", { class: "frage" },
      el("legend", null,
        el("span", { class: "teil", text: f.teil }),
        el("h1", { id: "ueberschrift", tabindex: "-1", class: "frage-text", text: f.text })
      ),
      el("p", { class: "hinweis", id: "hinweis-" + f.id, text: hinweis })
    );

    var weiterKnopf = el("button", { type: "button", class: "knopf knopf-haupt", onclick: weiter });
    function knopfText() {
      weiterKnopf.textContent = istBeantwortet(f) ? "Weiter" : "Überspringen";
      weiterKnopf.appendChild(icon.pfeilRechts());
    }

    if (f.typ === "text") {
      var ta = el("textarea", {
        id: "feld-" + f.id, rows: "5", maxlength: "2000", "aria-describedby": "hinweis-" + f.id,
        "aria-labelledby": "ueberschrift", placeholder: "Ihre Antwort …",
        oninput: function (e) { zustand.antworten[f.id] = e.target.value; knopfText(); }
      });
      ta.value = zustand.antworten[f.id] || "";
      feld.appendChild(ta);
    } else {
      var optionen = f.optionen.slice();
      if (f.sonstiges) optionen.push(SONSTIGES);
      var gruppe = el("div", { class: "optionen" });
      var eingaben = [];
      var sonstigesFeld = null;

      optionen.forEach(function (text, i) {
        var id = f.id + "-o" + i;
        var input = el("input", {
          type: f.typ === "eine" ? "radio" : "checkbox",
          name: f.id, id: id, value: text,
          "aria-describedby": "hinweis-" + f.id
        });
        input.addEventListener("change", function () { aendere(f, input); });
        eingaben.push(input);
        var taste = el("span", { class: "taste", "aria-hidden": "true" }, BUCHSTABEN.charAt(i), icon.impulse());
        gruppe.appendChild(el("label", { class: "option", "for": id },
          input, taste, el("span", { class: "option-text", text: text }), icon.haken()));
        if (text === SONSTIGES) {
          var sonstInput = el("input", {
            type: "text", id: "sonst-" + f.id, maxlength: "300", "aria-label": "Sonstiges, bitte angeben",
            placeholder: "Bitte angeben",
            oninput: function (e) { zustand.sonstiges[f.id] = e.target.value; }
          });
          sonstInput.value = zustand.sonstiges[f.id] || "";
          sonstigesFeld = el("div", { class: "sonstiges-feld" }, sonstInput);
          gruppe.appendChild(sonstigesFeld);
        }
      });
      feld.appendChild(gruppe);

      f._abgleichen = function () {
        var auswahl = werte(zustand.antworten[f.id]);
        var voll = !!(f.max && auswahl.length >= f.max);
        eingaben.forEach(function (inp) {
          var an = auswahl.indexOf(inp.value) !== -1;
          inp.checked = an;
          var lab = inp.closest(".option");
          lab.classList.toggle("gewaehlt", an);
          var gesperrt = !!(voll && !an);
          inp.disabled = gesperrt;
          lab.classList.toggle("gesperrt", gesperrt);
        });
        if (sonstigesFeld) sonstigesFeld.hidden = auswahl.indexOf(SONSTIGES) === -1;
        knopfText();
      };
      f._abgleichen();
    }

    var hinweisTaste = el("span", { class: "tastenhinweis", "aria-hidden": "true" }, "oder ", el("kbd", { text: "Enter ↵" }));
    if (f.typ === "text") hinweisTaste = el("span", { class: "tastenhinweis", "aria-hidden": "true" }, el("kbd", { text: "Strg + Enter ↵" }));

    buehne.appendChild(el("div", { class: "schritt" },
      feld,
      el("div", { class: "navi" },
        el("button", { type: "button", class: "knopf knopf-leise", onclick: zurueck }, icon.pfeilLinks(), "Zurück"),
        el("div", { class: "weiter-gruppe" }, hinweisTaste, weiterKnopf)
      )
    ));
    knopfText();
  }

  function aendere(f, input) {
    if (f.typ === "eine") {
      zustand.antworten[f.id] = input.value;
    } else {
      var auswahl = werte(zustand.antworten[f.id]).slice();
      var exklusiv = f.exklusiv || [];
      if (input.checked) {
        if (exklusiv.indexOf(input.value) !== -1) auswahl = [input.value];
        else {
          auswahl = auswahl.filter(function (x) { return exklusiv.indexOf(x) === -1; });
          if (auswahl.indexOf(input.value) === -1) auswahl.push(input.value);
        }
        if (f.max && auswahl.length > f.max) auswahl = auswahl.slice(0, f.max);
      } else {
        auswahl = auswahl.filter(function (x) { return x !== input.value; });
      }
      zustand.antworten[f.id] = auswahl;
    }
    if (f._abgleichen) f._abgleichen();

    if (input.value === SONSTIGES && input.checked) {
      var s = document.getElementById("sonst-" + f.id);
      if (s) s.focus();
      return;
    }
    // Bei Fachkräften geht es nach einer Einzelauswahl von selbst weiter.
    if (f.typ === "eine" && !FB.gross) {
      var id = f.id;
      setTimeout(function () { if (zustand.schritt === id) weiter(); }, 420);
    }
  }

  function zeichneEnde() {
    zeigeFortschritt(0, 0, true);
    var meldung = el("p", { class: "meldung", role: "alert", hidden: true });
    var sendenKnopf = el("button", { type: "button", class: "knopf knopf-haupt" }, "Antworten senden", icon.pfeilRechts());
    sendenKnopf.addEventListener("click", function () { sende(sendenKnopf, meldung); });
    buehne.appendChild(el("div", { class: "schritt" },
      el("span", { class: "chip", text: "Fast fertig" }),
      el("h1", { id: "ueberschrift", tabindex: "-1", class: "titel", text: "Geschafft." }),
      el("p", { class: "vorspann", text: "Mit „Antworten senden“ schicken Sie Ihre Antworten ab. Danach lassen sie sich nicht mehr ändern." }),
      el("p", { text: "Wenn Sie noch etwas prüfen möchten, gehen Sie mit „Zurück“ durch Ihre Antworten." }),
      meldung,
      el("div", { class: "navi" },
        el("button", { type: "button", class: "knopf knopf-leise", onclick: zurueck }, icon.pfeilLinks(), "Zurück"),
        el("div", { class: "weiter-gruppe" }, sendenKnopf)
      )
    ));
  }

  function sammle() {
    var ergebnis = {};
    sichtbareFragen().forEach(function (f) {
      var a = zustand.antworten[f.id];
      if (f.typ === "text") {
        if (typeof a === "string" && a.trim()) ergebnis[f.id] = a.trim().slice(0, 2000);
        return;
      }
      var w = werte(a);
      if (!w.length) return;
      ergebnis[f.id] = f.typ === "eine" ? w[0] : w;
      if (w.indexOf(SONSTIGES) !== -1 && zustand.sonstiges[f.id] && zustand.sonstiges[f.id].trim()) {
        ergebnis[f.id + "_sonstiges"] = zustand.sonstiges[f.id].trim().slice(0, 300);
      }
    });
    return ergebnis;
  }

  function sende(knopf, meldung) {
    if (zustand.sendet) return;
    zustand.sendet = true;
    knopf.disabled = true;
    knopf.textContent = "Wird gesendet …";
    meldung.hidden = true;

    var dauer = zustand.beginn ? Math.round((Date.now() - zustand.beginn) / 1000) : null;
    if (dauer !== null && dauer > 86399) dauer = 86399;

    function erfolg() {
      zustand.gesendet = true;
      zustand.sendet = false;
      try { history.replaceState({ schritt: "danke" }, ""); } catch (e) { /* egal */ }
      zustand.schritt = "danke";
      zeichne();
    }

    if (zustand.falle) { erfolg(); return; }

    fetch(CONFIG.supabaseUrl + "/rest/v1/antworten", {
      method: "POST",
      headers: { "apikey": CONFIG.supabaseKey, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ fragebogen: schluessel, fassung: CONFIG.fassung, antworten: sammle(), dauer_sekunden: dauer })
    }).then(function (antwort) {
      if (!antwort.ok) throw new Error("Status " + antwort.status);
      erfolg();
    }).catch(function () {
      zustand.sendet = false;
      knopf.disabled = false;
      knopf.textContent = "Noch einmal senden";
      meldung.textContent = "Die Antworten wurden nicht gesendet. Bitte prüfen Sie die Internetverbindung und tippen Sie dann noch einmal auf „Noch einmal senden“. Ihre Antworten bleiben erhalten, solange diese Seite offen ist.";
      meldung.hidden = false;
    });
  }

  function zeichneDanke() {
    zeigeFortschritt(0, 0, true);
    var impulse = svg("772 -4 124 112", [
      { d: "M 786.55,59.66 C 785.03,58.55 784.82,57.43 785.31,52.91 C 785.63,49.94 786.37,45.48 786.96,43 C 787.54,40.52 788.49,35.58 789.07,32 C 791.34,18.02 793.84,14 800.25,14 C 803.23,14 804.84,14.69 807.08,16.92 C 811.23,21.08 810.88,24.5 805.09,36.41 C 802.39,41.96 798.81,49.48 797.13,53.13 C 793.51,60.99 790.72,62.71 786.55,59.66 Z" },
      { d: "M 816.95,69.91 C 815.3,66.83 816.24,64.42 823.96,51.99 C 827.81,45.8 831.22,39.9 831.54,38.87 C 831.87,37.84 832.55,37 833.07,37 C 833.58,37 834,36.61 834,36.14 C 834,35.25 841.66,21.66 846.36,14.21 C 851.3,6.4 858.28,5.13 864.13,10.97 C 869.01,15.86 867.91,20.83 859.83,30.36 C 855.22,35.8 842.22,50.76 840.52,52.6 C 839.96,53.2 835.92,57.81 831.55,62.85 C 825.11,70.26 823.08,72 820.84,72 C 819.05,72 817.67,71.26 816.95,69.91 Z" },
      { d: "M 841.25,94.7 C 839.57,93.95 839,92.85 839,90.38 C 839,87.48 839.91,86.31 846.25,81.08 C 850.24,77.8 857.33,71.93 862,68.05 C 872.14,59.63 876.16,58.03 881.16,60.41 C 886.14,62.77 887.8,67.7 885.32,72.77 C 883.67,76.15 881.84,77.32 866,85.19 C 844.71,95.76 844.12,95.99 841.25,94.7 Z" }
    ], "danke-impulse");
    var mail = el("a", { href: "mailto:" + CONFIG.kontakt, text: CONFIG.kontakt });
    buehne.appendChild(el("div", { class: "schritt danke" },
      impulse,
      el("h1", { id: "ueberschrift", tabindex: "-1", class: "titel", text: "Vielen Dank! Ihre Antworten sind angekommen." }),
      el("p", { class: "vorspann", text: "Sie helfen uns damit sehr. Sie können diese Seite jetzt schließen." }),
      el("p", null, "Möchten Sie in einem kurzen Gespräch mehr erzählen? Dann schreiben Sie an ", mail, ".")
    ));
  }

  try { history.replaceState({ schritt: "start" }, ""); } catch (e) { /* egal */ }
  zeichne();
})();
