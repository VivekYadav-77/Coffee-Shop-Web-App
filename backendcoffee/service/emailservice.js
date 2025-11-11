import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (user, code) => {
    const msg = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Your THE ROUSTING HOUSE Verification Code',
        html: `
            <h2>Hello ${user.name},</h2>
            <p>Here is your verification code:</p>
            <h1 style="font-size: 36px; letter-spacing: 2px;">${code}</h1>
            <p>This code will expire in 10 minutes.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        if (error.response) {
            console.error(error.response.body)
        }
    }
};

export const sendPasswordResetCodeEmail = async (user, code) => {
    const msg = {
        to: user.email,
        from: process.env.EMAIL_USER, // Use your verified sender
        subject: 'Your THE ROUSTING HOUSE Password Reset Code',
        html: `
            <h2>Hello ${user.name},</h2>
            <p>Here is your password reset code:</p>
            <h1 style="font-size: 36px; letter-spacing: 2px;">${code}</h1>
            <p>This code is valid for 10 minutes.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        if (error.response) {
            console.error(error.response.body)
        }
    }
};