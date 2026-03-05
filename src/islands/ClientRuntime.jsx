import { useEffect } from "preact/hooks";

export default function ClientRuntime() {
  useEffect(() => {
    document.documentElement.classList.add("has-islands");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    }

    const nav = document.getElementById("main-nav");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenuBtn = document.getElementById("close-menu");
    const mobileBreakpoint = window.matchMedia("(min-width: 768px)");
    const heroNav = document.querySelector(".hero-imperio__nav");
    const navFxCanvas = document.getElementById("main-nav-fx-canvas");
    const navFxCtx = navFxCanvas?.getContext("2d");

    // Main controls for nav white-fill FX.
    const NAV_FX = {
      progressSmoothing: 0.14, // smooths scroll jumps into cinematic motion
      edgeBlurPx: 68, // primary blur for the moving white front
      edgeBandPx: 64, // vertical thickness of the front glow
      edgePulsePx: 4, // subtle breathing so it does not look static
      grainTilePx: 128, // resolution of the repeated noise texture
      grainAlpha: 0.2, // global noise intensity
      grainDensityA: 0.16, // density of coarse grain texture
      grainDensityB: 0.32, // density of fine grain texture
      grainDriftX: 14, // horizontal drift of grain layers
      grainDriftY: 36, // vertical drift of grain layers
    };

    const NAV_FALLBACK_SCROLL_PX = 220;
    const NAV_FILL_SCROLL_FACTOR = 0.72;
    const NAV_FILL_MIN_PX = 120;
    const NAV_FILL_MAX_PX = 320;
    const clamp01 = (value) => Math.min(1, Math.max(0, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
    let navFillEndScroll = NAV_FALLBACK_SCROLL_PX;
    let navTargetProgress = 0;
    let navProgress = 0;
    let ticking = false;
    let navFxWidth = 0;
    let navFxHeight = 0;
    let navFxRafId = 0;
    let grainPatternA = null;
    let grainPatternB = null;

    const resizeNavFxCanvas = () => {
      if (!nav || !navFxCanvas || !navFxCtx) return;
      const rect = nav.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      navFxWidth = width;
      navFxHeight = height;
      navFxCanvas.width = Math.round(width * dpr);
      navFxCanvas.height = Math.round(height * dpr);
      navFxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      navFxCanvas.style.width = `${width}px`;
      navFxCanvas.style.height = `${height}px`;
      refreshGrainPatterns();
    };

    const seededNoise = (x, y, seed) => {
      const value =
        Math.sin((x * 127.1 + y * 311.7 + seed * 74.7) * 0.0174533) *
        43758.5453;
      return value - Math.floor(value);
    };

    const createGrainPattern = (tileSize, density, seed) => {
      if (!navFxCtx) return null;
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = tileSize;
      patternCanvas.height = tileSize;
      const patternCtx = patternCanvas.getContext("2d");
      if (!patternCtx) return null;

      const imageData = patternCtx.createImageData(tileSize, tileSize);
      const data = imageData.data;
      for (let y = 0; y < tileSize; y += 1) {
        for (let x = 0; x < tileSize; x += 1) {
          const i = (y * tileSize + x) * 4;
          const n = seededNoise(x, y, seed);
          const alpha = n > 1 - density ? Math.round((0.2 + n * 0.8) * 255) : 0;
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = alpha;
        }
      }
      patternCtx.putImageData(imageData, 0, 0);
      return navFxCtx.createPattern(patternCanvas, "repeat");
    };

    const refreshGrainPatterns = () => {
      grainPatternA = createGrainPattern(
        NAV_FX.grainTilePx,
        NAV_FX.grainDensityA,
        11
      );
      grainPatternB = createGrainPattern(
        NAV_FX.grainTilePx,
        NAV_FX.grainDensityB,
        29
      );
    };

    const drawNavFx = (timestampMs = 0) => {
      if (!navFxCtx || navFxWidth <= 0 || navFxHeight <= 0) return;

      const ctx = navFxCtx;
      const t = timestampMs * 0.001;
      const w = navFxWidth;
      const h = navFxHeight;
      const fillY = h * navProgress;

      ctx.clearRect(0, 0, w, h);
      if (fillY <= 0.5) return;

      const baseAlpha = Math.min(1, 0.2 + navProgress * 0.84);
      ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, w, fillY);

      // Primary cinematic front glow.
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${NAV_FX.edgeBlurPx}px)`;
      const bandWave = Math.sin(t * 0.55) * NAV_FX.edgePulsePx;
      const bandTop = fillY - NAV_FX.edgeBandPx + bandWave;
      const bandBottom = fillY + NAV_FX.edgeBandPx * 1.3 + bandWave;
      const bandGrad = ctx.createLinearGradient(0, bandTop, 0, bandBottom);
      bandGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      bandGrad.addColorStop(
        0.2,
        `rgba(255, 255, 255, ${(0.28 + navProgress * 0.22).toFixed(3)})`
      );
      bandGrad.addColorStop(
        0.5,
        `rgba(255, 255, 255, ${(0.72 + navProgress * 0.22).toFixed(3)})`
      );
      bandGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = bandGrad;
      ctx.fillRect(
        0,
        bandTop - NAV_FX.edgeBlurPx,
        w,
        bandBottom - bandTop + NAV_FX.edgeBlurPx * 2
      );
      ctx.restore();

      // Secondary wide bloom to remove hard transition perception.
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${Math.round(NAV_FX.edgeBlurPx * 1.7)}px)`;
      const bloomTop = fillY - NAV_FX.edgeBandPx * 1.35;
      const bloomBottom = fillY + NAV_FX.edgeBandPx * 1.7;
      const bloomGrad = ctx.createLinearGradient(0, bloomTop, 0, bloomBottom);
      bloomGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      bloomGrad.addColorStop(
        0.48,
        `rgba(255, 255, 255, ${(0.36 + navProgress * 0.24).toFixed(3)})`
      );
      bloomGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(
        0,
        bloomTop - NAV_FX.edgeBlurPx,
        w,
        bloomBottom - bloomTop + NAV_FX.edgeBlurPx * 2
      );
      ctx.restore();

      // Stable layered grain (sand-like), clipped to filled area.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, fillY);
      ctx.clip();

      if (grainPatternA) {
        const tile = NAV_FX.grainTilePx;
        const offsetXA = (t * NAV_FX.grainDriftX) % tile;
        const offsetYA = (t * NAV_FX.grainDriftY) % tile;
        ctx.globalAlpha = NAV_FX.grainAlpha * (0.46 + navProgress * 0.54);
        ctx.save();
        ctx.translate(offsetXA, offsetYA);
        ctx.fillStyle = grainPatternA;
        ctx.fillRect(-tile, -tile, w + tile * 2, fillY + tile * 2);
        ctx.restore();
      }

      if (grainPatternB) {
        const tile = NAV_FX.grainTilePx;
        const offsetXB = (-t * NAV_FX.grainDriftX * 0.6) % tile;
        const offsetYB = (t * NAV_FX.grainDriftY * 0.4) % tile;
        ctx.globalAlpha = NAV_FX.grainAlpha * (0.3 + navProgress * 0.5);
        ctx.save();
        ctx.translate(offsetXB, offsetYB);
        ctx.fillStyle = grainPatternB;
        ctx.fillRect(-tile, -tile, w + tile * 2, fillY + tile * 2);
        ctx.restore();
      }

      // Slightly denser grain near moving edge for depth.
      if (grainPatternB) {
        const edgeHeight = NAV_FX.edgeBandPx * 1.35;
        const edgeStart = Math.max(0, fillY - edgeHeight * 0.5);
        const edgeEnd = Math.min(h, fillY + edgeHeight);
        ctx.beginPath();
        ctx.rect(0, edgeStart, w, Math.max(1, edgeEnd - edgeStart));
        ctx.clip();
        ctx.globalAlpha = NAV_FX.grainAlpha * (0.65 + navProgress * 0.35);
        ctx.fillStyle = grainPatternB;
        ctx.fillRect(
          -NAV_FX.grainTilePx,
          edgeStart - NAV_FX.grainTilePx,
          w + NAV_FX.grainTilePx * 2,
          edgeEnd - edgeStart + NAV_FX.grainTilePx * 2
        );
      }
      ctx.restore();
    };

    const navFxTick = (timestampMs) => {
      const delta = navTargetProgress - navProgress;
      if (Math.abs(delta) > 0.0004) {
        navProgress += delta * NAV_FX.progressSmoothing;
      } else {
        navProgress = navTargetProgress;
      }
      nav?.style.setProperty("--nav-progress", navProgress.toFixed(3));
      drawNavFx(timestampMs);
      navFxRafId = window.requestAnimationFrame(navFxTick);
    };

    const recomputeNavFillEnd = () => {
      if (!nav) return;
      const navHeight = nav.getBoundingClientRect().height || 64;
      if (heroNav) {
        const heroNavTopAbs = heroNav.getBoundingClientRect().top + window.scrollY;
        const computed = (heroNavTopAbs - navHeight) * NAV_FILL_SCROLL_FACTOR;
        navFillEndScroll = Math.min(
          NAV_FILL_MAX_PX,
          Math.max(NAV_FILL_MIN_PX, computed)
        );
        return;
      }
      navFillEndScroll = NAV_FALLBACK_SCROLL_PX;
    };

    const updateNav = () => {
      if (!nav) return;
      const rawProgress = clamp01(
        (window.scrollY + 24) / Math.max(1, navFillEndScroll)
      );
      const progress = easeOutCubic(rawProgress);
      navTargetProgress = progress;
      if (reducedMotion || !navFxCtx) {
        navProgress = navTargetProgress;
        nav.style.setProperty("--nav-progress", navProgress.toFixed(3));
        if (navFxCtx) {
          drawNavFx(0);
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateNav();
        ticking = false;
      });
    };

    const setMenuOpen = (isOpen) => {
      mobileMenu?.classList.toggle("translate-x-full", !isOpen);
      mobileMenu?.setAttribute("aria-hidden", String(!isOpen));
      mobileMenuBtn?.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "auto";
      if (isOpen) {
        closeMenuBtn?.focus();
      }
    };

    const openMenu = () => {
      setMenuOpen(true);
    };

    const closeMenu = () => {
      setMenuOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const onResizeChange = (event) => {
      if (event.matches) {
        closeMenu();
      }
      resizeNavFxCanvas();
      recomputeNavFillEnd();
      updateNav();
    };

    const onResize = () => {
      resizeNavFxCanvas();
      recomputeNavFillEnd();
      updateNav();
    };

    resizeNavFxCanvas();
    recomputeNavFillEnd();
    updateNav();
    closeMenu();
    if (!reducedMotion && navFxCtx) {
      navFxRafId = window.requestAnimationFrame(navFxTick);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    mobileMenuBtn?.addEventListener("click", openMenu);
    closeMenuBtn?.addEventListener("click", closeMenu);
    mobileBreakpoint.addEventListener("change", onResizeChange);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    document
      .querySelectorAll(".projects-section .fade-in-up")
      .forEach((el, index) => {
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = `${index * 100}ms`;
        }
      });

    document.querySelectorAll(".fade-in-up").forEach((el) => {
      revealObserver.observe(el);
    });

    const carouselSection = document.querySelector(".fast-carousel-section");
    const carouselTrack =
      carouselSection?.querySelector(".carousel-track") || null;
    let carouselObserver;
    if (carouselSection && carouselTrack) {
      carouselObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (reducedMotion) {
              carouselTrack.style.animationPlayState = "paused";
              return;
            }
            carouselTrack.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          });
        },
        { threshold: 0.1 }
      );
      carouselObserver.observe(carouselSection);
    }

    if (reducedMotion && carouselTrack) {
      carouselTrack.style.animationPlayState = "paused";
    }

    return () => {
      document.body.style.overflow = "auto";
      if (navFxRafId) {
        window.cancelAnimationFrame(navFxRafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      mobileMenuBtn?.removeEventListener("click", openMenu);
      closeMenuBtn?.removeEventListener("click", closeMenu);
      mobileBreakpoint.removeEventListener("change", onResizeChange);
      revealObserver.disconnect();
      carouselObserver?.disconnect();
    };
  }, []);

  return null;
}
