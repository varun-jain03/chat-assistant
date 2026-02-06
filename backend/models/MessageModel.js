const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversations",
    required: true
  },
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const MessageModel = mongoose.model("Messages", messageSchema);

module.exports = MessageModel;