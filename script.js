/**
 * Roco Painting and Services - Main JavaScript
 * Professional painting and restoration website
 */

(function() {
    'use strict';

    // ========================================
    // Language Switcher
    // ========================================
    const langSwitcher = document.getElementById('langSwitcher');
    const langCurrent = langSwitcher ? langSwitcher.querySelector('.lang-current') : null;
    const langOther = langSwitcher ? langSwitcher.querySelector('.lang-other') : null;
    
    let currentLang = 'en'; // Default language is English (US business)

    function setLanguage(lang) {
        currentLang = lang;
        
        // Update switcher display - show current language prominently
        if (langCurrent && langOther) {
            if (lang === 'en') {
                langCurrent.textContent = 'EN';
                langOther.textContent = 'ES';
            } else {
                langCurrent.textContent = 'ES';
                langOther.textContent = 'EN';
            }
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update title
        const title = document.querySelector('title');
        if (title && title.hasAttribute('data-en')) {
            title.textContent = title.getAttribute(`data-${lang}`);
        }
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en][data-es]');
        translatableElements.forEach(element => {
            // Skip title as we handle it separately
            if (element.tagName !== 'TITLE') {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    element.textContent = text;
                }
            }
        });
        
        // Update WhatsApp message
        updateWhatsAppMessage(lang);
        
        // Save preference
        localStorage.setItem('roco-lang', lang);
    }

    function updateWhatsAppMessage(lang) {
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            const enMessage = whatsappBtn.getAttribute('data-en-message');
            const esMessage = whatsappBtn.getAttribute('data-es-message');
            const message = lang === 'en' ? enMessage : esMessage;
            
            // Update href with new message
            const baseHref = 'https://wa.me/+13057137240';
            const encodedMessage = encodeURIComponent(message);
            whatsappBtn.href = `${baseHref}?text=${encodedMessage}`;
        }
    }

    function toggleLanguage() {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    }

    // ========================================
    // Mobile Navigation
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleNav() {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
    }

    function closeNav() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ========================================
    // Scroll to Top Button
    // ========================================
    const scrollTopBtn = document.getElementById('scrollTop');

    function handleScrollTop() {
        if (window.scrollY > 100) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    function smoothScroll(e, targetId) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1200; // 1.2 seconds for smoother scroll
            let startTime = null;

            // Custom easing function for smoother animation
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    // Add subtle bounce effect at the end
                    target.classList.add('section-arrive');
                    setTimeout(() => {
                        target.classList.remove('section-arrive');
                    }, 600);
                }
            }

            requestAnimationFrame(animation);
            closeNav();
        }
    }

    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================================
    // Portfolio Filter
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    function filterPortfolio(category) {
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.classList.add('visible');
                }, 50);
            } else {
                item.classList.remove('visible');
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    function setActiveFilter(targetCategory) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === targetCategory) {
                btn.classList.add('active');
            }
        });
    }

    // ========================================
    // Lightbox for Portfolio
    // ========================================
    let lightbox = null;

    function createLightbox() {
        if (lightbox) return;
        
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="">
                <div class="lightbox-caption">
                    <h4></h4>
                    <p></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    function openLightbox(imgSrc, title, category) {
        createLightbox();
        
        const img = lightbox.querySelector('img');
        const titleEl = lightbox.querySelector('.lightbox-caption h4');
        const categoryEl = lightbox.querySelector('.lightbox-caption p');
        
        img.src = imgSrc;
        img.alt = title;
        titleEl.textContent = title;
        categoryEl.textContent = category;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // Hero Carousel / Slider
    // ========================================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselSlides = carouselTrack ? carouselTrack.querySelectorAll('.carousel-slide') : [];
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselIndicators = document.getElementById('carouselIndicators');
    const indicators = carouselIndicators ? carouselIndicators.querySelectorAll('.indicator') : [];
    
    let currentSlide = 0;
    let carouselInterval = null;
    const carouselDelay = 5000; // 5 seconds per slide

    function goToSlide(index) {
        if (index < 0) {
            index = carouselSlides.length - 1;
        } else if (index >= carouselSlides.length) {
            index = 0;
        }
        
        // Remove active class from current slide and indicator
        if (carouselSlides[currentSlide]) {
            carouselSlides[currentSlide].classList.remove('active');
        }
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.remove('active');
        }
        
        currentSlide = index;
        
        // Add active class to new slide and indicator
        if (carouselSlides[currentSlide]) {
            carouselSlides[currentSlide].classList.add('active');
        }
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, carouselDelay);
    }

    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }

    function setupCarousel() {
        if (carouselSlides.length === 0) return;
        
        // Event listeners for controls
        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                nextSlide();
                stopCarousel();
                startCarousel();
            });
        }
        
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                prevSlide();
                stopCarousel();
                startCarousel();
            });
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                stopCarousel();
                startCarousel();
            });
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            hero.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
                stopCarousel();
                startCarousel();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
                stopCarousel();
                startCarousel();
            }
        }
        
        // Pause on hover
        if (hero) {
            hero.addEventListener('mouseenter', stopCarousel);
            hero.addEventListener('mouseleave', startCarousel);
        }
        
        // Start the carousel
        startCarousel();
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .fade-in');

    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ========================================
    // Modals (Privacy & Cookies)
    // ========================================
    const privacyModal = document.getElementById('privacyModal');
    const cookiesModal = document.getElementById('cookiesModal');
    const privacyLink = document.getElementById('privacyLink');
    const cookiesLink = document.getElementById('cookiesLink');
    const privacyClose = document.getElementById('privacyClose');
    const cookiesClose = document.getElementById('cookiesClose');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function setupModals() {
        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(privacyModal);
            });
        }
        
        if (cookiesLink) {
            cookiesLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(cookiesModal);
            });
        }
        
        if (privacyClose) {
            privacyClose.addEventListener('click', () => {
                closeModal(privacyModal);
            });
        }
        
        if (cookiesClose) {
            cookiesClose.addEventListener('click', () => {
                closeModal(cookiesModal);
            });
        }
        
        // Close on outside click
        if (privacyModal) {
            privacyModal.addEventListener('click', (e) => {
                if (e.target === privacyModal) {
                    closeModal(privacyModal);
                }
            });
        }
        
        if (cookiesModal) {
            cookiesModal.addEventListener('click', (e) => {
                if (e.target === cookiesModal) {
                    closeModal(cookiesModal);
                }
            });
        }
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(privacyModal);
                closeModal(cookiesModal);
            }
        });
    }

    // ========================================
    // Initialize
    // ========================================
    function init() {
        // Load saved language preference, default to English
        const savedLang = localStorage.getItem('roco-lang') || 'en';
        setLanguage(savedLang);
        
        // Event Listeners
        if (langSwitcher) {
            langSwitcher.addEventListener('click', toggleLanguage);
        }
        
        if (navToggle) {
            navToggle.addEventListener('click', toggleNav);
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                smoothScroll(e, link.getAttribute('href'));
            });
        });
        
        scrollTopBtn.addEventListener('click', scrollToTop);
        
        // Portfolio filters
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-filter');
                setActiveFilter(category);
                filterPortfolio(category);
            });
        });
        
        // Portfolio lightbox
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.portfolio-title');
                const category = item.querySelector('.portfolio-category');
                
                if (img && title && category) {
                    openLightbox(
                        img.src,
                        title.textContent,
                        category.textContent
                    );
                }
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', () => {
            handleScroll();
            handleScrollTop();
            updateActiveNav();
        });
        
        // Setup animations
        setupScrollAnimations();
        
        // Setup modals
        setupModals();
        
        // Setup carousel
        setupCarousel();
        
        // Initial check
        handleScroll();
        handleScrollTop();
        updateActiveNav();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
