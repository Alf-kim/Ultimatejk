const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Serve HTML files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Email route
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received message:', name, email, message); // debug log

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: `New message from ${name}`,
    text: `From: ${name}\nEmail: ${email}\n\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).send('Message sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send message.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
