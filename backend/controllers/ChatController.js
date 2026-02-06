const MessageModel = require('../models/MessageModel.js');
const ConversationModel = require('../models/ConversationModel.js');
const { generateReply } = require('../services/GroqService.js');

const sendMessageController = async (req, res) => {
  try {
    let { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message can not be empty" });
    }

    if (message.length > 2000) {
      message = message.slice(0, 2000);
    }

    let conversation = sessionId ? await ConversationModel.findById(sessionId) : null;

    if (conversation === null) {
      conversation = await ConversationModel.create({});
    }

    await MessageModel.create({
      conversationId: conversation._id,
      sender: "user",
      text: message
    })

    const history = await MessageModel.find({ conversationId: conversation._id })
      .sort({ timestamp: 1 })
      .limit(10);

    let reply;
    try {
      reply = await generateReply(history, message);
    } catch (error) {
      reply = "Sorry, I am having truoble responding right now!!!"
    }

    await MessageModel.create({
      conversationId: conversation._id,
      sender: "assistant",
      text: reply
    })

    res.status(201).json({
      reply,
      sessionId: conversation._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { sendMessageController };