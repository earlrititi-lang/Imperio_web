import { PROJECTS_ITEMS } from "../config/home";
import { withBase } from "../utils/basePath";

export default function ProjectsGrid() {
  return (
    <>
      <section class="projects-section home-section bg-white">
        <div class="home-shell">
          <div class="section-header projects-section__header flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 class="text-5xl md:text-7xl font-bold">Proyectos</h2>
            <a
              href={withBase("/obras")}
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
            {PROJECTS_ITEMS.map((project) => (
              <article class="project-card group cursor-pointer fade-in-up" key={project.title}>
                <div class="project-image relative overflow-hidden aspect-[4/5] bg-white mb-6">
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div class="project-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span class="text-white text-lg font-semibold uppercase tracking-wide">
                      Ver Proyecto
                    </span>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="text-2xl font-bold mb-2 group-hover:text-[var(--color-red-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p class="text-black/60 uppercase text-sm tracking-wide">{project.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .project-card {
          transition: transform 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
        }

        .projects-section__header {
          gap: var(--space-3);
          margin-bottom: var(--space-8);
          align-items: flex-start;
        }

        .projects-grid {
          gap: var(--space-4);
        }

        .project-image {
          margin-bottom: var(--space-3);
        }

        .project-info h3 {
          margin-bottom: var(--space-1);
        }

        @media (max-width: 767px) {
          .projects-section {
            padding-block: var(--space-8);
          }

          .projects-section__header {
            margin-bottom: var(--space-5);
          }

          .projects-section__header h2 {
            font-size: clamp(2.65rem, 14vw, 4rem);
            line-height: 0.95;
          }

          .projects-section__header a {
            font-size: 0.92rem;
          }

          .projects-grid {
            gap: var(--space-6);
          }

          .project-image {
            aspect-ratio: 5 / 6;
            margin-bottom: var(--space-2);
          }
        }

        @media (min-width: 768px) {
          .projects-section__header {
            align-items: flex-end;
          }
        }
      `}</style>
    </>
  );
}
