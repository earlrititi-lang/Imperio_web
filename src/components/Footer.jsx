export default function Footer() {
  return (
    <footer class="footer home-section home-section--tight bg-white text-black">
      <div class="home-shell">
        <div class="footer__grid grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Estudios
            </h3>

            <div class="footer__address-group mb-8">
              <p class="footer__address-label font-semibold mb-2">Madrid</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors text-sm"
              >
                Calle Mayor, 1
                <br />
                28013 Madrid, Espana
              </a>
            </div>

            <div>
              <p class="footer__address-label font-semibold mb-2">Sevilla</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors text-sm"
              >
                Plaza del Triunfo, 5
                <br />
                41004 Sevilla, Espana
              </a>
            </div>
          </div>

          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Contacto
            </h3>

            <div class="footer__stack-md space-y-4">
              <div>
                <p class="footer__eyebrow text-black/70 text-sm mb-1">Email</p>
                <a
                  href="mailto:info@elsigloespanol.com"
                  class="hover:text-[var(--color-red-accent)] transition-colors"
                >
                  info@elsigloespanol.com
                </a>
              </div>

              <div>
                <p class="footer__eyebrow text-black/70 text-sm mb-1">Telefono</p>
                <a
                  href="tel:+34912345678"
                  class="hover:text-[var(--color-red-accent)] transition-colors"
                >
                  +34 91 234 5678
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Navegacion
            </h3>

            <ul class="footer__nav-list space-y-3 text-sm">
              <li>
                <a
                  href="/estudio"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Estudio
                </a>
              </li>
              <li>
                <a
                  href="/obras"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Obras
                </a>
              </li>
              <li>
                <a
                  href="/diseno"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Diseno
                </a>
              </li>
              <li>
                <a
                  href="/consultoria"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Consultoria
                </a>
              </li>
              <li>
                <a
                  href="/equipo"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Equipo
                </a>
              </li>
              <li>
                <a
                  href="/noticias"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Noticias
                </a>
              </li>
              <li>
                <a
                  href="/contacto"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Siguenos
            </h3>

            <div class="footer__social flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-[var(--color-red-accent)] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-[var(--color-red-accent)] hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-[var(--color-red-accent)] hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="footer__bottom border-t border-black/10 pt-8 mt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/70">
            <p>© El Siglo Espanol {new Date().getFullYear()}.</p>

            <div class="footer__legal flex gap-6">
              <a href="/terminos" class="hover:text-[var(--color-red-accent)] transition-colors">
                Terminos de Uso
              </a>
              <a href="/privacidad" class="hover:text-[var(--color-red-accent)] transition-colors">
                Politica de Privacidad
              </a>
            </div>

            <p class="text-xs">
              Sitio web por{" "}
              <a href="#" class="hover:text-[var(--color-red-accent)] transition-colors">
                El Siglo Espanol
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .footer__grid {
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .footer__section-title {
          margin-bottom: var(--space-3);
        }

        .footer__address-group {
          margin-bottom: var(--space-4);
        }

        .footer__address-label,
        .footer__eyebrow {
          margin-bottom: var(--space-1);
        }

        .footer__stack-md > :not([hidden]) ~ :not([hidden]) {
          margin-top: var(--space-2);
        }

        .footer__nav-list > :not([hidden]) ~ :not([hidden]) {
          margin-top: calc(var(--space-unit) * 1.5);
        }

        .footer__social {
          gap: var(--space-2);
        }

        .footer__bottom {
          padding-top: var(--space-4);
          margin-top: var(--space-4);
        }

        .footer__legal {
          gap: var(--space-3);
        }
      `}</style>
    </footer>
  );
}
