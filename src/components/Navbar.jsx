import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Building2, 
  Briefcase, 
  Compass, 
  Warehouse, 
  Phone, 
  ExternalLink, 
  ArrowRight
} from 'lucide-react';
import { properties } from '../data/properties';
import { commercialProperties, COMMERCIAL_CITIES } from '../data/commercialProperties';

const logo = `${import.meta.env.BASE_URL}directly-by-developer-logo.webp`;

const LOCATIONS = [
  "PALM BEACH ROAD", "THANE-BELAPUR ROAD", "VASHI", "SANPADA", "JUINAGAR", "NERUL", "SEAWOODS",
  "BELAPUR", "KHARGHAR", "UPPER KHARGHAR", "MANSAROVAR",
  "KHANDESHWAR", "KAMOTHE", "KALAMBOLI", "PANVEL", "NEW PANVEL",
  "KARANJADE", "ULWE", "PUSHPAK NAGAR", "DRONAGIRI", "TURBHE",
  "KOPARKHAIRANE", "GHANSOLI", "RABALE", "AIROLI", "TALOJA"
];

// Verified projects directly on or within 1-2 minutes of Palm Beach Road
const PALM_BEACH_ROAD_IDS = [
  '9-pbr-adani',
  'sai-palm-view',
  'delta-palm-beach-seawoods',
  'palm-amore-seawoods',
  'godrej-eternal-palms'
];

// Verified projects directly on or within 1-2 minutes of Thane-Belapur Road
const THANE_BELAPUR_ROAD_IDS = [
  'sai-world-one',
  'aurum-q-islands-ghansoli',
  'raheja-lunaris',
  'raheja-jade-city',
  'raheja-wtc',
  'raheja-atlantis',
  'today-citadil-juinagar',
  'delta-tricity-airoli',
  'birla-taranya-airoli',
  'eden-garden-airoli',
  'delta-new-palm-beach-airoli'
];

// The actual micro-markets & corridors ordered by prominence
const RESIDENTIAL_CITIES = [
  'Kharghar', 
  'Panvel', 
  'Palm Beach Road',
  'Thane-Belapur Road',
  'Juinagar',
  'Nerul', 
  'Vashi', 
  'Airoli', 
  'Seawoods', 
  'Taloja', 
  'Belapur', 
  'Sanpada', 
  'Kopar Khairane',
  'Ulwe',
  'Ghansoli', 
  'Roadpali'
];

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // 'residential' | 'commercial' | 'plots' | 'warehouse' | null
  const [hoveredCity, setHoveredCity] = useState('Kharghar');
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [mobileExpandedCity, setMobileExpandedCity] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(88);

  const dropdownCloseTimeout = useRef(null);
  const cityHoverTimeout = useRef(null);

  // Measure navbar height for positioning
  useEffect(() => {
    const measure = () => {
      const nav = document.getElementById('site-navbar');
      if (nav) setHeaderHeight(nav.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Helper to fetch properties for a given city or corridor
  const getPropertiesByCity = (cityName) => {
    const c = (cityName || '').toLowerCase().trim();
    if (c === 'palm beach road' || c === 'palm beach') {
      const propMap = new Map(properties.map((p) => [p.id, p]));
      return PALM_BEACH_ROAD_IDS.map((id) => propMap.get(id)).filter(Boolean);
    }
    if (c === 'thane-belapur road' || c === 'thane belapur road' || c === 'thane-belapur' || c === 'thane belapur') {
      const propMap = new Map(properties.map((p) => [p.id, p]));
      return THANE_BELAPUR_ROAD_IDS.map((id) => propMap.get(id)).filter(Boolean);
    }
    if (c === 'kopar khairane' || c === 'koper khairane' || c === 'koparkhairane') {
      return properties.filter((p) => {
        const pc = (p.city || '').toLowerCase().trim();
        return pc === 'kopar khairane' || pc === 'koper khairane' || pc === 'koparkhairane';
      });
    }
    return properties.filter((p) => (p.city || '').toLowerCase().trim() === c);
  };

  const handleCategoryMouseEnter = (cat) => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }
    setActiveCategory(cat);
  };

  const handleCategoryMouseLeave = () => {
    dropdownCloseTimeout.current = setTimeout(() => {
      setActiveCategory(null);
    }, 180);
  };

  // Smart city hover with 90ms safe transit corridor buffer
  // Prevents accidental city switching when moving mouse diagonally toward project cards!
  const handleCityMouseEnter = (city) => {
    if (cityHoverTimeout.current) {
      clearTimeout(cityHoverTimeout.current);
    }
    cityHoverTimeout.current = setTimeout(() => {
      setHoveredCity(city);
    }, 90);
  };

  const handleCityClick = (city) => {
    if (cityHoverTimeout.current) {
      clearTimeout(cityHoverTimeout.current);
    }
    setHoveredCity(city);
  };

  const handleProjectsAreaMouseEnter = () => {
    // Lock current hovered city when cursor is inside the projects area
    if (cityHoverTimeout.current) {
      clearTimeout(cityHoverTimeout.current);
      cityHoverTimeout.current = null;
    }
  };

  const handleProjectClick = (e, prop) => {
    if (e) e.stopPropagation();
    const targetUrl = prop.landingUrl || prop.officialUrl;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      if (e) e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('openEnquiryModal', {
          detail: { 
            propertyName: prop.name,
            location: prop.city || prop.location || ''
          }
        })
      );
    }
    setActiveCategory(null);
    setMobileMenuOpen(false);
  };

  const handleShowcaseEnquire = (categoryName) => {
    window.dispatchEvent(
      new CustomEvent('openEnquiryModal', {
        detail: { propertyName: `${categoryName} - Navi Mumbai` }
      })
    );
    setActiveCategory(null);
    setMobileMenuOpen(false);
  };

  const activeCityProperties = getPropertiesByCity(hoveredCity);

  // Commercial Mega-Dropdown state & helpers
  const [hoveredCommercialCity, setHoveredCommercialCity] = useState('Vashi');
  const commercialCityHoverTimeout = useRef(null);

  const getCommercialPropertiesByCity = (cityName) => {
    const c = (cityName || '').toLowerCase().trim();
    return commercialProperties.filter((p) => (p.city || '').toLowerCase().trim() === c);
  };

  const handleCommercialCityMouseEnter = (city) => {
    if (commercialCityHoverTimeout.current) {
      clearTimeout(commercialCityHoverTimeout.current);
    }
    commercialCityHoverTimeout.current = setTimeout(() => {
      setHoveredCommercialCity(city);
    }, 90);
  };

  const handleCommercialCityClick = (city) => {
    if (commercialCityHoverTimeout.current) {
      clearTimeout(commercialCityHoverTimeout.current);
    }
    setHoveredCommercialCity(city);
  };

  const handleCommercialProjectClick = (e, prop) => {
    if (e) e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('openEnquiryModal', {
        detail: {
          propertyName: prop.name,
          location: prop.city || prop.location || ''
        }
      })
    );
    setActiveCategory(null);
    setMobileMenuOpen(false);
  };

  const activeCommercialCityProperties = getCommercialPropertiesByCity(hoveredCommercialCity);

  return (
    <nav id="site-navbar" className="w-full shrink-0 bg-[#E8EDE8] border-b border-[#CFD9CF]/80 z-40 transition-all duration-300">
      
      {/* ROW 1: MAIN NAVBAR (Logo, 4 Core Categories & Desk Call CTA) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full h-[60px] sm:h-[64px] flex items-center justify-between relative">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center group" aria-label="Directly By Developers home">
            <img
              src={logo}
              alt="Directly By Developers"
              className="h-auto w-[180px] sm:w-[220px] lg:w-[240px] max-h-11 object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Desktop 4 Main Navigation Categories */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-3 xl:space-x-4 ml-auto">
          
          {/* 1. RESIDENTIAL CATEGORY: Single-Column Cities Left + Direct Project Panel Right */}
          <div 
            className="h-full flex items-center py-3"
            onMouseEnter={() => handleCategoryMouseEnter('residential')}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-[13px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'residential'
                  ? 'text-[#B58A3C] bg-white shadow-xs'
                  : 'text-[#16281E] hover:text-[#B58A3C] hover:bg-white/50'
              }`}
              aria-expanded={activeCategory === 'residential'}
            >
              <Building2 className="w-4 h-4 text-[#B58A3C]" />
              <span>Residential</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeCategory === 'residential' ? 'rotate-180 text-[#B58A3C]' : 'text-sage-muted'
              }`} />
            </button>

            {/* Mega Dropdown: 1 Vertical Column of Cities on Left, Direct Projects Panel on Right */}
            {activeCategory === 'residential' && (
              <div 
                className="absolute top-[100%] right-0 lg:right-4 xl:right-8 w-[960px] max-w-[96vw] h-[385px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-gold/30 z-50 flex overflow-hidden animate-fadeIn origin-top"
                onMouseEnter={() => handleCategoryMouseEnter('residential')}
                onMouseLeave={handleCategoryMouseLeave}
              >
                {/* LEFT SIDE: 2 Balanced Columns of All 16 Locations - ALL 16 VISIBLE IN ONE VIEW (NO SCROLL, NO CUTOFF) */}
                <div className="w-[315px] lg:w-[335px] shrink-0 bg-[#F4F6F4] border-r border-sage-border/60 p-2.5 flex flex-col justify-between select-none">
                  <div>
                    <div className="px-1.5 py-1 mb-1.5 border-b border-sage-border/50 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sage-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold" /> Locations ({RESIDENTIAL_CITIES.length}):
                      </span>
                    </div>

                    {/* 2-Column Grid: 8 rows each, perfectly fills the height with zero overflow */}
                    <div className="grid grid-cols-2 grid-flow-col grid-rows-8 gap-x-1.5 gap-y-1">
                      {RESIDENTIAL_CITIES.map((city) => {
                        const count = getPropertiesByCity(city).length;
                        const isHovered = hoveredCity.toLowerCase() === city.toLowerCase();

                        return (
                          <button
                            key={city}
                            type="button"
                            onMouseEnter={() => handleCityMouseEnter(city)}
                            onClick={() => handleCityClick(city)}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs font-semibold transition-colors duration-100 text-left cursor-pointer ${
                              isHovered
                                ? 'bg-gold text-white font-bold shadow-xs'
                                : 'text-sage-dark hover:bg-gold/15 hover:text-gold-darker'
                            }`}
                          >
                            <span className="truncate pr-1 text-[10.5px] lg:text-[11px]">{city}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                                isHovered ? 'bg-white/25 text-white' : 'bg-gold/15 text-gold-darker'
                              }`}>
                                {count}
                              </span>
                              <ChevronRight className={`w-2.5 h-2.5 ${isHovered ? 'text-white' : 'text-sage-muted/70'}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-1.5 pt-1.5 border-t border-sage-border/50 text-[10px] text-sage-muted truncate shrink-0">
                    <span>Direct Developer Desk</span>
                  </div>
                </div>

                {/* RIGHT SIDE: Dedicated Projects Canvas for the Hovered City / Corridor */}
                <div 
                  className="flex-1 p-3.5 bg-white flex flex-col min-w-0"
                  onMouseEnter={handleProjectsAreaMouseEnter}
                >
                  {/* City / Corridor Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-sage-border/50 mb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-[#16281E] flex items-center gap-1.5">
                        <span>Projects {hoveredCity.toLowerCase().includes('road') ? 'along' : 'in'} {hoveredCity}</span>
                        <span className="text-[11px] font-bold text-gold-darker">
                          ({activeCityProperties.length} Verified Developer Homes)
                        </span>
                      </h4>
                      <p className="text-[10px] text-sage-muted">100% Direct Rates • Zero Brokerage • RERA Approved</p>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      RERA Verified
                    </span>
                  </div>

                  {/* Projects Grid: Clean, compact list showing ONLY project names */}
                  <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                      {activeCityProperties.length > 0 ? (
                        activeCityProperties.map((prop) => {
                          const hasLanding = Boolean(prop.landingUrl || prop.officialUrl);

                          return (
                            <button
                              key={prop.id}
                              type="button"
                              onClick={(e) => handleProjectClick(e, prop)}
                              title={hasLanding ? `Open ${prop.name} Official Page` : `Enquire about ${prop.name}`}
                              className="group flex items-center justify-between px-3 py-2 rounded-xl border border-sage-border/60 hover:border-gold/70 bg-[#FAFBF9] hover:bg-gold/10 transition-all duration-150 text-left cursor-pointer shadow-xs hover:shadow-sm"
                            >
                              <span className="text-[11px] lg:text-[12px] font-semibold text-[#16281E] group-hover:text-gold-darker transition-colors truncate pr-1">
                                {prop.name}
                              </span>
                              {hasLanding ? (
                                <span className="shrink-0 flex items-center gap-0.5 text-[8px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded group-hover:bg-gold group-hover:text-white transition-colors">
                                  Page <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              ) : (
                                <span className="shrink-0 text-[8px] font-bold text-sage-muted bg-sage-deep/60 px-1.5 py-0.5 rounded group-hover:bg-gold group-hover:text-white transition-colors">
                                  Enquire
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-16 text-center text-xs text-sage-muted">
                          No active properties found {hoveredCity.toLowerCase().includes('road') ? 'along' : 'in'} {hoveredCity}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer callout */}
                  <div className="pt-2 mt-1 border-t border-sage-border/40 flex items-center justify-between text-[10px] text-sage-muted">
                    <span>Need price sheets or floor plans?</span>
                    <a 
                      href="tel:+917718853773"
                      className="text-gold font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Phone className="w-2.5 h-2.5" /> Call Developer Desk: +91 7718853773
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. COMMERCIAL CATEGORY (Showcase Dropdown) */}
          <div 
            className="h-full flex items-center py-3"
            onMouseEnter={() => handleCategoryMouseEnter('commercial')}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-[13px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'commercial'
                  ? 'text-[#B58A3C] bg-white shadow-xs'
                  : 'text-[#16281E] hover:text-[#B58A3C] hover:bg-white/50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#B58A3C]" />
              <span>Commercial</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeCategory === 'commercial' ? 'rotate-180 text-[#B58A3C]' : 'text-sage-muted'
              }`} />
            </button>

            {activeCategory === 'commercial' && (
              <div 
                className="absolute top-[100%] right-0 lg:right-4 xl:right-8 w-[960px] max-w-[96vw] h-[385px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-gold/30 z-50 flex overflow-hidden animate-fadeIn origin-top"
                onMouseEnter={() => handleCategoryMouseEnter('commercial')}
                onMouseLeave={handleCategoryMouseLeave}
              >
                {/* LEFT SIDE: Commercial Hubs Single Column */}
                <div className="w-[230px] shrink-0 bg-[#F4F6F4] border-r border-sage-border/60 p-2 flex flex-col justify-between select-none">
                  <div>
                    <div className="px-2 py-1 mb-1 border-b border-sage-border/50 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sage-muted flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-gold" /> Commercial Hubs ({COMMERCIAL_CITIES.length}):
                      </span>
                    </div>

                    <div className="space-y-[3px]">
                      {COMMERCIAL_CITIES.map((city) => {
                        const count = getCommercialPropertiesByCity(city).length;
                        const isHovered = hoveredCommercialCity.toLowerCase() === city.toLowerCase();

                        return (
                          <button
                            key={city}
                            type="button"
                            onMouseEnter={() => handleCommercialCityMouseEnter(city)}
                            onClick={() => handleCommercialCityClick(city)}
                            className={`w-full flex items-center justify-between px-2.5 py-[5px] rounded-lg text-xs font-semibold transition-colors duration-100 text-left cursor-pointer ${
                              isHovered
                                ? 'bg-gold text-white font-bold shadow-xs'
                                : 'text-sage-dark hover:bg-gold/15 hover:text-gold-darker'
                            }`}
                          >
                            <span className="truncate pr-1 text-[11px]">{city}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-bold ${
                                isHovered ? 'bg-white/25 text-white' : 'bg-gold/15 text-gold-darker'
                              }`}>
                                {count}
                              </span>
                              <ChevronRight className={`w-3 h-3 ${isHovered ? 'text-white' : 'text-sage-muted/70'}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-2 pt-1 border-t border-sage-border/50 text-[10px] text-sage-muted truncate shrink-0">
                    <span>Direct Commercial Desk</span>
                  </div>
                </div>

                {/* RIGHT SIDE: Dedicated Commercial Projects Canvas */}
                <div 
                  className="flex-1 p-3.5 bg-white flex flex-col min-w-0"
                  onMouseEnter={() => {
                    if (commercialCityHoverTimeout.current) {
                      clearTimeout(commercialCityHoverTimeout.current);
                      commercialCityHoverTimeout.current = null;
                    }
                  }}
                >
                  {/* City Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-sage-border/50 mb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-[#16281E] flex items-center gap-1.5">
                        <span>Commercial Projects in {hoveredCommercialCity}</span>
                        <span className="text-[11px] font-bold text-gold-darker">
                          ({activeCommercialCityProperties.length} Verified Spaces)
                        </span>
                      </h4>
                      <p className="text-[10px] text-sage-muted">100% Direct Rates • Zero Brokerage • Grade-A Commercial</p>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      Direct Developer
                    </span>
                  </div>

                  {/* Commercial Projects Grid: Clean 3-column compact grid like Residential (Image 2) */}
                  <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                      {activeCommercialCityProperties.length > 0 ? (
                        activeCommercialCityProperties.map((prop) => (
                          <button
                            key={prop.id}
                            type="button"
                            onClick={(e) => handleCommercialProjectClick(e, prop)}
                            title={`Enquire about ${prop.name}`}
                            className="group flex items-center justify-between px-3 py-2 rounded-xl border border-sage-border/60 hover:border-gold/70 bg-[#FAFBF9] hover:bg-gold/10 transition-all duration-150 text-left cursor-pointer shadow-xs hover:shadow-sm"
                          >
                            <span className="text-[11px] lg:text-[12px] font-semibold text-[#16281E] group-hover:text-gold-darker transition-colors truncate pr-1">
                              {prop.name}
                            </span>
                            <span className="shrink-0 text-[8px] font-bold text-sage-muted bg-sage-deep/60 px-1.5 py-0.5 rounded group-hover:bg-gold group-hover:text-white transition-colors">
                              Enquire
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-full py-16 text-center text-xs text-sage-muted">
                          No commercial projects found in {hoveredCommercialCity}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer callout */}
                  <div className="pt-2 mt-1 border-t border-sage-border/40 flex items-center justify-between text-[10px] text-sage-muted">
                    <span>Need price sheets or floor plans?</span>
                    <a 
                      href="tel:+917718853773"
                      className="text-gold font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Phone className="w-2.5 h-2.5" /> Call Developer Desk: +91 7718853773
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. PLOTS CATEGORY (Showcase Dropdown) */}
          <div 
            className="h-full flex items-center py-3 relative"
            onMouseEnter={() => handleCategoryMouseEnter('plots')}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-[13px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'plots'
                  ? 'text-[#B58A3C] bg-white shadow-xs'
                  : 'text-[#16281E] hover:text-[#B58A3C] hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 text-[#B58A3C]" />
              <span>Plots</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeCategory === 'plots' ? 'rotate-180 text-[#B58A3C]' : 'text-sage-muted'
              }`} />
            </button>

            {activeCategory === 'plots' && (
              <div 
                className="absolute top-[100%] right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 w-[360px] bg-white rounded-2xl shadow-2xl border border-gold/30 p-4 z-50 animate-fadeIn"
                onMouseEnter={() => handleCategoryMouseEnter('plots')}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#16281E] uppercase tracking-wide">NA Villa Plots & Land</h4>
                    <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      High Growth Corridors
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-sage-muted mb-3 leading-relaxed">
                  Collector-sanctioned, clear-title residential and villa plots in Panvel, Kharghar Hills and Navi Mumbai Airport Influence Notified Area (NAINA).
                </p>

                <div className="space-y-1 mb-3.5 text-[11px] text-sage-dark">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>Gated Community Layouts with Water & Roads</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>Clear Title with Leading Bank Loan Approvals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>Rapid Capital Appreciation near Airport & MTHL</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleShowcaseEnquire('NA Villa Plots')}
                  className="w-full bg-gold hover:bg-gold-light text-white text-xs font-bold py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire For Plots</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 4. WAREHOUSE CATEGORY (Showcase Dropdown) */}
          <div 
            className="h-full flex items-center py-3 relative"
            onMouseEnter={() => handleCategoryMouseEnter('warehouse')}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-[13px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'warehouse'
                  ? 'text-[#B58A3C] bg-white shadow-xs'
                  : 'text-[#16281E] hover:text-[#B58A3C] hover:bg-white/50'
              }`}
            >
              <Warehouse className="w-4 h-4 text-[#B58A3C]" />
              <span>Warehouse</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeCategory === 'warehouse' ? 'rotate-180 text-[#B58A3C]' : 'text-sage-muted'
              }`} />
            </button>

            {activeCategory === 'warehouse' && (
              <div 
                className="absolute top-[100%] right-0 w-[360px] bg-white rounded-2xl shadow-2xl border border-gold/30 p-4 z-50 animate-fadeIn"
                onMouseEnter={() => handleCategoryMouseEnter('warehouse')}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#16281E] uppercase tracking-wide">Warehouse & Logistics</h4>
                    <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      Industrial Grade-A
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-sage-muted mb-3 leading-relaxed">
                  Industrial sheds, modern logistics parks, and multi-temperature cold storage solutions strategically located near JNPT Port and Panvel Expressway.
                </p>

                <div className="space-y-1 mb-3.5 text-[11px] text-sage-dark">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>Unmatched Proximity to JNPT & National Highway</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>PEB Sheds & Ample Docking Bays</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>Customized Built-to-Suit & Ready Units</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleShowcaseEnquire('Warehouse & Logistics')}
                  className="w-full bg-gold hover:bg-gold-light text-white text-xs font-bold py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire For Warehouse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Direct Desk Call Button */}
          <div className="pl-2 border-l border-sage-border/80">
            <a
              href="tel:+917718853773"
              className="flex items-center gap-1.5 bg-[#16281E] hover:bg-[#B58A3C] text-white px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shadow-sm"
              aria-label="Call Direct Developer Desk"
            >
              <Phone className="w-3.5 h-3.5 text-gold-light" />
              <span>+91 7718853773</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <div className="flex items-center md:hidden ml-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-xl text-sage-muted hover:text-[#B58A3C] hover:bg-white/60 focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="block h-6 w-6 text-[#16281E]" /> : <Menu className="block h-6 w-6 text-[#16281E]" />}
          </button>
        </div>
      </div>

      {/* ROW 2: SECONDARY LOCATION STRIP (Slim horizontal ticker) */}
      <div className="bg-[#FAF9F6] border-t border-[#CFD9CF]/60 py-1.5 w-full overflow-hidden relative select-none shrink-0 h-[30px] flex items-center">
        <div className="animate-scroll-location-ticker">
          <div className="flex items-center gap-5 md:gap-6 pr-5 md:pr-6 text-[10px] font-bold tracking-wider text-[#16281E] uppercase shrink-0">
            {[...LOCATIONS, ...LOCATIONS].map((loc, i) => (
              <React.Fragment key={`first-${i}`}>
                <span className="hover:text-[#B58A3C] transition-colors duration-200 cursor-default">{loc}</span>
                <span className="w-1.5 h-1.5 bg-[#B58A3C]/70 transform rotate-45 flex-shrink-0" />
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-5 md:gap-6 pr-5 md:pr-6 text-[10px] font-bold tracking-wider text-[#16281E] uppercase shrink-0" aria-hidden="true">
            {[...LOCATIONS, ...LOCATIONS].map((loc, i) => (
              <React.Fragment key={`second-${i}`}>
                <span className="hover:text-[#B58A3C] transition-colors duration-200 cursor-default">{loc}</span>
                <span className="w-1.5 h-1.5 bg-[#B58A3C]/70 transform rotate-45 flex-shrink-0" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          MOBILE MENU — Fixed full-screen overlay (mobile/tablet only)
          ============================================================ */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed left-0 right-0 bg-[#E8EDE8] overflow-y-auto overflow-x-hidden"
          style={{
            top: headerHeight,
            height: `calc(100dvh - ${headerHeight}px)`,
            zIndex: 9999,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="px-4 pt-4 pb-12 space-y-3">
            
            {/* 1. Residential Mobile Accordion */}
            <div className="bg-white rounded-2xl border border-sage-border/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setMobileExpandedCat(mobileExpandedCat === 'residential' ? null : 'residential')}
                className="w-full flex items-center justify-between p-3.5 text-left font-bold text-[#16281E] text-sm uppercase"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#B58A3C]" />
                  <span>Residential Projects</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpandedCat === 'residential' ? 'rotate-180 text-[#B58A3C]' : 'text-sage-muted'
                }`} />
              </button>

              {mobileExpandedCat === 'residential' && (
                <div className="p-2 pt-0 border-t border-sage-border/50 bg-sage-deep/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-muted block px-2 pt-2">
                    Select City in Navi Mumbai:
                  </span>

                  {RESIDENTIAL_CITIES.map((city) => {
                    const cityProps = getPropertiesByCity(city);
                    const isCityOpen = mobileExpandedCity === city;

                    return (
                      <div key={city} className="bg-white rounded-xl border border-sage-border/50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCity(isCityOpen ? null : city)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-sage-dark text-left"
                        >
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold" />
                            <span>{city}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-gold/15 text-gold-darker font-bold px-1.5 py-0.5 rounded-full">
                              {cityProps.length}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCityOpen ? 'rotate-180 text-gold' : 'text-sage-muted'}`} />
                          </div>
                        </button>

                        {isCityOpen && (
                          <div className="p-2 pt-0 space-y-1 bg-sage-deep/10 border-t border-sage-border/40">
                            {cityProps.map((prop) => (
                              <div
                                key={prop.id}
                                onClick={(e) => handleProjectClick(e, prop)}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-sage-border/50 text-xs cursor-pointer hover:border-gold"
                              >
                                <span className="font-bold text-[#16281E] truncate pr-2">{prop.name}</span>
                                <span className="text-[10px] font-bold text-gold shrink-0">
                                  {prop.landingUrl || prop.officialUrl ? 'View Page ›' : 'Enquire ›'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Commercial Mobile Accordion */}
            <div className="bg-white rounded-2xl border border-sage-border/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setMobileExpandedCat(mobileExpandedCat === 'commercial' ? null : 'commercial')}
                className="w-full flex items-center justify-between p-3.5 text-left font-bold text-[#16281E] text-sm uppercase cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#B58A3C]" />
                  <span>Commercial Spaces</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gold/15 text-gold-darker font-bold px-2 py-0.5 rounded-full">
                    {commercialProperties.length} Hubs
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedCat === 'commercial' ? 'rotate-180 text-gold' : 'text-sage-muted'}`} />
                </div>
              </button>

              {mobileExpandedCat === 'commercial' && (
                <div className="p-3 pt-0 space-y-2 border-t border-sage-border/50 bg-[#F4F6F4]">
                  {COMMERCIAL_CITIES.map((city) => {
                    const cityProps = getCommercialPropertiesByCity(city);
                    const isCityOpen = mobileExpandedCity === `comm-${city}`;

                    return (
                      <div key={city} className="bg-white rounded-xl border border-sage-border/50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCity(isCityOpen ? null : `comm-${city}`)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-sage-dark text-left cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold" />
                            <span>{city}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-gold/15 text-gold-darker font-bold px-1.5 py-0.5 rounded-full">
                              {cityProps.length}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCityOpen ? 'rotate-180 text-gold' : 'text-sage-muted'}`} />
                          </div>
                        </button>

                        {isCityOpen && (
                          <div className="p-2 pt-0 space-y-1.5 bg-sage-deep/10 border-t border-sage-border/40">
                            {cityProps.map((prop) => (
                              <div
                                key={prop.id}
                                onClick={(e) => handleCommercialProjectClick(e, prop)}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-sage-border/50 text-xs cursor-pointer hover:border-gold"
                              >
                                <div>
                                  <span className="font-bold text-[#16281E] block leading-tight">{prop.name}</span>
                                  <span className="text-[10px] text-gold font-semibold">{prop.price} • {prop.carpetArea}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gold shrink-0">
                                  Enquire ›
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Plots Mobile Button */}
            <div className="bg-white rounded-2xl border border-sage-border/70 p-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#B58A3C]" />
                <div>
                  <h4 className="text-xs font-bold text-[#16281E] uppercase">NA Villa Plots</h4>
                  <p className="text-[10px] text-sage-muted">Clear-Title Sanctioned Land</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleShowcaseEnquire('NA Villa Plots')}
                className="bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs"
              >
                Enquire
              </button>
            </div>

            {/* 4. Warehouse Mobile Button */}
            <div className="bg-white rounded-2xl border border-sage-border/70 p-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <Warehouse className="w-4 h-4 text-[#B58A3C]" />
                <div>
                  <h4 className="text-xs font-bold text-[#16281E] uppercase">Warehouse</h4>
                  <p className="text-[10px] text-sage-muted">Industrial Sheds & Logistics</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleShowcaseEnquire('Warehouse & Logistics')}
                className="bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs"
              >
                Enquire
              </button>
            </div>

            {/* Direct Call Button */}
            <div className="pt-2">
              <a
                href="tel:+917718853773"
                className="w-full flex items-center justify-center gap-2 bg-[#16281E] text-white py-3 rounded-xl text-xs font-bold tracking-wide shadow-md"
              >
                <Phone className="w-4 h-4 text-gold-light" />
                <span>Call Developer Desk: +91 7718853773</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
