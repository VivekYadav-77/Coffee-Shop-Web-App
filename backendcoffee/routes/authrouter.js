import { Router } from "express";
import {
  handleusersignup,
  handleuserlogin,
  handleuserlogout,
  handleVerifyCode,
  handleResendVarification,
  handleforgotpassword,
  handleresetpassword,
} from "../controller/userauthcontroller.js";
import { Customermodel } from "../models/customerschema.js";
import bcrypt from "bcrypt";
import { handleRefresh } from "../controller/refreshcontroller.js";
import { authMiddleware } from "../middleware/authvalidatemiddleware.js";
const userrouter = Router();

userrouter.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
});

userrouter.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await Customermodel.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

userrouter.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await Customermodel.findById(req.user._id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default userrouter;
userrouter.post("/refresh", handleRefresh);
userrouter.post("/signup", handleusersignup);
userrouter.post("/verify-code", handleVerifyCode);
userrouter.post("/resend-verification", handleResendVarification);
userrouter.post("/forgot-password", handleforgotpassword);
userrouter.put("/reset-password", handleresetpassword);
userrouter.post("/login", handleuserlogin);
userrouter.get("/logout", handleuserlogout);
export { userrouter };
