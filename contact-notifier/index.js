const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Missing fields.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Kryx Labs Contact" <${process.env.ZOHO_USER}>`,
      to: process.env.ZOHO_USER,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    res.status(200).send("Message sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send.");
  }
});

app.get("/", (req, res) => {
  res.send("Kryx Labs Contact Notifier is running.");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
