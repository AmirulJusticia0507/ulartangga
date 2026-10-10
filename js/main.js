/**
 * MAIN INITIALIZATION & EVENT HANDLERS
 * File ini menangani inisialisasi aplikasi dan event listeners
 */

$(function () {
  'use strict';
  const $gameSwitch = $('#gameSwitch');
  const $snakeView = $('#snakeView');
  const $wniView = $('#wniView');
  const $brandMark = $('#brandMark');
  const $brandTitle = $('#brandTitle');
  const $brandSub = $('#brandSub');
  const $gameSwitchIcon = $('#gameSwitchIcon');
  const $gameSwitchName = $('#gameSwitchName');
  let activeGame = 'snake';

  function switchGame(game) {
    activeGame = game;
    const wniActive = game === 'wni';
    $snakeView.prop('hidden', wniActive);
    $wniView.prop('hidden', !wniActive);
    $brandMark.text(wniActive ? '🏙️' : '🎲');
    $brandTitle.text(wniActive ? 'WNI Simulator' : 'Ular Tangga');
    $brandSub.text(wniActive
      ? 'Kelola dana, beli aset, bertahan dari realita.'
      : 'Naik tangga, hindari ular, capai kotak 100.');
    $gameSwitchIcon.text(wniActive ? '🐍' : '🏢');
    $gameSwitchName.text(wniActive ? 'Ular Tangga' : 'WNI Simulator');
    $gameSwitch.attr('aria-label', `Ganti ke ${wniActive ? 'Ular Tangga' : 'WNI Simulator'}`);
    $gameSwitch.attr('aria-pressed', String(wniActive));
    document.title = wniActive
      ? 'WNI Simulator — Bertahan Hidup'
      : "Game Ular Tangga — Snake 'n Ladder";
    document.documentElement.dataset.game = game;
    if (!wniActive) requestAnimationFrame(drawLinks);
  }

  /* =================================================================
     EVENT LISTENERS
     ================================================================= */

  $gameSwitch.on('click', () => switchGame(activeGame === 'snake' ? 'wni' : 'snake'));

  // Mode Selection
  DOM.$pvpMode.on('click', () => startGame(false));
  DOM.$fourPlayersMode.on('click', () => startGame(false, 4));
  DOM.$vsComputer.on('click', () => startGame(true));

  // Game Controls
  DOM.$rollDice.on('click', playTurn);
  DOM.$resetGame.on('click', resetGame);

  // Theme Toggle
  DOM.$themeToggle.on('click', function () {
    const light = document.documentElement.dataset.theme === 'light';
    document.documentElement.dataset.theme = light ? 'dark' : 'light';
    this.textContent = light ? '🌙' : '☀️';
    this.setAttribute('aria-label', light ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
    this.setAttribute('aria-pressed', String(!light));
    try { localStorage.setItem('ut-theme', document.documentElement.dataset.theme); } catch (e) {}
    requestAnimationFrame(drawLinks);
  });

  // Keyboard Shortcut (Spacebar to Roll Dice)
  $(document).on('keydown', function (e) {
    if (e.code === 'Space' && !$(e.target).is('button, input, textarea, select, [contenteditable="true"]') &&
        !(window.Swal && Swal.isVisible())) {
      e.preventDefault();
      if (activeGame === 'wni') wniPlayTurn();
      else playTurn();
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
      DOM.$themeToggle.attr('aria-pressed', String(saved === 'light'));
      DOM.$themeToggle.attr('aria-label', saved === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
    }
  } catch (e) {}

  // Build initial state
  buildBoard();
  showDice(0, 0);
  render();
  switchGame('snake');
  
  // Draw SVG links when ready
  requestAnimationFrame(drawLinks);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(drawLinks);
  }
  setTimeout(drawLinks, 400);
});
