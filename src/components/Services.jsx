import { useEffect } from "preact/hooks";

export default function Services() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section class="services-section py-32 bg-white">
        <div class="container mx-auto px-6">
          <div class="section-header mb-20 text-center fade-in-up">
            <h2 class="text-5xl md:text-7xl font-bold mb-6">
              Plataforma de Diseno-Fundamental
            </h2>
            <p class="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-black/70">
              El diseno es nuestra plataforma, sustentando nuestra practica.
              Nuestros servicios principales se adaptan a cada oportunidad de
              proyecto.
            </p>
          </div>

          <div class="services-grid space-y-32">
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
                />
              </div>
            </div>

            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-image relative overflow-hidden rounded-lg md:order-1">
                <img
                  src="/images/services/planificacion.jpg"
                  alt="Planificacion"
                  class="w-full h-[400px] object-cover hover-scale"
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
                />
              </div>
            </div>

            <div class="service-item grid md:grid-cols-2 gap-12 items-center fade-in-up">
              <div class="service-image relative overflow-hidden rounded-lg md:order-1">
                <img
                  src="/images/services/interiores.jpg"
                  alt="Interiores"
                  class="w-full h-[400px] object-cover hover-scale"
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
        }
      `}</style>
    </>
  );
}
