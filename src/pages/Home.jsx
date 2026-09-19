import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import EnquiryModal from '../components/EnquiryModal';
import Footer from '../components/Footer';
import ContactFAQSection from '../components/ContactFAQSection';
import { properties } from '../data/properties';

const POPUP_DELAY_MS = 5000; // Customizable popup delay in milliseconds (5 seconds)

const Home = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');

  // Filter state (Defaults to 'All')
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPropertyName, setModalPropertyName] = useState('');
  const [modalLocation, setModalLocation] = useState('');

  // Automatically trigger EnquiryModal after 5 seconds every time the page refreshes
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalPropertyName('Callback & Brochure Request');
      setModalLocation('');
      setIsModalOpen(true);
    }, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleBrowseClick = () => {
    const element = document.getElementById('listings');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle setting active filter from URL query param or location bar
  useEffect(() => {
    if (cityParam) {
      const formattedCity = cityParam.charAt(0).toUpperCase() + cityParam.slice(1).toLowerCase();
      if (['Nerul', 'Panvel', 'Kharghar', 'Belapur', 'Vashi', 'Juinagar', 'Sanpada'].includes(formattedCity)) {
        setActiveFilter(formattedCity);
      } else {
        setActiveFilter('All');
      }
    } else {
      setActiveFilter('All');
    }
  }, [cityParam]);

  // Set page title for SEO
  useEffect(() => {
    document.title = "Directly By Developers | Buy Premium Flats in Nerul, Panvel, Kharghar, Belapur, Vashi, Juinagar & Sanpada | No Brokerage";
  }, []);

  // Listen for openEnquiryModal events (from Navbar/mobile links)
  useEffect(() => {
    const handleOpenEnquiry = (e) => {
      if (e.detail && e.detail.propertyName) {
        setModalPropertyName(e.detail.propertyName);
        const property = properties.find((item) => item.name === e.detail.propertyName);
        setModalLocation(property?.city || property?.location || '');
        setIsModalOpen(true);
      }
    };
    window.addEventListener('openEnquiryModal', handleOpenEnquiry);
    return () => window.removeEventListener('openEnquiryModal', handleOpenEnquiry);
  }, []);

  const handleEnquire = (propertyName, location = '') => {
    setModalPropertyName(propertyName);
    const property = properties.find((item) => item.name === propertyName);
    setModalLocation(location || property?.city || property?.location || '');
    setIsModalOpen(true);
  };

  // Filtered property list based on search/header params
  const filteredProperties = activeFilter === 'All'
    ? properties
    : properties.filter((p) => p.city.toLowerCase() === activeFilter.toLowerCase());

  // IntersectionObserver for staggered card entrances
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    const items = document.querySelectorAll('.reveal-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [filteredProperties]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8] max-w-full overflow-x-hidden">
      {/* UNIFIED SHOWCASE FRAME (Navbar + HeroSection + DeveloperPartners fill 100% viewport) */}
      <div className="showcase-frame relative w-full max-w-full min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden bg-[#FCFBF8]">
        {/* ROW 2 & 3: MAIN NAVBAR & SECONDARY LOCATION STRIP */}
        <Navbar />

        {/* HERO SECTION (Includes Split Grid + 5 USP Features + DeveloperPartners Ticker at bottom) */}
        <HeroSection
          onExploreClick={handleBrowseClick}
          onConsultationClick={() => handleEnquire('Private Consultation Request')}
        />
      </div>

      {/* MAIN HOMEPAGE CONTENT IN NORMAL DOCUMENT FLOW */}
      <main className="flex-grow w-full">
        {/* Featured Listings Section */}
        <section id="listings" className="bg-slate-deep py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-border/40">
          <div className="max-w-7xl mx-auto">
            {/* Header Title */}
            <div className="mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-dark font-serif tracking-tight mb-2">
                Featured Luxury Residences
              </h2>
              <p className="text-sm text-slate-muted font-sans max-w-xl mx-auto">
                Handpicked premium properties available directly from trusted developers with zero brokerage.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === 'All'
                    ? 'bg-[#0F2A23] text-white shadow-md'
                    : 'bg-white text-[#66706B] hover:text-[#0F2A23] border border-[#EBE6DE]'
                }`}
              >
                All Projects
              </button>
              {['Kharghar', 'Panvel', 'Nerul', 'Seawoods', 'Vashi', 'Airoli', 'Taloja', 'Juinagar', 'Belapur', 'Sanpada', 'Ghansoli'].map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveFilter(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 ${
                    activeFilter === city
                      ? 'bg-[#0F2A23] text-white shadow-md'
                      : 'bg-white text-[#66706B] hover:text-[#0F2A23] border border-[#EBE6DE]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="reveal-item"
                    style={{ transitionDelay: `${(index % 3) * 150}ms` }}
                  >
                    <PropertyCard property={property} onEnquire={handleEnquire} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-card rounded-xl shadow-sm border border-slate-border/60 max-w-lg mx-auto">
                <p className="text-slate-muted font-medium text-lg">No properties found in this location.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <ContactFAQSection />

      <Footer />

      {/* Shared Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          window.dispatchEvent(new CustomEvent('enquiryModalClosed'));
        }}
        propertyName={modalPropertyName}
        location={modalLocation}
      />
    </div>
  );
};

export default Home;
