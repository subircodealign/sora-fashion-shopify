document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
  });

  document.querySelectorAll('.mobile-submenu-toggle').forEach(button => {
    button.addEventListener('click', function() {
      const submenu = this.parentElement.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle('hidden');
        const icon = this.querySelector('svg');
        icon.classList.toggle('rotate-90');
        icon.classList.toggle('transform');
        icon.classList.toggle('transition-transform');
      }
    });
  });