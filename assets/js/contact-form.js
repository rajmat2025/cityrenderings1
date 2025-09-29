/**
 * Contact form handler for City Renderings website
 */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

/**
 * Handles the form submission event
 * @param {Event} event - The form submission event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  // Get form elements
  const form = event.target;
  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const messageInput = form.querySelector('[name="message"]');
  const submitButton = form.querySelector('[type="submit"]');
  
  if (!nameInput || !emailInput || !messageInput) {
    showFormMessage('Error: Form is missing required fields', true);
    return;
  }
  
  // Get form values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  
  // Validate form
  if (!name || !email || !message) {
    showFormMessage('Please fill in all fields', true);
    return;
  }
  
  // Disable submit button and show loading state
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }
  
  try {
    // Format email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 10px; background: #f5f5f5; border-left: 4px solid #ddd;">
          ${escapeHtml(message).replace(/\n/g, '<br>')}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          This message was sent from the contact form on cityrenderings.com
        </p>
      </div>
    `;
    
    // Send email to site owner
    const result = await sendEmail(
      'accounts@cityrenderings.com', 
      'City Renderings', 
      `New contact from ${name}`, 
      htmlContent
    );
    
    // Check response
    if (result.message === "OK") {
      // Clear form
      form.reset();
      showFormMessage('Thank you! Your message has been sent.', false);
    } else {
      throw new Error('Email API returned an unexpected response');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    showFormMessage('Sorry, there was a problem sending your message. Please try again later.', true);
  } finally {
    // Reset submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send';
    }
  }
}

/**
 * Shows a message to the user after form submission
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showFormMessage(message, isError) {
  // Find or create message element
  let messageElement = document.getElementById('formMessage');
  
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'formMessage';
    const form = document.getElementById('contactForm');
    if (form) {
      form.parentNode.insertBefore(messageElement, form.nextSibling);
    }
  }
  
  // Set message content and styling
  messageElement.textContent = message;
  messageElement.className = isError ? 'form-error' : 'form-success';
  messageElement.style.padding = '10px';
  messageElement.style.margin = '10px 0';
  messageElement.style.borderRadius = '4px';
  messageElement.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
  messageElement.style.color = isError ? '#c62828' : '#2e7d32';
  messageElement.style.border = `1px solid ${isError ? '#ffcdd2' : '#a5d6a7'}`;
  
  // Scroll to message
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} unsafe - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}