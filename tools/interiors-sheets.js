'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = path.join(__dirname, '..', 'docs/interiors');
const rooms = ['house', 'arcade', 'cafe', 'pets', 'soccer', 'builder'];
const titles = {
  house: 'House  ·  pick one',
  arcade: 'Arcade  ·  pick one',
  cafe: 'Cafe  ·  pick one',
  pets: 'Pet lounge  ·  pick one',
  soccer: 'Soccer shop  ·  pick one',
  builder: 'Builder HQ  ·  pick one'
};

function decode(file) {
  const d = fs.readFileSync(file);
  let pos = 8, w = 0, h = 0, color = 2, idat = Buffer.alloc(0);
  while (pos < d.length) {
    const n = d.readUInt32BE(pos);
    const typ = d.slice(pos + 4, pos + 8).toString();
    const chunk = d.slice(pos + 8, pos + 8 + n);
    if (typ === 'IHDR') { w = chunk.readUInt32BE(0); h = chunk.readUInt32BE(4); color = chunk[9]; }
    else if (typ === 'IDAT') idat = Buffer.concat([idat, chunk]);
    else if (typ === 'IEND') break;
    pos += 12 + n;
  }
  const raw = zlib.inflateSync(idat);
  const bpp = color === 2 ? 3 : 4;
  const stride = w * bpp;
  const rows = [];
  let i = 0;
  let prev = Buffer.alloc(stride);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : (pb <= pc ? b : c);
  };
  for (let y = 0; y < h; y++) {
    const f = raw[i++];
    const row = Buffer.from(raw.slice(i, i + stride));
    i += stride;
    if (f === 1) for (let x = 0; x < stride; x++) row[x] = (row[x] + (x >= bpp ? row[x - bpp] : 0)) & 255;
    else if (f === 2) for (let x = 0; x < stride; x++) row[x] = (row[x] + prev[x]) & 255;
    else if (f === 3) for (let x = 0; x < stride; x++) row[x] = (row[x] + (((x >= bpp ? row[x - bpp] : 0) + prev[x]) >> 1)) & 255;
    else if (f === 4) for (let x = 0; x < stride; x++) row[x] = (row[x] + paeth(x >= bpp ? row[x - bpp] : 0, prev[x], x >= bpp ? prev[x - bpp] : 0)) & 255;
    prev = row;
    rows.push(row);
  }
  return { w, h, bpp, rows };
}

function encode(w, h, put) {
  const stride = w * 3;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const p = put(x, y);
      const o = y * (stride + 1) + 1 + x * 3;
      raw[o] = p[0]; raw[o + 1] = p[1]; raw[o + 2] = p[2];
    }
  }
  const idat = zlib.deflateSync(raw);
  function chunk(type, data) {
    const t = Buffer.from(type);
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    const c = zlib.crc32 ? zlib.crc32(Buffer.concat([t, data])) : crc32(Buffer.concat([t, data]));
    crc.writeUInt32BE(c >>> 0);
    return Buffer.concat([len, t, data, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

const GLYPH = {
  A: '01110 10001 10001 11111 10001 10001 10001',
  B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111',
  F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111',
  H: '10001 10001 10001 11111 10001 10001 10001',
  I: '11111 00100 00100 00100 00100 00100 11111',
  K: '10001 10010 10100 11000 10100 10010 10001',
  L: '10000 10000 10000 10000 10000 10000 11111',
  N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101',
  R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110',
  ' ': '00000 00000 00000 00000 00000 00000 00000',
  '.': '00000 00000 00000 00000 00000 01100 01100'
};
function titlePixel(text, x, y) {
  const scale = 3;
  const gw = 6 * scale;
  const x0 = 16;
  const y0 = 12;
  if (y < y0 || y >= y0 + 7 * scale) return false;
  const col = Math.floor((x - x0) / gw);
  if (col < 0 || col >= text.length) return false;
  const bits = (GLYPH[text[col]] || GLYPH[' ']).split(' ');
  const row = bits[Math.floor((y - y0) / scale)] || '00000';
  const cx = Math.floor((x - x0 - col * gw) / scale);
  return row[cx] === '1';
}

const W = 1180, H = 820, top = 48, gap = 8;
const cw = Math.floor((W - gap * 3) / 2);
const ch = Math.floor((H - top - gap * 3) / 2);

for (const room of rooms) {
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(room + '-') && f.endsWith('.png') && !f.endsWith('-sheet.png')).sort();
  const pics = files.slice(0, 4).map((f) => decode(path.join(dir, f)));
  const png = encode(W, H, (x, y) => {
    if (y < top) return titlePixel(titles[room].toUpperCase().replace('·', '.'), x, y) ? [233, 255, 242] : [4, 20, 12];
    const col = x < gap + cw ? 0 : 1;
    const row = y < top + gap + ch ? 0 : 1;
    const i = row * 2 + col;
    const x0 = gap + col * (cw + gap);
    const y0 = top + gap + row * (ch + gap);
    if (x < x0 || y < y0 || x >= x0 + cw || y >= y0 + ch || !pics[i]) return [4, 20, 12];
    const pic = pics[i];
    const sx = Math.min(pic.w - 1, Math.floor(((x - x0) / cw) * pic.w));
    const sy = Math.min(pic.h - 1, Math.floor(((y - y0) / ch) * pic.h));
    const o = sx * pic.bpp;
    const r = pic.rows[sy];
    return [r[o], r[o + 1], r[o + 2]];
  });
  fs.writeFileSync(path.join(dir, room + '-sheet.png'), png);
  console.log(room, files.join(','), png.length);
}
