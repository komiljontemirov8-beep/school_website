/*==========================================================
  video-archive.js
  YouTube videoarxivini videos.json dan yuklash va ko'rsatish
==========================================================*/

/**
 * YouTube video ID dan thumbnail URL yasash (maxresdefault)
 */
function getThumb(id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * YouTube embed URL yasash
 * Shorts va oddiy videonlar uchun bir xil ishlaydi
 */
function getEmbedUrl(id) {
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

/**
 * Sanani o'zbek tilida chiqarish: "13-oktabr 2025"
 */
function formatUz(dateStr) {
    const months = [
        '', 'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    const d = new Date(dateStr);
    return `${d.getDate()}-${months[d.getMonth() + 1]} ${d.getFullYear()}`;
}

/**
 * YouTube ID mavjud bo'lsa – iframe (embed),
 * yo'q bo'lsa – "tez orada" placeholder yaratish
 */
function renderVideoCard(video) {
    const hasId = !!video.youtubeId;

    const media = hasId
        ? `<div class="ratio ratio-16x9">
         <iframe
           src="${getEmbedUrl(video.youtubeId)}"
           title="${video.title}"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowfullscreen
           loading="lazy">
         </iframe>
       </div>`
        : `<div class="video-placeholder ratio ratio-16x9 d-flex align-items-center justify-content-center flex-column">
         <i class="fab fa-youtube fs-1 mb-2 text-danger"></i>
         <span class="small">Tez orada qo'shiladi</span>
       </div>`;

    return `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="video-card card h-100 shadow-sm border-0">
        ${media}
        <div class="card-body py-2 px-3">
          <h5 class="card-title video-card-title">${video.title}</h5>
          <p class="card-text small text-muted mb-0">
            <i class="fas fa-calendar-alt me-1"></i>${formatUz(video.date)}
          </p>
          ${video.description ? `<p class="card-text small text-muted mt-1 mb-0">${video.description}</p>` : ''}
        </div>
      </div>
    </div>`;
}

/**
 * Oy sarlavhasi + grid
 */
function renderMonthSection(monthLabel, videos) {
    return `
    <div class="gallery-month-section mb-5">
      <h3 class="gallery-month-title mb-4">
        <i class="fas fa-film me-2 text-warning"></i>${monthLabel}
        <span class="badge bg-secondary ms-2">${videos.length} ta video</span>
      </h3>
      <div class="row g-4">
        ${videos.map(renderVideoCard).join('')}
      </div>
    </div>`;
}

/**
 * Asosiy funksiya – JSON yuklash va sahifaga chiqarish
 */
async function loadVideoArchive() {
    const container = document.getElementById('video-archive-list');
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Yuklanmoqda…</span>
      </div>
      <p class="mt-3 text-muted">Videolar yuklanmoqda…</p>
    </div>`;

    try {
        const resp = await fetch('videos.json');
        if (!resp.ok) throw new Error('videos.json topilmadi');
        const data = await resp.json();

        // Oylarga guruhlash
        const months = {};
        data.videos.forEach(v => {
            const d = new Date(v.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('uz-UZ', { month: 'long', year: 'numeric' });
            if (!months[key]) months[key] = { label, videos: [] };
            months[key].videos.push(v);
        });

        // Sanaga qarab tartiblash (yangi → eski)
        const sorted = Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));

        const html = sorted.map(([, m]) => renderMonthSection(m.label, m.videos)).join('');

        container.innerHTML = html || `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-video-slash fs-1 mb-3"></i>
        <p>Hech qanday video topilmadi.</p>
      </div>`;

    } catch (err) {
        console.error('[VideoArchive]', err);
        container.innerHTML = `
      <div class="text-center py-5 text-danger">
        <i class="fas fa-exclamation-circle fs-1 mb-3"></i>
        <p>Videolar yuklanmadi. Keyinroq urinib ko'ring.</p>
      </div>`;
    }
}

document.addEventListener('DOMContentLoaded', loadVideoArchive);
