document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const f = new FormData(e.target);
          const payload = Object.fromEntries(f.entries());
          const status = document.getElementById('status');
          status.textContent = 'Sending…';
          try {
            const res = await fetch('/api/contact', {
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(await res.text());
            status.textContent = 'Thanks — message sent.';
            e.target.reset();
          } catch (err) {
            status.textContent = 'Couldn’t send. Please try again later.';
            console.error(err);
          }
        });
    }
});