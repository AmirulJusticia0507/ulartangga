/**
 * GAME ENGINE
 * File ini menangani logika permainan utama
 */

/**
 * Finalisasi gerakan pemain (setelah animasi dan event selesai)
 */
function finishMovement(player, finalPosition) {
  STATE.players[player] = finalPosition;
  renderTokens();
  updateLeaderboard();

  if (finalPosition >= CONFIG.BOARD_SIZE) {
    STATE.gameOver = true;
    STATE.busy = false;
    renderPlayers();
    renderTurn();
    renderControls();
    addLog('🏆', `<strong>${playerName(player)}</strong> menang!`, '100', 'win');
    celebrate();
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: `🏆 ${playerName(player)} Menang!`,
      html: `<p style="margin:6px 0 0;color:var(--muted)">Berhasil mencapai kotak <b>100</b>.</p>`,
      icon: 'success',
      confirmButtonText: 'Main Lagi'
    }).then(() => resetGame());
    return;
  }

  STATE.busy = false;
  nextTurn();
}

/**
 * Animasikan gerakan pemain step-by-step
 */
function animateMove(player, finalPosition, steps) {
  let i = 0;
  const advance = () => {
    if (i < steps.length) {
      STATE.players[player] = steps[i];
      renderTokens();
      i++;
      setTimeout(advance, STATE.reduceMotion ? 20 : CONFIG.STEP_MS);
    } else {
      finishMovement(player, finalPosition);
    }
  };
  advance();
}

/**
 * Pindahkan pemain berdasarkan hasil dadu
 */
function movePlayer(player, total) {
  const target = STATE.players[player] + total;

  if (target > CONFIG.BOARD_SIZE) {
    toast(`⚠️ Melewati kotak 100 — ${playerName(player)} tetap di kotak ${STATE.players[player]}`);
    addLog('⚠️', `<strong>${playerName(player)}</strong> melebihi 100`, `${STATE.players[player]}`, 'skip');
    finishMovement(player, STATE.players[player]);
    return;
  }

  const steps = [];
  for (let i = STATE.players[player] + 1; i <= target; i++) steps.push(i);

  DOM.$cell(target).addClass('landing');
  setTimeout(() => DOM.$cell(target).removeClass('landing'), 520);

  if (CONFIG.SNAKES[target]) {
    const dest = CONFIG.SNAKES[target];
    addLog('🐍', `<strong>${playerName(player)}</strong> digigit ular`, `${STATE.players[player]} → ${dest}`, 'snake');
    setTimeout(() => animateMove(player, dest, steps), STATE.reduceMotion ? 30 : 420);
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: '🐍 Oops! Digigit Ular!',
      html: `<p style="margin:6px 0 0;color:var(--muted)">${playerName(player)} turun ke kotak <b>${dest}</b>.</p>`,
      icon: 'warning',
      confirmButtonText: 'Lanjut'
    });
  } else if (CONFIG.LADDERS[target]) {
    const dest = CONFIG.LADDERS[target];
    addLog('🪜', `<strong>${playerName(player)}</strong> naik tangga`, `${STATE.players[player]} → ${dest}`, 'ladder');
    setTimeout(() => animateMove(player, dest, steps), STATE.reduceMotion ? 30 : 420);
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: '🪜 Yeay! Naik Tangga!',
      html: `<p style="margin:6px 0 0;color:var(--muted)">${playerName(player)} naik ke kotak <b>${dest}</b>.</p>`,
      icon: 'success',
      confirmButtonText: 'Lanjut'
    });
  } else {
    addLog(playerIcon(player), `<strong>${playerName(player)}</strong> melangkah`, String(target), 'step');
    animateMove(player, target, steps);
  }
}

/**
 * Lanjutkan ke giliran pemain berikutnya
 */
function nextTurn() {
  STATE.currentPlayer = 1 - STATE.currentPlayer;
  render();

  if (STATE.isVsComputer && STATE.currentPlayer === 1) {
    setTimeout(() => {
      if (STATE.started && !STATE.gameOver) playTurn();
    }, CONFIG.AI_DELAY);
  }
}

/**
 * Jalankan turn pemain saat ini (roll dadu + move)
 */
function playTurn() {
  if (!STATE.started || STATE.gameOver || STATE.busy) return;
  STATE.busy = true;
  renderControls();

  rollDice().then((total) => {
    if (!STATE.started || STATE.gameOver) { STATE.busy = false; return; }
    movePlayer(STATE.currentPlayer, total);
  });
}

/**
 * Mulai permainan baru
 */
function startGame(vsComputer) {
  STATE.isVsComputer = vsComputer;
  STATE.started = true;
  STATE.busy = false;
  STATE.gameOver = false;
  STATE.players = [1, 1];
  STATE.currentPlayer = 0;
  STATE.logEntries = [];
  DOM.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  showDice(0, 0);
  render();
  addLog('🎲', `Mode dimulai: <strong>${vsComputer ? 'Pemain 1 vs AI' : 'Pemain 1 vs Pemain 2'}</strong>`, '', 'start');
}

/**
 * Reset permainan ke state awal
 */
function resetGame() {
  STATE.resetGame();
  STATE.isVsComputer = false;
  DOM.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  showDice(0, 0);
  render();
}
