/**
 * Email sending functionality using Zeptomail API
 */

interface EmailAddress {
  address: string;
  name?: string;
}

interface EmailRecipient {
  email_address: EmailAddress;
}

interface EmailRequest {
  from: EmailAddress;
  to: EmailRecipient[];
  subject: string;
  htmlbody: string;
  textbody?: string;
}

/**
 * Sends an email using the Zeptomail API
 * @param toEmail Recipient email address
 * @param toName Recipient name
 * @param subject Email subject
 * @param htmlContent HTML content of the email
 * @returns Promise with the API response
 */
async function sendEmail(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string
): Promise<any> {
  const API_URL = "https://api.zeptomail.com/v1.1/email";
  const API_KEY = "wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g==";
  
  const emailData: EmailRequest = {
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

// Example usage:
// sendEmail("accounts@cityrenderings.com", "Rajesh Mathew", "Contact Form Submission", "<div><b>New contact form submission</b></div>")
//   .then(response => console.log("Email sent successfully:", response))
//   .catch(error => console.error("Failed to send email:", error));

export { sendEmail };