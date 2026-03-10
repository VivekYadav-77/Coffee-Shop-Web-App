import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { createHash, randomInt } from "node:crypto";
import { createTokenForUser } from "../services/auth.service.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "AGENT", "VENDOR"],
      default: "CUSTOMER",
    },
    phone: { type: String, trim: true },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Verification & Reset
    verificationCode: { type: String, select: false },
    verificationCodeExpires: { type: Date, select: false },
    passwordResetCode: { type: String, select: false },
    passwordResetCodeExpires: { type: Date, select: false },

    // Refresh Tokens
    refreshTokens: {
      type: [
        {
          tokenHash: String,
          expiresAt: Date,
          userAgent: String,
        },
      ],
      select: false,
    },

    // Gamification
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    lastSpinAt: { type: Date },

    // Wallet
    walletBalance: { type: Number, default: 0, min: 0 },

    // Agent-specific
    agentRating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalDeliveries: { type: Number, default: 0 },

    // Vendor reference (only for VENDOR role)
    vendorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// --- Hooks ---
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// --- Methods ---
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateVerificationCode = function () {
  const code = randomInt(100000, 999999).toString();
  this.verificationCode = createHash("sha256").update(code).digest("hex");
  this.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return code;
};

UserSchema.methods.generatePasswordResetCode = function () {
  const code = randomInt(100000, 999999).toString();
  this.passwordResetCode = code;
  this.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  return code;
};

UserSchema.methods.addRefreshToken = async function (token, days, userAgent = "") {
  const hash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  this.refreshTokens.push({ tokenHash: hash, expiresAt, userAgent });
  await this.save({ validateBeforeSave: false });
};

UserSchema.methods.removeRefreshToken = async function (token) {
  const hash = createHash("sha256").update(token).digest("hex");
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.tokenHash !== hash);
  await this.save({ validateBeforeSave: false });
};

// --- Statics ---
UserSchema.statics.findByRefreshToken = function (token) {
  const hash = createHash("sha256").update(token).digest("hex");
  return this.findOne({ "refreshTokens.tokenHash": hash }).select("+refreshTokens");
};

UserSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  return createTokenForUser(user);
};

const User = mongoose.model("Customers", UserSchema);
export default User;
