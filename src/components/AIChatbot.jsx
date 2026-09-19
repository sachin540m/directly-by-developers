import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, X, User, Sparkles, MapPin, Building2 } from 'lucide-react';
import { CHAT_CONFIG } from '../data/chatbotConfig';
import { submitLead } from '../utils/submitLead';
import { 
  findMatchedLocation, 
  VALID_CITIES,
  getProjectsForLocation,
  findMatchedProject,
  getPropertyDetails
} from '../utils/locationMatcher';

// Helper to retrieve saved session lead data
const getSavedLead = () => {
  try {
    const raw = sessionStorage.getItem('dbd_active_lead');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

// Helper to save session lead data
const saveLeadSession = (data) => {
  try {
    sessionStorage.setItem('dbd_active_lead', JSON.stringify(data));
  } catch (e) {}
};

// Helper function to validate a person's Full Name inside the chatbot
const isValidFullName = (text) => {
  const t = text.trim().toLowerCase();
  
  if (t.length < 2 || t.length > 50) return false;
  
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length > 4) return false;
  
  const blacklist = [
    'show', 'project', 'price', 'visit', 'brochure', 'callback', 'location', 
    'flat', 'bhk', 'house', 'apartment', 'developer', 'want', 'need', 'buy', 
    'interest', 'share', 'detail', 'info', 'cost', 'rate', 'many', 'much', 
    'help', 'where', 'what', 'how', 'when', 'why', 'who', 'tell', 'list',
    'view', 'book', 'call', 'send', 'mail', 'email', 'phone', 'number', 'mobile'
  ];
  
  for (const word of words) {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    if (blacklist.includes(cleanWord)) {
      return false;
    }
  }
  
  const hasSpecialOrDigits = /[\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/|\\~`]/.test(t);
  if (hasSpecialOrDigits) return false;

  return true;
};

// Helper to extract 10-digit mobile number from input text (handles spaces, hyphens, +91, 0)
const parsePhoneNumber = (text) => {
  const cleanDigits = text.replace(/[\s\-\+\(\)]/g, '');
  const phoneRegex = /^[0-9]{10}$/;
  
  if (phoneRegex.test(cleanDigits)) return cleanDigits;
  if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) return cleanDigits.substring(2);
  if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) return cleanDigits.substring(1);
  
  return null;
};

const AIChatbot = ({ isOpen, onClose }) => {
  const savedLead = useMemo(() => getSavedLead(), []);

  // Initial message: Clean greeting with the 13 actual cities that have property cards!
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: savedLead?.phone 
        ? `Welcome back! 👋 I'm Sonakshi from Directly By Developers.\n\nWhich location in Navi Mumbai would you like to explore? Tap your preferred city below:`
        : `Hello 👋 I'm Sonakshi. Welcome to Directly By Developers!\n\nWhich location in Navi Mumbai are you looking for? Tap your preferred city below:`, 
      time: new Date(),
      type: 'location_chips',
      chips: VALID_CITIES
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Lead collection state machine:
  // 'awaiting_location' | 'awaiting_project' | 'awaiting_name' | 'awaiting_number' | 'completed'
  const [leadState, setLeadState] = useState(savedLead?.phone ? 'completed' : 'awaiting_location');
  const [leadData, setLeadData] = useState({ 
    location: '', 
    propertyName: '', 
    name: savedLead?.name || '', 
    phone: savedLead?.phone || '' 
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const leadStateRef = useRef(leadState);
  const leadDataRef = useRef(leadData);

  useEffect(() => {
    leadStateRef.current = leadState;
  }, [leadState]);

  useEffect(() => {
    leadDataRef.current = leadData;
  }, [leadData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Step 2: Present project chips for a chosen city (Top 5 featured + View More)
  const presentProjectsForCity = async (cityName) => {
    const allProjects = getProjectsForLocation(cityName, 50);
    const topProjects = allProjects.slice(0, 5);
    const hasMore = allProjects.length > 5;

    const chips = [...topProjects];
    if (hasMore) {
      chips.push(`➕ View More Projects (${allProjects.length - 5}+)`);
    }
    chips.push(`All ${cityName} Projects`);

    const countText = allProjects.length > 5 ? `${allProjects.length}+ verified` : 'verified';

    const botMsg = {
      sender: 'bot',
      text: `Great choice! We have ${countText} developer projects in ${cityName}. 📍\n\nWhich project would you like to explore? Tap below:`,
      time: new Date(),
      type: 'project_chips',
      chips: chips
    };
    setMessages((prev) => [...prev, botMsg]);
    
    // If user is already registered, keep leadState as 'completed'
    if (!leadDataRef.current.phone) {
      setLeadState('awaiting_project');
    }
  };

  // Step 3: Present project details & handle state
  const presentProjectSelection = async (projectName, cityName) => {
    const isAllProjects = projectName.startsWith('All ') && projectName.endsWith(' Projects');
    const selectedProp = isAllProjects ? '' : projectName;

    setLeadData((prev) => ({ ...prev, propertyName: selectedProp, location: cityName }));

    if (selectedProp) {
      const details = getPropertyDetails(selectedProp);
      const priceText = details?.price ? `starting from ${details.price}` : 'at direct developer rates';
      const bhkText = details?.bhk ? ` (${details.bhk})` : '';
      const devText = details?.developer ? ` by ${details.developer}` : '';

      // If user is ALREADY registered in this active session:
      if (leadDataRef.current.phone) {
        const customerName = leadDataRef.current.name ? `${leadDataRef.current.name}` : '';
        const nameGreeting = customerName ? `${customerName}, ` : '';
        const regPhone = leadDataRef.current.phone;

        // Quietly update CRM enquiry for newly shortlisted project
        submitLead({
          formType: "AI Chatbot - Additional Shortlist",
          leadType: "AI Chatbot Lead",
          name: leadDataRef.current.name || 'Chatbot User',
          phone: regPhone,
          location: cityName,
          region: cityName,
          propertyName: selectedProp,
          message: `Additional Project Shortlisted: ${selectedProp} in ${cityName}.\nUser verified on +91 ${regPhone}.`
        }).catch(() => {});

        const botMsg = {
          sender: 'bot',
          text: `Awesome! ${selectedProp}${devText} features premium homes${bhkText} ${priceText} (Zero Brokerage). 🏢\n\n📞 Note: ${nameGreeting}your contact details (+91 ${regPhone}) are already registered! If you're interested in comparing multiple projects or exploring other cities, our Senior Property Advisor will provide you complete assistance and consolidated cost sheets directly on call/WhatsApp.\n\nFeel free to tap any option below or ask our advisor directly!`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setLeadState('completed');
        return;
      }

      // If name is already known but phone is missing:
      if (leadDataRef.current.name) {
        const botMsg = {
          sender: 'bot',
          text: `Awesome! ${selectedProp}${devText} features premium homes${bhkText} ${priceText} (Zero Brokerage). 🏢\n\nThank you, ${leadDataRef.current.name}! Could you please share your 10-digit mobile number so our team can send you the official brochure & pricing?`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setLeadState('awaiting_number');
        return;
      }

      // Brand new user:
      const botMsg = {
        sender: 'bot',
        text: `Awesome! ${selectedProp}${devText} features premium homes${bhkText} ${priceText} (Zero Brokerage). 🏢\n\nTo share the verified cost sheet & official brochure, may I know your full name please?`,
        time: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setLeadState('awaiting_name');
    } else {
      // All Projects option selected:
      if (leadDataRef.current.phone) {
        const customerName = leadDataRef.current.name ? `${leadDataRef.current.name}` : '';
        const nameGreeting = customerName ? `${customerName}, ` : '';
        const regPhone = leadDataRef.current.phone;

        submitLead({
          formType: "AI Chatbot - Additional Shortlist",
          leadType: "AI Chatbot Lead",
          name: leadDataRef.current.name || 'Chatbot User',
          phone: regPhone,
          location: cityName,
          region: cityName,
          propertyName: `All ${cityName} Projects`,
          message: `Browsing all projects in ${cityName}.\nUser verified on +91 ${regPhone}.`
        }).catch(() => {});

        const botMsg = {
          sender: 'bot',
          text: `Perfect! We have multiple verified developer projects across ${cityName} (1, 2, 3 & 4 BHK with Zero Brokerage). 🏢\n\n📞 Note: ${nameGreeting}our Senior Property Advisor will share the consolidated portfolio for ${cityName} on +91 ${regPhone}.\n\nIf you'd like to discuss or compare projects right now, tap "Ask Senior Advisor" below!`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setLeadState('completed');
        return;
      }

      if (leadDataRef.current.name) {
        const botMsg = {
          sender: 'bot',
          text: `Perfect! We have multiple verified developer projects across ${cityName} (1, 2, 3 & 4 BHK with Zero Brokerage). 🏢\n\nThank you, ${leadDataRef.current.name}! Please share your 10-digit mobile number so we can send the consolidated portfolio on WhatsApp.`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setLeadState('awaiting_number');
        return;
      }

      const botMsg = {
        sender: 'bot',
        text: `Perfect! We have multiple verified developer projects across ${cityName} (1, 2, 3 & 4 BHK with Zero Brokerage). 🏢\n\nOur team will share the complete consolidated project portfolio & master price sheet with you. May I know your full name please?`,
        time: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setLeadState('awaiting_name');
    }
  };

  // Handler when user clicks on a location chip
  const handleLocationSelect = async (cityName) => {
    if (!cityName) return;

    const userMsg = { sender: 'user', text: cityName, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setLeadData((prev) => ({ ...prev, location: cityName, propertyName: '' }));
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    await presentProjectsForCity(cityName);
    setIsTyping(false);
  };

  // Handler when user clicks on a project chip
  const handleProjectSelect = async (projectName) => {
    if (!projectName) return;

    // Handle "View More Projects" click
    if (projectName.includes('View More Projects')) {
      const allProjects = getProjectsForLocation(leadDataRef.current.location, 50);
      const remainingProjects = allProjects.slice(5);

      const moreMsg = {
        sender: 'bot',
        text: `Here are more verified developer projects in ${leadDataRef.current.location}:`,
        time: new Date(),
        type: 'project_chips',
        chips: [...remainingProjects, `All ${leadDataRef.current.location} Projects`]
      };
      setMessages((prev) => [...prev, moreMsg]);
      return;
    }

    const userMsg = { sender: 'user', text: projectName, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await presentProjectSelection(projectName, leadDataRef.current.location || 'Navi Mumbai');
    setIsTyping(false);
  };

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend.trim();
    if (!messageText) return;

    const userMsg = { sender: 'user', text: messageText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setIsTyping(true);

    try {
      // 0. Post-Submission flow in Active Session (User already provided phone):
      if (leadState === 'completed' || leadDataRef.current.phone) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Did the user type a city name?
        const matchedCity = findMatchedLocation(messageText);
        if (matchedCity) {
          setLeadData((prev) => ({ ...prev, location: matchedCity, propertyName: '' }));
          await presentProjectsForCity(matchedCity);
          return;
        }

        // Did the user type a project name?
        const matchedProp = findMatchedProject(messageText, leadDataRef.current.location);
        if (matchedProp) {
          await presentProjectSelection(matchedProp, leadDataRef.current.location || 'Navi Mumbai');
          return;
        }

        const target = leadDataRef.current.propertyName 
          ? `${leadDataRef.current.propertyName} (${leadDataRef.current.location})` 
          : (leadDataRef.current.location || 'Navi Mumbai');
        const phone = leadDataRef.current.phone || 'your number';

        const botMsg = {
          sender: 'bot',
          text: `Got it! 👍 Our Senior Property Advisor has your enquiry registered for ${target} and will address this directly on call at +91 ${phone}.\n\nIf you'd like to connect immediately or compare across multiple cities, you can call our direct developer desk at +91 7718853773.`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      // 1. If currently awaiting location:
      if (leadState === 'awaiting_location') {
        const matched = findMatchedLocation(messageText);

        if (matched) {
          setLeadData((prev) => ({ ...prev, location: matched, propertyName: '' }));
          await new Promise((resolve) => setTimeout(resolve, 500));
          await presentProjectsForCity(matched);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const botMsg = {
            sender: 'bot',
            text: `We currently feature verified direct developer projects in Kharghar, Seawoods, Palm Beach, Panvel, Vashi, Nerul, Belapur, Airoli, Taloja, Juinagar, Sanpada, Ghansoli & Roadpali.\n\nPlease tap your preferred city below:`,
            time: new Date(),
            type: 'location_chips',
            chips: VALID_CITIES
          };
          setMessages((prev) => [...prev, botMsg]);
        }
        return;
      }

      // 2. If awaiting project selection:
      if (leadState === 'awaiting_project') {
        const lower = messageText.toLowerCase();
        if (lower === 'all' || lower.includes('all projects') || lower === 'any' || lower === 'skip') {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await presentProjectSelection(`All ${leadDataRef.current.location} Projects`, leadDataRef.current.location);
          return;
        }

        const matchedProp = findMatchedProject(messageText, leadDataRef.current.location);
        const propName = matchedProp || messageText;

        await new Promise((resolve) => setTimeout(resolve, 500));
        await presentProjectSelection(propName, leadDataRef.current.location);
        return;
      }

      // 3. If awaiting user name:
      if (leadState === 'awaiting_name') {
        // If user directly entered phone number instead of name:
        const parsedPhone = parsePhoneNumber(messageText);
        if (parsedPhone) {
          const chosenLocation = leadDataRef.current.location || 'Navi Mumbai';
          const chosenProject = leadDataRef.current.propertyName || '';
          const customerName = leadDataRef.current.name || 'Valued Client';

          setLeadData((prev) => ({ ...prev, phone: parsedPhone }));
          saveLeadSession({ name: customerName, phone: parsedPhone });
          await new Promise((resolve) => setTimeout(resolve, 600));

          submitLead({
            formType: "AI Chatbot Lead",
            leadType: "AI Chatbot Lead",
            name: customerName,
            phone: parsedPhone,
            location: chosenLocation,
            region: chosenLocation,
            propertyName: chosenProject,
            message: chosenProject 
              ? `Project: ${chosenProject}\nLocation: ${chosenLocation}\nLead captured automatically via AI Chatbot Assistant.`
              : `Preferred Location: ${chosenLocation} (All Projects)\nLead captured automatically via AI Chatbot Assistant.`
          }).catch((err) => console.warn('[AIChatbot] Failed to submit chatbot lead:', err));

          const successTarget = chosenProject ? `${chosenProject} (${chosenLocation})` : chosenLocation;
          const botMsg = {
            sender: 'bot',
            text: `Thank you, ${customerName}! 🎉 Your request for ${successTarget} has been registered.\n\nOur property specialist will call you shortly on +91 ${parsedPhone} with direct developer pricing and floor plans.`,
            time: new Date()
          };
          setMessages((prev) => [...prev, botMsg]);
          setLeadState('completed');
          return;
        }

        if (isValidFullName(messageText)) {
          setLeadData((prev) => ({ ...prev, name: messageText }));
          saveLeadSession({ name: messageText, phone: leadDataRef.current.phone || '' });
          await new Promise((resolve) => setTimeout(resolve, 500));

          const targetLabel = leadDataRef.current.propertyName 
            ? ` for ${leadDataRef.current.propertyName}` 
            : (leadDataRef.current.location ? ` in ${leadDataRef.current.location}` : '');

          const botMsg = {
            sender: 'bot',
            text: `Thank you, ${messageText}! Could you please share your 10-digit mobile number so our team can send you direct developer brochures & pricing${targetLabel}?`,
            time: new Date()
          };
          setMessages((prev) => [...prev, botMsg]);
          setLeadState('awaiting_number');
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const botMsg = {
            sender: 'bot',
            text: "Please enter your valid full name (e.g., Rahul Sharma) so our advisors can address you properly.",
            time: new Date()
          };
          setMessages((prev) => [...prev, botMsg]);
        }
        return;
      }

      // 4. If awaiting phone number:
      if (leadState === 'awaiting_number') {
        const parsedPhone = parsePhoneNumber(messageText);

        if (!parsedPhone) {
          // If user re-typed or entered their name (e.g., 'sachin') instead of digits
          if (isValidFullName(messageText)) {
            setLeadData((prev) => ({ ...prev, name: messageText }));
            saveLeadSession({ name: messageText, phone: leadDataRef.current.phone || '' });
            await new Promise((resolve) => setTimeout(resolve, 500));

            const botMsg = {
              sender: 'bot',
              text: `Got it, ${messageText}! 👍 Could you please share your 10-digit mobile number (e.g., 9876543210) so we can send the floor plans & cost sheet on WhatsApp?`,
              time: new Date()
            };
            setMessages((prev) => [...prev, botMsg]);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
          const botMsg = {
            sender: 'bot',
            text: "Please enter a valid 10-digit mobile number (e.g., 9876543210) without country code or spaces.",
            time: new Date()
          };
          setMessages((prev) => [...prev, botMsg]);
          return;
        }

        // Valid phone entered!
        const chosenLocation = leadDataRef.current.location || 'Navi Mumbai';
        const chosenProject = leadDataRef.current.propertyName || '';
        const customerName = leadDataRef.current.name || 'Chatbot User';

        setLeadData((prev) => ({ ...prev, phone: parsedPhone }));
        saveLeadSession({ name: customerName, phone: parsedPhone });
        await new Promise((resolve) => setTimeout(resolve, 600));

        submitLead({
          formType: "AI Chatbot Lead",
          leadType: "AI Chatbot Lead",
          name: customerName,
          phone: parsedPhone,
          location: chosenLocation,
          region: chosenLocation,
          propertyName: chosenProject,
          message: chosenProject 
            ? `Project: ${chosenProject}\nLocation: ${chosenLocation}\nLead captured automatically via AI Chatbot Assistant.`
            : `Preferred Location: ${chosenLocation} (All Projects)\nLead captured automatically via AI Chatbot Assistant.`
        }).catch((err) => console.warn('[AIChatbot] Failed to submit chatbot lead:', err));

        const successTarget = chosenProject ? `${chosenProject} (${chosenLocation})` : chosenLocation;
        const botMsg = {
          sender: 'bot',
          text: `Thank you, ${customerName}! 🎉 Your request for ${successTarget} has been registered.\n\nOur property specialist will call you shortly on +91 ${parsedPhone} with direct developer pricing and floor plans.`,
          time: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setLeadState('completed');
        return;
      }
    } catch (error) {
      console.error('[AIChatbot] Error in chat processing:', error);
      const errorMsg = { 
        sender: 'bot', 
        text: "Sorry, I encountered an issue. Please try calling our desk directly at +91 7718853773.", 
        time: new Date() 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Handle Project & Advisor Quick Options Clicks
  const handleProjectQuickOptionClick = async (action) => {
    const project = leadData.propertyName;
    const city = leadData.location || 'Navi Mumbai';
    const details = project ? getPropertyDetails(project) : null;
    const priceText = details?.price || 'Direct developer rate';
    const bhkText = details?.bhk || 'Modern residences';
    const devText = details?.developer || 'Developer';
    const hasPhone = Boolean(leadDataRef.current.phone);
    const regPhone = leadDataRef.current.phone;
    const currentName = leadDataRef.current.name;

    if (action === 'pricing') {
      const userMsg = { sender: 'user', text: `${project || city} Price & Plans`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let botResponseText = '';
      if (hasPhone) {
        botResponseText = `Pricing for ${project || city} starts from ${priceText} directly from ${devText} with Zero Brokerage. 🏢\n\n📞 Note: Your enquiry is registered! Our Senior Advisor will share the detailed unit-wise cost sheet on your number (+91 ${regPhone}).`;
      } else if (currentName) {
        botResponseText = `Pricing for ${project || city} starts from ${priceText} directly from ${devText} with Zero Brokerage. 🏢\n\nThank you, ${currentName}! Could you please share your 10-digit mobile number so our team can send you the complete cost sheet & floor plans?`;
        setLeadState('awaiting_number');
      } else {
        botResponseText = `Pricing for ${project || city} starts from ${priceText} directly from ${devText} (Zero Brokerage).\n\nTo share the unit-wise cost sheet and payment plan, may I know your full name please?`;
        setLeadState('awaiting_name');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText, time: new Date() }]);
      setIsTyping(false);
      return;
    }

    if (action === 'brochure') {
      const userMsg = { sender: 'user', text: `Download ${project || city} Brochure`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let botResponseText = '';
      if (hasPhone) {
        botResponseText = `Official brochure and floor plans for ${project || city} will be delivered to your WhatsApp on +91 ${regPhone}. 📄`;
      } else if (currentName) {
        botResponseText = `Thank you, ${currentName}! Please share your 10-digit mobile number so we can deliver the high-resolution brochure directly to your WhatsApp.`;
        setLeadState('awaiting_number');
      } else {
        botResponseText = `We can deliver the official high-resolution brochure and floor plans for ${project || city} directly to your WhatsApp!\n\nMay I know your full name please?`;
        setLeadState('awaiting_name');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText, time: new Date() }]);
      setIsTyping(false);
      return;
    }

    if (action === 'site_visit') {
      const userMsg = { sender: 'user', text: `Book Free Site Visit for ${project || city}`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let botResponseText = '';
      if (hasPhone) {
        botResponseText = `We will arrange your free door-to-door AC cab visit for ${project || city}! 🚗 Our coordinator will call you on +91 ${regPhone} to confirm your preferred timing.`;
      } else if (currentName) {
        botResponseText = `Great, ${currentName}! We arrange free door-to-door AC cab pick-up & drop for site visits. 🚗\n\nPlease share your 10-digit mobile number to schedule your visit.`;
        setLeadState('awaiting_number');
      } else {
        botResponseText = `We arrange free door-to-door AC cab pick-up & drop for site visits at ${project || city}! 🚗\n\nTo schedule your visit, may I know your full name please?`;
        setLeadState('awaiting_name');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText, time: new Date() }]);
      setIsTyping(false);
      return;
    }

    if (action === 'ask_advisor') {
      const userMsg = { sender: 'user', text: `Ask Senior Advisor`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let botResponseText = '';
      if (hasPhone) {
        botResponseText = `📞 Our Senior Property Advisor is assigned to your enquiry on +91 ${regPhone}.\n\nThey can help you:\n• Compare projects across multiple cities\n• Negotiate special direct developer discounts\n• Check unit layouts & bank loan eligibility\n\nYou can also speak directly with our desk at +91 7718853773.`;
      } else if (currentName) {
        botResponseText = `Thank you, ${currentName}! Please share your 10-digit mobile number so our Senior Property Advisor can connect with you directly.`;
        setLeadState('awaiting_number');
      } else {
        botResponseText = `Our Senior Property Advisors provide unbiased comparisons across all top developers in Navi Mumbai with Zero Brokerage.\n\nMay I know your full name please to connect you?`;
        setLeadState('awaiting_name');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText, time: new Date() }]);
      setIsTyping(false);
      return;
    }

    if (action === 'explore_cities') {
      const userMsg = { sender: 'user', text: `Explore Other Cities`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLeadData((prev) => ({ ...prev, location: '', propertyName: '' }));
      if (!hasPhone) {
        setLeadState('awaiting_location');
      }

      const botMsg = {
        sender: 'bot',
        text: hasPhone
          ? `Sure! Which other city in Navi Mumbai would you like to explore? Tap below:`
          : `Sure! Which location in Navi Mumbai would you like to explore? Tap below:`,
        time: new Date(),
        type: 'location_chips',
        chips: VALID_CITIES
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      return;
    }

    if (action === 'all_city_projects') {
      await presentProjectSelection(`All ${city} Projects`, city);
      return;
    }

    if (action === 'change_project') {
      const userMsg = { sender: 'user', text: `Change project`, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLeadData((prev) => ({ ...prev, propertyName: '' }));
      await presentProjectsForCity(city);
      setIsTyping(false);
      return;
    }
  };

  // Quick Options appear when a project is chosen or city is active
  const currentQuickOptions = useMemo(() => {
    if (!leadData.propertyName && !leadData.location && leadState !== 'completed') {
      return [];
    }

    if (leadData.propertyName) {
      return [
        { label: `💰 Price & Plans`, action: 'pricing' },
        { label: `📄 Download Brochure`, action: 'brochure' },
        { label: `📅 Free Site Visit`, action: 'site_visit' },
        { label: `📞 Ask Senior Advisor`, action: 'ask_advisor' },
        { label: `🔄 Explore Other Cities`, action: 'explore_cities' }
      ];
    }

    if (leadData.location) {
      return [
        { label: `🏢 All ${leadData.location} Projects`, action: 'all_city_projects' },
        { label: `📞 Ask Senior Advisor`, action: 'ask_advisor' },
        { label: `🔄 Explore Other Cities`, action: 'explore_cities' }
      ];
    }

    if (leadState === 'completed') {
      return [
        { label: `📞 Call Desk (+91 7718853773)`, action: 'call_support' },
        { label: `🔄 Explore Other Cities`, action: 'explore_cities' }
      ];
    }

    return [];
  }, [leadData.propertyName, leadData.location, leadState]);

  const getInputPlaceholder = () => {
    if (isTyping) return "Sonakshi is typing...";
    if (leadDataRef.current.phone || leadState === 'completed') return "Ask any questions or tap options above...";
    if (leadState === 'awaiting_location') return "Type city or tap a chip above...";
    if (leadState === 'awaiting_project') return "Select project chip above...";
    if (leadState === 'awaiting_name') return "Enter your full name...";
    if (leadState === 'awaiting_number') return "Enter 10-digit mobile number...";
    return "Type a message...";
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-[76px] md:top-[88px] right-6 z-40 w-[92vw] sm:w-[420px] h-[calc(100vh-100px)] md:h-[calc(100vh-112px)] max-h-[620px] bg-white rounded-2xl shadow-2xl border border-gold/25 flex flex-col overflow-hidden animate-slideUp"
      role="dialog"
      aria-label="AI Chatbot Assistant Window"
    >
      {/* Header section */}
      <header className="bg-gold text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white/30">
            <img src={CHAT_CONFIG.avatarUrl} alt={CHAT_CONFIG.botName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold font-sans leading-none tracking-wide">{CHAT_CONFIG.botName}</h2>
              <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-full font-medium text-white/95">Property AI</span>
            </div>
            <span className="text-[10px] text-white/85 font-sans flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Online | Zero Brokerage Direct Desk
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-white/80 p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none cursor-pointer"
          aria-label="Close Chat Window"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Selected Location / Project Pill Bar */}
      {leadData.location && (
        <div className="bg-gold/10 px-4 py-1.5 border-b border-gold/20 flex items-center justify-between text-xs text-gold-darker font-medium">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="truncate">
              <strong>{leadData.location}</strong>
              {leadData.propertyName && (
                <span className="text-sage-dark font-normal"> › {leadData.propertyName}</span>
              )}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              // Reset ONLY location and project, preserve user name and phone!
              setLeadData((prev) => ({ ...prev, location: '', propertyName: '' }));
              if (!leadDataRef.current.phone) {
                setLeadState('awaiting_location');
              }
              setMessages((prev) => [
                ...prev,
                {
                  sender: 'bot',
                  text: leadDataRef.current.phone
                    ? "Sure! Which other city in Navi Mumbai would you like to explore? Tap below:"
                    : "Sure! Which location in Navi Mumbai would you like to explore? Tap below:",
                  time: new Date(),
                  type: 'location_chips',
                  chips: VALID_CITIES
                }
              ]);
            }}
            className="text-[10px] bg-white hover:bg-gold hover:text-white text-gold-darker border border-gold/30 px-2 py-0.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer"
          >
            Reset City
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-sage-deep/15 custom-scrollbar"
        aria-label="Chat message log history"
      >
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex items-start gap-2 max-w-[90%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden text-xs shrink-0 ${
              msg.sender === 'user' ? 'bg-gold/15 text-gold' : 'ring-1 ring-gold/20'
            }`}>
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <img src={CHAT_CONFIG.avatarUrl} alt={CHAT_CONFIG.botName} className="w-full h-full object-cover" />
              )}
            </div>

            <div className={`p-3 rounded-2xl shadow-sm text-sm font-sans leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-gold text-white rounded-tr-none' 
                : 'bg-white text-sage-dark border border-sage-border/60 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Location or Project Chips attached to Bot Message */}
              {msg.chips && msg.chips.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-sage-border/40">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sage-muted mb-1.5 block flex items-center gap-1">
                    {msg.type === 'project_chips' ? (
                      <>
                        <Building2 className="w-3 h-3 text-gold" /> Select Project:
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3 text-gold" /> Select City:
                      </>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.chips.map((chipLabel) => {
                      const isProject = msg.type === 'project_chips';
                      const isAllOption = chipLabel.startsWith('All ');

                      return (
                        <button
                          key={chipLabel}
                          type="button"
                          onClick={() => {
                            if (isProject) {
                              handleProjectSelect(chipLabel);
                            } else {
                              handleLocationSelect(chipLabel);
                            }
                          }}
                          className={`text-[11px] font-sans font-semibold border px-2.5 py-1 rounded-full transition-all duration-150 flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs ${
                            isAllOption
                              ? 'bg-amber-100/80 hover:bg-gold hover:text-white text-amber-900 border-gold/40 font-bold'
                              : 'bg-gold/10 hover:bg-gold hover:text-white text-gold-darker border-gold/30'
                          }`}
                        >
                          {isProject ? (
                            <Building2 className="w-2.5 h-2.5 text-gold shrink-0" />
                          ) : (
                            <MapPin className="w-2.5 h-2.5 text-gold shrink-0" />
                          )}
                          <span>{chipLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className={`text-[9px] block text-right mt-1.5 ${
                msg.sender === 'user' ? 'text-white/70' : 'text-sage-muted'
              }`}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-gold/20">
              <img src={CHAT_CONFIG.avatarUrl} alt={CHAT_CONFIG.botName} className="w-full h-full object-cover" />
            </div>
            <div className="bg-white text-sage-muted border border-sage-border/60 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Options */}
      {currentQuickOptions.length > 0 && (
        <div className="px-4 py-2 border-t border-sage-border/40 bg-white animate-fadeIn">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sage-muted mb-1.5 block flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 text-gold" /> 
            {leadData.propertyName ? `${leadData.propertyName} Options:` : "Explore & Support:"}
          </span>
          <div className="flex flex-wrap gap-1.5 py-0.5">
            {currentQuickOptions.map((opt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (opt.action === 'call_support') {
                    window.open('tel:+917718853773', '_self');
                  } else {
                    handleProjectQuickOptionClick(opt.action);
                  }
                }}
                className={`text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full transition-all duration-200 focus-visible:ring-1 focus-visible:ring-gold focus:outline-none cursor-pointer ${
                  opt.action === 'ask_advisor' || opt.action === 'call_support'
                    ? 'bg-gold/15 hover:bg-gold hover:text-white text-gold-darker border border-gold/40'
                    : opt.action === 'explore_cities'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-sage-deep/50 hover:bg-gold/15 text-sage-dark border border-sage-border hover:border-gold'
                }`}
                aria-label={opt.label}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Submission Area */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 border-t border-sage-border/50 bg-white flex items-center gap-2"
      >
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getInputPlaceholder()}
            className="w-full px-3 py-2 bg-sage-input border border-sage-border/80 rounded-xl text-sm text-sage-dark placeholder-sage-muted/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all pr-8"
            aria-label="Type message here"
            disabled={isTyping}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sage-muted hover:text-sage-dark text-xs p-0.5"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isTyping || !inputValue.trim()}
          className="bg-gold hover:bg-gold-light text-white p-2 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center focus-visible:ring-2 focus-visible:ring-gold focus:outline-none cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
