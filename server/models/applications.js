const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const application = new mongoose.Schema(
  {
    fullName: {
      type: String,
      text: true,
    },
    email: {
      type: String,
      unique: true,
      text: true,
      index: true,
      required: true,
    },
    user: { type: ObjectId, ref: "User", required: true },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      text: true,
      index: true,
    },
    portfolioLink: {
      type: String,
    },
    description: {
      type: String,
    },
    status:{
      type: String,
      enum: ["pending", "approved", "declined", "suspended"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoleApplication", application);
