import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || "").replace(/\s/g, "")
      }
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, bcc, subject, html }) => {
  return getTransporter().sendMail({
    from: `"Rokto Dai" <${process.env.EMAIL_USER}>`,
    to,
    bcc,
    subject,
    html
  });
};