const express = require("express");
const { sendMessageController } = require('../controllers/ChatController')

const chatRouter = express.Router()

chatRouter.post("/message", sendMessageController);

module.exports = chatRouter;