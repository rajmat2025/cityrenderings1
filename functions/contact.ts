export const onRequestOptions: PagesFunction = async ({ env }) =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const cors = {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { name, email, phone = "", subject, desc, website = "" } = await request.json();

    // honeypot
    if (website) return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });

    // validation
    if (!name || !email || !subject || !desc) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: cors });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: cors });
    }
    if (String(subject).length > 120 || String(desc).length > 5000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 400, headers: cors });
    }

    const text =
`New contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${desc}
`;

    // ZeptoMail REST call (confirm endpoint name in your Zepto dashboard; v1.1 is common)
    const r = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Authorization": `Zoho-enczapikey ${env.ZEPTO_TOKEN}`, // or Zoho-encapikey per your panel
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:        { address: env.FROM_EMAIL },
        reply_to:    [{ address: email }],
        to:          [{ email_address: { address: env.TO_EMAIL } }],
        subject:     `[CityRenderings] ${subject}`,
        textbody:    text
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      return new Response(JSON.stringify({ error: "Email send failed", detail }), { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400, headers: cors });
  }
};
