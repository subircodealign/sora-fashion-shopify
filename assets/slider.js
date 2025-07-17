document.addEventListener('DOMContentLoaded', function () {
  function createSliderAnimation(sliderSelector, speed = 0.5) {
    const sliders = document.querySelectorAll(sliderSelector);

    sliders.forEach(function (slider) {
      let animationId;
      let currentPosition = 0;

      const originalContent = slider.innerHTML;
      slider.innerHTML += originalContent;

      function animateSlider() {
        currentPosition -= speed;
        slider.style.transform = `translateX(${currentPosition}px)`;

        if (Math.abs(currentPosition) >= slider.scrollWidth / 2) {
          currentPosition = 0;
        }

        animationId = requestAnimationFrame(animateSlider);
      }

      function startAnimation() {
        stopAnimation();
        animationId = requestAnimationFrame(animateSlider);
      }

      function stopAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
      }

     
      startAnimation();

   
      // slider.parentElement.addEventListener('mouseenter', stopAnimation);
      // slider.parentElement.addEventListener('mouseleave', startAnimation);

      window.addEventListener('resize', function () {
        stopAnimation();
        currentPosition = 0;
        slider.style.transform = 'translateX(0px)';
        setTimeout(startAnimation, 100);
      });
    });
  }


  const slidersToInit = [
    { selector: '.inner-brand-slider', speed: 0.8 },
    { selector: '.announcement-slider', speed: 0.5 },
    { selector: '.reels-slider', speed: 0.5 },
    { selector: '.information-bar', speed: 0.5 },
  
  ];

  slidersToInit.forEach(({ selector, speed }) => createSliderAnimation(selector, speed));
});
