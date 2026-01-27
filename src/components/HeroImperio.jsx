import { useEffect } from "preact/hooks";

export default function HeroImperio() {
  useEffect(() => {
    const heroWords = document.querySelectorAll(".hero-word");
    const subtitle = document.querySelector(".hero-subtitle");
    const nav = document.querySelector(".hero-nav");
    const logoSmall = document.querySelector(".hero-logo-small");

    if (logoSmall) {
      window.setTimeout(() => {
        logoSmall.style.transition = "opacity 0.8s ease";
        logoSmall.style.opacity = "1";
      }, 200);
    }

    heroWords.forEach((word, index) => {
      window.setTimeout(() => {
        word.style.transition =
          "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.2s ease";
        word.style.transform = "translateY(0)";
        word.style.opacity = "1";
      }, 600 + index * 200);
    });

    if (subtitle) {
      window.setTimeout(() => {
        subtitle.style.transition = "opacity 1s ease";
        subtitle.style.opacity = "1";
      }, 600 + heroWords.length * 200 + 400);
    }

    if (nav) {
      window.setTimeout(() => {
        nav.style.transition = "opacity 1s ease";
        nav.style.opacity = "1";
      }, 600 + heroWords.length * 200 + 800);
    }

    const onScroll = () => {
      const heroBackground = document.querySelector(".hero-background");
      if (!heroBackground) return;
      const scrolled = window.pageYOffset;
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <section class="hero-imperio relative min-h-screen flex flex-col justify-between overflow-hidden bg-black">
        <div class="hero-background absolute inset-0 opacity-35">
          <img
            src="/images/mapa-historico-bg-1280.jpg"
            srcSet="/images/mapa-historico-bg-640.jpg 640w, /images/mapa-historico-bg-960.jpg 960w, /images/mapa-historico-bg-1280.jpg 1280w, /images/mapa-historico-bg-1920.jpg 1920w"
            sizes="100vw"
            alt="Mapa historico Imperio Espanol"
            class="w-full h-full object-cover"
            decoding="async"
          />
        </div>

        <div class="hero-content flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <div class="hero-logo-small mb-12 opacity-0">
            <img
              src="/images/logo-white.svg"
              alt="El Siglo Espanol"
              class="h-16"
            />
          </div>

          <h1 class="hero-title text-center mb-8">
            <span class="hero-line block overflow-hidden">
              <span class="hero-word text-white">EL IMPERIO</span>
            </span>
            <span class="hero-line block overflow-hidden">
              <span class="hero-word text-white">ESPANOL</span>
            </span>
          </h1>

          <div class="hero-subtitle max-w-2xl text-center opacity-0">
            <p class="text-white/70 text-lg md:text-xl leading-relaxed">
              El Siglo Espanol disena ambientes que conectan personas, lugares y
              propositos. Desde residencias atemporales hasta proyectos
              emblematicos del Imperio, nuestro trabajo forja un impacto duradero.
            </p>
          </div>
        </div>

        <nav class="hero-nav relative z-10 pb-0 opacity-0">
          <div class="hero-nav__surface">
            <div class="container mx-auto px-6">
              <ul class="flex flex-wrap justify-between items-center text-black w-full max-w-6xl mx-auto gap-6 md:gap-0">
                <li>
                  <a
                    href="/sobre-nosotros"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="/articulos"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Articulos
                  </a>
                </li>
                <li>
                  <a
                    href="/biblioteca"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Biblioteca
                  </a>
                </li>
                <li>
                  <a
                    href="/foro"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Foro
                  </a>
                </li>
                <li>
                  <a
                    href="/tienda"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Tienda
                  </a>
                </li>
                <li>
                  <a
                    href="/contacto"
                    class="nav-link text-sm md:text-base font-medium uppercase tracking-wider hover:text-[var(--color-red-accent)] transition-colors duration-300"
                  >
                    Contacto
                  </a>
                </li>
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

        .hero-background img {
          filter: brightness(1.1) contrast(1.2);
        }

        .hero-title {
          font-size: clamp(4rem, 15vw, 12rem);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.03em;
        }

        .hero-word {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
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
          .hero-title {
            font-size: clamp(3rem, 12vw, 6rem);
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
