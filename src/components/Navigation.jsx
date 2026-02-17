export default function Navigation() {
  return (
    <>
      <nav
        id="main-nav"
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div class="w-full px-[300px] py-5 md:px-[420px] md:py-6 flex items-center justify-between">
          <a
            href="/"
            class="text-2xl font-bold tracking-tight hover:text-[var(--color-red-accent)] transition-colors"
          >
            <img
              src="/images/logo-redv2.png"
              alt="El Siglo Espanol"
              class="h-12"
            />
          </a>

          <ul class="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase"></ul>

          <button
            id="mobile-menu-btn"
            class="menu-button w-12 h-10 flex items-center justify-center"
            aria-label="Abrir menu"
          >
            <svg class="menu-icon" viewBox="0 0 32 20" aria-hidden="true">
              <line x1="2" y1="6" x2="30" y2="6" />
              <line x1="2" y1="14" x2="30" y2="14" />
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          class="fixed inset-0 bg-black text-white transform translate-x-full transition-transform duration-500 md:hidden"
        >
          <div class="container mx-auto px-6 py-6">
            <button id="close-menu" class="ml-auto block text-4xl">
              &times;
            </button>
            <ul class="mt-16 space-y-6 text-3xl font-bold"></ul>
          </div>
        </div>
      </nav>

      <style>{`
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

        #main-nav.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        #main-nav.scrolled a:not(:has(img)) {
          color: #000;
        }

        #main-nav {
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        body.preloader-done #main-nav {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
