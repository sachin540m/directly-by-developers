import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, MapPin, Building } from 'lucide-react';
import { properties } from '../data/properties';
import logo from '../logo.jpeg';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'Nerul' | 'Panvel' | 'Kharghar' | null
  const [mobileAccordion, setMobileAccordion] = useState(null); // 'Nerul' | 'Panvel' | 'Kharghar' | null

  const cities = ['Nerul', 'Panvel', 'Kharghar', 'Vashi'];

  // Filter properties by city
  const getPropertiesByCity = (city) => {
    return properties.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  };

  const handleMouseEnter = (city) => {
    setActiveDropdown(city);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileAccordion = (city) => {
    if (mobileAccordion === city) {
      setMobileAccordion(null);
    } else {
      setMobileAccordion(city);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#E8EDE8] shadow-sm border-b border-sage-border/60 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group" aria-label="Directly By Developers home">
              <img
                src={logo}
                alt="Directly By Developers"
                className="h-22 w-auto max-w-[400px] sm:max-w-[110px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {cities.map((city) => {
              const cityProps = getPropertiesByCity(city);
              const isActive = location.pathname.includes(`/property/`) && 
                               properties.find(p => p.slug === location.pathname.split('/').pop())?.city === city;
              
              return (
                <div
                  key={city}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(city)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase py-2 transition-all duration-300 ${
                      isActive 
                        ? 'text-gold border-b-2 border-gold' 
                        : 'text-sage-dark hover:text-gold border-b-2 border-transparent'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-gold/80" />
                    {city}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === city ? 'rotate-180 text-gold' : 'text-sage-muted'}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-b-xl border border-sage-border z-50 py-3 transition-all duration-300 transform origin-top ${
                      activeDropdown === city
                        ? 'opacity-100 scale-y-100 pointer-events-auto'
                        : 'opacity-0 scale-y-95 pointer-events-none'
                    }`}
                  >
                    <div className="max-h-80 overflow-y-auto custom-scrollbar px-2 space-y-1">
                      {cityProps.length > 0 ? (
                        cityProps.map((prop) => (
                          <Link
                            key={prop.id}
                            to={`/property/${prop.slug}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-sage-dark hover:bg-sage-deep hover:text-gold rounded-lg transition-all duration-200"
                          >
                            <Building className="w-3.5 h-3.5 text-gold/70" />
                            <span>{prop.name}</span>
                          </Link>
                        ))
                      ) : (
                        <span className="block px-3 py-2 text-xs text-sage-muted italic">
                          No properties listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-sage-muted hover:text-gold hover:bg-sage-card focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide Down Accordion) */}
      <div
        className={`md:hidden bg-[#E8EDE8] border-t border-sage-border/40 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[600px] border-b border-sage-border/50' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {cities.map((city) => {
            const cityProps = getPropertiesByCity(city);
            const isAccordionOpen = mobileAccordion === city;

            return (
              <div key={city} className="border-b border-sage-border/30 pb-2">
                <button
                  onClick={() => toggleMobileAccordion(city)}
                  className="flex justify-between items-center w-full py-3 text-left font-bold text-sage-dark hover:text-gold focus:outline-none"
                >
                  <span className="flex items-center gap-2 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-gold" />
                    {city}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isAccordionOpen ? 'rotate-180 text-gold' : 'text-sage-muted'
                    }`}
                  />
                </button>

                {/* Dropdown Items Accordion */}
                <div
                  className={`pl-4 space-y-1 transition-all duration-300 overflow-hidden ${
                    isAccordionOpen ? 'max-h-80 py-1' : 'max-h-0'
                  }`}
                >
                  {cityProps.length > 0 ? (
                    cityProps.map((prop) => (
                      <Link
                        key={prop.id}
                        to={`/property/${prop.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-sm text-sage-muted hover:text-gold transition-colors"
                      >
                        <Building className="w-3.5 h-3.5 text-gold/60" />
                        <span>{prop.name}</span>
                      </Link>
                    ))
                  ) : (
                    <span className="block py-2 text-xs text-sage-muted italic">
                      No properties listed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
