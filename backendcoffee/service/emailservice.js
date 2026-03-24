import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Helper function to handle the GAS request
const sendEmailViaGAS = async (to, subject, body) => {
  const payload = {
    key: process.env.GAS_SECRET,
    to: to,
    subject: subject,
    body: body,
  };

  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not defined in your environment variables.");
    }

    const response = await axios({
      method: "post",
      url: process.env.GOOGLE_SCRIPT_URL.trim(),
      data: JSON.stringify(payload),
      headers: {
        // text/plain is crucial here to bypass CORS preflight issues with Google Scripts
        "Content-Type": "text/plain;charset=utf-8", 
      },
      maxRedirects: 5,
    });

    if (typeof response.data === "string" && response.data.includes("Success")) {
      console.log(`[MAILER]: Email sent successfully to ${to}`);
    } else {
      throw new Error(`GAS rejected the request: ${response.data}`);
    }
  } catch (error) {
    console.error("--- MAILER ERROR ---");
    console.error(error.message);
    // We don't throw the error further up so that the server doesn't crash, 
    // but you might want to handle this differently based on your needs.
  }
};

export const sendVerificationEmail = async (user, code) => {
  const subject = 'Your THE ROUSTING HOUSE Verification Code';
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 15px; max-width: 500px;">
      <h2 style="color: #2563eb;">Hello ${user.name},</h2>
      <p style="color: #444;">Here is your verification code:</p>
      <div style="margin: 20px 0; text-align: center;">
        <h1 style="font-size: 40px; letter-spacing: 5px; color: #111; margin: 0;">${code}</h1>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
    </div>
  `;

  await sendEmailViaGAS(user.email, subject, body);
};

export const sendPasswordResetCodeEmail = async (user, code) => {
  const subject = 'Your THE ROUSTING HOUSE Password Reset Code';
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 15px; max-width: 500px;">
      <h2 style="color: #2563eb;">Hello ${user.name},</h2>
      <p style="color: #444;">Here is your password reset code:</p>
      <div style="margin: 20px 0; text-align: center;">
        <h1 style="font-size: 40px; letter-spacing: 5px; color: #111; margin: 0;">${code}</h1>
      </div>
      <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes.</p>
    </div>
  `;

  await sendEmailViaGAS(user.email, subject, body);
};