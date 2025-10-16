import crypto from "crypto";
import { Customermodel } from "../models/customerschema.js";
import {
  sendVerificationEmail,
  sendPasswordResetCodeEmail,
} from "../service/emailservice.js";
import {
  createtokenforuser,
  createRefreshTokenPlain,
} from "../service/authcookie.js";

const REFRESH_DAYS = 7;
const handleusersignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await Customermodel.findOne({ email })) {
      return res
        .status(400)
        .json({ message: "Email already registered go to login " });
    }

    const newuser = new Customermodel({ name, email, password });
    const verificationCode = newuser.generateVerificationCode();
    await newuser.save();

    await sendVerificationEmail(newuser, verificationCode);

    res
      .status(201)
      .json({
        message:
          "Registration successful. Please check your email to verify your account.",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const handleVerifyCode = async (req, res) => {
  try {
    //  Hash the incoming token to match the one stored in the database
    const { email, code } = req.body;
    console.log(
      `[DEBUG] Attempting to verify email: ${email} with code: ${code}`
    );

    //  Find the user by email first
    const user = await Customermodel.findOne({ email });

    if (!user) {
      console.log(`[DEBUG] User with that email not found.`);
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    //  Hash the incoming code from the user to check it
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    //  Check if the code matches
    if (user.verificationCode !== hashedCode) {
      console.log(
        `[DEBUG] Code does NOT match. DB: ${user.verificationCode}, Received (hashed): ${hashedCode}`
      );
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    //  Check if the code has expired
    if (user.verificationCodeExpires < Date.now()) {
      console.log(`[DEBUG] Code has EXPIRED.`);
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    // If all checks pass, verification is successful
    console.log(`[DEBUG] User found and verified!`);
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};
const handleResendVarification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Customermodel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email not found." });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This account is already verified." });
    }

    // Generate a new code and save it
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Send the new email
    await sendVerificationEmail(user, verificationCode);

    res
      .status(200)
      .json({ message: "A new verification email has been sent." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const handleforgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Customermodel.findOne({ email });

    if (user && user.isVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.passwordResetCode = code;
      user.passwordResetCodeExpires = Date.now() + 600000;

      await user.save();
      await sendPasswordResetCodeEmail(user, code);
    }

    res
      .status(200)
      .json({
        message:
          "If an account with that email exists, a password reset code has been sent.",
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const handleresetpassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const user = await Customermodel.findOne({
      email,
      passwordResetCode: code,
      passwordResetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset code." });
    }

    user.password = password;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const handleuserlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await Customermodel.findOne({ email });
    if (!userDoc) return res.status(404).json({ message: "Email not found" });

    //  ADDED: Security check to block login if email is not verified
    if (!userDoc.isVerified) {
      return res
        .status(403)
        .json({
          message:
            "Please verify your email before logging in from the signup page .",
        });
    }

    const token = await Customermodel.matchpasswordandgeneratetoken(
      email,
      password
    );
    const refreshTokenPlain = createRefreshTokenPlain();
    await userDoc.addRefreshToken?.(
      refreshTokenPlain,
      REFRESH_DAYS,
      req.get("User-Agent") || ""
    );

    const isProd = process.env.NODE_ENV === "production";
    const user = {
      _id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
    };

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite:isProd ? 'None' : 'Lax',
    });
    res.cookie("refreshToken", refreshTokenPlain, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
    });

    return res.json({ user });
  } catch (error) {
    return res
      .status(error.code || 500)
      .json({ message: error.message || "Server error" });
  }
};

const handleuserlogout = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  //  IMPROVEMENT: Added a success response
  return res.status(200).json({ message: "Logged out successfully" });
};

export {
  handleusersignup,
  handleuserlogin,
  handleuserlogout,
  handleVerifyCode,
  handleResendVarification,
  handleforgotpassword,
  handleresetpassword,
};
