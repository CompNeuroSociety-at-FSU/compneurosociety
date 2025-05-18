
// Apply user's system preference on first load
  const userPref = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = userPref || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  // Hook up toggle (assuming you have #theme-toggle)
  document.getElementById('theme-toggle').addEventListener('change', function () {
    const newTheme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Sync toggle position
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
  });

