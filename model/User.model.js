const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    createAT: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const userModel = new model("User", userSchema);
module.exports = userModel;
