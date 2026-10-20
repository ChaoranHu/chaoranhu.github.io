// One photo at a time carousels. Swipe on phones (native scroll snapping),
// arrow buttons and dots on desktop, and Left/Right keys when a carousel has focus.
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".track");
  const slides = Array.from(track.children);
  // A single photo needs no arrows, counter or dots.
  if (slides.length < 2) return;

  const prev = document.createElement("button");
  prev.className = "nav prev";
  prev.setAttribute("aria-label", "Previous photo");
  prev.textContent = "‹";
  const next = document.createElement("button");
  next.className = "nav next";
  next.setAttribute("aria-label", "Next photo");
  next.textContent = "›";
  const count = document.createElement("div");
  count.className = "count";
  const dots = document.createElement("div");
  dots.className = "dots";
  const dotButtons = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Photo ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
    return dot;
  });
  carousel.append(prev, next, count, dots);

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
    dotButtons.forEach((d, i) => d.setAttribute("aria-current", i === current ? "true" : "false"));
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
