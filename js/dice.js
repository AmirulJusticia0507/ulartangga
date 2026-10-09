/**
 * DICE ENGINE
 * File ini menangani logika dan rendering dadu
 */

/**
 * Mapping pip positions untuk setiap nilai dadu
 */
const PIPS = {
  1: ['c'],
  2: ['tl', 'br'],
  3: ['tl', 'c', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br']
};

/**
 * Generate HTML untuk pip berdasarkan nilai
 */
function pipHtml(value) {
  if (!value) return '';
  return PIPS[value].map((a) => `<span class="pip" style="grid-area:${a}"></span>`).join('');
}

/**
 * Tampilkan dadu dengan nilai tertentu
 */
function showDice(d1, d2) {
  const idle = !d1 && !d2;
  [DOM.$die1, DOM.$die2].forEach(($d, i) => {
    const v = i === 0 ? d1 : d2;
    $d.toggleClass('is-idle', idle).html(pipHtml(v));
    $d.attr('aria-label', idle
      ? `Dadu ${i + 1} belum dilempar`
      : `Dadu ${i + 1} menunjukkan ${v}`);
  });
  DOM.$totalDice.text(d1 ? d1 + d2 : '—');
}

/**
 * Roll dadu dengan animasi
 */
function rollDice() {
  const $d1 = DOM.$die1, $d2 = DOM.$die2;
  $d1.add($d2).removeClass('is-idle').addClass('rolling');
  $d1.add($d2).attr('aria-busy', 'true');
  return new Promise((resolve) => {
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      $d1.add($d2).removeClass('rolling');
      showDice(d1, d2);
      $d1.add($d2).removeAttr('aria-busy');
      resolve(d1 + d2);
    }, STATE.reduceMotion ? 60 : 520);
  });
}
