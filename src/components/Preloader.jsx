import { useEffect } from "preact/hooks";

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    const imageList = Array.from(
      document.querySelectorAll(".preloader-img")
    );
    const imageContainer = document.querySelector(".preloader-images");

    const timing = {
      step: 550, // Tiempo entre cada imagen (1 a 5)
      fade: 800, // Fade de las imagenes normales
      shrink: 520, // Duracion del shrink (lo dejamos como estaba)
      fillMax: 500, // Velocidad del fill final (imagen 6 a pantalla completa)
      preloadTimeout: 1800, // Arranque forzado maximo mientras cargan imagenes
    };
    const step = timing.step;
    const fadeDuration = timing.fade;
    const finalFadeDuration = Math.round(timing.fillMax * 0.72);
    const shrinkDuration = timing.shrink;
    const shrinkHold = Math.round(timing.step * 0.18);
    const expandDuration = timing.fillMax;
    const overlayFade = Math.round(timing.fade * 0.72);
    const holdDuration = Math.round(timing.fillMax * 0.15);
    const settleDelay = Math.round(timing.fillMax * 0.2);
    const lastIndex = imageList.length - 1;
    const shrinkIndex = imageList.findIndex((img) =>
      img.classList.contains("preloader-img--shrink-trigger")
    );
    const shrinkTriggerIndex = shrinkIndex >= 0 ? shrinkIndex : Math.max(lastIndex - 1, 0);
    const shrinkStart = shrinkTriggerIndex * step + fadeDuration;
    const shrinkEnd = shrinkStart + shrinkDuration;
    const lastImageStart = shrinkEnd + shrinkHold;
    const expandStart = lastImageStart + holdDuration;
    const finalEnd = expandStart + expandDuration + settleDelay;
    const timers = [];
    let done = false;
    let started = false;
    const doneDelay = 120;

    const finalizePreloader = () => {
      if (done) return;
      done = true;
      if (preloader) {
        preloader.classList.add("preloader--done");
      }
      timers.push(window.setTimeout(() => {
        if (preloader) {
          preloader.style.display = "none";
        }
        document.body.classList.remove("preloader-handoff");
        document.body.classList.add("preloader-done");
        window.dispatchEvent(new Event("preloader:done"));
        document.body.style.overflow = "auto";
      }, overlayFade));
    };

    const finalizeNextFrame = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          finalizePreloader();
        });
      });
    };

    const finishPreloader = () => {
      if (done) return;
      finalizeNextFrame();
    };

    const startSequence = () => {
      if (started) return;
      started = true;

      const removeOtherImages = () => {
        imageList.forEach((img, idx) => {
          if (idx === lastIndex) return;
          img.remove();
        });
      };

      imageList.forEach((img, index) => {
        const start = index === lastIndex ? lastImageStart : index * step;
        timers.push(
          window.setTimeout(() => {
            const animationName =
              index === lastIndex ? "fadeInOnly" : "fadeInScale";
            const duration =
              index === lastIndex ? finalFadeDuration : fadeDuration;
            const easing =
              index === lastIndex
                ? "cubic-bezier(0.2, 0.65, 0.2, 1)"
                : "cubic-bezier(0.2, 0.7, 0.2, 1)";
            img.style.animation = `${animationName} ${duration}ms ${easing} forwards`;
          }, start)
        );
        if (index === lastIndex) {
          timers.push(
            window.setTimeout(() => {
              if (!preloader) return;
              preloader.style.setProperty("--shrink-duration", `${shrinkDuration}ms`);
              preloader.classList.add("preloader--shrink");
            }, shrinkStart)
          );

          timers.push(
            window.setTimeout(() => {
              document.body.classList.add("preloader-handoff");
              if (preloader) {
                preloader.style.setProperty("--fade-duration", `${fadeDuration}ms`);
                preloader.style.setProperty("--expand-duration", `${expandDuration}ms`);
                preloader.style.setProperty("--overlay-fade", `${overlayFade}ms`);
                preloader.classList.add("preloader--expand");
              }
              const lastSrc = img.getAttribute("src");
              if (lastSrc) {
                window.dispatchEvent(
                  new CustomEvent("preloader:last-image", {
                    detail: { src: lastSrc },
                  })
                );
              }
              img.classList.add("preloader-img--expand");

              const onExpandEnd = (event) => {
                if (event.propertyName !== "transform") return;
                imageContainer?.removeEventListener("transitionend", onExpandEnd);
                timers.push(window.setTimeout(() => {
                  finishPreloader();
                }, doneDelay));
              };
              imageContainer?.addEventListener("transitionend", onExpandEnd);
            }, expandStart)
          );
          timers.push(
            window.setTimeout(() => {
              removeOtherImages();
            }, expandStart + settleDelay)
          );

        }
      });

      timers.push(window.setTimeout(() => {
        timers.push(window.setTimeout(() => {
          finishPreloader();
        }, doneDelay));
      }, finalEnd));
    };

    const preloadPromises = imageList.map((img) => {
      if (img.complete) return Promise.resolve();
      if (img.decode) {
        return img.decode().catch(() => undefined);
      }
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });

    const preloadTimeout = window.setTimeout(startSequence, timing.preloadTimeout);
    Promise.all(preloadPromises).then(() => {
      window.clearTimeout(preloadTimeout);
      startSequence();
    });

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(preloadTimeout);
      timers.forEach((id) => window.clearTimeout(id));
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
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "1" }}
          />
          <img
            src="/images/preloader/Preload_2_def_upscaled_2x.png"
            alt="Cargando 2"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.988" }}
          />
          <img
            src="/images/preloader/Preload_3_def_upscaled_2x.png"
            alt="Cargando 3"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.976" }}
          />
          <img
            src="/images/preloader/Preload_Archivo.png"
            alt="Cargando archivo"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.964" }}
          />
          <img
            src="/images/preloader/Preload_4_def_upscaled_2x.png"
            alt="Cargando 4"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.952" }}
          />
          <img
            src="/images/preloader/Preload_5_def_upscaled_2x.png"
            alt="Cargando 5"
            class="preloader-img preloader-img--shrink-trigger absolute opacity-0"
            style={{ "--scale-end": "0.94" }}
          />
          <img
            src="/images/preloader/Preload_6_def_upscaled_2x.png"
            alt="Cargando 6"
            class="preloader-img preloader-img--final absolute opacity-0"
            style={{ "--scale-end": "1" }}
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

        .preloader-images {
          --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
          --ease-expand: cubic-bezier(0.28, 0.08, 0.22, 1);
          --stack-scale: 0.88;
          --stack-duration: var(--expand-duration, 180ms);
          --stack-ease: var(--ease-smooth);
          width: 100vw;
          height: 100vh;
          overflow: visible;
          transform: scale(var(--stack-scale));
          transform-origin: center;
          transition: transform var(--stack-duration) var(--stack-ease);
        }

        #preloader.preloader--shrink .preloader-images {
          --stack-scale: 0.66;
          --stack-duration: var(--shrink-duration, 120ms);
          --stack-ease: var(--ease-soft);
        }

        #preloader.preloader--expand .preloader-images {
          --stack-scale: 1;
          --stack-duration: var(--expand-duration, 120ms);
          --stack-ease: var(--ease-expand);
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
          transition: transform var(--img-transform-duration, var(--expand-duration, 120ms))
              var(--ease-smooth),
            opacity var(--fade-duration, 120ms) var(--ease-soft);
          z-index: 1;
        }

        .preloader-img--final {
          transform: scale(1);
          transition: opacity var(--fade-duration, 120ms) var(--ease-soft);
          will-change: opacity;
        }

        #preloader.preloader--expand .preloader-img:not(.preloader-img--final) {
          opacity: 0;
        }

        #preloader.preloader--expand .preloader-img--final {
          transform: scale(1);
          opacity: 1;
          z-index: 3;
        }

        .preloader-img--final.preloader-img--expand {
          transform: scale(1);
          opacity: 1;
        }

        #preloader.preloader--done {
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--overlay-fade, 120ms) var(--ease-soft);
        }
      `}</style>
    </>
  );
}
