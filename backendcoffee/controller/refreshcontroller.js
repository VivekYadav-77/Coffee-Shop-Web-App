import { Customermodel } from "../models/customerschema.js";
import {
  createRefreshTokenPlain,
  createtokenforuser,
} from "../service/authcookie.js";
import { createHash } from "node:crypto";

const REFRESH_DAYS = 3;

export async function handleRefresh(req, res) {
  const refreshTokenPlain = req.cookies.refreshToken;
  if (!refreshTokenPlain)
    return res.status(401).json({ message: "No refresh token" });

  try {
    // find user by hashed refresh token
    const found = await Customermodel.findByRefreshToken(refreshTokenPlain);
    if (!found) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // verify the token entry hasn't expired
    const hashed = createHash("sha256").update(refreshTokenPlain).digest("hex");
    const tokenEntry = found.refreshTokens.find(
      (rt) => rt.tokenHash === hashed
    );
    if (!tokenEntry) {
      return res.status(403).json({ message: "Refresh token not recognized" });
    }

    if (new Date() > new Date(tokenEntry.expiresAt)) {
      // expired: remove it
      found.refreshTokens = found.refreshTokens.filter(
        (rt) => rt.tokenHash !== hashed
      );
      await found.save();
      return res.status(403).json({ message: "Refresh token expired" });
    }

    // rotate: remove old token entry and add new one
    found.refreshTokens = found.refreshTokens.filter(
      (rt) => rt.tokenHash !== hashed
    );
    const newRefreshPlain = createRefreshTokenPlain();
    await found.addRefreshToken(
      newRefreshPlain,
      REFRESH_DAYS,
      req.get("User-Agent") || ""
    );

    // new access token
    const newAccessToken = createtokenforuser(found);

    const isProd = "production";
    const accessCookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    };
    const refreshCookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: REFRESH_DAYS * 12 * 60 * 60 * 1000,
    };

    res.cookie("token", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshPlain, refreshCookieOptions);

    return res.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("refresh error", err);
    return res.status(500).json({ message: "Server error" });
  }
}
