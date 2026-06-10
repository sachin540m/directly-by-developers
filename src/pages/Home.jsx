import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import EnquiryModal from '../components/EnquiryModal';
import FloatingButtons from '../components/FloatingButtons';
import Footer from '../components/Footer';
import ContactFAQSection from '../components/ContactFAQSection';
import { properties } from '../data/properties';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get('city');

  // Filter state
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPropertyName, setModalPropertyName] = useState('');

  // Handle setting active filter from URL query param
  useEffect(() => {
    if (cityParam) {
      const formattedCity = cityParam.charAt(0).toUpperCase() + cityParam.slice(1).toLowerCase();
      if (['Nerul', 'Panvel', 'Kharghar', 'Vashi'].includes(formattedCity)) {
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
    document.title = "Directly By Developers | Buy Premium Flats in Nerul, Panvel, Kharghar & Vashi | No Brokerage";
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ city: filter.toLowerCase() });
    }
  };

  const handleEnquire = (propertyName) => {
    setModalPropertyName(propertyName);
    setIsModalOpen(true);
  };

  // Filtered property list
  const filteredProperties = activeFilter === 'All'
    ? properties
    : properties.filter((p) => p.city.toLowerCase() === activeFilter.toLowerCase());

  const filters = ['All', 'Nerul', 'Panvel', 'Kharghar', 'Vashi'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-deep">
      <Navbar />
      
      <HeroSection />

      {/* Filter Bar & Listings Section */}
      <main className="flex-grow bg-slate-deep py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-border/40">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm border ${
                  activeFilter === filter
                    ? 'bg-gold border-gold text-white shadow-md hover:bg-gold-dark scale-105'
                    : 'bg-slate-card border-slate-border text-slate-dark hover:border-gold hover:text-gold hover:scale-105'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center md:text-left">
            <p className="text-slate-muted text-sm">
              Showing <span className="font-bold text-slate-dark">{filteredProperties.length}</span>{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'}{' '}
              {activeFilter !== 'All' && <span>in <strong className="text-gold">{activeFilter}</strong></span>}
            </p>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="transform transition-all duration-500 animate-fadeIn h-full"
                >
                  <PropertyCard property={property} onEnquire={handleEnquire} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-card rounded-xl shadow-sm border border-slate-border/60 max-w-lg mx-auto">
              <p className="text-slate-muted font-medium text-lg">No properties found in this location.</p>
              <button
                onClick={() => handleFilterChange('All')}
                className="mt-4 text-gold hover:underline font-bold uppercase tracking-wider text-sm"
              >
                View all properties
              </button>
            </div>
          )}
        </div>
      </main>

      <ContactFAQSection />

      <Footer />
      
      <FloatingButtons />

      {/* Shared Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyName={modalPropertyName}
      />
    </div>
  );
};

export default Home;
