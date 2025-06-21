import express from "express";
import { signup, login, logout, onboarding } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboarding); // protectRoute is a middleware that checks if the user is authenticated, it will provide extra security to our route


// forgot password
// reset password
// change password
// delete account

// checks if user is authenticated or not and returns the user details
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ message: "User fetched successfully", user: req.user });
});


export default router;