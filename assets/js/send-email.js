/**
 * Email sending functionality using Zeptomail API
 */

/**
 * Sends an email using the Zeptomail API
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @returns {Promise} - Promise with the API response
 */
async function sendEmail(toEmail, toName, subject, htmlContent) {
  const API_URL = "https://api.zeptomail.com/v1.1/email";
  const API_KEY = "wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g==";
  
  const emailData = {
    from: { 
      address: "noreply@cityrenderings.com" 
    },
    to: [
      { 
        email_address: { 
          address: toEmail, 
          name: toName 
        } 
      }
    ],
    subject: subject,
    htmlbody: htmlContent
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${API_KEY}`
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}