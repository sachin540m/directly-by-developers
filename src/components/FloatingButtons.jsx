import React, { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { CHAT_CONFIG } from '../data/chatbotConfig';

const FloatingButtons = ({ isChatOpen, onToggleChat }) => {
  const phoneNumber = "7718853773";
  const formattedPhone = `+91${phoneNumber}`;
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi,%20I'm%20interested%20in%20buying%20a%20property%20directly%20from%20the%20developer.`;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800); // Delayed slide-in from right on page load
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        visible ? 'translate-x-0' : 'translate-x-24'
      }`}
      role="region"
      aria-label="Floating Contact & Assistant Tools"
    >
      {/* 1. Phone Button (Top of the stack) - Hidden when chatbot is open to prevent overlap */}
      {!isChatOpen && (
        <div className="relative group">
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md hidden md:block">
            Call Us Now
          </span>
          <a
            href={`tel:${formattedPhone}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus:outline-none"
            aria-label="Call developer support"
          >
            <Phone className="w-5 h-5 fill-current" />
          </a>
        </div>
      )}

      {/* 2. WhatsApp Button (Middle of the stack) - Hidden when chatbot is open to prevent overlap */}
      {!isChatOpen && (
        <div className="relative group">
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md hidden md:block">
            Chat with us
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus:outline-none"
            aria-label="Chat on WhatsApp"
          >
            <svg 
              className="w-6 h-6 fill-current" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.418-.074-.125-.272-.199-.57-.348m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
        </div>
      )}

      {/* 3. AI Chatbot Launcher Button (Bottom of the stack) - Hidden when chatbot is open */}
      {!isChatOpen && (
        <div className="relative group">
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md hidden md:block">
            AI Chatbot
          </span>
          <button
            onClick={onToggleChat}
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus:outline-none bg-gold hover:bg-gold-light text-white"
            aria-label="Open AI Chatbot"
            aria-expanded={isChatOpen}
          >
            <img src={CHAT_CONFIG.avatarUrl} alt={CHAT_CONFIG.botName} className="w-full h-full rounded-full object-cover" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons;
