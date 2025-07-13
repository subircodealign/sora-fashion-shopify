document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('promo-carousel');
  const slides = slider.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let scrollTimeout = null;
  let autoSlide = null;
  let ignoreScrollEvents = false;

  function updateDots(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-secondary', i === index);
      dot.classList.toggle('bg-stone-300', i !== index);
    });
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    
    if (currentIndex === totalSlides - 1 && index === 0) {
      ignoreScrollEvents = true;
      slider.scrollLeft = 0;
      currentIndex = 0;
      updateDots(0);
      resetAutoSlide();

      setTimeout(() => {
        ignoreScrollEvents = false;
      }, 150);

      return;
    }

    const slide = slides[index];
    if (!slide) return;

    const slideLeft = slide.offsetLeft;
    const slideWidth = slide.offsetWidth;
    const sliderWidth = slider.offsetWidth;

    const scrollPosition = slideLeft - (sliderWidth / 2) + (slideWidth / 2);

    slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      currentIndex = index;
      updateDots(index);
      resetAutoSlide();
    }, 350);
  }

  slider.addEventListener('scroll', () => {
    if (ignoreScrollEvents) return;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const center = slider.scrollLeft + slider.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - slideCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        updateDots(closestIndex);
        resetAutoSlide();
      }
    }, 200);
  });

  function resetAutoSlide() {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      let nextIndex = (currentIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, 5000);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      scrollToSlide(idx);
      resetAutoSlide();
    });
  });


  scrollToSlide(0);
  resetAutoSlide();
});
