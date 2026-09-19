/**
 * Chatbot Configuration and Response Logic
 * Edit these responses or replace the getResponseForMessage function with an AI API (Gemini/OpenAI) call.
 */

const base = import.meta.env.BASE_URL;

export const CHAT_CONFIG = {
  botName: "Sonakshi",
  avatarUrl: `${base}images/sonakshi.jpeg`,
  welcomeMessage: "Hello 👋 I'm Sonakshi. Welcome! I'm here to help you find the perfect property. How can I assist you today?",

  // Quick Questions suggestions rendered at the bottom of the chat
  quickQuestions: [
    { label: "🏠 Browse Projects", query: "Show me all projects" },
    { label: "💰 Latest Price", query: "What is the price range of properties?" },
    { label: "📅 Book Site Visit", query: "How do I book a site visit?" },
    { label: "📄 Download Brochure", query: "How can I download a brochure?" },
    { label: "📞 Request Callback", query: "I want to request a callback" },
    { label: "📍 Project Location", query: "Where are your properties located?" }
  ],

  // Predefined keyword responses for static matching
  responses: {
    projects: "We showcase featured luxury projects like Today Upvan (Kharghar), Sai Prerna (Kharghar), Pioneer The View (CBD Belapur), and Shreeji Divine (Kharghar). You can browse them on our listings section or ask me details about any specific project!",
    bhk: "We offer elegant 1, 2, 3, 4 & 5 BHK flats directly from developers in Nerul, Kharghar, Panvel, Belapur, Vashi, Juinagar, and Sanpada. Which location are you interested in?",
    price: "Prices start from ₹ 49 Lakhs for premium 1 & 2 BHK flats (e.g., Today Upvan) up to ₹ 3.5 Cr+ for high-end luxury residences. All bookings are direct with developers—absolutely ZERO brokerage!",
    location: "Our luxury projects are situated in prime locations across Navi Mumbai: Nerul, Panvel, Kharghar, Belapur, Vashi, Juinagar, and Sanpada. Each offers excellent connectivity to highway, railway, and commercial hubs.",
    callback: "Sure! Please fill in your name and number, or call us directly at +91 7718853773. We will have our team contact you shortly.",
    visit: "We arrange free site visits with door-to-door pick-up and drop service! Let us know your preferred date and time, and we'll schedule it for you.",
    brochure: "You can download project brochures by clicking 'Official Site' on the property card or submitting an enquiry. I can also have the brochure sent directly to you on WhatsApp!",

    // Project specific replies
    upvan: "Today Upvan (Upper Kharghar) by Today Group features 1 & 2 BHK flats starting at ₹ 49 Lakhs, with possession in Dec 2026. RERA: P52000030115.",
    prerna: "Sai Prerna (Kharghar) by Paradise Group features premium 1 BHK flats starting at ₹ 74 Lacs. It is Ready to Move and RERA compliant (P52000003290).",
    view: "Pioneer The View (CBD Belapur) has luxury 2 & 3 BHK apartments starting at ₹ 1.98 Cr, with possession in Dec 2026. Features scenic Parsik Hill views.",
    divine: "Shreeji Divine (Sector 35, Kharghar) has luxury 2, 3 & 4 BHK sky deck residences starting at ₹ 1.96 Cr. It's a 48-storey iconic tower.",

    // Fallback default response
    default: "I'm sorry, I can only answer property-related questions. Please try asking about our projects, locations, prices, booking site visits, or choose one of the quick options below!"
  }
};

/**
 * Parses user message and matches keywords to return simulated responses.
 * Can be modified to fetch dynamic AI replies from standard REST endpoints.
 * @param {string} userMessage - The raw message input from the user.
 * @returns {Promise<string>} The response message from the bot.
 */
export async function getResponseForMessage(userMessage) {
  const message = userMessage.toLowerCase();

  // Simulated typing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Chatbot logic matching keywords
  if (message.includes("project") || message.includes("browse") || message.includes("show me all")) {
    return CHAT_CONFIG.responses.projects;
  }
  if (message.includes("2 bhk") || message.includes("3 bhk") || message.includes("bhk") || message.includes("flats") || message.includes("apartments")) {
    return CHAT_CONFIG.responses.bhk;
  }
  if (message.includes("price") || message.includes("cost") || message.includes("pricing") || message.includes("lakh") || message.includes("cr")) {
    return CHAT_CONFIG.responses.price;
  }
  if (message.includes("location") || message.includes("where") || message.includes("kharghar") || message.includes("vashi") || message.includes("panvel") || message.includes("nerul") || message.includes("juinagar") || message.includes("sanpada") || message.includes("belapur")) {
    return CHAT_CONFIG.responses.location;
  }
  if (message.includes("call") || message.includes("phone") || message.includes("contact") || message.includes("callback") || message.includes("number")) {
    return CHAT_CONFIG.responses.callback;
  }
  if (message.includes("visit") || message.includes("site") || message.includes("book")) {
    return CHAT_CONFIG.responses.visit;
  }
  if (message.includes("brochure") || message.includes("pdf") || message.includes("download")) {
    return CHAT_CONFIG.responses.brochure;
  }
  if (message.includes("upvan")) {
    return CHAT_CONFIG.responses.upvan;
  }
  if (message.includes("prerna")) {
    return CHAT_CONFIG.responses.prerna;
  }
  if (message.includes("view")) {
    return CHAT_CONFIG.responses.view;
  }
  if (message.includes("divine")) {
    return CHAT_CONFIG.responses.divine;
  }

  // Placeholder for real AI API integration:
  /*
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("AI API Error:", err);
  }
  */

  return CHAT_CONFIG.responses.default;
}
