/**
 * Contact form handler with Zeptomail API integration
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find the contact form
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Form validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Reset previous error messages
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      
      // Validate form
      let isValid = true;
      let errors = [];
      
      if (!name) {
        document.getElementById('name').classList.add('is-invalid');
        errors.push('Name');
        isValid = false;
      }
      
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email').classList.add('is-invalid');
        errors.push('Email');
        isValid = false;
      }
      
      if (!subject) {
        document.getElementById('subject').classList.add('is-invalid');
        errors.push('Subject');
        isValid = false;
      }
      
      if (!message) {
        document.getElementById('message').classList.add('is-invalid');
        errors.push('Message');
        isValid = false;
      }
      
      if (!isValid) {
        showFormMessage(`Please complete the required fields: ${errors.join(', ')}`, 'danger');
        return;
      }
      
      // Show sending message
      showFormMessage('Sending your message...', 'info');
      
      // Disable submit button while sending
      const submitButton = contactForm.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
      }
      
      // Send email using Zeptomail API
      try {
        const response = await fetch('https://api.zeptomail.com/v1.1/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Zoho-enczapikey wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g=='
          },
          body: JSON.stringify({
            'from': {
              'address': 'noreply@cityrenderings.com',
              'name': 'City Renderings Website'
            },
            'to': [
              {
                'email_address': {
                  'address': 'accounts@cityrenderings.com',
                  'name': 'City Renderings'
                }
              }
            ],
            'subject': `Contact Form: ${subject}`,
            'htmlbody': `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${document.getElementById('phone').value ? `<p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            `
          })
        });
        
        const data = await response.json();
        
        if (data.message === "OK" || (data.data && data.data[0] && data.data[0].code === "EM_104")) {
          // Success
          showFormMessage('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          // API error
          console.error('Zeptomail API error:', data);
          showFormMessage('Sorry, there was a problem sending your message. Please try again later.', 'danger');
        }
      } catch (error) {
        // Network error
        console.error('Error sending email:', error);
        showFormMessage('Unable to send message. Please check your connection and try again.', 'danger');
      } finally {
        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message';
        }
      }
    });
  }
  
  // Helper function to show form messages
  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = `alert alert-${type} mt-3`;
      formMessage.style.display = 'block';
      
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      }
      
      // Scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});