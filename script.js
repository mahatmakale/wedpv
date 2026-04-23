document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Intersection Observer for Scroll Animations
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated in
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));


    // ==========================================
    // Lightbox Functionality
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');

    let currentIndex = 0;
    const totalImages = galleryItems.length;
    let touchStartX = 0;
    let touchEndX = 0;

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            currentIndex = parseInt(item.getAttribute('data-index'));
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Optional: clear image src to prevent flashing old image on next open
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Update Image and Counter
    const updateLightboxContent = () => {
        // Ensure index wraps around correctly
        if (currentIndex < 0) currentIndex = totalImages - 1;
        if (currentIndex >= totalImages) currentIndex = 0;

        const currentItem = document.querySelector(`.gallery-item[data-index="${currentIndex}"] img`);
        if (currentItem) {
            const imgSrc = currentItem.getAttribute('src');
            
            // Add slight fade effect for image transition
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = imgSrc;
                lightboxImg.style.opacity = '1';
            }, 150);
            
            lightboxCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
        }
    };

    // Navigation
    const nextImage = () => {
        currentIndex++;
        updateLightboxContent();
    };

    const prevImage = () => {
        currentIndex--;
        updateLightboxContent();
    };

    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Swipe Gestures for Mobile
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    const handleSwipe = () => {
        const threshold = 50; // Minimum distance to be considered a swipe
        if (touchEndX < touchStartX - threshold) {
            nextImage(); // Swipe left
        }
        if (touchEndX > touchStartX + threshold) {
            prevImage(); // Swipe right
        }
    };
    // ==========================================
    // Video Audio Handling
    // ==========================================
    const enterBtn = document.querySelector('.scroll-indicator');
    const videoIframe = document.getElementById('wedding-video');

    if (enterBtn && videoIframe) {
        enterBtn.addEventListener('click', () => {
            // Browsers block autoplay with sound unless there is a user interaction.
            // By clicking 'Enter', the user provides that interaction, allowing us to unmute.
            videoIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            videoIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        });
    }
});
