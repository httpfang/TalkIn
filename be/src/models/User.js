import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
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
      minlength: 8,
    },
    bio: {
      type: String,
      default: "No bio yet",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "English",
    },
    learningLanguage: {
      type: String,
      default: "English",
    },
    location: {
      type: String,
      default: "No location yet",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      // keeping friends as an array of user ids
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


// pre hook to hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
      next(error);
    }
  });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema); // creating a model for the user

export default User;