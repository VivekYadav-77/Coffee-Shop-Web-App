import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export const sendVerificationEmail = async (user, code) => {
  const mailOptions = {
    from: '"The Roasting House" <no-reply@TheRoastingHouse.com>',
    to: user.email,
    subject: "Your The Roasting House Verification Code",
    html: `
            <h2>Hello ${user.name},</h2>
            <p>Thank you for registering! Here is your verification code:</p>
            <h1 style="font-size: 36px; tracking-letter: 2px;">${code}</h1>
            <p>This code will expire in 10 minutes.</p>
        `,
  };
  await transporter.sendMail(mailOptions);
};
export const sendPasswordResetCodeEmail = async (user, code) => {
  const mailOptions = {
    from: '"Brew Craft" <no-reply@brewcraft.com>',
    to: user.email,
    subject: "Your Brew Craft Password Reset Code",
    html: `
            <h2>Hello ${user.name},</h2>
            <p>You requested a password reset. Here is your code:</p>
            <h1 style="font-size: 36px; letter-spacing: 2px;">${code}</h1>
            <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        `,
  };
  await transporter.sendMail(mailOptions);
};
