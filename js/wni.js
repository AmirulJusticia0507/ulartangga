/**
 * WNI SIMULATOR
 * Mode boardgame satir roll-and-move: kelola dana bansos, beli aset,
 * hadapi Kartu Musibah/Takdir dan penyitaan aset oleh negara.
 */

const WNI_CONFIG = {
  TILE_COUNT: 20,
  GRID: 6,
  START_MONEY: 3000000,
  PASS_GO: 500000,
  LOW_MONEY: 500000,
  PAJAK: 300000,
  DENDA_SITA: 500000,
  TOTAL_ROUNDS: 8,
  STEP_MS: 260,
  AI_DELAY: 900
};

const WNI_TILES = [
  { type: 'start',     name: 'Start · Kelurahan',  emoji: '🏁' },
  { type: 'property',  name: 'Warung Kopi',        emoji: '☕', price: 600000,  rent: 120000 },
  { type: 'property',  name: 'Kos-Kosan',          emoji: '🏠', price: 900000,  rent: 180000 },
  { type: 'musibah',   name: 'Kartu Musibah',      emoji: '🃏' },
  { type: 'property',  name: 'Angkot',             emoji: '🚐', price: 750000,  rent: 150000 },
  { type: 'takdir',    name: 'Kartu Takdir',       emoji: '✨' },
  { type: 'property',  name: 'KRL Commuter',       emoji: '🚆', price: 1200000, rent: 240000 },
  { type: 'pajak',     name: 'Pajak & Retribusi',  emoji: '🧾' },
  { type: 'property',  name: 'Pasar Tradisional',  emoji: '🥬', price: 800000,  rent: 160000 },
  { type: 'property',  name: 'Warnet',             emoji: '🖥️', price: 700000,  rent: 140000 },
  { type: 'bebas',     name: 'Nongkrong Bebas',    emoji: '🛖' },
  { type: 'musibah',   name: 'Kartu Musibah',      emoji: '🃏' },
  { type: 'property',  name: 'Toko Kelontong',     emoji: '🏪', price: 650000,  rent: 130000 },
  { type: 'property',  name: 'Laundry Kiloan',     emoji: '🧺', price: 850000,  rent: 170000 },
  { type: 'takdir',    name: 'Kartu Takdir',       emoji: '✨' },
  { type: 'property',  name: 'Kontrakan',          emoji: '🚪', price: 1000000, rent: 200000 },
  { type: 'penyitaan', name: 'Sita Aset Negara',   emoji: '🚫' },
  { type: 'property',  name: 'Klinik 24 Jam',      emoji: '🏥', price: 1100000, rent: 220000 },
  { type: 'property',  name: 'Warung Tegal',       emoji: '🍛', price: 550000,  rent: 110000 },
  { type: 'musibah',   name: 'Kartu Musibah',      emoji: '🃏' }
];

const WNI_MUSIBAH = [
  { icon: '🚦', text: 'ditilang online (ETLE)',                    delta: -250000 },
  { icon: '🚗', text: 'terjebak macet 3 jam, bensin boros',        delta: -120000 },
  { icon: '👮', text: 'kena razia gabungan',                        delta: -200000 },
  { icon: '💡', text: 'tagihan listrik & air melonjak',            delta: -300000 },
  { icon: '📱', text: 'HP dicopet di angkot',                       delta: -750000 },
  { icon: '💊', text: 'anak demam, ke klinik',                     delta: -350000 },
  { icon: '☔', text: 'atap kontrakan bocor',                       delta: -400000 },
  { icon: '🗣️', text: 'ditanya "kapan nikah" pas Lebaran',         delta: -100000 }
];

const WNI_TAKDIR = [
  { icon: '🎁', text: 'dapat THR dari bos',        delta: 400000 },
  { icon: '🎉', text: 'menang giveaway HP',         delta: 600000 },
  { icon: '🍰', text: 'jualan kue online laris',    delta: 300000 },
  { icon: '💼', text: 'proyek freelance cair',      delta: 800000 },
  { icon: '🏅', text: 'bonus kinerja tahunan',      delta: 500000 },
  { icon: '💸', text: 'ditraktir oom pas mudik',    delta: 150000 }
];

/* ------------------------------------------------------------------ state */
const WNI = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

let wniAiTimer = 0;

function wniResetState() {
  clearTimeout(wniAiTimer);
  WNI.started = false;
  WNI.isVsComputer = false;
  WNI.busy = false;
  WNI.gameOver = false;
  WNI.currentPlayer = 0;
  WNI.turnCount = 0;
  WNI.owners = {};
  WNI.players = [
    { money: WNI_CONFIG.START_MONEY, pos: 0, props: [] },
    { money: WNI_CONFIG.START_MONEY, pos: 0, props: [] }
  ];
  WNI.log = [];
}
wniResetState();

/* -------------------------------------------------------------------- DOM */
const W = {
  $view: $('#wniView'),
  $board: $('#wniBoard'),
  $players: $('#wniPlayers'),
  $log: $('#wniLog'),
  $die1: $('#wniDie1'),
  $die2: $('#wniDie2'),
  $total: $('#wniTotal'),
  $roll: $('#wniRoll'),
  $reset: $('#wniReset'),
  $pvp: $('#wniPvpMode'),
  $ai: $('#wniAiMode'),
  $turnBadge: $('#wniTurnBadge'),
  $turnName: $('#wniTurnName'),
  $hint: $('#wniHint'),
  $round: $('#wniRound'),
  $networth: $('#wniNetworth')
};

/* --------------------------------------------------------------- helpers */
function wniMoney(n) {
  const s = Math.abs(Math.round(n)).toLocaleString('id-ID');
  return (n < 0 ? '-' : '') + 'Rp' + s;
}
function wniShort(n) {
  if (n >= 1000000) return 'Rp' + (n / 1000000).toFixed(n % 1000000 ? 1 : 0).replace('.', ',') + 'jt';
  return 'Rp' + Math.round(n / 1000) + 'rb';
}
function wniName(i) {
  return i === 0 ? 'Pemain 1' : (WNI.isVsComputer ? 'AI Tetangga' : 'Pemain 2');
}
function wniIcon(i) {
  return i === 0 ? '🧑' : (WNI.isVsComputer ? '🤖' : '👩');
}
function wniVar(i) {
  return i === 0 ? 'var(--p1-a), var(--p1-b)'
                 : (WNI.isVsComputer ? 'var(--ai-a), var(--ai-b)' : 'var(--p2-a), var(--p2-b)');
}
function wniNet(i) {
  return WNI.players[i].money + WNI.players[i].props.reduce((s, idx) => s + WNI_TILES[idx].price, 0);
}
function wniPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function wniGridArea(i) {
  if (i <= 5)  return `6 / ${i + 1}`;
  if (i <= 10) return `${11 - i} / 6`;
  if (i <= 15) return `1 / ${16 - i}`;
  return `${i - 14} / 1`;
}

/* ------------------------------------------------------------------ board */
function wniBuildBoard() {
  let html = `<div class="wni-center" role="note">
    <div class="wni-center__logo" aria-hidden="true">🏙️</div>
    <div class="wni-center__eyebrow">SIMULASI KEHIDUPAN</div>
    <div class="wni-center__title">WNI SIMULATOR</div>
    <div class="wni-center__sub">Bertahan hidup di tengah biaya hidup &amp; birokrasi +62</div>
    <div class="wni-center__stats" id="wniCenterStatus">Dana bansos menanti...</div>
  </div>`;

  const propertyBands = ['#49a99b', '#e8a94e', '#8878bd', '#588eaa'];
  let propertyIndex = 0;
  WNI_TILES.forEach((t, i) => {
    const band = t.price ? propertyBands[Math.floor(propertyIndex++ / 3) % propertyBands.length] : '#c4ad7e';
    html += `<div class="wni-tile wni-tile--${t.type} wni-tile--${i <= 5 ? 'bottom' : i <= 10 ? 'right' : i <= 15 ? 'top' : 'left'}"
      id="wniTile${i}" role="group" aria-label="Petak ${i + 1}: ${t.name}" style="grid-area:${wniGridArea(i)};--tile-color:${band}">
      <span class="wni-tile__stripe" aria-hidden="true"></span>
      <span class="wni-tile__emoji" aria-hidden="true">${t.emoji}</span>
      <span class="wni-tile__name">${t.name}</span>
      ${t.price ? `<span class="wni-tile__price">${wniShort(t.price)}</span>` : ''}
      ${t.rent ? `<span class="wni-tile__rent">Sewa ${wniShort(t.rent)}</span>` : ''}
      <span class="wni-tile__owner" aria-hidden="true"></span>
    </div>`;
  });

  html += `<div class="wni-token wni-token--0" id="wniToken0" aria-hidden="true">🧑</div>
           <div class="wni-token wni-token--1" id="wniToken1" aria-hidden="true">👩</div>`;

  W.$board.html(html);
}

function wniRenderTokens() {
  W.$board.find('.wni-token').each(function () {
    const player = +this.id.replace('wniToken', '');
    const $t = $(this);
    const pos = WNI.players[player].pos;
    if ($t.attr('data-host') !== String(pos)) {
      $('#wniTile' + pos).append($t);
      $t.attr('data-host', pos);
    }
    $t.text(wniIcon(player));
    $t.css('background', `linear-gradient(140deg, ${wniVar(player)})`);
    $t.toggleClass('is-turn', WNI.started && !WNI.gameOver && player === WNI.currentPlayer);
  });
  W.$board.find('.wni-tile').removeClass('is-here-0 is-here-1 is-owned-0 is-owned-1');
  W.$board.find('.wni-tile__owner').text('');
  [0, 1].forEach((i) => {
    $('#wniTile' + WNI.players[i].pos).addClass('is-here-' + i);
    WNI.players[i].props.forEach((idx) => {
      const $tile = $('#wniTile' + idx);
      $tile.addClass('is-owned-' + i);
      $tile.find('.wni-tile__owner').text('P' + (i + 1));
    });
  });
}

/* ------------------------------------------------------------------ render */
function wniRenderPlayers() {
  W.$players.html([0, 1].map((i) => {
    const p = WNI.players[i];
    const active = WNI.started && !WNI.gameOver && i === WNI.currentPlayer;
    const vars = wniVar(i).split(', ');
    const low = p.money < WNI_CONFIG.LOW_MONEY;
    const assets = p.props.map((idx) => `<span class="wni-asset">${WNI_TILES[idx].emoji} ${WNI_TILES[idx].name}</span>`).join('');
    return `<div class="player-row wni-player${active ? ' is-turn' : ''}" data-p="${i + 1}" style="--c1:${vars[0]};--c2:${vars[1]}">
      <div class="player-row__avatar" aria-hidden="true">${wniIcon(i)}</div>
      <div>
        <div class="player-row__name">${wniName(i)}</div>
        <div class="player-row__meta">${i === 0 ? 'Kendali kiri' : (WNI.isVsComputer ? 'Komputer' : 'Kendali kanan')} · ${WNI_TILES[p.pos].emoji} ${WNI_TILES[p.pos].name}</div>
        ${assets ? `<div class="wni-assets">${assets}</div>` : ''}
      </div>
      <div class="wni-money${low ? ' is-low' : ''}">${wniMoney(p.money)}<small>net ${wniMoney(wniNet(i))}</small></div>
    </div>`;
  }).join(''));
}

function wniRenderNetworth() {
  const values = [wniNet(0), wniNet(1)];
  const max = Math.max(values[0], values[1], 1);
  W.$networth.html([0, 1].map((i) => {
    const vars = wniVar(i).split(', ');
    const pct = Math.max(3, Math.round((values[i] / max) * 100));
    return `<div class="wni-net-item" style="--c1:${vars[0]};--c2:${vars[1]}">
      <span class="wni-net-item__dot" aria-hidden="true"></span>
      <span class="wni-net-item__bar"><span class="wni-net-item__fill" style="width:${pct}%"></span></span>
      <span class="wni-net-item__val">${wniMoney(values[i])}</span>
    </div>`;
  }).join(''));

  if (WNI.started) {
    const round = Math.min(Math.floor(WNI.turnCount / 2) + 1, WNI_CONFIG.TOTAL_ROUNDS);
    W.$round.text(`Putaran ${round}/${WNI_CONFIG.TOTAL_ROUNDS}`);
  } else {
    W.$round.text(`Putaran 0/${WNI_CONFIG.TOTAL_ROUNDS}`);
  }
}

function wniRenderTurn() {
  const centerStatus = document.getElementById('wniCenterStatus');
  if (centerStatus) {
    centerStatus.textContent = !WNI.started
      ? 'Dana bansos menanti...'
      : `Putaran ${Math.min(Math.floor(WNI.turnCount / 2) + 1, WNI_CONFIG.TOTAL_ROUNDS)}/${WNI_CONFIG.TOTAL_ROUNDS} · ${WNI.players[WNI.currentPlayer].money < WNI_CONFIG.LOW_MONEY ? 'Saldo menipis!' : 'Tetap bertahan!'}`;
  }
  if (!WNI.started || WNI.gameOver) {
    W.$turnBadge.css('--c1', 'var(--muted)');
    W.$turnName.text(WNI.gameOver ? 'Selesai' : 'Belum mulai');
    return;
  }
  W.$turnBadge.css('--c1', wniVar(WNI.currentPlayer).split(', ')[0]);
  W.$turnName.text('Giliran ' + wniName(WNI.currentPlayer));
}

function wniRenderControls() {
  const humanTurn = !(WNI.isVsComputer && WNI.currentPlayer === 1);
  W.$roll.prop('disabled', !WNI.started || WNI.busy || WNI.gameOver || !humanTurn);
  W.$reset.prop('disabled', !WNI.started);
  W.$pvp.add(W.$ai).prop('disabled', WNI.started);
  W.$pvp.attr('aria-pressed', String(WNI.started && !WNI.isVsComputer));
  W.$ai.attr('aria-pressed', String(WNI.started && WNI.isVsComputer));
  W.$hint.toggleClass('is-hidden', WNI.started);
}

function wniRender() {
  wniRenderPlayers();
  wniRenderTokens();
  wniRenderNetworth();
  wniRenderTurn();
  wniRenderControls();
}

/* -------------------------------------------------------------------- log */
function wniLog(icon, html, value, type) {
  WNI.log.unshift({ icon, html, value, type });
  if (WNI.log.length > 14) WNI.log.pop();
  W.$log.html(WNI.log.map((e) => `
    <div class="log-item"${e.type ? ` data-type="${e.type}"` : ''}>
      <span class="log-item__icon" aria-hidden="true">${e.icon}</span>
      <span>${e.html}</span>
      <span class="log-item__val">${e.value}</span>
    </div>`).join(''));
}

/* ------------------------------------------------------------------- dice */
function wniShowDice(d1, d2) {
  const idle = !d1 && !d2;
  [W.$die1, W.$die2].forEach(($d, i) => {
    const v = i === 0 ? d1 : d2;
    $d.toggleClass('is-idle', idle).html(pipHtml(v))
      .attr('aria-label', idle ? `Dadu ${i + 1} belum dilempar` : `Dadu ${i + 1} menunjukkan ${v}`);
  });
  W.$total.text(d1 ? d1 + d2 : '—');
  if (d1) {
    W.$total.removeClass('bump');
    void W.$total[0].offsetWidth;
    W.$total.addClass('bump');
  }
}

function wniRollDice() {
  const $d1 = W.$die1, $d2 = W.$die2;
  $d1.add($d2).removeClass('is-idle').addClass('rolling');
  return new Promise((resolve) => {
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      $d1.add($d2).removeClass('rolling');
      wniShowDice(d1, d2);
      resolve(d1 + d2);
    }, WNI.reduceMotion ? 60 : 520);
  });
}

/* ------------------------------------------------------------------- flow */
function wniPlayTurn() {
  if (!WNI.started || WNI.gameOver || WNI.busy) return;
  WNI.busy = true;
  wniRenderControls();

  const player = WNI.currentPlayer;
  wniRollDice().then((total) => {
    if (!WNI.started || WNI.gameOver) { WNI.busy = false; return; }
    wniLog('🎲', `<strong>${wniName(player)}</strong> lempar dadu`, String(total), 'roll');
    wniMove(player, total);
  });
}

function wniMove(player, steps) {
  const delay = WNI.reduceMotion ? 20 : WNI_CONFIG.STEP_MS;
  let remaining = steps;

  const step = () => {
    if (remaining > 0) {
      const p = WNI.players[player];
      p.pos = (p.pos + 1) % WNI_CONFIG.TILE_COUNT;
      if (p.pos === 0) {
        p.money += WNI_CONFIG.PASS_GO;
        wniLog('💵', `<strong>${wniName(player)}</strong> lewat START`, '+' + wniMoney(WNI_CONFIG.PASS_GO), 'start');
      }
      remaining--;
      wniRenderTokens();
      wniRenderPlayers();
      setTimeout(step, delay);
    } else {
      wniResolveTile(player);
    }
  };
  step();
}

function wniResolveTile(player) {
  const idx = WNI.players[player].pos;
  const tile = WNI_TILES[idx];
  const p = WNI.players[player];
  const owner = WNI.owners[idx];

  $('#wniTile' + idx).addClass('landing');
  setTimeout(() => $('#wniTile' + idx).removeClass('landing'), 520);

  if (tile.type === 'property') {
    if (owner === undefined) {
      if (p.money < tile.price) {
        toast(`💸 Dana tidak cukup untuk ${tile.name}`);
        wniLog('💸', `${wniName(player)} tak sanggup beli ${tile.name}`, wniMoney(tile.price), 'skip');
        return wniAfterAction(player);
      }
      if (WNI.isVsComputer && player === 1) {
        if (p.money - tile.price >= 300000) wniBuy(player, idx);
        else wniLog('🙅', `${wniName(player)} lewati ${tile.name}`, 'uang mepet', 'skip');
        return wniAfterAction(player);
      }
      return wniAskBuy(player, idx);
    }
    if (owner === player) {
      wniLog('🏠', `${wniName(player)} mendarat di asetnya`, tile.name, 'self');
      return wniAfterAction(player);
    }
    const rent = tile.rent;
    const paid = Math.min(p.money, rent);
    p.money -= rent;
    WNI.players[owner].money += paid;
    toast(`💰 ${wniName(player)} bayar sewa ${wniMoney(paid)}`);
    wniLog('💰', `${wniName(player)} bayar sewa ke ${wniName(owner)}`, '-' + wniMoney(paid), 'rent');
    return wniAfterAction(player);
  }

  if (tile.type === 'musibah') {
    const c = wniPick(WNI_MUSIBAH);
    p.money += c.delta;
    toast(`${c.icon} ${wniName(player)} ${c.text}`);
    wniLog(c.icon, `${wniName(player)} ${c.text}`, wniMoney(c.delta), 'musibah');
    return wniAfterAction(player);
  }

  if (tile.type === 'takdir') {
    const c = wniPick(WNI_TAKDIR);
    p.money += c.delta;
    toast(`${c.icon} ${wniName(player)} ${c.text}`);
    wniLog(c.icon, `${wniName(player)} ${c.text}`, '+' + wniMoney(c.delta), 'takdir');
    return wniAfterAction(player);
  }

  if (tile.type === 'pajak') {
    p.money -= WNI_CONFIG.PAJAK;
    toast(`🧾 ${wniName(player)} kena pajak ${wniMoney(WNI_CONFIG.PAJAK)}`);
    wniLog('🧾', `${wniName(player)} bayar pajak & retribusi`, '-' + wniMoney(WNI_CONFIG.PAJAK), 'pajak');
    return wniAfterAction(player);
  }

  if (tile.type === 'penyitaan') {
    if (p.props.length) {
      let cheapest = p.props[0];
      p.props.forEach((i) => { if (WNI_TILES[i].price < WNI_TILES[cheapest].price) cheapest = i; });
      delete WNI.owners[cheapest];
      p.props = p.props.filter((i) => i !== cheapest);
      toast(`🚫 Negara menyita ${WNI_TILES[cheapest].name}!`);
      wniLog('🚫', `Negara sita <strong>${WNI_TILES[cheapest].name}</strong> milik ${wniName(player)}`, '', 'sita');
    } else {
      p.money -= WNI_CONFIG.DENDA_SITA;
      toast(`🚫 Tak ada aset, ${wniName(player)} didenda ${wniMoney(WNI_CONFIG.DENDA_SITA)}`);
      wniLog('🚫', `${wniName(player)} didenda penyitaan`, '-' + wniMoney(WNI_CONFIG.DENDA_SITA), 'sita');
    }
    return wniAfterAction(player);
  }

  // start / bebas
  wniLog('✅', `${wniName(player)} aman di ${tile.name}`, '', 'self');
  return wniAfterAction(player);
}

function wniAskBuy(player, idx) {
  const tile = WNI_TILES[idx];
  const p = WNI.players[player];
  Swal.fire({
    customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm', cancelButton: 'swal-cancel' },
    title: `${tile.emoji} Beli ${tile.name}?`,
    html: `<p style="margin:0;color:var(--muted)">Harga <b>${wniMoney(tile.price)}</b> · Sewa <b>${wniMoney(tile.rent)}</b><br>Dana kamu: <b>${wniMoney(p.money)}</b></p>`,
    showCancelButton: true,
    confirmButtonText: 'Beli',
    cancelButtonText: 'Lewati'
  }).then((res) => {
    if (res.isConfirmed) wniBuy(player, idx);
    else {
      wniLog('🙅', `${wniName(player)} lewati ${tile.name}`, '', 'skip');
      toast(`🙅 ${wniName(player)} lewati ${tile.name}`);
    }
    wniAfterAction(player);
  });
}

function wniBuy(player, idx) {
  const tile = WNI_TILES[idx];
  WNI.owners[idx] = player;
  WNI.players[player].money -= tile.price;
  WNI.players[player].props.push(idx);
  toast(`🏠 ${wniName(player)} beli ${tile.name} ${wniMoney(tile.price)}`);
  wniLog('🏠', `<strong>${wniName(player)}</strong> beli ${tile.name}`, '-' + wniMoney(tile.price), 'buy');
  wniRender();
}

function wniAfterAction(player) {
  WNI.busy = false;
  if (WNI.players[player].money < 0) {
    WNI.players[player].money = 0;
    return wniGameOver(1 - player, `${wniName(player)} bangkrut!`);
  }
  wniNextTurn();
}

function wniNextTurn() {
  WNI.turnCount++;
  const round = Math.floor(WNI.turnCount / 2) + 1;
  if (round > WNI_CONFIG.TOTAL_ROUNDS) return wniEndByNetworth();

  WNI.currentPlayer = 1 - WNI.currentPlayer;
  wniRender();

  if (WNI.isVsComputer && WNI.currentPlayer === 1) {
    wniAiTimer = setTimeout(() => { if (WNI.started && !WNI.gameOver) wniPlayTurn(); }, WNI_CONFIG.AI_DELAY);
  }
}

/* --------------------------------------------------------------- game end */
function wniEndByNetworth() {
  WNI.gameOver = true;
  WNI.busy = false;
  const net = [wniNet(0), wniNet(1)];
  if (net[0] === net[1]) return wniGameOver(-1, 'Seri! Kekayaan imbang.');
  return wniGameOver(net[0] > net[1] ? 0 : 1, 'Delapan putaran berlalu.');
}

function wniGameOver(winner, reason) {
  clearTimeout(wniAiTimer);
  WNI.gameOver = true;
  WNI.busy = false;
  wniRender();
  const net = [wniNet(0), wniNet(1)];

  if (winner < 0) {
    wniLog('🤝', 'Permainan berakhir <strong>seri</strong>', '', 'self');
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: '🤝 Seri!',
      html: `<p style="margin:6px 0 0;color:var(--muted)">${reason} Kekayaan keduanya imbang.</p>`,
      confirmButtonText: 'Main Lagi'
    }).then(() => wniReset());
    return;
  }

  celebrate();
  wniLog('🏆', `<strong>${wniName(winner)}</strong> menang!`, wniMoney(net[winner]), 'win');
  Swal.fire({
    customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
    title: `🏆 ${wniName(winner)} Menang!`,
    html: `<p style="margin:6px 0 0;color:var(--muted)">${reason}<br>Kekayaan akhir <b>${wniMoney(net[winner])}</b>.</p>`,
    icon: 'success',
    confirmButtonText: 'Main Lagi'
  }).then(() => wniReset());
}

/* -------------------------------------------------------------- lifecycle */
function wniStart(vsComputer) {
  wniResetState();
  WNI.isVsComputer = vsComputer;
  WNI.started = true;
  wniShowDice(0, 0);
  W.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  wniRender();
  wniLog('🧭', `Mode dimulai: <strong>${vsComputer ? 'Pemain 1 vs AI Tetangga' : 'Pemain 1 vs Pemain 2'}</strong>`, '', 'start');
  toast(vsComputer ? '🤖 Lawan AI Tetangga. Semoga kuat!' : '👥 Mode 2 pemain dimulai!');
}

function wniReset() {
  wniResetState();
  wniShowDice(0, 0);
  W.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  wniRender();
}

/* ------------------------------------------------------------------- init */
$(function () {
  wniBuildBoard();
  wniShowDice(0, 0);
  wniRender();

  W.$pvp.on('click', () => wniStart(false));
  W.$ai.on('click', () => wniStart(true));
  W.$roll.on('click', wniPlayTurn);
  W.$reset.on('click', wniReset);
});
