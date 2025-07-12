const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @route   POST /api/contact
// @desc    Send contact form message
// @access  Public
router.post('/', [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('subject', 'Subject is required').notEmpty().trim(),
  body('message', 'Message is required').notEmpty().trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { name, email, subject, message } = req.body;

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8D6E63;">New Contact Form Submission</h2>
          <div style="background-color: #FDF6E3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from the Pastry News contact form.
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Pastry News',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8D6E63;">Thank you for reaching out! 🍰</h2>
          <div style="background-color: #FDF6E3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${name},</p>
            <p>Thank you for contacting Pastry News. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              <strong>Subject:</strong> ${subject}<br>
              <strong>Message:</strong> ${message}
            </div>
            <p>In the meantime, feel free to explore our latest articles and pastry news!</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.json({
      message: 'Message sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// @route   POST /api/contact/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/newsletter', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('name').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { email, name } = req.body;

    // Create transporter
    const transporter = createTransporter();

    // Notify admin about new subscription
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8D6E63;">New Newsletter Subscription</h2>
          <div style="background-color: #FDF6E3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);

    // Send welcome email to subscriber
    const welcomeMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Pastry News Newsletter! 🍰',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8D6E63;">Welcome to Pastry News! 🎉</h2>
          <div style="background-color: #FDF6E3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${name || 'Pastry Enthusiast'},</p>
            <p>Thank you for subscribing to our newsletter! You'll now receive the latest updates about:</p>
            <ul style="margin: 15px 0;">
              <li>🎂 New pastry trends and techniques</li>
              <li>👨‍🍳 Chef interviews and profiles</li>
              <li>📖 Exclusive recipes and tutorials</li>
              <li>🏆 Competition news and results</li>
              <li>📅 Upcoming events and workshops</li>
            </ul>
            <p>Stay tuned for our next newsletter filled with delicious content!</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            You can unsubscribe at any time by clicking the unsubscribe link in our emails.
          </p>
        </div>
      `
    };

    await transporter.sendMail(welcomeMailOptions);

    res.json({
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

module.exports = router; 