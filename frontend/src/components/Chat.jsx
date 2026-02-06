import React from 'react'

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender}`}>
      <div className="message-bubble">
        <div className="message-content">{message.text}</div>
      </div>
    </div>
  )
}

export default ChatMessage;