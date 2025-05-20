// Apply user's system preference on first load
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = stored || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);

// Hook up toggle (assuming you have #theme-toggle)
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    // Set toggle position based on current theme
    toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Add event listener for toggle changes
    toggle.addEventListener('change', function () {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});