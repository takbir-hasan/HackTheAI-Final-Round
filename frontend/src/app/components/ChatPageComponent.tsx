"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatComponentProps {
  className?: string;
  onMessageSend?: (message: string) => void;
  initialMessages?: Message[];
  placeholder?: string;
  disabled?: boolean;
}

const ChatPageComponent: React.FC<ChatComponentProps> = ({
  className = '',
  onMessageSend,
  initialMessages = [],
  placeholder = "Hello, how can I help you today?",
  disabled = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "You can ask me about notices and FAQs and how I will try to answer you according to my updated knowledge base. You can also complaint anything about university I will give it to corresponding department.",
      sender: 'assistant',
      timestamp: new Date()
    },
    ...initialMessages
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      scrollToBottom();
    });
    return () => cancelAnimationFrame(timer);
  }, [messages]);

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || disabled) return;

    const userMessage: Message = {
      id: generateId(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    const currentInput = inputRef.current;
    setInputValue("");
    setIsTyping(true);

    if (currentInput) {
      currentInput.focus();
    }

    setMessages((prev) => [...prev, userMessage]);

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: userMessage.id,
          query: userMessage.text,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: generateId(),
        text: data?.agentResponse?.answer || "Sorry, I couldn't find an answer.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: "There was a problem connecting to the server.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      if (currentInput) {
        currentInput.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // 🎤 Voice recognition logic
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // use "bn-BD" for Bangla
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      if (inputRef.current) inputRef.current.focus();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-50 pt-15 ${className}`} style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Chat</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                AI Smart University Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-0 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]`}>
                {message.sender === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col space-y-1">
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base leading-relaxed break-words ${
                      message.sender === 'user'
                        ? 'bg-purple-500 text-white rounded-br-md shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                  <span className={`text-xs text-gray-500 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 sm:space-x-3 max-w-[70%]">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
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
      </div>

      {/* Input Area */}
      <div className="bg-white text-black border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3 sm:space-x-4 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              />
            </div>

            {/* 🎤 Voice Button */}
            <button
              type="button"
              onClick={startListening}
              className={`p-2 sm:p-3 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="Speak"
            >
              🎤
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSendMessage();
              }}
              disabled={!inputValue.trim() || disabled || isTyping}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPageComponent;
