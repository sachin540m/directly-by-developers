import React, { useState, useEffect, useRef } from 'react';
import { Building, Sparkles } from 'lucide-react';

const NAMES = [
  'Rahul', 'Sonakshi', 'Amit', 'Sneha', 'Karan', 'Neha', 'Rohan', 'Anjali',
  'Vikram', 'Deepika', 'Siddharth', 'Aditi', 'Rajesh', 'Kavita', 'Manish',
  'Aarav', 'Ishaan', 'Ananya', 'Riya', 'Kunal', 'Arjun', 'Shruti', 'Kabir'
];

const HOME_CITIES = [
  'Navi Mumbai', 'Thane', 'Panvel', 'Vashi', 'Mumbai', 'Pune',
  'Khar', 'Chembur', 'Ghatkopar', 'Mulund', 'Bandra'
];

const BHKS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];

const PROPERTY_CITIES = ['Kharghar', 'Nerul', 'Panvel', 'Belapur', 'Vashi', 'Juinagar', 'Sanpada'];

// Notification templates
const TEMPLATES = [
  (name, homeCity, bhk, propCity) => `${name} from ${homeCity} enquired for a ${bhk} in ${propCity}.`,
  (name, homeCity, bhk, propCity) => `${name} from ${homeCity} booked a site visit for ${propCity}.`,
  (name, homeCity, bhk, propCity) => `${name} from ${homeCity} downloaded the brochure.`,
  (name, homeCity, bhk, propCity) => `${name} from ${homeCity} requested the latest price list.`
];

const FakeNotifications = () => {
  const [notification, setNotification] = useState('');
  const [visible, setVisible] = useState(false);
  const lastMessageRef = useRef('');

  // Helper to generate a completely randomized, unique combination without repeating recent alerts (even across page refreshes)
  const generateNotification = () => {
    let message = '';
    let attempts = 0;

    // Retrieve history from sessionStorage (survives page refreshes)
    let history = [];
    try {
      const stored = sessionStorage.getItem('shownNotificationsHistory');
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch (e) {
      // Fallback
    }

    do {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const homeCity = HOME_CITIES[Math.floor(Math.random() * HOME_CITIES.length)];
      const bhk = BHKS[Math.floor(Math.random() * BHKS.length)];
      const propCity = PROPERTY_CITIES[Math.floor(Math.random() * PROPERTY_CITIES.length)];
      const templateFn = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      message = templateFn(name, homeCity, bhk, propCity);
      attempts++;
    } while (history.includes(message) && attempts < 100);

    // Keep history capped at 30 items to prevent memory overhead
    history.push(message);
    if (history.length > 30) {
      history.shift();
    }

    try {
      sessionStorage.setItem('shownNotificationsHistory', JSON.stringify(history));
    } catch (e) {
      // Fallback
    }

    lastMessageRef.current = message;
    return message;
  };

  useEffect(() => {
    let showTimer;
    let hideTimer;

    // First toast appears 12 seconds after page load
    const startCycle = () => {
      showTimer = setTimeout(() => {
        triggerNotification();
      }, 12000);
    };

    const triggerNotification = () => {
      const msg = generateNotification();
      setNotification(msg);
      setVisible(true);

      // Hide notification after exactly 5 seconds
      hideTimer = setTimeout(() => {
        setVisible(false);

        // Schedule next notification in a random window between 20 and 35 seconds
        const nextInterval = Math.floor(Math.random() * (35 - 20 + 1) + 20) * 1000;
        showTimer = setTimeout(triggerNotification, nextInterval);
      }, 5000);
    };

    startCycle();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none select-none max-w-sm w-[90%]
        bottom-20 left-1/2 -translate-x-1/2 
        md:bottom-6 md:left-6 md:translate-x-0
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-[#16281E]/95 backdrop-blur-md border border-gold/45 text-white shadow-2xl rounded-2xl p-4 flex items-start gap-3 pointer-events-auto">
        {/* Blinking Live Indicator and Icon */}
        <div className="relative mt-1 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
            <Building className="w-4 h-4" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </div>

        {/* Message body */}
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 animate-pulse" /> Live Activity
          </span>
          <p className="text-xs sm:text-sm font-medium font-sans leading-relaxed text-white/95 mt-1">
            {notification}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FakeNotifications;
