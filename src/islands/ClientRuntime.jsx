import { useEffect } from "preact/hooks";
import { getClientRuntimeElements } from "../utils/clientRuntime/dom";
import { createMenuController } from "../utils/clientRuntime/menuController";
import { createNavController } from "../utils/clientRuntime/navController";
import { createRevealController } from "../utils/clientRuntime/revealController";
import { createScrollbarController } from "../utils/clientRuntime/scrollbarController";

export default function ClientRuntime() {
  useEffect(() => {
    document.documentElement.classList.add("has-islands");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    }

    const elements = getClientRuntimeElements();
    const scrollbar = createScrollbarController(elements);
    const nav = createNavController({ ...elements, reducedMotion });
    const reveal = createRevealController();
    const menu = createMenuController({
      ...elements,
      onMenuStateChange(isOpen) {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        if (!isOpen) {
          scrollbar.update();
        }
      },
    });

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        nav.update();
        scrollbar.update();
        ticking = false;
      });
    };

    const syncLayout = () => {
      nav.syncLayout();
      scrollbar.update();
    };

    const onResize = () => {
      syncLayout();
    };

    const onResizeChange = (event) => {
      if (event.matches) {
        menu.closeMenu({ animate: false });
      }
      syncLayout();
    };

    menu.initialize();
    syncLayout();
    nav.start();
    reveal.observeAll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", menu.onKeyDown);
    window.addEventListener("pointermove", scrollbar.onPointerMove, { passive: false });
    window.addEventListener("pointerup", scrollbar.onPointerEnd);
    window.addEventListener("pointercancel", scrollbar.onPointerEnd);
    elements.mobileMenuBtn?.addEventListener("click", menu.toggleMenu);
    elements.closeMenuBtn?.addEventListener("click", menu.closeMenu);
    elements.mobileBreakpoint.addEventListener("change", onResizeChange);
    elements.customScrollbarThumb?.addEventListener("pointerdown", scrollbar.onThumbPointerDown);

    return () => {
      document.body.style.overflow = "auto";
      nav.stop();
      menu.cleanup();
      reveal.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", menu.onKeyDown);
      window.removeEventListener("pointermove", scrollbar.onPointerMove);
      window.removeEventListener("pointerup", scrollbar.onPointerEnd);
      window.removeEventListener("pointercancel", scrollbar.onPointerEnd);
      elements.mobileMenuBtn?.removeEventListener("click", menu.toggleMenu);
      elements.closeMenuBtn?.removeEventListener("click", menu.closeMenu);
      elements.mobileBreakpoint.removeEventListener("change", onResizeChange);
      elements.customScrollbarThumb?.removeEventListener(
        "pointerdown",
        scrollbar.onThumbPointerDown
      );
    };
  }, []);

  return null;
}
