(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector(".intro-image");
    const caption = document.getElementById("image-caption");
    if (!hero || !caption) return;

    const slides = [
      { url: "images/home/hero-01.webp", label: "Bahia - leveraging infrastructure projects" },
      { url: "images/home/hero-02.webp", label: "Auckland - new build" },
      { url: "images/home/hero-03.webp", label: "Bahia - 750ha coastal farm" },
      { url: "images/home/hero-04.webp", label: "Bahia - islands" },
      { url: "images/home/hero-05.webp", label: "Japan - 'Akiya' mountain house" },
      { url: "images/home/hero-06.webp", label: "Auckland - development site" },
      { url: "images/home/hero-07.webp", label: "Hakuba - ski chalet" }
    ];

    let current = 0;
    let timer;

    // 1. FAST VIEW: Preload ONLY the first image immediately
    const firstImage = new Image();
    firstImage.src = slides[0].url;
    
    // 2. BACKGROUND LOAD: Preload the rest only when the browser is idle
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preloadRemaining());
      } else {
        setTimeout(preloadRemaining, 2000); // Fallback for older browsers
      }
    });

    function preloadRemaining() {
      slides.slice(1).forEach(slide => {
        const img = new Image();
        img.src = slide.url;
      });
    }

    function updateHero() {
      hero.style.backgroundImage = `url(${slides[current].url})`;
      caption.textContent = slides[current].label;
    }

    const start = () => { if (!timer) timer = setInterval(rotate, 5000); };
    const stop = () => { clearInterval(timer); timer = null; };
    const rotate = () => {
      current = (current + 1) % slides.length;
      updateHero();
    };

    const observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? start() : stop();
    }, { threshold: 0.1 });

    observer.observe(hero);

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });

    updateHero();
  });
})();
