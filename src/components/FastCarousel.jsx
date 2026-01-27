import { useEffect } from "preact/hooks";

export default function FastCarousel() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const track = entry.target.querySelector(".carousel-track");
        if (!track) return;
        track.style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      });
    });

    const carouselSection = document.querySelector(".fast-carousel-section");
    if (carouselSection) {
      observer.observe(carouselSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section class="fast-carousel-section py-0 overflow-hidden bg-black text-white">
        <div class="carousel-track flex">
          <div class="carousel-item">
            <img src="/images/carousel/carousel-1.jpg" alt="Proyecto 1" />
            <div class="carousel-overlay">
              <h3>Palacio Colonial</h3>
              <p>Restauracion integral</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-2.jpg" alt="Proyecto 2" />
            <div class="carousel-overlay">
              <h3>Casa Senorial</h3>
              <p>Interiores historicos</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-3.jpg" alt="Proyecto 3" />
            <div class="carousel-overlay">
              <h3>Convento S. XVII</h3>
              <p>Adaptive reuse</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-4.jpg" alt="Proyecto 4" />
            <div class="carousel-overlay">
              <h3>Plaza Mayor</h3>
              <p>Urbanismo historico</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-5.jpg" alt="Proyecto 5" />
            <div class="carousel-overlay">
              <h3>Hacienda Andaluza</h3>
              <p>Diseno contemporaneo</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-6.jpg" alt="Proyecto 6" />
            <div class="carousel-overlay">
              <h3>Biblioteca Real</h3>
              <p>Patrimonio cultural</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-1.jpg" alt="Proyecto 1" />
            <div class="carousel-overlay">
              <h3>Palacio Colonial</h3>
              <p>Restauracion integral</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-2.jpg" alt="Proyecto 2" />
            <div class="carousel-overlay">
              <h3>Casa Senorial</h3>
              <p>Interiores historicos</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-3.jpg" alt="Proyecto 3" />
            <div class="carousel-overlay">
              <h3>Convento S. XVII</h3>
              <p>Adaptive reuse</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-4.jpg" alt="Proyecto 4" />
            <div class="carousel-overlay">
              <h3>Plaza Mayor</h3>
              <p>Urbanismo historico</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-5.jpg" alt="Proyecto 5" />
            <div class="carousel-overlay">
              <h3>Hacienda Andaluza</h3>
              <p>Diseno contemporaneo</p>
            </div>
          </div>

          <div class="carousel-item">
            <img src="/images/carousel/carousel-6.jpg" alt="Proyecto 6" />
            <div class="carousel-overlay">
              <h3>Biblioteca Real</h3>
              <p>Patrimonio cultural</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .fast-carousel-section {
          position: relative;
        }

        .carousel-track {
          display: flex;
          gap: 0;
          animation: scrollCarousel 30s linear infinite;
          will-change: transform;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        .carousel-item {
          position: relative;
          flex-shrink: 0;
          width: 400px;
          height: 500px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .carousel-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          filter: grayscale(30%);
        }

        .carousel-item:hover img {
          transform: scale(1.1);
          filter: grayscale(0%);
        }

        .carousel-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, var(--black-90), transparent);
          transform: translateY(10px);
          opacity: 0;
          transition: all 0.4s ease;
        }

        .carousel-item:hover .carousel-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        .carousel-overlay h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .carousel-overlay p {
          font-size: 0.9rem;
          color: var(--white-70);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @keyframes scrollCarousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .carousel-item {
            width: 300px;
            height: 400px;
          }

          .carousel-track {
            animation-duration: 20s;
          }
        }
      `}</style>
    </>
  );
}
