const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const copyButton = document.getElementById("copy-contract");
const contractEl = document.getElementById("contract");
if (copyButton && contractEl) {
  copyButton.addEventListener("click", () => {
    const value = contractEl.textContent.trim();
    if (!value || value === "TBD") {
      copyButton.textContent = "Kontrakt ešte nie je";
      setTimeout(() => (copyButton.textContent = "Skopírovať kontrakt"), 1400);
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      copyButton.textContent = "Skopírované";
      setTimeout(() => (copyButton.textContent = "Skopírovať kontrakt"), 1400);
    });
  });
}

const initMatrixRain = () => {
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) return;

  const ctx = canvas.getContext("2d");
  const chars = "01WW3XYZ▲▼/<>*#@";
  const fontSize = 18;
  const speed = 0.35;
  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.floor(width / fontSize);
    drops = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * height / fontSize)
    );
  };

  const draw = () => {
    ctx.fillStyle = "rgba(5, 7, 13, 0.08)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px 'Space Grotesk', monospace`;
    ctx.fillStyle = "rgba(102, 255, 136, 0.75)";
    for (let i = 0; i < columns; i += 1) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += speed;
    }
    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
};

initMatrixRain();
