const jwt = require("jsonwebtoken")

// Middleware to check if the user has the required role
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1] // Extract token from the header
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" })
      }

      req.user = decoded // Attach the decoded token (user details) to the request
      next()
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" })
    }
  }
}

module.exports = authorizeRoles
