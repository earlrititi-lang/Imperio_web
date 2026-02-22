import { useEffect, useMemo, useRef, useState } from "preact/hooks";

const DEFAULT_LAYERS = [
  { id: "Non_sufficit_orbis", label: "Non sufficit orbis" },
  { id: "Plus_ultra", label: "Plus ultra" },
  { id: "A_solis_ortu_usque_ad_occasum", label: "A solis ortu usque ad occasum" },
  {
    id: "Fiat_justitia_et_pereat_mundus",
    label: "Fiat justitia et pereat mundus",
  },
  {
    id: "Ante_ferit_quam_flamma_micet",
    label: "Ante ferit quam flamma micet",
  },
  { id: "Nec_spe_nec_metu", label: "Nec spe nec metu" },
  { id: "Iam_illvstrabit_omnia", label: "Iam illvstrabit omnia" },
  {
    id: "Pace_mare_terraqve_composita",
    label: "Pace mare terraqve composita",
  },
  { id: "Fidei_defensor", label: "Fidei defensor" },
];

const DEFAULT_ANIMATION = {
  startDelayMs: 420, // Espera tras preloader antes de arrancar el primer ciclo
  revealMs: 1400, // Barrido de entrada izquierda -> derecha
  glyphInMs: 340, // Duracion de transicion blur/fade-in por glifo
  inFadeDelayRatio: 0.62, // % de la fase de entrada reservado solo a blur
  inBlurEndRatio: 0.52, // Punto dentro de entrada donde termina el blur-in
  inPreviewOpacity: 0.18, // Opacidad baja para que se perciba el blur-in antes del fade principal
  holdMs: 2200, // Tiempo totalmente visible (sin blur)
  outSweepMs: 1400, // Barrido de salida izquierda -> derecha
  glyphOutMs: 360, // Duracion de transicion blur/fade-out por glifo
  outFadeDelayRatio: 0.62, // % de la fase de salida reservado solo a blur
  staggerMs: 760, // Separacion entre inicio de cada frase
  loopPauseMs: 5000, // Pausa final antes de reiniciar todo el ciclo
  maxBlurPx: 8,
};

const roundPct = (value) => Number(value.toFixed(3));
const roundValue = (value, decimals = 3) => Number(value.toFixed(decimals));
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function LatinLayers({
  src = "/images/Letras_latin.svg",
  layers = DEFAULT_LAYERS,
  animation = DEFAULT_ANIMATION,
  className = "",
}) {
  const [svgMarkup, setSvgMarkup] = useState("");
  const [glyphAnimationCss, setGlyphAnimationCss] = useState("");
  const wrapperRef = useRef(null);

  const activeLayers = useMemo(
    () => (Array.isArray(layers) ? layers.filter((layer) => layer?.id) : []),
    [layers]
  );
  const anim = useMemo(
    () => ({ ...DEFAULT_ANIMATION, ...(animation || {}) }),
    [animation]
  );

  const timeline = useMemo(() => {
    const layerCount = Math.max(1, activeLayers.length);
    const glyphInMs = Math.max(
      120,
      toNumber(anim.glyphInMs, Math.round(anim.revealMs * 0.24))
    );
    const glyphOutMs = Math.max(
      120,
      toNumber(anim.glyphOutMs, toNumber(anim.fadeMs, 360))
    );
    const outSweepMs = Math.max(120, toNumber(anim.outSweepMs, anim.revealMs));
    const phraseWindowMs =
      anim.revealMs + glyphInMs + anim.holdMs + outSweepMs + glyphOutMs;
    const cycleDurationMs =
      phraseWindowMs +
      (layerCount - 1) * anim.staggerMs +
      anim.loopPauseMs;

    return {
      cycleDurationMs,
      phraseWindowMs,
      glyphInMs,
      outSweepMs,
      glyphOutMs,
    };
  }, [activeLayers.length, anim]);

  useEffect(() => {
    let isCancelled = false;

    const loadSvg = async () => {
      try {
        const response = await fetch(src, { cache: "force-cache" });
        if (!response.ok) return;
        const rawSvg = await response.text();
        if (isCancelled) return;

        if (typeof DOMParser === "undefined") {
          setSvgMarkup(rawSvg);
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawSvg, "image/svg+xml");
        const root = doc.documentElement;
        const existingClass = root.getAttribute("class") || "";
        root.setAttribute(
          "class",
          [existingClass, "latin-layers__svg"].filter(Boolean).join(" ")
        );
        root.setAttribute("aria-hidden", "true");
        root.setAttribute("focusable", "false");
        root.setAttribute("overflow", "visible");

        const layerMap = new Map(
          activeLayers.map((layer, index) => [layer.id, { ...layer, index }])
        );
        const firstEnabledLayer = activeLayers.find(
          (layer) => layer?.id && layer.enabled !== false
        );
        const firstGroup = firstEnabledLayer
          ? root.querySelector(`g[id="${firstEnabledLayer.id}"]`)
          : null;
        const firstRect = firstGroup?.querySelector("rect");
        const baseY = toNumber(firstRect?.getAttribute("y"), 0);
        const baseHeight = Math.max(
          1,
          toNumber(firstRect?.getAttribute("height"), 1)
        );

        root.querySelectorAll("g[id]").forEach((group) => {
          const id = group.getAttribute("id");
          const layerConfig = layerMap.get(id);
          const groupClass = group.getAttribute("class") || "";

          if (!layerConfig || layerConfig.enabled === false) {
            group.setAttribute(
              "class",
              [groupClass, "latin-phrase-layer", "latin-phrase-layer--off"]
                .filter(Boolean)
                .join(" ")
            );
            return;
          }

          const extraDelayMs = Number(layerConfig.extraDelayMs || 0);
          const manualShiftX = toNumber(layerConfig.shiftX, 0);
          const layerDelayMs =
            layerConfig.index * anim.staggerMs + extraDelayMs;
          const rowRect = group.querySelector("rect");
          const rowY = toNumber(rowRect?.getAttribute("y"), baseY);
          const rowHeight = Math.max(
            1,
            toNumber(rowRect?.getAttribute("height"), baseHeight)
          );
          const layerOffsetY = roundValue(baseY - rowY, 4);
          const manualScale = Math.max(0.1, toNumber(layerConfig.scale, 1));
          const layerScale = roundValue(
            (baseHeight / rowHeight) * manualScale,
            6
          );
          const existingStyle = group.getAttribute("style");
          const nextStyle = [
            existingStyle?.trim()?.replace(/;$/, ""),
            `--layer-delay-ms:${layerDelayMs}ms`,
            `--layer-offset-x:${roundValue(manualShiftX, 4)}px`,
            `--layer-offset-y:${layerOffsetY}px`,
            `--layer-scale:${layerScale}`,
          ]
            .filter(Boolean)
            .join(";");

          const glyphNodes = Array.from(group.querySelectorAll("path"));
          glyphNodes.forEach((glyphNode, glyphIndex) => {
            const glyphClass = glyphNode.getAttribute("class") || "";
            glyphNode.setAttribute(
              "class",
              [
                glyphClass,
                "latin-glyph",
                `latin-glyph--l${layerConfig.index}-g${glyphIndex}`,
              ]
                .filter(Boolean)
                .join(" ")
            );
          });

          group.setAttribute("style", nextStyle);
          group.setAttribute(
            "class",
            [groupClass, "latin-phrase-layer"].filter(Boolean).join(" ")
          );
          group.setAttribute("data-layer-id", id);
          group.setAttribute("data-layer-label", layerConfig.label || id);
        });

        setSvgMarkup(root.outerHTML);
      } catch {
        setSvgMarkup("");
        setGlyphAnimationCss("");
      }
    };

    loadSvg();
    return () => {
      isCancelled = true;
    };
  }, [src, activeLayers, anim.staggerMs]);

  useEffect(() => {
    if (!svgMarkup || !wrapperRef.current) return;

    const root = wrapperRef.current.querySelector("svg.latin-layers__svg");
    if (!root) return;

    const enabledLayers = activeLayers.filter((layer) => layer.enabled !== false);
    if (!enabledLayers.length) return;

    const baseId = enabledLayers[0].id;
    const baseGroup = root.querySelector(`g[data-layer-id="${baseId}"]`);
    if (!baseGroup || typeof baseGroup.getBBox !== "function") return;

    let baseCenterX = 0;
    try {
      const baseBBox = baseGroup.getBBox();
      baseCenterX = baseBBox.x + baseBBox.width / 2;
    } catch {
      return;
    }

    const clampPct = (value) => Math.min(100, Math.max(0, roundPct(value)));
    const cssRules = [];

    enabledLayers.forEach((layer, layerIndex) => {
      const mappedIndex = Math.max(
        0,
        activeLayers.findIndex((entry) => entry.id === layer.id)
      );
      const group = root.querySelector(`g[data-layer-id="${layer.id}"]`);
      if (!group || typeof group.getBBox !== "function") return;

      const manualShiftX = toNumber(layer.shiftX, 0);
      const extraDelayMs = toNumber(layer.extraDelayMs, 0);
      let groupBox = null;
      let centerDeltaX = 0;

      try {
        groupBox = group.getBBox();
        centerDeltaX = baseCenterX - (groupBox.x + groupBox.width / 2);
      } catch {
        groupBox = null;
      }

      group.style.setProperty(
        "--layer-offset-x",
        `${roundValue(centerDeltaX + manualShiftX, 4)}px`
      );

      if (!groupBox) return;

      const layerStartMs = layerIndex * anim.staggerMs + extraDelayMs;
      const outBaseMs =
        layerStartMs + anim.revealMs + timeline.glyphInMs + anim.holdMs;
      const inDelayRatio = Math.min(
        0.9,
        Math.max(0, toNumber(anim.inFadeDelayRatio, 0.62))
      );
      const inBlurEndRatio = Math.min(
        0.9,
        Math.max(0.05, toNumber(anim.inBlurEndRatio, 0.52))
      );
      const inPreviewOpacity = Math.min(
        0.5,
        Math.max(0.05, toNumber(anim.inPreviewOpacity, 0.18))
      );
      const outDelayRatio = Math.min(
        0.9,
        Math.max(0, toNumber(anim.outFadeDelayRatio, 0.62))
      );
      const glyphNodes = Array.from(group.querySelectorAll("path.latin-glyph"));
      const groupWidth = Math.max(1, groupBox.width);
      const groupLeft = groupBox.x;

      glyphNodes.forEach((glyphNode, glyphIndex) => {
        if (typeof glyphNode.getBBox !== "function") return;

        let glyphBox = null;
        try {
          glyphBox = glyphNode.getBBox();
        } catch {
          glyphBox = null;
        }
        if (!glyphBox) return;

        const glyphCenterX = glyphBox.x + glyphBox.width / 2;
        const xNorm = Math.min(
          1,
          Math.max(0, (glyphCenterX - groupLeft) / groupWidth)
        );

        const inStartMs = layerStartMs + xNorm * anim.revealMs;
        const inEndMs = inStartMs + timeline.glyphInMs;
        const outStartMs = outBaseMs + xNorm * timeline.outSweepMs;
        const outEndMs = outStartMs + timeline.glyphOutMs;

        const inStartPct = clampPct((inStartMs / timeline.cycleDurationMs) * 100);
        const inEndPct = clampPct((inEndMs / timeline.cycleDurationMs) * 100);
        const outStartPct = clampPct(
          (outStartMs / timeline.cycleDurationMs) * 100
        );
        const outEndPct = clampPct((outEndMs / timeline.cycleDurationMs) * 100);
        const safeInEndPct = Math.max(inEndPct, inStartPct + 0.01);
        const safeOutStartPct = Math.max(outStartPct, safeInEndPct + 0.01);
        const safeOutEndPct = Math.max(outEndPct, safeOutStartPct + 0.01);
        const inFadeStartPct = clampPct(
          inStartPct + (safeInEndPct - inStartPct) * inDelayRatio
        );
        const inBlurEndPct = clampPct(
          inStartPct + (safeInEndPct - inStartPct) * inBlurEndRatio
        );
        const outFadeStartPct = clampPct(
          safeOutStartPct + (safeOutEndPct - safeOutStartPct) * outDelayRatio
        );
        const safeInFadeStartPct = Math.max(
          inStartPct + 0.01,
          Math.min(safeInEndPct - 0.01, inFadeStartPct)
        );
        const safeInBlurEndPct = Math.max(
          inStartPct + 0.01,
          Math.min(safeInFadeStartPct - 0.01, inBlurEndPct)
        );
        const safeOutFadeStartPct = Math.max(
          safeOutStartPct + 0.01,
          Math.min(safeOutEndPct - 0.01, outFadeStartPct)
        );

        const glyphClass = `latin-glyph--l${mappedIndex}-g${glyphIndex}`;
        const keyframeName = `latin-glyph-cycle-l${mappedIndex}-g${glyphIndex}`;

        cssRules.push(
          `.latin-layers--ready .${glyphClass}{animation:${keyframeName} var(--latin-cycle-ms) linear infinite both;animation-delay:var(--latin-start-delay-ms);}`
        );
        cssRules.push(
          `@keyframes ${keyframeName}{0%,${inStartPct}%{opacity:0;filter:blur(var(--latin-max-blur-px));}${safeInBlurEndPct}%{opacity:${inPreviewOpacity};filter:blur(0);}${safeInFadeStartPct}%{opacity:${inPreviewOpacity};filter:blur(0);}${safeInEndPct}%{opacity:1;filter:blur(0);}${safeOutStartPct}%{opacity:1;filter:blur(0);}${safeOutFadeStartPct}%{opacity:1;filter:blur(var(--latin-max-blur-px));}${safeOutEndPct}%{opacity:0;filter:blur(var(--latin-max-blur-px));}100%{opacity:0;filter:blur(var(--latin-max-blur-px));}}`
        );
      });
    });

    setGlyphAnimationCss(cssRules.join("\n"));
  }, [svgMarkup, activeLayers, anim, timeline]);

  const wrapperClassName = useMemo(
    () =>
      ["latin-layers", className, svgMarkup ? "latin-layers--ready" : ""]
        .filter(Boolean)
        .join(" "),
    [className, svgMarkup]
  );

  return (
    <div
      ref={wrapperRef}
      class={wrapperClassName}
      style={{
        "--latin-start-delay-ms": `${anim.startDelayMs}ms`,
        "--latin-cycle-ms": `${timeline.cycleDurationMs}ms`,
        "--latin-max-blur-px": `${anim.maxBlurPx}px`,
      }}
      aria-hidden="true"
    >
      {svgMarkup && (
        <div
          class="latin-layers__svg-wrap"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      )}

      <style>{`
        .latin-layers {
          width: 100%;
          pointer-events: none;
        }

        .latin-layers__svg-wrap {
          width: 100%;
          overflow: visible;
        }

        .latin-layers__svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .latin-phrase-layer {
          transform-box: fill-box;
          transform-origin: center top;
          transform: translateX(var(--layer-offset-x, 0px))
            translateY(var(--layer-offset-y, 0px))
            scale(var(--layer-scale, 1));
          will-change: transform;
        }

        .latin-phrase-layer--off {
          opacity: 0 !important;
          display: none;
        }

        .latin-glyph {
          opacity: 0;
          filter: blur(var(--latin-max-blur-px));
          will-change: opacity, filter;
        }

        .latin-layers--ready .latin-glyph {
          animation-play-state: paused;
        }

        body.preloader-done .latin-layers--ready .latin-glyph {
          animation-play-state: running;
        }
      `}</style>
      {glyphAnimationCss && <style>{glyphAnimationCss}</style>}
    </div>
  );
}
