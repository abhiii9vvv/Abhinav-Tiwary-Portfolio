/**
 * Cycling Theme Switcher Functionality
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    
    if (!themeToggle || !themeLabel) return;
    
    // Theme definitions
    const themes = [
      { name: 'default', label: 'Indigo' },
      { name: 'blue', label: 'Ocean' },
      { name: 'purple', label: 'Purple' },
      { name: 'green', label: 'Forest' }
    ];
    
    let currentThemeIndex = 0;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
    const savedIndex = themes.findIndex(theme => theme.name === savedTheme);
    if (savedIndex !== -1) {
      currentThemeIndex = savedIndex;
    }
    
    // Apply initial theme
    function applyTheme(themeData) {
      document.body.setAttribute('data-theme', themeData.name);
      themeLabel.textContent = themeData.label;
      localStorage.setItem('portfolio-theme', themeData.name);
      
      // Add smooth transition effect
      document.body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    }
    
    // Apply current theme
    applyTheme(themes[currentThemeIndex]);
    
    // Cycle to next theme on click
    themeToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Move to next theme
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(themes[currentThemeIndex]);
      
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

})();
