/* ==========================================================================
   Jejak Langkah Alyssa — ISI BUKU
   Edit teks cerita, daftar isi, dan foto di file ini.

   Isi file:
   1. Pengaturan   (lagu latar)
   2. Foto         (foto bawaan & foto unggahan)
   3. Template     (bingkai foto, halaman teks, halaman foto)
   4. Narasi       (paragraf tambahan per bab)
   5. Daftar isi   (nama bab & nomor halaman)
   6. Halaman      (isi buku, urut dari depan ke belakang)
   ========================================================================== */


/* ==========================================================================
   1. PENGATURAN
   ========================================================================== */

// Lagu latar: taruh file mp3 di folder yang sama dengan index.html, lalu tulis namanya di sini.
// Bisa juga diisi link .mp3 langsung atau link YouTube
// (YouTube hanya jalan lewat https://, bukan file://).
const MUSIK_URL = 'lagu2.mp3';


/* ==========================================================================
   2. FOTO
   ========================================================================== */

// Foto yang diunggah pengguna (disimpan di browser)
const PH = {};

// Foto bawaan
const DEF = {
  p0: 'alyssa.jpg',
  k1: 'foto/karier1.jpeg',
  k2: 'foto/karier2.jpeg',
  k3: 'foto/karier3.jpeg',
  k4: 'foto/karier4.jpeg',
  k5: 'foto/karier5.jpeg',
  k6: 'foto/karier6.jpeg',
  k7: 'foto/karier7.jpeg'
};


/* ==========================================================================
   3. TEMPLATE
   ========================================================================== */

// Bingkai foto. k = kunci foto, l = label, c = kelas tambahan
const ph = (k, l, c = '') => {
  const url = PH[k] || DEF[k];
  const img = url
    ? `<img src="${url}" alt="${l}" onload="fit(this)" onerror="this.remove()">`
    : '';

  return `
    <div class="slot ${c}">
      <figure class="ph" data-ph="${k}" tabindex="0" role="button"
              aria-label="Foto ${l}" title="Ketuk untuk mengganti foto">
        <b>${l}</b>
        <span>Ketuk untuk menambah foto</span>
        ${img}
      </figure>
    </div>`;
};

// Halaman teks. lb = label, t = judul, a & b = paragraf, f = keterangan bawah,
// dc = 1 untuk huruf awal besar (drop cap)
const txt = (lb, t, a, b, f, dc = 1) => {
  const watermark = /^\d{4}$/.test(lb) ? `<div class="wm">${lb}</div>` : '';
  const extra = X[lb] ? `<p>${X[lb]}</p>` : '';

  return `
    <div class="pg">
      ${watermark}
      <div class="lb">${lb}</div>
      <h3>${t}</h3>
      <p class="${dc ? 'dc' : ''}">${a}</p>
      <p>${b}</p>
      ${extra}
      <p class="ft">${f}</p>
    </div>`;
};

// Halaman foto
const pic = (k, l, cap) => `
  <div class="pg">
    ${ph(k, l)}
    <p class="ft">${cap}</p>
  </div>`;


/* ==========================================================================
   4. NARASI TAMBAHAN PER BAB
   Muncul sebagai paragraf ketiga di halaman teks (kunci = label halaman).
   ========================================================================== */

const X = {

  'Prolog':
    'Nggak ada jalan pintas di cerita ini. Yang ada cuma tahun demi tahun, penuh coba-coba, ' +
    'rasa takut, keberanian, dan kejutan. Kadang langkahnya terasa ringan, kadang melelahkan, ' +
    'tetapi setiap pengalaman meninggalkan pelajaran yang membuat perjalanan ini semakin berarti.',

  '2020':
    'Lalu suatu hari, salah satu videonya tiba-tiba ramai ditonton dan dibagikan ke mana-mana. ' +
    'Notifikasi berdatangan tanpa henti, pengikutnya melonjak dari puluhan menjadi ribuan, dan ' +
    'Alyssa hanya bisa tertawa tak percaya sambil menatap layar ponselnya. Dari sekadar iseng ' +
    'mengisi waktu di rumah, perjalanan itu perlahan membuka pintu ke dunia hiburan digital, ' +
    'sebuah awal baru yang tidak pernah ia rencanakan sebelumnya.',

  '2021':
    'Di fase ini, Alyssa belajar bahwa populer bukanlah garis finis. Perhatian yang datang ' +
    'menjadi alasan untuk terus berkembang, mendengarkan penonton, dan mencoba hal baru. ' +
    'Di balik pertumbuhan itu, ia tetap berusaha konsisten meski hasilnya tak selalu cepat ' +
    'terlihat. Pengalaman ini menyiapkannya menghadapi langkah lebih besar di tahun-tahun berikutnya.',

  '2022':
    'Tahun ini, Alyssa mulai melangkah dari video pendek ke dunia streaming. Berbeda dari konten ' +
    'yang bisa diedit, siaran langsung menuntutnya untuk hadir secara spontan, berinteraksi dengan ' +
    'penonton, dan menjaga suasana tetap seru. Dari obrolan sederhana hingga momen tak terduga saat ' +
    'bermain, penonton bisa mengenal sisi dirinya dengan lebih dekat. Pengalaman ini mengajarkannya ' +
    'untuk lebih percaya diri dan nyaman menjadi diri sendiri di depan banyak orang.',

  '2023':
    'Bagi banyak penonton, perjalanan Alyssa menjadi pengingat bahwa konsistensi bisa membuka pintu ' +
    'yang tak disangka. Berawal dari video di media sosial, langkahnya perlahan membawanya ke ' +
    'lingkungan esports yang lebih luas. Pencapaian ini bukan hanya soal nama yang semakin dikenal, ' +
    'tetapi juga tentang proses untuk terus belajar dan membangun hubungan dengan para pendukungnya.',

  '2024':
    'Di lintasan, Alyssa tampil percaya diri dengan hijabnya dan ikut mematahkan stereotip tentang ' +
    'perempuan di dunia drifting. Olahraga ini menuntut kontrol, ketenangan, fokus, dan keberanian. ' +
    'Semua itu bukan soal gender, melainkan kemauan untuk belajar dan menghadapi tantangan. ' +
    'Mencoba sesuatu yang berbeda memang bisa menakutkan, tetapi kesempatan membuktikan diri sering ' +
    'dimulai saat seseorang berani keluar dari zona nyaman.',

  '2025':
    'Kolaborasi membuat ceritanya tidak lagi hanya tentang satu orang. Setiap kreator dan brand ' +
    'membawa sudut pandang serta warna baru. Dari pertemuan ide, muncul kesempatan untuk belajar ' +
    'dan menciptakan sesuatu yang sulit terwujud jika berjalan sendirian. Terkadang, langkah ' +
    'berikutnya terbuka saat kita mau saling mendukung dan memberi ruang bagi orang lain.',

  '2026':
    'Debut musik ini terasa seperti penutup sekaligus pembuka: penutup bagi enam tahun belajar ' +
    'tampil di hadapan banyak orang, dan pembuka bagi babak baru. Lewat “Blanket & Moon” bersama ' +
    'VVONDERLAND, Alyssa menunjukkan bahwa dirinya masih ingin mengeksplorasi banyak hal. ' +
    'Perjalanan ini mengingatkan bahwa kita tidak harus berhenti pada satu identitas. Selama masih ' +
    'mau belajar dan mencoba, selalu ada ruang untuk tumbuh.',

  'Penutup':
    'Kalau kamu sedang ragu untuk memulai sesuatu, semoga buku ini menjadi pengingat bahwa setiap ' +
    'perjalanan panjang berawal dari satu langkah sederhana. Kamu nggak harus langsung hebat atau ' +
    'tahu semua jawabannya. Kadang, yang penting adalah tetap mencoba meski takut, beristirahat saat ' +
    'lelah, lalu mengumpulkan keberanian untuk melangkah lagi. Setiap proses punya waktunya sendiri, ' +
    'dan langkah kecil hari ini bisa menjadi awal dari sesuatu yang kelak kamu syukuri.'
};


/* ==========================================================================
   5. NAMA BAB & DAFTAR ISI
   TOC: [kunci bab, nomor bab, indeks halaman pertama bab]
   ========================================================================== */

const CN = {
  'Prolog': 'Prolog',
  'Bab 01': 'Layar Kecil',
  'Bab 02': 'Arena',
  'Bab 03': 'Lintasan & Kolaborasi',
  'Bab 04': 'Nada Baru',
  'Epilog': 'Penutup'
};

const TOC = [
  ['Prolog', '',   2],
  ['Bab 01', '01', 4],
  ['Bab 02', '02', 8],
  ['Bab 03', '03', 12],
  ['Bab 04', '04', 16],
  ['Epilog', '',   18]
];


/* ==========================================================================
   6. ISI BUKU
   Format: [bab, html]. Satu entri = satu halaman.
   Urutan genap = halaman kiri, urutan ganjil = halaman kanan.
   ========================================================================== */

const pages = () => [

  /* ---------- PROLOG ---------- */

  ['Prolog', `
    <div class="pg" style="justify-content:center">
      <div class="lb">Buku digital</div>
      <h2>Jejak Langkah Alyssa</h2>
      <p>Kisah karier Alyssa Ananta, dari layar kecil sampai panggung musik. Perjalanan 2020 — 2026.</p>
    </div>`],

  ['Prolog', `
    <div class="pg toc">
      <div class="lb">Isi buku</div>
      ${TOC.map(t => `
        <button data-go="${t[2]}">
          <em>${t[1] || '—'}</em>${CN[t[0]]}<span>${t[2] + 1}</span>
        </button>`).join('')}
    </div>`],

  ['Prolog', txt(
    'Prolog',
    'Sebelum Semuanya Dimulai',
    'Semua cerita besar biasanya mulai dari hal kecil: sebuah ponsel, sedikit nekat, dan keinginan ' +
    'buat bikin orang lain ketawa atau minimal senyum. Pada awalnya, mungkin nggak ada yang benar-benar ' +
    'tahu sejauh apa langkah itu akan membawa seseorang. Namun, dari hal sederhana yang dilakukan dengan ' +
    'sungguh-sungguh, kesempatan baru bisa muncul sedikit demi sedikit.',
    'Buku ini mengikuti perjalanan Alyssa Ananta dari 2020 sampai 2026. Mulai dari video pendek di masa ' +
    'pandemi, ruang streaming, panggung esports, lintasan drift, hingga akhirnya masuk ke studio musik. ' +
    'Di setiap babak, ada pengalaman yang berbeda: ada hal baru yang harus dipelajari, tantangan yang perlu ' +
    'dihadapi, dan keputusan untuk tetap melangkah meski masa depan belum sepenuhnya jelas. Santai saja ' +
    'membacanya. Balik halamannya pelan-pelan, dan lihat bagaimana satu langkah kecil bisa mengantarkan ' +
    'seseorang menuju perjalanan yang jauh lebih panjang.',
    'Selamat membaca'
  )],

  ['Prolog', pic('p0', 'Alyssa Ananta', 'Alyssa Ananta')],


  /* ---------- BAB 01 · LAYAR KECIL ---------- */

  ['Bab 01', txt(
    '2020',
    'Pandemi & Awal Mula',
    'Semuanya bermula dari iseng. Saat pandemi COVID-19 memaksa semua orang tinggal di rumah, ' +
    'hari-hari terasa panjang dan serba sama bagi Alyssa. Sekolah dan kegiatan di luar ditiadakan, ' +
    'dan ia mulai kehabisan cara untuk mengusir bosan. Suatu sore, ia mencoba merekam video sederhana ' +
    'dengan ponselnya, lalu mengunggahnya ke TikTok tanpa berharap apa-apa. Tidak ada rencana besar, ' +
    'yang penting terhibur.',
    'Awalnya hanya teman dan keluarga yang menonton, tapi Alyssa tetap lanjut, satu video demi satu ' +
    'video. Ia belajar dari komentar yang masuk, memperhatikan video mana yang membuat orang tertawa, ' +
    'lalu mencoba lagi dengan ide yang lebih segar. Pelan-pelan, konten apa adanya itu menemukan ' +
    'penontonnya sendiri, dan kebiasaan iseng itu berubah menjadi rutinitas yang ia nantikan setiap hari.',
    'Konten kreator TikTok · Pandemi COVID-19'
  )],

  ['Bab 01', pic('k1', '2020', '2020 · Awal mula di TikTok')],

  ['Bab 01', pic('k2', '2021', '2021 · Konsisten dan terus tumbuh')],

  ['Bab 01', txt(
    '2021',
    'Konsistensi & Pertumbuhan',
    'Viral bisa datang dalam semalam, tapi bertahan itu urusan lain. Tahun 2021 jadi tahun belajar ' +
    'buat terus muncul. Alyssa menjaga konsistensi dan nggak takut nyobain berbagai format konten baru.',
    'Hasilnya pelan tapi pasti: followers terus nambah, dan namanya mulai dikenal di komunitas gaming ' +
    'Indonesia. Dunia inilah yang nantinya jadi rumah kedua buat dia.',
    'Dikenal di komunitas gaming Indonesia',
    0
  )],


  /* ---------- BAB 02 · ARENA ---------- */

  ['Bab 02', txt(
    '2022',
    'Ekspansi ke Gaming & Streaming',
    'Dari yang awalnya cuma penasaran, Alyssa mulai serius main gaming dan streaming. Dua-duanya ' +
    'nggak gampang: butuh sabar, jam terbang, dan skill ngobrol terus tanpa jeda di depan penonton.',
    'Untungnya dia nggak jalan sendirian. Dia gabung ke circle streamer B2E, dan ' +
    'lingkaran pertemanan itu bikin dunia baru ini terasa lebih hangat dan nggak terlalu asing.',
    'Bergabung dengan Bala-Bala DeanKT'
  )],

  ['Bab 02', pic('k3', '2022', '2022 · Gaming dan streaming')],

  ['Bab 02', pic('k4', '2023', '2023 · Brand Ambassador EVOS Esports')],

  ['Bab 02', txt(
    '2023',
    'Brand Ambassador EVOS',
    'Tanggal 16 September 2023, satu kabar besar diumumkan: Alyssa resmi diperkenalkan sebagai Brand ' +
    'Ambassador EVOS Esports. Buat kreator yang mulai dari video pendek, ini langkah ke panggung yang ' +
    'jauh lebih besar.',
    'Alyssa bukan satu-satunya Brand Ambassador di EVOS. Sebelum dan sesudah kehadirannya, ada banyak ' +
    'sosok lain yang ikut membawa warna bagi tim ini. Alyssa tetap punya ciri khasnya sendiri, dengan ' +
    'kepribadian dan perjalanan karier yang membuatnya dikenal oleh para penggemar.',
    '16 September 2023 · EVOS Esports',
    0
  )],


  /* ---------- BAB 03 · LINTASAN & KOLABORASI ---------- */

  ['Bab 03', txt(
    '2024',
    'Women Drift Challenge 2024',
    'Tahun 2024, Alyssa pindah dari layar dan studio ke aspal. Dia ikut Women Drift Challenge 2024, ' +
    'dunia otomotif yang selama ini lebih sering dikenal sebagai dunianya cowok.',
    'Perjalanannya ke dunia drifting nggak langsung mudah. Salah satu tantangan terbesarnya justru ' +
    'datang sebelum masuk lintasan: mendapatkan izin dari orang tua. Kekhawatiran mereka bisa dimengerti, ' +
    'karena drifting adalah olahraga otomotif yang berisiko dan membutuhkan keberanian serta kontrol yang ' +
    'tinggi. Alyssa harus berusaha meyakinkan orang tuanya bahwa ia serius menekuni bidang ini, sampai ' +
    'akhirnya mendapat kesempatan untuk mencoba dan belajar di lintasan.',
    'Women Drift Challenge 2024'
  )],

  ['Bab 03', pic('k5', '2024', '2024 · Terjun ke dunia drifting')],

  ['Bab 03', pic('k6', '2025', '2025 · Kolaborasi bersama kreator dan brand')],

  ['Bab 03', txt(
    '2025',
    'Kembali Setelah Vakum',
    'Setelah vakum dan menghilang selama sembilan bulan dari dunia streaming, tahun 2025 menjadi awal ' +
    'dari babak baru dalam perjalanan Alyssa. Masa menghilang itu membuat kehadirannya kembali terasa ' +
    'berarti, terutama bagi para penonton yang menantikan kembalinya ia ke dunia streaming.',
    'Perlahan, Alyssa kembali melangkah dan membuka diri pada berbagai kesempatan baru. Tahun ini bukan ' +
    'sekadar tentang kembali tampil, tetapi juga tentang membangun lagi koneksi dengan komunitas, mencoba ' +
    'hal-hal baru, dan melanjutkan perjalanan dengan pengalaman yang telah ia lewati.',
    '2025 · Kembali setelah sembilan bulan vakum',
    0
  )],


  /* ---------- BAB 04 · NADA BARU ---------- */

  ['Bab 04', txt(
    '2026',
    'Debut Musik',
    'Bab terbaru ditulis pakai nada. Di 2026, Alyssa rilis single debutnya, “Sakit”, yang diproduseri ' +
    'Mai Armada. Dari orang yang dikenal lewat video dan live, sekarang dia hadir lewat suara dan ' +
    'lagunya sendiri.',
    'Panggung barunya bukan lagi layar atau lintasan, tapi ruang rekaman. Di sana dia belajar bercerita ' +
    'dengan cara yang beda: lewat melodi, lirik, dan perasaan yang dibagi ke pendengar.',
    'Single debut “Sakit” · Produser Mai Armada'
  )],

  ['Bab 04', pic('k7', '2026', '2026 · Melangkah ke dunia musik')],


  /* ---------- EPILOG ---------- */

  ['Epilog', txt(
    'Penutup',
    'Cerita yang Belum Selesai',
    'Enam tahun sejak langkah awal itu, Alyssa telah mencoba banyak hal—dari membuat video, streaming, ' +
    'dan drifting hingga berkarya lewat musik. Perjalanannya nggak selalu mudah, tetapi setiap pengalaman ' +
    'membantunya tumbuh dan menemukan keberanian untuk melangkah lebih jauh.',
    'Terima kasih untuk semua yang pernah menonton, mendukung, dan menjadi bagian dari cerita ini. Buku ' +
    'ini memang sampai di halaman terakhir, tetapi perjalanan Alyssa belum selesai. Masih ada mimpi yang ' +
    'ingin diwujudkan dan cerita baru yang menunggu untuk ditulis. Semoga suatu hari nanti, saat menoleh ' +
    'ke belakang, ia bisa tersenyum haru dan bangga karena sudah berani mencoba dan tidak menyerah. Dan ' +
    'semoga kita juga ingat: langkah kecil hari ini bisa menjadi awal dari sesuatu yang berarti.',
    'Alyssa Ananta · 2020 — 2026'
  )],

  ['Epilog', `
    <div class="pg end">
      ${ph('ep', 'Terima kasih', 's')}
      <h2>Tamat</h2>
      <p>Untuk sementara.</p>
      <div>
        <button data-act="again">Baca dari awal</button>
        <button data-act="close">Tutup buku</button>
      </div>
      <p class="ft">© 2026 Shiro</p>
    </div>`]

];