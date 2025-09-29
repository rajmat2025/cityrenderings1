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
      
      // Send email using Zeptomail API through a CORS proxy
      try {
        console.log('Sending email...');
        
        // Get the phone value safely
        const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
        
        // Create the email body content
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
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
        
        // Using a CORS proxy to bypass CORS restrictions
        // Options: 
        // 1. https://corsproxy.io/ - Reliable free proxy
        // 2. https://cors-anywhere.herokuapp.com/ - Requires temporary access
        // 3. https://api.allorigins.win/raw?url= - Another option
        // 4. https://proxy.cors.sh/ - Yet another option
        
        const CORS_PROXY = 'https://corsproxy.io/?'; // Most reliable free option
        const API_URL = 'https://api.zeptomail.com/v1.1/email';
        
        console.log('Sending through CORS proxy:', CORS_PROXY);
        
        // Make the API request through the CORS proxy
        const response = await fetch(CORS_PROXY + encodeURIComponent(API_URL), {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Zoho-enczapikey wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g=='
          },
          body: JSON.stringify(emailData)
        });
        
        // Log the response status for debugging
        console.log('Response status:', response.status);
        
        // If the response is not successful, log more details
        if (!response.ok) {
          console.warn(`CORS proxy returned status ${response.status}`);
          console.log('Response headers:', [...response.headers.entries()]);
          
          // If the status is 429 or 403, the proxy might have rate-limited us
          if (response.status === 429 || response.status === 403) {
            console.error('CORS proxy rate limit may have been exceeded. Trying alternative...');
            throw new Error('CORS proxy rate limited');
          }
        }
        
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
        // Network or CORS error
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
        
        console.log('Debug info:');
        console.log('- Browser:', navigator.userAgent);
        console.log('- Form data:', { name, email, subject, message: message.substring(0, 50) + '...' });
        
        showFormMessage(errorMessage, 'danger');
        
        // Try an alternative CORS proxy if the first one fails
        console.log('Trying alternative CORS proxy...');
        
        try {
          // Prepare email data again
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
            "htmlbody": `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${document.getElementById('phone') && document.getElementById('phone').value ? 
                  `<p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            `
          };
          
          // Try an alternative proxy
          const ALT_CORS_PROXY = 'https://api.allorigins.win/raw?url=';
          console.log('Using alternative proxy:', ALT_CORS_PROXY);
          
          // Make request with different proxy
          fetch(ALT_CORS_PROXY + encodeURIComponent('https://api.zeptomail.com/v1.1/email'), {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Zoho-enczapikey wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g=='
            },
            body: JSON.stringify(emailData)
          })
          .then(response => response.text())
          .then(text => {
            console.log('Alternative proxy response:', text);
            try {
              const data = JSON.parse(text);
              if (data.message === "OK" || (data.data && data.data.some(item => item.code === "EM_104"))) {
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
              }
            } catch (e) {
              console.error('Error parsing alternative response:', e);
            }
          })
          .catch(altError => {
            console.error('Alternative proxy error:', altError);
            // Show alternative contact message after both methods fail
            showFormMessage('Please contact us directly at accounts@cityrenderings.com or try again later.', 'warning');
          });
        } catch (altError) {
          console.error('Alternative approach error:', altError);
          // Final fallback - offer a direct mailto link
          const fallbackMessage = document.createElement('div');
          fallbackMessage.innerHTML = `
            <div class="alert alert-warning mt-3">
              <p>We're experiencing technical difficulties with our contact form.</p>
              <p>Please try one of these options instead:</p>
              <p>1. <a href="mailto:accounts@cityrenderings.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (document.getElementById('phone') ? document.getElementById('phone').value : '') + '\n\n' + message)}">Click here to send via email client</a></p>
              <p>2. Email us directly at accounts@cityrenderings.com</p>
            </div>
          `;
          
          const formMessageEl = document.getElementById('formMessage');
          if (formMessageEl) {
            formMessageEl.innerHTML = '';
            formMessageEl.appendChild(fallbackMessage);
            formMessageEl.style.display = 'block';
            formMessageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
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