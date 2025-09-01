// Update year
document.getElementById('year').textContent = new Date().getFullYear();

// Pause carousels on hover for accessibility
document.querySelectorAll('.carousel').forEach(c => {
  c.addEventListener('mouseenter', () => c.querySelector('.carousel-track').style.animationPlayState = 'paused');
  c.addEventListener('mouseleave', () => c.querySelector('.carousel-track').style.animationPlayState = 'running');
});
