import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username harus diisi"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
