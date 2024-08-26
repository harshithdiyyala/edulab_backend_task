const Borrowing = require("../models/borrowing")
const AuditLogService = require("./auditlog-service")
const AuditLog = require("../models/auditlog")

const auditLogService = new AuditLogService(AuditLog)

const { v4: uuidv4 } = require("uuid")

const MAX_BORROW_LIMIT = process.env.MAX_BORROW_LIMIT

class BookService {
  constructor(bookModel) {
    this.bookModel = bookModel
  }

  async createBook(bookData) {
    // Check if a book with the same title and author already exists
    const existingBook = await this.bookModel.findOne({
      title: bookData.title,
      author: bookData.author,
    })

    if (existingBook) {
      throw new Error("Book with the same title and author already exists")
    }

    // If not, create a new book with a unique bookId
    const book = new this.bookModel({
      ...bookData,
      bookId: uuidv4(), // Generate a UUID for bookId
    })

    return await book.save()
  }

  async getBookById(bookId) {
    return await this.bookModel.findById(bookId).populate("author")
  }

  async updateBook(bookId, bookData) {
    return await this.bookModel.findByIdAndUpdate(bookId, bookData, { new: true })
  }

  async deleteBook(bookId) {
    return await this.bookModel.findByIdAndDelete(bookId)
  }

  async getBooks() {
    await this.bookModel.find().select("title author availableCopies")
  }

  async returnBook(borrowingId) {
    const borrowing = await Borrowing.findById(borrowingId)
    if (!borrowing) {
      throw new Error("Borrowing record not found.")
    }

    borrowing.returnedAt = new Date()
    await borrowing.save()

    const book = await this.bookModel.findById(borrowing.book)
    book.availableCopies += 1
    await book.save()

    // Log the returning action
    await auditLogService.logAction("RETURN_BOOK", borrowing.user, "Book", borrowing.book, {})

    return borrowing
  }

  async borrowBook(bookId, userId, dueDate) {
    // Check if the user already has an active borrowing for this book
    const activeBorrowings = await Borrowing.countDocuments({
      user: userId,
      returnedAt: { $exists: false },
    })

    if (activeBorrowings >= MAX_BORROW_LIMIT) {
      throw new Error(`User has reached the maximum borrowing limit of ${MAX_BORROW_LIMIT} books.`)
    }
    const existingBorrowing = await Borrowing.findOne({
      user: userId,
      book: bookId,
      returnedAt: { $exists: false }, // Checks for borrowings not yet returned
    })

    if (existingBorrowing) {
      throw new Error("User has already borrowed this book and has not returned it yet.")
    }

    // Check if the book exists and has available copies
    const book = await this.bookModel.findById(bookId)
    if (!book) {
      throw new Error("Book not found.")
    }

    if (book.availableCopies < 1) {
      throw new Error("No available copies for this book.")
    }

    // Proceed to borrow the book
    book.availableCopies -= 1
    await book.save()

    const borrowing = new Borrowing({
      borrowingId: uuidv4(), // Unique identifier for the borrowing record
      user: userId,
      book: bookId,
      borrowedAt: new Date(),
      dueDate: dueDate,
    })

    const savedBorrowing = await borrowing.save()

    // Log the borrowing action
    await auditLogService.logAction("BORROW_BOOK", userId, "Book", bookId, { borrowingId: savedBorrowing.borrowingId, dueDate })

    return savedBorrowing
  }

  // Other book-related methods can be added here
}

module.exports = BookService
