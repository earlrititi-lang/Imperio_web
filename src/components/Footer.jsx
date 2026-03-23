import {
  FOOTER_LEGAL_LINKS,
  FOOTER_NAV_ITEMS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_STUDIOS,
} from "../config/home";

export default function Footer() {
  return (
    <footer class="footer home-section home-section--tight bg-white text-black">
      <div class="home-shell">
        <div class="footer__grid grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Estudios
            </h3>

            {FOOTER_STUDIOS.map((studio) => (
              <div class="footer__address-group" key={studio.city}>
                <p class="footer__address-label font-semibold mb-2">{studio.city}</p>
                <a
                  href={studio.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors text-sm"
                >
                  {studio.lines.map((line, index) => (
                    <span key={`${studio.city}-${index}`}>
                      {line}
                      {index < studio.lines.length - 1 && <br />}
                    </span>
                  ))}
                </a>
              </div>
            ))}
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
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    class="text-black/70 hover:text-[var(--color-red-accent)] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 class="footer__section-title text-sm uppercase tracking-wide font-semibold mb-6">
              Siguenos
            </h3>

            <div class="footer__social flex gap-4">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-[var(--color-red-accent)] hover:text-white transition-all"
                  aria-label={social.label}
                  key={social.label}
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.iconPath} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div class="footer__bottom border-t border-black/10 pt-8 mt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/70">
            <p>&copy; El Siglo Espanol {new Date().getFullYear()}.</p>

            <div class="footer__legal flex gap-6">
              {FOOTER_LEGAL_LINKS.map((item) => (
                <a
                  href={item.href}
                  class="hover:text-[var(--color-red-accent)] transition-colors"
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
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
