import React, { useState } from 'react';
import { CheckCircle, Send, User, Phone as PhoneIcon, MapPin, Calendar, MessageSquare, ShieldAlert } from 'lucide-react';
import SectionDivider from './SectionDivider';

const ContactFAQSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDay: 'This Weekend',
    region: 'Kharghar',
    message: ''
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Accordion active index
  const [activeIndex, setActiveIndex] = useState(0); // Open first by default

  const faqs = [
    {
      q: "What are the benefits of buying directly from the developer?",
      a: "Buying directly from the developer ensures you get the absolute best price guaranteed, complete transparency, direct updates on construction progress, and zero brokerage fees. It also opens access to developer-exclusive payment plans and booking schemes."
    },
    {
      q: "Are these projects sold directly by the builder?",
      a: "Yes, all listings on our platform are verified direct-from-developer projects. You connect directly with the official builder relationship managers, ensuring no mediators are involved."
    },
    {
      q: "What types of properties do you deal with?",
      a: "We list premium residential properties, including 1, 2, 3, 4, and 5 BHK apartments, luxury duplexes, and independent gated villa estates across prime locations."
    },
    {
      q: "Are these properties RERA approved?",
      a: "Absolutely. Every property listed on our site has its official MahaRERA registration number clearly displayed, conforming strictly to the guidelines set by the real estate regulatory authority."
    },
    {
      q: "How do I book a site visit?",
      a: "You can book a site visit by filling out the 'Contact Us' form, clicking the WhatsApp button, or calling our helpline. We also offer a complimentary free pickup and drop service for site visits."
    },
    {
      q: "Do you charge any brokerage?",
      a: "No, we charge absolutely zero brokerage. Our services are 100% free for home buyers as we connect you directly to developers."
    },
    {
      q: "What's the difference between 'Ready to Move' and 'Under Construction'?",
      a: "'Ready to Move' properties are completed and ready for immediate possession. 'Under Construction' properties are currently being built, offering lower entry prices and flexible payment plans over the construction timeline."
    },
    {
      q: "Do you have offers or discounts running currently?",
      a: "Yes, developers offer exclusive perks such as 'No EMI till 2026', stamp duty waivers, complimentary modular kitchens, and air-conditioning units for bookings made through our platform."
    },
    {
      q: "How do I get in touch for more info?",
      a: "You can call us directly at +91 9876543210, start a WhatsApp chat via the floating buttons, or submit your details in the Contact Us form for an immediate callback."
    },
    {
      q: "What is the price of Lodha Properties in Nerul?",
      a: "Lodha properties in Nerul start from 1.45 Cr for premium 2 BHK homes and go up to 6.20 Cr for luxury 5 BHK sea-view suites on Palm Beach Road."
    },
    {
      q: "Are there affordable Lodha homes in Panvel?",
      a: "Yes, projects like Lodha Crown Panvel offer premium quality smart 1 & 2 BHK homes starting from an affordable range of 33 Lakhs onwards."
    },
    {
      q: "What are the Lodha project options in Kharghar?",
      a: "In Kharghar, you can choose from modern residential townships like Lodha Amara, high-rise premium apartments like Lodha Kharghar, and premium independent estates like Lodha Villa Gold."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (formData.name.length < 3) {
      setError('Please enter a valid name.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setIsAnimating(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsAnimating(false);
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      visitDay: 'This Weekend',
      region: 'Kharghar',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#E8EDE8]/40 border-t border-sage-border/30">
      {/* Upper Title Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#16281E] tracking-tight font-serif">
          Connect With Our Experts
        </h2>
        <p className="text-sm text-sage-muted mt-2 max-w-xl mx-auto font-sans">
          Schedule a premium site visit or get instant project brochures directly from the developer.
        </p>
        <SectionDivider className="my-4 max-w-sm mx-auto" />
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Clean Premium Contact Form with reduced rounded corners */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF6F0] rounded-xl p-6 md:p-8 shadow-lg border border-gold/20 flex flex-col justify-between min-h-[520px]">
            
            {/* Human Relationship Manager Generator Box */}
            <div className="bg-white p-4 rounded-xl border border-sage-border/60 mb-5 flex items-center gap-3 shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-sage-deep flex items-center justify-center border border-gold/30 overflow-hidden">
                  {/* Human Representative SVG avatar */}
                  <svg className="w-9 h-9 text-sage-dark mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                {/* Active Status indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold">Official Advisor</h4>
                <p className="text-sm font-bold text-[#16281E] leading-tight">Talk to a Real Developer Expert</p>
                <p className="text-[10px] text-sage-muted mt-0.5">Assigned instantly upon submission • No Bots</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-grow flex flex-col justify-center font-sans">
              {error && (
                <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200 text-center mb-4">
                  {error}
                </div>
              )}

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-gold/80" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm text-[#16281E] transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative flex items-center">
                      <PhoneIcon className="absolute left-3.5 w-4 h-4 text-gold/80" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm text-[#16281E] transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Destination Node & Visit Day */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                        Destination Node
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3 w-4 h-4 text-gold/80 pointer-events-none" />
                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] appearance-none"
                        >
                          <option value="Kharghar">Kharghar</option>
                          <option value="Panvel">Panvel</option>
                          <option value="Nerul">Nerul</option>
                          <option value="Vashi">Vashi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                        Preferred Day
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-3 w-4 h-4 text-gold/80 pointer-events-none" />
                        <select
                          name="visitDay"
                          value={formData.visitDay}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] appearance-none"
                        >
                          <option value="Today">Today</option>
                          <option value="Tomorrow">Tomorrow</option>
                          <option value="This Weekend">This Weekend</option>
                          <option value="Next Week">Next Week</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                      Message / Remarks
                    </label>
                    <div className="relative flex items-start">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gold/80" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Brochure details, configuration required, etc."
                        rows="2.5"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isAnimating}
                    className="w-full bg-[#16281E] hover:bg-[#253e2e] text-white font-bold py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg transform hover:-translate-y-0.5"
                  >
                    {isAnimating ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Connecting...
                      </span>
                    ) : (
                      <>
                        Assign Relationship Advisor
                        <Send className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Screen */
                <div className="text-center space-y-4 py-8 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 border border-green-200 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#16281E]">Advisor Requested Successfully!</h4>
                    <p className="text-xs text-sage-muted mt-2 max-w-xs mx-auto">
                      Thank you, <strong className="text-gold">{formData.name}</strong>. Our official developer relationship advisor will contact you on <strong className="text-gold">+91 {formData.phone}</strong> shortly.
                    </p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="text-xs text-[#16281E] hover:text-gold hover:underline font-bold uppercase tracking-wider block mx-auto pt-4"
                  >
                    Request Callback Again
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Footer Taxi Highlight */}
            {!isSubmitted && (
              <div className="mt-6 pt-4 border-t border-gold/10 w-full flex items-center justify-center gap-2">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
                  🚕 Free Gated Site Pickup & Drop Included
                </span>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: FAQs */}
        <div className="lg:col-span-7 space-y-3.5 bg-white/60 p-6 md:p-8 rounded-xl border border-sage-border/40 shadow-sm">
          <h3 className="text-lg font-extrabold text-[#16281E] font-serif mb-4 flex items-center gap-2">
            <span>Frequently Asked Questions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
          </h3>
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border-b border-[#CFD9CF]/60 pb-3.5 last:border-b-0 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-start gap-3 w-full text-left font-bold text-[#16281E] hover:text-gold transition-colors py-2 focus:outline-none"
                >
                  <span className={`text-gold mt-1 shrink-0 text-[10px] transform transition-transform duration-300 ${isOpen ? 'rotate-90 text-gold' : 'text-[#CFD9CF]'}`}>
                    ►
                  </span>
                  <span className="text-sm font-sans leading-tight">
                    {faq.q}
                  </span>
                </button>

                {/* FAQ Content Box */}
                <div
                  className={`pl-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[160px] mt-2 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs text-sage-muted leading-relaxed font-sans bg-sage-deep/30 p-3.5 rounded-xl border border-sage-border/30">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ContactFAQSection;
