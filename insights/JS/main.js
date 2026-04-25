/* ================= HEADER / FOOTER LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  // FIX: Using "/" ensures it always looks at the root folder
  if (header) {
    fetch("/header.html") 
      .then(res => {
        if (!res.ok) throw new Error('Header file not found at root');
        return res.text();
      })
      .then(html => {
        header.innerHTML = html;
        initMobileNav();
      })
      .catch(err => console.error("Header Error:", err));
  }

  if (footer) {
    fetch("/footer.html")
      .then(res => {
        if (!res.ok) throw new Error('Footer file not found at root');
        return res.text();
      })
      .then(html => {
        footer.innerHTML = html;
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = new Date().getFullYear();
      })
      .catch(err => console.error("Footer Error:", err));
  }
});

/* ================= MOBILE NAV ================= */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

/* ================= CAROUSEL ================= */
function initCarousel() {
  const carousel = document.querySelector('.home-carousel');
 
  if (!carousel || carousel.dataset.initialised) return;

  const track = carousel.querySelector('.carousel-track');
  const items = carousel.querySelectorAll('.project-box');
  const left = carousel.querySelector('.carousel-arrow.left');
  const right = carousel.querySelector('.carousel-arrow.right');
  const wrapper = carousel.querySelector('.carousel-wrapper');

  if (!track || !items.length || !left || !right || !wrapper) return;

  // ✅ mark as initialised ONLY when ready
  carousel.dataset.initialised = "true";
  
  let currentTranslate = 0;
  const gap = parseInt(getComputedStyle(track).gap) || 40;

  function getItemWidth() {
    return items[0].getBoundingClientRect().width;
  }

  function getMaxScroll() {
    const totalWidth = items.length * (getItemWidth() + gap) - gap;
    return Math.max(totalWidth - wrapper.clientWidth, 0);
  }

  function updateTranslate() {
    const maxScroll = getMaxScroll();
    currentTranslate = Math.min(0, Math.max(currentTranslate, -maxScroll));
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Arrow clicks
  left.addEventListener('click', () => {
    currentTranslate += getItemWidth() + gap;
    updateTranslate();
  });

  right.addEventListener('click', () => {
    currentTranslate -= getItemWidth() + gap;
    updateTranslate();
  });

  // Drag (desktop)
  let dragging = false, startX = 0, prevTranslate = 0;

  track.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.pageX;
    prevTranslate = currentTranslate;
  });

  window.addEventListener('mouseup', () => dragging = false);

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    currentTranslate = prevTranslate + (e.pageX - startX);
    updateTranslate();
  });

  window.addEventListener('resize', updateTranslate);

  updateTranslate();
}

document.addEventListener('DOMContentLoaded', initCarousel);
