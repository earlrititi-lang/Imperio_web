import { useEffect } from "preact/hooks";
import LogoImperio from "./LogoImperio";

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

const LATIN_ANIM = {
  delayMs: 420, // Retraso inicial del ciclo tras terminar el preloader
  cycleDurationMs: 15000, // Velocidad global del ciclo (reveal + fade + blur)
  hiddenPauseMs: 5000, // Tiempo oculto total entre desaparicion completa y nuevo ciclo
  fadeInEndPct: 8, // Fin de la aparicion inicial
  blurSoftenPct: 12, // Primer tramo de blur de entrada
  blurClearPct: 24, // Punto en que el texto queda nitido
  blurStartPct: 40, // Inicio del blur final
  blurEndPct: 48, // Fin de subida del blur final
};

const roundPct = (value) => Number(value.toFixed(2));
const hiddenPausePct = roundPct(
  (LATIN_ANIM.hiddenPauseMs / LATIN_ANIM.cycleDurationMs) * 100
);
const fadeInEndPct = LATIN_ANIM.fadeInEndPct;
const fadeEndPct = roundPct(
  Math.min(
    99,
    Math.max(fadeInEndPct + 2, 100 + fadeInEndPct - hiddenPausePct)
  )
);
const revealEndPct = roundPct(Math.max(10, fadeEndPct - 4));
const revealHoldEndPct = roundPct(Math.max(revealEndPct, fadeEndPct - 2));
const revealResetPct = roundPct(Math.min(99, fadeEndPct + 1));
const fadeStartPct = revealEndPct;
const blurStartPct = LATIN_ANIM.blurStartPct;
const blurEndPct = LATIN_ANIM.blurEndPct;
const blurSoftenPct = LATIN_ANIM.blurSoftenPct;
const blurClearPct = LATIN_ANIM.blurClearPct;

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
              <img
                src="/images/LATIN1.svg"
                alt=""
                class="hero-imperio__latin-image"
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
        }

        .hero-imperio__wordmark {
          display: inline-block;
          width: min(70vw, 450px);
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
          width: min(82vw, 320px);
          margin-top: 0.65rem;
          transform: translate(var(--latin-x), var(--latin-y));
          opacity: var(--latin-opacity);
          pointer-events: none;
        }

        .hero-imperio__latin-image {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            transparent 24%,
            #000 44%,
            #000 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            transparent 24%,
            #000 44%,
            #000 100%
          );
          -webkit-mask-size: 240% 100%;
          mask-size: 240% 100%;
          -webkit-mask-position: 100% 0;
          mask-position: 100% 0;
          filter: blur(1.2px);
          will-change: opacity, filter, mask-position, -webkit-mask-position;
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

        body.preloader-done .hero-imperio__latin-image {
          animation: latin-reveal-letters ${LATIN_ANIM.cycleDurationMs}ms linear ${LATIN_ANIM.delayMs}ms infinite,
          latin-fade-cycle ${LATIN_ANIM.cycleDurationMs}ms linear ${LATIN_ANIM.delayMs}ms infinite,
          latin-blur-cycle ${LATIN_ANIM.cycleDurationMs}ms linear ${LATIN_ANIM.delayMs}ms infinite;
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

        @keyframes latin-reveal-letters {
          0% {
            -webkit-mask-position: 100% 0;
            mask-position: 100% 0;
          }
          ${revealEndPct}% {
            -webkit-mask-position: 0% 0;
            mask-position: 0% 0;
          }
          ${revealHoldEndPct}% {
            -webkit-mask-position: 0% 0;
            mask-position: 0% 0;
          }
          ${revealResetPct}% {
            -webkit-mask-position: 100% 0;
            mask-position: 100% 0;
          }
          100% {
            -webkit-mask-position: 100% 0;
            mask-position: 100% 0;
          }
        }

        @keyframes latin-fade-cycle {
          0% {
            opacity: 0;
          }
          ${fadeInEndPct}% {
            opacity: 1;
          }
          ${fadeStartPct}% {
            opacity: 1;
          }
          ${fadeEndPct}% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes latin-blur-cycle {
          0% {
            filter: blur(10px);
          }
          ${blurSoftenPct}% {
            filter: blur(2.5px);
          }
          ${blurClearPct}% {
            filter: blur(0);
          }
          ${blurStartPct}% {
            filter: blur(0);
          }
          ${blurEndPct}% {
            filter: blur(3px);
          }
          100% {
            filter: blur(10px);
          }
        }

        @media (max-width: 768px) {
          .hero-imperio__headline {
            left: 50%;
            top: 58%;
            transform: translate(-50%, -50%);
          }

          .hero-imperio__latin-block {
            width: min(90vw, 460px);
            margin-top: 0.85rem;
          }

          .hero-imperio__wordmark {
            width: min(86vw, 520px);
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
