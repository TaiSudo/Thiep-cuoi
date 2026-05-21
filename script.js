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

let lightboxSwiper;
let lightboxThumbs;

// 1. Chỉ khởi tạo Swiper 1 lần duy nhất khi mở lightbox lần đầu
function ensureLightboxInitialized() {
    if (lightboxSwiper) return; // Nếu đã có rồi thì không làm gì cả

    lightboxThumbs = new Swiper(".lightboxThumbs", {
        spaceBetween: 8,
        slidesPerView: 7,
        freeMode: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true, // Cho phép click ảnh nhỏ
    });

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

// 2. Hàm mở Lightbox
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const wrapper = document.getElementById('lightbox-wrapper');
    const thumbWrapper = document.getElementById('thumb-wrapper');

    // Nạp ảnh nếu chưa có
    if (wrapper.innerHTML === '') {
        document.querySelectorAll('.mySwiper .swiper-slide:not(.swiper-slide-duplicate) img').forEach(img => {
            wrapper.innerHTML += `<div class="swiper-slide"><img src="${img.src}"></div>`;
            thumbWrapper.innerHTML += `<div class="swiper-slide"><img src="${img.src}"></div>`;
        });
    }

    // Hiển thị trước để Swiper tính toán kích thước
    lightbox.style.display = 'flex';

    // Khởi tạo hoặc Cập nhật
    ensureLightboxInitialized();
    lightboxSwiper.update();
    lightboxThumbs.update();

    // Nhảy đến slide mong muốn
    lightboxSwiper.slideTo(parseInt(index), 0);
}

// 3. Hàm đóng
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// 4. Gán sự kiện click cho ảnh album chính
document.querySelectorAll('.mySwiper .swiper-slide').forEach(slide => {
    slide.addEventListener('click', () => {
        const index = slide.getAttribute('data-swiper-slide-index') || 0;
        openLightbox(index);
    });
});

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

function openInvitation() {
    const overlay = document.getElementById('wedding-envelope');
    
    // Kích hoạt hiệu ứng xoay 3D
    overlay.classList.add('active');

    // Nếu bạn có nhạc nền, bỏ comment dòng dưới
    // document.getElementById('weddingAudio').play();
}
function createFloatingHy() {
    const hy = document.createElement('div');
    hy.classList.add('floating-hy');
    hy.innerText = '囍';
    
    // Vị trí ngang ngẫu nhiên từ trái sang phải
    hy.style.left = Math.random() * 100 + "vw";
    
    // Kích thước ngẫu nhiên (to nhỏ khác nhau nhìn sẽ mướt hơn)
    const size = Math.random() * 20 + 15 + "px";
    hy.style.fontSize = size;
    
    // Tốc độ bay ngẫu nhiên (từ 4s đến 8s)
    const duration = Math.random() * 4 + 4 + "s";
    hy.style.animationDuration = duration;
    
    // Độ mờ ngẫu nhiên để tạo chiều sâu
    hy.style.opacity = Math.random() * 0.5 + 0.2;

    document.body.appendChild(hy);

    // Xóa sau khi hoàn thành animation
    setTimeout(() => {
        hy.remove();
    }, 8000);
}

// Cứ mỗi 400ms tạo 1 chữ mới để không quá dày đặc gây rối mắt
let hyInterval = setInterval(createFloatingHy, 500);

// Cập nhật hàm mở thiệp để dừng hiệu ứng này
function openInvitation() {
    const overlay = document.getElementById('wedding-envelope');
    overlay.classList.add('active');
    
    clearInterval(hyInterval); // Dừng tạo chữ mới
    
    const elements = document.querySelectorAll('.floating-hy');
    elements.forEach(el => {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 1000);
    });
}