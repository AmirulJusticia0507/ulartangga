/**
 * MAIN INITIALIZATION & EVENT HANDLERS
 * File ini menangani inisialisasi aplikasi dan event listeners
 */

$(function () {
  'use strict';

  /* =================================================================
     EVENT LISTENERS
     ================================================================= */

  // Mode Selection
  DOM.$pvpMode.on('click', () => startGame(false));
  DOM.$vsComputer.on('click', () => startGame(true));

  // Game Controls
  DOM.$rollDice.on('click', playTurn);
  DOM.$resetGame.on('click', resetGame);

  // Theme Toggle
  DOM.$themeToggle.on('click', function () {
    const light = document.documentElement.dataset.theme === 'light';
    document.documentElement.dataset.theme = light ? 'dark' : 'light';
    this.textContent = light ? '🌙' : '☀️';
    this.setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
    try { localStorage.setItem('ut-theme', document.documentElement.dataset.theme); } catch (e) {}
    requestAnimationFrame(drawLinks);
  });

  // Keyboard Shortcut (Spacebar to Roll Dice)
  $(document).on('keydown', function (e) {
    if (e.code === 'Space' && !$(e.target).is('button')) {
      e.preventDefault();
      playTurn();
    }
  });

  // Window Resize Handler (redraw SVG links)
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLinks, 120);
  });

  /* =================================================================
     INITIALIZATION
     ================================================================= */

  // Restore theme preference
  try {
    const saved = localStorage.getItem('ut-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.dataset.theme = saved;
      DOM.$themeToggle.text(saved === 'light' ? '☀️' : '🌙');
    }
  } catch (e) {}

  // Build initial state
  buildBoard();
  showDice(0, 0);
  render();
  
  // Draw SVG links when ready
  requestAnimationFrame(drawLinks);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(drawLinks);
  }
  setTimeout(drawLinks, 400);
});
