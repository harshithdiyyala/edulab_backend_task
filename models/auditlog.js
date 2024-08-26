const mongoose = require("mongoose")

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'CREATE_BOOK', 'UPDATE_BOOK'
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entity: { type: String, required: true }, // e.g., 'Book', 'User'
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object }, // Any additional details about the action
})

const AuditLog = mongoose.model("AuditLog", auditLogSchema)

module.exports = AuditLog
