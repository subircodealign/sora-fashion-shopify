document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('promo-carousel');
  const slides = slider.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlide = null;
  let isManualScroll = false;

  function updateDots(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-secondary', i === index);
      dot.classList.toggle('bg-stone-300', i !== index);
    });
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    const slide = slides[index];
    if (!slide) return;

    const slideLeft = slide.offsetLeft;
    const slideWidth = slide.offsetWidth;
    const sliderWidth = slider.offsetWidth;
    const scrollPosition = slideLeft - (sliderWidth / 2) + (slideWidth / 2);


    isManualScroll = true;
    slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });

    currentIndex = index;
    updateDots(index);
    resetAutoSlide();

 
    setTimeout(() => {
      isManualScroll = false;
    }, 600);
  }

  function resetAutoSlide() {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      let nextIndex = (currentIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, 5000);
  }


  let scrollTimeout;
  slider.addEventListener('scroll', () => {
    if (isManualScroll) return;

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

      currentIndex = closestIndex;
      updateDots(currentIndex);
      resetAutoSlide();
    }, 100);
  });

 
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      scrollToSlide(idx);
    });
  });


  scrollToSlide(0);
  resetAutoSlide();
});
