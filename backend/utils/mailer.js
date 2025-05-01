// backend/utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

async function sendAssignmentEmail(toEmail, taskTitle, assigner) {
  const mailOptions = {
    from: '"Task Manager" <no-reply@taskmanager.com>',
    to: toEmail,
    subject: 'New Task Assigned',
    text: `${assigner} assigned you a task: "${taskTitle}"`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

module.exports = sendAssignmentEmail;
