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
            class="menu-button"
            aria-label="Abrir menu"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="menu-button__icon" aria-hidden="true">
              <span class="menu-fallback">
                <span class="menu-fallback__line menu-fallback__line--top"></span>
                <span class="menu-fallback__line menu-fallback__line--middle"></span>
                <span class="menu-fallback__line menu-fallback__line--bottom"></span>
              </span>
              <span class="menu-sprite"></span>
            </span>
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
          width: 48px;
          height: 44px;
          color: #000;
          -webkit-tap-highlight-color: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          --menu-icon-duration: 666.667ms;
        }

        .menu-button__icon {
          position: relative;
          width: 34px;
          height: 34px;
          display: block;
        }

        .menu-fallback,
        .menu-sprite {
          position: absolute;
          inset: 0;
        }

        .menu-fallback {
          z-index: 0;
        }

        .has-islands .menu-fallback {
          display: none;
        }

        .menu-fallback__line {
          position: absolute;
          left: 3px;
          width: 28px;
          height: 4px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 0.15s linear, opacity 0.12s linear, top 0.15s linear;
        }

        .menu-fallback__line--top {
          top: 7px;
        }

        .menu-fallback__line--middle {
          top: 15px;
        }

        .menu-fallback__line--bottom {
          top: 23px;
        }

        .menu-button.is-open .menu-fallback__line--top {
          top: 15px;
          transform: rotate(45deg);
        }

        .menu-button.is-open .menu-fallback__line--middle {
          opacity: 0;
        }

        .menu-button.is-open .menu-fallback__line--bottom {
          top: 15px;
          transform: rotate(-45deg);
        }

        .menu-sprite {
          z-index: 1;
          display: block;
          width: 34px;
          height: 34px;
          background-repeat: no-repeat;
          filter: brightness(0);
          will-change: background-position;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .menu-button.is-animating .menu-fallback {
          opacity: 0;
        }

        .menu-button:hover {
          opacity: 1;
        }

        .menu-button:focus-visible {
          outline: 2px solid rgba(0, 0, 0, 0.35);
          outline-offset: 4px;
          border-radius: 8px;
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
