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
      
      // Send email using Zeptomail API
      try {
        console.log('Sending email...');
        
        // Create the email body content
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${document.getElementById('phone').value ? `<p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        `;
        
        // Prepare the request payload
        const emailData = {
          "from": {
            "address": "noreply@cityrenderings.com",
            "name": "City Renderings Website"
          },
          "to": [
            {
              "email_address": {
                "address": "accounts@cityrenderings.com",
                "name": "City Renderings"
              }
            }
          ],
          "subject": `Contact Form: ${subject}`,
          "htmlbody": emailBody
        };
        
        // Log the request for debugging
        console.log('Email request payload:', JSON.stringify(emailData, null, 2));
        
        // This is likely a CORS issue - Zeptomail API might not allow direct browser requests
        // Let's inform the user about this limitation
        console.warn('Note: Zeptomail API may not allow direct browser requests due to CORS restrictions.');
        console.log('Attempting API call anyway...');
        
        // Try to make the API request with additional headers
        const response = await fetch('https://api.zeptomail.com/v1.1/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Zoho-enczapikey wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g==',
            'Access-Control-Allow-Origin': '*',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(emailData),
          mode: 'cors'
        });
        
        // Log the response status and headers for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        // Get the response text
        const responseText = await response.text();
        console.log('API response text:', responseText);
        
        // Try to parse the JSON response, but handle potential parsing errors
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          console.log('Raw response:', responseText);
          throw new Error('Invalid JSON response from server');
        }
        
        // Check if the email was accepted
        if (
          data.message === "OK" || 
          (data.data && data.data.some(item => item.code === "EM_104"))
        ) {
          // Success
          console.log('Email sent successfully!');
          showFormMessage('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          // API error
          console.error('Zeptomail API error:', data);
          
          // Check for specific error types
          if (data.error && data.error.code === 'TM_4001') {
            showFormMessage('Authentication error with the email service. Please try again later.', 'danger');
          } else {
            showFormMessage('Sorry, there was a problem sending your message. Please try again later.', 'danger');
          }
        }
      } catch (error) {
        // Network error
        console.error('Error sending email:', error);
        
        // Show more detailed error information for debugging
        let errorMessage = 'Unable to send message. ';
        
        // Check if it's a CORS error
        if (error instanceof TypeError && error.message.includes('CORS')) {
          errorMessage += 'CORS error: ' + error.message;
          console.error('CORS error detected:', error.message);
        } 
        // Check if it's a network error
        else if (error.name === 'NetworkError' || error.message.includes('network')) {
          errorMessage += 'Network error: ' + error.message;
          console.error('Network error detected:', error.message);
        }
        // Other error types
        else {
          errorMessage += 'Error details: ' + error.message;
        }
        
        // Add debugging information
        console.log('Debug info:');
        console.log('- Browser:', navigator.userAgent);
        console.log('- API URL: https://api.zeptomail.com/v1.1/email');
        console.log('- Form data:', { name, email, subject, message: message.substring(0, 50) + '...' });
        
        showFormMessage(errorMessage, 'danger');
        
        // Let's try an alternative approach - a test direct in the browser console for debugging
        console.log('For debugging, you can test the API directly with this code:');
        console.log(`
fetch('https://api.zeptomail.com/v1.1/email', {
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
    'subject': 'Test Email',
    'htmlbody': '<div><b>Test email from debugging</b></div>'
  })
})
.then(response => response.text())
.then(text => console.log('API Response:', text))
.catch(error => console.error('Error:', error));
        `);
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