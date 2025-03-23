const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    content: { type: String },
    sender: { type: String }, // user or ai
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", MessagesSchema);
