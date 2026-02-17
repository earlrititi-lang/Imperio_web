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

    const openMenu = () => {
      mobileMenu?.classList.remove("translate-x-full");
    };

    const closeMenu = () => {
      mobileMenu?.classList.add("translate-x-full");
    };

    updateNav();
    window.addEventListener("scroll", onScroll, { passive: true });
    mobileMenuBtn?.addEventListener("click", openMenu);
    closeMenuBtn?.addEventListener("click", closeMenu);

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
      window.removeEventListener("scroll", onScroll);
      mobileMenuBtn?.removeEventListener("click", openMenu);
      closeMenuBtn?.removeEventListener("click", closeMenu);
      revealObserver.disconnect();
      carouselObserver?.disconnect();
    };
  }, []);

  return null;
}
