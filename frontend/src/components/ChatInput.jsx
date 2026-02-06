import React, { forwardRef, useState } from 'react'

const ChatInput = forwardRef(({ onSendMessage, isLoading }, ref) => {
  const [ message, setMessage ] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  }


  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        ref={ref}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? "Agent is typing..." : "Type a message..."}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>Send</button>
    </form>
  )
})

export default ChatInput