/**
 * Contact form handler with serverless function approach
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
      const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
      
      // Reset previous error messages
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      document.querySelectorAll('.validation-message.show').forEach(el => el.classList.remove('show'));
      
      // Validate form
      let isValid = true;
      let errors = [];
      
      if (!name) {
        document.getElementById('name').classList.add('is-invalid');
        document.getElementById('name-validation').classList.add('show');
        errors.push('Name');
        isValid = false;
      }
      
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email').classList.add('is-invalid');
        document.getElementById('email-validation').classList.add('show');
        errors.push('Email');
        isValid = false;
      }
      
      if (!subject) {
        document.getElementById('subject').classList.add('is-invalid');
        document.getElementById('subject-validation').classList.add('show');
        errors.push('Subject');
        isValid = false;
      }
      
      if (!message) {
        document.getElementById('message').classList.add('is-invalid');
        document.getElementById('message-validation').classList.add('show');
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
      
      // Send email using serverless function
      try {
        console.log('Sending email through serverless function...');
        
        // Prepare form data
        const formData = {
          name,
          email,
          phone,
          subject,
          message
        };
        
        // Call the serverless function
        const response = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        // Get the response
        const responseText = await response.text();
        console.log('Function response text:', responseText);
        
        // Parse the response JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          console.log('Raw response:', responseText);
          throw new Error('Invalid JSON response from server');
        }
        
        // Check if the email was sent successfully
        if (response.ok && (data.message === "OK" || (data.data && data.data.some(item => item.code === "EM_104")))) {
          // Success
          console.log('Email sent successfully!');
          showFormMessage('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          // API error
          console.error('Email sending error:', data);
          showFormMessage('Sorry, there was a problem sending your message. Please try again later.', 'danger');
        }
      } catch (error) {
        // Network or other error
        console.error('Error sending email:', error);
        
        let errorMessage = 'Unable to send message. ';
        
        if (error.message) {
          errorMessage += 'Error details: ' + error.message;
        }
        
        showFormMessage(errorMessage, 'danger');
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