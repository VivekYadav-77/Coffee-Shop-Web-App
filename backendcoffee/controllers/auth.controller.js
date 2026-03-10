import User from "../models/user.model.js";
import {
    createTokenForUser,
    createRefreshTokenPlain,
} from "../services/auth.service.js";
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from "../services/email.service.js";
import crypto from "crypto";
import { AppError } from "../middleware/errorHandler.js";

const REFRESH_DAYS = 7;
const isProd = () => process.env.NODE_ENV === "production";

const cookieOptions = (maxAgeDays) => ({
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? "None" : "Lax",
    maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
});

// --- Signup ---
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            throw new AppError("Name, email, and password are required", 400);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new AppError("Email already registered", 409);

        // Only allow CUSTOMER or VENDOR signup; ADMIN/AGENT assigned by admin
        const allowedRoles = ["CUSTOMER", "VENDOR"];
        const userRole = allowedRoles.includes(role) ? role : "CUSTOMER";

        const user = new User({ name, email, password, role: userRole });
        // [TEST MODE] Skip email verification — auto-verify user
        // const code = user.generateVerificationCode();
        user.isVerified = true;
        await user.save();
        // await sendVerificationEmail(user, code);

        res.status(201).json({
            success: true,
            message: "Registration successful. You can now log in.",
        });
    } catch (err) {
        next(err);
    }
};

// --- Verify Email ---
export const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) throw new AppError("Email and code are required", 400);

        const user = await User.findOne({ email }).select(
            "+verificationCode +verificationCodeExpires"
        );
        if (!user) throw new AppError("Invalid verification code", 400);

        const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
        if (user.verificationCode !== hashedCode) {
            throw new AppError("Invalid verification code", 400);
        }
        if (user.verificationCodeExpires < Date.now()) {
            throw new AppError("Verification code expired", 400);
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({ success: true, message: "Email verified. You can now log in." });
    } catch (err) {
        next(err);
    }
};

// --- Resend Verification ---
export const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select(
            "+verificationCode +verificationCodeExpires"
        );
        if (!user) throw new AppError("User not found", 404);
        if (user.isVerified) throw new AppError("Account already verified", 400);

        // [TEST MODE] Skip sending verification email
        // const code = user.generateVerificationCode();
        // await user.save({ validateBeforeSave: false });
        // await sendVerificationEmail(user, code);

        res.json({ success: true, message: "Verification email sent." });
    } catch (err) {
        next(err);
    }
};

// --- Login ---
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("Email and password required", 400);

        const user = await User.findOne({ email }).select("+password +refreshTokens");
        if (!user) throw new AppError("Invalid credentials", 401);
        // [TEST MODE] Skip email verification check
        // if (!user.isVerified) {
        //     throw new AppError("Please verify your email before logging in", 403);
        // }
        if (!user.isActive) {
            throw new AppError("Account deactivated. Contact support.", 403);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new AppError("Invalid credentials", 401);

        const token = createTokenForUser(user);
        const refreshToken = createRefreshTokenPlain();
        await user.addRefreshToken(refreshToken, REFRESH_DAYS, req.get("User-Agent") || "");

        res.cookie("token", token, cookieOptions(0.5));
        res.cookie("refreshToken", refreshToken, cookieOptions(REFRESH_DAYS));

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                walletBalance: user.walletBalance,
                vendorProfile: user.vendorProfile,
            },
        });
    } catch (err) {
        next(err);
    }
};

// --- Logout ---
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out" });
    } catch (err) {
        next(err);
    }
};

// --- Get Current User ---
export const getMe = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.json({ success: true, user: req.user });
};

// --- Forgot Password ---
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select(
            "+passwordResetCode +passwordResetCodeExpires"
        );

        if (!user) {
            // Don't reveal if email exists
            return res.json({ success: true, message: "If the email exists, a reset code has been sent." });
        }
        // [TEST MODE] Skip verification check and email sending
        // if (!user.isVerified) throw new AppError("Please verify your email first", 403);

        const code = user.generatePasswordResetCode();
        await user.save({ validateBeforeSave: false });
        // await sendPasswordResetEmail(user, code);
        console.log(`[TEST MODE] Password reset code for ${email}: ${code}`);

        res.json({ success: true, message: "Password reset code sent." });
    } catch (err) {
        next(err);
    }
};

// --- Reset Password ---
export const resetPassword = async (req, res, next) => {
    try {
        const { email, code, password } = req.body;
        if (!email || !code || !password) throw new AppError("All fields required", 400);

        const user = await User.findOne({
            email,
            passwordResetCode: code,
            passwordResetCodeExpires: { $gt: Date.now() },
        }).select("+passwordResetCode +passwordResetCodeExpires +password");

        if (!user) throw new AppError("Invalid or expired reset code", 400);

        user.password = password;
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful." });
    } catch (err) {
        next(err);
    }
};

// --- Update Profile ---
export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new AppError("User not found", 404);

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        const updated = await user.save();

        res.json({
            success: true,
            user: {
                _id: updated._id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                phone: updated.phone,
            },
        });
    } catch (err) {
        next(err);
    }
};

// --- Change Password ---
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) throw new AppError("Both passwords required", 400);

        const user = await User.findById(req.user._id).select("+password");
        if (!user) throw new AppError("User not found", 404);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) throw new AppError("Current password is incorrect", 401);

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password updated" });
    } catch (err) {
        next(err);
    }
};

// --- Refresh Token ---
export const refreshToken = async (req, res, next) => {
    try {
        const refreshTokenPlain = req.cookies.refreshToken;
        if (!refreshTokenPlain) throw new AppError("No refresh token", 401);

        const user = await User.findByRefreshToken(refreshTokenPlain);
        if (!user) throw new AppError("Invalid refresh token", 403);

        const hash = crypto.createHash("sha256").update(refreshTokenPlain).digest("hex");
        const tokenEntry = user.refreshTokens.find((rt) => rt.tokenHash === hash);
        if (!tokenEntry) throw new AppError("Refresh token not recognized", 403);

        if (new Date() > new Date(tokenEntry.expiresAt)) {
            user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== hash);
            await user.save({ validateBeforeSave: false });
            throw new AppError("Refresh token expired", 403);
        }

        // Rotate
        user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== hash);
        const newRefresh = createRefreshTokenPlain();
        await user.addRefreshToken(newRefresh, REFRESH_DAYS, req.get("User-Agent") || "");

        const newAccess = createTokenForUser(user);
        res.cookie("token", newAccess, cookieOptions(0.5));
        res.cookie("refreshToken", newRefresh, cookieOptions(REFRESH_DAYS));

        res.json({ success: true, message: "Token refreshed" });
    } catch (err) {
        next(err);
    }
};
