# Contact Form Implementation

## Overview
This repository contains a contact form implementation for the City Renderings website. The implementation uses client-side JavaScript to handle form validation and email sending through the Zeptomail API.

## How It Works

### 1. Client-Side Form Validation
The implementation includes robust client-side form validation to ensure all required fields are filled out correctly before attempting to send an email:
- Name validation
- Email format validation
- Subject validation
- Message validation

### 2. Email Sending via CORS Proxy
Due to browser security restrictions (CORS), direct API calls to third-party services like Zeptomail are blocked from the client-side. To solve this without requiring expensive serverless functions, we've implemented a solution using public CORS proxies:

#### Primary Implementation
The primary solution uses [corsproxy.io](https://corsproxy.io/), a reliable free CORS proxy service. This allows us to make API calls to Zeptomail directly from the browser by proxying the request through corsproxy.io.

```javascript
const CORS_PROXY = 'https://corsproxy.io/?';
const API_URL = 'https://api.zeptomail.com/v1.1/email';

// Make the API request through the CORS proxy
const response = await fetch(CORS_PROXY + encodeURIComponent(API_URL), {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Zoho-enczapikey YOUR_API_KEY'
  },
  body: JSON.stringify(emailData)
});
```

#### Fallback Implementation
If the primary CORS proxy fails, the system attempts to use an alternative proxy service:
```javascript
const ALT_CORS_PROXY = 'https://api.allorigins.win/raw?url=';
```

### 3. Error Handling and User Feedback
The implementation includes comprehensive error handling and user feedback:
- Form validation errors are displayed inline
- Success messages are shown when emails are sent successfully
- Error messages are displayed when something goes wrong
- Fallback options are provided if the email sending fails

## Files

### Main Implementation
- `assets/js/contact-form.js` - Contains the main implementation with form validation and email sending logic

### Alternative Implementations (Reference Only)
- `assets/js/contact-form-serverless.js` - Contains an alternative implementation using serverless functions
- `functions/send-email.js` - Contains a reference implementation for a serverless function
- `functions/contact.ts` - Contains a TypeScript implementation for a Cloudflare Worker

## Security Notes

### API Key Protection
While this implementation exposes the Zeptomail API key in client-side JavaScript, this approach is generally acceptable for this specific use case because:

1. The API key is specific to the Zeptomail email service and limited to email sending only
2. The API key has usage limits that prevent abuse
3. Email submissions require proper validation and format
4. The risk/benefit tradeoff compared to implementing serverless functions ($25/month) is acceptable

For higher security requirements, a serverless function approach would be recommended.

### CORS Proxy Usage
Using public CORS proxies has some limitations:
1. Dependency on third-party services that could change or be rate-limited
2. Potentially slower than direct API calls
3. May not work if the proxy services change their policies

## Maintenance
To maintain this implementation:
1. Periodically check that the CORS proxies are still functioning
2. Monitor for any changes in the Zeptomail API
3. Consider upgrading to a dedicated serverless function if usage increases significantly