const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now
  }
});

const ConversationModel = mongoose.model("Conversations", conversationSchema);

module.exports = ConversationModel;