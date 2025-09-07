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

// Pause carousels on hover for accessibility
document.querySelectorAll('.carousel').forEach(c => {
  c.addEventListener('mouseenter', () => {
    if (c.querySelector('.carousel-track')) {
      c.querySelector('.carousel-track').style.animationPlayState = 'paused';
    }
  });
  c.addEventListener('mouseleave', () => {
    if (c.querySelector('.carousel-track')) {
      c.querySelector('.carousel-track').style.animationPlayState = 'running';
    }
  });
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
