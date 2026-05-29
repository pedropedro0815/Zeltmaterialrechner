# Pfadfinder Schiefbahn Materialrechner

Statische Web-App zur Berechnung einer Material- und Stückliste für ein Zeltlager der Pfadfinder Schiefbahn.

Die App läuft vollständig im Browser und benötigt kein Backend, keine Datenbank, kein Build-System und keine externen Frameworks.

## Funktionen

- Auswahl der benötigten Zeltarten über Plus- und Minus-Buttons
- Unterstützte Zeltarten:
  - Jurte
  - Großraumjurte
  - Kohte
- Auswahl der Mittelstangen-Variante pro Zeltart:
  - feste Mittelstange
  - Dreibein-Kombination
- Automatische Berechnung einer zusammengefassten Stückliste
- Gleiche Materialpositionen werden anhand ihrer `id` zusammengefasst
- Anzeige von:
  - Materialname
  - Kennzeichnung
  - Gesamtmenge
  - Herkunft der Menge je Zeltart
- Button zum Zurücksetzen aller Mengen
- Rückgängig-Funktion nach Zurücksetzen (ein Schritt)
- Adaptiver Export der Stückliste:
  - Mobile: natives Teilen (Web Share), falls verfügbar
  - Sonst: Kopieren in die Zwischenablage
  - Zusätzliche Desktop-Aktion: Textansicht in neuem Tab
- Mobilfreundliches Design
- Zusätzliche Hilfetexte für Aufbauoptionen und Varianten
- Verbesserte Lesbarkeit (größere Schriften und Bedienelemente)
- Nutzerpräferenz für Designmodus (System, Hell, Dunkel)
- Optionaler hoher Kontrast als gespeicherte Einstellung
- Einfache Druckansicht per CSS

## Projektstruktur

```text
/
├── index.html
├── style.css
└── app.js
```

## Dateien

### `index.html`

Enthält die Grundstruktur der App:

- Kopfbereich
- Auswahlbereich für die Zeltarten
- Stücklistenbereich
- Buttons für Zurücksetzen und Kopieren
- zusätzlicher Button für Textansicht (Desktop)
- Einbindung von `style.css` und `app.js`

### `style.css`

Enthält das komplette Styling:

- Naturtöne in Grün, Beige und Braun
- responsive Kartenansicht
- große Smartphone-taugliche Plus- und Minus-Buttons
- Tabellenlayout für die Stückliste
- Druckansicht über `@media print`

### `app.js`

Enthält die komplette Logik:

- zentrale Materialdaten
- Zustand der ausgewählten Zelte
- Berechnung der Stückliste
- Rendering der Karten und Tabelle
- Kopierfunktion
- adaptive Export-Orchestrierung (Share, Clipboard, Fallback, Textansicht)
- Reset-Funktion
- optionale Speicherung im `localStorage`

## Materialdaten anpassen

Alle Materialregeln werden zentral in `app.js` im Objekt `tentTypes` gepflegt.

Beispiel:

```js
const tentTypes = {
  kohte: {
    label: "Kohte",
    description: "Kohte",
    components: [
      { id: "kotenplane", label: "Kohteplane", marking: "Kennzeichnung später eintragen", qty: 4 },
      { id: "seitenstange_kohte", label: "Seitenstange Kohte", marking: "Kennzeichnung später eintragen", qty: 8 }
    ],
    poleOptions: {
      fixed: [
        { id: "mittelstange_kohte", label: "Mittelstange Kohte", marking: "Kennzeichnung später eintragen", qty: 1 }
      ],
      tripod: [
        { id: "dreibein_stange", label: "Dreibein-Stange", marking: "Kennzeichnung später eintragen", qty: 3 },
        { id: "dreibein_verbinder", label: "Dreibein-Verbinder", marking: "Kennzeichnung später eintragen", qty: 1 }
      ]
    }
  }
};
```

### Wichtige Felder

| Feld | Bedeutung |
|---|---|
| `id` | Technischer Schlüssel. Gleiche IDs werden in der Stückliste zusammengefasst. |
| `label` | Anzeigename des Materials. |
| `marking` | Kennzeichnung oder Markierung des Materials. |
| `qty` | Menge pro Zelt dieser Zeltart. |

## Neue Zeltart hinzufügen

Eine neue Zeltart wird im Objekt `tentTypes` ergänzt.

Minimaler Aufbau:

```js
neueZeltart: {
  label: "Neue Zeltart",
  description: "Kurze Beschreibung",
  components: [
    { id: "material_id", label: "Materialname", marking: "Kennzeichnung", qty: 1 }
  ],
  poleOptions: {
    fixed: [
      { id: "mittelstange", label: "Mittelstange", marking: "Kennzeichnung", qty: 1 }
    ],
    tripod: [
      { id: "dreibein_stange", label: "Dreibein-Stange", marking: "Kennzeichnung", qty: 3 },
      { id: "dreibein_verbinder", label: "Dreibein-Verbinder", marking: "Kennzeichnung", qty: 1 }
    ]
  }
}
```

Danach wird die neue Zeltart automatisch als Karte angezeigt.

## Lokal starten

Die App kann direkt im Browser geöffnet werden.

1. Dateien herunterladen oder kopieren
2. `index.html` per Doppelklick öffnen
3. Zelte auswählen
4. Stückliste prüfen oder kopieren

Ein lokaler Server ist nicht erforderlich.

## Einbindung in Jimdo

Die App ist für statisches Hosting geeignet.

Mögliche Varianten:

### Variante 1: Als komplette HTML-Datei einbinden

Wenn Jimdo einen HTML-/Code-Block erlaubt, können HTML, CSS und JavaScript auch in einer einzigen Datei zusammengeführt und dort eingebunden werden.

### Variante 2: Drei Dateien hochladen

Falls Jimdo eigene Dateien oder externe Links unterstützt:

```html
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>
```

Die Pfade müssen je nach Jimdo-Ablage angepasst werden.

## Browser-Kompatibilität

Die App nutzt moderne Browser-Funktionen:

- `const` und `let`
- `Map`
- `localStorage`
- `navigator.clipboard` mit Fallback
- `navigator.share` (wenn verfügbar und sicherer Kontext)
- semantisches HTML

## Export-Flow und Plattformgrenzen

Der Export folgt einem Best-Effort-Ansatz innerhalb der Browser-Sicherheitsgrenzen:

1. Auf Mobilgeräten wird bevorzugt das native Share-Sheet genutzt (`navigator.share`), aber nur aus einem direkten Nutzerklick heraus.
2. Wenn Teilen nicht verfügbar ist oder abgebrochen wird, versucht die App automatisch den Clipboard-Flow.
3. Wenn moderne Clipboard-APIs nicht verfügbar sind, wird ein Fallback über `execCommand("copy")` versucht.
4. Falls auch der Fallback scheitert, zeigt die App eine klare manuelle Anweisung.
5. Auf Desktop gibt es zusätzlich die Aktion „Textansicht öffnen", die den vollständigen BOM-Text in einem neuen Tab selektierbar darstellt.

Wichtig: Ein automatisches Öffnen eines nativen Editors mit automatischem Einfügen ist in Browsern aus Sicherheitsgründen nicht zuverlässig möglich und daher bewusst nicht Teil der App.

Empfohlen werden aktuelle Versionen von Chrome, Edge, Firefox oder Safari.

## Hinweise zur Berechnung

Die Stückliste wird nach folgendem Prinzip berechnet:

1. Für jede Zeltart wird die Anzahl gelesen.
2. Alle Standard-Komponenten werden mit der Anzahl multipliziert.
3. Zusätzlich werden die Komponenten der ausgewählten Mittelstangen-Variante addiert.
4. Komponenten mit gleicher `id` werden zusammengefasst.
5. Die Tabelle wird nach Materialname sortiert ausgegeben.

## Keine Server-Abhängigkeiten

Die App verwendet bewusst keine externen Dienste.

Es gibt:

- kein Backend
- keine Datenbank
- keine Benutzerkonten
- keine API-Aufrufe
- keine externen Bibliotheken

Dadurch kann die App einfach kopiert, lokal geöffnet oder als statische Seite eingebunden werden.

## Lizenz

Interne Nutzung für die Pfadfinder Schiefbahn.

Falls das Projekt veröffentlicht werden soll, kann später eine konkrete Open-Source-Lizenz ergänzt werden, zum Beispiel MIT.
