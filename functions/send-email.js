// Email proxy function to handle CORS restrictions
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { name, email, phone, subject, message } = requestBody;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    
    // Format email body
    const htmlBody = `
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
    
    // Prepare the email data
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
      "htmlbody": htmlBody
    };
    
    // Call the Zeptomail API
    const fetch = require('node-fetch');
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Zoho-enczapikey wSsVR613+RH1X6womGGqJbxsy1sGVFnxER8o2FGp6iOvGfrFp8c5k0GaVAKnT/FLGTQ7HWYQpL0onEoJgTcP29wlzF0ACCiF9mqRe1U4J3x17qnvhDzKVmhakhuLLowNxgVun2VpFMkr+g=='
      },
      body: JSON.stringify(emailData)
    });
    
    const responseData = await response.json();
    
    // Return the API response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email: " + error.message })
    };
  }
};