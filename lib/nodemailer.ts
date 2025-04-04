// lib/nodemailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or use SMTP config for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
