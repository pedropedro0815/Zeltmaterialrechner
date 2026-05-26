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
- Button zum Kopieren der Stückliste als Klartext
- Mobilfreundliches Design
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
- semantisches HTML

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
