// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Carousel functionality
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    let currentIndex = 0;
    let isPlaying = true;
    let interval;

    if (carouselInner && items.length > 0) {
        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            goToSlide(currentIndex);
        }

        function togglePlayPause() {
            isPlaying = !isPlaying;
            if (isPlaying) {
                startInterval();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                clearInterval(interval);
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }

        function startInterval() {
            interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function resetInterval() {
            clearInterval(interval);
            if (isPlaying) {
                startInterval();
            }
        }

        playPauseBtn.addEventListener('click', togglePlayPause);

        // Initialize
        goToSlide(0);
        startInterval();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
});


// Service card flip on focus for accessibility
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('focus', () => {
    card.style.transform = 'rotateY(180deg)';
  });
  card.addEventListener('blur', () => {
    card.style.transform = 'rotateY(0deg)';
  });
});
