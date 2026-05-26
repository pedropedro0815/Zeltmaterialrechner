/*
  Materialrechner Pfadfinder Schiefbahn
  Vanilla JavaScript, keine externen Abhängigkeiten.

  Die Materialdaten stehen bewusst zentral in diesem Objekt.
  Mengen, Bezeichnungen und Kennzeichnungen können später hier angepasst werden.
*/
const tentTypes = {
  jurte: {
    label: "Jurte",
    description: "Normale Jurte",
    components: [
      { id: "seitenplane_jurte", label: "Seitenplane Jurte", marking: "Kennzeichnung später eintragen", qty: 6 },
      { id: "dachplane_jurte", label: "Dachplane Jurte", marking: "Kennzeichnung später eintragen", qty: 6 },
      { id: "seitenstange", label: "Seitenstange", marking: "Kennzeichnung später eintragen", qty: 12 }
    ],
    poleOptions: {
      fixed: [
        { id: "mittelstange_fest", label: "Feste Mittelstange", marking: "Kennzeichnung später eintragen", qty: 1 }
      ],
      tripod: [
        { id: "dreibein_stange", label: "Dreibein-Stange", marking: "Kennzeichnung später eintragen", qty: 3 },
        { id: "dreibein_verbinder", label: "Dreibein-Verbinder", marking: "Kennzeichnung später eintragen", qty: 1 }
      ]
    }
  },

  grossraumjurte: {
    label: "Großraumjurte",
    description: "Große Jurte",
    components: [
      { id: "seitenplane_grossraum", label: "Seitenplane Großraumjurte", marking: "Kennzeichnung später eintragen", qty: 8 },
      { id: "dachplane_grossraum", label: "Dachplane Großraumjurte", marking: "Kennzeichnung später eintragen", qty: 8 },
      { id: "seitenstange", label: "Seitenstange", marking: "Kennzeichnung später eintragen", qty: 16 }
    ],
    poleOptions: {
      fixed: [
        { id: "mittelstange_fest_grossraum", label: "Feste Mittelstange Großraumjurte", marking: "Kennzeichnung später eintragen", qty: 1 }
      ],
      tripod: [
        { id: "dreibein_stange", label: "Dreibein-Stange", marking: "Kennzeichnung später eintragen", qty: 3 },
        { id: "dreibein_verbinder", label: "Dreibein-Verbinder", marking: "Kennzeichnung später eintragen", qty: 1 }
      ]
    }
  },

  kohte: {
    label: "Kohte",
    description: "Kohte",
    components: [
      { id: "kohtenplane", label: "Kohtenplane", marking: "Kennzeichnung später eintragen", qty: 4 },
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

const STORAGE_KEY = "pfadfinder-schiefbahn-materialrechner-state";

const state = createInitialState();

const tentCardsEl = document.querySelector("#tentCards");
const bomOutputEl = document.querySelector("#bomOutput");
const resetButtonEl = document.querySelector("#resetButton");
const copyButtonEl = document.querySelector("#copyButton");
const copyStatusEl = document.querySelector("#copyStatus");

init();

function init() {
  restoreState();
  renderTentCards();
  renderBom();

  resetButtonEl.addEventListener("click", resetApp);
  copyButtonEl.addEventListener("click", copyBomToClipboard);
}

function createInitialState() {
  return Object.fromEntries(
    Object.keys(tentTypes).map((tentId) => [
      tentId,
      {
        count: 0,
        poleOption: "fixed"
      }
    ])
  );
}

function restoreState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!savedState || typeof savedState !== "object") {
      return;
    }

    for (const tentId of Object.keys(tentTypes)) {
      const savedTentState = savedState[tentId];

      if (!savedTentState) {
        continue;
      }

      state[tentId].count = Number.isInteger(savedTentState.count)
        ? Math.max(0, savedTentState.count)
        : 0;

      state[tentId].poleOption = tentTypes[tentId].poleOptions[savedTentState.poleOption]
        ? savedTentState.poleOption
        : "fixed";
    }
  } catch (error) {
    console.warn("Gespeicherter Zustand konnte nicht geladen werden.", error);
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Zustand konnte nicht gespeichert werden.", error);
  }
}

function renderTentCards() {
  tentCardsEl.innerHTML = "";

  for (const [tentId, tent] of Object.entries(tentTypes)) {
    const card = document.createElement("article");
    card.className = "tent-card";

    const title = document.createElement("h3");
    title.textContent = tent.label;

    const description = document.createElement("p");
    description.className = "tent-card__description";
    description.textContent = tent.description;

    const counter = document.createElement("div");
    counter.className = "counter";

    const minusButton = document.createElement("button");
    minusButton.className = "counter__button";
    minusButton.type = "button";
    minusButton.textContent = "−";
    minusButton.setAttribute("aria-label", `${tent.label} reduzieren`);
    minusButton.disabled = state[tentId].count === 0;
    minusButton.addEventListener("click", () => updateCount(tentId, -1));

    const countValue = document.createElement("div");
    countValue.className = "counter__value";
    countValue.textContent = state[tentId].count;
    countValue.setAttribute("aria-label", `${tent.label}: ${state[tentId].count}`);

    const plusButton = document.createElement("button");
    plusButton.className = "counter__button";
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.setAttribute("aria-label", `${tent.label} erhöhen`);
    plusButton.addEventListener("click", () => updateCount(tentId, 1));

    counter.append(minusButton, countValue, plusButton);

    const optionField = document.createElement("div");
    optionField.className = "option-field";

    const selectId = `pole-option-${tentId}`;

    const label = document.createElement("label");
    label.setAttribute("for", selectId);
    label.textContent = "Mittelstangen-Variante";

    const select = document.createElement("select");
    select.id = selectId;
    select.value = state[tentId].poleOption;
    select.addEventListener("change", (event) => {
      state[tentId].poleOption = event.target.value;
      persistState();
      renderBom();
    });

    const fixedOption = document.createElement("option");
    fixedOption.value = "fixed";
    fixedOption.textContent = "Feste Mittelstange";

    const tripodOption = document.createElement("option");
    tripodOption.value = "tripod";
    tripodOption.textContent = "Dreibein-Kombination";

    select.append(fixedOption, tripodOption);
    optionField.append(label, select);

    card.append(title, description, counter, optionField);
    tentCardsEl.append(card);
  }
}

function updateCount(tentId, delta) {
  state[tentId].count = Math.max(0, state[tentId].count + delta);
  persistState();
  renderTentCards();
  renderBom();
}

function resetApp() {
  for (const tentId of Object.keys(state)) {
    state[tentId].count = 0;
    state[tentId].poleOption = "fixed";
  }

  persistState();
  renderTentCards();
  renderBom();
  showCopyStatus("");
}

function calculateBom() {
  const bom = new Map();

  for (const [tentId, tentState] of Object.entries(state)) {
    const count = tentState.count;

    if (count <= 0) {
      continue;
    }

    const tent = tentTypes[tentId];
    const selectedPoleComponents = tent.poleOptions[tentState.poleOption] ?? [];
    const allComponents = [...tent.components, ...selectedPoleComponents];

    for (const component of allComponents) {
      const totalQty = component.qty * count;
      const existingItem = bom.get(component.id);

      if (existingItem) {
        existingItem.qty += totalQty;
        existingItem.sources.push({
          tentLabel: tent.label,
          tentCount: count,
          componentQty: component.qty,
          selectedPoleOption: tentState.poleOption
        });
      } else {
        bom.set(component.id, {
          id: component.id,
          label: component.label,
          marking: component.marking,
          qty: totalQty,
          sources: [
            {
              tentLabel: tent.label,
              tentCount: count,
              componentQty: component.qty,
              selectedPoleOption: tentState.poleOption
            }
          ]
        });
      }
    }
  }

  return [...bom.values()].sort((a, b) => a.label.localeCompare(b.label, "de"));
}

function renderBom() {
  const bomItems = calculateBom();

  if (bomItems.length === 0) {
    bomOutputEl.innerHTML = '<div class="empty-state">Bitte wähle zuerst mindestens ein Zelt aus.</div>';
    copyButtonEl.disabled = true;
    return;
  }

  copyButtonEl.disabled = false;

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "bom-table-wrapper";

  const table = document.createElement("table");
  table.className = "bom-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Materialname</th>
        <th>Kennzeichnung</th>
        <th>Gesamtmenge</th>
        <th>Herkunft</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  for (const item of bomItems) {
    const row = document.createElement("tr");

    const sourceList = document.createElement("ul");
    sourceList.className = "source-list";

    for (const source of item.sources) {
      const sourceItem = document.createElement("li");
      sourceItem.textContent = `${source.tentCount} × ${source.tentLabel} à ${source.componentQty}`;
      sourceList.append(sourceItem);
    }

    row.append(
      createTableCell(item.label),
      createTableCell(item.marking),
      createTableCell(String(item.qty)),
      createTableCell(sourceList)
    );

    tbody.append(row);
  }

  tableWrapper.append(table);
  bomOutputEl.replaceChildren(tableWrapper);
}

function createTableCell(content) {
  const cell = document.createElement("td");

  if (content instanceof Node) {
    cell.append(content);
  } else {
    cell.textContent = content;
  }

  return cell;
}

function createBomText() {
  const bomItems = calculateBom();

  if (bomItems.length === 0) {
    return "Bitte wähle zuerst mindestens ein Zelt aus.";
  }

  const lines = [
    "Stückliste",
    "==========",
    ""
  ];

  for (const item of bomItems) {
    const sources = item.sources
      .map((source) => `${source.tentCount} × ${source.tentLabel} à ${source.componentQty}`)
      .join("; ");

    lines.push(`${item.qty} × ${item.label}`);
    lines.push(`Kennzeichnung: ${item.marking}`);
    lines.push(`Herkunft: ${sources}`);
    lines.push("");
  }

  return lines.join("\n");
}

async function copyBomToClipboard() {
  const text = createBomText();

  try {
    await navigator.clipboard.writeText(text);
    showCopyStatus("Stückliste wurde kopiert.");
  } catch (error) {
    console.warn("Zwischenablage nicht verfügbar, Fallback wird genutzt.", error);
    copyTextFallback(text);
  }
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.append(textarea);
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    showCopyStatus(successful ? "Stückliste wurde kopiert." : "Kopieren nicht möglich.");
  } finally {
    textarea.remove();
  }
}

function showCopyStatus(message) {
  copyStatusEl.textContent = message;

  if (!message) {
    return;
  }

  window.clearTimeout(showCopyStatus.timeoutId);
  showCopyStatus.timeoutId = window.setTimeout(() => {
    copyStatusEl.textContent = "";
  }, 2500);
}
