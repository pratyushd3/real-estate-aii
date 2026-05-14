'use client';

import { useState } from 'react';

export default function RealEstateChatbot() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi 👋 Welcome to our AI Real Estate Assistant. What property are you looking for?'
    }
  ]);

  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage('');

    setLoading(true);

    try {

      const response = await fetch(
        'https://real-estate-aii-1.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
  messages: [
    ...messages.map((msg) => ({
      role:
        msg.sender === 'user'
          ? 'user'
          : 'assistant',

      content: msg.text
    })),

    {
      role: 'user',
      content: currentMessage
    }
  ]
})
        }
      );

      const data = await response.json();

      const aiMessage = {
        sender: 'ai',
        text: data.reply
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Failed to connect to AI server.'
        }
      ]);

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">

        <div className="bg-black text-white p-5 flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold">
              AI Real Estate Assistant
            </h1>

            <p className="text-sm text-gray-300">
              Online • Instant Replies
            </p>

          </div>

          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow text-sm ${
                  msg.sender === 'user'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-800'
                }`}
              >

                {msg.text}

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-white px-4 py-3 rounded-2xl shadow text-sm animate-pulse">

                Typing...

              </div>

            </div>

          )}

        </div>

        <div className="border-t bg-white p-4 space-y-3">

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-5 rounded-2xl hover:scale-105 transition"
            >

              Send

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}