const AuditLogService = require("./auditlog-service")
const AuditLog = require("../models/auditlog")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auditLogService = new AuditLogService(AuditLog)

class UserService {
  constructor(userModel) {
    this.userModel = userModel
  }
  async login(userData) {
    const { email, password } = userData
    const user = await this.userModel.findOne({ email })
    if (!user) throw new Error("User not found")

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Invalid credentials")

    // Generate JWT with user role
    const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

    return token
  }

  async createUser(userData) {
    // Check if a user with the same email already exists
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    })

    if (existingUser) {
      throw new Error("User with the same email already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    // Create a new user with a unique userId and hashed password
    const savedUser = new this.userModel({
      ...userData,
      userId: uuidv4(), // Generate a UUID for userId
      password: hashedPassword, // Store the hashed password
    })

    await savedUser.save()

    // Log the action
    await auditLogService.logAction("CREATE_USER", savedUser._id, "User", savedUser._id, { userData })

    return savedUser
  }

  async getUserById(userId) {
    return await this.userModel.findById(userId)
  }

  async updateUser(userId, userData) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, userData, { new: true })

    // Log the action
    await auditLogService.logAction("UPDATE_USER", userId, "User", userId, { userData })

    return updatedUser
  }

  async deleteUser(userId) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId)

    // Log the action
    await auditLogService.logAction("DELETE_USER", userId, "User", userId, {})

    return deletedUser
  }

  async loginUser(email, password) {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new Error("User not found")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error("Invalid credentials")
    }

    // Log the login action
    await auditLogService.logAction("USER_LOGIN", user._id, "User", user._id, { email })

    // Proceed with login (e.g., generate a token)
    return user
  }
  async changePassword(userId, newPassword) {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    // Log the password change action
    await auditLogService.logAction("PASSWORD_CHANGE", userId, "User", userId, {})

    return user
  }

  // Other user-related methods can be added here
}

module.exports = UserService
