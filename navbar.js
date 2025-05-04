document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.nav');
  
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('change');
    nav.classList.toggle('active');
  });
  
  // Find all list items that contain dropdowns
  const dropdownContainers = document.querySelectorAll('.nav > li');
  
  dropdownContainers.forEach(container => {
    const dropdown = container.querySelector('.dropdown');
    const parentLink = container.querySelector('a');
    
    // Only process items that actually have dropdowns
    if (dropdown && parentLink) {
      // Create and append the dropdown indicator
      const indicator = document.createElement('span');
      indicator.className = 'dropdown-indicator';
      parentLink.appendChild(indicator);
      
      // Handle click on the parent link or indicator
      parentLink.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle dropdown visibility
          dropdown.classList.toggle('show');
          this.classList.toggle('dropdown-open');
          
          // Debug
          console.log('Dropdown toggled:', dropdown.classList.contains('show'));
        }
      });
    }
  });
  
  // Close menu when clicking dropdown items
  const dropdownItems = document.querySelectorAll('.dropdown a');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('change');
        nav.classList.remove('active');
      }
    });
  });
  
  // Close menu when clicking direct nav links
  const directNavLinks = document.querySelectorAll('.nav > li > a');
  directNavLinks.forEach(link => {
    // Skip links that have dropdowns
    if (!link.parentElement.querySelector('.dropdown')) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('change');
        nav.classList.remove('active');
      });
    }
  });
});