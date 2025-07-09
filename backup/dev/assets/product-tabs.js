

  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');

      // Hide all
      tabContents.forEach(content => content.classList.add('hidden'));
      document.getElementById(`tab-${tab}`).classList.remove('hidden');

      // Reset styles
      tabButtons.forEach(btn => btn.classList.remove('text-[#5A5F89]', 'font-semibold'));
      button.classList.add('text-[#5A5F89]', 'font-semibold');
    });
  });

  // Image Preview
  const thumbnails = document.querySelectorAll('.thumbnail-image');
  const mainImage = document.getElementById('main-product-image');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.getAttribute('data-large');
      mainImage.setAttribute('src', newSrc);
    });
  });

