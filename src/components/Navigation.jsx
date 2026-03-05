export default function Navigation() {
  return (
    <>
      <nav
        id="main-nav"
        aria-label="Navegacion principal"
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div class="main-nav__fx" aria-hidden="true">
          <canvas id="main-nav-fx-canvas" class="main-nav__fx-canvas" />
        </div>

        <div class="main-nav__inner">
          <a
            href="/"
            aria-label="Ir al inicio"
            class="main-nav__brand text-2xl font-bold tracking-tight hover:text-[var(--color-red-accent)] transition-colors"
          >
            <img
              src="/images/logo-redv2.png"
              alt="El Siglo Espanol"
              class="main-nav__logo"
            />
          </a>

          <ul class="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase"></ul>

          <button
            id="mobile-menu-btn"
            type="button"
            class="menu-button w-12 h-10 flex items-center justify-center"
            aria-label="Abrir menu"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <svg class="menu-icon" viewBox="0 0 32 20" aria-hidden="true">
              <line x1="2" y1="6" x2="30" y2="6" />
              <line x1="2" y1="14" x2="30" y2="14" />
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-hidden="true"
          class="fixed inset-0 bg-black text-white transform translate-x-full transition-transform duration-500 md:hidden"
        >
          <div class="container mx-auto px-6 py-6">
            <button id="close-menu" type="button" class="ml-auto block text-4xl" aria-label="Cerrar menu">
              &times;
            </button>
            <ul class="mt-16 space-y-6 text-3xl font-bold"></ul>
          </div>
        </div>
      </nav>

      <style>{`
        .main-nav__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--home-nav-logo-x, 16px);
          padding-block: var(--home-nav-logo-y, 12px);
        }

        .main-nav__fx {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .main-nav__fx-canvas {
          display: block;
          width: 100%;
          height: 100%;
          opacity: calc(0.35 + var(--nav-progress, 0) * 0.95);
          transform: translateZ(0);
        }

        .main-nav__brand {
          display: inline-flex;
          align-items: center;
          margin: 0;
        }

        .main-nav__logo {
          width: auto;
          height: 3rem;
          opacity: var(--home-nav-logo-opacity, 1);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .main-nav__brand:hover .main-nav__logo,
        .main-nav__brand:focus-visible .main-nav__logo {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .menu-button {
          border: 1px solid transparent;
          background: transparent;
          padding: 0;
        }

        .menu-icon {
          width: 34px;
          height: 22px;
          stroke: #000000;
          stroke-width: 2.2;
          stroke-linecap: round;
        }

        #main-nav {
          --nav-progress: 0;
          --nav-base-alpha: 0.08;
          background: rgba(255, 255, 255, calc(var(--nav-base-alpha) + var(--nav-progress) * 0.08));
          box-shadow: 0 2px 20px rgba(0, 0, 0, calc(var(--nav-progress) * 0.14));
          backdrop-filter: blur(calc(var(--nav-progress) * 11px));
          -webkit-backdrop-filter: blur(calc(var(--nav-progress) * 11px));
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s linear;
        }

        body.preloader-done #main-nav {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        @media (min-width: 768px) {
          .main-nav__logo {
            height: 3.25rem;
          }
        }
      `}</style>
    </>
  );
}
