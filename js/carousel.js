(function () {
  function initCarousel(carousel) {
    if (!carousel || carousel.dataset.initialised === "true") return;

    const track = carousel.querySelector('.carousel-track');
    const viewport = carousel.querySelector('.carousel-viewport');
    if (!track || !viewport) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;

    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');

    let index = 0;
    let scrollStep = 0;

    function calculateMetrics() {
      // Standard full-width behavior for the Offices carousel
      const viewportWidth = viewport.getBoundingClientRect().width;
      scrollStep = viewportWidth;
      
      slides.forEach(slide => {
        slide.style.width = scrollStep + 'px';
      });
    }

    function moveToSlide(i) {
      if (scrollStep > 0) {
        // Standard infinite loop logic: wraps back to start/end
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * scrollStep}px)`;
      }
    }

    function goNext() {
      moveToSlide(index + 1);
    }

    function goPrev() {
      moveToSlide(index - 1);
    }

    function handleResize() {
      calculateMetrics();
      moveToSlide(index);
    }

    // Small delay to ensure DOM dimensions are painted before calculating
    setTimeout(() => {
      calculateMetrics();
      moveToSlide(index);
    }, 100);

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    carousel.dataset.initialised = "true";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // This will now only affect the "Offices" section 
    // since you removed 'data-carousel' from the "Services" HTML.
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  });
})();
