const OVERLAY_ATTR = "data-imperio-spacing-overlay";
const DEFAULT_SELECTOR = "body *";
const DEFAULTS = {
  selector: DEFAULT_SELECTOR,
  unitVar: "--space-unit",
  minElementSize: 12,
  maxElements: 400,
  showBoxes: true,
  lineColor: "#ff2020",
};

const PRIORITY_SELECTORS = [
  { selector: '[data-part="latin"]', score: 600 },
  { selector: ".hero-imperio__headline", score: 560 },
  { selector: ".hero-imperio__latin-block", score: 540 },
  { selector: '[data-part="imperio"]', score: 520 },
  { selector: '[data-part="espanol"]', score: 520 },
  { selector: "h1, h2, h3, h4, h5, h6", score: 420 },
  { selector: "button, a, input, textarea, select, label", score: 360 },
  { selector: ".home-shell, .hero-imperio__lockup, section, nav, footer, header", score: 120 },
];

const SPACE_EXPRESSIONS = [
  { name: "--space-1", multiplier: 1 },
  { name: "--space-2", multiplier: 2 },
  { name: "--space-3", multiplier: 3 },
  { name: "--space-4", multiplier: 4 },
  { name: "--space-6", multiplier: 6 },
  { name: "--space-8", multiplier: 8 },
  { name: "--space-10", multiplier: 10 },
  { name: "--space-12", multiplier: 12 },
  { name: "--space-16", multiplier: 16 },
  { name: "calc(var(--space-unit) * 0.8)", multiplier: 0.8 },
  { name: "calc(var(--space-unit) * 1.4)", multiplier: 1.4 },
  { name: "calc(var(--space-unit) * 1.5)", multiplier: 1.5 },
  { name: "calc(var(--space-unit) * 1.75)", multiplier: 1.75 },
  { name: "calc(var(--space-unit) * 2.25)", multiplier: 2.25 },
  { name: "calc(var(--space-unit) * 2.5)", multiplier: 2.5 },
  { name: "calc(var(--space-unit) * 2.75)", multiplier: 2.75 },
  { name: "calc(var(--space-unit) * 3.5)", multiplier: 3.5 },
  { name: "calc(var(--space-unit) * 4.5)", multiplier: 4.5 },
  { name: "calc(var(--space-unit) * 7.5)", multiplier: 7.5 },
  { name: "calc(var(--space-unit) * 11.25)", multiplier: 11.25 },
];

const toArray = (value) => Array.from(value || []);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  Math.min(aEnd, bEnd) - Math.max(aStart, bStart);

function getUnitPx(unitVar) {
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue(unitVar)
    .trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8;
}

function formatMultiplier(multiplier) {
  return Number.isInteger(multiplier) ? String(multiplier) : multiplier.toFixed(2);
}

function findClosestExpression(distancePx, unitPx, unitVar) {
  const ratio = distancePx / Math.max(1, unitPx);
  let best = null;

  for (const expression of SPACE_EXPRESSIONS) {
    const delta = Math.abs(expression.multiplier - ratio);
    if (!best || delta < best.delta) {
      best = { ...expression, delta };
    }
  }

  if (best && best.delta <= 0.06) {
    return best.name;
  }

  return `calc(var(${unitVar}) * ${formatMultiplier(ratio)})`;
}

function getViewportVariableHint(element, side, distancePx, unitPx, unitVar) {
  const shell = element.closest(".home-shell");
  if (shell && (side === "left" || side === "right")) {
    const shellRect = rectFor(shell);
    const shellDistance =
      side === "left" ? shellRect.left : window.innerWidth - shellRect.right;
    if (Math.abs(shellDistance - distancePx) <= 1) {
      return `--home-gutter = ${findClosestExpression(distancePx, unitPx, unitVar)}`;
    }
  }

  if (element.closest(".main-nav__inner") && (side === "top" || side === "bottom")) {
    if (Math.abs(distancePx - unitPx * 8) <= 1) {
      return `calc(var(--space-unit) * 8)`;
    }
  }

  return null;
}

function getNeighborVariableHint(distancePx, unitPx, unitVar) {
  return findClosestExpression(distancePx, unitPx, unitVar);
}

function createMeasurementText(distancePx, variableLabel) {
  return `${Math.round(distancePx)}px\n${variableLabel}`;
}

function rectFor(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function isIgnoredTag(element) {
  return /^(HTML|BODY|SCRIPT|STYLE|LINK|META|HEAD|NOSCRIPT|BR)$/.test(
    element.tagName
  );
}

function isOverlayElement(element) {
  return Boolean(element?.closest?.(`[${OVERLAY_ATTR}]`));
}

function isVisibleCandidate(element, minElementSize) {
  if (!(element instanceof HTMLElement)) return false;
  if (isIgnoredTag(element) || isOverlayElement(element)) return false;

  const style = getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.pointerEvents === "none" ||
    Number.parseFloat(style.opacity || "1") === 0
  ) {
    return false;
  }

  const rect = rectFor(element);
  if (rect.width < minElementSize || rect.height < minElementSize) return false;
  if (rect.bottom <= 0 || rect.right <= 0) return false;
  if (rect.top >= window.innerHeight || rect.left >= window.innerWidth) return false;

  const parent = element.parentElement;
  if (parent && parent !== document.body) {
    const parentRect = rectFor(parent);
    const sameBounds =
      Math.abs(parentRect.top - rect.top) < 0.5 &&
      Math.abs(parentRect.left - rect.left) < 0.5 &&
      Math.abs(parentRect.width - rect.width) < 0.5 &&
      Math.abs(parentRect.height - rect.height) < 0.5;
    if (sameBounds) return false;
  }

  return true;
}

function getSelectionPriority(element) {
  let score = 0;

  for (const rule of PRIORITY_SELECTORS) {
    if (element.matches(rule.selector)) {
      score = Math.max(score, rule.score);
    }
  }

  if (element.hasAttribute("data-part")) {
    score += 80;
  }

  const rect = rectFor(element);
  const areaPenalty = Math.min(120, Math.round((rect.width * rect.height) / 12000));
  return score - areaPenalty;
}

function collectCandidates(options) {
  const all = toArray(document.querySelectorAll(options.selector)).filter((element) =>
    isVisibleCandidate(element, options.minElementSize)
  );

  if (all.length <= options.maxElements) return all;

  return all
    .sort((a, b) => rectFor(b).width * rectFor(b).height - rectFor(a).width * rectFor(a).height)
    .slice(0, options.maxElements);
}

function describeElement(element) {
  const idPart = element.id ? `#${element.id}` : "";
  const classPart =
    typeof element.className === "string" && element.className.trim()
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
  return `${element.tagName.toLowerCase()}${idPart}${classPart}`;
}

function createLayer(root) {
  const layer = document.createElement("div");
  layer.setAttribute(OVERLAY_ATTR, "");
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  root.appendChild(layer);
  return layer;
}

function createOverlayRoot() {
  const existing = document.querySelector(`[${OVERLAY_ATTR}="root"]`);
  existing?.remove();

  const root = document.createElement("div");
  root.setAttribute(OVERLAY_ATTR, "root");
  root.style.position = "fixed";
  root.style.inset = "0";
  root.style.zIndex = "2147483647";
  root.style.pointerEvents = "none";
  root.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";

  const boxesLayer = createLayer(root);
  const guidesLayer = createLayer(root);
  const labelsLayer = createLayer(root);
  const chromeLayer = createLayer(root);

  document.body.appendChild(root);
  return { root, boxesLayer, guidesLayer, labelsLayer, chromeLayer };
}

function clearLayer(layer) {
  while (layer.firstChild) {
    layer.removeChild(layer.firstChild);
  }
}

function addBox(layer, rect, styles = {}) {
  const box = document.createElement("div");
  box.setAttribute(OVERLAY_ATTR, "");
  box.style.position = "fixed";
  box.style.left = `${rect.left}px`;
  box.style.top = `${rect.top}px`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
  box.style.boxSizing = "border-box";
  Object.assign(box.style, styles);
  layer.appendChild(box);
}

function addLabel(layer, text, left, top, lineColor) {
  const label = document.createElement("div");
  label.setAttribute(OVERLAY_ATTR, "");
  label.textContent = text;
  label.style.position = "fixed";
  label.style.left = `${left}px`;
  label.style.top = `${top}px`;
  label.style.transform = "translate(-50%, -50%)";
  label.style.padding = "6px 8px";
  label.style.border = `1px solid ${lineColor}`;
  label.style.background = "rgba(255, 255, 255, 0.96)";
  label.style.color = lineColor;
  label.style.fontSize = "11px";
  label.style.lineHeight = "1.35";
  label.style.borderRadius = "10px";
  label.style.whiteSpace = "pre";
  label.style.textAlign = "center";
  label.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12)";
  label.style.maxWidth = "240px";
  layer.appendChild(label);
}

function addSegment(layer, left, top, width, height, lineColor) {
  const segment = document.createElement("div");
  segment.setAttribute(OVERLAY_ATTR, "");
  segment.style.position = "fixed";
  segment.style.left = `${left}px`;
  segment.style.top = `${top}px`;
  segment.style.width = `${width}px`;
  segment.style.height = `${height}px`;
  segment.style.background = lineColor;
  segment.style.boxShadow = `0 0 0 1px ${lineColor}22`;
  layer.appendChild(segment);
}

function addHorizontalGuide(layer, labelsLayer, x1, x2, y, text, lineColor) {
  const left = Math.min(x1, x2);
  const width = Math.abs(x2 - x1);
  if (width < 1) return;

  addSegment(layer, left, y, width, 1, lineColor);
  addSegment(layer, left, y - 5, 1, 11, lineColor);
  addSegment(layer, left + width, y - 5, 1, 11, lineColor);
  addLabel(labelsLayer, text, left + width / 2, y - 16, lineColor);
}

function addVerticalGuide(layer, labelsLayer, x, y1, y2, text, lineColor) {
  const top = Math.min(y1, y2);
  const height = Math.abs(y2 - y1);
  if (height < 1) return;

  addSegment(layer, x, top, 1, height, lineColor);
  addSegment(layer, x - 5, top, 11, 1, lineColor);
  addSegment(layer, x - 5, top + height, 11, 1, lineColor);
  addLabel(labelsLayer, text, x + 18, top + height / 2, lineColor);
}

function findTargetFromPoint(point, options) {
  const elements = toArray(document.elementsFromPoint(point.x, point.y));
  const candidates = elements.filter((element) =>
    isVisibleCandidate(element, options.minElementSize)
  );

  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => {
    const priorityDelta = getSelectionPriority(b) - getSelectionPriority(a);
    if (priorityDelta !== 0) return priorityDelta;

    const areaA = rectFor(a).width * rectFor(a).height;
    const areaB = rectFor(b).width * rectFor(b).height;
    return areaA - areaB;
  })[0];
}

function findNearestNeighbor(activeElement, candidates, direction) {
  const activeRect = rectFor(activeElement);
  let winner = null;
  let winnerDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    if (candidate === activeElement) continue;
    const candidateRect = rectFor(candidate);

    if (direction === "left") {
      const overlap = overlaps(
        activeRect.top,
        activeRect.bottom,
        candidateRect.top,
        candidateRect.bottom
      );
      if (overlap <= 0 || candidateRect.right > activeRect.left) continue;
      const distance = activeRect.left - candidateRect.right;
      if (distance < winnerDistance) {
        winnerDistance = distance;
        winner = { element: candidate, rect: candidateRect, distance };
      }
      continue;
    }

    if (direction === "right") {
      const overlap = overlaps(
        activeRect.top,
        activeRect.bottom,
        candidateRect.top,
        candidateRect.bottom
      );
      if (overlap <= 0 || candidateRect.left < activeRect.right) continue;
      const distance = candidateRect.left - activeRect.right;
      if (distance < winnerDistance) {
        winnerDistance = distance;
        winner = { element: candidate, rect: candidateRect, distance };
      }
      continue;
    }

    if (direction === "top") {
      const overlap = overlaps(
        activeRect.left,
        activeRect.right,
        candidateRect.left,
        candidateRect.right
      );
      if (overlap <= 0 || candidateRect.bottom > activeRect.top) continue;
      const distance = activeRect.top - candidateRect.bottom;
      if (distance < winnerDistance) {
        winnerDistance = distance;
        winner = { element: candidate, rect: candidateRect, distance };
      }
      continue;
    }

    if (direction === "bottom") {
      const overlap = overlaps(
        activeRect.left,
        activeRect.right,
        candidateRect.left,
        candidateRect.right
      );
      if (overlap <= 0 || candidateRect.top < activeRect.bottom) continue;
      const distance = candidateRect.top - activeRect.bottom;
      if (distance < winnerDistance) {
        winnerDistance = distance;
        winner = { element: candidate, rect: candidateRect, distance };
      }
    }
  }

  return winner;
}

function drawViewportGuides(state, activeElement, activeRect) {
  const { guidesLayer, labelsLayer, options } = state;
  const unitPx = getUnitPx(options.unitVar);
  const midX = clamp(activeRect.left + activeRect.width / 2, 24, window.innerWidth - 24);
  const midY = clamp(activeRect.top + activeRect.height / 2, 24, window.innerHeight - 24);

  addHorizontalGuide(
    guidesLayer,
    labelsLayer,
    0,
    activeRect.left,
    midY,
    createMeasurementText(
      activeRect.left,
      getViewportVariableHint(activeElement, "left", activeRect.left, unitPx, options.unitVar) ||
        findClosestExpression(activeRect.left, unitPx, options.unitVar)
    ),
    options.lineColor
  );
  addHorizontalGuide(
    guidesLayer,
    labelsLayer,
    activeRect.right,
    window.innerWidth,
    midY + 26,
    createMeasurementText(
      window.innerWidth - activeRect.right,
      getViewportVariableHint(
        activeElement,
        "right",
        window.innerWidth - activeRect.right,
        unitPx,
        options.unitVar
      ) || findClosestExpression(window.innerWidth - activeRect.right, unitPx, options.unitVar)
    ),
    options.lineColor
  );
  addVerticalGuide(
    guidesLayer,
    labelsLayer,
    midX,
    0,
    activeRect.top,
    createMeasurementText(
      activeRect.top,
      getViewportVariableHint(activeElement, "top", activeRect.top, unitPx, options.unitVar) ||
        findClosestExpression(activeRect.top, unitPx, options.unitVar)
    ),
    options.lineColor
  );
  addVerticalGuide(
    guidesLayer,
    labelsLayer,
    midX + 26,
    activeRect.bottom,
    window.innerHeight,
    createMeasurementText(
      window.innerHeight - activeRect.bottom,
      getViewportVariableHint(
        activeElement,
        "bottom",
        window.innerHeight - activeRect.bottom,
        unitPx,
        options.unitVar
      ) ||
        findClosestExpression(window.innerHeight - activeRect.bottom, unitPx, options.unitVar)
    ),
    options.lineColor
  );
}

function drawNeighborGuides(state, activeElement, candidates) {
  const { guidesLayer, labelsLayer, options } = state;
  const unitPx = getUnitPx(options.unitVar);
  const activeRect = rectFor(activeElement);

  const leftNeighbor = findNearestNeighbor(activeElement, candidates, "left");
  if (leftNeighbor) {
    const y =
      Math.max(activeRect.top, leftNeighbor.rect.top) +
      overlaps(activeRect.top, activeRect.bottom, leftNeighbor.rect.top, leftNeighbor.rect.bottom) /
        2;
    addHorizontalGuide(
      guidesLayer,
      labelsLayer,
      leftNeighbor.rect.right,
      activeRect.left,
      y,
      createMeasurementText(
        leftNeighbor.distance,
        getNeighborVariableHint(leftNeighbor.distance, unitPx, options.unitVar)
      ),
      options.lineColor
    );
  }

  const rightNeighbor = findNearestNeighbor(activeElement, candidates, "right");
  if (rightNeighbor) {
    const y =
      Math.max(activeRect.top, rightNeighbor.rect.top) +
      overlaps(activeRect.top, activeRect.bottom, rightNeighbor.rect.top, rightNeighbor.rect.bottom) /
        2;
    addHorizontalGuide(
      guidesLayer,
      labelsLayer,
      activeRect.right,
      rightNeighbor.rect.left,
      y,
      createMeasurementText(
        rightNeighbor.distance,
        getNeighborVariableHint(rightNeighbor.distance, unitPx, options.unitVar)
      ),
      options.lineColor
    );
  }

  const topNeighbor = findNearestNeighbor(activeElement, candidates, "top");
  if (topNeighbor) {
    const x =
      Math.max(activeRect.left, topNeighbor.rect.left) +
      overlaps(activeRect.left, activeRect.right, topNeighbor.rect.left, topNeighbor.rect.right) /
        2;
    addVerticalGuide(
      guidesLayer,
      labelsLayer,
      x,
      topNeighbor.rect.bottom,
      activeRect.top,
      createMeasurementText(
        topNeighbor.distance,
        getNeighborVariableHint(topNeighbor.distance, unitPx, options.unitVar)
      ),
      options.lineColor
    );
  }

  const bottomNeighbor = findNearestNeighbor(activeElement, candidates, "bottom");
  if (bottomNeighbor) {
    const x =
      Math.max(activeRect.left, bottomNeighbor.rect.left) +
      overlaps(
        activeRect.left,
        activeRect.right,
        bottomNeighbor.rect.left,
        bottomNeighbor.rect.right
      ) /
        2;
    addVerticalGuide(
      guidesLayer,
      labelsLayer,
      x,
      activeRect.bottom,
      bottomNeighbor.rect.top,
      createMeasurementText(
        bottomNeighbor.distance,
        getNeighborVariableHint(bottomNeighbor.distance, unitPx, options.unitVar)
      ),
      options.lineColor
    );
  }
}

function drawChrome(state, activeElement) {
  const { chromeLayer, options, locked } = state;
  const unitPx = getUnitPx(options.unitVar);
  const info = document.createElement("div");
  info.setAttribute(OVERLAY_ATTR, "");
  info.style.position = "fixed";
  info.style.top = "12px";
  info.style.right = "12px";
  info.style.padding = "10px 12px";
  info.style.border = `1px solid ${options.lineColor}`;
  info.style.background = "rgba(255, 255, 255, 0.96)";
  info.style.color = "#111";
  info.style.fontSize = "11px";
  info.style.lineHeight = "1.45";
  info.style.borderRadius = "12px";
  info.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.14)";
  info.style.maxWidth = "360px";
  info.innerHTML = [
    `<strong style="color:${options.lineColor};">Spacing overlay</strong>`,
    `<div>Elemento: ${activeElement ? describeElement(activeElement) : "ninguno"}</div>`,
    `<div>Variable base: ${options.unitVar} = ${unitPx}px</div>`,
    `<div>Etiquetas: px + variable/formula CSS</div>`,
    `<div>Estado: ${locked ? "bloqueado" : "hover"}</div>`,
    "<div>Alt+Click bloquea. Esc cierra.</div>",
  ].join("");
  chromeLayer.appendChild(info);
}

function render(state) {
  clearLayer(state.boxesLayer);
  clearLayer(state.guidesLayer);
  clearLayer(state.labelsLayer);
  clearLayer(state.chromeLayer);

  state.candidates = collectCandidates(state.options);
  if (state.options.showBoxes) {
    state.candidates.forEach((candidate) => {
      addBox(state.boxesLayer, rectFor(candidate), {
        border: `1px dashed ${state.options.lineColor}33`,
        background: `${state.options.lineColor}08`,
      });
    });
  }

  const activeElement =
    state.lockedElement && document.contains(state.lockedElement)
      ? state.lockedElement
      : findTargetFromPoint(state.lastPointer, state.options);

  if (!activeElement) {
    drawChrome(state, null);
    return;
  }

  const activeRect = rectFor(activeElement);
  addBox(state.boxesLayer, activeRect, {
    border: `2px solid ${state.options.lineColor}`,
    background: `${state.options.lineColor}14`,
  });
  addLabel(
    state.labelsLayer,
    describeElement(activeElement),
    clamp(activeRect.left + activeRect.width / 2, 64, window.innerWidth - 64),
    clamp(activeRect.top - 18, 20, window.innerHeight - 20),
    state.options.lineColor
  );

  drawViewportGuides(state, activeElement, activeRect);
  drawNeighborGuides(state, activeElement, state.candidates);
  drawChrome(state, activeElement);
}

function scheduleRender(state) {
  if (state.rafId) return;
  state.rafId = window.requestAnimationFrame(() => {
    state.rafId = 0;
    render(state);
  });
}

export function mountSpacingOverlay(userOptions = {}) {
  window.imperioSpacingOverlay?.destroy?.();

  const options = { ...DEFAULTS, ...userOptions };
  const layers = createOverlayRoot();
  const state = {
    ...layers,
    options,
    candidates: [],
    lastPointer: {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2),
    },
    locked: false,
    lockedElement: null,
    rafId: 0,
  };

  const onMouseMove = (event) => {
    if (state.locked) return;
    state.lastPointer = { x: event.clientX, y: event.clientY };
    scheduleRender(state);
  };

  const onClick = (event) => {
    if (!event.altKey) return;
    const target = findTargetFromPoint(
      { x: event.clientX, y: event.clientY },
      options
    );
    state.locked = Boolean(target && (!state.locked || state.lockedElement !== target));
    state.lockedElement = state.locked ? target : null;
    event.preventDefault();
    event.stopPropagation();
    scheduleRender(state);
  };

  const onScrollOrResize = () => {
    scheduleRender(state);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      api.destroy();
      return;
    }
    if (event.key.toLowerCase() === "l") {
      state.locked = !state.locked;
      if (!state.locked) state.lockedElement = null;
      scheduleRender(state);
    }
  };

  const api = {
    refresh() {
      scheduleRender(state);
    },
    setUnit(value) {
      const unitValue =
        typeof value === "number" ? `${value}px` : String(value).trim();
      document.documentElement.style.setProperty(options.unitVar, unitValue);
      scheduleRender(state);
      return unitValue;
    },
    destroy() {
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize, true);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("click", onClick, true);
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
      }
      state.root.remove();
      delete window.imperioSpacingOverlay;
    },
  };

  window.imperioSpacingOverlay = api;
  window.addEventListener("mousemove", onMouseMove, true);
  window.addEventListener("scroll", onScrollOrResize, true);
  window.addEventListener("resize", onScrollOrResize, true);
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("click", onClick, true);

  scheduleRender(state);
  return api;
}

export default mountSpacingOverlay;
