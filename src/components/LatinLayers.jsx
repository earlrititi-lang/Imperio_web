import { useEffect, useMemo, useState } from "preact/hooks";

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
  revealMs: 1400, // Tiempo de barrido de izquierda a derecha
  holdMs: 1200, // Tiempo visible sin perder opacidad
  fadeMs: 900, // Tiempo de desvanecido final
  blurLeadMs: 280, // Cuanto antes de fade empieza el blur
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

  const activeLayers = useMemo(
    () => (Array.isArray(layers) ? layers.filter((layer) => layer?.id) : []),
    [layers]
  );

  const timeline = useMemo(() => {
    const layerCount = Math.max(1, activeLayers.length);
    const phraseWindowMs =
      animation.revealMs + animation.holdMs + animation.fadeMs;
    const cycleDurationMs =
      phraseWindowMs +
      (layerCount - 1) * animation.staggerMs +
      animation.loopPauseMs;

    const revealEndPct = roundPct((animation.revealMs / cycleDurationMs) * 100);
    const holdEndPct = roundPct(
      ((animation.revealMs + animation.holdMs) / cycleDurationMs) * 100
    );
    const blurStartMs = Math.max(
      animation.revealMs,
      animation.revealMs + animation.holdMs - animation.blurLeadMs
    );
    const blurStartPct = roundPct((blurStartMs / cycleDurationMs) * 100);
    const fadeEndPct = roundPct((phraseWindowMs / cycleDurationMs) * 100);
    const resetPct = roundPct(Math.min(99.5, fadeEndPct + 0.5));

    return {
      cycleDurationMs,
      revealEndPct,
      holdEndPct,
      blurStartPct,
      fadeEndPct,
      resetPct,
    };
  }, [activeLayers.length, animation]);

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
          const layerDelayMs =
            layerConfig.index * animation.staggerMs + extraDelayMs;
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
            `--layer-offset-y:${layerOffsetY}px`,
            `--layer-scale:${layerScale}`,
          ]
            .filter(Boolean)
            .join(";");

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
      }
    };

    loadSvg();
    return () => {
      isCancelled = true;
    };
  }, [src, activeLayers, animation.staggerMs]);

  const wrapperClassName = useMemo(
    () =>
      ["latin-layers", className, svgMarkup ? "latin-layers--ready" : ""]
        .filter(Boolean)
        .join(" "),
    [className, svgMarkup]
  );

  return (
    <div
      class={wrapperClassName}
      style={{
        "--latin-start-delay-ms": `${animation.startDelayMs}ms`,
        "--latin-cycle-ms": `${timeline.cycleDurationMs}ms`,
        "--latin-max-blur-px": `${animation.maxBlurPx}px`,
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
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          transform-box: fill-box;
          transform-origin: left top;
          transform: translateY(var(--layer-offset-y, 0px))
            scale(var(--layer-scale, 1));
          filter: blur(var(--latin-max-blur-px));
          will-change: opacity, filter, clip-path, transform;
        }

        .latin-phrase-layer--off {
          opacity: 0 !important;
          display: none;
        }

        body.preloader-done .latin-layers--ready .latin-phrase-layer:not(.latin-phrase-layer--off) {
          animation: latin-layer-cycle var(--latin-cycle-ms) linear infinite both;
          animation-delay: calc(var(--latin-start-delay-ms) + var(--layer-delay-ms, 0ms));
        }

        @keyframes latin-layer-cycle {
          0% {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
            filter: blur(var(--latin-max-blur-px));
          }
          ${timeline.revealEndPct}% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            filter: blur(0);
          }
          ${timeline.blurStartPct}% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            filter: blur(0);
          }
          ${timeline.holdEndPct}% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            filter: blur(calc(var(--latin-max-blur-px) * 0.65));
          }
          ${timeline.fadeEndPct}% {
            opacity: 0;
            clip-path: inset(0 0 0 0);
            filter: blur(var(--latin-max-blur-px));
          }
          ${timeline.resetPct}% {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
            filter: blur(var(--latin-max-blur-px));
          }
          100% {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
            filter: blur(var(--latin-max-blur-px));
          }
        }
      `}</style>
    </div>
  );
}
