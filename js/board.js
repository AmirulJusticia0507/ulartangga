/**
 * BOARD MANAGEMENT
 * File ini mengelola pembuatan dan rendering papan permainan
 */

/**
 * Bangun struktur HTML papan (grid 10x10 dengan zigzag pattern)
 */
function buildBoard() {
  let html = '';
  for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
    const start = row * CONFIG.COLS + 1;
    for (let i = 0; i < CONFIG.COLS; i++) {
      const n = row % 2 === 0 ? start + i : start + CONFIG.COLS - 1 - i;
      const classes = [cellClass(n)];
      if (row % 2 === 1) classes.push('alt');
      if (n === 1) classes.push('start-cell');
      if (n === CONFIG.BOARD_SIZE) classes.push('goal-cell');
      html += `<div class="cell ${classes.join(' ').trim()}" id="cell${n}" role="gridcell"><span class="cell__num">${n}</span></div>`;
    }
  }
  DOM.$board.html(html);

  // Tambahkan token pemain
  DOM.$board.append(
    `<div class="token token--0" id="token0" style="top:2%; background:linear-gradient(140deg, var(--p1-a), var(--p1-b))" aria-hidden="true">🚗</div>`,
    `<div class="token token--1" id="token1" style="top:2%; background:linear-gradient(140deg, var(--p2-a), var(--p2-b))" aria-hidden="true">🏍️</div>`
  );
}

/**
 * Dapatkan koordinat center dari cell
 */
function cellCenter(n) {
  const rect = DOM.$cell(n)[0].getBoundingClientRect();
  const wrapRect = DOM.$wrap[0].getBoundingClientRect();
  return {
    x: rect.left - wrapRect.left + rect.width / 2,
    y: rect.top - wrapRect.top + rect.height / 2,
    size: rect.width
  };
}

/**
 * Gambar SVG links untuk ular dan tangga, serta dekorasi
 */
function drawLinks() {
  const wrapRect = DOM.$wrap[0].getBoundingClientRect();
  if (!wrapRect.width) return;

  DOM.$svg.attr('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);

  const defs = `
    <defs>
      <linearGradient id="snakeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--green-a)"/>
        <stop offset="100%" stop-color="var(--green-b)"/>
      </linearGradient>
      <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--wood-a)"/>
        <stop offset="100%" stop-color="var(--wood-b)"/>
      </linearGradient>
    </defs>`;

  let paths = '';
  let decor = '';

  // --- Tangga ---
  Object.entries(CONFIG.LADDERS).forEach(([footStr, topStr]) => {
    const foot = cellCenter(+footStr);
    const top  = cellCenter(+topStr);
    const dx = top.x - foot.x, dy = top.y - foot.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;                 // unit tegak lurus
    const half = len * 0.16;
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;

    const railW = len * 0.075;
    const rungW = len * 0.055;
    const rungs = Math.max(3, Math.round(len / (foot.size * 0.34)));

    const rail = (sign) => {
      const x1 = foot.x + px * half * sign, y1 = foot.y + py * half * sign;
      const x2 = top.x  + px * half * sign, y2 = top.y  + py * half * sign;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                stroke="var(--wood-edge)" stroke-width="${railW}" stroke-linecap="round"/>
              <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                stroke="url(#woodGrad)" stroke-width="${railW * 0.66}" stroke-linecap="round"/>`;
    };

    let rungsSvg = '';
    for (let i = 1; i < rungs; i++) {
      const t = i / rungs;
      const cx = foot.x + dx * t, cy = foot.y + dy * t;
      rungsSvg += `<line x1="${cx - px * half}" y1="${cy - py * half}" x2="${cx + px * half}" y2="${cy + py * half}"
                    stroke="var(--wood-edge)" stroke-width="${rungW}" stroke-linecap="round"/>
                  <line x1="${cx - px * half}" y1="${cy - py * half}" x2="${cx + px * half}" y2="${cy + py * half}"
                    stroke="url(#woodGrad)" stroke-width="${rungW * 0.7}" stroke-linecap="round"/>`;
    }

    paths += rail(1) + rail(-1) + rungsSvg;

    decor += `<div class="ladder-img" style="
      left:${(foot.x + top.x) / 2}px; top:${(foot.y + top.y) / 2}px;
      width:${len * 0.62}px; height:${len * 0.62 * 1.575}px;
      transform:translate(-50%,-50%) rotate(${angle}deg); opacity:.9"></div>`;
  });

  // --- Ular ---
  Object.entries(CONFIG.SNAKES).forEach(([headStr, tailStr]) => {
    const head = cellCenter(+headStr);
    const tail = cellCenter(+tailStr);
    const dx = tail.x - head.x, dy = tail.y - head.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;    // tegak lurus
    const bow = len * 0.16;
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    const body = head.size * 0.3;

    const c1x = head.x + dx * 0.28 + px * bow, c1y = head.y + dy * 0.28 + py * bow;
    const c2x = head.x + dx * 0.72 - px * bow, c2y = head.y + dy * 0.72 - py * bow;

    const d = `M ${head.x} ${head.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tail.x} ${tail.y}`;

    paths += `<path d="${d}" fill="none" stroke="var(--green-edge)" stroke-width="${body}" stroke-linecap="round"/>
              <path d="${d}" fill="none" stroke="url(#snakeGrad)" stroke-width="${body * 0.72}" stroke-linecap="round"/>
              <path d="${d}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="${body * 0.72}"
                    stroke-dasharray="${body * 0.34} ${body * 0.5}" stroke-linecap="butt" opacity=".55"/>`;

    decor += `<div class="snake-img" style="
      left:${head.x}px; top:${head.y}px;
      width:${head.size * 0.52}px; height:${head.size * 1.04}px;
      transform:translate(-50%,-50%) rotate(${angle}deg)"></div>
      <div class="snake-img" style="
      left:${tail.x}px; top:${tail.y}px;
      width:${head.size * 0.4}px; height:${head.size * 0.8}px;
      transform:translate(-50%,-50%) rotate(${angle + 180}deg); opacity:.85"></div>`;
  });

  DOM.$svg.html(defs + paths);
  DOM.$decor.html(decor);
}
