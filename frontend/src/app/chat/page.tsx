"use client";

import Navbar from "../components/navbar";
import ChatPageComponent from "../components/ChatPageComponent";
import Footer from "../components/Footer";

export default function ChatPage() {
  const handleMessageSend = (message: string) => {
    console.log('Message sent:', message);
    // Here you can add logic to send the message to your backend
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <ChatPageComponent 
          onMessageSend={handleMessageSend}
          placeholder="Type your question about university services..."
          className="h-full"
        />
      </div>
      <Footer />
    </div>
  );
}