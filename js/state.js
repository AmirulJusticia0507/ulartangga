/**
 * STATE MANAGEMENT
 * File ini mengelola seluruh state permainan
 */

const STATE = {
  // Posisi seluruh pemain pada papan
  players: [1, 1],

  // Index pemain yang sedang bermain
  currentPlayer: 0,

  // Mode permainan
  isVsComputer: false,
  playerCount: 2,

  // Status permainan
  started: false,
  busy: false,
  gameOver: false,

  // Log riwayat gerakan
  logEntries: [],

  // Reduce motion preference
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  // Reset semua state
  reset() {
    this.players = [1, 1];
    this.currentPlayer = 0;
    this.isVsComputer = false;
    this.playerCount = 2;
    this.started = false;
    this.busy = false;
    this.gameOver = false;
    this.logEntries = [];
  },

  // Reset hanya untuk permainan baru
  resetGame() {
    this.players = [1, 1];
    this.currentPlayer = 0;
    this.playerCount = 2;
    this.started = false;
    this.busy = false;
    this.gameOver = false;
    this.logEntries = [];
  }
};
