import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import { Building2, Briefcase } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import CommercialPropertyCard from '../components/CommercialPropertyCard';
import EnquiryModal from '../components/EnquiryModal';
import Footer from '../components/Footer';
import ContactFAQSection from '../components/ContactFAQSection';
import { properties } from '../data/properties';
import { commercialProperties, COMMERCIAL_CITIES } from '../data/commercialProperties';
import { PALM_BEACH_ROAD_IDS, THANE_BELAPUR_ROAD_IDS } from '../utils/locationMatcher';

const POPUP_DELAY_MS = 5000; // Customizable popup delay in milliseconds (5 seconds)

export const FILTER_OPTIONS = [
  'Palm Beach Road',
  'Thane-Belapur Road',
  'Kharghar',
  'Panvel',
  'Nerul',
  'Seawoods',
  'Vashi',
  'Airoli',
  'Taloja',
  'Juinagar',
  'Belapur',
  'Sanpada',
  'Kopar Khairane',
  'Ulwe',
  'Ghansoli'
];

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
      const cleanParam = cityParam.toLowerCase().replace(/[-_]/g, ' ');
      if (cleanParam.includes('palm beach')) {
        setActiveFilter('Palm Beach Road');
      } else if (cleanParam.includes('thane belapur') || cleanParam.includes('belapur road')) {
        setActiveFilter('Thane-Belapur Road');
      } else {
        const matched = FILTER_OPTIONS.find(
          (opt) => opt.toLowerCase() === cleanParam || opt.toLowerCase() === cityParam.toLowerCase()
        );
        setActiveFilter(matched || 'All');
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
        const allProps = [...properties, ...commercialProperties];
        const property = allProps.find(
          (item) => item.name.toLowerCase() === e.detail.propertyName.toLowerCase()
        );
        const resolvedLocation = e.detail.location || property?.city || property?.location || '';
        setModalLocation(resolvedLocation);
        setIsModalOpen(true);
      }
    };
    window.addEventListener('openEnquiryModal', handleOpenEnquiry);
    return () => window.removeEventListener('openEnquiryModal', handleOpenEnquiry);
  }, []);

  const handleEnquire = (propertyName, location = '') => {
    setModalPropertyName(propertyName);
    const allProps = [...properties, ...commercialProperties];
    const property = allProps.find(
      (item) => item.name.toLowerCase() === propertyName.toLowerCase()
    );
    setModalLocation(location || property?.city || property?.location || '');
    setIsModalOpen(true);
  };

  // Category state ('residential' | 'commercial')
  const [activeCategory, setActiveCategory] = useState('residential');
  const [activeCommercialFilter, setActiveCommercialFilter] = useState('All');

  // Filtered residential property list based on active filter
  const filteredProperties = useMemo(() => {
    if (activeFilter === 'All') return properties;
    const lower = activeFilter.toLowerCase();
    if (lower === 'palm beach road' || lower === 'palm beach') {
      const propMap = new Map(properties.map((p) => [p.id, p]));
      return PALM_BEACH_ROAD_IDS.map((id) => propMap.get(id)).filter(Boolean);
    }
    if (lower === 'thane-belapur road' || lower === 'thane belapur road' || lower === 'thane-belapur' || lower === 'thane belapur') {
      const propMap = new Map(properties.map((p) => [p.id, p]));
      return THANE_BELAPUR_ROAD_IDS.map((id) => propMap.get(id)).filter(Boolean);
    }
    if (lower === 'kopar khairane' || lower === 'koper khairane' || lower === 'koparkhairane') {
      return properties.filter((p) => {
        const pc = (p.city || '').toLowerCase().trim();
        return pc === 'kopar khairane' || pc === 'koper khairane' || pc === 'koparkhairane';
      });
    }
    return properties.filter((p) => p.city && p.city.toLowerCase() === lower);
  }, [activeFilter]);

  // Filtered commercial property list based on active commercial filter
  const filteredCommercialProperties = useMemo(() => {
    if (activeCommercialFilter === 'All') return commercialProperties;
    const lower = activeCommercialFilter.toLowerCase().trim();
    return commercialProperties.filter((p) => (p.city || '').toLowerCase().trim() === lower);
  }, [activeCommercialFilter]);

  // Listen for category switch events (from Navbar or Chatbot)
  useEffect(() => {
    const handleSwitchCategory = (e) => {
      if (e.detail?.category) {
        setActiveCategory(e.detail.category);
        if (e.detail.city) {
          if (e.detail.category === 'commercial') {
            setActiveCommercialFilter(e.detail.city);
          } else {
            setActiveFilter(e.detail.city);
          }
        }
        const listingsElem = document.getElementById('listings');
        if (listingsElem) {
          listingsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('switchPropertyCategory', handleSwitchCategory);
    return () => window.removeEventListener('switchPropertyCategory', handleSwitchCategory);
  }, []);

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
  }, [filteredProperties, filteredCommercialProperties, activeCategory]);

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
        <section id="listings" className="bg-slate-deep py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-border/40">
          <div className="max-w-7xl mx-auto">

            {/* Category Segmented Control (Option 1: Luxury Dual-Pill Card with Badges & Glow) */}
            <div className="flex flex-col items-center mb-12">
              {/* Top Accent Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                <span>Choose Property Category</span>
              </div>

              {/* Elevated Dual-Pill Card */}
              <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-[22px] border border-gold/30 shadow-[0_12px_36px_rgba(15,42,35,0.09)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full max-w-2xl">
                {/* Residential Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategory('residential')}
                  className={`relative flex-1 flex items-center gap-3 px-4 sm:px-6 py-3 rounded-xl sm:rounded-[18px] transition-all duration-300 text-left cursor-pointer group ${
                    activeCategory === 'residential'
                      ? 'bg-[#0F2A23] text-white border border-gold/50 shadow-md shadow-[#0F2A23]/25'
                      : 'bg-[#F6F8F6] text-[#16281E] border border-slate-border/50 hover:border-gold/40 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeCategory === 'residential'
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'bg-white text-slate-muted group-hover:text-gold border border-slate-border/60'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm sm:text-base font-bold tracking-tight">Residential Homes</span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        activeCategory === 'residential' ? 'bg-white/15 text-gold' : 'bg-slate-200/80 text-slate-muted'
                      }`}>
                        {properties.length}
                      </span>
                    </div>
                    <p className={`text-[11px] tracking-wide mt-0.5 truncate ${
                      activeCategory === 'residential' ? 'text-white/70' : 'text-slate-muted'
                    }`}>
                      1, 2, 3 & 4 BHK Flats & Villas
                    </p>
                  </div>
                </button>

                {/* Commercial Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategory('commercial')}
                  className={`relative flex-1 flex items-center gap-3 px-4 sm:px-6 py-3 rounded-xl sm:rounded-[18px] transition-all duration-300 text-left cursor-pointer group ${
                    activeCategory === 'commercial'
                      ? 'bg-[#0F2A23] text-white border border-gold/50 shadow-md shadow-[#0F2A23]/25'
                      : 'bg-[#F6F8F6] text-[#16281E] border border-slate-border/50 hover:border-gold/40 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeCategory === 'commercial'
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'bg-white text-slate-muted group-hover:text-gold border border-slate-border/60'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm sm:text-base font-bold tracking-tight">Commercial Spaces</span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        activeCategory === 'commercial' ? 'bg-white/15 text-gold' : 'bg-slate-200/80 text-slate-muted'
                      }`}>
                        {commercialProperties.length}
                      </span>
                    </div>
                    <p className={`text-[11px] tracking-wide mt-0.5 truncate ${
                      activeCategory === 'commercial' ? 'text-white/70' : 'text-slate-muted'
                    }`}>
                      Offices, Retail & IT Parks
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* RESIDENTIAL VIEW */}
            {activeCategory === 'residential' && (
              <>
                {/* Header Title */}
                <div className="mb-10 text-center animate-fadeIn">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      activeFilter === 'All'
                        ? 'bg-[#0F2A23] text-white shadow-md'
                        : 'bg-white text-[#66706B] hover:text-[#0F2A23] border border-[#EBE6DE]'
                    }`}
                  >
                    All Projects
                  </button>
                  {FILTER_OPTIONS.map((city) => (
                    <button
                      key={city}
                      onClick={() => setActiveFilter(city)}
                      className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        activeFilter.toLowerCase() === city.toLowerCase()
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
                    <p className="text-slate-muted font-medium text-lg">No residential properties found in this location.</p>
                  </div>
                )}
              </>
            )}

            {/* COMMERCIAL VIEW */}
            {activeCategory === 'commercial' && (
              <>
                {/* Header Title */}
                <div className="mb-10 text-center animate-fadeIn">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-dark font-serif tracking-tight mb-2">
                    Grade-A Commercial Spaces & IT Parks
                  </h2>
                  <p className="text-sm text-slate-muted font-sans max-w-xl mx-auto">
                    Explore corporate boutique offices, high-street retail shops, and modern tech hubs across Navi Mumbai's prime commercial corridors.
                  </p>
                </div>

                {/* Commercial Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                  <button
                    onClick={() => setActiveCommercialFilter('All')}
                    className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      activeCommercialFilter === 'All'
                        ? 'bg-[#0F2A23] text-white shadow-md'
                        : 'bg-white text-[#66706B] hover:text-[#0F2A23] border border-[#EBE6DE]'
                    }`}
                  >
                    All Commercial ({commercialProperties.length})
                  </button>
                  {COMMERCIAL_CITIES.map((city) => {
                    const count = commercialProperties.filter((p) => (p.city || '').toLowerCase() === city.toLowerCase()).length;
                    return (
                      <button
                        key={city}
                        onClick={() => setActiveCommercialFilter(city)}
                        className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                          activeCommercialFilter.toLowerCase() === city.toLowerCase()
                            ? 'bg-[#0F2A23] text-white shadow-md'
                            : 'bg-white text-[#66706B] hover:text-[#0F2A23] border border-[#EBE6DE]'
                        }`}
                      >
                        <span>{city}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          activeCommercialFilter.toLowerCase() === city.toLowerCase()
                            ? 'bg-white/20 text-white'
                            : 'bg-gold/15 text-gold-darker'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Commercial Properties Grid */}
                {filteredCommercialProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCommercialProperties.map((property, index) => (
                      <div
                        key={property.id}
                        className="reveal-item"
                        style={{ transitionDelay: `${(index % 3) * 150}ms` }}
                      >
                        <CommercialPropertyCard property={property} onEnquire={handleEnquire} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-card rounded-xl shadow-sm border border-slate-border/60 max-w-lg mx-auto">
                    <p className="text-slate-muted font-medium text-lg">No commercial properties found in {activeCommercialFilter}.</p>
                  </div>
                )}
              </>
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
