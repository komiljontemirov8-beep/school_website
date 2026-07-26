/*==========================================================
  cloudinary-gallery.js
  Cloudinary'dan dinamik rasm galereyasini yuklash va ko'rsatish
  Cloud Name: xpbfp64p
  Asosiy papka: images
==========================================================*/

const CLOUD_NAME = 'xpbfp64p';

// Ko'rsatiladigan papkalar ro'yhati (Cloudinary'da mavjud bo'lgan)
// Oy-nomi_yil formatida qo'shing: 'august_2026', 'september_2026', ...
const CLOUD_FOLDERS = [
    { folder: 'october', label: 'Oktabr 2025' },
    { folder: 'november', label: 'Noyabr 2025' },
    { folder: 'december', label: 'Dekabr 2025' },
    { folder: 'january', label: 'Yanvar 2026' },
    { folder: 'february', label: 'Fevral 2026' },
    { folder: 'march', label: 'Mart 2026' },
    { folder: 'april', label: 'Aprel 2026' },
    { folder: 'may', label: 'May 2026' },
    { folder: 'june', label: 'Iyun 2026' },
    { folder: 'july', label: 'Iyul 2026' },
    { folder: 'august_2026', label: 'Avgust 2026' },
    { folder: 'september_2026', label: 'Sentabr 2026' },
    { folder: 'manual', label: 'Qo\'lda qo\'shilgan' }
];

/**
 * Cloudinary list API URL yasash
 * Papka nomi 'images/' prefiksidan keyingi qism bo'ladi
 */
function getListUrl(folder) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${folder}.json`;
}

/**
 * Cloudinary'ning delivery URL yasash
 * f_auto → brauzerga mos format (WebP, AVIF, JPEG)
 * q_auto → optimal siqish sifati
 * c_fill,w_600,h_400 → bir xil o'lchamda crop
 */
function buildImgUrl(publicId, format) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,c_fill,w_600,h_400/${publicId}.${format}`;
}

/**
 * Bitta rasm kartasi (Bootstrap 5 card)
 */
function renderCard(img) {
    return `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="gallery-card card h-100 shadow-sm border-0 overflow-hidden">
        <div class="position-relative overflow-hidden">
          <img
            src="${img.src}"
            class="card-img-top gallery-img"
            alt="${img.title}"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<div class=\\'gallery-img-error d-flex align-items-center justify-content-center\\'>Rasm topilmadi</div>'">
          <div class="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <i class="fas fa-expand-alt text-white fs-3"></i>
          </div>
        </div>
        <div class="card-body py-2 px-3">
          <p class="card-text small text-muted mb-0">${img.title}</p>
        </div>
      </div>
    </div>`;
}

/**
 * Bitta oy bo'limi (sarlavha + grid)
 */
function renderSection(label, images) {
    if (!images.length) return '';
    return `
    <div class="gallery-month-section mb-5">
      <h3 class="gallery-month-title mb-4">
        <i class="fas fa-calendar-alt me-2 text-warning"></i>${label}
        <span class="badge bg-secondary ms-2">${images.length} ta rasm</span>
      </h3>
      <div class="row g-4">
        ${images.map(renderCard).join('')}
      </div>
    </div>`;
}

/**
 * Bitta papkani Cloudinary API'dan yuklash
 */
async function fetchFolder({ folder, label }) {
    try {
        const resp = await fetch(getListUrl(folder));
        if (!resp.ok) return null; // papka mavjud emas – o'tkazib yuboramiz

        const json = await resp.json();
        const resources = json.resources || [];

        if (!resources.length) return null;

        const images = resources.map(res => ({
            src: buildImgUrl(res.public_id, res.format),
            title: res.public_id.split('/').pop()   // fayl nomini title sifatida
        }));

        return { label, images };
    } catch (err) {
        console.warn(`[Gallery] "${folder}" papkasi yuklanmadi:`, err);
        return null;
    }
}

/**
 * Asosiy funksiya – barcha papkalarni parallel yuklash va sahifaga chiqarish
 */
async function loadCloudinaryGallery() {
    const container = document.getElementById('cloudinary-gallery-list');
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Yuklanmoqda…</span>
      </div>
      <p class="mt-3 text-muted">Rasmlar yuklanmoqda…</p>
    </div>`;

    // Barcha papkalarni parallel yuklash
    const results = await Promise.all(CLOUD_FOLDERS.map(fetchFolder));

    // Null bo'lganlarni (bo'sh yoki mavjud bo'lmagan) filtrlash
    const loaded = results.filter(Boolean);

    if (!loaded.length) {
        container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-image fs-1 mb-3"></i>
        <p>Hech qanday rasm topilmadi.</p>
      </div>`;
        return;
    }

    // HTML yaratish va sahifaga qo'yish
    container.innerHTML = loaded
        .map(f => renderSection(f.label, f.images))
        .join('');
}

// DOM tayyor bo'lgach ishga tushirish
document.addEventListener('DOMContentLoaded', loadCloudinaryGallery);
