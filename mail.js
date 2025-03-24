const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.redirect("https://Digipants.com/");
});

// Endpoint to handle email sending
app.post("/send-data", async (req, res) => {
  let { Name, Last_Name, Email, formType, Mobile, Budget, Message, Services } = req.body;

  if (!Email) {
      return res.status(400).json({ error: "Email is required" });
  }

  if (!Array.isArray(Services)) {
      Services = Services ? [Services] : [];
  }

  console.log("Received Data:", req.body);


  // Set up the email transporter (Gmail)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  let mailOptionsUser, mailOptionsAdmin;

  if (formType === "Contact") {
    // Contact form logic
    mailOptionsUser = {
      from: "'Digipants' <devs@digipants.com>",
      to: Email, 
      subject: `Digipants - Thank You for Contacting Us`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #f77d32;">🙏 Thank You for Contacting Digipants 🙏</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi ${Name},</p>
        <p style="font-size: 16px; color: #555;">Thank you for reaching out. We will get back to you shortly.</p>
        <p style="font-size: 16px; color: #555;">If you have urgent concerns, contact us at <a href="mailto:support@Digipants.live" style="color: #f77d32; text-decoration: none;">support@Digipants.live</a>.</p>
        <p style="font-size: 16px; color: #555;">Best regards,<br>Digipants Team</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 Digipants. All rights reserved.</p>
            <p><a href="https://Digipants.com" style="color: #f77d32; text-decoration: none;">Visit Our Website</a></p>
        </div>
    </div>
</body>`
    };

    mailOptionsAdmin = {
      from: "'Digipants' <devs@digipants.com>",
      to: `'Digipants' <devs@digipants.com>`,
      subject: `New Query from ${Name}`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #f77d32;">📩 New Query Received - Digipants 📩</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi Tech Support Team,</p>
        <p style="font-size: 16px; color: #555;">A new query has been received from the contact form.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <th style="padding: 10px; background-color: #f77d32; color: white; text-align: left;">Details</th>
                <th style="padding: 10px; background-color: #f77d32; color: white; text-align: left;">Information</th>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Full Name:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${Name} ${Last_Name}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Email:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${Email}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Mobile:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${Mobile}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Services:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${Services}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Budget:</td>
                <td style="padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">${Budget}</td>
            </tr>
        </table>
        <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
        <blockquote style="background-color: #f9f9f9; border-left: 4px solid #f77d32; padding: 10px; margin: 10px 0;">${Message}</blockquote>
        <p style="font-size: 16px; color: #555;">Please respond to this query as soon as possible.</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 Digipants. All rights reserved.</p>
            <p><a href="https://Digipants.com" style="color: #f77d32; text-decoration: none;">Visit Digipants</a></p>
        </div>
    </div>
</body>`
    };

  } else if (formType === "subscription") {
    // Subscription form logic
    mailOptionsUser = {
      from: "'Digipants' <devs@digipants.com>",
      to: Email, 
      subject: `Digipants - Subscription Confirmation`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #f77d32;">🎉 Thank You for Subscribing to Digipants 🎉</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">Hi ${Name || 'Subscriber'},</p>
        <p style="font-size: 16px; color: #555;">Thank you for subscribing to Digipants updates. We’ll keep you informed with the latest news and offers.</p>
        <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out.</p>
        <p style="font-size: 16px; color: #555;">Best regards,<br>Digipants Team</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 Digipants. All rights reserved.</p>
            <p><a href="https://Digipants.com" style="color: #f77d32; text-decoration: none;">Visit Our Website</a></p>
        </div>
    </div>
</body>`
    };

    mailOptionsAdmin = {
      from: "'Digipants' <devs@digipants.com>",
      to: `'Digipants' <devs@digipants.com>`,
      subject: `New Subscription from ${Name}`,
      html: `<body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
        <h2 style="text-align: center; color: #f77d32;">📩 New Subscription - Digipants 📩</h2>
        <p style="margin-top: 20px; font-size: 16px; color: #555;">A new subscription has been received from <strong>${Email}</strong>.</p>
        <p style="font-size: 16px; color: #555;">Please follow up with appropriate emails as needed.</p>
        <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>&copy; 2025 Digipants. All rights reserved.</p>
            <p><a href="https://Digipants.com" style="color: #f77d32; text-decoration: none;">Visit Digipants</a></p>
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
