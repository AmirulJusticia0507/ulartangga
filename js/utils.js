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
  $fourPlayersMode: $('#fourPlayersMode'),
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
  return STATE.isVsComputer && index === 1 ? 'AI Computer' : `Pemain ${index + 1}`;
}

/**
 * Dapatkan icon pemain berdasarkan index
 */
function playerIcon(index) {
  if (STATE.isVsComputer && index === 1) return '🤖';
  return ['🚗', '🏍️', '🚀', '🚲'][index];
}

/**
 * Dapatkan variabel CSS warna pemain
 */
function playerVar(index) {
  if (STATE.isVsComputer && index === 1) return 'var(--ai-a), var(--ai-b)';
  return [
    'var(--p1-a), var(--p1-b)',
    'var(--p2-a), var(--p2-b)',
    'var(--p3-a), var(--p3-b)',
    'var(--p4-a), var(--p4-b)'
  ][index];
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
  const colors = ['#ff4d6d', '#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#22d3ee', '#ffd76a'];
  const layer = document.getElementById('confetti');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 130; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const size = 7 + Math.random() * 8;
    const round = Math.random() > 0.65;
    piece.style.left = Math.random() * 100 + '%';
    piece.style.width = size + 'px';
    piece.style.height = (round ? size : size * (0.5 + Math.random() * 0.8)) + 'px';
    piece.style.borderRadius = round ? '50%' : '2px';
    piece.style.background = colors[i % colors.length];
    piece.style.animationName = Math.random() > 0.5 ? 'fall-sway' : 'fall';
    piece.style.animationDelay = (Math.random() * 0.8) + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.6) + 's';
    frag.appendChild(piece);
  }
  layer.appendChild(frag);
  setTimeout(() => { layer.innerHTML = ''; }, 4600);
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
