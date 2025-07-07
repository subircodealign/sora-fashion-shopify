document.addEventListener('DOMContentLoaded', function () {
  const sliders = document.querySelectorAll('.review-section, .new-arrival-slider-section');

  sliders.forEach(section => {
    const prevBtn = section.querySelector('.slider-prev');
    const nextBtn = section.querySelector('.slider-next');
    const slider = section.querySelector('.product-slider');
    const slideItem = slider?.querySelector('.flex-shrink-0'); 

    if (!prevBtn || !nextBtn || !slider || !slideItem) return;

    const slideWidth = slideItem.clientWidth + 24; 
    const maxIndex = slider.children.length - 1;
    let currentIndex = 0;

    function updateSlider() {
      slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    updateSlider();
  });
});
