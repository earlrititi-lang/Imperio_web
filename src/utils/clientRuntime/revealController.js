export const createRevealController = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
  );

  return {
    observeAll() {
      document.querySelectorAll(".projects-section .fade-in-up").forEach((element, index) => {
        if (!element.style.transitionDelay) {
          element.style.transitionDelay = `${index * 100}ms`;
        }
      });

      document.querySelectorAll(".fade-in-up").forEach((element) => {
        observer.observe(element);
      });
    },
    disconnect() {
      observer.disconnect();
    },
  };
};
