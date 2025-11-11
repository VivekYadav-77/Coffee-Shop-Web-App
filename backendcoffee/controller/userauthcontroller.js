import crypto from "crypto";
import { Customermodel } from "../models/customerschema.js";
import {
  sendVerificationEmail,
  sendPasswordResetCodeEmail,
} from "../service/emailservice.js";
import {
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

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const handleVerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log(
      `[DEBUG] Attempting to verify email: ${email} with code: ${code}`
    );

    const user = await Customermodel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    if (user.verificationCode !== hashedCode) {
      console.log(
        `[DEBUG] Code does NOT match. DB: ${user.verificationCode}, Received (hashed): ${hashedCode}`
      );
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    if (user.verificationCodeExpires < Date.now()) {
      console.log(`[DEBUG] Code has EXPIRED.`);
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }
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

    const verificationCode = user.generateVerificationCode();
    await user.save();

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

    if (user) {
      if (user.isVerified) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.passwordResetCode = code;
        user.passwordResetCodeExpires = Date.now() + 600000;

        await user.save();
        await sendPasswordResetCodeEmail(user, code);
        return res.status(200).json({
          message: "Password reset code sent to your email.",
        });
      } else {
        return res.status(404).json({
            messagenotvarified:
              "Email not varified  go to login and verify the email first b login with that email"
          });
      }
    } else {
      return  res.status(200).json({
          messagenoemail:
            "No such email is register with us please signin with new email",
        });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
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

    if (!userDoc.isVerified) {
      return res.status(403).json({
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
      sameSite: isProd ? "None" : "Lax",
    });
    res.cookie("refreshToken", refreshTokenPlain, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
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
