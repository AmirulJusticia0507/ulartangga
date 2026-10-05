/**
 * STATE MANAGEMENT
 * File ini mengelola seluruh state permainan
 */

const STATE = {
  // Posisi pemain [pemain1, pemain2]
  players: [1, 1],

  // Index pemain yang sedang bermain (0 atau 1)
  currentPlayer: 0,

  // Mode permainan
  isVsComputer: false,

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
    this.started = false;
    this.busy = false;
    this.gameOver = false;
    this.logEntries = [];
  },

  // Reset hanya untuk permainan baru
  resetGame() {
    this.players = [1, 1];
    this.currentPlayer = 0;
    this.started = false;
    this.busy = false;
    this.gameOver = false;
    this.logEntries = [];
  }
};
