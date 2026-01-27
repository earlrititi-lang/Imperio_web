import { useEffect } from "preact/hooks";

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    const images = document.querySelectorAll(".preloader-img");
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    images.forEach((img, index) => {
      window.setTimeout(() => {
        img.style.animation = "fadeInOut 0.8s ease-in-out forwards";
      }, index * 600);
    });

    const hideTimer = window.setTimeout(() => {
      if (preloader) {
        preloader.style.animation = "slideUp 0.8s ease-in-out forwards";
      }
      window.setTimeout(() => {
        if (preloader) {
          preloader.style.display = "none";
        }
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "";
      }, 800);
    }, images.length * 600 + 400);

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      window.clearTimeout(hideTimer);
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "";
    };
  }, []);

  return (
    <>
      <div
        id="preloader"
        class="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      >
        <div class="preloader-images relative w-full h-full">
          <img
            src="/images/preloader/preloader-1.png"
            alt="Cargando 1"
            class="preloader-img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain opacity-0"
            data-order="1"
          />
          <img
            src="/images/preloader/preloader-2.png"
            alt="Cargando 2"
            class="preloader-img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain opacity-0"
            data-order="2"
          />
          <img
            src="/images/preloader/preloader-3.png"
            alt="Cargando 3"
            class="preloader-img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain opacity-0"
            data-order="3"
          />
          <img
            src="/images/preloader/preloader-4.png"
            alt="El Siglo Espanol"
            class="preloader-img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 object-contain opacity-0"
            data-order="4"
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes slideUp {
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
