import React, { useState } from 'react';
import { Send, User, Phone as PhoneIcon, MapPin, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import SectionDivider from './SectionDivider';
import CountryCodeDropdown from './CountryCodeDropdown';
import { submitLead } from '../utils/submitLead';
import { DEFAULT_COUNTRY_CODE, validatePhoneNumber, getCountryByCode } from '../data/countryCodes';

const ContactFAQSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: DEFAULT_COUNTRY_CODE,
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
      a: "Buying directly from the developer gives you access to developer pricing, zero brokerage, and complete transparency throughout the buying process. You also benefit from authentic project information and may have access to developer-exclusive payment plans, launch offers, and booking schemes, making your property purchase simple, transparent, and cost-effective."
    },
    {
      q: "Are these projects sold directly by the builder?",
      a: "Yes. All projects listed on Directly By Developers are verified developer projects. Your enquiry is connected to the developer’s official sales team or an authorized representative, ensuring authentic project information, complete transparency, and zero brokerage."
    },
    {
      q: "What types of properties do you deal with?",
      a: "We showcase premium residential and commercial projects, including 1, 2, 3, 4 & 5 BHK apartments, luxury residences, villas, commercial offices, retail spaces, and mixed-use developments from leading developers across prime locations."
    },
    {
      q: "Are these properties MahaRERA approved?",
      a: "Yes. All projects listed on our platform display their official MahaRERA registration number, allowing you to verify the project details and ensuring compliance with the applicable real estate regulations."
    },
    {
      q: "How do I book a site visit?",
      a: "Booking a site visit is easy. Simply fill out the Contact Us form, click the WhatsApp button, or call our helpline. Our property experts will coordinate your visit with the developer. Complimentary pickup & drop may be available for site visits where offered by the developer."
    },
    {
      q: "Do you charge any brokerage?",
      a: "No. We charge absolutely zero brokerage. Our platform is completely free for homebuyers, allowing you to explore verified developer projects and connect directly with developers without paying any brokerage."
    },
    {
      q: "What’s the difference between ‘Ready to Move’ and ‘Under Construction’ properties?",
      a: "Ready to Move properties are fully completed and available for immediate possession. Under Construction properties are still being developed and may offer attractive pricing, flexible payment plans, and the potential for value appreciation before completion."
    },
    {
      q: "Do you have offers or discounts running currently?",
      a: "Yes. Many developers periodically introduce special offers, festive schemes, flexible payment plans, stamp duty benefits, and other promotional incentives. Available offers vary by project and developer. Our property experts will help you explore the latest offers applicable to your chosen project."
    },
    {
      q: "How do I get in touch for more information?",
      a: "You can call us directly at +91 77188 53773, start a conversation via WhatsApp, or submit your details through the Contact Us form. Our property experts will get in touch with you promptly to assist with your requirements."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
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

    const phoneResult = validatePhoneNumber(formData.phone, formData.countryCode);
    if (!phoneResult.isValid) {
      setError(phoneResult.errorMsg);
      return;
    }

    setError('');
    setIsAnimating(true);

    const fullPhone = phoneResult.fullNumber;

    submitLead({
      formType: "Contact FAQ Page Form",
      name: formData.name,
      phone: fullPhone,
      visitDay: formData.visitDay,
      region: formData.region,
      message: formData.message
    })
      .then((success) => {
        setIsAnimating(false);
        if (success) {
          setIsSubmitted(true);
        } else {
          setError('Submission failed. Please try again.');
        }
      })
      .catch((err) => {
        setIsAnimating(false);
        setError('A network error occurred. Please check your connection.');
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      countryCode: DEFAULT_COUNTRY_CODE,
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
        <p className="text-sm text-sage-muted mt-2 max-w-2xl mx-auto font-sans">
          Schedule a site visit or receive official project brochures directly from the developer—with complete transparency and zero brokerage.
        </p>
        <SectionDivider className="my-4 max-w-sm mx-auto" />
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT COLUMN: Contact Form */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF6F0] rounded-xl p-6 md:p-8 shadow-lg border border-gold/20 flex flex-col justify-between min-h-[520px]">

            {/* Advisor Box */}
            <div className="bg-white p-4 rounded-xl border border-sage-border/60 mb-5 flex items-center gap-3 shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-sage-deep flex items-center justify-center border border-gold/30 overflow-hidden">
                  <svg className="w-9 h-9 text-sage-dark mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold">OFFICIAL ADVISOR</h4>
                <p className="text-sm font-bold text-[#16281E] leading-tight">Talk to a Property Expert</p>
                <p className="text-[10px] text-sage-muted mt-0.5">Assigned instantly upon enquiry • Direct developer access • No bots</p>
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
                        placeholder="Aarav Sharma"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm text-[#16281E] transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input with Country Code Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#16281E] mb-1.5">
                      Phone Number *
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Country Code Dropdown */}
                      <CountryCodeDropdown
                        value={formData.countryCode}
                        onChange={(code) => {
                          setFormData((prev) => ({ ...prev, countryCode: code }));
                          if (error) setError('');
                        }}
                        placement="bottom"
                        buttonClassName="py-3 px-2.5 rounded-lg bg-white border-gold/20 shadow-xs text-xs"
                      />

                      {/* Phone Input */}
                      <div className="relative flex-1 flex items-center">
                        <PhoneIcon className="absolute left-3.5 w-4 h-4 text-gold/80" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={formData.countryCode === '+91' ? '10-digit mobile number' : `e.g. ${getCountryByCode(formData.countryCode).example}`}
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm text-[#16281E] transition-all duration-300 shadow-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Destination dropdown (No "Destination Node" label as requested) */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <div className="relative flex items-center mt-6">
                        <MapPin className="absolute left-3 w-4 h-4 text-gold/80 pointer-events-none" />
                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] appearance-none transition-all duration-300"
                        >
                          <option value="Kharghar">Kharghar</option>
                          <option value="Panvel">Panvel</option>
                          <option value="Nerul">Nerul</option>
                          <option value="Belapur">Belapur</option>
                          <option value="Vashi">Vashi</option>
                          <option value="Juinagar">Juinagar</option>
                          <option value="Sanpada">Sanpada</option>
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
                          className="w-full pl-9 pr-3 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] appearance-none transition-all duration-300"
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/40 text-xs text-[#16281E] resize-none transition-all duration-300"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Submitting...
                      </span>
                    ) : (
                      <>
                        Submit
                        <Send className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Screen with custom drawing checkmark */
                <div className="text-center space-y-4 py-8 animate-fadeIn flex flex-col items-center justify-center">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-bold text-[#16281E]">Advisor Requested Successfully!</h4>
                    <p className="text-xs text-sage-muted mt-2 max-w-xs mx-auto">
                      Thank you, <strong className="text-gold">{formData.name}</strong>. Our developer team will contact you on <strong className="text-gold">{formData.countryCode} {formData.phone}</strong> shortly.
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

            {/* Bottom free pickup highlight */}
            {!isSubmitted && (
              <div className="mt-6 pt-4 border-t border-gold/10 w-full flex items-center justify-center gap-2">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
                  🚕 Complimentary Pickup & Drop on Developer-Sponsored Site Visits.
                </span>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: FAQs with smooth height + opacity */}
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

                {/* FAQ Content Box with Combined Height & Opacity Easing */}
                <div
                  className={`pl-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'
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
