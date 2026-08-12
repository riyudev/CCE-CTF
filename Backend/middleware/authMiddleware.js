import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// JWT Authentication verification middleware
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "cce_ctf_secret_key_2026_super_secure"
      );

      // Attach user without password
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "User account no longer exists." });
      }

      return next();
    } catch (error) {
      console.error("[AUTH MIDDLEWARE] Token Error:", error.message);
      return res
        .status(401)
        .json({ message: "Not authorized, token validation failed." });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, authentication token missing." });
  }
};

// Require Admin Role middleware
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    message: "Forbidden: Access restricted to CCE CTF administrators only.",
  });
};
