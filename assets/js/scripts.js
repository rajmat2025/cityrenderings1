document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // --- Service Card Flip ---
    // Requirement: Services section - when clicked, will flip [cite: 18]
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    // --- Portfolio Carousel ---
    // Requirement: auto scrolling image carousel [cite: 17, 31]
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    const totalItems = items.length;

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    // Auto-scroll functionality
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000); // Change slide every 5 seconds


    // --- Contact Form Submission ---
    // Requirement: Email us form [cite: 29]
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents actual submission for this demo
        formStatus.textContent = 'Thank you! Your message has been sent.';
        formStatus.style.color = 'green';
        contactForm.reset();
        setTimeout(() => {
            formStatus.textContent = '';
        }, 5000);
    });
    
    // --- Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

});