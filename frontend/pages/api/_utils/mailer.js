const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendAssignmentEmail(toEmail, taskTitle, assigner) {
  const mailOptions = {
    from: `"Task Manager" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'New Task Assigned',
    text: `${assigner} assigned you a task: "${taskTitle}"`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      console.log(`✅ Email sent to ${toEmail}`);
      console.log('Response:', info.response);  // Detailed response from the mail server
    } else {
      console.log('❌ Email was not accepted by the server.');
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    // Add more error handling here if necessary
  }
}

module.exports = sendAssignmentEmail; 