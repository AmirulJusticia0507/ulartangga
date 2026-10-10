/**
 * WNI SIMULATOR
 * Mode boardgame satir roll-and-move: kelola dana bansos, beli aset,
 * hadapi Kartu Kesempatan/Dana Umum dan penyitaan aset oleh negara.
 */

const WNI_CONFIG = {
  TILE_COUNT: 36,
  GRID: 10,
  START_MONEY: 10000000,
  PASS_GO: 500000,
  LOW_MONEY: 500000,
  PAJAK: 300000,
  DENDA_SITA: 500000,
  TOTAL_ROUNDS: 8,
  STEP_MS: 260,
  AI_DELAY: 900
};

const WNI_STORAGE_KEY = 'wni-simulator-save-v1';

const WNI_TILES = [
  { type: 'start',     name: 'Start · Kelurahan',  emoji: '🏁' },
  { type: 'property',  name: 'Warung Kopi',        emoji: '☕', price: 600000,  rent: 120000 },
  { type: 'property',  name: 'Kos-Kosan',          emoji: '🏠', price: 900000,  rent: 180000 },
  { type: 'kesempatan', name: 'Kartu Kesempatan',   emoji: '🎴' },
  { type: 'property',  name: 'Angkot',             emoji: '🚐', price: 750000,  rent: 150000 },
  { type: 'dana-umum', name: 'Dana Umum',          emoji: '🏛️' },
  { type: 'property',  name: 'KRL Commuter',       emoji: '🚆', price: 1200000, rent: 240000 },
  { type: 'pajak',     name: 'Pajak & Retribusi',  emoji: '🧾' },
  { type: 'property',  name: 'Pasar Tradisional',  emoji: '🥬', price: 800000,  rent: 160000 },
  { type: 'property',  name: 'Warnet',             emoji: '🖥️', price: 700000,  rent: 140000 },
  { type: 'bebas',     name: 'Nongkrong Bebas',    emoji: '🛖' },
  { type: 'kesempatan', name: 'Kartu Kesempatan',  emoji: '🎴' },
  { type: 'property',  name: 'Toko Kelontong',     emoji: '🏪', price: 650000,  rent: 130000 },
  { type: 'property',  name: 'Laundry Kiloan',     emoji: '🧺', price: 850000,  rent: 170000 },
  { type: 'dana-umum', name: 'Dana Umum',          emoji: '🏛️' },
  { type: 'property',  name: 'Kontrakan',          emoji: '🚪', price: 1000000, rent: 200000 },
  { type: 'penyitaan', name: 'Sita Aset Negara',   emoji: '🚫' },
  { type: 'property',  name: 'Klinik 24 Jam',      emoji: '🏥', price: 1100000, rent: 220000 },
  { type: 'property',  name: 'Warung Tegal',       emoji: '🍛', price: 550000,  rent: 110000 },
  { type: 'kesempatan', name: 'Kartu Kesempatan',  emoji: '🎴' },
  ...[
    ['property', 'Kopdes Merah Putih', '🏘️'],
    ['property', 'Dapur MBG', '🍱'],
    ['kesempatan', 'Kartu Kesempatan', '🎴'],
    ['property', 'Pemasok Pangan', '🥬'],
    ['dana-umum', 'Dana Umum', '🏛️'],
    ['property', 'Layanan Hukum', '⚖️'],
    ['pajak', 'Pajak Bertingkat', '🧾'],
    ['property', 'Pasar Desa', '🥕'],
    ['kesempatan', 'Kartu Kesempatan', '🎴'],
    ['property', 'Kontrakan Buruh', '🚪'],
    ['dana-umum', 'Dana Umum', '🏛️'],
    ['penyitaan', 'Sita Aset Negara', '🚫'],
    ['property', 'Koperasi Warga', '🏘️'],
    ['dana-umum', 'Dana Umum', '🏛️'],
    ['property', 'Puskesmas Desa', '🏥'],
    ['pajak', 'Pajak & Iuran', '🧾']
  ].map(([type, name, emoji], index) => {
    if (type !== 'property') return { type, name, emoji };
    const price = 650000 + (index * 137000 % 1150000);
    return {
      type,
      name,
      emoji,
      price,
      rent: Math.round(price * 0.2 / 10000) * 10000
    };
  })
];

const WNI_CHANCE_CARDS = [
  { icon: '⚖️', title: 'Bukti bicara', text: 'Gugatan perdata diputus berdasarkan bukti, bukan kedekatan. Ganti rugi cair.', delta: 450000 },
  { icon: '🧾', title: 'Kuitansi lengkap', text: 'Kamu menolak pungutan tanpa dasar dan meminta prosedur resmi. Hemat biaya siluman.', delta: 200000 },
  { icon: '📣', title: 'Layanan jadi viral', text: 'Keluhan warga ramai dibicarakan. Berkas yang tertahan akhirnya diproses tanpa jalur khusus.', delta: 250000 },
  { icon: '🚧', title: 'Jalan pintas berbayar', text: 'Ada yang menawarkan urusan dipercepat asal “tahu sama tahu”. Kamu menolak; jalur resmi makan waktu dan ongkos.', delta: -150000 },
  { icon: '🗳️', title: 'Warga ikut mengawasi', text: 'Partisipasi publik memperbaiki keputusan tata kota. Kompensasi warga dibayarkan.', delta: 350000 },
  { icon: '📜', title: 'Aturan berubah mendadak', text: 'Syarat baru muncul setelah berkas hampir selesai. Fotokopi, transport, dan kesabaran terkuras.', delta: -200000 },
  { icon: '🛠️', title: 'Proyek akhirnya selesai', text: 'Setelah berkali-kali molor, akses jalan dibuka. Ongkos harianmu berkurang.', delta: 180000 },
  { icon: '🤝', title: 'Solidaritas tetangga', text: 'Warga patungan membantu biaya berobat dan konsultasi hukum.', delta: 300000 },
  { icon: '🔎', title: 'Data terbuka', text: 'Informasi anggaran mudah diakses. Hak bantuanmu terverifikasi dan cair.', delta: 400000 },
  { icon: '🧑‍⚖️', title: 'Putusan dikoreksi', text: 'Upaya hukum berhasil mengoreksi keputusan yang merugikanmu.', delta: 500000 },
  { icon: '🍱', title: 'Menu MBG diawasi warga', text: 'Dalam skenario permainan, laporan menu dan mutu makanan ditindaklanjuti. Vendor dibayar sesuai kontrak, dan kamu mendapat upah kerja.', delta: 250000 },
  { icon: '🍲', title: 'Dapur MBG kekurangan pasokan', text: 'Pengiriman bahan terlambat dalam skenario fiktif. Kamu membantu memasok bahan pokok, tetapi ongkos angkut ditanggung sendiri.', delta: -180000 },
  { icon: '🏘️', title: 'Kopdes buka pembukuan', text: 'Koperasi Desa Merah Putih menerbitkan laporan modal dan rapat anggota. Bagian hasil usahamu dibagikan transparan.', delta: 300000 },
  { icon: '📉', title: 'Modal koperasi macet', text: 'Dalam skenario rekaan, rencana usaha Kopdes Merah Putih tidak matang dan cicilan tertunda. Simpananmu ikut tertahan.', delta: -250000 },
  { icon: '🕋', title: 'Audit dana haji dibuka', text: 'Rincian biaya dan pengelolaan dana diperiksa secara terbuka dalam skenario fiktif. Pengembalian selisih biaya meringankanmu.', delta: 350000 },
  { icon: '🔍', title: 'Dugaan penyimpangan diperiksa', text: 'Dugaan penyalahgunaan dana haji dalam skenario permainan ditangani lewat audit dan proses hukum; jangan anggap kartu ini menyatakan perkara nyata terbukti.', delta: 200000 },
  { icon: '💸', title: 'Gaji tak mengejar harga', text: 'Harga sewa, pangan, dan transport naik lebih cepat dari upah. Pengeluaran rumah tanggamu membengkak.', delta: -300000 },
  { icon: '🧾', title: 'Pajak naik, layanan tetap', text: 'Tagihan pajak bertambah, tetapi antrean layanan tidak berkurang. Kamu harus mengurangi belanja bulanan.', delta: -250000 },
  { icon: '🏛️', title: 'Kebijakan mendadak dibatalkan', text: 'Keputusan sepihak yang merugikan warga digugat dan dikoreksi melalui mekanisme tata negara.', delta: 400000 },
  { icon: '📜', title: 'Polemik dugaan ijazah palsu', text: 'Sengketa soal dugaan ijazah palsu tokoh publik ramai dibahas. Kartu fiktif ini tidak menilai keaslian dokumen atau siapa pun; kamu menunggu bukti dan putusan berwenang, tetapi biaya konsultasi tetap keluar.', delta: -100000 },
  { icon: '🧑‍⚖️', title: 'Proses pidana transparan', text: 'Dalam skenario fiktif, pemeriksaan perkara diawasi dan hak semua pihak dihormati. Kamu menerima honor sebagai saksi ahli.', delta: 300000 },
  { icon: '🏠', title: 'Sengketa perdata selesai', text: 'Mediasi berbasis bukti menyelesaikan sengketa kontrakan tanpa sidang panjang. Biaya dan waktu kerjamu terselamatkan.', delta: 250000 },
  { icon: '🗣️', title: 'Warga menagih janji', text: 'Pejabat yang mengabaikan aturan diminta memberi penjelasan lewat rapat terbuka dan pengawasan publik. Ongkos advokasi dibagi bersama.', delta: 200000 },
  { icon: '👑', title: 'Aturan dianggap pilihan', text: 'Dalam skenario satir, pemimpin mengubah aturan saat merasa terganggu olehnya. Warga menempuh pengawasan dan uji tata negara; biaya advokasi patungan tetap menguras dana.', delta: -150000 }
];

const WNI_PUBLIC_FUND_CARDS = [
  { icon: '🏗️', title: 'Proyek mangkrak', text: 'Jalan dibongkar, tak kunjung selesai. Kendaraan rusak dan ongkos membengkak.', delta: -250000 },
  { icon: '📑', title: 'Berkas bolak-balik', text: 'Syarat berubah di tengah proses. Kamu kehilangan waktu kerja dan ongkos perjalanan.', delta: -180000 },
  { icon: '⚖️', title: 'Sidang ditunda lagi', text: 'Perkara perdata mundur tanpa kepastian. Ongkos transport dan cuti kerja terbuang.', delta: -220000 },
  { icon: '🧮', title: 'Pungutan berlapis', text: 'Tagihan administrasi muncul satu per satu. Kamu meminta dasar hukum, tetapi waktu tetap habis.', delta: -300000 },
  { icon: '🌧️', title: 'Tata ruang amburadul', text: 'Banjir merendam kontrakan. Perabot dan barang dagangan rusak.', delta: -400000 },
  { icon: '📰', title: 'Anggaran jadi bahan debat', text: 'Warga menunggu layanan, pejabat sibuk saling lempar tanggung jawab. Kamu nombok kebutuhan dasar.', delta: -200000 },
  { icon: '🕵️', title: 'Audit menemukan kejanggalan', text: 'Pengadaan fiktif dalam skenario permainan terbongkar. Dana publik yang tertahan dikembalikan ke warga.', delta: 350000 },
  { icon: '🧑‍⚖️', title: 'Hak warga dipulihkan', text: 'Pengujian aturan mengoreksi kebijakan yang merugikan warga. Bantuan hukum kolektif menutup sebagian biaya.', delta: 250000 },
  { icon: '🍱', title: 'Pengadaan MBG tak transparan', text: 'Dalam skenario rekaan, rincian pengadaan program Makan Bergizi Gratis sulit diakses. Pemasok kecil menunggu pembayaran dan kamu menanggung biaya operasional.', delta: -300000 },
  { icon: '🥣', title: 'Pengawasan dapur MBG lemah', text: 'Skenario fiktif mencatat bahan terlambat dan pemeriksaan mutu minim. Warga mengeluarkan biaya tambahan untuk memastikan makanan aman.', delta: -220000 },
  { icon: '🏘️', title: 'Kopdes tanpa musyawarah', text: 'Modal Koperasi Desa Merah Putih dikelola tanpa laporan yang mudah dipahami anggota dalam skenario permainan. Usahamu kehilangan pelanggan dan simpanan tertahan.', delta: -280000 },
  { icon: '📚', title: 'Koperasi diaudit anggota', text: 'Anggota Kopdes meminta pembukuan, konflik kepentingan diumumkan, dan transaksi bermasalah diperiksa. Ada biaya pendampingan hukum.', delta: -100000 },
  { icon: '🕋', title: 'Biaya haji sulit dilacak', text: 'Dalam cerita fiktif, laporan pengelolaan dana haji terlambat dibuka. Keluargamu membayar konsultasi untuk mencari kejelasan biaya.', delta: -250000 },
  { icon: '🚨', title: 'Dugaan korupsi dana publik', text: 'Skenario permainan menggambarkan dugaan korupsi yang menghambat layanan; penyelidikan belum berarti pihak tertentu terbukti bersalah. Warga menombok kebutuhan mendesak.', delta: -350000 },
  { icon: '🧮', title: 'Pajak dan iuran menumpuk', text: 'Tagihan pajak, administrasi, dan iuran datang bersamaan. Penghasilanmu yang pas-pasan tidak cukup menutup semuanya.', delta: -400000 },
  { icon: '💼', title: 'Upah kecil, kontrak rapuh', text: 'Jam kerja bertambah tanpa kenaikan upah, sementara harga kebutuhan pokok terus naik. Kamu kehilangan pemasukan sehari.', delta: -300000 },
  { icon: '⚖️', title: 'Hukum terasa tajam sebelah', text: 'Dalam skenario fiktif, proses hukum berjalan lambat bagi warga biasa sementara perkara berpengaruh berlarut-larut. Ongkos bantuan hukum bertambah.', delta: -300000 },
  { icon: '🏛️', title: 'Aturan berubah sepihak', text: 'Kebijakan diumumkan tanpa konsultasi dan dasar yang jelas. Warga mengeluarkan biaya untuk menguji keputusan melalui jalur tata negara.', delta: -250000 },
  { icon: '📣', title: 'Pejabat sulit dimintai jawab', text: 'Pengaduan publik dilempar antarinstansi; tidak ada jawaban soal penggunaan anggaran. Kamu kehilangan waktu kerja untuk mengurusnya.', delta: -180000 },
  { icon: '📜', title: 'Isu ijazah jadi perkara panjang', text: 'Perdebatan soal keaslian ijazah tokoh publik memenuhi ruang publik. Dalam kartu fiktif ini tidak ada kesimpulan tentang siapa pun; proses verifikasi dan konsultasi hukum tetap menguras biaya.', delta: -200000 },
  { icon: '🧾', title: 'Pungutan tanpa dasar diuji', text: 'Kamu menolak pungutan yang tidak disertai dasar aturan. Pengaduan resmi berhasil, tetapi ongkos transport dan waktu kerja tidak kembali.', delta: -120000 },
  { icon: '🏗️', title: 'Proyek publik jadi bancakan', text: 'Skenario fiktif menggambarkan pengadaan yang diawasi buruk dan pekerjaan tak sesuai spesifikasi. Jalan rusak membuat usaha kecilmu sepi.', delta: -320000 },
  { icon: '🗳️', title: 'Hak warga mengawasi anggaran', text: 'Keterbukaan informasi membuat belanja publik bisa diperiksa. Dalam skenario permainan, dana yang salah salur dikembalikan ke layanan warga.', delta: 300000 }
];

/* ------------------------------------------------------------------ state */
const WNI = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

let wniAiTimer = 0;

function wniResetState(playerCount = 2, clearSavedGame = true) {
  clearTimeout(wniAiTimer);
  WNI.started = false;
  WNI.isVsComputer = false;
  WNI.busy = false;
  WNI.gameOver = false;
  WNI.currentPlayer = 0;
  WNI.turnCount = 0;
  WNI.playerCount = playerCount;
  WNI.owners = {};
  WNI.pendingDecision = null;
  WNI.pendingMovement = null;
  WNI.lastDice = [0, 0];
  WNI.players = Array.from({ length: playerCount }, () => ({
    money: WNI_CONFIG.START_MONEY,
    pos: 0,
    props: [],
    eliminated: false
  }));
  WNI.log = [];
  if (clearSavedGame) {
    try {
      localStorage.removeItem(WNI_STORAGE_KEY);
    } catch (error) {
      console.error('Tidak dapat menghapus simpanan WNI Simulator.', error);
    }
  }
}
wniResetState(2, false);

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
  $four: $('#wniFourMode'),
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
  return WNI.isVsComputer && i === 1 ? 'AI Tetangga' : `Pemain ${i + 1}`;
}
function wniIcon(i) {
  if (WNI.isVsComputer && i === 1) return '🤖';
  return ['🧑', '👩', '🧑‍🚀', '🚴'][i];
}
function wniVar(i) {
  if (WNI.isVsComputer && i === 1) return 'var(--ai-a), var(--ai-b)';
  return [
    'var(--p1-a), var(--p1-b)',
    'var(--p2-a), var(--p2-b)',
    'var(--p3-a), var(--p3-b)',
    'var(--p4-a), var(--p4-b)'
  ][i];
}
function wniNet(i) {
  return WNI.players[i].money + WNI.players[i].props.reduce((s, idx) => s + WNI_TILES[idx].price, 0);
}
function wniPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function wniGridArea(i) {
  const side = WNI_CONFIG.GRID;
  if (i < side) return `${side} / ${i + 1}`;
  if (i < side * 2 - 2) return `${side * 2 - i - 1} / ${side}`;
  if (i < side * 3 - 2) return `1 / ${side * 3 - i - 2}`;
  return `${i - side * 3 + 4} / 1`;
}

function wniPersist() {
  if (!WNI.started) return;
  try {
    localStorage.setItem(WNI_STORAGE_KEY, JSON.stringify({
      version: 1,
      started: WNI.started,
      gameOver: WNI.gameOver,
      isVsComputer: WNI.isVsComputer,
      playerCount: WNI.playerCount,
      currentPlayer: WNI.currentPlayer,
      turnCount: WNI.turnCount,
      players: WNI.players,
      owners: WNI.owners,
      log: WNI.log,
      pendingDecision: WNI.pendingDecision,
      pendingMovement: WNI.pendingMovement,
      lastDice: WNI.lastDice
    }));
  } catch (error) {
    console.error('Tidak dapat menyimpan progres WNI Simulator.', error);
  }
}

function wniRestoreGame() {
  let saved;
  try {
    const raw = localStorage.getItem(WNI_STORAGE_KEY);
    if (!raw) return false;
    saved = JSON.parse(raw);
  } catch (error) {
    console.error('Tidak dapat membaca simpanan WNI Simulator.', error);
    return false;
  }

  if (!saved || saved.version !== 1 || saved.started !== true ||
      ![2, 4].includes(saved.playerCount) || !Array.isArray(saved.players) ||
      saved.players.length !== saved.playerCount ||
      !saved.players.every((player) => player &&
        Number.isFinite(player.money) &&
        Number.isInteger(player.pos) &&
        player.pos >= 0 && player.pos < 100 &&
        Array.isArray(player.props) &&
        player.props.every((idx) => Number.isInteger(idx) && idx >= 0 && idx < 100))) {
    return false;
  }

  WNI.started = true;
  WNI.gameOver = saved.gameOver === true;
  WNI.isVsComputer = saved.isVsComputer === true;
  WNI.playerCount = saved.playerCount;
  WNI.currentPlayer = Number.isInteger(saved.currentPlayer) &&
    saved.currentPlayer >= 0 && saved.currentPlayer < saved.playerCount ? saved.currentPlayer : 0;
  WNI.turnCount = Number.isInteger(saved.turnCount) && saved.turnCount >= 0 ? saved.turnCount : 0;
  WNI.players = saved.players.map((player) => ({
    money: player.money,
    pos: player.pos % WNI_CONFIG.TILE_COUNT,
    props: [...new Set(player.props.filter((idx) =>
      idx < WNI_TILES.length && WNI_TILES[idx]?.type === 'property'))],
    eliminated: player.eliminated === true
  }));
  WNI.owners = {};
  WNI.players.forEach((player, playerIndex) => {
    player.props.forEach((idx) => {
      if (WNI.owners[idx] === undefined) WNI.owners[idx] = playerIndex;
    });
  });
  WNI.log = Array.isArray(saved.log) ? saved.log.slice(0, 14) : [];
  const pending = saved.pendingDecision;
  if (pending && Number.isInteger(pending.player) &&
      pending.player >= 0 && pending.player < saved.playerCount) {
    if (pending.type === 'start' && Number.isInteger(pending.remaining) &&
        pending.remaining >= 0 && pending.remaining <= 11) {
      WNI.pendingDecision = pending;
    } else if (pending.type === 'card' && pending.card) {
      const isChance = pending.deckName === 'Kartu Kesempatan';
      const deck = isChance ? WNI_CHANCE_CARDS
        : pending.deckName === 'Dana Umum' ? WNI_PUBLIC_FUND_CARDS : [];
      const card = deck.find((entry) => entry.title === pending.card.title);
      if (card) {
        WNI.pendingDecision = {
          type: 'card',
          player: pending.player,
          card,
          deckName: isChance ? 'Kartu Kesempatan' : 'Dana Umum',
          logType: isChance ? 'kesempatan' : 'dana-umum'
        };
      }
    } else if (pending.type === 'buy' && Number.isInteger(pending.idx) &&
        WNI_TILES[pending.idx]?.type === 'property') {
      WNI.pendingDecision = pending;
    }
  }
  const movement = saved.pendingMovement;
  if (movement && Number.isInteger(movement.player) &&
      movement.player >= 0 && movement.player < saved.playerCount &&
      Number.isInteger(movement.remaining) && movement.remaining >= 0 && movement.remaining <= 12) {
    WNI.pendingMovement = movement;
  }
  WNI.lastDice = Array.isArray(saved.lastDice) && saved.lastDice.length === 2 &&
    saved.lastDice.every((value) => Number.isInteger(value) && value >= 0 && value <= 6)
    ? saved.lastDice
    : [0, 0];
  WNI.busy = Boolean(WNI.pendingDecision || WNI.pendingMovement);

  wniShowDice(...WNI.lastDice);
  wniRender();
  if (WNI.log.length) {
    W.$log.html(WNI.log.map((entry) => `
      <div class="log-item"${entry.type ? ` data-type="${entry.type}"` : ''}>
        <span class="log-item__icon" aria-hidden="true">${entry.icon}</span>
        <span>${entry.html}</span>
        <span class="log-item__val">${entry.value}</span>
      </div>`).join(''));
  } else {
    W.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  }
  if (WNI.pendingDecision) setTimeout(wniResumePendingDecision, 0);
  else if (WNI.pendingMovement) {
    setTimeout(() => wniMove(WNI.pendingMovement.player, WNI.pendingMovement.remaining), 0);
  } else if (WNI.isVsComputer && WNI.currentPlayer === 1 && !WNI.gameOver) {
    wniAiTimer = setTimeout(wniPlayTurn, WNI_CONFIG.AI_DELAY);
  }
  return true;
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
    const sides = [];
    if (i < WNI_CONFIG.GRID) sides.push('bottom');
    if (i >= WNI_CONFIG.GRID - 1 && i < WNI_CONFIG.GRID * 2 - 1) sides.push('right');
    if (i >= WNI_CONFIG.GRID * 2 - 2 && i < WNI_CONFIG.GRID * 3 - 2) sides.push('top');
    if (i >= WNI_CONFIG.GRID * 3 - 3 || i === 0) sides.push('left');
    html += `<div class="wni-tile wni-tile--${t.type} ${sides.map((side) => `wni-tile--${side}`).join(' ')}"
      id="wniTile${i}" role="group" aria-label="Petak ${i + 1}: ${t.name}" style="grid-area:${wniGridArea(i)};--tile-color:${band}">
      <span class="wni-tile__stripe" aria-hidden="true"></span>
      <span class="wni-tile__number" aria-hidden="true">${i + 1}</span>
      <span class="wni-tile__emoji" aria-hidden="true">${t.emoji}</span>
      <span class="wni-tile__name">${t.name}</span>
      ${t.price ? `<span class="wni-tile__price">${wniShort(t.price)}</span>` : ''}
      ${t.rent ? `<span class="wni-tile__rent">Sewa ${wniShort(t.rent)}</span>` : ''}
      <span class="wni-tile__owner" aria-hidden="true"></span>
    </div>`;
  });

  html += ['🧑', '👩', '🧑‍🚀', '🚴'].map((icon, i) =>
    `<div class="wni-token wni-token--${i}" id="wniToken${i}" aria-hidden="true">${icon}</div>`
  ).join('');

  W.$board.html(html);
}

function wniRenderTokens() {
  W.$board.find('.wni-token').each(function () {
    const player = +this.id.replace('wniToken', '');
    const $t = $(this);
    $t.toggle(WNI.players[player] !== undefined);
    if (WNI.players[player] === undefined) return;
    const pos = WNI.players[player].pos;
    if ($t.attr('data-host') !== String(pos)) {
      $('#wniTile' + pos).append($t);
      $t.attr('data-host', pos);
    }
    $t.text(wniIcon(player));
    $t.css('background', `linear-gradient(140deg, ${wniVar(player)})`);
    $t.toggleClass('is-turn', WNI.started && !WNI.gameOver && player === WNI.currentPlayer);
  });
  W.$board.find('.wni-tile').removeClass('is-here-0 is-here-1 is-here-2 is-here-3 is-owned-0 is-owned-1 is-owned-2 is-owned-3');
  W.$board.find('.wni-tile__owner').text('');
  WNI.players.forEach((player, i) => {
    $('#wniTile' + player.pos).addClass('is-here-' + i);
    player.props.forEach((idx) => {
      const $tile = $('#wniTile' + idx);
      $tile.addClass('is-owned-' + i);
      $tile.find('.wni-tile__owner').css('color', wniVar(i).split(', ')[0]);
      $tile.find('.wni-tile__owner').text('P' + (i + 1));
    });
  });
}

/* ------------------------------------------------------------------ render */
function wniRenderPlayers() {
  W.$players.html(WNI.players.map((p, i) => {
    const active = WNI.started && !WNI.gameOver && i === WNI.currentPlayer;
    const vars = wniVar(i).split(', ');
    const low = p.money < WNI_CONFIG.LOW_MONEY;
    const assets = p.props.map((idx) => `<span class="wni-asset">${WNI_TILES[idx].emoji} ${WNI_TILES[idx].name}</span>`).join('');
    return `<div class="player-row wni-player${active ? ' is-turn' : ''}" data-p="${i + 1}" style="--c1:${vars[0]};--c2:${vars[1]}">
      <div class="player-row__avatar" aria-hidden="true">${wniIcon(i)}</div>
      <div>
        <div class="player-row__name">${wniName(i)}</div>
        <div class="player-row__meta">${WNI.isVsComputer && i === 1 ? 'Komputer' : `Pemain ${i + 1}`} · ${WNI_TILES[p.pos].emoji} ${WNI_TILES[p.pos].name}${p.eliminated ? ' · Gugur' : ''}</div>
        ${assets ? `<div class="wni-assets">${assets}</div>` : ''}
      </div>
      <div class="wni-money${low ? ' is-low' : ''}">${wniMoney(p.money)}<small>net ${wniMoney(wniNet(i))}</small></div>
    </div>`;
  }).join(''));
}

function wniRenderNetworth() {
  const values = WNI.players.map((_, i) => wniNet(i));
  const max = Math.max(...values, 1);
  W.$networth.html(values.map((value, i) => {
    const vars = wniVar(i).split(', ');
    const pct = Math.max(3, Math.round((value / max) * 100));
    return `<div class="wni-net-item" style="--c1:${vars[0]};--c2:${vars[1]}">
      <span class="wni-net-item__dot" aria-hidden="true"></span>
      <span class="wni-net-item__bar"><span class="wni-net-item__fill" style="width:${pct}%"></span></span>
      <span class="wni-net-item__val">${WNI.players[i].eliminated ? 'Gugur · ' : ''}${wniMoney(value)}</span>
    </div>`;
  }).join(''));

  if (WNI.started) {
    const round = Math.min(WNI.turnCount + 1, WNI_CONFIG.TOTAL_ROUNDS);
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
      : `Putaran ${Math.min(WNI.turnCount + 1, WNI_CONFIG.TOTAL_ROUNDS)}/${WNI_CONFIG.TOTAL_ROUNDS} · ${WNI.players[WNI.currentPlayer].money < WNI_CONFIG.LOW_MONEY ? 'Saldo menipis!' : 'Tetap bertahan!'}`;
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
  W.$pvp.add(W.$four).add(W.$ai).prop('disabled', WNI.started);
  W.$pvp.attr('aria-pressed', String(WNI.started && !WNI.isVsComputer && WNI.playerCount === 2));
  W.$four.attr('aria-pressed', String(WNI.started && !WNI.isVsComputer && WNI.playerCount === 4));
  W.$ai.attr('aria-pressed', String(WNI.started && WNI.isVsComputer));
  W.$hint.toggleClass('is-hidden', WNI.started);
}

function wniRender() {
  wniRenderPlayers();
  wniRenderTokens();
  wniRenderNetworth();
  wniRenderTurn();
  wniRenderControls();
  wniPersist();
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
  WNI.lastDice = [d1, d2];
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
  WNI.pendingMovement = { player, remaining };
  wniPersist();

  const step = () => {
    if (remaining > 0) {
      const p = WNI.players[player];
      p.pos = (p.pos + 1) % WNI_CONFIG.TILE_COUNT;
      remaining--;
      if (p.pos === 0) {
        WNI.pendingDecision = { type: 'start', player, remaining };
        WNI.pendingMovement = { player, remaining };
        WNI.busy = true;
        wniRenderTokens();
        wniRenderPlayers();
        wniPersist();
        return wniPromptStart(player, remaining);
      }
      WNI.pendingMovement = { player, remaining };
      wniRenderTokens();
      wniRenderPlayers();
      wniPersist();
      setTimeout(step, delay);
    } else {
      WNI.pendingMovement = null;
      wniPersist();
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

  if (tile.type === 'kesempatan') {
    return wniDrawCard(player, WNI_CHANCE_CARDS, 'Kartu Kesempatan', 'kesempatan');
  }

  if (tile.type === 'dana-umum') {
    return wniDrawCard(player, WNI_PUBLIC_FUND_CARDS, 'Dana Umum', 'dana-umum');
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

function wniDrawCard(player, deck, deckName, logType) {
  const card = wniPick(deck);
  WNI.pendingDecision = { type: 'card', player, card, deckName, logType };
  wniRender();
  wniPromptCard(WNI.pendingDecision);
}

function wniResumePendingDecision() {
  const decision = WNI.pendingDecision;
  if (!decision) return;
  if (decision.type === 'card') {
    wniPromptCard(decision);
  } else if (decision.type === 'start') {
    wniPromptStart(decision.player, decision.remaining);
  } else if (decision.type === 'buy') {
    wniPromptBuy(decision.player, decision.idx);
  }
}

function wniPromptCard(decision) {
  const { player, card, deckName, logType } = decision;
  const amount = Math.abs(card.delta);
  const change = card.delta < 0 ? `−${wniMoney(amount)}` : `+${wniMoney(amount)}`;
  const playerNameText = wniName(player);

  if (WNI.isVsComputer && player === 1) {
    WNI.players[player].money += card.delta;
    wniLog(card.icon, `<strong>${playerNameText}</strong> menerima ${deckName}: ${card.title}`, change, logType);
    WNI.pendingDecision = null;
    wniRender();
    toast(`${card.icon} ${playerNameText}: ${card.title} (${change})`);
    return wniAfterAction(player);
  }

  Swal.fire({
    customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm', cancelButton: 'swal-cancel' },
    title: `${card.icon} ${deckName}`,
    html: `<div class="wni-card-draw">
      <strong class="wni-card-draw__title">${card.title}</strong>
      <p>${card.text}</p>
      <span class="wni-card-draw__amount${card.delta < 0 ? ' is-loss' : ''}">${change} jika diterima</span>
      <small>Terima untuk menjalankan efek kartu. Batal untuk melewati kartu tanpa perubahan saldo.</small>
      <small>Skenario fiktif untuk permainan; tidak merujuk pada orang atau perkara tertentu.</small>
    </div>`,
    showCancelButton: true,
    confirmButtonText: 'Terima',
    cancelButtonText: 'Batal',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      WNI.players[player].money += card.delta;
      wniLog(card.icon, `<strong>${playerNameText}</strong> menerima ${deckName}: ${card.title}`, change, logType);
      toast(`${card.icon} ${playerNameText}: ${card.title} (${change})`);
    } else {
      wniLog('↩️', `<strong>${playerNameText}</strong> membatalkan ${deckName}: ${card.title}`, 'Tanpa efek', 'skip');
      toast(`↩️ Kartu dibatalkan. Saldo ${playerNameText} tidak berubah.`);
    }
    WNI.pendingDecision = null;
    wniRender();
    wniAfterAction(player);
  });
}

function wniPromptStart(player, remaining) {
  const playerNameText = wniName(player);
  if (WNI.isVsComputer && player === 1) {
    WNI.players[player].money += WNI_CONFIG.PASS_GO;
    WNI.pendingDecision = null;
    wniLog('💵', `<strong>${playerNameText}</strong> menerima bonus saat melewati START`, '+' + wniMoney(WNI_CONFIG.PASS_GO), 'start');
    toast(`💵 ${playerNameText} menerima bonus START ${wniMoney(WNI_CONFIG.PASS_GO)}`);
    wniRender();
    return wniContinueAfterStart(player, remaining);
  }

  Swal.fire({
    customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm', cancelButton: 'swal-cancel' },
    title: '🏁 Melewati START',
    html: `<div class="wni-card-draw">
      <strong class="wni-card-draw__title">Dana bantuan Rp500.000</strong>
      <p>${playerNameText} melewati START. Terima bantuan untuk menambah saldo, atau batalkan dan lanjut tanpa bonus.</p>
      <span class="wni-card-draw__amount">+${wniMoney(WNI_CONFIG.PASS_GO)} jika diterima</span>
    </div>`,
    showCancelButton: true,
    confirmButtonText: 'Terima',
    cancelButtonText: 'Batal',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      WNI.players[player].money += WNI_CONFIG.PASS_GO;
      wniLog('💵', `<strong>${playerNameText}</strong> menerima bantuan saat melewati START`, '+' + wniMoney(WNI_CONFIG.PASS_GO), 'start');
      toast(`💵 ${playerNameText} menerima bantuan START ${wniMoney(WNI_CONFIG.PASS_GO)}`);
    } else {
      wniLog('↩️', `<strong>${playerNameText}</strong> membatalkan bantuan START`, 'Tanpa bonus', 'skip');
      toast(`↩️ ${playerNameText} melewati START tanpa mengambil bonus.`);
    }
    WNI.pendingDecision = null;
    wniRender();
    wniContinueAfterStart(player, remaining);
  });
}

function wniContinueAfterStart(player, remaining) {
  WNI.pendingMovement = remaining > 0 ? { player, remaining } : null;
  wniPersist();
  if (remaining > 0) return wniMove(player, remaining);
  wniResolveTile(player);
}

function wniAskBuy(player, idx) {
  WNI.pendingDecision = { type: 'buy', player, idx };
  wniRender();
  wniPromptBuy(player, idx);
}

function wniPromptBuy(player, idx) {
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
    WNI.pendingDecision = null;
    wniRender();
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
  WNI.pendingMovement = null;
  WNI.pendingDecision = null;
  if (WNI.players[player].money < 0) {
    WNI.players[player].money = 0;
    WNI.players[player].eliminated = true;
    wniLog('💸', `<strong>${wniName(player)}</strong> bangkrut dan gugur`, '', 'skip');
  }
  wniNextTurn();
}

function wniNextTurn() {
  const remainingPlayers = WNI.players.filter((player) => !player.eliminated);
  if (remainingPlayers.length <= 1) {
    return remainingPlayers.length
      ? wniGameOver(WNI.players.indexOf(remainingPlayers[0]), 'Pemain lain bangkrut.')
      : wniEndByNetworth();
  }

  const previousPlayer = WNI.currentPlayer;
  do {
    WNI.currentPlayer = (WNI.currentPlayer + 1) % WNI.playerCount;
  } while (WNI.players[WNI.currentPlayer].eliminated);
  if (WNI.currentPlayer <= previousPlayer) {
    WNI.turnCount++;
    if (WNI.turnCount >= WNI_CONFIG.TOTAL_ROUNDS) return wniEndByNetworth();
  }
  wniRender();

  if (WNI.isVsComputer && WNI.currentPlayer === 1) {
    wniAiTimer = setTimeout(() => { if (WNI.started && !WNI.gameOver) wniPlayTurn(); }, WNI_CONFIG.AI_DELAY);
  }
}

/* --------------------------------------------------------------- game end */
function wniEndByNetworth() {
  WNI.gameOver = true;
  WNI.busy = false;
  const activePlayers = WNI.players.map((player, i) => ({ i, net: wniNet(i) }))
    .filter(({ i }) => !WNI.players[i].eliminated);
  const active = activePlayers.length
    ? activePlayers
    : WNI.players.map((player, i) => ({ i, net: wniNet(i) }));
  const highest = Math.max(...active.map(({ net }) => net));
  const winners = active.filter(({ net }) => net === highest);
  if (winners.length > 1) return wniGameOver(-1, 'Seri! Kekayaan imbang.');
  return wniGameOver(winners[0].i, `${WNI_CONFIG.TOTAL_ROUNDS} putaran berlalu.`);
}

function wniGameOver(winner, reason) {
  clearTimeout(wniAiTimer);
  WNI.gameOver = true;
  WNI.busy = false;
  wniRender();
  const net = WNI.players.map((_, i) => wniNet(i));

  if (winner < 0) {
    wniLog('🤝', 'Permainan berakhir <strong>seri</strong>', '', 'self');
    Swal.fire({
      customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm' },
      title: '🤝 Seri!',
      html: `<p style="margin:6px 0 0;color:var(--muted)">${reason} Kekayaan semua pemain imbang.</p>`,
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
function wniStart(vsComputer, playerCount = 2) {
  wniResetState(playerCount);
  WNI.isVsComputer = vsComputer;
  WNI.started = true;
  wniShowDice(0, 0);
  W.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  wniRender();
  const modeName = vsComputer ? 'Pemain 1 vs AI Tetangga' : `${playerCount} Pemain`;
  wniLog('🧭', `Mode dimulai: <strong>${modeName}</strong>`, '', 'start');
  toast(vsComputer ? '🤖 Lawan AI Tetangga. Semoga kuat!' : `👥 Mode ${playerCount} pemain dimulai!`);
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
  if (!wniRestoreGame()) wniRender();

  W.$pvp.on('click', () => wniStart(false));
  W.$four.on('click', () => wniStart(false, 4));
  W.$ai.on('click', () => wniStart(true));
  W.$roll.on('click', wniPlayTurn);
  W.$reset.on('click', wniReset);
});
