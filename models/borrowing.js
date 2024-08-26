const mongoose = require("mongoose")

const todayDate = new Date()
const dueDate = new Date().setDate(todayDate.getDate() + 15)
const borrowingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedAt: { type: Date, default: todayDate },
  dueDate: { type: Date, default: dueDate, required: true },
  returnedAt: Date,
  returned: { type: Boolean, default: false },
})

const Borrowing = mongoose.model("Borrowing", borrowingSchema)

module.exports = Borrowing
