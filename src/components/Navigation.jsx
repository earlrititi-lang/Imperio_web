import { NAV_ITEMS } from "../config/navigation";

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
        <div class="main-nav__merge-sheet" aria-hidden="true"></div>
        <div class="main-nav__floating-links-layer hidden md:block" aria-hidden="true">
          <div class="main-nav__floating-links-wrap">
            <ul class="main-nav__floating-links nav-links-cluster text-sm font-medium tracking-wide uppercase">
              {NAV_ITEMS.map((item) => (
                <li key={`floating-${item.href}`}>
                  <span class="nav-link main-nav__link main-nav__link--ghost text-sm md:text-base font-medium uppercase tracking-wider">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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

          <div class="main-nav__links-wrap hidden md:block">
            <ul class="main-nav__links nav-links-cluster text-sm font-medium tracking-wide uppercase">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    class="nav-link main-nav__link text-sm md:text-base font-medium uppercase tracking-wider transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            id="mobile-menu-btn"
            type="button"
            class="menu-button"
            aria-label="Abrir menu"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="menu-icon" aria-hidden="true">
              <span class="menu-icon__line menu-icon__line--top"></span>
              <span class="menu-icon__line menu-icon__line--middle"></span>
              <span class="menu-icon__line menu-icon__line--bottom"></span>
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
            <ul class="mt-16 space-y-6 text-3xl font-bold">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        .main-nav__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--home-nav-logo-x, 16px);
          padding-block: 8px;
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

        .main-nav__merge-sheet {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          z-index: 0;
          background: rgba(255, 255, 255, 0.97);
          opacity: calc(var(--nav-links-progress, 0) * 0.96);
          box-shadow: 0 10px 34px rgba(0, 0, 0, calc(var(--nav-links-progress, 0) * 0.12));
          will-change: opacity;
          pointer-events: none;
        }

        .main-nav__logo {
          width: auto;
          height: 2.7rem;
          opacity: var(--home-nav-logo-opacity, 1);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .main-nav__floating-links-layer {
          position: fixed;
          inset: 0;
          z-index: 3;
          opacity: 0;
          pointer-events: none;
          will-change: opacity;
        }

        .main-nav__floating-links-wrap {
          position: absolute;
          left: var(--nav-floating-x, 50vw);
          top: var(--nav-floating-y, -200px);
          width: max-content;
          transform: translate(-50%, -50%);
          will-change: left, top;
        }

        .main-nav__floating-links {
          color: #111;
          opacity: 1;
        }

        .main-nav__links-wrap {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 2;
          transform: translate(-50%, -50%);
        }

        .main-nav__links {
          color: #111;
          opacity: 0;
          will-change: opacity;
          pointer-events: none;
        }

        #main-nav.main-nav--merged .main-nav__links {
          pointer-events: auto;
        }

        .main-nav__link {
          color: rgba(17, 17, 17, calc(0.58 + var(--nav-links-progress, 0) * 0.42));
          white-space: nowrap;
        }

        .main-nav__link:hover,
        .main-nav__link:focus-visible {
          color: var(--color-red-accent);
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
          color: #fff;
          -webkit-tap-highlight-color: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          mix-blend-mode: difference;
          transition: color 0.14s linear, mix-blend-mode 0s linear 0.14s;
        }

        #main-nav.main-nav--hamburger-dark .menu-button {
          color: #111;
          mix-blend-mode: normal;
          transition-delay: 0s;
        }

        .menu-icon {
          position: relative;
          width: 34px;
          height: 34px;
          display: block;
        }

        .menu-icon__line {
          position: absolute;
          left: 3px;
          width: 28px;
          height: 2px;
          background: currentColor;
          border-radius: 999px;
          display: block;
          transform-origin: 50% 50%;
          will-change: transform, opacity;
        }

        .menu-icon__line--top {
          left: 3px;
          width: 14px;
          transform-origin: 0% 50%;
          transform: translateY(9px) rotate(0deg);
        }

        .menu-icon__line--middle {
          left: 3px;
          width: 28px;
          transform-origin: 50% 50%;
          transform: translateY(16px) rotate(0deg);
          opacity: 1;
        }

        .menu-icon__line--bottom {
          left: 17px;
          width: 14px;
          transform-origin: 100% 50%;
          transform: translateY(23px) rotate(0deg);
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
          --nav-links-progress: 0;
          --nav-docked-opacity: 0;
          --nav-floating-opacity: 0;
          --nav-floating-x: 50vw;
          --nav-floating-y: -200px;
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
            height: 2.95rem;
          }
        }

        @media (max-width: 767px) {
          .main-nav__floating-links-layer,
          .main-nav__links-wrap {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
