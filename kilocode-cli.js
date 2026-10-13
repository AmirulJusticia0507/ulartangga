#!/usr/bin/env node
/**
 * KILOCODE CLI
 * Penerima masukan dari form footer game Ular Tangga.
 *
 * Cara menjalankan (dari root proyek):
 *   node kilocode-cli.js            # listen di http://localhost:4317
 *   node kilocode-cli.js --port 8080
 *
 * Form footer mengirim POST JSON ke /kilocode. CLI mencetak masukan
 * ke terminal dan menyimpannya ke kilocode-inbox.jsonl.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--')
    ? args[i + 1]
    : fallback;
}

const PORT = Number(argValue('--port', process.env.KILOCODE_PORT || 4317));
const HOST = argValue('--host', '127.0.0.1');
const LOG_FILE = path.join(__dirname, 'kilocode-inbox.jsonl');
const MAX_BODY = 100 * 1024;

function stamp(iso) {
  return new Date(iso).toLocaleString('id-ID', { hour12: false });
}

function printEntry(p) {
  const line = '─'.repeat(46);
  console.log(`\n┌─📥 masukan baru · ${stamp(p.ts)}`);
  console.log(`│ 🎮 game : ${p.game || 'snake'}`);
  console.log(`│ 🔗 url  : ${p.url || '-'}`);
  console.log(`│ 💬 ${String(p.text).replace(/\n/g, ' ')}`);
  console.log(`└─${line}`);
}

function saveEntry(p) {
  fs.appendFile(LOG_FILE, JSON.stringify(p) + '\n', (err) => {
    if (err) console.error('Gagal menyimpan ke ' + LOG_FILE, err.message);
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = req.url.split('?')[0];

  if (req.method === 'POST' && pathname === '/kilocode') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) req.destroy();
    });
    req.on('end', () => {
      let payload;
      try {
        payload = JSON.parse(body);
      } catch (e) {
        payload = { text: String(body).slice(0, 500), ts: new Date().toISOString() };
      }
      if (!payload.text || !String(payload.text).trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'text kosong' }));
        return;
      }
      payload.text = String(payload.text).trim().slice(0, 500);
      payload.ts = payload.ts || new Date().toISOString();
      printEntry(payload);
      saveEntry(payload);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, received: payload.text }));
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('KiloCode CLI aktif. POST JSON ke /kilocode untuk mengirim masukan.\n');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Tidak ditemukan. Gunakan POST /kilocode.\n');
});

server.listen(PORT, HOST, () => {
  console.log('🚀 KiloCode CLI berjalan di http://' + HOST + ':' + PORT);
  console.log('📥 Kirim masukan dari footer game → POST /kilocode');
  console.log('💾 Masukan disimpan ke ' + path.basename(LOG_FILE));
  console.log('Tekan Ctrl+C untuk berhenti.\n');
});
