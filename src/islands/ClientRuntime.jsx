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
    let ticking = false;

    const updateNav = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 50);
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
    };

    updateNav();
    closeMenu();
    window.addEventListener("scroll", onScroll, { passive: true });
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
      window.removeEventListener("scroll", onScroll);
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
