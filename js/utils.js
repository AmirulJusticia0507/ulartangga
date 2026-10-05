/**
 * UTILITY FUNCTIONS
 * File ini berisi fungsi-fungsi helper yang digunakan di berbagai tempat
 */

// DOM Selectors
const DOM = {
  $board: $('#board'),
  $wrap: $('#boardWrap'),
  $decor: $('#boardDecor'),
  $svg: $('#boardLinks'),
  $log: $('#logList'),
  $toastEl: $('#toast'),
  $pvpMode: $('#pvpMode'),
  $vsComputer: $('#vsComputer'),
  $rollDice: $('#rollDice'),
  $resetGame: $('#resetGame'),
  $themeToggle: $('#themeToggle'),
  $players: $('#players'),
  $leaderboardList: $('#leaderboardList'),
  $die1: $('#die1'),
  $die2: $('#die2'),
  $totalDice: $('#totalDice'),
  $boardHint: $('#boardHint'),
  $turnBadge: $('#turnBadge'),
  $turnName: $('#turnName'),

  $cell: (n) => $(`#cell${n}`),
  $token: (i) => $(`#token${i}`)
};

/**
 * Dapatkan nama pemain berdasarkan index
 */
function playerName(index) {
  return index === 0 ? 'Pemain 1' : (STATE.isVsComputer ? 'AI Computer' : 'Pemain 2');
}

/**
 * Dapatkan icon pemain berdasarkan index
 */
function playerIcon(index) {
  if (index === 0) return '🚗';
  return STATE.isVsComputer ? '🤖' : '🏍️';
}

/**
 * Dapatkan variabel CSS warna pemain
 */
function playerVar(index) {
  return index === 0 ? 'var(--p1-a), var(--p1-b)' : (STATE.isVsComputer ? 'var(--ai-a), var(--ai-b)' : 'var(--p2-a), var(--p2-b)');
}

/**
 * Tampilkan toast notification
 */
let toastTimer;
function toast(message) {
  DOM.$toastEl.text(message).addClass('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.$toastEl.removeClass('show'), 2200);
}

/**
 * Tambahkan entry ke log riwayat
 */
function addLog(icon, html, value, type) {
  STATE.logEntries.unshift({ icon, html, value, type });
  if (STATE.logEntries.length > 12) STATE.logEntries.pop();
  DOM.$log.html(STATE.logEntries.map((e) => `
    <div class="log-item"${e.type ? ` data-type="${e.type}"` : ''}>
      <span class="log-item__icon" aria-hidden="true">${e.icon}</span>
      <span>${e.html}</span>
      <span class="log-item__val">${e.value}</span>
    </div>`).join(''));
}

/**
 * Tampilkan efek celebrate confetti
 */
function celebrate() {
  if (STATE.reduceMotion) return;
  const colors = ['#ff4d6d', '#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#22d3ee'];
  const layer = document.getElementById('confetti');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = (Math.random() * 0.6) + 's';
    piece.style.animationDuration = (1.9 + Math.random() * 1.5) + 's';
    frag.appendChild(piece);
  }
  layer.appendChild(frag);
  setTimeout(() => { layer.innerHTML = ''; }, 4200);
}

/**
 * Dapatkan class untuk cell berdasarkan posisi
 */
function cellClass(n) {
  if (n in CONFIG.SNAKES) return 'snake-head';
  if (Object.values(CONFIG.SNAKES).includes(n)) return 'snake-tail';
  if (n in CONFIG.LADDERS) return 'ladder-bottom';
  if (Object.values(CONFIG.LADDERS).includes(n)) return 'ladder-top';
  return '';
}
