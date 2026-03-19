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
    const heroSection = document.querySelector(".hero-imperio");
    const heroNav = document.querySelector(".hero-imperio__nav");
    const heroNavSurface = heroNav?.querySelector(".hero-nav__surface");
    const heroNavLinksWrap = heroNav?.querySelector(".hero-nav__links-wrap");
    const mainNavInner = nav?.querySelector(".main-nav__inner");
    const mainNavLinksWrap = nav?.querySelector(".main-nav__links-wrap");
    const customScrollbar = document.getElementById("imperio-scrollbar");
    const customScrollbarTrack = document.getElementById("imperio-scrollbar-track");
    const customScrollbarThumb = document.getElementById("imperio-scrollbar-thumb");
    const menuIconTopLine = mobileMenuBtn?.querySelector(".menu-icon__line--top");
    const menuIconMiddleLine = mobileMenuBtn?.querySelector(".menu-icon__line--middle");
    const menuIconBottomLine = mobileMenuBtn?.querySelector(".menu-icon__line--bottom");

      // Esta animacion solo usa un linear-gradient.
    // Medimos la distancia entre el navbar y la barra de letras.
    // Esa distancia se convierte en un progreso de 0 a 1.
    // Con ese progreso aumentamos:
    // - la extension del gradiente
    // - y la opacidad del blanco
    // hasta terminar en un blanco plano.
    const NAV_PROGRESS_SMOOTHING = 0.14;
    const NAV_FALLBACK_SCROLL_PX = 220;
    const NAV_MIN_TRIGGER_DISTANCE_PX = 120;
    const NAV_MAX_TRIGGER_DISTANCE_PX = 520;
    const HERO_OVERLAY_DOCK_OFFSET_Y = 3;
    const MENU_OPEN_ANIM_MS = 760;
    const MENU_CLOSE_ANIM_MS = 760;
    const clamp01 = (value) => Math.min(1, Math.max(0, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
    let navStartDistance = NAV_FALLBACK_SCROLL_PX;
    let navTargetProgress = 0;
    let navProgress = 0;
    let ticking = false;
    let navFxRafId = 0;
    let menuIconAnimRafId = 0;
    let customScrollbarThumbHeight = 34;
    let customScrollbarDragOffsetY = 0;
    let customScrollbarDragging = false;
    let navFloatingLocked = false;
    let navFloatingLockX = 0;
    let navFloatingLockY = 0;
    let heroOverlayCaptured = false;
    let heroOverlayCaptureX = 0;
    let heroOverlayCaptureY = 0;
    let heroOverlayCaptureScroll = 0;
    let heroOverlayDockX = 0;
    let heroOverlayDockY = 0;
    let heroOverlayMergeDistance = 1;
    const CUSTOM_SCROLLBAR_END_GAP_PX = 4;
    const CUSTOM_SCROLLBAR_MIN_THUMB_PX = 34;
    const CUSTOM_SCROLLBAR_DEFAULT_TOP_PX = 14;
    const CUSTOM_SCROLLBAR_NAV_GAP_PX = 6;

    const resetNavMergeState = () => {
      if (!nav) return;
      nav.style.setProperty("--nav-links-progress", "0");
      nav.style.setProperty("--nav-docked-opacity", "0");
      nav.style.setProperty("--nav-floating-opacity", "0");
      nav.style.setProperty("--nav-floating-x", "50vw");
      nav.style.setProperty("--nav-floating-y", "-200px");
      heroNav?.style.setProperty("--hero-links-opacity", "1");
      nav.classList.remove("main-nav--merged", "main-nav--bridging");
    };

    const toRectObject = (rect) => ({
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    const getGlyphRect = (element) => {
      if (!element) return null;
      const range = document.createRange();
      range.selectNodeContents(element);
      const textRects = Array.from(range.getClientRects()).filter(
        (rect) => rect.width > 0 && rect.height > 0
      );
      if (textRects.length === 0) {
        const fallbackRect = element.getBoundingClientRect();
        return fallbackRect.width > 0 && fallbackRect.height > 0
          ? toRectObject(fallbackRect)
          : null;
      }

      const union = textRects.reduce(
        (acc, rect) => ({
          top: Math.min(acc.top, rect.top),
          right: Math.max(acc.right, rect.right),
          bottom: Math.max(acc.bottom, rect.bottom),
          left: Math.min(acc.left, rect.left),
        }),
        {
          top: Number.POSITIVE_INFINITY,
          right: Number.NEGATIVE_INFINITY,
          bottom: Number.NEGATIVE_INFINITY,
          left: Number.POSITIVE_INFINITY,
        }
      );

      return {
        top: union.top,
        right: union.right,
        bottom: union.bottom,
        left: union.left,
        width: union.right - union.left,
        height: union.bottom - union.top,
      };
    };

    const getGlyphClusterRect = (root) => {
      if (!root) return null;
      const glyphs = Array.from(root.querySelectorAll(".nav-link"));
      if (glyphs.length === 0) {
        const fallbackRect = root.getBoundingClientRect();
        return fallbackRect.width > 0 && fallbackRect.height > 0
          ? toRectObject(fallbackRect)
          : null;
      }

      let clusterRect = null;
      glyphs.forEach((glyph) => {
        const rect = getGlyphRect(glyph);
        if (!rect) return;
        if (!clusterRect) {
          clusterRect = { ...rect };
          return;
        }
        clusterRect.top = Math.min(clusterRect.top, rect.top);
        clusterRect.right = Math.max(clusterRect.right, rect.right);
        clusterRect.bottom = Math.max(clusterRect.bottom, rect.bottom);
        clusterRect.left = Math.min(clusterRect.left, rect.left);
        clusterRect.width = clusterRect.right - clusterRect.left;
        clusterRect.height = clusterRect.bottom - clusterRect.top;
      });

      return clusterRect;
    };

    // Devuelve el bloque que contiene las letras del hero.
    // Lo usamos como "objetivo" para saber cuanto le falta al navbar.
    const getNavLettersRect = () =>
      getGlyphClusterRect(heroNavLinksWrap) ??
      getGlyphClusterRect(heroNavSurface) ??
      null;

    const syncHeroOverlayPosition = () => {
      if (!heroSection || !heroNav || !mobileBreakpoint.matches) return;
      const linksWrapRect = toRectObject(
        mainNavLinksWrap?.getBoundingClientRect?.() ??
        mainNavInner?.getBoundingClientRect?.() ??
        nav?.getBoundingClientRect?.() ??
        heroNav.getBoundingClientRect()
      );
      if (!linksWrapRect || linksWrapRect.height <= 0 || linksWrapRect.width <= 0) return;
      heroOverlayDockX = linksWrapRect.left + linksWrapRect.width / 2;
      heroOverlayDockY =
        linksWrapRect.top + linksWrapRect.height / 2 + HERO_OVERLAY_DOCK_OFFSET_Y;
    };

    const releaseHeroOverlay = () => {
      heroOverlayCaptured = false;
      heroSection?.classList.remove("hero-imperio--nav-captured");
    };

    const captureHeroOverlay = (sourceRect) => {
      if (!heroSection) return;
      heroOverlayCaptured = true;
      heroOverlayCaptureX = sourceRect.left + sourceRect.width / 2;
      heroOverlayCaptureY = sourceRect.top + sourceRect.height / 2;
      heroOverlayCaptureScroll = window.scrollY;
      heroOverlayMergeDistance = Math.max(1, heroOverlayCaptureY - heroOverlayDockY);
      heroSection.style.setProperty(
        "--hero-overlay-left",
        `${heroOverlayCaptureX.toFixed(2)}px`
      );
      heroSection.style.setProperty(
        "--hero-overlay-top",
        `${heroOverlayCaptureY.toFixed(2)}px`
      );
      heroSection.classList.add("hero-imperio--nav-captured");
    };

    const updateHeroOverlayPosition = (sourceRect) => {
      if (!heroSection) return;
      if (!mobileBreakpoint.matches) {
        releaseHeroOverlay();
        return;
      }
      const liveSourceRect =
        sourceRect ??
        getGlyphClusterRect(heroNavLinksWrap) ??
        getGlyphClusterRect(heroNavSurface) ??
        null;
      const navRect = nav?.getBoundingClientRect();
      if (!navRect || !liveSourceRect) {
        releaseHeroOverlay();
        return;
      }

      if (!heroOverlayCaptured) {
        if (navRect.bottom >= liveSourceRect.top) {
          captureHeroOverlay(liveSourceRect);
        } else {
          releaseHeroOverlay();
        }
        return;
      }

      if (window.scrollY <= heroOverlayCaptureScroll && navRect.bottom < liveSourceRect.top) {
        releaseHeroOverlay();
        return;
      }

      const rawProgress = clamp01(
        (window.scrollY - heroOverlayCaptureScroll) / heroOverlayMergeDistance
      );
      const progress = easeOutCubic(rawProgress);
      const currentX =
        heroOverlayCaptureX + (heroOverlayDockX - heroOverlayCaptureX) * progress;
      const currentY =
        heroOverlayCaptureY + (heroOverlayDockY - heroOverlayCaptureY) * progress;
      heroSection.style.setProperty(
        "--hero-overlay-left",
        `${currentX.toFixed(2)}px`
      );
      heroSection.style.setProperty(
        "--hero-overlay-top",
        `${currentY.toFixed(2)}px`
      );
    };

    const updateNavGradient = () => {
      if (!nav) return;

      // Con progress = 0:
      // el gradiente es suave y con sensacion de cristal.
      // Con progress = 1:
      // el gradiente ocupa todo el navbar y arriba/abajo son blancos,
      // asi que visualmente termina en blanco plano.
      const fluidProgress =
        navProgress * navProgress * (3 - 2 * navProgress);
      const gradientStop = 8 + 92 * fluidProgress;
      const topAlpha = 0.16 + 0.84 * fluidProgress;
      const bottomAlpha = Math.min(1, fluidProgress * fluidProgress);

      nav.style.setProperty("--nav-gradient-stop", `${gradientStop.toFixed(2)}%`);
      nav.style.setProperty("--nav-gradient-top-alpha", topAlpha.toFixed(3));
      nav.style.setProperty("--nav-gradient-bottom-alpha", bottomAlpha.toFixed(3));
      nav.style.setProperty("--nav-glass-alpha", (0.12 + fluidProgress * 0.24).toFixed(3));
      nav.style.setProperty(
        "--nav-glass-line-alpha",
        (0.22 + fluidProgress * 0.3).toFixed(3)
      );
      nav.style.setProperty(
        "--nav-glass-shadow-alpha",
        (0.08 + fluidProgress * 0.14).toFixed(3)
      );
    };

    const navFxTick = () => {
      const delta = navTargetProgress - navProgress;
      if (Math.abs(delta) > 0.0004) {
        navProgress += delta * NAV_PROGRESS_SMOOTHING;
      } else {
        navProgress = navTargetProgress;
      }
      nav?.style.setProperty("--nav-progress", navProgress.toFixed(3));
      updateNavGradient();
      updateMenuButtonTone();
      navFxRafId = window.requestAnimationFrame(navFxTick);
    };

    const updateMenuButtonTone = () => {
      if (!nav || !mobileMenuBtn) return;
      const navRect = nav.getBoundingClientRect();
      const buttonRect = mobileMenuBtn.getBoundingClientRect();
      const navHeight = Math.max(1, navRect.height);
      const fillFrontY = navRect.top + navHeight * navProgress;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      nav.classList.toggle("main-nav--hamburger-dark", fillFrontY >= buttonCenterY);
    };

    const recomputeNavStartDistance = () => {
      if (!nav) return;
      const navRect = nav.getBoundingClientRect();
      const sourceRect = getNavLettersRect();
      if (sourceRect) {
        const initialGap = Math.max(0, sourceRect.top - navRect.bottom);
        navStartDistance = Math.min(
          NAV_MAX_TRIGGER_DISTANCE_PX,
          Math.max(NAV_MIN_TRIGGER_DISTANCE_PX, initialGap)
        );
        return;
      }
      navStartDistance = NAV_FALLBACK_SCROLL_PX;
    };

    const updateNav = () => {
      if (!nav) return;
      const navRect = nav.getBoundingClientRect();
      const sourceRect = getNavLettersRect();

      // Si encontramos la barra de letras, usamos la distancia real en pantalla.
      // Si no, usamos el scroll como plan B.
      const rawProgress = sourceRect
        ? 1 - clamp01(Math.max(0, sourceRect.top - navRect.bottom) / Math.max(1, navStartDistance))
        : clamp01(window.scrollY / NAV_FALLBACK_SCROLL_PX);
      const progress = easeOutCubic(rawProgress);
      navTargetProgress = progress;
      updateNavMergeState();
      updateHeroOverlayPosition();
      if (reducedMotion) {
        navProgress = navTargetProgress;
        nav.style.setProperty("--nav-progress", navProgress.toFixed(3));
        updateNavGradient();
        updateMenuButtonTone();
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateNav();
        updateCustomScrollbar();
        ticking = false;
      });
    };

    const updateNavMergeState = () => {
      if (!nav || !heroNav || !mobileBreakpoint.matches) {
        resetNavMergeState();
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const sourceRect = getNavLettersRect();
      if (!sourceRect || sourceRect.height <= 0) {
        resetNavMergeState();
        return;
      }

      const hasContact = navRect.bottom >= sourceRect.top;

      nav.style.setProperty("--nav-links-progress", navTargetProgress.toFixed(3));
      nav.style.setProperty("--nav-docked-opacity", "0");
      nav.style.setProperty("--nav-floating-opacity", "0");
      nav.style.setProperty("--nav-floating-x", "50vw");
      nav.style.setProperty("--nav-floating-y", "-200px");
      heroNav.style.setProperty("--hero-links-opacity", "1");
      nav.classList.toggle("main-nav--bridging", hasContact || navTargetProgress > 0);
      nav.classList.remove("main-nav--merged");
    };

    const getRootScrollMetrics = () => {
      const root = document.documentElement;
      const viewportHeight = window.innerHeight;
      const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
      const maxScroll = Math.max(0, scrollHeight - viewportHeight);
      return { viewportHeight, scrollHeight, maxScroll };
    };

    const updateCustomScrollbarOffset = () => {
      if (!customScrollbar) return;
      if (!nav) {
        customScrollbar.style.top = `${CUSTOM_SCROLLBAR_DEFAULT_TOP_PX}px`;
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const navBottom = Math.max(0, navRect.bottom);
      const topOffset = Math.max(
        CUSTOM_SCROLLBAR_DEFAULT_TOP_PX,
        Math.round(navBottom + CUSTOM_SCROLLBAR_NAV_GAP_PX)
      );
      customScrollbar.style.top = `${topOffset}px`;
    };

    const updateCustomScrollbar = () => {
      if (!customScrollbar || !customScrollbarTrack || !customScrollbarThumb) return;
      updateCustomScrollbarOffset();
      const { viewportHeight, scrollHeight, maxScroll } = getRootScrollMetrics();
      if (maxScroll <= 0) {
        customScrollbar.classList.add("hidden");
        return;
      }

      customScrollbar.classList.remove("hidden");
      const trackRect = customScrollbarTrack.getBoundingClientRect();
      const trackInnerHeight = Math.max(
        1,
        trackRect.height - CUSTOM_SCROLLBAR_END_GAP_PX * 2
      );
      const proportionalHeight = Math.round(
        (viewportHeight / Math.max(1, scrollHeight)) * trackInnerHeight
      );
      customScrollbarThumbHeight = Math.max(
        CUSTOM_SCROLLBAR_MIN_THUMB_PX,
        Math.min(trackInnerHeight, proportionalHeight)
      );

      const thumbTravel = Math.max(0, trackInnerHeight - customScrollbarThumbHeight);
      const scrollProgress = window.scrollY / maxScroll;
      const thumbTop =
        CUSTOM_SCROLLBAR_END_GAP_PX + Math.round(thumbTravel * scrollProgress);

      customScrollbarThumb.style.height = `${customScrollbarThumbHeight}px`;
      customScrollbarThumb.style.top = `${thumbTop}px`;
    };

    const scrollFromCustomScrollbar = (clientY, centerThumb = false) => {
      if (!customScrollbarTrack || !customScrollbarThumb) return;
      const { maxScroll } = getRootScrollMetrics();
      if (maxScroll <= 0) return;

      const trackRect = customScrollbarTrack.getBoundingClientRect();
      const trackInnerHeight = Math.max(
        1,
        trackRect.height - CUSTOM_SCROLLBAR_END_GAP_PX * 2
      );
      const thumbTravel = Math.max(0, trackInnerHeight - customScrollbarThumbHeight);
      if (thumbTravel <= 0) return;

      const offset = centerThumb
        ? customScrollbarThumbHeight / 2
        : customScrollbarDragOffsetY;
      const rawOffset =
        clientY - trackRect.top - CUSTOM_SCROLLBAR_END_GAP_PX - offset;
      const clampedOffset = Math.max(0, Math.min(thumbTravel, rawOffset));
      const scrollProgress = clampedOffset / thumbTravel;
      window.scrollTo({ top: scrollProgress * maxScroll, behavior: "auto" });
    };

    const onCustomThumbPointerDown = (event) => {
      if (!customScrollbar || !customScrollbarThumb) return;
      event.preventDefault();
      customScrollbarDragging = true;
      customScrollbar.classList.add("is-dragging");
      const thumbRect = customScrollbarThumb.getBoundingClientRect();
      customScrollbarDragOffsetY = event.clientY - thumbRect.top;
      customScrollbarThumb.setPointerCapture?.(event.pointerId);
    };

    const onCustomPointerMove = (event) => {
      if (!customScrollbarDragging) return;
      event.preventDefault();
      scrollFromCustomScrollbar(event.clientY);
    };

    const onCustomPointerEnd = (event) => {
      if (!customScrollbarDragging) return;
      customScrollbarDragging = false;
      customScrollbar?.classList.remove("is-dragging");
      customScrollbarThumb?.releasePointerCapture?.(event.pointerId);
    };

    const MENU_POSE_OPEN = [
      {
        progress: 0,
        top: { x: 3, y: 9, width: 14, angle: 0, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: 0, opacity: 1, origin: "50% 50%" },
        bottom: { x: 17, y: 23, width: 14, angle: 0, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.12,
        top: { x: 3, y: 9, width: 14, angle: 2, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -34, opacity: 1, origin: "50% 50%" },
        bottom: { x: 17, y: 23, width: 14, angle: 2, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.24,
        top: { x: 3, y: 9, width: 14, angle: 8, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -86, opacity: 1, origin: "50% 50%" },
        bottom: { x: 17, y: 23, width: 14, angle: 8, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.4,
        top: { x: 4, y: 8, width: 14, angle: 20, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -168, opacity: 1, origin: "50% 50%" },
        bottom: { x: 16, y: 24, width: 14, angle: 20, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.58,
        top: { x: 5, y: 8, width: 14, angle: 31, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -246, opacity: 1, origin: "50% 50%" },
        bottom: { x: 15, y: 24, width: 14, angle: 31, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.76,
        top: { x: 6, y: 7, width: 14, angle: 40, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -308, opacity: 1, origin: "50% 50%" },
        bottom: { x: 14, y: 25, width: 14, angle: 40, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 1,
        top: { x: 7, y: 6, width: 14, angle: 45, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -405, opacity: 1, origin: "50% 50%" },
        bottom: { x: 13, y: 26, width: 14, angle: 45, opacity: 1, origin: "100% 50%" },
      },
    ];

    const MENU_POSE_CLOSE = [
      {
        progress: 0,
        top: { x: 7, y: 6, width: 14, angle: 45, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -405, opacity: 1, origin: "50% 50%" },
        bottom: { x: 13, y: 26, width: 14, angle: 45, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.16,
        top: { x: 6, y: 7, width: 14, angle: 40, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -350, opacity: 1, origin: "50% 50%" },
        bottom: { x: 14, y: 25, width: 14, angle: 40, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.34,
        top: { x: 5, y: 8, width: 14, angle: 30, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -270, opacity: 1, origin: "50% 50%" },
        bottom: { x: 15, y: 24, width: 14, angle: 30, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.56,
        top: { x: 4, y: 8, width: 14, angle: 18, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -174, opacity: 1, origin: "50% 50%" },
        bottom: { x: 16, y: 24, width: 14, angle: 18, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 0.8,
        top: { x: 3, y: 9, width: 14, angle: 7, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: -64, opacity: 1, origin: "50% 50%" },
        bottom: { x: 17, y: 23, width: 14, angle: 7, opacity: 1, origin: "100% 50%" },
      },
      {
        progress: 1,
        top: { x: 3, y: 9, width: 14, angle: 0, opacity: 1, origin: "0% 50%" },
        middle: { x: 3, y: 16, width: 28, angle: 0, opacity: 1, origin: "50% 50%" },
        bottom: { x: 17, y: 23, width: 14, angle: 0, opacity: 1, origin: "100% 50%" },
      },
    ];

    const lerp = (from, to, t) => from + (to - from) * t;

    const interpolateLinePose = (from, to, t) => ({
      x: lerp(from.x, to.x, t),
      y: lerp(from.y, to.y, t),
      width: lerp(from.width, to.width, t),
      angle: lerp(from.angle, to.angle, t),
      opacity: lerp(from.opacity, to.opacity, t),
      origin: to.origin ?? from.origin ?? "50% 50%",
    });

    const getMenuPoseAt = (frames, progress) => {
      if (progress <= frames[0].progress) return frames[0];
      for (let i = 1; i < frames.length; i += 1) {
        const prev = frames[i - 1];
        const next = frames[i];
        if (progress <= next.progress) {
          const localT =
            (progress - prev.progress) / Math.max(0.0001, next.progress - prev.progress);
          return {
            top: interpolateLinePose(prev.top, next.top, localT),
            middle: interpolateLinePose(prev.middle, next.middle, localT),
            bottom: interpolateLinePose(prev.bottom, next.bottom, localT),
          };
        }
      }
      return frames[frames.length - 1];
    };

    const applyLinePose = (element, pose) => {
      if (!element) return;
      element.style.left = `${pose.x}px`;
      element.style.width = `${pose.width}px`;
      element.style.opacity = String(pose.opacity);
      element.style.transformOrigin = pose.origin ?? "50% 50%";
      element.style.transform = `translate3d(0, ${pose.y}px, 0) rotate(${pose.angle}deg)`;
    };

    const applyMenuPose = (pose) => {
      applyLinePose(menuIconTopLine, pose.top);
      applyLinePose(menuIconMiddleLine, pose.middle);
      applyLinePose(menuIconBottomLine, pose.bottom);
    };

    const setMenuButtonVisualState = (isOpen, animate = true) => {
      if (!mobileMenuBtn) return;
      mobileMenuBtn.classList.remove("is-opening", "is-closing");
      if (menuIconAnimRafId) {
        window.cancelAnimationFrame(menuIconAnimRafId);
        menuIconAnimRafId = 0;
      }
      if (!animate) {
        mobileMenuBtn.classList.toggle("is-active", isOpen);
        applyMenuPose(
          isOpen
            ? MENU_POSE_OPEN[MENU_POSE_OPEN.length - 1]
            : MENU_POSE_CLOSE[MENU_POSE_CLOSE.length - 1]
        );
        return;
      }
      const keyframes = isOpen ? MENU_POSE_OPEN : MENU_POSE_CLOSE;
      const duration = isOpen ? MENU_OPEN_ANIM_MS : MENU_CLOSE_ANIM_MS;
      const start = performance.now();
      mobileMenuBtn.classList.add(isOpen ? "is-opening" : "is-closing");
      mobileMenuBtn.classList.toggle("is-active", isOpen);
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        applyMenuPose(getMenuPoseAt(keyframes, progress));
        if (progress < 1) {
          menuIconAnimRafId = window.requestAnimationFrame(tick);
          return;
        }
        mobileMenuBtn.classList.remove("is-opening", "is-closing");
        menuIconAnimRafId = 0;
      };
      menuIconAnimRafId = window.requestAnimationFrame(tick);
    };

    const setMenuOpen = (isOpen, options = {}) => {
      const { animate = true } = options;
      mobileMenu?.classList.toggle("translate-x-full", !isOpen);
      mobileMenu?.setAttribute("aria-hidden", String(!isOpen));
      mobileMenuBtn?.setAttribute("aria-expanded", String(isOpen));
      setMenuButtonVisualState(isOpen, animate);
      mobileMenuBtn?.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menu" : "Abrir menu"
      );
      document.body.style.overflow = isOpen ? "hidden" : "auto";
      if (!isOpen) {
        updateCustomScrollbar();
      }
      if (isOpen) {
        closeMenuBtn?.focus();
      }
    };

    const openMenu = () => {
      const isOpen = mobileMenuBtn?.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
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
        setMenuOpen(false, { animate: false });
      }
      syncHeroOverlayPosition();
      recomputeNavStartDistance();
      updateNav();
      updateCustomScrollbar();
    };

    const onResize = () => {
      syncHeroOverlayPosition();
      recomputeNavStartDistance();
      updateNav();
      updateCustomScrollbar();
    };

    syncHeroOverlayPosition();
    recomputeNavStartDistance();
    updateNav();
    updateMenuButtonTone();
    updateCustomScrollbar();
    applyMenuPose(MENU_POSE_CLOSE[MENU_POSE_CLOSE.length - 1]);
    setMenuOpen(false, { animate: false });
    if (!reducedMotion) {
      navFxRafId = window.requestAnimationFrame(navFxTick);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointermove", onCustomPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", onCustomPointerEnd);
    window.addEventListener("pointercancel", onCustomPointerEnd);
    mobileMenuBtn?.addEventListener("click", openMenu);
    closeMenuBtn?.addEventListener("click", closeMenu);
    mobileBreakpoint.addEventListener("change", onResizeChange);
    customScrollbarThumb?.addEventListener("pointerdown", onCustomThumbPointerDown);

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

    return () => {
      document.body.style.overflow = "auto";
      if (navFxRafId) {
        window.cancelAnimationFrame(navFxRafId);
      }
      if (menuIconAnimRafId) {
        window.cancelAnimationFrame(menuIconAnimRafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onCustomPointerMove);
      window.removeEventListener("pointerup", onCustomPointerEnd);
      window.removeEventListener("pointercancel", onCustomPointerEnd);
      mobileMenuBtn?.removeEventListener("click", openMenu);
      closeMenuBtn?.removeEventListener("click", closeMenu);
      mobileBreakpoint.removeEventListener("change", onResizeChange);
      customScrollbarThumb?.removeEventListener(
        "pointerdown",
        onCustomThumbPointerDown
      );
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
