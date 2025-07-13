// In your theme.js file or a script tag
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Mobile submenu toggles
  document.querySelectorAll('#mobile-menu [href]').forEach(link => {
    if (link.nextElementSibling && link.nextElementSibling.id && link.nextElementSibling.id.startsWith('submenu-')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle('hidden');
      });
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!mobileMenu.contains(e.target) && e.target !== mobileMenuButton) {
      mobileMenu.classList.add('hidden');
    }
  });
});