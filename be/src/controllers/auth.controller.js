import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup (req, res) {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // validation too check if the email is valid

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please login" });
        }

        // generating a random number between 1 and 100 to map with random profile pictures
        const idx = Math.floor(Math.random() * 100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: randomAvatar,
        });

        // creating a stream user for the new user

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture || randomAvatar,
            });
            console.log(`Stream user created successfully for user ${newUser.fullName}`);
        } catch (error) {
            console.log("Error in creating stream user", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: "User created successfully", user: newUser, token });

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export async function login (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "invalid credentials" });
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect)
          return res.status(400).json({ message: "invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "User logged in successfully", user: user, token });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export function logout (req, res) {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function onboarding (req, res) {
  try {
    const userId = req.user._id;
    const { fullName, nativeLanguage, bio, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !nativeLanguage ||
      !bio ||
      !learningLanguage ||
      !location
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          missingFields: [
            !fullName && "fullName",
            !nativeLanguage && "nativeLanguage",
            !bio && "bio",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ].filter(Boolean),
        });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        fullName, 
        nativeLanguage, 
        bio, 
        learningLanguage, 
        location,
        isOnboarded: true 
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(400).json({ message: "User not found" });

    // updating the stream user
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePicture || randomAvatar,
    });
    console.log(`Stream user updated successfully for user ${updatedUser.fullName}`);
    res.status(200).json({ message: "User onboarded successfully", user: updatedUser });
  } catch (error) {
    console.log("Error in onboarding controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}