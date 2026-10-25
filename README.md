# AutoNova - Modern Luxury Showroom & E-Commerce Mobil

Proyek Tugas Akhir **Kelas Frontend BTNG (Bina Talenta Native Generation)**.  
Aplikasi web Showroom Mobil interaktif yang dibangun menggunakan **HTML5, CSS3, dan JavaScript Native (Vanilla JS)** dengan integrasi data dinamis via **Fetch API** dari endpoint resmi panitia.

---

## 📋 Ringkasan Proyek

- **Nama Pengembang**: Rachmad Triyanto
- **Tema**: Showroom Mobil & E-Commerce Otomotif Modern
- **Format Penamaan Repository**: `BTNG-Frontend-RachmadTriyanto`
- **Deadline Pengumpulan**: 28 Oktober 2026, pukul 23:59 WIB
- **Target Endpoint API**: `https://api-web.dnccudinus.org/api/mobil`
- **Kontak / WhatsApp CS**: `+62 821-9809-1797` (082198091797)
- **Teknologi**:
  - **HTML5**: Struktur semantik modern (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
  - **CSS3**: Layouting Flexbox & Grid, CSS Custom Properties (Variables), Shimmer Skeleton Loading, Glassmorphism, & Responsive Breakpoints
  - **JavaScript Native (Vanilla JS)**: Tanpa framework pihak ketiga (No React, Vue, jQuery). Menggunakan Fetch API, DOM Manipulation Native, Event Delegation, & LocalStorage.

---

## 🌟 Fitur Utama & Keunggulan

### 1. Integrasi API Resmi & DOM Manipulation (Bobot 30%)
- Mengambil data mobil secara realtime dari endpoint `https://api-web.dnccudinus.org/api/mobil` menggunakan fungsi `fetch()` berbasis `async/await`.
- Indikator status koneksi API live (*Pulsing green indicator*).
- Efek **Skeleton Loading Shimmer** saat data sedang di-fetch untuk meningkatkan kenyamanan visual (UX).
- **Error Handling & Retry Button**: Apabila server offline atau terjadi gangguan jaringan, pengguna diberikan notifikasi bersahabat serta tombol coba hubungkan ulang.
- Rendering dinamis ke dalam elemen DOM menggunakan kombinasi `document.createElement()`, `document.createDocumentFragment()`, dan template literal native.

### 2. Desain & UI/UX Modern (Bobot 40%)
- **Dark Mode & Light Mode**: Switcher tema elegan dengan persistensi data preferensi pengguna di `localStorage`.
- **Hero Section Dinamis**: Dilengkapi statistik penjualan showroom (500+ unit, 160 titik inspeksi, 99.8% kepuasan).
- **Sistem Multi-Filtering & Pencarian**:
  - Pencarian realtime berbasis nama mobil atau brand dengan tombol reset instan.
  - Filter dinamis berdasarkan Brand (otomatis diekstrak dari data API).
  - Filter jenis Bahan Bakar (Bensin, Diesel, Hybrid, Listrik / EV).
  - Filter tipe Transmisi (Matic, CVT, Manual).
  - Filter Status Ketersediaan (Tersedia / Sold).
  - Quick filter tags (Semua, EV Listrik, Hybrid, Diesel SUV, Hanya Tersedia).
  - Sortir data (Harga terendah/tertinggi, tahun terbaru, abjad A-Z).
  - Penghitung jumlah unit aktif (*Result Counter*).
  - *Empty State* responsif jika pencarian tidak menemukan hasil.
- **Kartu Kendaraan (Car Card)**:
  - Foto unit kendaraan dengan efek zoom hover halus.
  - Badge status unit (*Tersedia* hijau / *Terjual* merah).
  - Badge brand mobil dan tahun pembuatan.
  - Spesifikasi ringkas (Transmisi, Bahan Bakar, Status Inspeksi).
  - Format harga standar mata uang Rupiah (`formatRupiah`).
  - Gambar dengan fallback error handler otomatis jika URL foto API mengalami gangguan.

### 3. Fitur Interaktif Tambahan
- **Pop-Up Modal Detail Mobil**:
  - Menampilkan foto besar dan spesifikasi lengkap kendaraan.
  - Integrasi pesan otomatis ke **WhatsApp Sales Consultant** (`082198091797`) dengan template teks dinamis berisi nama unit dan harga.
  - Tombol pintasan langsung menuju kalkulator kredit untuk mobil tersebut.
- **Kalkulator Simulasi Kredit & DP (Finansial Interaktif)**:
  - Pilihan mobil otomatis terhubung dengan data API.
  - Slider interaktif uang muka (DP 10% s.d. 60%) dan suku bunga tahunan.
  - Pilihan tenor fleksibel (12, 24, 36, 48, 60 bulan).
  - Perhitungan realtime: Angsuran bulanan, total DP, pokok pinjaman, total bunga, dan total angsuran.
  - Tombol pengajuan simulasi ke tim pembiayaan via WhatsApp.
- **Sistem Wishlist / Favorit**:
  - Simpan mobil impian ke favorit menggunakan `localStorage`.
  - Drawer off-canvas untuk meninjau daftar mobil yang disukai.
  - Badge counter realtime pada navbar.
- **Modal Booking Test Drive**:
  - Formulir pemesanan jadwal test drive dengan pilihan lokasi (ke showroom atau antar ke rumah).
- **Accordion FAQ & Formulir Kontak**:
  - Tanya jawab interaktif seputar showroom dengan transisi animasi halus.
  - Formulir pesan dan konsultasi unit.
- **Sistem Notifikasi Toast**:
  - Alert melayang non-intrusif di pojok layar untuk konfirmasi interaksi pengguna.

### 4. Responsivitas Penuh (Bobot 20%)
- Desain adaptif dari layar smartphone terkecil (320px), tablet (768px), hingga monitor desktop layar lebar (1240px+).
- Menu navigasi mobile *drawer/drop* dengan animasi transisi yang mulus.
- Grid katalog fleksibel (1 kolom pada mobile, 2 kolom pada tablet, 3 kolom pada desktop).

### 5. Kerapian Kode & Standar Clean Code (Bobot 10%)
- Kode terstruktur secara modular, bersih, terdokumentasi dengan komentar JSDoc yang jelas, serta **bebas dari syntax error**.
- Mematuhi struktur folder baku web development.

---

## 📁 Struktur Direktori Proyek

```plaintext
BTNG-Frontend-RachmadTriyanto/
│
├── index.html          # Struktur utama halaman web (HTML5 Semantik)
│
├── css/
│   └── style.css       # Seluruh gaya tampilan, variabel tema, animasi & media query (CSS3)
│
├── js/
│   └── app.js          # Logika aplikasi, integrasi Fetch API, manipulasi DOM & state (Vanilla JS)
│
├── assets/             # Direktori aset pendukung
│
└── README.md           # Dokumentasi lengkap proyek tugas akhir
```

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

Tidak memerlukan instalasi package manager atau build tools (Zero Dependency).

### Cara 1: Buka Langsung di Peramban (Browser)
1. Buka folder proyek di File Explorer.
2. Klik dua kali pada file `index.html` (atau klik kanan -> *Open with* -> Google Chrome / Microsoft Edge / Mozilla Firefox).

### Cara 2: Menjalankan Menggunakan Local Server (Direkomendasikan)
Jika Anda menggunakan VS Code:
1. Buka folder ini di **VS Code**.
2. Gunakan ekstensi **Live Server**, klik kanan pada `index.html` lalu pilih **"Open with Live Server"**.
3. Website akan otomatis terbuka di `http://127.0.0.1:5500`.

Atau menggunakan Python dari terminal:
```bash
python -m http.server 8000
```
Lalu buka peramban di `http://localhost:8000`.

---

## 🌐 Dokumentasi Integrasi API

Endpoint resmi yang diakses:
```http
GET https://api-web.dnccudinus.org/api/mobil
```

Contoh cuplikan kode integrasi Vanilla JS (`js/app.js`):
```javascript
async function fetchCarsData() {
  renderSkeletonLoading();
  try {
    const response = await fetch('https://api-web.dnccudinus.org/api/mobil', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server API status: ${response.status}`);
    }

    const result = await response.json();
    state.cars = result.data || result;
    
    // Manipulasi DOM untuk menampilkan data secara dinamis
    applyFiltersAndSort();
  } catch (error) {
    showErrorState(error.message);
  }
}
```

---

## 📤 Petunjuk Pengumpulan ke GitHub (Sesuai Panduan BTNG)

1. Pastikan nama repository GitHub menggunakan format yang ditentukan:
   ```plaintext
   BTNG-Frontend-RachmadTriyanto
   ```

2. Inisialisasi Git di dalam folder proyek:
   ```bash
   git init
   git add .
   git commit -m "feat: complete AutoNova showroom frontend project for BTNG"
   ```

3. Hubungkan ke repositori GitHub Anda dan unggah (*push*):
   ```bash
   git branch -M main
   git remote add origin https://github.com/<username-github>/BTNG-Frontend-RachmadTriyanto.git
   git push -u origin main
   ```

4. Pastikan status repository disetel ke **Public** agar panitia penilai dapat mengakses dan memeriksa kode serta menjalankan website.
5. Salin tautan repository GitHub dan kumpulkan pada portal resmi BTNG sebelum **28 Oktober 2026, pukul 23.59 WIB**.

---

## 👨‍💻 Pengembang
- **Nama**: Rachmad Triyanto
- **Program**: Bina Talenta Native Generation (BTNG)
- **Kelas**: Frontend Web Development
- **No. WhatsApp / HP**: 082198091797
- **Tahun**: 2026
#   B T N G - F r o n d e n d - R a c h m a d T r i y a n t o  
 