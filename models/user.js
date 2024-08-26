const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4(), unique: true }, // Adding userId with UUID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
})

const User = mongoose.model("User", userSchema)

module.exports = User
