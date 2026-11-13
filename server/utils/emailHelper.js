// server/utils/emailHelper.js
// Week 15 — Email notification helper for rural college remote classroom
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

const nodemailer = require("nodemailer");

/**
 * Creates a reusable transporter using environment SMTP config.
 * Falls back gracefully when credentials are missing (dev mode).
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

/**
 * sendEmail — Sends a plain-text or HTML email.
 * @param {Object} opts
 * @param {string|string[]} opts.to      - Recipient(s)
 * @param {string}          opts.subject - Subject line
 * @param {string}          [opts.text]  - Plain-text body
 * @param {string}          [opts.html]  - HTML body (overrides text)
 * @returns {Promise<Object>} Nodemailer info object
 */
async function sendEmail({ to, subject, text, html }) {
  if (!process.env.SMTP_USER) {
    console.warn("[emailHelper] SMTP_USER not set — email not sent (dev mode)");
    return { skipped: true };
  }
  const transporter = createTransporter();
  const mailOptions = {
    from: `"GyaanSetu" <${process.env.SMTP_USER}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    ...(html ? { html } : { text }),
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`[emailHelper] Message sent: ${info.messageId}`);
  return info;
}

/**
 * sendBulkEmails — Fire parallel emails to a list of recipients.
 * Rate-limited to avoid SMTP throttling (max 5 concurrent).
 * @param {Array<{to, subject, text?, html?}>} messages
 * @returns {Promise<Array>} Array of settled results
 */
async function sendBulkEmails(messages) {
  const CONCURRENCY = 5;
  const results = [];
  for (let i = 0; i < messages.length; i += CONCURRENCY) {
    const batch = messages.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map(sendEmail));
    results.push(...batchResults);
  }
  return results;
}

/**
 * sendDeadlineReminder — Specialized template for assignment deadline alerts.
 * @param {string}   to           - Student email
 * @param {string}   studentName  - Student display name
 * @param {string}   title        - Assignment title
 * @param {string}   deadline     - Human-readable deadline string
 * @param {string}   classroomName
 */
async function sendDeadlineReminder(to, studentName, title, deadline, classroomName) {
  const subject = `[GyaanSetu] Deadline Reminder: "${title}" due ${deadline}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#1a73e8;padding:20px 24px">
        <h2 style="color:#fff;margin:0">GyaanSetu — Deadline Reminder</h2>
      </div>
      <div style="padding:24px">
        <p>Hi <strong>${studentName}</strong>,</p>
        <p>This is a reminder that your assignment <strong>"${title}"</strong> in <em>${classroomName}</em> is due on <strong>${deadline}</strong>.</p>
        <p>Please submit before the deadline to avoid late penalties.</p>
        <p style="margin-top:28px;color:#757575;font-size:12px">
          You received this email because you are enrolled in a GyaanSetu classroom.<br/>
          SKIT CSE 2023-2027 | Group 39 — Remote Classroom for Rural Colleges
        </p>
      </div>
    </div>`;
  return sendEmail({ to, subject, html });
}

module.exports = { sendEmail, sendBulkEmails, sendDeadlineReminder };
