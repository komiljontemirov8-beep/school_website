document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Winter/Holiday code removed as per user request

    window.toggleArchive = function () {
        const sidebar = document.getElementById('archiveSidebar');
        const btn = document.querySelector('.btn-archive-toggle');
        const icon = document.getElementById('archiveToggleIcon');

        if (sidebar.style.display === 'none') {
            sidebar.style.display = 'block';
            btn.classList.add('active');
            sidebar.classList.add('animate-slide-down');
        } else {
            sidebar.style.display = 'none';
            btn.classList.remove('active');
        }
    };


    // Contact Form AJAX Handler & Modal Logic
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // 1. Generate Reference Number
            const msgId = Math.floor(Math.random() * 10000) + 1000;
            const hiddenInput = document.getElementById('hiddenRefNum');
            if (hiddenInput) {
                hiddenInput.value = msgId;
            }

            // 2. Prepare Data (now includes the hidden ID)
            const data = new FormData(form);
            const submitBtn = form.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Yuborilmoqda... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset();
                    showSuccessModal(msgId); // Pass the SAME ID to the modal
                } else {
                    alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
                }
            } catch (error) {
                alert("Internet bilan bog'liq muammo bo'lishi mumkin.");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showSuccessModal(msgId) {
        const modal = document.getElementById('success-modal');
        const msgElement = document.getElementById('modal-message');
        const progressBar = document.getElementById('modal-progress');
        const closeBtn = document.querySelector('.close-btn');

        // Date generation
        const date = new Date();
        const dateString = date.toLocaleDateString('uz-UZ');
        const timeString = date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

        msgElement.innerHTML = `Sizning <b>#${msgId}</b>-raqamli murojaat xabaringiz <b>${dateString} ${timeString}</b> da maktab ma'muriyatiga muvaffaqiyatli yuborildi.`;

        modal.style.display = 'flex';

        // 60 seconds timer animation
        progressBar.style.width = '100%';
        progressBar.style.transition = 'none'; // reset
        void progressBar.offsetWidth; // force reflow

        progressBar.style.transition = 'width 60s linear';
        progressBar.style.width = '0%';

        const timer = setTimeout(() => {
            closeModal();
        }, 60000);

        const closeModal = () => {
            clearTimeout(timer);
            modal.style.display = 'none';
        };

        closeBtn.onclick = closeModal;

        window.onclick = (event) => {
            if (event.target == modal) {
                closeModal();
            }
        };
    }


    // Load News
    loadNews();

    async function loadNews() {
        const container = document.getElementById('news-container');
        try {
            // Add cache-busting timestamp to prevent caching old news
            const response = await fetch('news.json?t=' + new Date().getTime());
            if (!response.ok) throw new Error('News file not found');

            const news = await response.json();

            // Store globally for modal access
            window.globalNewsData = news;

            if (news.length === 0) {
                container.innerHTML = '<p class="no-news" style="text-align: center; grid-column: 1/-1;">Hozircha yangiliklar yo\'q.</p>';
                return;
            }

            container.innerHTML = ''; // Clear loading spinner

            // Generate Dynamic Navigation
            generateArchiveNavigation(news);

            let lastGroup = '';

            news.forEach(item => {
                const dateObj = new Date(item.date);

                // 1. Grouping by Month Year
                const groupKey = formatMonthYear(dateObj);
                if (groupKey !== lastGroup) {
                    const groupHeader = document.createElement('div');
                    groupHeader.className = 'col-12 mt-4 mb-2';
                    groupHeader.innerHTML = `<h3 class="border-bottom border-primary pb-2 text-primary fs-5 text-uppercase"><i class="far fa-calendar-check"></i> ${groupKey}</h3>`;
                    container.appendChild(groupHeader);
                    lastGroup = groupKey;
                }

                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4';

                const card = document.createElement('div');
                card.className = 'card h-100 shadow-sm border-0 news-card-interactive';

                // 2. Format Date
                const dateStr = formatUzbekDate(dateObj);

                let mediaHtml = '';
                if (item.video) {
                    mediaHtml = `
                        <div class="position-relative" style="height: 200px; background: #000;">
                            <video src="${item.video}" class="card-img-top w-100 h-100 news-video-preview" style="object-fit: cover;" muted loop playsinline></video>
                            <div class="position-absolute top-50 start-50 translate-middle">
                                <i class="fas fa-play-circle fa-3x text-white opacity-75"></i>
                            </div>
                        </div>
                    `;
                }
                else if (item.image) {
                    mediaHtml = `
                         <img src="${item.image}" class="card-img-top" alt="Yangilik rasmi" loading="lazy" style="height: 200px; object-fit: cover;">
                    `;
                }
                else {
                    mediaHtml = `
                         <div class="card-img-top news-placeholder d-flex align-items-center justify-content-center" style="height: 200px; background: var(--primary-gradient); opacity: 0.8;">
                            <i class="fas fa-school fa-4x text-white opacity-25"></i>
                         </div>
                    `;
                }





                const fullText = item.text || '';
                const shortText = fullText.length > 120 ? fullText.substring(0, 120) + '...' : fullText;

                // Highlight hashtags in card preview
                // Highlight hashtags in card preview safely (split by tags if any exist)
                const highlightedShortText = shortText.split(/(<[^>]+>)/g).map(part => {
                    if (part && part.startsWith('<')) return part;
                    return part.replace(/(#[^\s#.,!?;:()\[\]{}'"]+)/g, '<span class="inline-hashtag">$1</span>');
                }).join('');



                card.innerHTML = `
                    ${mediaHtml}
                    <div class="card-body d-flex flex-column" style="padding: 1.5rem;">
                        <span class="text-muted small mb-2"><i class="far fa-clock"></i> ${dateStr}</span>
                        <p class="card-text flex-grow-1" style="line-height: 1.6; margin-bottom: 1.25rem;">${highlightedShortText}</p>
                        <button class="btn btn-outline-primary btn-sm mt-auto align-self-start" style="border-radius: 20px; padding: 5px 15px;" onclick="openModal('${item.id.replace(/'/g, "\\'")}')">
                            Batafsil o'qish <i class="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                `;


                col.appendChild(card);
                container.appendChild(col);
            });

        } catch (error) {
            console.error('Error loading news:', error);
            let errorMessage = `Xatolik yuz berdi: ${error.message}`;

            // Helpful message for local file users
            if (window.location.protocol === 'file:') {
                errorMessage = `
                    <div class="alert alert-warning">
                        <strong>Diqqat!</strong> Brauzer xavfsizlik qoidalari tufayli bu faylni to'g'ridan-to'g'ri ochib bo'lmaydi.<br>
                        Iltimos, saytni ko'rish uchun <code>http://localhost:3000</code> manzilidan foydalaning.
                    </div>`;
            }

            container.innerHTML = `<div class="col-12">${errorMessage}</div>`;
        }
    }
});

// Helper: Custom Uzbek Date Formatter
function formatUzbekDate(date) {
    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month.toLowerCase()}, ${year}`;
}

function formatMonthYear(date) {
    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    return `${date.getFullYear()}-yil ${months[date.getMonth()]}`;
}

// ==================== CUSTOM MODAL LOGIC (VARIANT 2) ====================

function openModal(newsId) {
    window.currentNewsId = newsId;
    const news = window.globalNewsData.find(n => n.id === newsId);
    if (!news) return;


    // Elementlarni olish
    const modal = document.getElementById('customModal');
    const overlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalHeading = document.getElementById('modalHeading');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.getElementById('modalContent');
    const modalHashtags = document.getElementById('modalHashtags');

    // Extract hashtags and clean text
    const hashtags = news.text.match(/#[a-zA-Z0-9_]+/g) || [];
    const cleanText = news.text.replace(/#[a-zA-Z0-9_]+/g, '').trim();

    // Extract title
    let newsTitle = 'Yangilik Tafsilotlari';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = news.html || news.text;

    // Better title extraction for Telegram HTML
    const firstBold = tempDiv.querySelector('b, strong, h1, h2, h3');
    if (firstBold) {
        newsTitle = firstBold.innerText.substring(0, 100);
    } else if (cleanText) {
        const lines = cleanText.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 0) newsTitle = lines[0].substring(0, 100);
    }

    // Clean up content: preserve structure but highlight hashtags
    let contentHtml = news.html || news.text.replace(/\n/g, '<br>');

    // Safe Hashtag Highlighting: Split by HTML tags, only replace in text content
    contentHtml = contentHtml.split(/(<[^>]+>)/g).map(part => {
        if (part && part.startsWith('<')) return part;
        // Robust Hashtag Highlighting (supporting Uzbek characters and stopping at punctuation)
        return part.replace(/(#[^\s#.,!?;:()\[\]{}'"]+)/g, '<span class="inline-hashtag">$1</span>');
    }).join('');



    // Aggressive whitespace and redundant tag trimming at the beginning
    contentHtml = contentHtml.replace(/^(\s|<br>|&nbsp;|(<br\s*\/?>))+/gi, '').trim();


    // Media Handling (Image or Video)
    let videoEl = document.getElementById('modalVideo');

    // Check if modalVideo exists, if not create it
    if (!videoEl && modalImage) {
        videoEl = document.createElement('video');
        videoEl.id = 'modalVideo';
        videoEl.className = 'img-fluid rounded';
        videoEl.controls = true;
        videoEl.style.width = '100%';
        modalImage.parentNode.insertBefore(videoEl, modalImage);

        // Add play overlay
        const playOverlay = document.createElement('div');
        playOverlay.className = 'modal-play-overlay';
        playOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
        modalImage.parentNode.appendChild(playOverlay);

        videoEl.addEventListener('play', () => modalImage.parentNode.classList.add('video-playing'));
        videoEl.addEventListener('pause', () => modalImage.parentNode.classList.remove('video-playing'));
        videoEl.addEventListener('ended', () => modalImage.parentNode.classList.remove('video-playing'));

        // Toggle play on click container
        modalImage.parentNode.onclick = () => {
            if (videoEl.paused) videoEl.play();
            else videoEl.pause();
        };
    }


    const fallbackMsg = document.getElementById('videoFallbackMsg');
    if (fallbackMsg) fallbackMsg.style.display = 'none';

    if (news.video) {
        if (modalImage) modalImage.style.display = 'none';
        if (videoEl) {
            videoEl.src = news.video;
            videoEl.volume = 0.3; // Standart ovoz balandligi 30%
            videoEl.style.display = 'block';
            videoEl.play().catch(e => console.log("Auto-play blocked"));
        }
    } else if (news.isVideoPlaceholder) {
        if (modalImage) modalImage.style.display = 'none';
        if (videoEl) {
            videoEl.pause();
            videoEl.style.display = 'none';
        }

        const mediaSide = document.querySelector('.modal-image-side');
        let fbMsg = document.getElementById('videoFallbackMsg');
        if (!fbMsg) {
            fbMsg = document.createElement('div');
            fbMsg.id = 'videoFallbackMsg';
            fbMsg.style.textAlign = 'center';
            fbMsg.style.color = 'white';
            fbMsg.style.padding = '20px';
            mediaSide.appendChild(fbMsg);
        }
        fbMsg.innerHTML = `
            <div style="font-size: 50px; margin-bottom: 20px; opacity: 0.5;">📽️</div>
            <h4 style="margin-bottom: 15px;">Video hajmi juda katta</h4>
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 20px;">Ushbu videoni to'g'ridan-to'g'ri bu yerda ko'rsatib bo'lmaydi.</p>
            <a href="https://t.me/${news.id}" target="_blank" style="display: inline-block; background: #0088cc; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold;">
                Telegramda ko'rish
            </a>
        `;
        fbMsg.style.display = 'block';
    } else if (news.image) {

        if (videoEl) {
            videoEl.pause();
            videoEl.style.display = 'none';
        }
        if (modalImage) {
            modalImage.src = news.image;
            modalImage.style.display = 'block';
        }
    }
    else {
        // Fallback or hide both if no media - use CSS placeholder
        if (videoEl) {
            videoEl.pause();
            videoEl.style.display = 'none';
        }
        if (modalImage) {
            modalImage.style.display = 'none';
        }

        let fbMsg = document.getElementById('videoFallbackMsg');
        if (!fbMsg) {
            fbMsg = document.createElement('div');
            fbMsg.id = 'videoFallbackMsg';
            fbMsg.style.textAlign = 'center';
            fbMsg.style.color = 'white';
            fbMsg.style.padding = '40px 20px';
            const mediaSide = document.querySelector('.modal-image-side');
            mediaSide.appendChild(fbMsg);
        }
        fbMsg.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px; opacity: 0.3;"><i class="fas fa-school"></i></div>
            <h4 style="margin-bottom: 15px; opacity: 0.7;">Rasm mavjud emas</h4>
            <p style="font-size: 0.9rem; opacity: 0.5;">Ushbu yangilik uchun rasm biriktirilmagan.</p>
        `;
        fbMsg.style.display = 'block';
    }



    // Kontentni o'rnatish
    modalTitle.textContent = 'Yangilik Tafsilotlari';
    modalHeading.textContent = newsTitle;
    if (modalImage) modalImage.alt = newsTitle;
    modalContent.innerHTML = contentHtml;


    // Hashteglarni qo'shish
    if (hashtags.length > 0) {
        modalHashtags.innerHTML = hashtags.map(tag =>
            `<a href="#" class="modal-hashtag" onclick="event.preventDefault();">${tag}</a>`
        ).join('');
        modalHashtags.style.display = 'flex';
    } else {
        modalHashtags.style.display = 'none';
    }

    // Modalni ko'rsatish
    overlay.classList.add('active');
    modal.classList.add('active');

    // Body scroll ni to'xtatish
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('customModal');
    const overlay = document.getElementById('modalOverlay');

    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    // Body scroll ni qaytarish
    document.body.style.overflow = '';
}

// ESC tugmasi bilan yopish
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Global functions for News Interaction
function toggleNewsExpand(card) {
    document.querySelectorAll('.news-card-interactive').forEach(c => {
        if (c !== card) c.classList.remove('expanded');
    });
    card.classList.toggle('expanded');
}

function openImageModal(imgSrc) {
    let modal = document.getElementById('global-image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="close-btn" style="position:absolute; top:20px; right:30px; color:white; font-size:40px; cursor:pointer;" onclick="closeImageModal()">&times;</span>
            <img id="modal-image-content" src="" style="max-width:90%; max-height:90%;">
        `;
        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) closeImageModal();
        }
    }

    document.getElementById('modal-image-content').src = imgSrc;
    modal.style.display = 'flex';
}

function closeImageModal() {
    const modal = document.getElementById('global-image-modal');
    if (modal) modal.style.display = 'none';
}

// Theme Management
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    function applyTheme(theme) {
        body.classList.remove('theme-modern', 'theme-green');
        if (theme === 'modern') {
            body.classList.add('theme-modern');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-magic me-1"></i> Yashil';
                themeToggle.className = 'btn btn-light btn-sm rounded-pill px-3';
            }
        } else {
            body.classList.add('theme-green');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-magic me-1"></i> Modern';
                themeToggle.className = 'btn btn-outline-light btn-sm rounded-pill px-3';
            }
        }
        localStorage.setItem('theme', theme);
    }

    // Initial load
    const savedTheme = localStorage.getItem('theme') || 'modern';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('theme-modern') ? 'modern' : 'green';
            const newTheme = currentTheme === 'modern' ? 'green' : 'modern';
            applyTheme(newTheme);
        });
    }

    // Back to Top Button Logic
    const backToTop = document.getElementById('backToTop');
    const dateNav = document.getElementById('dynamicDateNav');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                // If dateNav exists and is scrolled past, or just if scrolled far enough
                if (!dateNav || dateNav.getBoundingClientRect().bottom < 0) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            } else {
                backToTop.classList.remove('show');
            }
        });
    }
})();


// Modal Navigation
function navModal(direction) {
    if (!window.globalNewsData || !window.currentNewsId) return;

    const currentIndex = window.globalNewsData.findIndex(n => n.id === window.currentNewsId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex - direction; // Telegram dates are descending, so direction -1 (prev) means index + 1? 
    // Wait, let's keep it simple: direction 1 means "next in array", which is "older" news usually.
    // Actually, let's make it intuitive: direction 1 means next item in list.

    nextIndex = currentIndex + direction;

    // Loop around
    if (nextIndex < 0) nextIndex = window.globalNewsData.length - 1;
    if (nextIndex >= window.globalNewsData.length) nextIndex = 0;

    const nextNews = window.globalNewsData[nextIndex];
    openModal(nextNews.id);
}

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('customModal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') navModal(-1);
        if (e.key === 'ArrowRight') navModal(1);
        if (e.key === 'Escape') closeModal();
    }
});
function generateArchiveNavigation(news) {
    const navContainer = document.getElementById('dynamicDateNav');
    if (!navContainer) return;

    navContainer.innerHTML = '';

    // Group news by Year and Month
    const archiveMap = {};
    news.forEach(item => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const monthName = formatMonthName(month);

        if (!archiveMap[year]) archiveMap[year] = new Set();
        archiveMap[year].add(monthName);
    });

    // Create Buttons
    const years = Object.keys(archiveMap).sort((a, b) => b - a);
    years.forEach(year => {
        // Year Button (optional or as a group label)
        const yearGroup = document.createElement('div');
        yearGroup.className = 'd-flex align-items-center me-3 mb-2';
        yearGroup.innerHTML = `<span class="badge bg-secondary me-2">${year}</span>`;

        const months = Array.from(archiveMap[year]);
        months.forEach(month => {
            const btn = document.createElement('button');
            btn.className = 'btn nav-btn btn-sm';
            btn.innerHTML = month;
            btn.onclick = () => scrollToDateSection(month, year);
            yearGroup.appendChild(btn);
        });

        navContainer.appendChild(yearGroup);
    });
}

function formatMonthName(monthIdx) {
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    return months[monthIdx];
}

function scrollToDateSection(month, year) {
    const sections = document.querySelectorAll('#news-container h3');
    for (let section of sections) {
        if (section.textContent.includes(month) && section.textContent.includes(year)) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Highlight active button
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            break;
        }
    }
}
