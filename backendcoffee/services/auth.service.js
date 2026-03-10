import jwt from "jsonwebtoken";
import crypto from "crypto";
import conf from "../config/config.js";

const SECRET = conf.tokenkey;
const ACCESS_EXPIRES_IN = "12h";

export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function validateToken(token) {
    return jwt.verify(token, SECRET);
}

export function createRefreshTokenPlain() {
    return crypto.randomBytes(64).toString("hex");
}
