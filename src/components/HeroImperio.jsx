import { useEffect } from "preact/hooks";
import LogoImperio from "./LogoImperio";
import LatinLayers from "./LatinLayers";

const HERO_IMAGE_DEFAULT_SRC = "/images/preloader/preload-6-def.png";

const NAV_ITEMS = [
  { href: "/sobre-nosotros", label: "Memorial" },
  { href: "/articulos", label: "Papeles y Tratados" },
  { href: "/biblioteca", label: "Libreria" },
  { href: "/foro", label: "Mentidero" },
  { href: "/tienda", label: "Casa de Mercaderias" },
  { href: "/contacto", label: "Audiencia" },
];

// Ajustes rapidos por bloque (posicion y estado visual)
const LAYER_STATE = {
  imperio: { x: "0px", y: "0px", opacity: 1 },
  espanol: { x: "0px", y: "0px", opacity: 1 },
  latin: { x: "0px", y: "0px", opacity: 1 },
};

const LAYER_VARS = {
  "--imperio-x": LAYER_STATE.imperio.x,
  "--imperio-y": LAYER_STATE.imperio.y,
  "--imperio-opacity": LAYER_STATE.imperio.opacity,
  "--espanol-x": LAYER_STATE.espanol.x,
  "--espanol-y": LAYER_STATE.espanol.y,
  "--espanol-opacity": LAYER_STATE.espanol.opacity,
  "--latin-x": LAYER_STATE.latin.x,
  "--latin-y": LAYER_STATE.latin.y,
  "--latin-opacity": LAYER_STATE.latin.opacity,
};

const LATIN_LAYER_SEQUENCE = [
  { id: "Non_sufficit_orbis", label: "Non sufficit orbis", shiftX: 13 },
  { id: "Plus_ultra", label: "Plus ultra", shiftX: 138 },
  { id: "A_solis_ortu_usque_ad_occasum", label: "A solis ortu usque ad occasum", scale: 2, shiftX: 100 },
  { id: "Fiat_justitia_et_pereat_mundus", label: "Fiat justitia et pereat mundus", scale: 2, shiftX: 118 },
  { id: "Ante_ferit_quam_flamma_micet", label: "Ante ferit quam flamma micet", scale: 2, shiftX: 120 },
  { id: "Nec_spe_nec_metu", label: "Nec spe nec metu", scale: 2, shiftX: 328 },
  { id: "Iam_illvstrabit_omnia", label: "Iam illvstrabit omnia", scale: 2, shiftX: 275 },
  { id: "Pace_mare_terraqve_composita", label: "Pace mare terraqve composita", scale: 2, shiftX: 110 },
  { id: "Fidei_defensor", label: "Fidei defensor", scale: 2, shiftX: 385 },
];

const LATIN_LAYER_ANIM = {
  startDelayMs: 420, // Espera tras preloader
  revealMs: 1400, // Barrido de entrada izquierda -> derecha
  glyphInMs: 2000, // Blur/Fade-in de cada glifo (mucho mas largo)
  inFadeDelayRatio: 0.7, // Delay del fade-in ~x2 frente al ajuste anterior
  inBlurEndRatio: 0.9, // Mantiene el blur-in hasta justo antes del fade-in
  inPreviewOpacity: 0.24, // Opacidad parcial para apreciar el blur-in
  holdMs: 4000, // Tiempo visible a opacidad completa y sin blur
  outSweepMs: 1400, // Barrido de salida izquierda -> derecha
  glyphOutMs: 2000, // Blur/Fade-out de cada glifo (mucho mas largo)
  outFadeDelayRatio: 0.9, // Delay del fade-out ~x2 frente al ajuste anterior
  staggerMs: 8000, // Distancia temporal entre frases (8s)
  loopPauseMs: 0, // Pausa completa al final del ciclo
  maxBlurPx: 8,
};

export default function HeroImperio() {
  useEffect(() => {
    const heroBackground = document.querySelector(".hero-background");
    const heroImage = heroBackground?.querySelector("img");

    const onScroll = () => {
      if (!heroBackground) return;
      const target = heroImage || heroBackground;
      if (!document.body.classList.contains("preloader-done")) {
        target.style.transform = "translateY(0)";
        return;
      }
      const scrolled = window.pageYOffset;
      target.style.transform = `translateY(${scrolled * 0.5}px)`;
    };

    const setHeroImage = (src) => {
      if (!heroImage || !src) return;
      if (heroImage.getAttribute("src") === src) return;
      const next = new window.Image();
      next.decoding = "async";
      next.src = src;
      next
        .decode()
        .catch(() => undefined)
        .finally(() => {
          heroImage.src = src;
        });
    };

    if (heroImage) {
      heroImage.src = HERO_IMAGE_DEFAULT_SRC;
      heroImage.decoding = "async";
      heroImage.fetchPriority = "high";
      heroImage.loading = "eager";
      heroImage.decode().catch(() => undefined);
    }

    const onLastImage = (event) => {
      const src = event?.detail?.src;
      if (src) setHeroImage(src);
    };

    const onPreloaderDone = () => {
      onScroll();
    };

    window.addEventListener("preloader:last-image", onLastImage, { once: true });
    window.addEventListener("preloader:done", onPreloaderDone, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("preloader:last-image", onLastImage);
      window.removeEventListener("preloader:done", onPreloaderDone);
    };
  }, []);

  return (
    <>
      <section class="hero-imperio relative min-h-screen flex flex-col justify-between overflow-hidden bg-black">
        <div class="hero-background absolute inset-0" aria-hidden="true">
          <img
            src="/images/preloader/preload-6-def.png"
            alt=""
            class="hero-background__img"
          />
        </div>

        <div class="hero-content hero-imperio__content flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <div class="hero-imperio__headline" style={LAYER_VARS}>
            <h1 class="hero-imperio__title">
              <LogoImperio
                width={720}
                className="hero-imperio__wordmark"
                title="Imperio Espanol"
                classes={{
                  corona: "hero-imperio__corona-part",
                  imperio: "hero-imperio__imperio-part",
                  espanol: "hero-imperio__espanol-part",
                }}
              />
            </h1>

            <div class="hero-imperio__latin-block" aria-hidden="true">
              <LatinLayers
                src="/images/Letras_latin.svg"
                className="hero-imperio__latin-layers"
                layers={LATIN_LAYER_SEQUENCE}
                animation={LATIN_LAYER_ANIM}
              />
            </div>
          </div>
        </div>

        <nav class="hero-nav hero-imperio__nav relative z-10 pb-0 opacity-0">
          <div class="hero-nav__surface">
            <div class="container mx-auto px-6">
              <ul class="flex flex-wrap justify-between items-center text-black w-full max-w-6xl mx-auto gap-6 md:gap-0">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </section>

      <style>{`
        .hero-imperio {
          min-height: 100vh;
          position: relative;
        }

        .hero-background {
          pointer-events: none;
          opacity: 0;
        }

        body.preloader-handoff .hero-background,
        body.preloader-done .hero-background {
          opacity: 1;
        }

        .hero-background__img {
          filter: brightness(0.75);
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
          object-position: center;
          will-change: transform;
        }

        .hero-imperio__headline {
          --wordmark-w: min(70vw, 450px);
          --imperio-x: 0px;
          --imperio-y: 0px;
          --imperio-opacity: 0.5;
          --espanol-x: 0px;
          --espanol-y: 0px;
          --espanol-opacity: 1;
          --latin-x: 0px;
          --latin-y: 0px;
          --latin-opacity: 1;
          position: absolute;
          left: 40%;
          top: 58%;
          transform: translate(-10%, -50%);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          z-index: 2;
        }

        .hero-imperio__title {
          margin: 0;
          line-height: 0;
          width: var(--wordmark-w);
          display: flex;
          justify-content: center;
        }

        .hero-imperio__wordmark {
          display: inline-block;
          width: 100%;
          height: auto;
          transform: translateY(40px);
          opacity: 0;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 1.2s ease;
        }

        .hero-imperio__corona-part {
          visibility: hidden;
          
        }

        .hero-imperio__imperio-part,
        .hero-imperio__espanol-part {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform, opacity, filter;
        }

        .hero-imperio__imperio-part {
          opacity: 0;
          transform: translate(var(--imperio-x), calc(var(--imperio-y) + 28px));
          transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 1s ease;
          transition-delay: 220ms;
        }

        .hero-imperio__espanol-part {
          opacity: 0;
          transform: translate(var(--espanol-x), calc(var(--espanol-y) + 130px));
          filter: url(#logo-noise);
          transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 1.6s ease,
            filter 1.2s ease;
          transition-delay: 520ms;
        }

        .hero-imperio__latin-block {
          width: var(--wordmark-w);
          margin-top: 0.65rem;
          transform: translate(var(--latin-x), var(--latin-y));
          opacity: var(--latin-opacity);
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-imperio__latin-layers {
          display: block;
          width: 100%;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .hero-imperio__nav {
          opacity: 0;
          transform: translateY(72px);
          will-change: transform, opacity;
          transition: transform 1.15s cubic-bezier(0.2, 0.9, 0.22, 1),
            opacity 0.85s ease;
        }

        body.preloader-done .hero-imperio__wordmark {
          opacity: 1;
          transform: translateY(0);
        }

        body.preloader-done .hero-imperio__imperio-part {
          opacity: var(--imperio-opacity);
          transform: translate(var(--imperio-x), var(--imperio-y));
        }

        body.preloader-done .hero-imperio__espanol-part {
          opacity: var(--espanol-opacity);
          transform: translate(var(--espanol-x), var(--espanol-y));
          filter: none;
        }

        body.preloader-done .hero-imperio__latin-layers {
          opacity: 1;
        }

        body.preloader-done .hero-imperio__nav {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 900ms;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
        }

        .nav-link::before,
        .nav-link::after {
          content: '[';
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(-6px);
          color: var(--color-red-accent);
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .nav-link::after {
          content: ']';
          left: auto;
          right: 0;
          transform: translateY(-50%) translateX(6px);
        }

        .nav-link:hover::before,
        .nav-link:hover::after {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        @media (max-width: 768px) {
          .hero-imperio__headline {
            --wordmark-w: min(86vw, 520px);
            left: 50%;
            top: 58%;
            transform: translate(-50%, -50%);
          }

          .hero-imperio__latin-block {
            margin-top: 0.85rem;
          }

          .hero-nav ul {
            gap: 1rem;
          }

          .nav-link {
            font-size: 0.75rem;
          }
        }

        .hero-nav__surface {
          background: var(--color-white-pure);
          padding: 20px 0 24px;
        }
      `}</style>
    </>
  );
}
