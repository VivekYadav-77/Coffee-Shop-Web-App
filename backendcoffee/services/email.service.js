import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const APP_NAME = "The Roasting House";
const FROM_EMAIL = process.env.EMAIL_USER;

/**
 * Sends an email using SendGrid.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const sendEmail = async (to, subject, html) => {
    try {
        await sgMail.send({ to, from: FROM_EMAIL, subject, html });
    } catch (error) {
        console.error("[Email Service] Failed to send email:", error?.response?.body || error.message);
        throw new Error("Failed to send email");
    }
};

export const sendVerificationEmail = async (user, code) => {
    const subject = `${APP_NAME} — Verify Your Email`;
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h2 style="color: #3b2f2f;">Hello ${user.name},</h2>
      <p style="color: #555;">Here is your verification code:</p>
      <div style="background: #fdf5ec; padding: 16px; border-radius: 8px; text-align: center;">
        <span style="font-size: 36px; letter-spacing: 6px; font-weight: bold; color: #6b4226;">${code}</span>
      </div>
      <p style="color: #999; font-size: 13px; margin-top: 16px;">This code expires in 10 minutes.</p>
    </div>
  `;
    return sendEmail(user.email, subject, html);
};

export const sendPasswordResetEmail = async (user, code) => {
    const subject = `${APP_NAME} — Password Reset Code`;
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h2 style="color: #3b2f2f;">Hello ${user.name},</h2>
      <p style="color: #555;">Your password reset code is:</p>
      <div style="background: #fdf5ec; padding: 16px; border-radius: 8px; text-align: center;">
        <span style="font-size: 36px; letter-spacing: 6px; font-weight: bold; color: #6b4226;">${code}</span>
      </div>
      <p style="color: #999; font-size: 13px; margin-top: 16px;">This code is valid for 10 minutes.</p>
    </div>
  `;
    return sendEmail(user.email, subject, html);
};

export const sendDisputeNotification = async (user, orderId, disputeType) => {
    const subject = `${APP_NAME} — Dispute Raised on Order #${orderId}`;
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h2 style="color: #b91c1c;">Dispute Alert</h2>
      <p style="color: #555;">A <strong>${disputeType}</strong> dispute has been raised on your order <strong>#${orderId}</strong>.</p>
      <p style="color: #555;">Please log in to your dashboard to review and respond to this dispute.</p>
    </div>
  `;
    return sendEmail(user.email, subject, html);
};

export const sendOrderStatusEmail = async (user, orderId, status) => {
    const subject = `${APP_NAME} — Order #${orderId} Update`;
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h2 style="color: #3b2f2f;">Order Update</h2>
      <p style="color: #555;">Your order <strong>#${orderId}</strong> status has been updated to:</p>
      <div style="background: #ecfdf5; padding: 12px; border-radius: 8px; text-align: center;">
        <span style="font-size: 20px; font-weight: bold; color: #065f46;">${status}</span>
      </div>
    </div>
  `;
    return sendEmail(user.email, subject, html);
};
