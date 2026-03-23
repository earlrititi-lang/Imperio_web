const CUSTOM_SCROLLBAR_END_GAP_PX = 4;
const CUSTOM_SCROLLBAR_MIN_THUMB_PX = 34;
const CUSTOM_SCROLLBAR_DEFAULT_TOP_PX = 14;
const CUSTOM_SCROLLBAR_NAV_GAP_PX = 6;

export const createScrollbarController = ({
  nav,
  customScrollbar,
  customScrollbarTrack,
  customScrollbarThumb,
}) => {
  let thumbHeight = CUSTOM_SCROLLBAR_MIN_THUMB_PX;
  let dragOffsetY = 0;
  let dragging = false;

  const getRootScrollMetrics = () => {
    const root = document.documentElement;
    const viewportHeight = window.innerHeight;
    const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
    const maxScroll = Math.max(0, scrollHeight - viewportHeight);
    return { viewportHeight, scrollHeight, maxScroll };
  };

  const updateOffset = () => {
    if (!customScrollbar) return;
    if (!nav) {
      customScrollbar.style.top = `${CUSTOM_SCROLLBAR_DEFAULT_TOP_PX}px`;
      return;
    }

    const navBottom = Math.max(0, nav.getBoundingClientRect().bottom);
    const topOffset = Math.max(
      CUSTOM_SCROLLBAR_DEFAULT_TOP_PX,
      Math.round(navBottom + CUSTOM_SCROLLBAR_NAV_GAP_PX)
    );

    customScrollbar.style.top = `${topOffset}px`;
  };

  const update = () => {
    if (!customScrollbar || !customScrollbarTrack || !customScrollbarThumb) return;

    updateOffset();

    const { viewportHeight, scrollHeight, maxScroll } = getRootScrollMetrics();
    if (maxScroll <= 0) {
      customScrollbar.classList.add("hidden");
      return;
    }

    customScrollbar.classList.remove("hidden");

    const trackRect = customScrollbarTrack.getBoundingClientRect();
    const trackInnerHeight = Math.max(1, trackRect.height - CUSTOM_SCROLLBAR_END_GAP_PX * 2);
    const proportionalHeight = Math.round(
      (viewportHeight / Math.max(1, scrollHeight)) * trackInnerHeight
    );

    thumbHeight = Math.max(
      CUSTOM_SCROLLBAR_MIN_THUMB_PX,
      Math.min(trackInnerHeight, proportionalHeight)
    );

    const thumbTravel = Math.max(0, trackInnerHeight - thumbHeight);
    const scrollProgress = window.scrollY / maxScroll;
    const thumbTop = CUSTOM_SCROLLBAR_END_GAP_PX + Math.round(thumbTravel * scrollProgress);

    customScrollbarThumb.style.height = `${thumbHeight}px`;
    customScrollbarThumb.style.top = `${thumbTop}px`;
  };

  const scrollFromPointer = (clientY) => {
    if (!customScrollbarTrack || !customScrollbarThumb) return;

    const { maxScroll } = getRootScrollMetrics();
    if (maxScroll <= 0) return;

    const trackRect = customScrollbarTrack.getBoundingClientRect();
    const trackInnerHeight = Math.max(1, trackRect.height - CUSTOM_SCROLLBAR_END_GAP_PX * 2);
    const thumbTravel = Math.max(0, trackInnerHeight - thumbHeight);
    if (thumbTravel <= 0) return;

    const rawOffset = clientY - trackRect.top - CUSTOM_SCROLLBAR_END_GAP_PX - dragOffsetY;
    const clampedOffset = Math.max(0, Math.min(thumbTravel, rawOffset));
    const scrollProgress = clampedOffset / thumbTravel;

    window.scrollTo({ top: scrollProgress * maxScroll, behavior: "auto" });
  };

  return {
    update,
    onThumbPointerDown(event) {
      if (!customScrollbar || !customScrollbarThumb) return;

      event.preventDefault();
      dragging = true;
      customScrollbar.classList.add("is-dragging");

      const thumbRect = customScrollbarThumb.getBoundingClientRect();
      dragOffsetY = event.clientY - thumbRect.top;
      customScrollbarThumb.setPointerCapture?.(event.pointerId);
    },
    onPointerMove(event) {
      if (!dragging) return;
      event.preventDefault();
      scrollFromPointer(event.clientY);
    },
    onPointerEnd(event) {
      if (!dragging) return;
      dragging = false;
      customScrollbar?.classList.remove("is-dragging");
      customScrollbarThumb?.releasePointerCapture?.(event.pointerId);
    },
  };
};
