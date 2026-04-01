import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

const FloatingChatbot = () => {
  const { token } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your career advisor. Ask me anything about resumes, jobs, or career guidance!", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chatbot/chat', 
        { message: inputMessage },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        const botMessage = { id: Date.now() + 1, text: response.data.response, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // If API returns success: false, still show the response
        const errorMessage = { 
          id: Date.now() + 1, 
          text: response.data.message || "I'm having trouble responding right now. Please try again later.", 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Don't show toast error for chatbot - just show in chat
      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
      
      // Check for specific error types
      if (error.response?.status === 429) {
        errorMessage = "I'm getting too many requests right now. Please wait a moment and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "There's an authentication issue. Please try logging in again.";
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection issue. Please check your internet and try again.";
      }
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: errorMessage, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-50"
        style={{ zIndex: 9999 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Open chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">Career Advisor</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-300 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about careers, resumes, jobs..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
