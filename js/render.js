/**
 * RENDER ENGINE
 * File ini menangani semua update UI dan rendering
 */

/**
 * Render daftar pemain di sidebar
 */
function renderPlayers() {
  const html = [0, 1].map((i) => {
    const pos = STATE.players[i];
    const vars = playerVar(i).split(', ');
    const active = STATE.started && !STATE.gameOver && i === STATE.currentPlayer;
    return `
    <div class="player-row${active ? ' is-turn' : ''}" data-p="${i + 1}" style="--c1:${vars[0]}; --c2:${vars[1]}">
      <div class="player-row__avatar" aria-hidden="true">${playerIcon(i)}</div>
      <div>
        <div class="player-row__name">${playerName(i)}</div>
        <div class="player-row__meta">${STATE.isVsComputer && i === 1 ? 'Komputer' : i === 0 ? 'Kendali kiri' : 'Kendali kanan'}</div>
        <div class="bar"><div class="bar__fill" style="width:${pos}%"></div></div>
      </div>
      <div class="player-row__pos">${pos}<small>/100</small></div>
    </div>`;
  }).join('');
  DOM.$players.html(html);
}

/**
 * Render leaderboard
 */
function renderLeaderboard() {
  const ranked = STATE.players
    .map((pos, index) => ({ index, pos }))
    .sort((a, b) => b.pos - a.pos);
  const leader = ranked[0].pos;

  DOM.$leaderboardList.html(ranked.map((entry, rank) => {
    const vars = playerVar(entry.index).split(', ');
    const gap = leader - entry.pos;
    return `
    <div class="rank-item${rank === 0 ? ' lead' : ''}" style="--c1:${vars[0]}; --c2:${vars[1]}">
      <span class="rank-item__medal" aria-hidden="true">${['🥇', '🥈'][rank]}</span>
      <span class="rank-item__avatar" aria-hidden="true">${playerIcon(entry.index)}</span>
      <span>
        ${playerName(entry.index)}
        <div class="rank-item__gap">${gap === 0 ? 'Memimpin' : `${gap} kotak di belakang`}</div>
      </span>
      <span class="rank-item__pos">${entry.pos}<small>/100</small></span>
    </div>`;
  }).join(''));
}

/**
 * Update posisi token pemain di board
 */
function renderTokens() {
  DOM.$board.find('.token').each(function () {
    const player = +this.id.replace('token', '');
    const $t = $(this);
    if ($t.attr('data-host') !== String(STATE.players[player])) {
      DOM.$cell(STATE.players[player]).append($t);
      $t.attr('data-host', STATE.players[player]);
    }
    $t.css('background', `linear-gradient(140deg, ${playerVar(player)})`);
    $t.toggleClass('is-turn', STATE.started && !STATE.gameOver && player === STATE.currentPlayer);
  });
}

/**
 * Highlight cell yang aktif (posisi pemain saat ini)
 */
function highlightActiveCell() {
  DOM.$board.find('.cell').removeClass('is-active');
  if (!STATE.started || STATE.gameOver) return;
  const vars = playerVar(STATE.currentPlayer).split(', ');
  DOM.$cell(STATE.players[STATE.currentPlayer])
    .addClass('is-active')
    .css({ '--c1': vars[0] });
}

/**
 * Render turn badge (info pemain yang sedang bermain)
 */
function renderTurn() {
  const $badge = DOM.$turnBadge;
  if (!STATE.started) {
    $badge.css('--c1', 'var(--muted)');
    DOM.$turnName.text('Belum mulai');
    return;
  }
  const vars = playerVar(STATE.currentPlayer).split(', ');
  $badge.css('--c1', vars[0]);
  DOM.$turnName.text('Giliran ' + playerName(STATE.currentPlayer));
}

/**
 * Update state kontrol (enable/disable buttons)
 */
function renderControls() {
  DOM.$rollDice.prop('disabled', !STATE.started || STATE.busy || STATE.gameOver);
  DOM.$resetGame.prop('disabled', !STATE.started);
  DOM.$pvpMode.add(DOM.$vsComputer).prop('disabled', STATE.started);
  DOM.$pvpMode.attr('aria-pressed', String(STATE.started && !STATE.isVsComputer));
  DOM.$vsComputer.attr('aria-pressed', String(STATE.started && STATE.isVsComputer));
  DOM.$boardHint.toggleClass('is-hidden', STATE.started);
}

/**
 * Master render function - update seluruh UI
 */
function render() {
  renderPlayers();
  renderLeaderboard();
  renderTokens();
  renderTurn();
  highlightActiveCell();
  renderControls();
}

/**
 * Alias untuk renderLeaderboard (dipanggil setelah movement)
 */
function updateLeaderboard() {
  renderLeaderboard();
}
