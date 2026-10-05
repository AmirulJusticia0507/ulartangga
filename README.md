# 🎲 Game Ular Tangga (Snake 'n Ladder)

Permainan ular tangga versi web modern. Dua pemain (`Player 1` vs `Player 2`) atau melawan
AI Computer, bermain di papan 100 kotak hingga ada yang mendarat tepat di kotak 100.

> Proyek ini hanya terdiri dari satu file HTML — tidak ada build step, tidak ada backend.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Cara Menjalankan](#-cara-menjalankan)
- [Aturan Main](#-aturan-main)
- [Struktur Papan](#-struktur-papan)
- [Struktur Proyek](#-struktur-proyek)
- [Teknologi](#-teknologi)
- [Cara Kerja Kode](#-cara-kerja-kode)
- [Rencana Modernisasi UI](#-rencana-modernisasi-ui)
- [Kontrol Git](#-kontrol-git)

---

## ✨ Fitur

| Fitur | Keterangan |
| --- | --- |
| 🧑‍🤝‍🧑 **Mode Player vs Player** | Dua pemain bergantian melempar dadu di perangkat yang sama. |
| 🤖 **Mode Versus AI** | Lawan dikendalikan AI, bergerak otomatis setelah giliran pemain pertama. |
| 🎲 **Dua dadu** | Setiap giliran melempar 2 dadu, jumlah nilai menentukan langkah. |
| 🐍 **Ular** | Pemain yang mendarat di kepala ular turun mengikuti posisi ular. |
| 🪜 **Tangga** | Pemain yang mendarat di kaki tangga naik mengikuti posisi tangga. |
| 🏆 **Leaderboard langsung** | Peringkat kedua pemain diperbarui setiap langkah. |
| 🔄 **Reset game** | Mengembalikan papan, giliran, dan skor ke kondisi awal. |
| 🎬 **Animasi langkah** | Pemain bergerak kotak per kotak dengan jeda 300ms. |

---

## 🚀 Cara Menjalankan

Proyek ini statis, jadi tidak ada proses install. Pilih salah satu:

### Cara 1 — Buka langsung (paling cepat)

Klik dua kali `index.html`, atau buka di browser:

```
file:///C:/laragon/www/ulartangga/index.html
```

> ⚠️ Karena memakai CDN (Bootstrap, jQuery, SweetAlert2), mode ini butuh koneksi internet.

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

## 🎯 Aturan Main

1. Pilih mode: **Player 1 vs Player 2** atau **Versus AI**.
2. Klik **🎲 Lempar Dadu** untuk mengundi 2 dadu.
3. Jumlah kedua dadu ditambahkan ke posisi pemain.
4. Jika mendarat di **kepala ular**, pemain turun mengikuti ular.
5. Jika mendarat di **kaki tangga**, pemain naik mengikuti tangga.
6. Jika **melewati** kotak 100, pemain tidak boleh bergerak (giliran terbuang).
7. Pemain pertama yang mencapai **kotak 100** menang.

---

## 🗺️ Struktur Papan

Papan berisi **100 kotak** dengan susunan zigzag (baris alternating arah, seperti ular tangga asli):

- Baris 1 (1–10):  `→`
- Baris 2 (11–20): `←`
- Baris 3 (21–30): `→`
- …dan seterusnya bergantian.

Posisi ular dan tangga (lihat `index.html`):

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

Penandaan kotak (`snake-head`, `snake-tail`, `ladder-bottom`, `ladder-top`) dilakukan
otomatis dengan memeriksa apakah nomor kotak muncul sebagai key maupun value dari object
`snakes` / `ladders`.

---

## 📁 Struktur Proyek

```
ulartangga/
├── index.html   # Seluruh aplikasi (HTML + CSS + JS inline)
├── ular.png     # Aset gambar ular
├── tangga.png   # Aset gambar tangga
└── README.md    # Dokumentasi ini
```

> ℹ️ `ular.png` dan `tangga.png` sudah tersedia namun saat ini belum dipakai —
> papan masih merender ikon lewat CSS `content` (emoji).

---

## 🛠 Teknologi

| Teknologi | Versi | Dipakai untuk |
| --- | --- | --- |
| HTML5 | — | Struktur halaman |
| CSS3 (Grid + Flexbox) | — | Layout papan & panel |
| jQuery | 3.6.0 | DOM manipulation & event handler |
| Bootstrap | 5.3.0 | Utility class dasar |
| SweetAlert2 | 11 | Modal interaksi (ular/tangga & kemenangan) |
| Vanilla JS | — | Logika permainan |

Semua library dimuat dari CDN, tidak ada `package.json` maupun proses bundling.

---

## 🧩 Cara Kerja Kode

Semua logika berada di dalam satu `<script>` yang dibungkus `$(document).ready()`.

### State permainan

```js
const boardSize = 100;
const snakes  = { 99: 54, 70: 55, 52: 29, 25: 2 };
const ladders = { 3: 22, 8: 26, 20: 41, 57: 83 };
let players = [1, 1];      // posisi pemain 1 & 2
let currentPlayer = 0;     // giliran aktif (0 = pemain 1, 1 = pemain 2)
let isVsComputer = false;  // mode permainan
```

### Alur satu giliran

```
rollDiceAndMove()
  ├─ lempar 2 dadu → dice1, dice2
  ├─ tampilkan di UI (#diceContainer, #totalDice)
  ├─ movePlayer(currentPlayer, total)
  │    ├─ hitung steps[] (kotak per kotak)
  │    ├─ cek ular / tangga → finalPosition
  │    └─ animateMove() → 300ms per langkah
  ├─ updateLeaderboard()
  └─ giliran berikutnya
       └─ bila mode AI & giliran AI → setTimeout 1000ms → otomatis lempar
```

### Fungsi penting

| Fungsi | Tanggung jawab |
| --- | --- |
| `animateMove(player, newPosition, steps)` | Menampilkan pemain bergerak kotak demi kotak sampai posisi akhir. |
| `movePlayer(player, diceValue)` | Menghitung posisi baru, memeriksa ular/tangga, memicu animasi. |
| `rollDiceAndMove()` | Mengundi dadu, menjalankan giliran, menggeser giliran. |
| `updatePlayerIcon(player)` | Memindahkan ikon pemain ke kotak yang sesuai. |
| `updateLeaderboard()` | Mengurutkan pemain berdasarkan posisi dan merender daftar. |
| `$('#resetGame').click()` | Mengembalikan semua state ke awal. |

---

## 🎨 Rencana Modernisasi UI

Catatan untuk tahap berikutnya.

**Masalah pada tampilan saat ini**

- Warna hardcoded, kontras rendah, dan gaya masih "dasar".
- Papan berukuran tetap (`50px`) sehingga tidak responsif di layar kecil.
- Tidak ada penanda yang jelas untuk giliran pemain yang aktif.
- Visual ular & tangga masih berupa emoji, belum memakai `ular.png` / `tangga.png`.
- Banyak atribut `style="..."` inline pada HTML, sulit dipelihara.

**Target arah**

- Design token melalui CSS custom properties (`--color-*`, `--radius-*`, `--shadow-*`).
- Papan responsif memakai `clamp()` atau `aspect-ratio`.
- Panel samping yang menyatukan dadu, giliran, dan leaderboard dalam satu kartu.
- Penanda giliran aktif dengan sorotan (glow) pada kotak pemain.
- Typography & spacing yang konsisten, plus dukungan dark mode via `prefers-color-scheme`.
- Mengganti ikon emoji dengan aset gambar yang tersedia.

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
git add index.html README.md
git commit -m "feat: modernize game UI"
```

---

## 📄 Lisensi

Dibuat oleh **© 2025 Amirul Putra Justicia**. Bebas digunakan dan dimodifikasi.

---

<div align="center">

**© 2025 Amirul Putra Justicia — Snake 'n Ladder**

</div>
