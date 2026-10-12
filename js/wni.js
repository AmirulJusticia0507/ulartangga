/**
 * WNI SIMULATOR
 * Mode boardgame satir roll-and-move: kelola dana bansos, beli aset,
 * hadapi Kartu Musibah/Takdir dan ruang tunggu kehidupan.
 */

const WNI_CONFIG = {
  TILE_COUNT: 36,
  GRID: 10,
  START_MONEY: 10000000,
  PASS_GO: 500000,
  LOW_MONEY: 500000,
  PAJAK: 300000,
  DENDA_SITA: 500000,
  MAX_PROPERTY_LEVEL: 3,
  PROPERTY_UPGRADE_RATE: 0.5,
  STEP_MS: 260,
  AI_DELAY: 900
};

const WNI_STORAGE_KEY = 'wni-simulator-save-v1';
const WNI_PLAYER_ICONS = ['🧑', '👩', '🧑‍🚀', '🚴', '👨‍💼', '👩‍💼', '🧑‍🌾', '🧑‍⚖️', '🧑‍🍳', '🧑‍🔧', '🧑‍🏫', '🐈'];

const WNI_TILES = [
  { type: 'start',     name: 'Start · Kelurahan',  emoji: '🏁' },
  { type: 'property',  name: 'Warung Kopi',        emoji: '☕', price: 600000,  rent: 120000 },
  { type: 'property',  name: 'Kos-Kosan',          emoji: '🏠', price: 900000,  rent: 180000 },
  { type: 'takdir', name: 'Kartu Takdir',            emoji: '✨' },
  { type: 'property',  name: 'Angkot',             emoji: '🚐', price: 750000,  rent: 150000 },
  { type: 'musibah', name: 'Kartu Musibah',          emoji: '⚡' },
  { type: 'property',  name: 'KRL Commuter',       emoji: '🚆', price: 1200000, rent: 240000 },
  { type: 'pajak',     name: 'Pajak & Retribusi',  emoji: '🧾' },
  { type: 'property',  name: 'Pasar Tradisional',  emoji: '🥬', price: 800000,  rent: 160000 },
  { type: 'property',  name: 'Warnet',             emoji: '🖥️', price: 700000,  rent: 140000 },
  { type: 'bebas',     name: 'Nongkrong Bebas',    emoji: '🛖' },
  { type: 'takdir', name: 'Kartu Takdir',            emoji: '✨' },
  { type: 'property',  name: 'Toko Kelontong',     emoji: '🏪', price: 650000,  rent: 130000 },
  { type: 'property',  name: 'Laundry Kiloan',     emoji: '🧺', price: 850000,  rent: 170000 },
  { type: 'musibah', name: 'Kartu Musibah',          emoji: '⚡' },
  { type: 'property',  name: 'Kontrakan',          emoji: '🚪', price: 1000000, rent: 200000 },
  { type: 'tertahan', name: 'Masuk Pengadilan',      emoji: '⚖️' },
  { type: 'property',  name: 'Klinik 24 Jam',      emoji: '🏥', price: 1100000, rent: 220000 },
  { type: 'property',  name: 'Warung Tegal',       emoji: '🍛', price: 550000,  rent: 110000 },
  { type: 'takdir', name: 'Kartu Takdir',            emoji: '✨' },
  ...[
    ['property', 'Kopdes Merah Putih', '🏘️'],
    ['property', 'Dapur MBG', '🍱'],
    ['takdir', 'Kartu Takdir', '✨'],
    ['property', 'Pemasok Pangan', '🥬'],
    ['musibah', 'Kartu Musibah', '⚡'],
    ['property', 'Layanan Hukum', '⚖️'],
    ['pajak', 'Pajak Bertingkat', '🧾'],
    ['property', 'Pasar Desa', '🥕'],
    ['takdir', 'Kartu Takdir', '✨'],
    ['property', 'Kontrakan Buruh', '🚪'],
    ['musibah', 'Kartu Musibah', '⚡'],
    ['tertahan', 'PHK di Mana-mana', '📉'],
    ['property', 'Koperasi Warga', '🏘️'],
    ['musibah', 'Kartu Musibah', '⚡'],
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
  { icon: '👑', title: 'Aturan dianggap pilihan', text: 'Dalam skenario satir, pemimpin mengubah aturan saat merasa terganggu olehnya. Warga menempuh pengawasan dan uji tata negara; biaya advokasi patungan tetap menguras dana.', delta: -150000 },
  { icon: '📦', title: 'Paket bantuan salah sasaran', text: 'Dalam skenario fiktif, data penerima bantuan tidak diperbarui. Kamu membantu tetangga mengajukan koreksi dan menerima penggantian ongkos.', delta: 150000 },
  { icon: '🧑‍🍳', title: 'Upah dapur belum cair', text: 'Pembayaran kerja di dapur program makan terlambat. Kamu tetap harus membayar ongkos pulang dan kebutuhan harian.', delta: -220000 },
  { icon: '🔍', title: 'Laporan warga ditindaklanjuti', text: 'Catatan warga tentang mutu proyek dan penggunaan anggaran diperiksa secara terbuka dalam skenario permainan. Kerja pendataanmu mendapat honor.', delta: 250000 },
  { icon: '🗂️', title: 'Dokumen publik disembunyikan', text: 'Permintaan informasi anggaran dipingpong antar meja. Kamu membayar biaya salinan dan kehilangan satu hari kerja.', delta: -180000 },
  { icon: '🧑‍⚖️', title: 'Bantuan hukum kolektif', text: 'Warga mengumpulkan bukti dan berkonsultasi bersama. Beban biaya perkara perdata terbagi lebih ringan.', delta: 300000 },
  { icon: '🏛️', title: 'Kebijakan diuji di ruang publik', text: 'Dalam skenario fiktif, keputusan yang berdampak pada warga dibahas terbuka dan diperbaiki setelah masukan masyarakat.', delta: 200000 }
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
  { icon: '🗳️', title: 'Hak warga mengawasi anggaran', text: 'Keterbukaan informasi membuat belanja publik bisa diperiksa. Dalam skenario permainan, dana yang salah salur dikembalikan ke layanan warga.', delta: 300000 },
  { icon: '🍱', title: 'Distribusi makan terlambat', text: 'Dalam skenario fiktif, jadwal pengiriman program makan berantakan. Kamu membeli makan pengganti dan ongkos perjalanan bertambah.', delta: -200000 },
  { icon: '🏘️', title: 'Modal Kopdes tertahan', text: 'Laporan usaha koperasi desa belum dibagikan kepada anggota. Simpananmu belum bisa ditarik saat biaya sekolah jatuh tempo.', delta: -250000 },
  { icon: '🕋', title: 'Rincian biaya perjalanan terbuka', text: 'Audit dan informasi biaya perjalanan ibadah dipublikasikan dalam skenario permainan. Selisih pembayaran yang terverifikasi dikembalikan.', delta: 250000 },
  { icon: '🚔', title: 'Penyidikan perlu waktu', text: 'Dugaan penyimpangan anggaran sedang diperiksa dan belum membuktikan kesalahan pihak mana pun. Warga menutup dulu biaya layanan yang tertunda.', delta: -180000 },
  { icon: '📈', title: 'Harga naik, upah tertinggal', text: 'Harga pangan dan kontrakan kembali naik, sementara upah tetap. Anggaran bulananmu harus dipangkas.', delta: -350000 },
  { icon: '📜', title: 'Aturan diuji lewat prosedur', text: 'Warga mengajukan keberatan melalui jalur hukum yang berlaku. Keputusan sementara ditinjau dan kerugianmu sebagian dipulihkan.', delta: 300000 }
];

/* ------------------------------------------------------------------ state */
const WNI = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  selectedIcons: ['🧑', '👩', '🧑‍🚀', '🚴'],
  setupReady: false
};

let wniAiTimer = 0;
let wniMovementTimer = 0;

function wniResetState(playerCount = 2, clearSavedGame = true) {
  clearTimeout(wniAiTimer);
  clearTimeout(wniMovementTimer);
  wniMovementTimer = 0;
  WNI.started = false;
  WNI.setupReady = false;
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
    moneyHistory: [WNI_CONFIG.START_MONEY],
    pos: 0,
    props: [],
    upgrades: {},
    detained: false,
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
  $networth: $('#wniNetworth'),
  $start: $('#wniStart'),
  $setupHint: $('#wniSetupHint')
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
  return WNI.selectedIcons[i] || WNI_PLAYER_ICONS[i];
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
  return WNI.players[i].money + WNI.players[i].props.reduce((sum, idx) => {
    const tile = WNI_TILES[idx];
    return sum + tile.price + wniUpgradeLevel(WNI.players[i], idx) * wniUpgradeCost(idx);
  }, 0);
}
function wniUpgradeLevel(player, idx) {
  return Number.isInteger(player.upgrades?.[idx]) ? player.upgrades[idx] : 0;
}
function wniUpgradeCost(idx) {
  return Math.round(WNI_TILES[idx].price * WNI_CONFIG.PROPERTY_UPGRADE_RATE);
}
function wniRent(idx, level = 0) {
  return WNI_TILES[idx].rent * (2 ** level);
}
function wniCanUpgrade(playerIndex, idx) {
  const player = WNI.players[playerIndex];
  return WNI.started && !WNI.gameOver && !WNI.busy &&
    !(WNI.isVsComputer && WNI.currentPlayer === 1) &&
    !(WNI.isVsComputer && playerIndex === 1) &&
    player && !player.eliminated && player.props.includes(idx) &&
    wniUpgradeLevel(player, idx) < WNI_CONFIG.MAX_PROPERTY_LEVEL &&
    player.money >= wniUpgradeCost(idx);
}
function wniPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function wniChangeMoney(playerIndex, delta) {
  const player = WNI.players[playerIndex];
  player.money += delta;
  if (delta !== 0) {
    player.moneyHistory.push(player.money);
    if (player.moneyHistory.length > 16) player.moneyHistory.shift();
  }
}
function wniRecordMoneyBalance(playerIndex) {
  const player = WNI.players[playerIndex];
  player.moneyHistory.push(player.money);
  if (player.moneyHistory.length > 16) player.moneyHistory.shift();
}
function wniGridArea(i) {
  const side = WNI_CONFIG.GRID;
  const last = side - 1;
  let row;
  let column;
  if (i < side) {
    row = side;
    column = i + 1;
  } else if (i < side + last - 1) {
    row = side - (i - side) - 1;
    column = side;
  } else if (i < side + last * 2) {
    row = 1;
    column = side - (i - (side + last - 1));
  } else {
    row = i - (side + last * 2 - 2);
    column = 1;
  }
  return `${row} / ${column}`;
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
      selectedIcons: WNI.selectedIcons,
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
  WNI.gameOver = saved.gameOver === true &&
    saved.players.filter((player) => !player.eliminated).length <= 1;
  WNI.isVsComputer = saved.isVsComputer === true;
  WNI.playerCount = saved.playerCount;
  WNI.selectedIcons = Array.from({ length: 4 }, (_, index) =>
    WNI_PLAYER_ICONS.includes(saved.selectedIcons?.[index])
      ? saved.selectedIcons[index]
      : ['🧑', '👩', '🧑‍🚀', '🚴'][index]);
  WNI.currentPlayer = Number.isInteger(saved.currentPlayer) &&
    saved.currentPlayer >= 0 && saved.currentPlayer < saved.playerCount ? saved.currentPlayer : 0;
  WNI.turnCount = Number.isInteger(saved.turnCount) && saved.turnCount >= 0 ? saved.turnCount : 0;
  WNI.players = saved.players.map((player) => {
    const props = [...new Set(player.props.filter((idx) =>
      idx < WNI_TILES.length && WNI_TILES[idx]?.type === 'property'))];
    const upgrades = {};
    const moneyHistory = Array.isArray(player.moneyHistory)
      ? player.moneyHistory.filter(Number.isFinite).slice(-16).reduce((history, balance) => {
        if (history[history.length - 1] !== balance) history.push(balance);
        return history;
      }, [])
      : [];
    if (moneyHistory[moneyHistory.length - 1] !== player.money) moneyHistory.push(player.money);
    if (moneyHistory.length > 16) moneyHistory.shift();
    props.forEach((idx) => {
      const level = player.upgrades?.[idx];
      if (Number.isInteger(level) && level >= 0 && level <= WNI_CONFIG.MAX_PROPERTY_LEVEL) {
        upgrades[idx] = level;
      }
    });
    return {
      money: player.money,
      moneyHistory: moneyHistory.length ? moneyHistory : [player.money],
      pos: player.pos % WNI_CONFIG.TILE_COUNT,
      props,
      upgrades,
      detained: player.detained === true,
      eliminated: player.eliminated === true
    };
  });
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
      const isChance = pending.deckName === 'Kartu Takdir';
      const deck = isChance ? WNI_CHANCE_CARDS
        : pending.deckName === 'Kartu Musibah' ? WNI_PUBLIC_FUND_CARDS : [];
      const card = deck.find((entry) => entry.title === pending.card.title);
      if (card) {
        WNI.pendingDecision = {
          type: 'card',
          player: pending.player,
          card,
          cardDie: Number.isInteger(pending.cardDie) ? pending.cardDie : Math.floor(Math.random() * 6) + 1,
          deckName: isChance ? 'Kartu Takdir' : 'Kartu Musibah',
          logType: isChance ? 'takdir' : 'musibah'
        };
      }
    } else if (pending.type === 'buy' && Number.isInteger(pending.idx) &&
        WNI_TILES[pending.idx]?.type === 'property') {
      WNI.pendingDecision = pending;
    } else if (pending.type === 'upgrade' && Number.isInteger(pending.idx) &&
        WNI_TILES[pending.idx]?.type === 'property' &&
        WNI.players[pending.player].props.includes(pending.idx)) {
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
    <div class="wni-holding" id="wniHolding" aria-label="Ruang tunggu sementara">
      <strong>RUANG TUNGGU</strong>
      <span>Pengadilan · PHK</span>
      <small>Tunggu sampai giliran berikutnya</small>
    </div>
  </div>`;

  const propertyBands = ['#49a99b', '#e8a94e', '#8878bd', '#588eaa'];
  let propertyIndex = 0;
  WNI_TILES.forEach((t, i) => {
    const band = t.price ? propertyBands[Math.floor(propertyIndex++ / 3) % propertyBands.length] : '#c4ad7e';
    const [row, column] = wniGridArea(i).split(' / ').map(Number);
    const sides = [
      ...(row === WNI_CONFIG.GRID ? ['bottom'] : []),
      ...(column === WNI_CONFIG.GRID ? ['right'] : []),
      ...(row === 1 ? ['top'] : []),
      ...(column === 1 ? ['left'] : [])
    ];
    html += `<div class="wni-tile wni-tile--${t.type} ${sides.map((side) => `wni-tile--${side}`).join(' ')}"
      id="wniTile${i}" role="group" aria-label="Petak ${i + 1}: ${t.name}" style="grid-area:${wniGridArea(i)};--tile-color:${band}">
      <span class="wni-tile__stripe" aria-hidden="true"></span>
      <span class="wni-tile__number" aria-hidden="true">${i + 1}</span>
      <span class="wni-tile__emoji" aria-hidden="true">${t.emoji}</span>
      <span class="wni-tile__name">${t.name}</span>
      ${t.price ? '<span class="wni-tile__building" aria-hidden="true"></span>' : ''}
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

function wniRenderTokens(movingPlayer = -1) {
  W.$board.find('.wni-token').each(function () {
    const player = +this.id.replace('wniToken', '');
    const $t = $(this);
    $t.toggle(WNI.players[player] !== undefined);
    if (WNI.players[player] === undefined) return;
    const pos = WNI.players[player].pos;
    const host = WNI.players[player].detained ? 'holding' : String(pos);
    if ($t.attr('data-host') !== host) {
      (host === 'holding' ? $('#wniHolding') : $('#wniTile' + pos)).append($t);
      $t.attr('data-host', host);
    }
    $t.text(wniIcon(player));
    $t.css('background', `linear-gradient(140deg, ${wniVar(player)})`);
    $t.removeClass('is-stepping');
    if (player === movingPlayer && !WNI.reduceMotion) {
      void $t[0].offsetWidth;
      $t.addClass('is-stepping');
    }
    $t.toggleClass('is-turn', WNI.started && !WNI.gameOver && player === WNI.currentPlayer);
  });
  W.$board.find('.wni-tile')
    .removeClass('is-here-0 is-here-1 is-here-2 is-here-3 is-owned-0 is-owned-1 is-owned-2 is-owned-3 is-upgraded-1 is-upgraded-2 is-upgraded-3');
  W.$board.find('.wni-tile__owner').text('');
  WNI_TILES.forEach((tile, idx) => {
    if (tile.type !== 'property') return;
    const $tile = $('#wniTile' + idx);
    const owner = WNI.owners[idx];
    const level = owner === undefined ? 0 : wniUpgradeLevel(WNI.players[owner], idx);
    $tile.find('.wni-tile__rent').text(`Sewa ${wniShort(wniRent(idx, level))}`);
    $tile.find('.wni-tile__building').text(level === WNI_CONFIG.MAX_PROPERTY_LEVEL ? '🏨' : '🏠'.repeat(level));
    $tile.toggleClass('is-upgraded-1', level === 1)
      .toggleClass('is-upgraded-2', level === 2)
      .toggleClass('is-upgraded-3', level === 3);
    $tile.attr('aria-label', `Petak ${idx + 1}: ${tile.name}${owner === undefined ? '' : `, milik Pemain ${owner + 1}, tingkat ${level}, sewa ${wniMoney(wniRent(idx, level))}`}`);
  });
  WNI.players.forEach((player, i) => {
    if (!player.detained) $('#wniTile' + player.pos).addClass('is-here-' + i);
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
    const assets = p.props.map((idx) => {
      const tile = WNI_TILES[idx];
      const level = wniUpgradeLevel(p, idx);
      const cost = wniUpgradeCost(idx);
      const canUpgrade = wniCanUpgrade(i, idx);
      const levelLabel = level === WNI_CONFIG.MAX_PROPERTY_LEVEL ? 'Hotel' : `Bangunan ${level}/${WNI_CONFIG.MAX_PROPERTY_LEVEL}`;
      const buildings = level === WNI_CONFIG.MAX_PROPERTY_LEVEL ? '🏨' : (level ? '🏠'.repeat(level) : 'Tanah');
      const upgradeAction = WNI.isVsComputer && i === 1
        ? ''
        : `<button class="wni-asset__upgrade" type="button" data-wni-upgrade="${idx}" data-player="${i}" ${canUpgrade ? '' : 'disabled'} aria-label="${level === WNI_CONFIG.MAX_PROPERTY_LEVEL ? 'Tingkat upgrade maksimal' : `Upgrade ${tile.name} ke tingkat ${level + 1}, biaya ${wniMoney(cost)}`}">${level === WNI_CONFIG.MAX_PROPERTY_LEVEL ? 'Maksimal' : `Upgrade · ${wniMoney(cost)}`}</button>`;
      return `<article class="wni-asset-card" style="--asset-band:${['#e52620', '#31a956', '#8878bd', '#e8a94e'][idx % 4]}">
        <div class="wni-asset-card__band">${tile.emoji} ${tile.name}</div>
        <div class="wni-asset-card__building" aria-label="${levelLabel}">${buildings}</div>
        <dl class="wni-asset-card__facts">
          <div><dt>Harga</dt><dd>${wniMoney(tile.price)}</dd></div>
          <div><dt>Sewa</dt><dd>${wniMoney(wniRent(idx, level))}</dd></div>
          <div><dt>Status</dt><dd>${levelLabel}</dd></div>
        </dl>
        ${upgradeAction}
      </article>`;
    }).join('');
    const isHuman = !(WNI.isVsComputer && i === 1);
    const usedByOthers = WNI.selectedIcons.filter((_, index) =>
      index !== i && index < WNI.players.length &&
      !(WNI.isVsComputer && index === 1));
    const iconPicker = WNI.setupReady && !WNI.started && isHuman
      ? `<div class="wni-icon-picker" role="group" aria-label="Pilih ikon ${wniName(i)}">
          <span class="wni-icon-picker__label">Pilih ikon:</span>
          <div class="wni-icon-picker__options">
            ${WNI_PLAYER_ICONS.map((icon) => {
              const selected = WNI.selectedIcons[i] === icon;
              const unavailable = usedByOthers.includes(icon);
              return `<button class="wni-icon-picker__option${selected ? ' is-selected' : ''}" type="button"
                data-wni-icon="${icon}" data-player="${i}" ${unavailable ? 'disabled' : ''}
                aria-label="${icon}" aria-pressed="${selected}">${icon}</button>`;
            }).join('')}
          </div>
        </div>`
      : '';
    return `<article class="wni-player-card${active ? ' is-turn' : ''}" data-p="${i + 1}" style="--c1:${vars[0]};--c2:${vars[1]}">
      <header class="wni-player-card__head">
        <div class="player-row__avatar" aria-hidden="true">${wniIcon(i)}</div>
        <div class="wni-player-card__identity">
          <div class="player-row__name">${wniName(i)}</div>
          <div class="player-row__meta">${WNI.isVsComputer && i === 1 ? 'Komputer' : `Pemain ${i + 1}`} · ${p.detained ? '⏳ Ruang Tunggu' : `${WNI_TILES[p.pos].emoji} ${WNI_TILES[p.pos].name}`}${p.eliminated ? ' · Gugur' : ''}</div>
        </div>
        <div class="wni-money${low ? ' is-low' : ''}">${wniMoney(p.money)}<small>Net ${wniMoney(wniNet(i))}</small></div>
      </header>
      <div class="wni-player-card__body">
        ${iconPicker}
        <div class="wni-player-card__assets-title"><span>Kartu Aset</span><small>${p.props.length} properti</small></div>
        ${assets ? `<div class="wni-assets">${assets}</div>` : '<div class="wni-assets-empty">Belum mempunyai aset.</div>'}
      </div>
    </article>`;
  }).join(''));
}

function wniRenderNetworth() {
  const values = WNI.players.map((_, i) => wniNet(i));
  W.$networth.html(values.map((value, i) => {
    const vars = wniVar(i).split(', ');
    const history = WNI.players[i].moneyHistory;
    const points = (history.length ? history : [WNI.players[i].money]).slice(-12);
    const chartPoints = points.length === 1 ? [points[0], points[0]] : points;
    const low = Math.min(...points);
    const high = Math.max(...points);
    const range = high - low || 1;
    const coordinates = chartPoints.map((balance, index) => {
      const x = (index / (chartPoints.length - 1)) * 120;
      const y = 30 - ((balance - low) / range) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const trend = points.length > 1
      ? points[points.length - 1] > points[points.length - 2] ? 'naik'
        : points[points.length - 1] < points[points.length - 2] ? 'turun' : 'tetap'
      : 'tetap';
    return `<div class="wni-net-item" style="--c1:${vars[0]};--c2:${vars[1]}">
      <span class="wni-net-item__dot" aria-hidden="true"></span>
      <svg class="wni-net-item__chart is-${trend}" viewBox="0 0 120 34" preserveAspectRatio="none" role="img" aria-label="Tren saldo ${wniName(i)} ${trend}">
        <polyline class="wni-net-item__line" points="${coordinates}"></polyline>
      </svg>
      <span class="wni-net-item__val">${WNI.players[i].eliminated ? 'Gugur · ' : ''}${wniMoney(WNI.players[i].money)}<small>Net ${wniMoney(value)}</small></span>
    </div>`;
  }).join(''));

  if (WNI.started) {
    W.$round.text(`Putaran ${WNI.turnCount + 1}`);
  } else {
    W.$round.text('Putaran 0');
  }
}

function wniRenderTurn() {
  const centerStatus = document.getElementById('wniCenterStatus');
  if (centerStatus) {
    centerStatus.textContent = !WNI.started
      ? 'Dana bansos menanti...'
      : `Putaran ${WNI.turnCount + 1} · ${WNI.players[WNI.currentPlayer].money < WNI_CONFIG.LOW_MONEY ? 'Saldo menipis!' : 'Tetap bertahan!'}`;
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
  const selectedMode = WNI.started || WNI.setupReady;
  W.$setupHint.prop('hidden', WNI.started);
  W.$start.prop('hidden', WNI.started || !WNI.setupReady);
  W.$roll.prop('disabled', !WNI.started || WNI.busy || WNI.gameOver || !humanTurn);
  W.$roll.prop('hidden', !WNI.started);
  W.$reset.prop('disabled', !WNI.started);
  W.$pvp.add(W.$four).add(W.$ai).prop('disabled', WNI.started);
  W.$pvp.attr('aria-pressed', String(selectedMode && !WNI.isVsComputer && WNI.playerCount === 2));
  W.$four.attr('aria-pressed', String(selectedMode && !WNI.isVsComputer && WNI.playerCount === 4));
  W.$ai.attr('aria-pressed', String(selectedMode && WNI.isVsComputer));
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
  const activePlayer = WNI.players[WNI.currentPlayer];
  if (activePlayer.detained) {
    activePlayer.detained = false;
    wniLog('🚪', `<strong>${wniName(WNI.currentPlayer)}</strong> keluar dari ruang tunggu`, 'Boleh bergerak', 'self');
    toast(`🚪 ${wniName(WNI.currentPlayer)} kembali ke jalur dan boleh bergerak.`);
    wniRenderTokens();
  }
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
  clearTimeout(wniMovementTimer);
  wniMovementTimer = 0;
  const delay = WNI.reduceMotion ? 20 : WNI_CONFIG.STEP_MS;
  let remaining = steps;
  WNI.pendingMovement = { player, remaining };
  wniPersist();

  const step = () => {
    if (remaining > 0) {
      const p = WNI.players[player];
      p.pos = (p.pos + 1) % WNI_CONFIG.TILE_COUNT;
      remaining--;
      const $tile = $('#wniTile' + p.pos);
      W.$board.find('.wni-tile--step').removeClass('wni-tile--step');
      if (!WNI.reduceMotion) {
        $tile.addClass('wni-tile--step');
        setTimeout(() => $tile.removeClass('wni-tile--step'), 380);
      }
      if (p.pos === 0) {
        WNI.pendingDecision = { type: 'start', player, remaining };
        WNI.pendingMovement = { player, remaining };
        WNI.busy = true;
        wniRenderTokens(player);
        wniRenderPlayers();
        wniPersist();
        return wniPromptStart(player, remaining);
      }
      WNI.pendingMovement = { player, remaining };
      wniRenderTokens(player);
      wniRenderPlayers();
      wniPersist();
      wniMovementTimer = setTimeout(() => {
        wniMovementTimer = 0;
        step();
      }, delay);
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
    const rent = wniRent(idx, wniUpgradeLevel(WNI.players[owner], idx));
    const paid = Math.min(p.money, rent);
    wniChangeMoney(player, -rent);
    wniChangeMoney(owner, paid);
    toast(`💰 ${wniName(player)} bayar sewa ${wniMoney(paid)}`);
    wniLog('💰', `${wniName(player)} bayar sewa ke ${wniName(owner)}`, '-' + wniMoney(paid), 'rent');
    return wniAfterAction(player);
  }

  if (tile.type === 'takdir') {
    return wniDrawCard(player, WNI_CHANCE_CARDS, 'Kartu Takdir', 'takdir');
  }

  if (tile.type === 'musibah') {
    return wniDrawCard(player, WNI_PUBLIC_FUND_CARDS, 'Kartu Musibah', 'musibah');
  }

  if (tile.type === 'pajak') {
    wniChangeMoney(player, -WNI_CONFIG.PAJAK);
    toast(`🧾 ${wniName(player)} kena pajak ${wniMoney(WNI_CONFIG.PAJAK)}`);
    wniLog('🧾', `${wniName(player)} bayar pajak & retribusi`, '-' + wniMoney(WNI_CONFIG.PAJAK), 'pajak');
    return wniAfterAction(player);
  }

  if (tile.type === 'tertahan') {
    p.detained = true;
    toast(`⏳ ${wniName(player)} masuk ruang tunggu karena ${tile.name}.`);
    wniLog(tile.emoji, `<strong>${wniName(player)}</strong> tertahan: ${tile.name}`, 'Sampai giliran berikutnya', 'sita');
    wniRenderTokens();
    return wniAfterAction(player);
  }

  // start / bebas
  wniLog('✅', `${wniName(player)} aman di ${tile.name}`, '', 'self');
  return wniAfterAction(player);
}

function wniDrawCard(player, deck, deckName, logType) {
  const card = wniPick(deck);
  WNI.pendingDecision = { type: 'card', player, card, cardDie: Math.floor(Math.random() * 6) + 1, deckName, logType };
  wniRender();
  wniPromptCard(WNI.pendingDecision);
}

function wniCardOutcomes(card, isDisaster) {
  const value = Math.max(100000, Math.abs(card.delta));
  const half = Math.round(value / 2 / 10000) * 10000;
  const variant = [...card.title].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
  const money = (delta, label) => ({ text: `${label} ${wniMoney(Math.abs(delta))}`, delta });

  if (isDisaster) {
    return [
      [money(-value, 'Tanggung kerugian'), money(-half, 'Bayar separuh'), { text: 'Lolos tanpa kerugian', delta: 0 }],
      [{ text: 'Mundur 4 petak', delta: 0, move: -4 }, money(-half, 'Keluar biaya darurat'), { text: 'Bantuan datang · tanpa biaya', delta: 0 }],
      [{ text: 'Masuk Ruang Tunggu', delta: 0, detain: true }, { text: 'Mundur 2 petak', delta: 0, move: -2 }, money(-half, 'Bayar biaya pemulihan')],
      [money(-value, 'Kehilangan pemasukan'), { text: 'Mundur 3 petak', delta: 0, move: -3 }, money(Math.min(half, 250000), 'Dapat bantuan')]
    ][variant].map((outcome, index) => ({ ...outcome, range: ['1–2', '3–4', '5–6'][index] }));
  }

  return [
    [{ text: 'Mundur 3 petak', delta: 0, move: -3 }, money(half, 'Dapat'), money(value, 'Dapat penuh')],
    [{ text: 'Belum beruntung · tanpa efek', delta: 0 }, { text: 'Maju 2 petak', delta: 0, move: 2 }, money(value, 'Dapat rezeki')],
    [money(-Math.min(half, 200000), 'Bayar ongkos'), money(half, 'Dapat'), { text: 'Maju 4 petak', delta: 0, move: 4 }],
    [{ text: 'Mundur 2 petak', delta: 0, move: -2 }, money(half, 'Dapat bantuan'), money(value + 100000, 'Dapat bonus')]
  ][variant].map((outcome, index) => ({ ...outcome, range: ['1–2', '3–4', '5–6'][index] }));
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
  } else if (decision.type === 'upgrade') {
    wniPromptUpgrade(decision);
  }
}

function wniPromptCard(decision) {
  const { player, card, deckName, logType, cardDie } = decision;
  const playerNameText = wniName(player);
  const autoApply = WNI.isVsComputer && player === 1;
  const isDisaster = deckName === 'Kartu Musibah';
  const outcomes = wniCardOutcomes(card, isDisaster);
  const outcomeIndex = cardDie <= 2 ? 0 : cardDie <= 4 ? 1 : 2;
  const outcome = outcomes[outcomeIndex];
  const outcomeText = outcome.text;

  const cardHtml = `<div class="wni-card-draw wni-card-draw--revealed">
    <div class="wni-card-draw__face" aria-hidden="true">${card.icon}</div>
    <strong class="wni-card-draw__title">${card.title}</strong>
    <p>${card.text}</p>
    <div class="wni-card-outcomes">
      ${outcomes.map((item, index) => `<div class="${index === outcomeIndex ? 'is-result' : ''}"><b>${item.range}</b><span>${item.text}</span></div>`).join('')}
    </div>
    <span class="wni-card-draw__amount${outcome.delta < 0 || outcome.move ? ' is-loss' : ''}">🎲 Dadu kartu: ${cardDie} · ${outcomeText}</span>
    ${autoApply ? '<small>Hasil diterapkan otomatis untuk AI.</small>' : '<small>Efek kartu wajib dijalankan.</small>'}
    <small>Skenario fiktif untuk permainan; tidak merujuk pada orang atau perkara tertentu.</small>
  </div>`;
  const revealDelay = WNI.reduceMotion ? 0 : 1150;
  Swal.fire({
    position: 'center',
    customClass: {
      container: 'wni-card-modal-container',
      popup: 'swal-popup wni-card-modal',
      confirmButton: 'swal-confirm',
      cancelButton: 'swal-cancel'
    },
    title: `🎴 ${deckName} sedang diacak`,
    html: `<div class="wni-card-shuffle" aria-label="Kartu sedang dikocok">
      <span class="wni-card-shuffle__card">?</span>
      <span class="wni-card-shuffle__card">?</span>
      <span class="wni-card-shuffle__card">?</span>
    </div><p class="wni-card-shuffle__label">Mengocok kartu...</p>`,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      const popup = Swal.getPopup();
      setTimeout(() => {
        if (!popup || Swal.getPopup() !== popup) return;
        Swal.update({
          title: `${card.icon} ${deckName}`,
          html: cardHtml,
          showConfirmButton: !autoApply,
          showCancelButton: false,
          confirmButtonText: 'Jalankan efek'
        });
        if (autoApply) {
          setTimeout(() => {
            if (Swal.getPopup() === popup) Swal.close();
          }, WNI.reduceMotion ? 1100 : 1500);
        }
      }, revealDelay);
    }
  }).then((result) => {
    if (outcome.delta) wniChangeMoney(player, outcome.delta);
    if (outcome.move) {
      WNI.players[player].pos = (WNI.players[player].pos + WNI_CONFIG.TILE_COUNT + outcome.move) % WNI_CONFIG.TILE_COUNT;
      wniRenderTokens(player);
    }
    if (outcome.detain) {
      WNI.players[player].detained = true;
      wniRenderTokens(player);
    }
    wniLog(card.icon, `<strong>${playerNameText}</strong> menjalankan ${deckName}: ${card.title}`, `Dadu ${cardDie} · ${outcomeText}`, logType);
    toast(`${card.icon} ${playerNameText}: dadu ${cardDie}, ${outcomeText}`);
    WNI.pendingDecision = null;
    wniRender();
    wniAfterAction(player);
  });
}

function wniPromptStart(player, remaining) {
  const playerNameText = wniName(player);
  if (WNI.isVsComputer && player === 1) {
    wniChangeMoney(player, WNI_CONFIG.PASS_GO);
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
      wniChangeMoney(player, WNI_CONFIG.PASS_GO);
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
  delete WNI.players[player].upgrades[idx];
  WNI.owners[idx] = player;
  wniChangeMoney(player, -tile.price);
  WNI.players[player].props.push(idx);
  toast(`🏠 ${wniName(player)} beli ${tile.name} ${wniMoney(tile.price)}`);
  wniLog('🏠', `<strong>${wniName(player)}</strong> beli ${tile.name}`, '-' + wniMoney(tile.price), 'buy');
  wniRender();
}

function wniRequestUpgrade(player, idx) {
  if (!wniCanUpgrade(player, idx)) return;
  WNI.pendingDecision = { type: 'upgrade', player, idx };
  WNI.busy = true;
  wniRender();
  wniPromptUpgrade(WNI.pendingDecision);
}

function wniPromptUpgrade(decision) {
  const { player, idx } = decision;
  const tile = WNI_TILES[idx];
  const level = wniUpgradeLevel(WNI.players[player], idx);
  const nextLevel = level + 1;
  const cost = wniUpgradeCost(idx);
  const nextRent = wniRent(idx, nextLevel);
  Swal.fire({
    customClass: { popup: 'swal-popup', confirmButton: 'swal-confirm', cancelButton: 'swal-cancel' },
    title: `🏗️ Upgrade ${tile.name}?`,
    html: `<div class="wni-card-draw">
      <strong class="wni-card-draw__title">Tingkat ${level} → ${nextLevel}</strong>
      <p>Bangun aset ini lebih besar. Biaya upgrade <b>${wniMoney(cost)}</b>; sewa naik menjadi <b>${wniMoney(nextRent)}</b> setiap kali pemain lain mendarat di sini.</p>
      <span class="wni-card-draw__amount">Saldo setelah upgrade: ${wniMoney(WNI.players[player].money - cost)}</span>
    </div>`,
    showCancelButton: true,
    confirmButtonText: 'Upgrade',
    cancelButtonText: 'Batal',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    WNI.pendingDecision = null;
    WNI.busy = false;
    if (result.isConfirmed) {
      if (!wniCanUpgrade(player, idx)) {
        wniRender();
        toast('Saldo atau status aset berubah; upgrade tidak dilakukan.');
        return;
      }
      wniChangeMoney(player, -cost);
      WNI.players[player].upgrades[idx] = nextLevel;
      wniLog('🏗️', `<strong>${wniName(player)}</strong> upgrade ${tile.name} ke tingkat ${nextLevel}`, `-${wniMoney(cost)} · sewa ${wniMoney(nextRent)}`, 'upgrade');
      toast(`🏗️ ${tile.name} menjadi tingkat ${nextLevel}; sewa ${wniMoney(nextRent)}`);
      if (!WNI.reduceMotion) {
        const $tile = $('#wniTile' + idx);
        $tile.addClass('is-upgrade-flash');
        setTimeout(() => $tile.removeClass('is-upgrade-flash'), 900);
      }
    }
    wniRender();
  });
}

function wniAfterAction(player) {
  WNI.busy = false;
  WNI.pendingMovement = null;
  WNI.pendingDecision = null;
  if (WNI.players[player].money < 0) {
    WNI.players[player].money = 0;
    wniRecordMoneyBalance(player);
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
      : wniGameOver(-1, 'Semua pemain bangkrut.');
  }

  const previousPlayer = WNI.currentPlayer;
  do {
    WNI.currentPlayer = (WNI.currentPlayer + 1) % WNI.playerCount;
  } while (WNI.players[WNI.currentPlayer].eliminated);
  if (WNI.currentPlayer <= previousPlayer) {
    WNI.turnCount++;
  }
  wniRender();

  if (WNI.isVsComputer && WNI.currentPlayer === 1) {
    wniAiTimer = setTimeout(() => { if (WNI.started && !WNI.gameOver) wniPlayTurn(); }, WNI_CONFIG.AI_DELAY);
  }
}

/* --------------------------------------------------------------- game end */
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
function wniPrepare(vsComputer, playerCount = 2) {
  wniResetState(playerCount);
  WNI.isVsComputer = vsComputer;
  WNI.setupReady = true;
  wniShowDice(0, 0);
  W.$log.html('<div class="empty-note">Pilih ikon pemain, lalu mulai permainan.</div>');
  wniRender();
}

function wniStart() {
  if (!WNI.setupReady || WNI.started) return;
  WNI.started = true;
  WNI.setupReady = false;
  wniShowDice(0, 0);
  W.$log.html('<div class="empty-note">Belum ada gerakan.</div>');
  wniRender();
  const modeName = WNI.isVsComputer ? 'Pemain 1 vs AI Tetangga' : `${WNI.playerCount} Pemain`;
  wniLog('🧭', `Mode dimulai: <strong>${modeName}</strong>`, '', 'start');
  toast(WNI.isVsComputer ? '🤖 Lawan AI Tetangga. Semoga kuat!' : `👥 Mode ${WNI.playerCount} pemain dimulai!`);
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

  W.$pvp.on('click', () => wniPrepare(false, 2));
  W.$four.on('click', () => wniPrepare(false, 4));
  W.$ai.on('click', () => wniPrepare(true));
  W.$start.on('click', wniStart);
  W.$roll.on('click', wniPlayTurn);
  W.$reset.on('click', wniReset);
  W.$players.on('click', '[data-wni-icon]', function () {
    if (!WNI.setupReady || WNI.started) return;
    const player = Number(this.dataset.player);
    const icon = this.dataset.wniIcon;
    if (!WNI.players[player] || !WNI_PLAYER_ICONS.includes(icon)) return;
    if (WNI.selectedIcons.some((chosen, index) =>
      index !== player && index < WNI.players.length &&
      !(WNI.isVsComputer && index === 1) && chosen === icon)) return;
    WNI.selectedIcons[player] = icon;
    wniRenderPlayers();
    wniRenderTokens();
  });
  W.$players.on('click', '[data-wni-upgrade]', function () {
    wniRequestUpgrade(Number(this.dataset.player), Number(this.dataset.wniUpgrade));
  });
});
