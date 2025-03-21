
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');
    
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('change');
      nav.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('change');
        nav.classList.remove('active');
      });
    });
  });
