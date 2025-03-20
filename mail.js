const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 8080;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Redirect to Amazon.com
app.get("/", (req, res) => {
  res.redirect("https://quicksquad.live/");
});

// Endpoint to handle email sending
app.post("/send-email", async (req, res) => {
  const { name, email, message, formType, category, sub_category } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Set up the email transporter (Gmail)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user, // Your Gmail address
      pass: process.env.pass, // Your generated app password
    },
  });

  let mailOptionsUser, mailOptionsAdmin;

  if (formType === "contact") {
    // Contact form logic
    mailOptionsUser = {
      from: "'QuickSquad' <devs@digipants.com>",
      to: email, 
      subject: `QuickSquad - Thank You for Contacting Us`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #007bff;">🙏 Thank You for Contacting QuickSquad 🙏</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi ${name},</p>
        <p style="font-size: 16px; color: #555;">Thank you for reaching out. We will get back to you shortly.</p>
        <p style="font-size: 16px; color: #555;">If you have urgent concerns, contact us at <a href="mailto:support@quicksquad.live" style="color: #007bff; text-decoration: none;">support@quicksquad.live</a>.</p>
        <p style="font-size: 16px; color: #555;">Best regards,<br>QuickSquad Team</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 QuickSquad. All rights reserved.</p>
            <p><a href="https://quicksquad.live" style="color: #007bff; text-decoration: none;">Visit Our Website</a></p>
        </div>
    </div>
</body>`
    };

    mailOptionsAdmin = {
      from: "'QuickSquad' <devs@digipants.com>",
      to: `'QuickSquad' <devs@digipants.com>`,
      subject: `New Query from ${name}`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #007bff;">📩 New Query Received - QuickSquad 📩</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi Tech Support Team,</p>
        <p style="font-size: 16px; color: #555;">A new query has been received from the contact form.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <th style="padding: 10px; background-color: #007bff; color: white; text-align: left;">Details</th>
                <th style="padding: 10px; background-color: #007bff; color: white; text-align: left;">Information</th>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Category:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${category}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Sub-Category:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${sub_category}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Customer Name:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Customer Email:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${email}</td>
            </tr>
        </table>
        <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
        <blockquote style="background-color: #f9f9f9; border-left: 4px solid #007bff; padding: 10px; margin: 10px 0;">${message}</blockquote>
        <p style="font-size: 16px; color: #555;">Please respond to this query as soon as possible.</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 QuickSquad. All rights reserved.</p>
            <p><a href="https://quicksquad.live" style="color: #007bff; text-decoration: none;">Visit QuickSquad</a></p>
        </div>
    </div>
</body>`
    };

  } else if (formType === "subscription") {
    // Subscription form logic
    mailOptionsUser = {
      from: "'QuickSquad' <devs@digipants.com>",
      to: email, 
      subject: `QuickSquad - Subscription Confirmation`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #007bff;">🎉 Thank You for Subscribing to QuickSquad 🎉</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi ${name || 'Subscriber'},</p>
        <p style="font-size: 16px; color: #555;">Thank you for subscribing to QuickSquad updates. We’ll keep you informed with the latest news and offers.</p>
        <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out.</p>
        <p style="font-size: 16px; color: #555;">Best regards,<br>QuickSquad Team</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 QuickSquad. All rights reserved.</p>
            <p><a href="https://quicksquad.live" style="color: #007bff; text-decoration: none;">Visit Our Website</a></p>
        </div>
    </div>
</body>`
    };

    mailOptionsAdmin = {
      from: "'QuickSquad' <devs@digipants.com>",
      to: `'QuickSquad' <devs@digipants.com>`,
      subject: `New Subscription from ${name}`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #007bff;">📩 New Subscription - QuickSquad 📩</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">A new subscription has been received from <strong>${email}</strong>.</p>
        <p style="font-size: 16px; color: #555;">Please follow up with appropriate emails as needed.</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 QuickSquad. All rights reserved.</p>
            <p><a href="https://quicksquad.live" style="color: #007bff; text-decoration: none;">Visit QuickSquad</a></p>
        </div>
    </div>`
    };
  }

  try {
    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);
    res.send(`<script>alert("Email sent successfully!"); window.location.href = "/";</script>`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.send(`<script>alert("Failed to send email. Please try again."); window.history.back();</script>`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
