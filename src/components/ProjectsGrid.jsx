import { useEffect } from "preact/hooks";

export default function ProjectsGrid() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in-up").forEach((el, index) => {
      el.style.transitionDelay = `${index * 100}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section class="projects-section py-32 bg-[var(--color-white-off)]">
        <div class="container mx-auto px-6">
          <div class="section-header mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 class="text-5xl md:text-7xl font-bold">Proyectos</h2>
            <a
              href="/obras"
              class="text-lg font-semibold uppercase tracking-wide hover:text-[var(--color-red-accent)] transition-colors flex items-center gap-2"
            >
              Ver todos los proyectos
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          <div class="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-1.jpg"
                  alt="Palacio de los Marqueses"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Palacio de los Marqueses
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  Sevilla • Restauracion Integral
                </p>
              </div>
            </article>

            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-2.jpg"
                  alt="Casa de la Condesa"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Casa de la Condesa
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  Granada • Interiores Historicos
                </p>
              </div>
            </article>

            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-3.jpg"
                  alt="Convento de San Francisco"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Convento de San Francisco
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  Toledo • Adaptive Reuse
                </p>
              </div>
            </article>

            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-4.jpg"
                  alt="Plaza de las Cortes"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Plaza de las Cortes
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  Madrid • Urbanismo Historico
                </p>
              </div>
            </article>

            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-5.jpg"
                  alt="Biblioteca Real"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Biblioteca Real
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  El Escorial • Patrimonio Cultural
                </p>
              </div>
            </article>

            <article class="project-card group cursor-pointer fade-in-up">
              <div class="project-image relative overflow-hidden aspect-[4/5] bg-[var(--color-white-off)] mb-6">
                <img
                  src="/images/projects/project-6.jpg"
                  alt="Hacienda Andaluza"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span class="text-white text-lg font-semibold uppercase tracking-wide">
                    Ver Proyecto
                  </span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                  Hacienda Andaluza
                </h3>
                <p class="text-black/60 uppercase text-sm tracking-wide">
                  Cordoba • Diseno Contemporaneo
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .project-card {
          transition: transform 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </>
  );
}
