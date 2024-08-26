const express = require("express")
const connectDB = require("./config/db")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

// Connect to the database
connectDB()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Define routes
app.use("/api/users", require("./routes/user"))
app.use("/api/authors", require("./routes/author"))
app.use("/api/books", require("./routes/book"))
// Add this line to app.js to integrate audit log routes
app.use("/api/audit-logs", require("./routes/auditlog"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
