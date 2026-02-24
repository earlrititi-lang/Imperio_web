export default function FastCarousel() {
  return (
    <>
      <section class="fast-carousel-section home-section--tight overflow-hidden bg-black text-white">
        <div class="carousel-track flex">
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
