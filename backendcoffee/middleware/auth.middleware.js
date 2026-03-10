import { validateToken } from "../services/auth.service.js";

/**
 * Extracts the JWT from the "token" cookie and attaches
 * the decoded user payload to req.user.
 * Non-blocking: if no cookie or invalid token, request proceeds without req.user.
 */
export const extractUser = (req, _res, next) => {
    const token = req.cookies?.token;
    if (!token) return next();

    try {
        req.user = validateToken(token);
    } catch {
        // Token invalid or expired — proceed without user
        req.user = null;
    }
    next();
};

/**
 * Requires the user to be authenticated.
 * Returns 401 if no user is attached.
 */
export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }
    next();
};

/**
 * Generic role-checking middleware factory.
 * Usage: requireRole("ADMIN"), requireRole("VENDOR", "ADMIN")
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(" or ")}`,
            });
        }
        next();
    };
};
