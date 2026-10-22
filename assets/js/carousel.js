// One photo at a time carousels. Swipe on phones (native scroll snapping),
// Previous / Next words under the photo, and Left/Right keys when a carousel has focus.
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".track");
  const slides = Array.from(track.children);
  // A single photo needs no Previous / Next or counter.
  if (slides.length < 2) return;

  // Under the photo: "Previous", the counter and "Next" in the site font.
  const button = (cls, label, text) => {
    const b = document.createElement("button");
    b.className = cls;
    b.setAttribute("aria-label", label);
    b.textContent = text;
    return b;
  };
  const prev = button("prev", "Previous photo", "‹ Previous");
  const next = button("next", "Next photo", "Next ›");
  const count = document.createElement("span");
  count.className = "count";
  const pager = document.createElement("div");
  pager.className = "pager";
  pager.append(prev, count, next);
  carousel.append(pager);

  let current = 0;
  const go = (i) => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: i * track.clientWidth });
  };
  const update = () => {
    current = Math.round(track.scrollLeft / track.clientWidth);
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    count.textContent = `${current + 1} / ${slides.length}`;
  };

  prev.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  track.addEventListener("scroll", () => window.requestAnimationFrame(update), { passive: true });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
  });
  window.addEventListener("resize", () => go(current));
  update();
});
