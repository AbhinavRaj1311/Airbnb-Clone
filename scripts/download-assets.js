/**
 * StayGallery — Multi-Property Download Script
 * Downloads cover + gallery images for all 16 properties
 * Each property gets its own folder: images/listings/property-XXX/
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, '..', 'client', 'public', 'images', 'listings');

// Property image sets — carefully curated Unsplash photos per category
const PROPERTIES = [
  {
    id: 'property-001',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-002',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-003',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-004',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1620626011761-996317702a9b?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-005',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-006',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-007',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1518780664697-55537acab1dc?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-008',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1560185008-a33f5c7b1844?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1486304873000-235643847519?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-009',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-010',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-011',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1600210491892-03d54741b0b6?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-012',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1602002418082-a4443978a5af?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-013',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-014',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1560185008-a33f5c7b1844?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-015',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1553653924-39b70295f8da?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=700&h=500&fit=crop&q=80' },
    ]
  },
  {
    id: 'property-016',
    images: [
      { file: 'cover.jpg', url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&h=600&fit=crop&q=85' },
      { file: '2.jpg',     url: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=700&h=500&fit=crop&q=80' },
      { file: '3.jpg',     url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&h=500&fit=crop&q=80' },
      { file: '4.jpg',     url: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=700&h=500&fit=crop&q=80' },
      { file: '5.jpg',     url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&h=500&fit=crop&q=80' },
    ]
  },
];

// Host avatars
const HOST_AVATARS = [
  { file: 'host-001.jpg', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=85' },
  { file: 'host-002.jpg', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=85' },
  { file: 'host-003.jpg', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=85' },
  { file: 'host-004.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=85' },
  { file: 'host-005.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=85' },
  { file: 'host-006.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=85' },
];

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    const file = fs.createWriteStream(dest);
    const req = protocol.get(url, { headers: { 'User-Agent': 'StayGallery/1.0' }, timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        if (size < 2000) { fs.unlinkSync(dest); return reject(new Error(`Too small: ${size}b`)); }
        resolve(size);
      });
    });
    req.on('error', e => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  console.log('🏠 StayGallery Multi-Property Asset Downloader\n');
  const hostsDir = path.join(__dirname, '..', 'client', 'public', 'images', 'hosts');
  ensureDir(hostsDir);

  let total = 0, done = 0, failed = 0;

  // Download host avatars
  for (const h of HOST_AVATARS) {
    const dest = path.join(hostsDir, h.file);
    total++;
    if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) { done++; console.log(`✓ ${h.file}`); continue; }
    try {
      const size = await downloadFile(h.url, dest);
      done++; console.log(`⬇ ${h.file} (${Math.round(size/1024)}KB)`);
      await new Promise(r => setTimeout(r, 150));
    } catch(e) { failed++; console.log(`✗ ${h.file}: ${e.message}`); }
  }

  // Download property images
  for (const prop of PROPERTIES) {
    const propDir = path.join(BASE_DIR, prop.id);
    ensureDir(propDir);
    for (const img of prop.images) {
      const dest = path.join(propDir, img.file);
      total++;
      if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
        done++; console.log(`✓ ${prop.id}/${img.file}`); continue;
      }
      try {
        const size = await downloadFile(img.url, dest);
        done++; console.log(`⬇ ${prop.id}/${img.file} (${Math.round(size/1024)}KB)`);
        await new Promise(r => setTimeout(r, 200));
      } catch(e) {
        failed++;
        console.log(`✗ ${prop.id}/${img.file}: ${e.message}`);
        // Try to copy cover as fallback
        const cover = path.join(propDir, 'cover.jpg');
        if (img.file !== 'cover.jpg' && fs.existsSync(cover)) {
          fs.copyFileSync(cover, dest);
          done++;
          console.log(`  ↩ Used cover as fallback`);
        }
      }
    }
  }

  console.log(`\n✅ Done: ${done}/${total} | Failed: ${failed}`);
}

main().catch(console.error);
