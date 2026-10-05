/**
 * KONFIGURASI GAME
 * File ini berisi semua konstanta dan konfigurasi permainan
 */

const CONFIG = {
  // Ukuran Papan
  BOARD_SIZE: 100,
  COLS: 10,
  ROWS: 10,

  // Timing
  STEP_MS: 260,
  AI_DELAY: 900,

  // Entities - Ular
  SNAKES: {
    99: 54,
    70: 55,
    52: 29,
    25: 2
  },

  // Entities - Tangga
  LADDERS: {
    3: 22,
    8: 26,
    20: 41,
    57: 83
  }
};
