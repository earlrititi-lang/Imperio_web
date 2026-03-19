export default function Services() {
  return (
    <>
      <section class="services-section home-section bg-white">
        <div class="home-shell">
          <div class="section-header services-section__header text-center fade-in-up">
            <h2 class="services-title font-rosa-black text-center">
              <span class="block">DUE&Ntilde;OS DEL MAR</span>
              <span class="block">SE&Ntilde;ORES DEL MUNDO</span>
            </h2>
            <div class="services-army-swap">
              <img
                src="/images/ejercito-blanco.png"
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
            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-content">
                <span class="service-number text-[var(--color-red-spanish)] text-xl font-bold mb-4 block">
                  01
                </span>
                <h3 class="text-4xl font-bold mb-6">Consultoria</h3>
                <p class="text-lg leading-relaxed text-black/70">
                  Una vision audaz tiene el poder de alinear comunidades y crear
                  impulso. Nuestro equipo de consultoria colabora con lideres y
                  juntas directivas para guiar el pensamiento inicial y
                  desarrollar consenso, acelerando en ultima instancia los
                  resultados.
                </p>
              </div>
              <div class="service-image relative overflow-hidden rounded-lg">
                <img
                  src="/images/services/consultoria.jpg"
                  alt="Consultoria"
                  class="w-full h-[400px] object-cover hover-scale"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-image relative overflow-hidden rounded-lg md:order-1">
                <img
                  src="/images/services/planificacion.jpg"
                  alt="Planificacion"
                  class="w-full h-[400px] object-cover hover-scale"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="service-content md:order-2">
                <span class="service-number text-[var(--color-red-spanish)] text-xl font-bold mb-4 block">
                  02
                </span>
                <h3 class="text-4xl font-bold mb-6">Planificacion</h3>
                <p class="text-lg leading-relaxed text-black/70">
                  Los servicios de planificacion traducen las necesidades y
                  aspiraciones organizacionales en marcos flexibles que apoyan
                  la toma de decisiones duradera y transparente. Nuestro enfoque
                  interdisciplinario esta impulsado por datos y centrado en el
                  programa.
                </p>
              </div>
            </div>

            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-content">
                <span class="service-number text-[var(--color-red-spanish)] text-xl font-bold mb-4 block">
                  03
                </span>
                <h3 class="text-4xl font-bold mb-6">Arquitectura</h3>
                <p class="text-lg leading-relaxed text-black/70">
                  Un sentido perdurable de custodia para reforzar lugares
                  especiales esta en el corazon de nuestra filosofia. Estamos
                  comprometidos con composiciones unicas y atemporales que
                  reflejan a nuestros clientes como individuos y
                  organizaciones.
                </p>
              </div>
              <div class="service-image relative overflow-hidden rounded-lg">
                <img
                  src="/images/services/arquitectura.jpg"
                  alt="Arquitectura"
                  class="w-full h-[400px] object-cover hover-scale"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-image relative overflow-hidden rounded-lg md:order-1">
                <img
                  src="/images/services/interiores.jpg"
                  alt="Interiores"
                  class="w-full h-[400px] object-cover hover-scale"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="service-content md:order-2">
                <span class="service-number text-[var(--color-red-spanish)] text-xl font-bold mb-4 block">
                  04
                </span>
                <h3 class="text-4xl font-bold mb-6">Interiores</h3>
                <p class="text-lg leading-relaxed text-black/70">
                  Nuestra practica de diseno de interiores conecta arquitectura
                  y atmosfera. Abordamos cada proyecto con una profunda
                  sensibilidad hacia la proporcion, la materialidad y el uso,
                  disenando espacios que reflejan tanto el caracter del cliente
                  como las demandas del programa.
                </p>
              </div>
            </div>
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

        .hover-scale {
          transition: transform 0.6s ease;
        }

        .service-image:hover .hover-scale {
          transform: scale(1.05);
        }

        .service-number {
          font-variant-numeric: lining-nums;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-2);
        }

        .services-title {
          color: var(--color-black-pure);
          font-size: var(--services-title-size);
          letter-spacing: 0.01em;
          line-height: 1;
          margin-bottom: var(--space-3);
          margin-top: var(--services-title-offset-y);
          transition: color 0.35s ease;
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
          position: relative;
          width: min(100%, 980px);
          margin: 0 auto var(--space-4);
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
        }

        .section-header:hover .services-army-image--default,
        .services-army-swap:hover .services-army-image--default {
          opacity: 0;
        }

        .section-header:hover .services-army-image--hover,
        .services-army-swap:hover .services-army-image--hover {
          opacity: 1;
        }

        .services-title:hover {
          color: var(--color-red-spanish);
        }
      `}</style>
    </>
  );
}
