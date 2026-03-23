import { SERVICES_ITEMS } from "../config/home";

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
            <p class="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-black/70">
              Aqui te dejamos acceso a nuestro pdf fundacional, con todas las claves
            </p>
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
          margin-bottom: var(--space-3);
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
          margin-top: 0.16em;
        }

        .services-section__header {
          margin-bottom: var(--space-10);
        }

        .services-grid {
          display: grid;
          gap: var(--space-16);
        }

        .services-army-swap {
          --army-hitbox-width: 62%;
          --army-hitbox-height: 56%;
          position: relative;
          width: min(100%, 980px);
          margin: 0 auto var(--space-4);
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
      `}</style>
    </>
  );
}
