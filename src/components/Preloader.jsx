import { useEffect } from "preact/hooks";

const TIMING = {
  step: 550,
  fade: 600,
  shrink: 900,
  grow: 1900,
  preloadTimeout: 1800,
};

const SEQUENCE_FRAME_SCALE = 0.88;
const SHRINK_FRAME_SCALE = 0.66;
const FINAL_LAYER_START_SCALE = 0.88;
const FINAL_IMAGE_ENTRY_SCALE = 0.58;
const FINAL_IMAGE_START_SCALE = 0.72;
const FINAL_OVERLAP_RATIO = 0.82;
const GROW_DELAY_RATIO = 0.28;
const DONE_DELAY_MS = 120;

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    const sequenceImages = Array.from(
      preloader?.querySelectorAll(".preloader-sequence-img") ?? []
    );
    const finalLayer = preloader?.querySelector(".preloader-final-layer");
    const shrinkImage = preloader?.querySelector(".preloader-img--shrink-trigger");
    const finalImage = preloader?.querySelector(".preloader-img--final");

    if (!preloader || !finalLayer || !shrinkImage || !finalImage || sequenceImages.length === 0) {
      return undefined;
    }

    const finalEntryDuration = Math.round(TIMING.fade * 1.25);
    const shrinkIndex = sequenceImages.indexOf(shrinkImage);
    const shrinkStart = shrinkIndex * TIMING.step + TIMING.fade;
    const finalRevealStart = shrinkStart + Math.round(TIMING.shrink * FINAL_OVERLAP_RATIO);
    const finalGrowStart = finalRevealStart + Math.round(TIMING.grow * GROW_DELAY_RATIO);
    const fallbackFinish = finalGrowStart + TIMING.grow + DONE_DELAY_MS;
    const timers = [];
    let done = false;
    let started = false;
    let removeGrowListener = () => {};

    const queue = (callback, delay) => {
      timers.push(window.setTimeout(callback, delay));
    };

    const finalizePreloader = () => {
      if (done) return;
      done = true;
      // Cuando la 6 ya esta a pantalla completa, intercambiamos al hero.
      // Como usan el mismo asset, el cambio de una capa a otra es invisible.
      document.body.classList.add("preloader-done");
      window.dispatchEvent(new Event("preloader:done"));
      window.requestAnimationFrame(() => {
        preloader.style.display = "none";
        document.body.classList.remove("preloader-handoff");
        document.body.style.overflow = "auto";
      });
    };

    const finishPreloader = () => {
      if (done) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          finalizePreloader();
        });
      });
    };

    const startSequence = () => {
      if (started) return;
      started = true;
      preloader.style.setProperty("--fade-duration", `${TIMING.fade}ms`);
      preloader.style.setProperty("--shrink-duration", `${TIMING.shrink}ms`);
      preloader.style.setProperty("--grow-duration", `${TIMING.grow}ms`);
      preloader.style.setProperty("--final-entry-duration", `${finalEntryDuration}ms`);

      // 1. Mostramos la secuencia base imagen a imagen.
      sequenceImages.forEach((img, index) => {
        queue(() => {
          img.style.animation = `fadeInScale ${TIMING.fade}ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards`;
        }, index * TIMING.step);
      });

      // 2. La imagen 5 empieza a encoger.
      queue(() => {
        preloader.classList.add("preloader--handoff");
        preloader.classList.add("preloader--shrink");
      }, shrinkStart);

      // 3. La imagen 6 aparece mientras la 5 sigue encogiendo.
      queue(() => {
        preloader.classList.add("preloader--final-visible");
        finalImage.style.transition = [
          `transform ${finalEntryDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          `opacity ${finalEntryDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ].join(", ");
        finalImage.style.transform = `scale(${FINAL_IMAGE_START_SCALE})`;
        finalImage.style.opacity = "1";
        const finalSrc = finalImage.getAttribute("src");
        if (finalSrc) {
          window.dispatchEvent(
            new CustomEvent("preloader:last-image", {
              detail: { src: finalSrc },
            })
          );
        }
      }, finalRevealStart);

      // 4. A partir de ahi la 6 crece hasta llenar el viewport.
      queue(() => {
        const onGrowEnd = (event) => {
          if (event.propertyName !== "transform") return;
          finalImage.removeEventListener("transitionend", onGrowEnd);
          removeGrowListener = () => {};
          queue(() => {
            finishPreloader();
          }, DONE_DELAY_MS);
        };

        removeGrowListener = () => {
          finalImage.removeEventListener("transitionend", onGrowEnd);
        };

        finalLayer.style.transition = `transform ${TIMING.grow}ms cubic-bezier(0.2, 0.55, 0.24, 1)`;
        finalImage.style.transition = [
          `transform ${TIMING.grow}ms cubic-bezier(0.2, 0.55, 0.24, 1)`,
          `opacity ${finalEntryDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ].join(", ");

        finalImage.addEventListener("transitionend", onGrowEnd);

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            preloader.classList.add("preloader--expand");
            finalLayer.style.transform = "scale(1)";
            finalImage.style.transform = "scale(1)";
          });
        });
      }, finalGrowStart);

      // 5. Fallback por si el navegador no lanza transitionend.
      queue(() => {
        finishPreloader();
      }, fallbackFinish);
    };

    const preloadPromises = [...sequenceImages, finalImage].map((img) => {
      if (img.complete) return Promise.resolve();
      if (img.decode) {
        return img.decode().catch(() => undefined);
      }
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });

    const preloadTimeout = window.setTimeout(startSequence, TIMING.preloadTimeout);
    Promise.all(preloadPromises).then(() => {
      window.clearTimeout(preloadTimeout);
      startSequence();
    });

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(preloadTimeout);
      timers.forEach((id) => window.clearTimeout(id));
      removeGrowListener();
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        id="preloader"
        class="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      >
        <div class="preloader-images relative">
          <img
            src="/images/preloader/Preload_1_def_upscaled_2x.png"
            alt="Cargando 1"
            class="preloader-img preloader-sequence-img absolute opacity-0"
            style={{ "--scale-end": "1" }}
          />
          <img
            src="/images/preloader/Preload_2_def_upscaled_2x.png"
            alt="Cargando 2"
            class="preloader-img preloader-sequence-img absolute opacity-0"
            style={{ "--scale-end": "0.988" }}
          />
          <img
            src="/images/preloader/Preload_Archivo.png"
            alt="Cargando archivo"
            class="preloader-img preloader-sequence-img absolute opacity-0"
            style={{ "--scale-end": "0.976" }}
          />
          <img
            src="/images/preloader/Preload_4_def_upscaled_2x.png"
            alt="Cargando 4"
            class="preloader-img preloader-sequence-img absolute opacity-0"
            style={{ "--scale-end": "0.964" }}
          />
          <img
            src="/images/preloader/Preload_5_def_upscaled_2x.png"
            alt="Cargando 5"
            class="preloader-img preloader-sequence-img preloader-img--shrink-trigger absolute opacity-0"
            style={{ "--scale-end": "0.952" }}
          />
          <img
            src="/images/preloader/Preload_3_def_upscaled_2x.png"
            alt="Cargando 6"
            class="preloader-img preloader-sequence-img absolute opacity-0"
            style={{ "--scale-end": "0.94" }}
          />
        </div>

        <div class="preloader-final-layer" aria-hidden="true">
          <img
            src="/images/preloader/Preload_6_def_upscaled_2x.png"
            alt="Cargando 3"
            class="preloader-img preloader-img--final absolute opacity-0"
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(var(--scale-start, 0.9));
          }
          100% {
            opacity: 1;
            transform: scale(var(--scale-end, 1));
          }
        }

        @keyframes fadeInOnly {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        #preloader {
          background: #ffffff;
        }

        /* Recuperamos el encuadre con margen original.
           El contenedor se ve algo mas pequeno al principio. */
        .preloader-images {
          --ease-sequence: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
          --ease-grow: cubic-bezier(0.2, 0.55, 0.24, 1);
          width: 100vw;
          height: 100vh;
          overflow: visible;
          isolation: isolate;
          contain: paint;
          transform: scale(${SEQUENCE_FRAME_SCALE});
          transform-origin: center;
          transition: transform var(--shrink-duration, 120ms) var(--ease-soft);
        }

        #preloader.preloader--shrink .preloader-images {
          transform: scale(${SHRINK_FRAME_SCALE});
        }

        /* La imagen final vive en una capa independiente a pantalla completa.
           Asi su grow no depende del contenedor pequeno de la secuencia. */
        .preloader-final-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          isolation: isolate;
          transform: scale(${FINAL_LAYER_START_SCALE});
          transform-origin: center;
          transition: transform var(--grow-duration, 120ms) var(--ease-grow);
        }

        .preloader-img {
          inset: 0;
          width: 100%;
          height: 100%;
          transform: scale(var(--scale-end, 1));
          transform-origin: center;
          object-fit: fill;
          object-position: center;
          filter: brightness(0.95);
          will-change: transform, opacity;
          backface-visibility: hidden;
          transition: opacity var(--fade-duration, 120ms) var(--ease-soft);
          z-index: 1;
        }

        /* La 5 es la imagen puente: encoge para dejar paso a la 6. */
        .preloader-img--shrink-trigger {
          z-index: 2;
          transition:
            transform var(--shrink-duration, 120ms) var(--ease-soft),
            opacity var(--fade-duration, 120ms) var(--ease-soft);
        }

        #preloader.preloader--shrink .preloader-img--shrink-trigger {
          transform: scale(0.66);
        }

        .preloader-img--final {
          /* La 6 comparte el mismo acabado visual que el hero.
             Asi no hay salto al pasar el testigo. */
          transform: scale(${FINAL_IMAGE_ENTRY_SCALE});
          opacity: 0;
          filter: brightness(0.75);
          will-change: transform, opacity;
          z-index: 3;
        }

        #preloader.preloader--final-visible .preloader-img--final {
        }

        /* En el handoff solo dejamos visibles la 5 y la 6. */
        #preloader.preloader--handoff .preloader-img:not(.preloader-img--shrink-trigger):not(.preloader-img--final) {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Cuando la 6 empieza a crecer, la 5 ya desaparece. */
        #preloader.preloader--expand .preloader-img--shrink-trigger {
          opacity: 0;
          visibility: hidden;
        }

        #preloader.preloader--done {
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
