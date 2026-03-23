const MENU_OPEN_ANIM_MS = 760;
const MENU_CLOSE_ANIM_MS = 760;

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

  for (let index = 1; index < frames.length; index += 1) {
    const previous = frames[index - 1];
    const next = frames[index];
    if (progress > next.progress) continue;

    const localProgress =
      (progress - previous.progress) /
      Math.max(0.0001, next.progress - previous.progress);

    return {
      top: interpolateLinePose(previous.top, next.top, localProgress),
      middle: interpolateLinePose(previous.middle, next.middle, localProgress),
      bottom: interpolateLinePose(previous.bottom, next.bottom, localProgress),
    };
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

const applyMenuPose = (elements, pose) => {
  applyLinePose(elements.menuIconTopLine, pose.top);
  applyLinePose(elements.menuIconMiddleLine, pose.middle);
  applyLinePose(elements.menuIconBottomLine, pose.bottom);
};

export const createMenuController = ({
  mobileMenuBtn,
  mobileMenu,
  closeMenuBtn,
  menuIconTopLine,
  menuIconMiddleLine,
  menuIconBottomLine,
  onMenuStateChange,
}) => {
  const menuIconElements = {
    menuIconTopLine,
    menuIconMiddleLine,
    menuIconBottomLine,
  };

  let menuIconAnimationFrameId = 0;

  const setMenuButtonVisualState = (isOpen, animate = true) => {
    if (!mobileMenuBtn) return;

    mobileMenuBtn.classList.remove("is-opening", "is-closing");

    if (menuIconAnimationFrameId) {
      window.cancelAnimationFrame(menuIconAnimationFrameId);
      menuIconAnimationFrameId = 0;
    }

    if (!animate) {
      mobileMenuBtn.classList.toggle("is-active", isOpen);
      applyMenuPose(
        menuIconElements,
        isOpen
          ? MENU_POSE_OPEN[MENU_POSE_OPEN.length - 1]
          : MENU_POSE_CLOSE[MENU_POSE_CLOSE.length - 1]
      );
      return;
    }

    const keyframes = isOpen ? MENU_POSE_OPEN : MENU_POSE_CLOSE;
    const duration = isOpen ? MENU_OPEN_ANIM_MS : MENU_CLOSE_ANIM_MS;
    const startTime = performance.now();

    mobileMenuBtn.classList.add(isOpen ? "is-opening" : "is-closing");
    mobileMenuBtn.classList.toggle("is-active", isOpen);

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      applyMenuPose(menuIconElements, getMenuPoseAt(keyframes, progress));

      if (progress < 1) {
        menuIconAnimationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      mobileMenuBtn.classList.remove("is-opening", "is-closing");
      menuIconAnimationFrameId = 0;
    };

    menuIconAnimationFrameId = window.requestAnimationFrame(tick);
  };

  const setMenuOpen = (isOpen, options = {}) => {
    const { animate = true } = options;

    mobileMenu?.classList.toggle("side-bar--open", isOpen);
    mobileMenu?.setAttribute("aria-hidden", String(!isOpen));
    mobileMenuBtn?.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn?.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");

    setMenuButtonVisualState(isOpen, animate);
    onMenuStateChange?.(isOpen);

    if (isOpen) {
      closeMenuBtn?.focus();
    }
  };

  return {
    initialize() {
      applyMenuPose(menuIconElements, MENU_POSE_CLOSE[MENU_POSE_CLOSE.length - 1]);
      setMenuOpen(false, { animate: false });
    },
    toggleMenu() {
      const isOpen = mobileMenuBtn?.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    },
    closeMenu(options) {
      setMenuOpen(false, options);
    },
    onKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    },
    cleanup() {
      if (menuIconAnimationFrameId) {
        window.cancelAnimationFrame(menuIconAnimationFrameId);
      }
    },
  };
};
