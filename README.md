# 🎲 Game Ular Tangga (Snake 'n Ladder)

Permainan web dengan dua mode yang dapat ditukar dari tombol di header: Ular Tangga dan
WNI Simulator. Keduanya mendukung 2 atau 4 pemain lokal, serta permainan melawan AI.

Proyek ini statis — tanpa build step, tanpa backend. Cukup buka `index.html` di browser.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Cara Menjalankan](#-cara-menjalankan)
- [Aturan Main](#-aturan-main)
- [Struktur Papan](#-struktur-papan)
- [Struktur Proyek](#-struktur-proyek)
- [Teknologi](#-teknologi)
- [Cara Kerja Kode](#-cara-kerja-kode)
- [Catatan Tampilan](#-catatan-tampilan)
- [Kontrol Git](#-kontrol-git)

---

## ✨ Fitur

| Fitur | Keterangan |
| --- | --- |
| 🧑‍🤝‍🧑 **Mode 2 Pemain** | Dua pemain bergantian melempar dadu di perangkat yang sama. |
| 👥 **Mode 4 Pemain** | Empat pemain bergantian bermain di perangkat yang sama pada kedua game. |
| 🤖 **Mode Vs AI** | Lawan dikendalikan AI dan bergerak otomatis setelah giliran pemain pertama. |
| 🎲 **Dua dadu sungguhan** | Angka dadu digambar sebagai titik (pip) di grid 3x3, lengkap dengan animasi goyang. |
| 🐍 **Ular** | Pemain yang mendarat di kepala ular turun mengikuti ular. |
| 🪜 **Tangga** | Pemain yang mendarat di kaki tangga naik mengikuti tangga. |
| 🎨 **Ular & tangga digambar** | Tubuh ular & rel tangga digambar dengan SVG (gradient + pattern sisik), kepala dan kaki memakai aset `ular.png` / `tangga.png`. |
| 🏆 **Leaderboard langsung** | Peringkat semua pemain beserta selisih posisi, diperbarui tiap giliran. |
| 📜 **Riwayat gerakan** | 12 gerakan terakhir (melangkah, naik tangga, digigit ular, melewati 100). |
| 💡 **Tooltip papan** | Arahkan kursor ke kotak ular/tangga/finish untuk melihat informasi kotak tersebut. |
| 🎮 **Petunjuk bermain** | Kartu panduan di sidebar untuk pemain baru. |
| 🌓 **Tema terang & gelap** | Tombol toggle di header, pilihan tersimpan di `localStorage`. |
| ⌨️ **Shortcut keyboard** | Tekan `Spasi` untuk melempar dadu. |
| 🎉 **Konfeti + modal kemenangan** | Efek konfeti dan modal beri tema yang senada dengan tema halaman. |
| 📱 **Responsif** | Papan mengikuti lebar container, selalu persegi, dan tidak pernah overflow — dari 320px sampai layar lebar. |
| 🔀 **Switch game** | Berpindah antara Ular Tangga dan WNI Simulator tanpa memuat ulang halaman. |
| 🇮🇩 **WNI Simulator** | Papan keliling seperti board game dengan 10 petak per sisi, ekonomi bansos, properti/sewa, dek Kesempatan dan Dana Umum satir, penyitaan, AI, dan permainan sampai tersisa satu pemain. |

---

## 🚀 Cara Menjalankan

### Cara 1 — Buka langsung (paling cepat)

Klik dua kali `index.html`, atau buka di browser:

```
file:///C:/laragon/www/ulartangga/index.html
```

> ⚠️ Karena memakai CDN (jQuery, SweetAlert2, Google Fonts), mode ini butuh koneksi internet.

### Cara 2 — Server lokal (disarankan)

Jika sudah memakai **Laragon**, folder `www/ulartangga` otomatis menjadi document root,
cukup buka:

```
http://localhost/ulartangga
```

Atau jalankan server statis dari root proyek:

```bash
# Python
python -m http.server 8080
# buka http://localhost:8080

# PHP (Laragon sudah menyediakan)
php -S localhost:8080
```

---

## 🎯 Aturan Main — Ular Tangga

1. Pilih mode: **2 Pemain**, **4 Pemain**, atau **Vs AI**.
2. Klik **Lempar Dadu** (atau tekan `Spasi`) untuk mengundi 2 dadu.
3. Jumlah kedua dadu ditambahkan ke posisi pemain.
4. Jika mendarat di **kepala ular**, pemain turun mengikuti ular.
5. Jika mendarat di **kaki tangga**, pemain naik mengikuti tangga.
6. Jika **melewati** kotak 100, pemain tidak bergerak dan muncul notifikasi.
7. Pemain pertama yang mencapai **kotak 100** menang.

## 🇮🇩 Aturan Main — WNI Simulator

1. Gunakan tombol **WNI Simulator** di header, lalu pilih **2 Pemain**, **4 Pemain**, atau **Vs AI**.
2. Setiap pemain memulai dengan **Rp10.000.000** dan bergantian melempar dua dadu.
3. Saat melewati petak Mulai, pilih **Terima** untuk menerima **Rp500.000**, atau **Batal** untuk melanjutkan tanpa bonus.
4. Saat mendarat di properti kosong, pemain dapat membeli properti. Pemain lain yang mendarat di sana membayar sewa kepada pemilik.
5. Pemain dapat meng-upgrade properti miliknya kapan saja dari daftar aset: maksimal **3 tingkat**, tiap tingkat berbiaya **50% dari harga beli awal**, dan sewa menjadi **2× lipat per tingkat**. Upgrade menambah nilai aset bersih; bangunan ditandai di papan.
6. Papan WNI berbentuk **jalur keliling seperti sebelumnya**: 10 petak di tiap sisi (36 petak total karena petak sudut dipakai bersama), dengan area tengah tetap terbuka. Jalur dimulai dari START di sudut kiri bawah dan berjalan mengelilingi papan.
7. Kartu **Kesempatan** dan **Dana Umum** membahas biaya hidup, MBG, Kopdes Merah Putih, dana haji, pajak, upah, dugaan korupsi, isu ijazah, dan proses pidana, perdata, serta tata negara. Skenarionya satir dan fiktif, bukan klaim tentang perkara nyata atau orang tertentu; dampaknya bisa menambah atau mengurangi saldo.
8. Saldo yang tidak cukup untuk membayar kewajiban menyebabkan pemain bangkrut dan gugur. Jika tersisa satu pemain, pemain itu menang.
9. Permainan tidak memiliki batas putaran. Pemain terakhir yang belum bangkrut menjadi pemenang; saldo dan kekayaan bersih tetap ditampilkan sebagai informasi.
10. Progres WNI Simulator disimpan otomatis di browser yang sama dan dipulihkan setelah halaman dimuat ulang. Termasuk status upgrade dan modal upgrade yang sedang berjalan. Tombol reset menghapus simpanan tersebut.

Bentuk jalur keliling mengambil inspirasi dari format board game roll-and-move yang dibahas
[artikel RRI](https://rri.co.id/padang/hobi/2786368/mencoba-sensasi-bertahan-hidup-lewat-gim-wni-simulator)
dan [situs WNI Simulator](https://wnisimulator.hecticholic.id/#box). Nama petak, tampilan, dan
efek kartu di implementasi ini merupakan konten orisinal untuk versi web, bukan salinan artwork
papan fisik.

---

## 🗺️ Struktur Papan

Papan Ular Tangga berisi **100 kotak** dengan susunan zigzag:

- Baris paling bawah (1–10):  `1 → 10` (mulai di kiri bawah)
- Baris berikutnya (11–20):   `20 → 11`
- Baris (21–30):              `21 → 30`
- …dan seterusnya bergantian, sampai baris `100 → 91` di atas.

Posisi ular dan tangga (lihat `js/config.js`):

| Tipe | Posisi | Tujuan |
| --- | --- | --- |
| 🐍 Ular | 99 → 54 | Turun besar |
| 🐍 Ular | 70 → 55 | Turun sedang |
| 🐍 Ular | 52 → 29 | Turun sedang |
| 🐍 Ular | 25 → 2 | Turun besar |
| 🪜 Tangga | 3 → 22 | Naik |
| 🪜 Tangga | 8 → 26 | Naik |
| 🪜 Tangga | 20 → 41 | Naik |
| 🪜 Tangga | 57 → 83 | Naik |

Kotak diberi class otomatis dengan memeriksa apakah nomor muncul sebagai key maupun value
dari `CONFIG.SNAKES` / `CONFIG.LADDERS`: `snake-head`, `snake-tail`, `ladder-bottom`, `ladder-top`.

---

## 📁 Struktur Proyek

```
ulartangga/
├── index.html              # Struktur halaman (markup saja)
├── css/
│   └── styles.css          # Seluruh styling: design tokens, layout, komponen
├── js/
│   ├── config.js           # Konstanta & konfigurasi permainan
│   ├── state.js            # State management
│   ├── utils.js            # DOM helpers & fungsi pendukung
│   ├── board.js            # Pembuatan papan & gambar SVG ular/tangga
│   ├── render.js           # Seluruh fungsi render UI
│   ├── dice.js             # Logika & animasi dadu
│   ├── game.js             # Engine permainan
│   ├── wni.js              # Papan keliling 36 petak, ekonomi, kartu, AI, dan game flow WNI
│   └── main.js             # Event handler & inisialisasi
├── ular.png                # Aset gambar kepala ular
├── tangga.png              # Aset gambar tangga
├── PROJECT_STRUCTURE.md    # Dokumentasi detail tiap file
└── README.md               # Dokumen ini
```

> 📄 Rincian tiap modul, urutan load, dan tips maintenance ada di
> [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

---

## 🛠 Teknologi

| Teknologi | Dipakai untuk |
| --- | --- |
| HTML5 | Struktur halaman |
| CSS3 | Design tokens (`--cell-max`, `--p1-a`, …), Grid, Flexbox, `aspect-ratio`, `color-mix()` |
| jQuery 3.6.0 | DOM manipulation & event handler |
| SweetAlert2 11 | Modal ular/tangga & kemenangan |
| Google Fonts (Outfit) | Typography |

Semua library dimuat dari CDN, tidak ada `package.json` maupun proses bundling.

---

## 🧩 Cara Kerja Kode

Modul dimuat berurutan di `index.html`: modul Ular Tangga (`config` → `state` → `utils` →
`board` → `render` → `dice` → `game`), dilanjutkan `wni.js` dan `main.js` untuk inisialisasi
serta switch game.

### State permainan (`js/state.js`)

```js
players: [1, 1],        // posisi pemain aktif (2 atau 4 pemain)
currentPlayer: 0,       // giliran aktif (0 = pemain 1)
isVsComputer: false,    // mode permainan
started / busy / gameOver
logEntries: []          // riwayat gerakan
```

### Alur satu giliran

```
playTurn()
  ├─ busy = true  → tombol lempar dinonaktifkan
  ├─ rollDice()  → 2 dadu + animasi
  └─ movePlayer(player, total)
       ├─ cek apakah melewati kotak 100 → notifikasi, ganti giliran
       ├─ cek ular / tangga
       │    └─ animateMove()  → langkah demi langkah (260ms/kotak)
       │         └─ slide cepat ke kotak tujuan, baru tampilkan modal
       └─ finishMovement()
            ├─ mencapai 100 → menang + konfeti
            └─ nextTurn() → render() seluruh UI
                 └─ mode AI & giliran AI → otomatis lempar setelah 900ms
```

### Fungsi penting

| Fungsi | File | Tanggung jawab |
| --- | --- | --- |
| `buildBoard()` | `board.js` | Generate 100 sel grid dengan pola zigzag. |
| `drawLinks()` | `board.js` | Menggambar SVG ular & tangga sesuai posisi sel (dihitung ulang saat resize). |
| `getCellTooltip()` | `board.js` | Teks tooltip untuk sel ular/tangga/finish. |
| `render()` | `render.js` | Master render: pemain, leaderboard, token, giliran, kontrol. |
| `renderTokens()` | `render.js` | Memindahkan token pemain ke sel yang sesuai. |
| `highlightActiveCell()` | `render.js` | Memberi sorotan pada sel pemain yang sedang bermain. |
| `rollDice()` | `dice.js` | Mengundi 2 dadu dengan animasi goyang. |
| `animateMove()` | `game.js` | Menampilkan gerakan pemain kotak per kotak. |
| `finishMovement()` | `game.js` | Finalisasi gerakan: menang / modal ular-tangga / ganti giliran. |
| `nextTurn()` | `game.js` | Menggeser giliran, memicu giliran AI. |

---

## 🎨 Catatan Tampilan

- **Design tokens** — warna, radius, dan ukuran dikumpulkan di `:root` sehingga mudah dituning
  untuk tema terang maupun gelap.
- **Papan responsif** — papan memakai `grid-template-columns: repeat(10, minmax(0, 1fr))`
  plus `aspect-ratio: 1`, jadi selalu persegi dan mengikuti lebar container tanpa overflow
  (aman dari 320px sampai 1920px).
- **Ilustrasi di antara sel** — ular & tangga digambar pada layer sendiri (`#boardLinks` SVG dan
  `#boardDecor`), sementara nomor sel diberi `z-index` lebih tinggi agar tetap terbaca.
- **Angka dadu** — pip memakai named grid areas (`tl`, `c`, `br`, …) agar wajah dadu
  1–6 tergambar akurat.
- **Tooltip** — memakai `data-tip` + `::after`/`::before` dan hanya aktif di perangkat
  yang mendukung hover, serta tidak menambah lebar halaman.
- **Aksesibilitas** — board memakai `role="grid"`, sel `role="gridcell"`, tombol punya
  `aria-label`/`aria-pressed`, dan animasi dimatikan bila `prefers-reduced-motion` aktif.

---

## 🎮 Kontrol Git

| Kontrol | Kegunaan |
| --- | --- |
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `style:` | Perubahan tampilan saja |
| `docs:` | Perubahan dokumentasi |
| `refactor:` | Refactoring tanpa mengubah perilaku |

Contoh:

```bash
git add index.html css js README.md
git commit -m "fix: repair dice pips and board overflow"
```

---

## 📄 Lisensi

Dibuat oleh **© 2025 Amirul Putra Justicia**. Bebas digunakan dan dimodifikasi.

---

<div align="center">

**© 2025 Amirul Putra Justicia — Snake 'n Ladder**

</div>
