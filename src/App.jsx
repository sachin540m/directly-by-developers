import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FloatingButtons from './components/FloatingButtons';
import AIChatbot from './components/AIChatbot';
import FakeNotifications from './components/FakeNotifications';

const CHATBOT_AUTO_POPUP_DELAY_MS = 15000; // Easily configurable delay (15 seconds) before automatically opening chatbot

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasShownChatbotAutoOpen, setHasShownChatbotAutoOpen] = useState(false);
  const chatTimerRef = useRef(null);

  useEffect(() => {
    const handleEnquiryClosed = () => {
      if (!hasShownChatbotAutoOpen) {
        // Clear any existing active timer to prevent overlap
        if (chatTimerRef.current) clearTimeout(chatTimerRef.current);

        chatTimerRef.current = setTimeout(() => {
          setIsChatOpen(true);
          setHasShownChatbotAutoOpen(true);
        }, CHATBOT_AUTO_POPUP_DELAY_MS);
      }
    };

    window.addEventListener('enquiryModalClosed', handleEnquiryClosed);
    return () => {
      window.removeEventListener('enquiryModalClosed', handleEnquiryClosed);
      if (chatTimerRef.current) clearTimeout(chatTimerRef.current);
    };
  }, [hasShownChatbotAutoOpen]);

  // Handle manual chatbot toggle: if user clicks button manually, cancel any active automatic popup timer
  const handleToggleChat = () => {
    setIsChatOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        if (chatTimerRef.current) {
          clearTimeout(chatTimerRef.current);
          chatTimerRef.current = null;
        }
        setHasShownChatbotAutoOpen(true);
      }
      return nextState;
    });
  };

  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
        
        {/* Floating actions, AI Chatbot and Activity Notifications rendered site-wide */}
        <FloatingButtons 
          isChatOpen={isChatOpen} 
          onToggleChat={handleToggleChat} 
        />
        <AIChatbot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
        <FakeNotifications />
      </div>
    </Router>
  );
}

export default App;
