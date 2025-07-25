import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!token)
      return res.status(401).json({ message: "Unauthorized - invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(401).json({ message: "Unauthorized - user not found" });
    req.user = user;
    next();
  } catch (error) {
    if (error.code !== 'ECONNRESET') {
      console.log("Error in protectRoute middleware", error);
    }
    res.status(401).json({ message: "Unauthorized" });
  }
}