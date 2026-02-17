import { useEffect } from "preact/hooks";

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    const imageList = Array.from(
      document.querySelectorAll(".preloader-img")
    );
    const imageContainer = document.querySelector(".preloader-images");

    const step = 550;
    const fadeDuration = 900;
    const shrinkDuration = 920;
    const shrinkHold = 460;
    const expandDuration = 2800;
    const overlayFade = 650;
    const holdDuration = 0;
    const lastIndex = imageList.length - 1;
    const shrinkTriggerIndex = Math.max(lastIndex - 1, 0);
    const shrinkStart = shrinkTriggerIndex * step + fadeDuration;
    const shrinkEnd = shrinkStart + shrinkDuration;
    const lastImageStart = shrinkEnd + shrinkHold;
    const expandStart = lastImageStart + holdDuration;
    const finalEnd = expandStart + expandDuration + 200;
    const timers = [];
    let done = false;
    let started = false;
    const doneDelay = 150;

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
        if (index !== lastIndex && index > shrinkTriggerIndex) return;
        const start = index === lastIndex ? lastImageStart : index * step;
        timers.push(
          window.setTimeout(() => {
            const animationName =
              index === lastIndex ? "fadeInOnly" : "fadeInScale";
            img.style.animation = `${animationName} ${fadeDuration}ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards`;
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
            }, expandStart)
          );
          timers.push(
            window.setTimeout(() => {
              removeOtherImages();
            }, expandStart + 200)
          );

          const onExpandEnd = (event) => {
            if (event.propertyName !== "transform") return;
            imageContainer?.removeEventListener("transitionend", onExpandEnd);
            timers.push(window.setTimeout(() => {
              finishPreloader();
            }, doneDelay));
          };
          imageContainer?.addEventListener("transitionend", onExpandEnd);
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

    const preloadTimeout = window.setTimeout(startSequence, 2200);
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
            src="/images/preloader/preload1.jpg"
            alt="Cargando 1"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "1" }}
          />
          <img
            src="/images/preloader/preload-2-def.png"
            alt="Cargando 2"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.985" }}
          />
          <img
            src="/images/preloader/preload-5-def.png"
            alt="Cargando 3"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.97" }}
          />
          <img
            src="/images/preloader/preload-4-def.png"
            alt="Cargando 4"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.955" }}
          />
          <img
            src="/images/preloader/preload-3-def.png"
            alt="Cargando 5"
            class="preloader-img absolute opacity-0"
            style={{ "--scale-end": "0.94" }}
          />
          <img
            src="/images/preloader/preload-6-def.png"
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
          --stack-scale: 0.88;
          --stack-duration: var(--expand-duration, 1.4s);
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
          --stack-duration: var(--shrink-duration, 920ms);
          --stack-ease: var(--ease-soft);
        }

        #preloader.preloader--expand .preloader-images {
          --stack-scale: 1;
          --stack-duration: var(--expand-duration, 1.4s);
          --stack-ease: var(--ease-smooth);
        }

        .preloader-img {
          inset: 0;
          width: 100%;
          height: 100%;
          transform: scale(var(--scale-end, 1));
          transform-origin: center;
          object-fit: fill;
          object-position: center;
          filter: brightness(0.75);
          will-change: transform, opacity;
          transition: transform var(--img-transform-duration, var(--expand-duration, 1.4s))
              var(--ease-smooth),
            opacity var(--img-opacity-duration, 1.2s) var(--ease-soft);
          z-index: 1;
        }

        .preloader-img--final {
          transform: scale(1);
          transition: opacity 1.2s var(--ease-soft);
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
          transition: opacity var(--overlay-fade, 650ms) var(--ease-soft);
        }
      `}</style>
    </>
  );
}
