import jwt from "jsonwebtoken";
import crypto from "crypto";
import conf from "../config/config.js";
const secretekey = conf.tokenkey;
const accessExpiresIn = "12h";
function createtokenforuser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, secretekey, { expiresIn: accessExpiresIn });
  return token;
}
function validatethetoken(token) {
  const payload = jwt.verify(token, secretekey);
  return payload;
}
function createRefreshTokenPlain() {
  return crypto.randomBytes(64).toString("hex");
}
export { createtokenforuser, validatethetoken, createRefreshTokenPlain };
