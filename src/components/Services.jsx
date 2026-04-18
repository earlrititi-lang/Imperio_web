import { SERVICES_ITEMS } from "../config/home";

const FOUNDATION_CARDS = [
  {
    title: "Nuestra Historia",
    description:
      "Donde nunca se ponía el sol. Una historia de descubrimientos, hazañas y legado que cambió el mundo para siempre. Un linaje de exploradores, conquistadores y visionarios que se atrevieron a soñar más allá de lo conocido, dejando una marca imborrable en la historia de la humanidad.",
  },
  {
    title: "Nuestra Practica",
    description:
      "Integramos investigacion, criterio y diseno para dar forma a un marco coherente. El proceso es deliberado, abierto y preciso: hacemos las preguntas grandes, depuramos lo esencial y articulamos una posicion con peso propio.",
  },
  {
    title: "Nuestra Gente",
    description:
      "Trabajamos con intensidad, humor y exigencia. Nos interesa rodearnos de perfiles que piensan por cuenta propia, discuten con fundamento y entienden el diseno como una herramienta real de influencia, conexion y cambio.",
  },
];

export default function Services() {
  return (
    <>
      <section class="services-section home-section bg-white">
        <div class="home-shell">
          <div class="section-header services-section__header text-center fade-in-up">
            <h2 class="services-title font-rosa-black text-center">
              <span class="services-title__secondary block">DUE&Ntilde;OS DEL MAR</span>
              <span class="services-title__primary block">SE&Ntilde;ORES DEL MUNDO</span>
            </h2>
            <div class="services-army-swap">
              <div class="services-army-hitbox" aria-hidden="true"></div>
              <img
                src="/images/ejercito-blanco_upscaled_2x.png"
                alt="Formacion historica del ejercito"
                class="services-army-image services-army-image--default"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/images/ejercito-rojo.png"
                alt=""
                aria-hidden="true"
                class="services-army-image services-army-image--hover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="services-foundation-grid fade-in-up">
            {FOUNDATION_CARDS.map((card) => (
              <article class="services-foundation-card" key={card.title}>
                <span class="services-foundation-card__accent" aria-hidden="true"></span>
                <h3 class="services-foundation-card__title">{card.title}</h3>
                <p class="services-foundation-card__copy">{card.description}</p>
              </article>
            ))}
          </div>
          </div>

          <div class="services-grid">
            {SERVICES_ITEMS.map((service) => {
              const contentClassName = [
                "service-content",
                service.reverseOnDesktop && "md:order-2",
              ]
                .filter(Boolean)
                .join(" ");
              const imageClassName = [
                "service-image relative overflow-hidden rounded-lg",
                service.reverseOnDesktop && "md:order-1",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up" key={service.id}>
                  <div class={contentClassName}>
                    <span class="service-number text-[var(--color-red-spanish)] text-xl font-bold block">
                      {service.id}
                    </span>
                    <h3 class="text-4xl font-bold mb-6">{service.title}</h3>
                    <p class="text-lg leading-relaxed text-black/70">{service.description}</p>
                  </div>
                  <div class={imageClassName}>
                    <img
                      src={service.imageSrc}
                      alt={service.imageAlt}
                      class="w-full h-[400px] object-cover hover-scale"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .services-section {
          padding-block: calc(var(--home-section-space) * 0.72) calc(var(--home-section-space) * 0.62);
        }

        .service-number {
          font-variant-numeric: lining-nums;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-2);
        }

        .services-title {
          color: var(--color-black-pure);
          display: grid;
          justify-items: center;
          letter-spacing: 0.01em;
          line-height: 1;
          margin-bottom: 0;
          margin-top: var(--services-title-offset-y);
          transition: color 0.35s ease;
        }

        .services-title__primary {
          font-size: var(--services-title-primary-size);
        }

        .services-title__secondary {
          font-size: var(--services-title-secondary-size);
        }

        .services-title span + span {
          margin-top: 0.04em;
        }

        .services-section__header {
          display: grid;
          gap: 0;
          margin-bottom: var(--space-2);
        }

        .services-grid {
          display: grid;
          gap: var(--space-16);
        }

        .services-foundation-grid {
          display: grid;
          gap: clamp(var(--space-3), 1.6vw, var(--space-6));
          grid-template-columns: repeat(1, minmax(0, 1fr));
          position: relative;
          z-index: 5;
          margin-top: calc(var(--space-10) * -0.58);
          margin-bottom: var(--space-4);
        }

        .services-foundation-card {
          position: relative;
          display: grid;
          align-content: start;
          gap: var(--space-2);
          min-height: 100%;
          padding: var(--space-3) var(--space-2) 0;
          text-align: left;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
        }

        .services-foundation-card__accent {
          display: block;
          width: 100%;
          height: 1px;
          background: var(--color-red-accent);
          margin-bottom: var(--space-2);
        }

        .services-foundation-card__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 2.2vw, 2.85rem);
          font-weight: 800;
          letter-spacing: 0.01em;
          line-height: 1.05;
          margin: 0;
          color: var(--color-black-pure);
        }

        .services-foundation-card__copy {
          max-width: 30ch;
          margin: 0;
          color: rgba(0, 0, 0, 0.62);
          font-size: clamp(1.05rem, 1.15vw, 1.35rem);
          font-weight: 500;
          line-height: 1.34;
          text-wrap: balance;
        }

        .services-army-swap {
          --army-hitbox-width: 62%;
          --army-hitbox-height: 56%;
          position: relative;
          width: min(100%, 980px);
          margin: calc(var(--space-3) * -0.45) auto calc(var(--space-10) * -0.4);
        }

        .services-army-hitbox {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 4;
          width: var(--army-hitbox-width);
          height: var(--army-hitbox-height);
          transform: translate(-50%, -50%);
          background: transparent;
        }

        .service-item {
          gap: var(--space-6);
        }

        .service-content h3 {
          margin-bottom: var(--space-3);
        }

        .services-army-image {
          display: block;
          width: 100%;
          height: auto;
          position: relative;
          z-index: 1;
        }

        .services-army-image--default,
        .services-army-image--hover {
          transition: opacity 0.3s ease;
        }

        .services-army-image--hover {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }

        .services-army-hitbox:hover ~ .services-army-image--default {
          opacity: 0;
        }

        .services-army-hitbox:hover ~ .services-army-image--hover {
          opacity: 1;
        }

        .services-title:hover {
          color: var(--color-red-spanish);
        }

        @media (min-width: 960px) {
          .services-foundation-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            margin-top: calc(var(--space-12) * -0.6);
            margin-bottom: var(--space-3);
          }

          .services-foundation-card {
            padding: var(--space-4) var(--space-4) 0;
          }

          .services-army-swap {
            margin-top: calc(var(--space-4) * -0.4);
            margin-bottom: calc(var(--space-12) * -0.5);
          }
        }
      `}</style>
    </>
  );
}
