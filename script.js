// 1. Khởi tạo hiệu ứng Cuộn trang
AOS.init({ duration: 1000, once: true });

// 2. Swiper Album chính ở ngoài trang
const mainSwiper = new Swiper(".mySwiper", { 
    effect: "coverflow", 
    centeredSlides: true, 
    slidesPerView: "auto", 
    loop: true, 
    coverflowEffect: { rotate: 30, depth: 200, modifier: 1, slideShadows: true }
});

// 3. Khởi tạo Lightbox Swiper (Để sẵn đó)
let lightboxSwiper;
let lightboxThumbs;

function initLightboxSwiper() {
    // Khởi tạo ảnh nhỏ trước
    lightboxThumbs = new Swiper(".lightboxThumbs", {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
    });

    // Khởi tạo ảnh to sau và kết nối với ảnh nhỏ
    lightboxSwiper = new Swiper(".lightboxSwiper", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: lightboxThumbs,
        },
    });
}

// 4. Hàm mở Lightbox
document.querySelectorAll('.mySwiper .swiper-slide img').forEach((img, index) => {
    img.onclick = () => {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-wrapper');
        const thumbWrapper = document.getElementById('thumb-wrapper');

        // Xóa dữ liệu cũ nếu có
        wrapper.innerHTML = '';
        thumbWrapper.innerHTML = '';

        // Lấy tất cả ảnh từ Album chính bỏ vào Lightbox
        document.querySelectorAll('.mySwiper .swiper-slide:not(.swiper-slide-duplicate) img').forEach(mainImg => {
            wrapper.innerHTML += `<div class="swiper-slide"><img src="${mainImg.src}"></div>`;
            thumbWrapper.innerHTML += `<div class="swiper-slide"><img src="${mainImg.src}"></div>`;
        });

        lightbox.style.display = 'flex';
        
        // Khởi tạo Swiper cho Lightbox
        initLightboxSwiper();
        
        // Nhảy đến đúng ảnh vừa bấm (trừ đi các slide duplicate của loop)
        const realIndex = img.closest('.swiper-slide').getAttribute('data-swiper-slide-index');
        lightboxSwiper.slideTo(realIndex, 0);
    };
});

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    if(lightboxSwiper) lightboxSwiper.destroy();
    if(lightboxThumbs) lightboxThumbs.destroy();
}

// 5. Countdown và các hàm khác giữ nguyên của bạn...
const weddingDate = new Date("June 10, 2026 17:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const dist = weddingDate - now;
    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((dist % (1000 * 60)) / 1000);
    document.getElementById("timer").innerHTML = `${d} ngày ${h} giờ ${m} phút ${s} giây`;
}, 1000);

function openRSVP() { document.getElementById('rsvp-modal').style.display = 'flex'; }
function closeRSVP() { document.getElementById('rsvp-modal').style.display = 'none'; }
function openBankModal() { document.getElementById('bank-modal').style.display = 'flex'; }
function closeBankModal() { document.getElementById('bank-modal').style.display = 'none'; }
function jumpMascots() {
    const left = document.querySelector('.child-left');
    const right = document.querySelector('.child-right');
    left.classList.add('jump'); right.classList.add('jump');
    setTimeout(() => { left.classList.remove('jump'); right.classList.remove('jump'); }, 500);
}

const audio = document.getElementById('weddingAudio');
const musicBtn = document.getElementById('music-control');

// Hàm bật/tắt nhạc
musicBtn.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        this.classList.add('music-play');
    } else {
        audio.pause();
        this.classList.remove('music-play');
    }
});

// Tự động phát khi người dùng chạm lần đầu vào màn hình
document.addEventListener('click', function() {
    audio.play();
    musicBtn.classList.add('music-play');
}, { once: true }); // "once: true" để chỉ chạy 1 lần duy nhất khi khách mở trang

function openWeddingCard() {
    const audio = document.getElementById('weddingAudio');
    const envelope = document.getElementById('wedding-envelope');

    // 1. Ép phát nhạc (Phải nằm ngay đầu hàm để trình duyệt ghi nhận tương tác)
    if (audio) {
        audio.muted = false; // Đảm bảo không bị tắt tiếng
        audio.play().then(() => {
            console.log("Nhạc đang phát...");
        }).catch(error => {
            console.log("Lỗi phát nhạc: ", error);
            // Một số trình duyệt mobile cần 'resume' context âm thanh
            audio.load();
            audio.play();
        });
    }

    // 2. Hiệu ứng mở thiệp và cuộn trang
    envelope.style.opacity = '0';
    setTimeout(() => {
        envelope.style.display = 'none';
        
        // Cuộn xuống nội dung
        const target = document.getElementById('wedding-info');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 800);
}