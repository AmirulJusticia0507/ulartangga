/**
 * GAME ENGINE
 * File ini menangani logika permainan utama
 */

/**
 * Finalisasi gerakan pemain (setelah animasi dan event selesai)
 * trap = null | { type: 'snake'|'ladder' } untuk menampilkan modal setelah animasi
 */
function finishMovement(player, finalPosition, trap) {
  STATE.players[player] = finalPosition;

  if (finalPosition >= CONFIG.BOARD_SIZE) {
    STATE.gameOver = true;
    STATE.busy = false;
    render();
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

  if (trap) {
    const isSnake = trap.type === 'snake';
    // segarkan sidebar agar posisi di kartu sudah sesuai saat modal tampil
    renderPlayers();
    renderLeaderboard();
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: isSnake ? '🐍 Oops! Digigit Ular!' : '🪜 Yeay! Naik Tangga!',
      html: `<p style="margin:6px 0 0;color:var(--muted)">${playerName(player)} ${isSnake ? 'turun' : 'naik'} ke kotak <b>${finalPosition}</b>.</p>`,
      icon: isSnake ? 'warning' : 'success',
      confirmButtonText: 'Lanjut'
    }).then(() => { STATE.busy = false; nextTurn(); });
    return;
  }

  STATE.busy = false;
  nextTurn();
}

/**
 * Animasikan gerakan pemain step-by-step
 * Jika terkena ular/tangga, tambahkan slide cepat ke kotak tujuan
 */
function animateMove(player, finalPosition, steps, trap) {
  const path = steps.slice();
  const delay = STATE.reduceMotion ? 20 : CONFIG.STEP_MS;
  const $token = DOM.$token(player);
  const trapClass = trap ? (trap.type === 'snake' ? 'is-drop' : 'is-boost') : '';

  if (trap) {
    $token.addClass(trapClass);
    const from = steps.length ? steps[steps.length - 1] : STATE.players[player];
    const segs = 5;
    for (let i = 1; i <= segs; i++) {
      path.push(Math.round(from + (finalPosition - from) * (i / segs)));
    }
  }

  let i = 0;
  const advance = () => {
    if (i < path.length) {
      STATE.players[player] = path[i];
      i++;
      renderTokens();
      setTimeout(advance, trap ? Math.round(delay * 0.28) : delay);
    } else {
      STATE.players[player] = finalPosition;
      renderTokens();
      if (trapClass) $token.removeClass(trapClass);
      finishMovement(player, finalPosition, trap);
    }
  };
  advance();
}

/**
 * Pindahkan pemain berdasarkan hasil dadu
 */
function movePlayer(player, total) {
  const from = STATE.players[player];
  const target = from + total;

  if (target > CONFIG.BOARD_SIZE) {
    toast(`⚠️ Melewati kotak 100 — ${playerName(player)} tetap di kotak ${from}`);
    addLog('⚠️', `<strong>${playerName(player)}</strong> melebihi 100`, String(from), 'skip');
    STATE.busy = false;
    nextTurn();
    return;
  }

  const steps = [];
  for (let i = from + 1; i <= target; i++) steps.push(i);

  DOM.$cell(target).addClass('landing');
  setTimeout(() => DOM.$cell(target).removeClass('landing'), 520);

  if (CONFIG.SNAKES[target]) {
    const dest = CONFIG.SNAKES[target];
    addLog('🐍', `<strong>${playerName(player)}</strong> digigit ular`, `${target} → ${dest}`, 'snake');
    animateMove(player, dest, steps, { type: 'snake' });
  } else if (CONFIG.LADDERS[target]) {
    const dest = CONFIG.LADDERS[target];
    addLog('🪜', `<strong>${playerName(player)}</strong> naik tangga`, `${target} → ${dest}`, 'ladder');
    animateMove(player, dest, steps, { type: 'ladder' });
  } else {
    addLog(playerIcon(player), `<strong>${playerName(player)}</strong> melangkah`, String(target), 'step');
    animateMove(player, target, steps, null);
  }
}

/**
 * Lanjutkan ke giliran pemain berikutnya
 */
function nextTurn() {
  STATE.currentPlayer = (STATE.currentPlayer + 1) % STATE.players.length;
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
function startGame(vsComputer, playerCount = 2) {
  STATE.isVsComputer = vsComputer;
  STATE.playerCount = playerCount;
  STATE.started = true;
  STATE.busy = false;
  STATE.gameOver = false;
  STATE.players = Array(playerCount).fill(1);
  STATE.currentPlayer = 0;
  STATE.logEntries = [];
  DOM.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  showDice(0, 0);
  render();
  const modeName = vsComputer ? 'Pemain 1 vs AI' : `${playerCount} Pemain`;
  addLog('🎲', `Mode dimulai: <strong>${modeName}</strong>`, '', 'start');
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
