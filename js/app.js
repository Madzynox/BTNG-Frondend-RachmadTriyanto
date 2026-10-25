/**
 * ==============================================================================
 * AUTONOVA SHOWROOM - JAVASCRIPT NATIVE (VANILLA JAVASCRIPT)
 * Tugas Akhir BTNG - Kelas Frontend
 * 
 * Fitur Utama:
 * 1. Integrasi API resmi panitia menggunakan fetch() ke https://api-web.dnccudinus.org/api/mobil
 * 2. Manipulasi DOM dinamis (createElement & innerHTML) untuk rendering kartu mobil
 * 3. Sistem Pencarian (Search) & Multi-Filtering (Brand, Bahan Bakar, Transmisi, Status)
 * 4. Sistem Pengurutan / Sorting (Harga, Tahun, Nama)
 * 5. Modal Detail Kendaraan & Integrasi Direct WhatsApp Booking
 * 6. Modal Booking Test Drive
 * 7. Fitur Wishlist / Favorit Mobil (localStorage)
 * 8. Kalkulator Interaktif Simulasi Cicilan / Kredit
 * 9. Dark Mode & Light Mode Theme Switcher (localStorage)
 * 10. FAQ Accordion & Mobile Responsive Navigation
 * ==============================================================================
 */

// Strict mode untuk kerapian dan keamanan kode
'use strict';

// ------------------------------------------------------------------------------
// KONSTANTA & STATE APLIKASI
// ------------------------------------------------------------------------------
const API_URL = 'https://api-web.dnccudinus.org/api/mobil';

const state = {
  cars: [],               // Data master mobil dari API
  filteredCars: [],       // Data mobil setelah difilter & disortir
  favorites: [],          // Daftar ID mobil favorit pengguna (disimpan di localStorage)
  filters: {
    search: '',
    brand: 'all',
    fuel: 'all',
    transmission: 'all',
    status: 'all',
    sortBy: 'default',
    quickTag: 'all'
  },
  theme: 'dark'             // Tema saat ini ('dark' | 'light')
};

// ------------------------------------------------------------------------------
// ELEMEN DOM
// ------------------------------------------------------------------------------
const DOM = {
  // Container & Grid
  carGrid: document.getElementById('car-grid'),
  emptyState: document.getElementById('empty-state'),
  errorState: document.getElementById('error-state'),
  errorTitle: document.getElementById('error-title'),
  errorMessage: document.getElementById('error-message'),
  retryBtn: document.getElementById('retry-btn'),
  apiStatus: document.getElementById('api-status'),
  resultsCount: document.getElementById('results-count'),

  // Filters
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterBrand: document.getElementById('filter-brand'),
  filterFuel: document.getElementById('filter-fuel'),
  filterTransmission: document.getElementById('filter-transmission'),
  filterStatus: document.getElementById('filter-status'),
  sortBy: document.getElementById('sort-by'),
  quickTags: document.getElementById('quick-tags'),
  resetFilterBtn: document.getElementById('reset-filter-btn'),
  emptyResetBtn: document.getElementById('empty-reset-btn'),

  // Wishlist & Drawer
  wishlistBtn: document.getElementById('wishlist-btn'),
  wishlistCount: document.getElementById('wishlist-count'),
  wishlistDrawer: document.getElementById('wishlist-drawer'),
  drawerCloseBtn: document.getElementById('drawer-close-btn'),
  drawerCount: document.getElementById('drawer-count'),
  wishlistItemsContainer: document.getElementById('wishlist-items-container'),
  clearWishlistBtn: document.getElementById('clear-wishlist-btn'),

  // Detail Modal
  detailModal: document.getElementById('detail-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalBody: document.getElementById('modal-body'),

  // Booking Modal
  bookingModal: document.getElementById('booking-modal'),
  bookingModalCloseBtn: document.getElementById('booking-modal-close-btn'),
  bookingForm: document.getElementById('booking-form'),
  bookingCarTitle: document.getElementById('booking-car-title'),
  bookingCarSubtitle: document.getElementById('booking-car-subtitle'),
  bookingCarId: document.getElementById('booking-car-id'),
  bookLocation: document.getElementById('book-location'),
  homeAddressGroup: document.getElementById('home-address-group'),

  // Calculator
  calcCarSelect: document.getElementById('calc-car-select'),
  calcCarPrice: document.getElementById('calc-car-price'),
  calcDpRange: document.getElementById('calc-dp-range'),
  dpPercentageDisplay: document.getElementById('dp-percentage-display'),
  dpAmountDisplay: document.getElementById('dp-amount-display'),
  tenorOptions: document.getElementById('tenor-options'),
  calcInterestRate: document.getElementById('calc-interest-rate'),
  interestDisplay: document.getElementById('interest-display'),
  resultMonthlyPayment: document.getElementById('result-monthly-payment'),
  resultCarPrice: document.getElementById('result-car-price'),
  resultDpAmount: document.getElementById('result-dp-amount'),
  resultLoanPrincipal: document.getElementById('result-loan-principal'),
  resultTotalInterest: document.getElementById('result-total-interest'),
  resultTotalPayment: document.getElementById('result-total-payment'),
  calcApplyBtn: document.getElementById('calc-apply-btn'),

  // Theme & Navigation
  themeToggle: document.getElementById('theme-toggle'),
  navbar: document.getElementById('navbar'),
  mobileToggle: document.getElementById('mobile-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  backToTop: document.getElementById('back-to-top'),

  // Toast
  toastContainer: document.getElementById('toast-container'),

  // Contact Form
  contactForm: document.getElementById('contact-form')
};

// ------------------------------------------------------------------------------
// FUNGSI UTILITAS (FORMATTER & HELPERS)
// ------------------------------------------------------------------------------

/**
 * Format angka ke mata uang Rupiah Indonesia (cth: Rp 719.000.000)
 * @param {number} number 
 * @returns {string}
 */
function formatRupiah(number) {
  if (isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

/**
 * Menampilkan pesan toast melayang di pojok kanan bawah
 * @param {string} message - Pesan notifikasi
 * @param {'info'|'success'|'danger'|'warning'} type - Jenis notifikasi
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'danger') iconClass = 'fa-circle-xmark';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Otomatis hilangkan toast setelah 3.5 detik
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('transitionend', () => {
      if (toast.parentElement) toast.remove();
    });
  }, 3500);
}

/**
 * Gambar cadangan jika link foto API gagal dimuat
 * @param {HTMLImageElement} imgElement 
 */
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80';
}
window.handleImageError = handleImageError;

// ------------------------------------------------------------------------------
// INTEGRASI API PANITIA (FETCH DATA MOBIL)
// ------------------------------------------------------------------------------

/**
 * Menampilkan skeleton loading card saat fetch sedang berlangsung
 */
function renderSkeletonLoading(count = 6) {
  DOM.carGrid.innerHTML = '';
  DOM.emptyState.classList.add('hidden');
  DOM.errorState.classList.add('hidden');

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line price"></div>
        <div class="skeleton-line button"></div>
      </div>
    `;
    DOM.carGrid.appendChild(skeleton);
  }

  // Update status badge
  DOM.apiStatus.className = 'api-status-badge connecting';
  DOM.apiStatus.innerHTML = `
    <span class="status-dot"></span>
    <span class="status-text">Mengambil data dari <code>api-web.dnccudinus.org/api/mobil</code>...</span>
  `;
}

/**
 * Fungsi utama untuk mengambil data mobil dari endpoint panitia
 */
async function fetchCarsData() {
  renderSkeletonLoading();

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server API merespons dengan status error: ${response.status} (${response.statusText})`);
    }

    const result = await response.json();

    // Validasi struktur respon API panitia
    if (result && Array.isArray(result.data)) {
      state.cars = result.data;
    } else if (Array.isArray(result)) {
      state.cars = result;
    } else {
      throw new Error('Format respon API tidak sesuai dengan struktur yang diharapkan.');
    }

    // Update status badge: Sukses terhubung
    DOM.apiStatus.className = 'api-status-badge connected';
    DOM.apiStatus.innerHTML = `
      <span class="status-dot"></span>
      <span class="status-text">Terhubung ke API Panitia &bull; <strong>${state.cars.length} Mobil Terverifikasi</strong></span>
    `;

    // Inisialisasi data pendukung
    populateBrandFilter();
    populateCalculatorCars();
    applyFiltersAndSort();

  } catch (error) {
    console.error('Fetch API Error:', error);
    showErrorState(error.message);
  }
}

/**
 * Menampilkan pesan error jika request fetch gagal
 * @param {string} message 
 */
function showErrorState(message) {
  DOM.carGrid.innerHTML = '';
  DOM.emptyState.classList.add('hidden');
  DOM.errorState.classList.remove('hidden');

  DOM.errorTitle.textContent = 'Gagal Mengambil Data Mobil';
  DOM.errorMessage.textContent = `${message}. Silakan periksa koneksi internet Anda atau coba lagi.`;

  DOM.apiStatus.className = 'api-status-badge error';
  DOM.apiStatus.innerHTML = `
    <span class="status-dot"></span>
    <span class="status-text">Koneksi API Gagal: <code>${message}</code></span>
  `;

  showToast('Gagal memuat data dari endpoint API.', 'danger');
}

// ------------------------------------------------------------------------------
// MANIPULASI DOM DINAMIS (RENDERING KATALOG MOBIL)
// ------------------------------------------------------------------------------

/**
 * Membuat elemen kartu mobil (DOM Manipulation Native)
 * @param {Object} car - Objek data mobil dari API
 * @returns {HTMLElement}
 */
function createCarCardElement(car) {
  const card = document.createElement('article');
  card.className = 'car-card';
  card.setAttribute('data-id', car.id);

  const isFavorite = state.favorites.includes(car.id);
  const isAvailable = car.status.toLowerCase() === 'tersedia';
  const statusClass = isAvailable ? 'tersedia' : 'sold';
  const statusLabel = isAvailable ? 'Unit Tersedia' : 'Sold Out';

  // Format ikon transmisi
  let transIcon = 'fa-gears';
  if (car.transmisi.toLowerCase() === 'manual') transIcon = 'fa-code-branch';

  // Format ikon & badge bahan bakar dengan tema warna unik
  let fuelIcon = 'fa-gas-pump';
  let fuelBadgeClass = 'fuel-petrol';
  let fuelLabel = car.bahan_bakar;
  if (car.bahan_bakar.toLowerCase() === 'listrik') {
    fuelIcon = 'fa-bolt';
    fuelBadgeClass = 'fuel-ev';
    fuelLabel = 'Listrik (EV)';
  } else if (car.bahan_bakar.toLowerCase() === 'hybrid') {
    fuelIcon = 'fa-leaf';
    fuelBadgeClass = 'fuel-hybrid';
  } else if (car.bahan_bakar.toLowerCase() === 'diesel') {
    fuelIcon = 'fa-truck-monster';
    fuelBadgeClass = 'fuel-diesel';
  }

  // Estimasi cicilan bulanan (~2.6% harga per bulan)
  const estMonthly = Math.round(car.harga * 0.026);

  card.innerHTML = `
    <div class="car-image-wrapper">
      <div class="card-top-badges">
        <span class="brand-badge"><i class="fa-solid fa-car-side"></i> ${car.brand}</span>
        <span class="status-badge ${statusClass}">
          <i class="fa-solid ${isAvailable ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
          ${statusLabel}
        </span>
      </div>
      <img src="${car.foto}" alt="${car.nama}" class="car-image" loading="lazy" onerror="handleImageError(this)">
      <button class="btn-wishlist ${isFavorite ? 'active' : ''}" data-action="toggle-fav" data-id="${car.id}" title="${isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}" aria-label="Simpan Mobil">
        <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
      </button>
    </div>

    <div class="car-content">
      <div class="car-tags-row">
        <span class="spec-pill ${fuelBadgeClass}"><i class="fa-solid ${fuelIcon}"></i> ${fuelLabel}</span>
        <span class="spec-pill pill-year"><i class="fa-regular fa-calendar"></i> ${car.tahun}</span>
      </div>

      <h3 class="car-title" title="${car.nama}">${car.nama}</h3>

      <div class="car-specs-grid">
        <div class="spec-item">
          <i class="fa-solid ${transIcon} spec-icon"></i>
          <span class="spec-value">${car.transmisi}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid ${fuelIcon} spec-icon"></i>
          <span class="spec-value">${car.bahan_bakar}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-shield-halved spec-icon"></i>
          <span class="spec-value">160 Titik OK</span>
        </div>
      </div>

      <div class="car-price-row">
        <div class="price-header-row">
          <span class="price-label">Harga OTR</span>
          <span class="installment-badge">Cicilan: ${formatRupiah(estMonthly)}/bln</span>
        </div>
        <span class="price-amount">${formatRupiah(car.harga)}</span>
      </div>

      <div class="car-card-actions">
        <button class="btn btn-outline btn-sm btn-card-detail" data-action="detail" data-id="${car.id}">
          <i class="fa-solid fa-circle-info"></i> Detail
        </button>
        <button class="btn btn-primary btn-sm btn-card-book" data-action="book" data-id="${car.id}" ${!isAvailable ? 'disabled style="opacity: 0.55; cursor: not-allowed;"' : ''}>
          <i class="fa-solid fa-key"></i> ${isAvailable ? 'Booking Unit' : 'Sold Out'}
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Merender daftar mobil ke dalam DOM
 * @param {Array} carsList 
 */
function renderCars(carsList) {
  DOM.carGrid.innerHTML = '';

  if (carsList.length === 0) {
    DOM.emptyState.classList.remove('hidden');
    DOM.resultsCount.textContent = 'Menampilkan 0 mobil';
    return;
  }

  DOM.emptyState.classList.add('hidden');
  DOM.errorState.classList.add('hidden');

  const fragment = document.createDocumentFragment();
  carsList.forEach(car => {
    const cardEl = createCarCardElement(car);
    fragment.appendChild(cardEl);
  });

  DOM.carGrid.appendChild(fragment);

  // Update teks jumlah hasil
  DOM.resultsCount.textContent = `Menampilkan ${carsList.length} dari ${state.cars.length} unit mobil`;
}

// ------------------------------------------------------------------------------
// FILTERING, SEARCHING & SORTING LOGIC
// ------------------------------------------------------------------------------

/**
 * Mengisi dropdown filter Brand secara dinamis dari data API unik
 */
function populateBrandFilter() {
  const brands = [...new Set(state.cars.map(c => c.brand))].sort();
  DOM.filterBrand.innerHTML = '<option value="all">Semua Brand</option>';
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    DOM.filterBrand.appendChild(option);
  });
}

/**
 * Menerapkan filter gabungan dan pengurutan ke data mobil
 */
function applyFiltersAndSort() {
  let result = [...state.cars];

  // 1. Filter Pencarian Teks (Nama atau Brand)
  if (state.filters.search.trim() !== '') {
    const q = state.filters.search.toLowerCase().trim();
    result = result.filter(car => 
      car.nama.toLowerCase().includes(q) || 
      car.brand.toLowerCase().includes(q)
    );
  }

  // 2. Filter Brand
  if (state.filters.brand !== 'all') {
    result = result.filter(car => car.brand.toLowerCase() === state.filters.brand.toLowerCase());
  }

  // 3. Filter Bahan Bakar
  if (state.filters.fuel !== 'all') {
    result = result.filter(car => car.bahan_bakar.toLowerCase() === state.filters.fuel.toLowerCase());
  }

  // 4. Filter Transmisi
  if (state.filters.transmission !== 'all') {
    result = result.filter(car => car.transmisi.toLowerCase() === state.filters.transmission.toLowerCase());
  }

  // 5. Filter Status
  if (state.filters.status !== 'all') {
    result = result.filter(car => car.status.toLowerCase() === state.filters.status.toLowerCase());
  }

  // 6. Quick Tag Filter
  if (state.filters.quickTag !== 'all') {
    if (state.filters.quickTag === 'tersedia') {
      result = result.filter(car => car.status.toLowerCase() === 'tersedia');
    } else {
      result = result.filter(car => 
        car.bahan_bakar.toLowerCase() === state.filters.quickTag.toLowerCase()
      );
    }
  }

  // 7. Pengurutan / Sorting
  switch (state.filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.harga - b.harga);
      break;
    case 'price-desc':
      result.sort((a, b) => b.harga - a.harga);
      break;
    case 'year-desc':
      result.sort((a, b) => b.tahun - a.tahun);
      break;
    case 'name-asc':
      result.sort((a, b) => a.nama.localeCompare(b.nama));
      break;
    default:
      // Default: urutan asli dari API
      break;
  }

  state.filteredCars = result;
  renderCars(result);
}

/**
 * Reset semua filter ke kondisi awal
 */
function resetAllFilters() {
  state.filters.search = '';
  state.filters.brand = 'all';
  state.filters.fuel = 'all';
  state.filters.transmission = 'all';
  state.filters.status = 'all';
  state.filters.sortBy = 'default';
  state.filters.quickTag = 'all';

  DOM.searchInput.value = '';
  DOM.searchClearBtn.classList.add('hidden');
  DOM.filterBrand.value = 'all';
  DOM.filterFuel.value = 'all';
  DOM.filterTransmission.value = 'all';
  DOM.filterStatus.value = 'all';
  DOM.sortBy.value = 'default';

  // Reset active quick tag buttons
  const tagBtns = DOM.quickTags.querySelectorAll('.quick-tag');
  tagBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === 'all');
  });

  applyFiltersAndSort();
  showToast('Semua filter berhasil direset.', 'info');
}

// ------------------------------------------------------------------------------
// SISTEM WISHLIST / MOBIL FAVORIT (LOCALSTORAGE)
// ------------------------------------------------------------------------------

/**
 * Memuat daftar favorit dari localStorage
 */
function loadFavorites() {
  try {
    const saved = localStorage.getItem('autonova_favorites');
    if (saved) {
      state.favorites = JSON.parse(saved);
    }
  } catch (e) {
    state.favorites = [];
  }
  updateWishlistUI();
}

/**
 * Menyimpan daftar favorit ke localStorage
 */
function saveFavorites() {
  try {
    localStorage.setItem('autonova_favorites', JSON.stringify(state.favorites));
  } catch (e) {
    console.error('Gagal menyimpan favorit ke localStorage', e);
  }
  updateWishlistUI();
}

/**
 * Menambah atau menghapus mobil dari favorit
 * @param {number} carId 
 */
function toggleFavorite(carId) {
  const id = Number(carId);
  const index = state.favorites.indexOf(id);
  const car = state.cars.find(c => c.id === id);
  const carName = car ? car.nama : 'Mobil';

  if (index === -1) {
    state.favorites.push(id);
    showToast(`${carName} ditambahkan ke Favorit!`, 'success');
  } else {
    state.favorites.splice(index, 1);
    showToast(`${carName} dihapus dari Favorit.`, 'info');
  }

  saveFavorites();
  // Update card heart icon pada grid
  renderCars(state.filteredCars);
}

/**
 * Memperbarui badge counter dan isi drawer wishlist
 */
function updateWishlistUI() {
  const count = state.favorites.length;
  DOM.wishlistCount.textContent = count;
  DOM.drawerCount.textContent = count;

  const favoriteCars = state.cars.filter(car => state.favorites.includes(car.id));

  if (favoriteCars.length === 0) {
    DOM.wishlistItemsContainer.innerHTML = `
      <div class="wishlist-empty">
        <i class="fa-regular fa-heart"></i>
        <p>Belum ada mobil favorit yang disimpan.</p>
        <span style="font-size: 0.8rem; opacity: 0.7;">Klik ikon hati pada mobil untuk menyimpannya di sini.</span>
      </div>
    `;
    return;
  }

  DOM.wishlistItemsContainer.innerHTML = '';
  favoriteCars.forEach(car => {
    const item = document.createElement('div');
    item.className = 'wishlist-card';
    item.innerHTML = `
      <img src="${car.foto}" alt="${car.nama}" class="wishlist-card-img" onerror="handleImageError(this)">
      <div class="wishlist-card-info">
        <h4 class="wishlist-card-title">${car.nama}</h4>
        <div class="wishlist-card-price">${formatRupiah(car.harga)}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${car.tahun} &bull; ${car.transmisi} &bull; ${car.bahan_bakar}</div>
      </div>
      <button class="wishlist-remove-btn" data-action="remove-fav" data-id="${car.id}" title="Hapus dari favorit">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    DOM.wishlistItemsContainer.appendChild(item);
  });
}

// ------------------------------------------------------------------------------
// MODAL DETAIL KENDARAAN
// ------------------------------------------------------------------------------

/**
 * Membuka modal detail mobil dengan informasi lengkap dan tombol interaksi
 * @param {number} carId 
 */
function openCarDetailModal(carId) {
  const car = state.cars.find(c => c.id === Number(carId));
  if (!car) return;

  const isAvailable = car.status.toLowerCase() === 'tersedia';
  const statusClass = isAvailable ? 'tersedia' : 'sold';
  const statusLabel = isAvailable ? 'Unit Tersedia' : 'Sudah Terjual (Sold Out)';

  // Format pesan WhatsApp
  const waText = encodeURIComponent(
    `Halo Admin AutoNova, saya berminat dengan unit:\n*${car.nama}*\nTahun: ${car.tahun}\nHarga: ${formatRupiah(car.harga)}\nApakah unit ini masih bisa saya cek atau jadwalkan test drive? Terima kasih!`
  );
  const waUrl = `https://wa.me/6282198091797?text=${waText}`;

  DOM.modalBody.innerHTML = `
    <div class="modal-detail-grid">
      <div class="modal-car-image-box">
        <img src="${car.foto}" alt="${car.nama}" class="modal-car-img" onerror="handleImageError(this)">
      </div>

      <div class="modal-car-info">
        <span class="modal-brand-tag">${car.brand} Official</span>
        <h2 class="modal-car-title" id="modal-car-title">${car.nama}</h2>
        
        <div style="margin-bottom: 16px;">
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${isAvailable ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${statusLabel}
          </span>
        </div>

        <div class="modal-price-box">
          <span class="price-label">Harga Spesial Showroom</span>
          <div class="modal-price-val">${formatRupiah(car.harga)}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">*Harga On The Road (OTR) wilayah Jawa Tengah &amp; DIY</span>
        </div>

        <div class="modal-specs-table">
          <div class="spec-cell">
            <span class="label">Tahun Pembuatan</span>
            <span class="val">${car.tahun}</span>
          </div>
          <div class="spec-cell">
            <span class="label">Tipe Transmisi</span>
            <span class="val">${car.transmisi}</span>
          </div>
          <div class="spec-cell">
            <span class="label">Bahan Bakar</span>
            <span class="val">${car.bahan_bakar}</span>
          </div>
          <div class="spec-cell">
            <span class="label">Status Inspeksi</span>
            <span class="val" style="color: var(--color-success);"><i class="fa-solid fa-shield-check"></i> 160 Titik Lulus</span>
          </div>
        </div>

        <div class="modal-actions">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-block">
            <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp &amp; Negosiasi
          </a>
          <button class="btn btn-outline btn-block" id="modal-calc-btn" data-id="${car.id}">
            <i class="fa-solid fa-calculator"></i> Hitung Simulasi Cicilan Mobil Ini
          </button>
        </div>
      </div>
    </div>
  `;

  // Listener untuk tombol kalkulator di dalam modal
  document.getElementById('modal-calc-btn').addEventListener('click', () => {
    closeDetailModal();
    selectCarInCalculator(car.id);
    document.getElementById('simulasi').scrollIntoView({ behavior: 'smooth' });
  });

  DOM.detailModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Kunci scroll halaman saat modal aktif
}

function closeDetailModal() {
  DOM.detailModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ------------------------------------------------------------------------------
// MODAL BOOKING TEST DRIVE
// ------------------------------------------------------------------------------

/**
 * Membuka formulir booking test drive untuk mobil tertentu
 * @param {number} carId 
 */
function openBookingModal(carId) {
  const car = state.cars.find(c => c.id === Number(carId));
  if (!car) return;

  DOM.bookingCarId.value = car.id;
  DOM.bookingCarTitle.textContent = `Booking Unit: ${car.nama}`;
  DOM.bookingCarSubtitle.textContent = `Harga: ${formatRupiah(car.harga)} &bull; Tahun: ${car.tahun}`;

  // Set default tanggal hari esok
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('book-date').value = tomorrow.toISOString().split('T')[0];
  document.getElementById('book-date').min = tomorrow.toISOString().split('T')[0];

  DOM.bookingModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  DOM.bookingModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ------------------------------------------------------------------------------
// KALKULATOR INTERAKTIF SIMULASI KREDIT
// ------------------------------------------------------------------------------

/**
 * Mengisi dropdown pilihan mobil pada kalkulator kredit
 */
function populateCalculatorCars() {
  DOM.calcCarSelect.innerHTML = '<option value="">-- Pilih mobil dari showroom --</option>';
  state.cars.forEach(car => {
    const opt = document.createElement('option');
    opt.value = car.id;
    opt.textContent = `${car.nama} (${formatRupiah(car.harga)})`;
    DOM.calcCarSelect.appendChild(opt);
  });
}

/**
 * Memilih mobil tertentu di kalkulator secara terprogram
 * @param {number} carId 
 */
function selectCarInCalculator(carId) {
  const car = state.cars.find(c => c.id === Number(carId));
  if (!car) return;

  DOM.calcCarSelect.value = car.id;
  DOM.calcCarPrice.value = car.harga;
  calculateLoan();
}

/**
 * Menghitung simulasi kredit per bulan
 */
function calculateLoan() {
  const carPrice = parseFloat(DOM.calcCarPrice.value) || 0;
  const dpPercent = parseFloat(DOM.calcDpRange.value) || 20;
  const interestRateYear = parseFloat(DOM.calcInterestRate.value) || 6.5;

  // Temukan tenor terpilih
  const activeTenorBtn = DOM.tenorOptions.querySelector('.tenor-btn.active');
  const tenorMonths = activeTenorBtn ? parseInt(activeTenorBtn.dataset.tenor, 10) : 36;
  const tenorYears = tenorMonths / 12;

  // Rumus Perhitungan:
  // DP = Harga Mobil * (DP% / 100)
  // Pokok Pinjaman = Harga Mobil - DP
  // Total Bunga = Pokok Pinjaman * (Bunga% / 100) * Tenor (Tahun)
  // Total Pembayaran Kredit = Pokok Pinjaman + Total Bunga
  // Angsuran per Bulan = Total Pembayaran Kredit / Tenor (Bulan)

  const dpAmount = carPrice * (dpPercent / 100);
  const loanPrincipal = Math.max(0, carPrice - dpAmount);
  const totalInterest = loanPrincipal * (interestRateYear / 100) * tenorYears;
  const totalPayment = loanPrincipal + totalInterest;
  const monthlyPayment = tenorMonths > 0 ? (totalPayment / tenorMonths) : 0;

  // Perbarui Tampilan UI
  DOM.dpPercentageDisplay.textContent = `${dpPercent}%`;
  DOM.dpAmountDisplay.textContent = formatRupiah(dpAmount);
  DOM.interestDisplay.textContent = `${interestRateYear.toFixed(1)}% / tahun`;

  DOM.resultMonthlyPayment.textContent = formatRupiah(monthlyPayment);
  DOM.resultCarPrice.textContent = formatRupiah(carPrice);
  DOM.resultDpAmount.textContent = formatRupiah(dpAmount);
  DOM.resultLoanPrincipal.textContent = formatRupiah(loanPrincipal);
  DOM.resultTotalInterest.textContent = formatRupiah(totalInterest);
  DOM.resultTotalPayment.textContent = formatRupiah(totalPayment);
}

// ------------------------------------------------------------------------------
// PENGATURAN TEMA (DARK / LIGHT MODE)
// ------------------------------------------------------------------------------

/**
 * Inisialisasi tema dari preferensi localStorage atau preferensi sistem
 */
function initTheme() {
  const savedTheme = localStorage.getItem('autonova_theme');
  if (savedTheme) {
    state.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    state.theme = 'light';
  } else {
    state.theme = 'dark';
  }

  applyTheme(state.theme);
}

/**
 * Menerapkan tema ke elemen root <html>
 * @param {'dark'|'light'} theme 
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('autonova_theme', theme);

  if (theme === 'light') {
    DOM.themeToggle.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
    DOM.themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
  } else {
    DOM.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    DOM.themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
  }
}

/**
 * Toggle antara tema gelap dan terang
 */
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
  showToast(`Mode ${state.theme === 'dark' ? 'Gelap' : 'Terang'} diaktifkan.`, 'info');
}

// ------------------------------------------------------------------------------
// EVENT LISTENERS & DELEGATION
// ------------------------------------------------------------------------------

function setupEventListeners() {
  // 1. Delegasi Event pada Grid Kartu Mobil
  DOM.carGrid.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const carId = actionBtn.dataset.id;

    if (action === 'detail') {
      openCarDetailModal(carId);
    } else if (action === 'book') {
      openBookingModal(carId);
    } else if (action === 'toggle-fav') {
      toggleFavorite(carId);
    }
  });

  // 2. Filter Pencarian Realtime
  DOM.searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    DOM.searchClearBtn.classList.toggle('hidden', e.target.value === '');
    applyFiltersAndSort();
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.filters.search = '';
    DOM.searchClearBtn.classList.add('hidden');
    applyFiltersAndSort();
    DOM.searchInput.focus();
  });

  // 3. Filter Dropdown (Brand, Bahan Bakar, Transmisi, Status, Sort)
  DOM.filterBrand.addEventListener('change', (e) => {
    state.filters.brand = e.target.value;
    applyFiltersAndSort();
  });

  DOM.filterFuel.addEventListener('change', (e) => {
    state.filters.fuel = e.target.value;
    applyFiltersAndSort();
  });

  DOM.filterTransmission.addEventListener('change', (e) => {
    state.filters.transmission = e.target.value;
    applyFiltersAndSort();
  });

  DOM.filterStatus.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    applyFiltersAndSort();
  });

  DOM.sortBy.addEventListener('change', (e) => {
    state.filters.sortBy = e.target.value;
    applyFiltersAndSort();
  });

  // 4. Quick Tags Filter
  DOM.quickTags.addEventListener('click', (e) => {
    const tagBtn = e.target.closest('.quick-tag');
    if (!tagBtn) return;

    DOM.quickTags.querySelectorAll('.quick-tag').forEach(b => b.classList.remove('active'));
    tagBtn.classList.add('active');

    state.filters.quickTag = tagBtn.dataset.filter;
    applyFiltersAndSort();
  });

  // 5. Reset Filter Buttons
  DOM.resetFilterBtn.addEventListener('click', resetAllFilters);
  DOM.emptyResetBtn.addEventListener('click', resetAllFilters);

  // 6. Tombol Retry jika Fetch Error
  DOM.retryBtn.addEventListener('click', () => {
    fetchCarsData();
  });

  // 7. Theme Switcher
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // 8. Wishlist Drawer Toggle & Removal
  DOM.wishlistBtn.addEventListener('click', () => {
    DOM.wishlistDrawer.classList.remove('hidden');
  });

  DOM.drawerCloseBtn.addEventListener('click', () => {
    DOM.wishlistDrawer.classList.add('hidden');
  });

  DOM.wishlistDrawer.addEventListener('click', (e) => {
    if (e.target === DOM.wishlistDrawer) {
      DOM.wishlistDrawer.classList.add('hidden');
    }

    const removeBtn = e.target.closest('[data-action="remove-fav"]');
    if (removeBtn) {
      toggleFavorite(removeBtn.dataset.id);
    }
  });

  DOM.clearWishlistBtn.addEventListener('click', () => {
    if (state.favorites.length === 0) return;
    if (confirm('Hapus semua mobil dari daftar favorit Anda?')) {
      state.favorites = [];
      saveFavorites();
      renderCars(state.filteredCars);
      showToast('Semua mobil favorit telah dihapus.', 'info');
    }
  });

  // 9. Modals Close Handler
  DOM.modalCloseBtn.addEventListener('click', closeDetailModal);
  DOM.detailModal.addEventListener('click', (e) => {
    if (e.target === DOM.detailModal) closeDetailModal();
  });

  DOM.bookingModalCloseBtn.addEventListener('click', closeBookingModal);
  DOM.bookingModal.addEventListener('click', (e) => {
    if (e.target === DOM.bookingModal) closeBookingModal();
  });

  // Tutup modal menggunakan tombol keyboard Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailModal();
      closeBookingModal();
      DOM.wishlistDrawer.classList.add('hidden');
    }
  });

  // 10. Form Booking Test Drive Submission
  DOM.bookLocation.addEventListener('change', (e) => {
    DOM.homeAddressGroup.style.display = e.target.value === 'home' ? 'block' : 'none';
  });

  DOM.bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('book-name').value;
    const phone = document.getElementById('book-phone').value;
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;

    closeBookingModal();
    DOM.bookingForm.reset();

    showToast(`Terima kasih Bapak/Ibu ${name}! Jadwal test drive Anda pada ${date} pukul ${time} WIB berhasil dikonfirmasi. Tim representatif kami akan menghubungi via WhatsApp.`, 'success');
  });

  // 11. Kalkulator Event Listeners
  DOM.calcCarSelect.addEventListener('change', (e) => {
    const carId = e.target.value;
    if (carId) {
      const car = state.cars.find(c => c.id === Number(carId));
      if (car) DOM.calcCarPrice.value = car.harga;
    }
    calculateLoan();
  });

  DOM.calcCarPrice.addEventListener('input', calculateLoan);
  DOM.calcDpRange.addEventListener('input', calculateLoan);
  DOM.calcInterestRate.addEventListener('input', calculateLoan);

  DOM.tenorOptions.addEventListener('click', (e) => {
    const tenorBtn = e.target.closest('.tenor-btn');
    if (!tenorBtn) return;

    DOM.tenorOptions.querySelectorAll('.tenor-btn').forEach(b => b.classList.remove('active'));
    tenorBtn.classList.add('active');
    calculateLoan();
  });

  // Tombol Ajukan Kredit Kalkulator -> Direct WhatsApp dengan rincian lengkap
  DOM.calcApplyBtn.addEventListener('click', () => {
    const carPrice = DOM.resultCarPrice.textContent;
    const dp = DOM.resultDpAmount.textContent;
    const monthly = DOM.resultMonthlyPayment.textContent;
    const activeTenor = DOM.tenorOptions.querySelector('.tenor-btn.active').textContent;

    const message = encodeURIComponent(
      `Halo Tim Pembiayaan AutoNova, saya ingin berkonsultasi mengenai simulasi kredit:\n- Harga Mobil: ${carPrice}\n- Uang Muka (DP): ${dp}\n- Tenor Pilihan: ${activeTenor}\n- Estimasi Angsuran: ${monthly}/bulan\nMohon informasi syarat pengajuan dan leasing rekanannya. Terima kasih!`
    );

    window.open(`https://wa.me/6282198091797?text=${message}`, '_blank');
  });

  // 12. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Tutup accordion lain agar bersih
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // 13. Mobile Menu Navigation Toggle
  DOM.mobileToggle.addEventListener('click', () => {
    DOM.navMenu.classList.toggle('open');
  });

  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      DOM.navMenu.classList.remove('open');
    });
  });

  // 14. Scroll Effects: Sticky Navbar & Back to Top
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      DOM.backToTop.classList.remove('hidden');
    } else {
      DOM.backToTop.classList.add('hidden');
    }
  });

  DOM.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 15. Form Kontak Showroom
  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    DOM.contactForm.reset();
    showToast(`Pesan Anda berhasil dikirim! Tim konsultan AutoNova akan segera menghubungi Bapak/Ibu ${name}.`, 'success');
  });

  // 16. Footer Filter Links
  document.querySelectorAll('.footer-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      resetAllFilters();
      if (link.dataset.brand) {
        state.filters.brand = link.dataset.brand;
        DOM.filterBrand.value = link.dataset.brand;
      }
      if (link.dataset.fuel) {
        state.filters.fuel = link.dataset.fuel;
        DOM.filterFuel.value = link.dataset.fuel;
      }
      if (link.dataset.trans) {
        state.filters.transmission = link.dataset.trans;
        DOM.filterTransmission.value = link.dataset.trans;
      }
      applyFiltersAndSort();
    });
  });
}

// ------------------------------------------------------------------------------
// INISIALISASI APLIKASI
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadFavorites();
  setupEventListeners();
  calculateLoan();
  fetchCarsData();
});
