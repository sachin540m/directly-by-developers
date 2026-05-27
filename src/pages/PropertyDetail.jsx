import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, MapPin, Tag, Landmark, Phone, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import SectionDivider from '../components/SectionDivider';
import { properties } from '../data/properties';

const PropertyDetail = () => {
  const { slug } = useParams();
  const property = properties.find((p) => p.slug === slug);

  // Form states (Right column inline enquiry)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Scroll to top on page render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Set page title for SEO
  useEffect(() => {
    if (property) {
      document.title = `${property.name} by ${property.developer} in ${property.location} | Directly By Developers`;
      setFormData((prev) => ({
        ...prev,
        message: `I am interested in ${property.name}, ${property.location}. Please send pricing, brochure, and floor plan options.`
      }));
    }
  }, [property]);

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-deep">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8 text-center">
          <div className="bg-slate-card p-8 rounded-xl shadow-md border border-slate-border/60 max-w-md">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 font-serif">Property Not Found</h2>
            <p className="text-slate-muted mb-6">
              The property page you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { name, developer, location, city, bhk, price, offer, image, description, amenities, floorPlans, reraNumber, possession, officialUrl } = property;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: `I am interested in ${name}, ${location}. Please send pricing, brochure, and floor plan options.`,
      });
    }, 4000);
  };

  const formattedPhoneNumber = "9876543210";
  const whatsappUrl = `https://wa.me/91${formattedPhoneNumber}?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(name)}%20at%20${encodeURIComponent(location)}.`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-deep">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back link & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-muted hover:text-gold font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Properties
          </Link>

          <nav className="text-xs text-slate-muted font-semibold tracking-wide uppercase">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/?city=${city.toLowerCase()}`} className="hover:text-gold">{city}</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">{name}</span>
          </nav>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (60% / 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Image Wrapper with reduced rounding */}
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-border/60 bg-slate-card">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {city}
              </div>
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                No Brokerage
              </div>
            </div>

            {/* Header info */}
            <div className="bg-slate-card p-6 md:p-8 rounded-xl shadow-sm border border-slate-border/80">
              <span className="text-gold font-bold text-xs uppercase tracking-widest block mb-2">
                Premier Gated Community
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark font-serif leading-tight">
                {name}
              </h1>
              <p className="text-slate-muted mt-1 font-semibold">By {developer}</p>
              
              <SectionDivider className="my-6" />

              {/* USP Badge */}
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-semibold text-sm px-4 py-2 rounded-xl">
                ✨ Exclusive Deal: <span className="font-bold">{offer}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-slate-card p-6 md:p-8 rounded-xl shadow-sm border border-slate-border/80 space-y-4">
              <h2 className="text-2xl font-bold text-slate-dark font-serif border-b border-slate-border/50 pb-3">
                About This Project
              </h2>
              <p className="text-[#2D3035] text-base leading-relaxed whitespace-pre-line font-sans">
                {description}
              </p>
            </div>

            {/* Floor Plans Section */}
            <div className="bg-slate-card p-6 md:p-8 rounded-xl shadow-sm border border-slate-border/80 space-y-4">
              <h2 className="text-2xl font-bold text-slate-dark font-serif border-b border-slate-border/50 pb-3">
                Config & Floor Plans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {floorPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-border/50 bg-slate-deep/60 p-4 rounded-xl text-center shadow-sm flex flex-col justify-center min-h-[90px]"
                  >
                    <span className="text-gold font-bold text-lg font-serif">
                      {plan.split(' - ')[0]}
                    </span>
                    <span className="text-slate-muted text-sm font-semibold mt-1">
                      {plan.split(' - ')[1] || 'Config Option'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-slate-card p-6 md:p-8 rounded-xl shadow-sm border border-slate-border/80 space-y-4">
              <h2 className="text-2xl font-bold text-slate-dark font-serif border-b border-slate-border/50 pb-3">
                Project Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 border border-gold/20 bg-gold/5 px-3 py-2.5 rounded-lg text-sm text-slate-dark font-medium"
                  >
                    <span className="text-gold font-serif">✦</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* RERA and Possession */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-card p-6 rounded-xl shadow-sm border border-slate-border/80 flex items-center gap-4">
                <div className="p-3 bg-gold/10 text-gold rounded-xl">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-muted font-bold uppercase tracking-wider block">
                    MahaRERA Number
                  </span>
                  <span className="font-bold text-slate-dark text-sm tracking-wide">
                    {reraNumber}
                  </span>
                </div>
              </div>

              <div className="bg-slate-card p-6 rounded-xl shadow-sm border border-slate-border/80 flex items-center gap-4">
                <div className="p-3 bg-gold/10 text-gold rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-muted font-bold uppercase tracking-wider block">
                    Possession Date
                  </span>
                  <span className="font-bold text-slate-dark text-sm uppercase tracking-wide">
                    {possession}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (40% / 5 cols - STICKY) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Stats Card */}
            <div className="bg-slate-card rounded-xl p-6 shadow-sm border border-slate-border/80 space-y-4">
              <h3 className="text-lg font-bold text-slate-dark font-serif border-b border-slate-border/50 pb-2.5">
                Quick Property Overview
              </h3>
              
              <div className="space-y-3.5 font-sans">
                <div className="flex items-center gap-3.5 text-sm">
                  <Tag className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <span className="text-slate-muted text-xs block font-semibold uppercase">Pricing Details</span>
                    <strong className="text-gold text-lg">{price}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm">
                  <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <span className="text-slate-muted text-xs block font-semibold uppercase">Configuration Type</span>
                    <strong className="text-slate-dark font-semibold">{bhk}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm">
                  <MapPin className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <span className="text-slate-muted text-xs block font-semibold uppercase">Project Location</span>
                    <strong className="text-slate-dark font-semibold">{location}</strong>
                  </div>
                </div>
              </div>

              {/* Visit Official Site Button */}
              <div className="pt-2">
                <a
                  href={officialUrl || "https://www.lodhagroup.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-gold hover:bg-gold-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-xs text-center"
                >
                  Visit Official Site
                </a>
              </div>

              {/* Instant Call / WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:+91${formattedPhoneNumber}`}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-lg text-xs tracking-wider uppercase transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  Call Us
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 rounded-lg text-xs tracking-wider uppercase transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Inline Enquiry Form */}
            <div className="bg-slate-card rounded-xl p-6 shadow-md border border-slate-border/80">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                  <CheckCircle className="w-14 h-14 text-green-500 mb-3 animate-bounce" />
                  <h4 className="text-xl font-bold text-slate-dark mb-1">Enquiry Sent!</h4>
                  <p className="text-sm text-slate-muted">
                    Thank you! Our relationship team will contact you within 15 minutes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-left font-serif">
                    <h3 className="text-xl font-bold text-slate-dark">
                      Instant Enquiry Form
                    </h3>
                    <p className="text-xs text-slate-muted mt-1 font-sans">
                      Direct connection with the developer relationship manager.
                    </p>
                  </div>

                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5 font-sans">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name *"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number *"
                        maxLength="10"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address (Optional)"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm transition-all duration-300"
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Message"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm transition-all duration-300 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-xs"
                    >
                      Enquire Now
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
      
      <FloatingButtons />
    </div>
  );
};

export default PropertyDetail;
