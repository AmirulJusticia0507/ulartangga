# Struktur Proyek Ular Tangga

Proyek ini telah dipecah menjadi komponen-komponen modular untuk kemudahan maintenance dan readability.

## Struktur Folder

```
ulartangga/
├── index.html              # File HTML utama (clean, hanya struktur)
├── css/
│   └── styles.css          # Semua styling (design tokens, layouts, components)
├── js/
│   ├── config.js           # Konfigurasi & konstanta game
│   ├── state.js            # State management
│   ├── utils.js            # Utility functions & DOM helpers
│   ├── board.js            # Board generation & SVG drawing
│   ├── render.js           # UI rendering functions
│   ├── dice.js             # Dice logic & animation
│   ├── game.js             # Game engine & logic
│   └── main.js             # Event handlers & initialization
├── ular.png                # Asset gambar ular
└── tangga.png              # Asset gambar tangga
```

## Deskripsi File

### HTML
- **index.html**: Struktur HTML yang bersih, hanya berisi markup tanpa inline CSS atau JS

### CSS
- **css/styles.css**: Mengandung:
  - Design tokens (warna, spacing, border-radius)
  - Theme (dark/light mode)
  - Layout components
  - Board styling
  - Sidebar components
  - Button & control styling
  - Animation keyframes

### JavaScript Modules

#### config.js
Menyimpan semua konfigurasi permainan:
- `BOARD_SIZE`: Ukuran papan (100 kotak)
- `COLS / ROWS`: Dimensi grid (10x10)
- `STEP_MS`: Durasi animasi langkah
- `AI_DELAY`: Delay AI sebelum berturn
- `SNAKES`: Posisi kepala & ekor ular
- `LADDERS`: Posisi bawah & atas tangga

#### state.js
State management permainan:
- `players`: Posisi kedua pemain
- `currentPlayer`: Index pemain yang aktif
- `isVsComputer`: Flag mode AI
- `started`, `busy`, `gameOver`: Status game
- `logEntries`: History gerakan
- Helper methods: `reset()`, `resetGame()`

#### utils.js
Utility functions & DOM helpers:
- `DOM`: Kumpulan jQuery selectors untuk elemen penting
- `playerName()`: Dapatkan nama pemain
- `playerIcon()`: Dapatkan emoji pemain
- `playerVar()`: Dapatkan CSS color variables
- `toast()`: Tampilkan notifikasi
- `addLog()`: Tambah entry ke history
- `celebrate()`: Tampilkan confetti animation
- `cellClass()`: Dapatkan class CSS untuk cell

#### board.js
Board generation & visualization:
- `buildBoard()`: Generate HTML grid 10x10 dengan zigzag pattern
- `cellCenter()`: Hitung koordinat center dari cell
- `drawLinks()`: Draw SVG untuk ular & tangga dengan SVG gradients

#### render.js
UI rendering functions:
- `renderPlayers()`: Render player info & progress bar
- `renderLeaderboard()`: Render leaderboard
- `renderTokens()`: Update posisi token pemain
- `highlightActiveCell()`: Highlight cell pemain aktif
- `renderTurn()`: Update turn badge info
- `renderControls()`: Update button states
- `render()`: Master render function (panggil semua render functions)

#### dice.js
Dice logic & visualization:
- `PIPS`: Mapping posisi pip untuk nilai 1-6
- `pipHtml()`: Generate HTML pip berdasarkan nilai
- `showDice()`: Display dadu dengan nilai tertentu
- `rollDice()`: Roll dadu dengan animasi shake

#### game.js
Game engine & logic:
- `finishMovement()`: Finalisasi gerakan pemain
- `animateMove()`: Animasi gerakan step-by-step
- `movePlayer()`: Hitung & proses gerakan (snake/ladder handling)
- `nextTurn()`: Lanjut ke giliran berikutnya (with AI support)
- `playTurn()`: Execute turn: roll dice + move
- `startGame()`: Mulai game baru
- `resetGame()`: Reset game ke state awal

#### main.js
Event handlers & initialization:
- Event listeners untuk buttons
- Theme toggle handler
- Keyboard shortcuts (spacebar to roll)
- Window resize handler (redraw SVG)
- Theme persistence (localStorage)
- Initialization flow

## Load Order

Script harus diload dengan urutan ini (sudah benar di index.html):
1. config.js → 2. state.js → 3. utils.js → 4. board.js → 5. render.js → 6. dice.js → 7. game.js → 8. main.js

Ini penting karena setiap module bergantung pada yang sebelumnya.

## Maintenance Tips

### Menambah feature baru:
1. Jika butuh konfigurasi baru → edit `config.js`
2. Jika butuh state baru → edit `state.js`
3. Jika butuh styling baru → edit `css/styles.css`
4. Jika butuh render UI baru → edit `render.js`
5. Jika butuh event handler → edit `main.js`

### Bug fixing:
- Game logic issues → check `game.js`
- Rendering issues → check `render.js`
- Board issues → check `board.js`
- Styling issues → check `css/styles.css`

### Performance optimization:
- Minimize re-renders: group updates di `render()`
- Cache DOM selectors: sudah done di `utils.js` → `DOM` object
- Use CSS animations: prefer CSS over JS untuk animations

## Dependencies

- jQuery 3.6.0 (CDN)
- SweetAlert2 (CDN untuk modal dialog)
- Font: Outfit (Google Fonts)

Semua dependencies dimuat melalui CDN di `index.html` sebelum modular scripts diload.
