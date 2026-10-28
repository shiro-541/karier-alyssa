/* Jejak Langkah Alyssa — mesin buku
   Isi cerita & link lagu ada di content.js */
'use strict';

/* ============ 1. Dasar ============ */
const $ = id => document.getElementById(id);
const book = $('book'), inner = document.querySelector('.inner'), L = $('L'), R = $('R');
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

let P = pages(), i = 0, busy = false, leaf = null, flipDir = 1, photoKey = null;

/* ============ 2. Foto ============ */
function fit(img) {
  const s = img.closest('.slot'), f = img.parentNode;
  if (!s || !img.naturalWidth) return;
  f.classList.add('has');
  const pad = 10, k = Math.min((s.clientWidth - 2 * pad) / img.naturalWidth, (s.clientHeight - 2 * pad) / img.naturalHeight);
  f.style.width = img.naturalWidth * k + 2 * pad + 'px';
  f.style.height = img.naturalHeight * k + 2 * pad + 'px';
}
addEventListener('resize', () => document.querySelectorAll('.slot img').forEach(fit));

const db = new Promise(res => {
  try {
    const q = indexedDB.open('bk', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('p');
    q.onsuccess = () => res(q.result);
    q.onerror = () => res(null);
  } catch (e) { res(null); }
});

$('file').onchange = async e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f || !photoKey) return;
  PH[photoKey] = URL.createObjectURL(f);
  refresh();
  try { const d = await db; d && d.transaction('p', 'readwrite').objectStore('p').put(f, photoKey); } catch (x) {}
};

(async () => {  // muat foto yang pernah diunggah
  try {
    const d = await db;
    if (!d) return;
    d.transaction('p').objectStore('p').openCursor().onsuccess = function () {
      const c = this.result;
      if (c) { PH[c.key] = URL.createObjectURL(c.value); c.continue(); }
      else if (book.classList.contains('open')) refresh();
    };
  } catch (e) {}
})();

/* ============ 3. Menampilkan halaman ============ */
function pageHTML(n) {
  const [chap, html] = P[n];
  const sub = /Bab/.test(chap) ? ' — ' + CN[chap] : '';
  return `<div class="rh">· Jejak Langkah Alyssa · ${chap}${sub} ·</div>${html}<div class="pn">— ${n + 1} —</div>`;
}

// still = true: isi langsung tampil tanpa animasi muncul (dipakai saat pergantian mulus)
function setPage(el, n, still) {
  el.classList.toggle('still', still);
  el.innerHTML = pageHTML(n);
}

function updateUI() {
  const total = P.length / 2, cur = i / 2 + 1;
  $('prev').disabled = i <= 0;
  $('next').disabled = i + 2 >= P.length;
  $('rib').textContent = cur;
  $('cnt').textContent = `Halaman ${cur} / ${total} · ${P[i + 1][0]}`;
  $('bar').style.width = cur / total * 100 + '%';
}

function paint() { setPage(L, i, false); setPage(R, i + 1, false); updateUI(); }

function refresh() {  // dipanggil saat foto berubah: tanpa animasi ulang
  P = pages(); i -= i % 2;
  setPage(L, i, true); setPage(R, i + 1, true); updateUI();
}

function celebrate() {  // konfeti di halaman terakhir
  if (i + 2 < P.length) return;
  setTimeout(() => {
    const r = R.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 3, 70, ['#f3d28a', '#d9577b', '#7ad0c6', '#fff', '#b5822f']);
  }, 450);
}

/* ============ 4. Transisi balik halaman ============
   Daun halaman dibuat dari beberapa potongan vertikal (strip) yang bersambung.
   Tiap strip berputar sedikit berbeda sehingga kertas melengkung seperti buku asli. */
const STRIPS = 12;   // makin banyak makin halus lengkungnya
const BEND = 3.4;    // derajat lengkung per strip
const RAD = Math.PI / 180;
const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;  // easeInOutSine
let strips = [], burstDone = false;

const cast = ['l', 'r'].map(side => {  // bayangan daun yang jatuh ke halaman di bawahnya
  const el = document.createElement('i');
  el.className = 'cast ' + side;
  inner.appendChild(el);
  return el;
});

function buildLeaf(dir, frontN, backN) {
  const fwd = dir > 0, pw = L.offsetWidth, w = pw / STRIPS, front = pageHTML(frontN), back = pageHTML(backN);
  const el = document.createElement('div');
  el.className = 'leaf ' + (fwd ? 'rt' : 'lt');
  strips = [];
  let parent = el;
  for (let k = 0; k < STRIPS; k++) {
    const s = document.createElement('div');
    s.className = 'sx';
    s.style.width = (k < STRIPS - 1 ? w + 1 : w) + 'px';       // +1px: tumpang tindih agar tidak ada garis celah
    s.style[fwd ? 'left' : 'right'] = (k ? w : 0) + 'px';
    const fo = fwd ? k * w : pw - (k + 1) * w, bo = fwd ? pw - (k + 1) * w : k * w;
    s.innerHTML =
      `<div class="sf"><div class="sc page ${fwd ? 'r' : 'l'}" style="left:${-fo}px;width:${pw}px">${front}</div><i class="shd"></i></div>` +
      `<div class="sb"><div class="sc page ${fwd ? 'l' : 'r'}" style="left:${-bo}px;width:${pw}px">${back}</div><i class="shd"></i></div>`;
    parent.appendChild(s); parent = s;
    strips.push({ s, f: s.children[0].lastChild, b: s.children[1].lastChild });
  }
  return el;
}

// p: 0 (daun diam) → 1 (selesai berbalik)
function setP(dir, p) {
  const th = p * 180;
  let d = -Math.sin(2 * Math.PI * p) * BEND;  // awal: ujung bebas tertinggal, akhir: ujung bebas mendahului
  d = d < 0 ? Math.max(d, -th / (STRIPS - 1)) : Math.min(d, (180 - th) / (STRIPS - 1));
  let a = th;
  strips.forEach((o, k) => {
    if (k) a += d;
    o.s.style.transform = `rotateY(${-dir * (k ? d : th)}deg)`;
    o.f.style.opacity = ((1 - Math.cos(a * RAD)) * .28).toFixed(3);
    o.b.style.opacity = ((1 + Math.cos(a * RAD)) * .28).toFixed(3);
  });
  const c = (Math.sin(p * Math.PI) * .55).toFixed(3), first = p < .5 === dir > 0 ? 1 : 0;
  cast[first].style.opacity = c; cast[1 - first].style.opacity = 0;
  if (p > .5 && !burstDone) { burstDone = true; spine(12); }
}

function begin(dir, t) {
  if (busy || t === i || t < 0 || t >= P.length) return false;
  busy = true; flipDir = dir; burstDone = false; P = pages();
  const fwd = dir > 0;
  if (fwd) setPage(R, t + 1, false); else setPage(L, t, false);  // halaman yang akan terlihat di bawah daun
  leaf = buildLeaf(dir, fwd ? i + 1 : i, fwd ? t : t + 1);
  inner.appendChild(leaf);
  setP(dir, 0);
  return true;
}

function anim(dir, from, to, done) {
  const d = reduce ? 1 : Math.max(450, Math.abs(to - from) * 1200);
  let t0 = null;
  requestAnimationFrame(function frame(now) {
    if (t0 === null) t0 = now;
    const k = Math.min(1, (now - t0) / d);
    setP(dir, from + (to - from) * ease(k));
    k < 1 ? requestAnimationFrame(frame) : done();
  });
}

function finish(commit, t) {
  const fwd = flipDir > 0;
  if (commit) i = t;
  // halaman yang tertutup daun diisi ulang (isinya sama persis dengan sisi daun) selagi masih tertutup
  const covered = fwd === commit ? L : R;
  setPage(covered, covered === L ? i : i + 1, true);
  const wait = [...covered.querySelectorAll('img')].filter(m => !m.complete)
    .map(m => new Promise(r => { m.addEventListener('load', r); m.addEventListener('error', r); }));
  Promise.race([Promise.all(wait), new Promise(r => setTimeout(r, 600))]).then(() =>
    requestAnimationFrame(() => requestAnimationFrame(() => {  // tunggu 2 frame supaya halaman bawah sudah tergambar
      leaf.remove(); leaf = null; strips = [];
      cast.forEach(c => c.style.opacity = 0);
      updateUI(); busy = false;
      if (commit) celebrate();
    })));
}

function flipTo(n) {
  const t = Math.max(0, Math.min(P.length - 2, n - n % 2));
  if (t === i || busy) return;
  const dir = t > i ? 1 : -1;
  if (begin(dir, t)) anim(dir, 0, 1, () => finish(true, t));
}

/* ============ 5. Buka / tutup buku ============ */
function openB() {
  book.classList.add('open', 'fresh');
  setTimeout(() => book.classList.remove('fresh'), 1800);
  $('foot').classList.add('on');
  P = pages(); i = 0; paint();
  setTimeout(() => spine(46), 500);
  if (MUSIK_URL && store.get('musicAuto') !== '0') setMusic(true);
}
function closeB() { book.classList.remove('open'); $('foot').classList.remove('on'); i = 0; }

$('cover').onclick = openB;
$('cover').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openB(); } };
$('next').onclick = () => flipTo(i + 2);
$('prev').onclick = () => flipTo(i - 2);

/* ============ 6. Daftar isi & tema ============ */
$('tocl').innerHTML = `<div class="lb" style="margin-bottom:1em">Daftar isi</div>` +
  TOC.map(t => `<button data-go="${t[2]}"><em>${t[1] || '—'}</em>${CN[t[0]]}<span>${t[2] + 1}</span></button>`).join('');
$('tocb').onclick = () => $('drw').classList.add('on');
$('drw').onclick = e => { if (e.target.id === 'drw') $('drw').classList.remove('on'); };

$('thm').onclick = () => {
  const r = document.documentElement, dark = getComputedStyle(r).getPropertyValue('--bg').trim() === '#17130f';
  r.dataset.theme = dark ? 'light' : 'dark';
};

/* ============ 7. Lagu dari link (diatur di content.js → MUSIK_URL) ============ */
let audio = null, yt = null, fadeT, toastT, playing = false;

function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 4200);
}
const ytId = u => { const m = u.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
const ytCmd = fn => yt && yt.contentWindow.postMessage(JSON.stringify({ event: 'command', func: fn, args: [] }), '*');

function fade(to, ms = 900) {
  if (!audio) return;
  clearInterval(fadeT);
  const a = audio, from = a.volume, t0 = performance.now();
  fadeT = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    a.volume = from + (to - from) * k;
    if (k === 1) { clearInterval(fadeT); if (!to) a.pause(); }
  }, 40);
}

async function startMusic() {
  const id = ytId(MUSIK_URL);
  if (id) {
    if (yt) ytCmd('playVideo');
    else {
      yt = document.createElement('iframe');
      yt.className = 'yt'; yt.allow = 'autoplay';
      yt.src = `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0&enablejsapi=1`;
      document.body.appendChild(yt);
    }
    return true;
  }
  try {
    if (!audio) { audio = new Audio(MUSIK_URL); audio.loop = true; audio.volume = 0; }
    await audio.play(); fade(.6);
    return true;
  } catch (e) {
    audio = null;
    toast('Lagu belum bisa diputar. Pastikan MUSIK_URL berisi link langsung file audio (.mp3) atau link YouTube.');
    return false;
  }
}

async function setMusic(on) {
  if (on) playing = await startMusic();
  else { if (yt) ytCmd('pauseVideo'); fade(0); playing = false; }
  store.set('musicAuto', playing ? '1' : '0');
  $('mus').classList.toggle('on', playing);
  $('mus').setAttribute('aria-pressed', playing);
}

$('mus').onclick = () => {
  if (!MUSIK_URL) return toast('Belum ada link lagu. Isi MUSIK_URL di bagian atas content.js.');
  setMusic(!playing);
};

/* ============ 8. Interaksi: klik & seret ============ */
document.addEventListener('click', e => {
  const pg = e.target.closest('.page');
  if (pg && !e.target.closest('button,[data-ph]') && book.classList.contains('open') && !busy) {  // klik sudut halaman
    const r = pg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (y > .86) {
      if (pg === R && x > .8) return flipTo(i + 2);
      if (pg === L && x < .2) return flipTo(i - 2);
    }
  }
  const g = e.target.closest('[data-go]');
  if (g) { $('drw').classList.remove('on'); if (!book.classList.contains('open')) openB(); flipTo(+g.dataset.go); return; }
  const f = e.target.closest('[data-ph]');
  if (f) { photoKey = f.dataset.ph; $('file').click(); return; }
  const a = e.target.dataset.act;
  if (a === 'again') flipTo(0);
  if (a === 'close') closeB();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $('drw').classList.remove('on');
  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.ph) { e.preventDefault(); e.target.click(); return; }
  if (!book.classList.contains('open')) return;
  if (e.key === 'ArrowRight') $('next').click();
  if (e.key === 'ArrowLeft') $('prev').click();
});

let dx0 = null, dy0 = 0, drag = null, moved = false;
inner.addEventListener('pointerdown', e => {
  if (busy || !book.classList.contains('open') || e.button > 0) return;
  dx0 = e.clientX; dy0 = e.clientY; moved = false;
});
inner.addEventListener('pointermove', e => {
  if (dx0 === null) return;
  const dx = e.clientX - dx0, dy = e.clientY - dy0;
  if (!drag) {
    if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy)) return;
    const dir = dx < 0 ? 1 : -1;
    if (!begin(dir, i + dir * 2)) { dx0 = null; return; }
    drag = { dir, t: i + dir * 2, p: 0 }; moved = true;
    try { inner.setPointerCapture(e.pointerId); } catch (x) {}
  }
  drag.p = Math.max(0, Math.min(1, -drag.dir * dx / (L.offsetWidth * 1.3)));
  setP(drag.dir, drag.p);
});
const release = () => {
  dx0 = null;
  if (!drag) return;
  const d = drag, ok = d.p > .3;
  drag = null;
  anim(d.dir, d.p, ok ? 1 : 0, () => finish(ok, d.t));
};
inner.addEventListener('pointerup', release);
inner.addEventListener('pointercancel', release);
document.addEventListener('click', e => { if (moved) { moved = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);

/* ============ 9. Efek visual: bintang, percikan, glow kursor ============ */
const bg = $('bg'), fx = $('fx'), bctx = bg.getContext('2d'), fctx = fx.getContext('2d'), glow = $('glow');
let W, H, stars = [], sparks = [], shoot = null, mx = .5, my = .5;

function resize() {
  W = bg.width = fx.width = innerWidth; H = bg.height = fx.height = innerHeight;
  stars = Array.from({ length: Math.min(150, W * H / 9000 | 0) }, () => ({
    x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3,
    p: Math.random() * 6.28, s: Math.random() * .02 + .005, z: Math.random()
  }));
}
resize(); addEventListener('resize', resize);

function burst(x, y, n = 24, cols = ['#f3d28a', '#b5822f', '#fff3d0', '#d9577b']) {
  if (reduce) return;
  for (let k = 0; k < n; k++) {
    const a = Math.random() * 6.28, v = Math.random() * 4.5 + 1.5;
    sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, l: 1, c: cols[k % cols.length], r: Math.random() * 2.5 + 1 });
  }
}
function spine(n) { const r = inner.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n); }

function loop(t) {
  bctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    bctx.fillStyle = `rgba(255,240,210,${(.35 + .65 * Math.abs(Math.sin(t * s.s * .1 + s.p))) * (.4 + s.z * .6)})`;
    bctx.beginPath(); bctx.arc(s.x + (mx - .5) * 34 * s.z, s.y + (my - .5) * 34 * s.z, s.r, 0, 6.28); bctx.fill();
  }
  if (!shoot && Math.random() < .004) shoot = { x: Math.random() * W * .8, y: Math.random() * H * .4, l: 1 };
  if (shoot) {
    bctx.strokeStyle = `rgba(255,235,190,${shoot.l})`; bctx.lineWidth = 1.5;
    bctx.beginPath(); bctx.moveTo(shoot.x, shoot.y); bctx.lineTo(shoot.x - 90 * shoot.l, shoot.y - 45 * shoot.l); bctx.stroke();
    shoot.x += 14; shoot.y += 7; shoot.l -= .025;
    if (shoot.l <= 0) shoot = null;
  }
  fctx.clearRect(0, 0, W, H);
  sparks = sparks.filter(p => p.l > 0);
  for (const p of sparks) {
    p.x += p.vx; p.y += p.vy; p.vy += .12; p.vx *= .985; p.l -= .016;
    fctx.globalAlpha = Math.max(0, p.l); fctx.fillStyle = p.c;
    fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, 6.28); fctx.fill();
  }
  fctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
if (!reduce) requestAnimationFrame(loop);

addEventListener('pointermove', e => {
  mx = e.clientX / W; my = e.clientY / H;
  glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  document.querySelector('main').style.perspectiveOrigin = `${50 + (mx - .5) * 24}% ${50 + (my - .5) * 24}%`;
});
document.addEventListener('click', e => {
  if (book.classList.contains('open') || e.target.closest('#cover')) burst(e.clientX, e.clientY, 12);
});