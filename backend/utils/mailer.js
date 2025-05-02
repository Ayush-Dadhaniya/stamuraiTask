// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Transporter error:', err);
  } else {
    console.log('Ready to send email');
  }
});

async function sendAssignmentEmail(toEmail, taskTitle, assigner) {
  const mailOptions = {
    from: `"Task Manager" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'New Task Assigned',
    text: `${assigner} assigned you a task: "${taskTitle}"`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

module.exports = sendAssignmentEmail;
