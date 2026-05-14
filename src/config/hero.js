import { withBase } from "../utils/basePath";

export const HERO_VIEW_TRANSITION_NAME = "imperio-preloader-hero";
export const HERO_IMAGE_DEFAULT_SRC = withBase("/images/preloader/Preload_6_def_upscaled_2x.png");

export const HERO_LAYER_VARS = {
  "--imperio-x": "0px",
  "--imperio-y": "0px",
  "--imperio-opacity": 1,
  "--espanol-x": "0px",
  "--espanol-y": "0px",
  "--espanol-opacity": 1,
  "--latin-x": "0px",
  "--latin-y": "0px",
  "--latin-opacity": 0.9,
};

export const HERO_ENTRANCE_SEQUENCE = {
  wordmarkDelayMs: 980,
  navBandDelayMs: 2850,
  latinDelayMs: 4300,
};

export const LATIN_LAYER_SEQUENCE = [
  { id: "Non_sufficit_orbis", label: "Non sufficit orbis" },
  { id: "Plus_ultra", label: "Plus ultra" },
  { id: "A_solis_ortu_usque_ad_occasum", label: "A solis ortu usque ad occasum", scale: 2 },
  { id: "Fiat_justitia_et_pereat_mundus", label: "Fiat justitia et pereat mundus", scale: 2 },
  { id: "Ante_ferit_quam_flamma_micet", label: "Ante ferit quam flamma micet", scale: 2 },
  { id: "Nec_spe_nec_metu", label: "Nec spe nec metu", scale: 2 },
  { id: "Iam_illvstrabit_omnia", label: "Iam illvstrabit omnia", scale: 2 },
  { id: "Pace_mare_terraqve_composita", label: "Pace mare terraqve composita", scale: 2 },
  { id: "Fidei_defensor", label: "Fidei defensor", scale: 2 },
];

export const LATIN_LAYER_ANIMATION = {
  startDelayMs: 120,
  revealMs: 1400,
  glyphInMs: 2000,
  inFadeDelayRatio: 0.84,
  inPreviewLeadRatio: 0.08,
  inBlurEndRatio: 0.78,
  inPreviewOpacity: 0.62,
  holdMs: 4000,
  outSweepMs: 1400,
  glyphOutMs: 2000,
  outFadeDelayRatio: 0.9,
  staggerMs: 10000,
  loopPauseMs: 0,
  maxBlurPx: 10,
};

export const PRELOADER_SEQUENCE_IMAGES = [
  {
    src: withBase("/images/preloader/Preload_1_def_upscaled_2x.png"),
    alt: "Cargando 1",
    scaleEnd: "1",
  },
  {
    src: withBase("/images/preloader/Preload_2_def_upscaled_2x.png"),
    alt: "Cargando 2",
    scaleEnd: "0.988",
  },
  {
    src: withBase("/images/preloader/Preload_Archivo.png"),
    alt: "Cargando archivo",
    scaleEnd: "0.976",
  },
  {
    src: withBase("/images/preloader/Preload_4_def_upscaled_2x.png"),
    alt: "Cargando 4",
    scaleEnd: "0.964",
  },
  {
    src: withBase("/images/preloader/Preload_5_def_upscaled_2x.png"),
    alt: "Cargando 5",
    scaleEnd: "0.952",
  },
  {
    src: withBase("/images/preloader/Preload_3_def_upscaled_2x.png"),
    alt: "Cargando 6",
    scaleEnd: "0.94",
    shrinkTrigger: true,
  },
];
