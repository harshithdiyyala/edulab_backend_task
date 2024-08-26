const express = require("express")
const BookService = require("../services/book-service")
const Book = require("../models/book")

const router = express.Router()
const bookService = new BookService(Book)
const authorizeRoles = require("../middleware")

router.post("/", authorizeRoles("admin"), async (req, res) => {
  try {
    const book = await bookService.createBook(req.body)
    res.status(201).json(book)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get("/:id", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json(book)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post("/borrow", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body
    const borrowing = await bookService.borrowBook(bookId, userId, dueDate)
    res.status(201).json(borrowing)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post("/return", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const { borrowingId } = req.body
    const returning = await bookService.returnBook(borrowingId)
    res.status(200).json(returning)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Add routes for borrowing, returning, updating, and deleting books

module.exports = router
