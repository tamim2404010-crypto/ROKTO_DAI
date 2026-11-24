import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || "").replace(/\s/g, "")
      }
    });
  }
  return transporter;
};

const toList = (value) =>
  (Array.isArray(value) ? value : value ? [value] : []).map((email) => ({ email }));

// Brevo HTTP API (Render/production a kaj kore)
const sendWithBrevo = async ({ to, bcc, subject, html }) => {
  const body = {
    sender: { name: "Rokto Dai", email: process.env.EMAIL_USER },
    to: toList(to),
    subject,
    htmlContent: html
  };

  const bccList = toList(bcc);
  if (bccList.length > 0) body.bcc = bccList;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo ${res.status}: ${text}`);
  }

  return res.json();
};

export const sendEmail = async (options) => {
  // BREVO_API_KEY thakle API, na thakle local a Gmail
  if (process.env.BREVO_API_KEY) {
    return sendWithBrevo(options);
  }

  return getTransporter().sendMail({
    from: `"Rokto Dai" <${process.env.EMAIL_USER}>`,
    ...options
  });
};