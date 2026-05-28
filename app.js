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
    variants: {
      standard: {
        label: "Standard",
        components: [
          { id: "kreuz_jurte", label: "Kreuz", marking: "Kennzeichnung später eintragen", qty: 1 },
          { id: "seitenstange_klein_jurte", label: "Seitenstange klein (Jurte)", marking: "Kennzeichnung später eintragen", qty: 12 },
          { id: "abspannschnur_jurte", label: "Abspannschnur", marking: "Kennzeichnung später eintragen", qty: 12 },
          { id: "hering_jurte", label: "Hering", marking: "Kennzeichnung später eintragen", qty: 13 }
        ]
      }
    },
    poleOptions: {
      fixed: [
        { id: "mittelstange_set_jurte", label: "Mittelstangen-Set Jurte (2 Stangen + 1 Verbinder)", marking: "Kennzeichnung später eintragen", qty: 1 },
        { id: "schraubfuss_jurte", label: "Schraubfuß", marking: "Kennzeichnung später eintragen", qty: 1 }
      ],
      tripod: [
        { id: "dreibein_stange_jurte", label: "Dreibein-Stange", marking: "Kennzeichnung später eintragen", qty: 3 },
        { id: "dreibein_verbinder_jurte", label: "Dreibein-Verbinder", marking: "Kennzeichnung später eintragen", qty: 1 },
        { id: "dreibein_fuss_jurte", label: "Dreibein-Fuß", marking: "Kennzeichnung später eintragen", qty: 3 }
      ]
    }
  },

  grossraumjurte: {
    label: "Großraumjurte",
    description: "Große Jurte",
    variants: {
      spinne: {
        label: "Spinne",
        components: [
          { id: "metallspinne_grossraum", label: "Metallspinne", marking: "Kennzeichnung später eintragen", qty: 1 },
          { id: "stange_spinne_grossraum", label: "Stange (Spinne)", marking: "Kennzeichnung später eintragen", qty: 9 },
          { id: "verbinder_spinne_grossraum", label: "Verbinder (Spinne)", marking: "Kennzeichnung später eintragen", qty: 6 },
          { id: "fuss_spinne_grossraum", label: "Fuß (Spinne)", marking: "Kennzeichnung später eintragen", qty: 3 },
          { id: "seitenstange_grossraum", label: "Seitenstange Großraumjurte", marking: "Kennzeichnung später eintragen", qty: 16 },
          { id: "abspannschnur_grossraum", label: "Abspannschnur", marking: "Kennzeichnung später eintragen", qty: 16 },
          { id: "hering_grossraum", label: "Hering", marking: "Kennzeichnung später eintragen", qty: 19 }
        ]
      },
      teller: {
        label: "Teller",
        components: [
          { id: "teller_set_grossraum", label: "Teller + 8 Ketten + Karabiner", marking: "Kennzeichnung später eintragen", qty: 1 },
          { id: "stange_teller_grossraum", label: "Stange (Teller)", marking: "Kennzeichnung später eintragen", qty: 6 },
          { id: "verbinder_teller_grossraum", label: "Verbinder (Teller)", marking: "Kennzeichnung später eintragen", qty: 3 },
          { id: "fuss_teller_grossraum", label: "Fuß (Teller)", marking: "Kennzeichnung später eintragen", qty: 3 },
          { id: "seitenstange_grossraum", label: "Seitenstange Großraumjurte", marking: "Kennzeichnung später eintragen", qty: 16 },
          { id: "abspannschnur_grossraum", label: "Abspannschnur", marking: "Kennzeichnung später eintragen", qty: 16 },
          { id: "hering_grossraum", label: "Hering", marking: "Kennzeichnung später eintragen", qty: 17 }
        ]
      }
    },
    poleOptions: {
      fixed: [
        { id: "mittelstange_set_grossraum", label: "Mittelstangen-Set Großraumjurte (2 Stangen + 1 Verbinder)", marking: "Kennzeichnung später eintragen", qty: 1 },
        { id: "schraubfuss_grossraum", label: "Schraubfuß", marking: "Kennzeichnung später eintragen", qty: 1 }
      ],
      tripod: [
        { id: "dreibein_stange_grossraum", label: "Dreibein-Stange", marking: "Kennzeichnung später eintragen", qty: 3 },
        { id: "dreibein_verbinder_grossraum", label: "Dreibein-Verbinder", marking: "Kennzeichnung später eintragen", qty: 1 },
        { id: "dreibein_fuss_grossraum", label: "Dreibein-Fuß", marking: "Kennzeichnung später eintragen", qty: 3 }
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
const bomColumnState = {
  showMarking: false,
  showSources: false
};

const tentCardsEl = document.querySelector("#tentCards");
const bomOutputEl = document.querySelector("#bomOutput");
const resetButtonEl = document.querySelector("#resetButton");
const copyButtonEl = document.querySelector("#copyButton");
const openTextViewButtonEl = document.querySelector("#openTextViewButton");
const copyStatusEl = document.querySelector("#copyStatus");

init();

function init() {
  restoreState();
  renderTentCards();
  renderBom();

  resetButtonEl.addEventListener("click", resetApp);
  copyButtonEl.addEventListener("click", handlePrimaryExportAction);
  openTextViewButtonEl.addEventListener("click", openBomTextView);
  updateExportButtons();

  window.addEventListener("resize", () => {
    updateExportButtons();
  });

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();
}

function createInitialState() {
  return Object.fromEntries(
    Object.keys(tentTypes).map((tentId) => [
      tentId,
      {
        count: 0,
        poleOption: "fixed",
        variant: getDefaultVariantId(tentId)
      }
    ])
  );
}

function getDefaultVariantId(tentId) {
  const tent = tentTypes[tentId];
  const variantIds = tent?.variants ? Object.keys(tent.variants) : [];
  return variantIds.length > 0 ? variantIds[0] : null;
}

function getSelectedVariantId(tentId, tentState) {
  const tent = tentTypes[tentId];

  if (!tent?.variants) {
    return null;
  }

  return tent.variants[tentState.variant] ? tentState.variant : getDefaultVariantId(tentId);
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

      const selectedVariantId = getSelectedVariantId(tentId, savedTentState);
      state[tentId].variant = selectedVariantId;
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

  for (const [index, [tentId, tent]] of Object.entries(tentTypes).entries()) {
    const card = document.createElement("article");
    card.className = "tent-card";
    card.style.setProperty("--card-index", String(index));

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
    label.textContent = "Aufbauoption";

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
    fixedOption.textContent = "Mittelstange";

    const tripodOption = document.createElement("option");
    tripodOption.value = "tripod";
    tripodOption.textContent = "Dreibein-Kombination";

    select.append(fixedOption, tripodOption);
    optionField.append(label, select);

    let variantField = null;
    const variantIds = tent.variants ? Object.keys(tent.variants) : [];

    if (variantIds.length > 1) {
      variantField = document.createElement("div");
      variantField.className = "option-field";

      const variantSelectId = `variant-${tentId}`;
      const variantLabel = document.createElement("label");
      variantLabel.setAttribute("for", variantSelectId);
      variantLabel.textContent = "Variante";

      const variantSelect = document.createElement("select");
      variantSelect.id = variantSelectId;
      variantSelect.value = getSelectedVariantId(tentId, state[tentId]);
      variantSelect.addEventListener("change", (event) => {
        state[tentId].variant = event.target.value;
        persistState();
        renderBom();
      });

      for (const variantId of variantIds) {
        const variantOption = document.createElement("option");
        variantOption.value = variantId;
        variantOption.textContent = tent.variants[variantId].label;
        variantSelect.append(variantOption);
      }

      variantField.append(variantLabel, variantSelect);
    }

    card.append(title, description, counter, optionField);

    if (variantField) {
      card.append(variantField);
    }

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
    state[tentId].variant = getDefaultVariantId(tentId);
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
    const selectedVariantId = getSelectedVariantId(tentId, tentState);
    const variantCount = tent.variants ? Object.keys(tent.variants).length : 0;
    const selectedVariantLabel = selectedVariantId && variantCount > 1
      ? tent.variants[selectedVariantId].label
      : "";
    const variantComponents = selectedVariantId
      ? tent.variants[selectedVariantId].components
      : tent.components ?? [];
    const selectedPoleComponents = tent.poleOptions[tentState.poleOption] ?? [];
    const allComponents = [...variantComponents, ...selectedPoleComponents];

    for (const component of allComponents) {
      const totalQty = component.qty * count;
      const existingItem = bom.get(component.id);

      if (existingItem) {
        existingItem.qty += totalQty;
        existingItem.sources.push({
          tentLabel: tent.label,
          variantLabel: selectedVariantLabel,
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
              variantLabel: selectedVariantLabel,
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
  const isNarrowViewport = window.matchMedia("(max-width: 520px)").matches;
  const isVeryNarrowViewport = window.matchMedia("(max-width: 400px)").matches;
  const isIPhone14Or15Viewport = window.matchMedia("(min-width: 390px) and (max-width: 430px)").matches;
  const areBothOptionalColumnsHidden = !bomColumnState.showMarking && !bomColumnState.showSources;
  const areAllOptionalColumnsOpen = bomColumnState.showMarking && bomColumnState.showSources;
  const areSomeOptionalColumnsOpen = !areBothOptionalColumnsHidden && !areAllOptionalColumnsOpen;
  const shouldCompactSources = isNarrowViewport && bomColumnState.showSources;

  if (bomItems.length === 0) {
    bomOutputEl.innerHTML = '<div class="empty-state">Bitte wähle zuerst mindestens ein Zelt aus.</div>';
    copyButtonEl.disabled = true;
    openTextViewButtonEl.disabled = true;
    updateExportButtons();
    return;
  }

  copyButtonEl.disabled = false;
  openTextViewButtonEl.disabled = false;
  updateExportButtons();

  const controls = document.createElement("div");
  controls.className = "bom-column-toggles";

  const markingToggle = document.createElement("button");
  markingToggle.className = "column-toggle-button";
  markingToggle.type = "button";
  markingToggle.setAttribute("aria-pressed", String(bomColumnState.showMarking));
  markingToggle.textContent = bomColumnState.showMarking
    ? "Kennzeichnung einklappen"
    : "Kennzeichnung ausklappen";
  markingToggle.addEventListener("click", () => {
    bomColumnState.showMarking = !bomColumnState.showMarking;
    renderBom();
  });

  const sourcesToggle = document.createElement("button");
  sourcesToggle.className = "column-toggle-button";
  sourcesToggle.type = "button";
  sourcesToggle.setAttribute("aria-pressed", String(bomColumnState.showSources));
  sourcesToggle.textContent = bomColumnState.showSources
    ? "Herkunft einklappen"
    : "Herkunft ausklappen";
  sourcesToggle.addEventListener("click", () => {
    bomColumnState.showSources = !bomColumnState.showSources;
    renderBom();
  });

  controls.append(markingToggle, sourcesToggle);

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "bom-table-wrapper";

  if (isNarrowViewport && !areBothOptionalColumnsHidden) {
    tableWrapper.classList.add("bom-table-wrapper--mobile-scroll");
  }

  const table = document.createElement("table");
  table.className = "bom-table";

  if (!bomColumnState.showMarking) {
    table.classList.add("bom-table--hide-marking");
  }

  if (!bomColumnState.showSources) {
    table.classList.add("bom-table--hide-sources");
  }

  if (areBothOptionalColumnsHidden) {
    table.classList.add("bom-table--default-columns");
  }

  if (areSomeOptionalColumnsOpen) {
    table.classList.add("bom-table--partial-columns");
  }

  if (areAllOptionalColumnsOpen) {
    table.classList.add("bom-table--all-columns-visible");
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Materialname</th>
        <th>Anzahl</th>
        <th>Kennzeichnung</th>
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

    const maxVisibleSources = isVeryNarrowViewport
      ? 1
      : isIPhone14Or15Viewport && areAllOptionalColumnsOpen
        ? 1
      : isNarrowViewport
        ? 2
        : Number.POSITIVE_INFINITY;
    const visibleSources = item.sources.slice(0, maxVisibleSources);

    for (const source of visibleSources) {
      const sourceItem = document.createElement("li");
      const sourceLabel = source.variantLabel
        ? `${source.tentLabel} (${source.variantLabel})`
        : source.tentLabel;

      sourceItem.textContent = shouldCompactSources
        ? `${source.tentCount}x ${sourceLabel}`
        : `${source.tentCount} × ${sourceLabel} à ${source.componentQty}`;
      sourceList.append(sourceItem);
    }

    const hiddenSourcesCount = item.sources.length - visibleSources.length;

    if (hiddenSourcesCount > 0) {
      const moreItem = document.createElement("li");
      moreItem.className = "source-list__more";
      moreItem.textContent = `+${hiddenSourcesCount} weitere Herkunft${hiddenSourcesCount === 1 ? "" : "en"}`;
      sourceList.append(moreItem);
    }

    row.append(
      createTableCell(item.label),
      createTableCell(String(item.qty)),
      createTableCell(item.marking),
      createTableCell(sourceList)
    );

    tbody.append(row);
  }

  tableWrapper.append(table);
  bomOutputEl.replaceChildren(controls, tableWrapper);

  const shouldShowScrollHint = isNarrowViewport && !areBothOptionalColumnsHidden;

  if (shouldShowScrollHint) {
    const scrollHint = document.createElement("p");
    scrollHint.className = "bom-scroll-hint";
    scrollHint.textContent = "Tipp: Seitlich wischen, um alle Spalten zu sehen.";
    bomOutputEl.replaceChildren(controls, scrollHint, tableWrapper);
  }
}

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    document.documentElement.style.setProperty("--scroll-progress", "0");
    return;
  }

  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
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
      .map((source) => {
        const sourceLabel = source.variantLabel
          ? `${source.tentLabel} (${source.variantLabel})`
          : source.tentLabel;

        return `${source.tentCount} × ${sourceLabel} à ${source.componentQty}`;
      })
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

  return copyBomTextToClipboard(text, {
    successMessage: "Stückliste wurde kopiert.",
    fallbackMessage: "Stückliste wurde kopiert (Fallback)."
  });
}

function hasBomItems() {
  return calculateBom().length > 0;
}

function isLikelyMobileDevice() {
  const matchesMobileAgent = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent);
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return matchesMobileAgent || hasCoarsePointer;
}

function canUseWebShareForText() {
  return window.isSecureContext && typeof navigator.share === "function";
}

function shouldPreferNativeShare() {
  return isLikelyMobileDevice() && canUseWebShareForText();
}

function updateExportButtons() {
  copyButtonEl.textContent = shouldPreferNativeShare()
    ? "Stückliste teilen"
    : "Stückliste kopieren";

  openTextViewButtonEl.hidden = isLikelyMobileDevice();
}

async function handlePrimaryExportAction() {
  if (!hasBomItems()) {
    showCopyStatus("Keine Stückliste vorhanden.");
    return;
  }

  const text = createBomText();

  if (shouldPreferNativeShare()) {
    try {
      await navigator.share({
        title: "Stückliste",
        text
      });
      showCopyStatus("Stückliste wurde geteilt.");
      return;
    } catch (error) {
      const copied = await copyBomTextToClipboard(text, {
        successMessage: "Teilen abgebrochen. Stückliste wurde kopiert.",
        fallbackMessage: "Teilen nicht möglich. Stückliste wurde kopiert (Fallback).",
        manualMessage: "Teilen nicht möglich. Bitte manuell markieren und kopieren."
      });

      if (copied) {
        return;
      }

      console.warn("Teilen und Kopieren sind fehlgeschlagen.", error);
      return;
    }
  }

  await copyBomTextToClipboard(text, {
    successMessage: "Stückliste wurde kopiert.",
    fallbackMessage: "Stückliste wurde kopiert (Fallback)."
  });
}

async function copyBomTextToClipboard(text, options = {}) {
  const successMessage = options.successMessage ?? "Stückliste wurde kopiert.";
  const fallbackMessage = options.fallbackMessage ?? "Stückliste wurde kopiert (Fallback).";
  const manualMessage = options.manualMessage ?? "Kopieren nicht möglich. Bitte manuell markieren und kopieren.";

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard API nicht verfügbar");
    }

    await navigator.clipboard.writeText(text);
    showCopyStatus(successMessage);
    return true;
  } catch (error) {
    console.warn("Zwischenablage nicht verfügbar, Fallback wird genutzt.", error);
    const copiedWithFallback = copyTextFallback(text);

    if (copiedWithFallback) {
      showCopyStatus(fallbackMessage);
      return true;
    }

    showCopyStatus(manualMessage);
    return false;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function openBomTextView() {
  if (!hasBomItems()) {
    showCopyStatus("Keine Stückliste vorhanden.");
    return;
  }

  const text = createBomText();
  const openedWindow = window.open("", "_blank");

  if (!openedWindow) {
    showCopyStatus("Textansicht wurde vom Browser blockiert. Bitte Pop-ups erlauben.");
    return;
  }

  const escapedText = escapeHtml(text);

  openedWindow.document.write(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stückliste</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      color: #2e2418;
      background: #f7f1e6;
      font-family: "Segoe UI", Tahoma, sans-serif;
    }

    h1 {
      margin: 0 0 16px;
      font-size: 1.4rem;
    }

    pre {
      margin: 0;
      padding: 16px;
      border: 1px solid #ded0b4;
      border-radius: 12px;
      background: #fffdf7;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-family: "Cascadia Mono", Consolas, monospace;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <h1>Stückliste (Textansicht)</h1>
  <pre>${escapedText}</pre>
</body>
</html>`);
  openedWindow.document.close();
  showCopyStatus("Textansicht wurde in einem neuen Tab geöffnet.");
}

function copyTextFallback(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.append(textarea);
    textarea.focus();
    textarea.setSelectionRange(0, textarea.value.length);

    const successful = document.execCommand("copy");
    textarea.remove();
    return successful;
  } catch (error) {
    console.warn("Fallback-Kopieren ist fehlgeschlagen.", error);
    return false;
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
