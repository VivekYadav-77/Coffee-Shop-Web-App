import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createHash } from "node:crypto";
import { createtokenforuser } from "../service/authcookie.js";
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "AGENT"],
      default: "CUSTOMER",
    },
    refreshTokens: [
      {
        tokenHash: String,
        expiresAt: Date,
        userAgent: String,
      },
    ],
    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    lastSpinAt: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
  },

  { timestamps: true }
);

CustomerSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});
CustomerSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  this.verificationCodeExpires = Date.now() + 600000;
  return code;
};

CustomerSchema.statics.matchpasswordandgeneratetoken = async function (
  email,
  password
) {
  console.log("heematch");
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid password");
    error.code = 401;
    throw error;
  }
  return createtokenforuser(user);
};
CustomerSchema.methods.addRefreshToken = async function (
  token,
  days,
  userAgent = ""
) {
  const hash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + days * 12 * 60 * 60 * 1000);
  this.refreshTokens.push({ tokenHash: hash, expiresAt, userAgent });
  await this.save();
};
CustomerSchema.methods.removeRefreshToken = async function (token) {
  const hash = createHash("sha256").update(token).digest("hex");
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.tokenHash !== hash);
  await this.save();
};
CustomerSchema.statics.findByRefreshToken = function (token) {
  const hash = createHash("sha256").update(token).digest("hex");
  return this.findOne({ "refreshTokens.tokenHash": hash });
};

const Customermodel = mongoose.model("Customer", CustomerSchema);

export { Customermodel };
