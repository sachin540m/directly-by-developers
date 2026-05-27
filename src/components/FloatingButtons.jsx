import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingButtons = () => {
  const phoneNumber = "9876543210";
  const formattedPhone = `+91${phoneNumber}`;
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi,%20I'm%20interested%20in%20buying%20a%20property%20directly%20from%20the%20developer.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <div className="relative group">
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
          Chat with us
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
      </div>

      {/* Phone Button */}
      <div className="relative group">
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
          Call Us Now
        </span>
        <a
          href={`tel:${formattedPhone}`}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Call developer support"
        >
          <Phone className="w-5 h-5 fill-current" />
        </a>
      </div>
    </div>
  );
};

export default FloatingButtons;
