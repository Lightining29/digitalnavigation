import nodemailer from 'nodemailer';
import config from '../config.js';

let transporter = null;

if (config.smtp.user) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
} else {
  console.warn('[email] SMTP_USER is not set — emails will NOT be sent.');
}

async function send(to, subject, html) {
  if (!transporter) return;
  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject,
    html,
  });
}

export async function sendOTP(email, otp) {
  const subject = 'Your Verification Code — Digital Innovation';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
      <h2 style="color:#1a73e8;margin-top:0;">Digital Innovation</h2>
      <p>Hello,</p>
      <p>Your one-time verification code is:</p>
      <div style="text-align:center;margin:24px 0;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#1a73e8;">${otp}</span>
      </div>
      <p style="color:#666;font-size:14px;">This code expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
      <p style="color:#999;font-size:12px;">© Digital Innovation. All rights reserved.</p>
    </div>
  `;
  await send(email, subject, html);
}

export async function notifyAdmin(subject, html) {
  if (!config.adminEmail) return;
  await send(config.adminEmail, subject, html);
}

export async function notifyNewApplication(applicantName, applicantEmail, jobTitle) {
  const subject = `New Job Application: ${jobTitle}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
      <h2 style="color:#1a73e8;margin-top:0;">New Job Application</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Position:</td><td style="padding:8px 0;">${jobTitle}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Applicant:</td><td style="padding:8px 0;">${applicantName}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Email:</td><td style="padding:8px 0;">${applicantEmail}</td></tr>
      </table>
      <p style="margin-top:16px;">Log in to the admin dashboard to review the application and download the resume.</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
      <p style="color:#999;font-size:12px;">© Digital Innovation. All rights reserved.</p>
    </div>
  `;
  await notifyAdmin(subject, html);
}

export async function notifyNewContact(name, email, subject, message) {
  const emailSubject = `New Contact Form Submission: ${subject || '(no subject)'}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
      <h2 style="color:#1a73e8;margin-top:0;">New Contact Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Name:</td><td style="padding:8px 0;">${name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Email:</td><td style="padding:8px 0;">${email}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Subject:</td><td style="padding:8px 0;">${subject || '—'}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f9f9f9;border-radius:6px;">
        <p style="margin:0;white-space:pre-wrap;">${message || '(no message)'}</p>
      </div>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
      <p style="color:#999;font-size:12px;">© Digital Innovation. All rights reserved.</p>
    </div>
  `;
  await notifyAdmin(emailSubject, html);
}
