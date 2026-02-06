import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatMessage from './components/Chat.jsx';
import ChatInput from './components/ChatInput.jsx';

// const msgs = [
//   { id: 1733222991976, text: "Hi! how are you?", sender: "user" },
//   { id: 1733222994240, text: "Message received, thanks!", sender: "assistant" },
//   { id: 1733223012365, text: "Can you help me?", sender: "user" },
//   { id: 1733223013442, text: "Message received, thanks!", sender: "assistant" }
// ]

const sendMessage = async (message, sessionId) => {
  const response = await fetch("https://chat-assistant-ztsa.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, sessionId })
  });

  if (!response.ok) {
    throw new Error("Server error");
  }

  return response.json();
}

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading])


  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendMessage(text, sessionId);
      console.log("API RESPONSE:", data);

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "assistant"
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Sorry, something went wrong. Please try again.",
          sender: "assistant"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className='chat-container'>
      <header className='chat-header'>
        <h1>Chat Assistant</h1>
      </header>

      <div className='messages-container'>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messageEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        ref={inputRef}
      />

    </div>
  )
}

export default App
