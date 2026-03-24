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
        </div>
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

      </nav>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        class="side-bar"
      >
        <div class="side-bar__media" aria-hidden="true">
          <img
            src="/images/red_hamburguer.png"
            alt=""
            class="side-bar__media-image"
          />
        </div>
        <div class="side-bar__veil" aria-hidden="true"></div>

        <div class="side-bar__panel container mx-auto px-6 py-6">
          <ul class="side-bar__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} class="side-bar__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .main-nav__inner {
          position: relative;
          z-index: 4;
          width: 100%;
          min-height: calc(var(--space-unit) * 8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--home-nav-logo-x, 16px);
          padding-block: var(--space-1);
        }

        .main-nav__fx {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          /* Para los alumnos:
             Este fondo siempre es un linear-gradient vertical.
             Solo cambiamos tres variables desde JS:
             1. la opacidad del blanco arriba,
             2. la opacidad del blanco abajo,
             3. y hasta donde "baja" el gradiente. */
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, calc(var(--nav-glass-alpha, 0.12) * 0.95)) 0%,
              rgba(255, 255, 255, 0) 42%
            ),
            radial-gradient(
              circle at 18% 0%,
              rgba(255, 255, 255, var(--nav-glass-line-alpha, 0.22)) 0%,
              rgba(255, 255, 255, 0) 58%
            ),
            rgba(255, 255, 255, var(--nav-gradient-top-alpha, 0.15));
          background: -webkit-linear-gradient(
            180deg,
            rgba(255, 255, 255, var(--nav-gradient-top-alpha, 0.15)) 0%,
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0))
              var(--nav-gradient-stop, 5%),
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0)) 100%
          );
          background: -moz-linear-gradient(
            180deg,
            rgba(255, 255, 255, var(--nav-gradient-top-alpha, 0.15)) 0%,
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0))
              var(--nav-gradient-stop, 5%),
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0)) 100%
          );
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, var(--nav-gradient-top-alpha, 0.15)) 0%,
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0))
              var(--nav-gradient-stop, 5%),
            rgba(255, 255, 255, var(--nav-gradient-bottom-alpha, 0)) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, var(--nav-glass-line-alpha, 0.22)),
            inset 0 -1px 0 rgba(255, 255, 255, calc(var(--nav-glass-line-alpha, 0.22) * 0.35));
        }

        .main-nav__brand {
          display: inline-flex;
          align-items: center;
          margin: 0;
          transition: opacity 0.28s ease;
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
          transition: opacity 0.28s ease;
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
          top: calc(50% + var(--nav-letters-offset-y, 0px));
          z-index: 2;
          transform: translate(-50%, -50%);
          transition: opacity 0.28s ease;
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
          position: relative;
          z-index: 8;
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
          transition: color 0.18s linear, mix-blend-mode 0s linear 0.18s;
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

        .side-bar {
          position: fixed;
          inset: 0;
          z-index: 60;
          overflow: hidden;
          color: #fff;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          background: #060606;
          transition:
            opacity 0.4s ease,
            visibility 0s linear 0.4s;
        }

        .side-bar--open {
          visibility: visible;
          pointer-events: auto;
          transition-delay: 0s;
        }

        .side-bar--revealed {
          opacity: 1;
        }

        .side-bar__media,
        .side-bar__veil,
        .side-bar__panel {
          position: absolute;
          inset: 0;
        }

        .side-bar__media {
          z-index: 0;
          overflow: hidden;
        }

        .side-bar__media-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          clip-path: inset(0 0 0 100%);
          transition: clip-path 1.05s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: clip-path;
        }

        .side-bar--revealed .side-bar__media-image {
          clip-path: inset(0 0 0 0);
        }

        .side-bar__veil {
          z-index: 1;
          background:
            linear-gradient(
              180deg,
              rgba(8, 8, 8, 0.22) 0%,
              rgba(8, 8, 8, 0.3) 28%,
              rgba(8, 8, 8, 0.5) 100%
            );
          opacity: 0;
          transition: opacity 0.58s ease 0.12s;
        }

        .side-bar--revealed .side-bar__veil {
          opacity: 1;
        }

        .side-bar__panel {
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .side-bar__nav {
          display: grid;
          gap: clamp(1rem, 3.5vw, 1.5rem);
          list-style: none;
          margin: calc(var(--space-unit) * 12) 0 0;
          padding: 0;
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition:
            opacity 0.46s ease,
            transform 0.66s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .side-bar--revealed .side-bar__nav {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition-delay: 0.3s;
        }

        .side-bar__link {
          display: inline-block;
          color: #fff;
          font-size: clamp(2rem, 6vw, 3.15rem);
          font-weight: 700;
          line-height: 0.94;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          text-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .side-bar__link:hover,
        .side-bar__link:focus-visible {
          color: rgba(255, 255, 255, 0.82);
        }

        #main-nav {
          z-index: 70;
          --nav-progress: 0;
          --nav-links-progress: 0;
          --nav-gradient-top-alpha: 0.15;
          --nav-gradient-bottom-alpha: 0;
          --nav-gradient-stop: 5%;
          --nav-glass-alpha: 0.12;
          --nav-glass-line-alpha: 0.22;
          --nav-glass-shadow-alpha: 0.08;
          --nav-docked-opacity: 0;
          --nav-floating-opacity: 0;
          --nav-floating-x: 50vw;
          --nav-floating-y: -200px;
          background: transparent;
          box-shadow:
            0 12px 36px rgba(15, 23, 42, var(--nav-glass-shadow-alpha, 0.08)),
            0 2px 16px rgba(255, 255, 255, calc(var(--nav-glass-line-alpha, 0.22) * 0.2));
          backdrop-filter: blur(calc(14px + var(--nav-progress) * 10px)) saturate(calc(1.05 + var(--nav-progress) * 0.45));
          -webkit-backdrop-filter: blur(calc(14px + var(--nav-progress) * 10px)) saturate(calc(1.05 + var(--nav-progress) * 0.45));
          border-bottom: 1px solid rgba(255, 255, 255, calc(var(--nav-glass-line-alpha, 0.22) * 0.7));
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s linear;
        }

        #main-nav.main-nav--menu-open .main-nav__fx,
        #main-nav.main-nav--menu-open .main-nav__brand,
        #main-nav.main-nav--menu-open .main-nav__floating-links-layer,
        #main-nav.main-nav--menu-open .main-nav__links-wrap {
          opacity: 0;
          pointer-events: none;
        }

        #main-nav.main-nav--menu-revealed .menu-button {
          color: #fff;
          mix-blend-mode: normal;
          transition-delay: 0s;
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

          .side-bar__panel {
            padding-inline: clamp(1.5rem, 6vw, 2.25rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .side-bar,
          .side-bar__media-image,
          .side-bar__veil,
          .side-bar__nav {
            transition-duration: 0.01ms;
            transition-delay: 0s;
          }
        }
      `}</style>
    </>
  );
}
