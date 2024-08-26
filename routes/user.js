const express = require("express")
const UserService = require("../services/user-service")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const router = express.Router()
const userService = new UserService(User)
const authorizeRoles = require("../middleware")

router.post("/login", async (req, res) => {
  try {
    const token = await userService.login(req.body)
    res.json({ token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get("/:id", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Add other user routes (update, delete) as needed

module.exports = router
