import React, { useState, useEffect } from 'react';
import { HERO_CONFIG } from '../data/config';

const base = import.meta.env.BASE_URL;

const PARTNER_LOGOS = [
  { src: `${base}images/logo-paradise-group.jpeg`, alt: 'Paradise Group' },
  { src: `${base}images/logo-today.png`, alt: 'Today Global Developers' },
  { src: `${base}images/logo-Godrej-Properties.avif`, alt: 'Godrej Properties' },
  { src: `${base}images/Logo-Raheja_Universal.jpg`, alt: 'Raheja Developers' },
  { src: `${base}images/logo-proviso.png`, alt: 'Proviso Group' },
  { src: `${base}images/logo-gajara-group.webp`, alt: 'GAJRA GROUP' },
  { src: `${base}images/logo-kamdhenu-dev.jpg`, alt: 'Kamdhenu Realities' },
  { src: `${base}images/logo-satyam-dev-rGulati.png`, alt: 'Satyam Developers' },
  { src: `${base}images/logo-akshar.png`, alt: 'Akshar Group' },
  { src: `${base}images/logo-gami.png`, alt: 'Gami Group' },
  { src: `${base}images/logo-Sambhav-group.svg`, alt: 'Sambhav Group' },
  { src: `${base}images/logo-arihant.jpeg`, alt: 'Arihant Superstructures' },
];

const HeroBanner = ({
  backgroundImage = HERO_CONFIG.backgroundImage,
  headline = HERO_CONFIG.headline,
  subheadline = HERO_CONFIG.subheadline,
  onEnquireClick,
  onBrowseClick
}) => {
  const [offset, setOffset] = useState(0);

  // Lag-free parallax effect (5-8% rate) using requestAnimationFrame for GPU-accelerated rendering
  useEffect(() => {
    let requestRef;
    const handleScroll = () => {
      // Apply a subtle 6% parallax translation offset
      setOffset(window.scrollY * 0.06);
    };

    const onScroll = () => {
      requestRef = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <section
      className="relative w-full h-[calc(100vh-104px)] min-h-[420px] md:h-[calc(100vh-120px)] md:min-h-[465px] overflow-hidden bg-gradient-to-tr from-[#FAF9F6] via-white to-[#F0F2F0] text-sage-dark flex flex-col justify-between border-b border-sage-border/50 pt-2 md:pt-3 pb-3"
      aria-label="Welcome Banner"
    >
      {/* Premium White Background - Decorative Layers & Glowing Blobs */}
      <div
        className="absolute inset-0 w-full h-[115%] -top-[7%] left-0 pointer-events-none select-none overflow-hidden"
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'transform'
        }}
      >
        {/* Subtle grid pattern for premium architectural feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Faint elegant glow effects to provide depth */}
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-sage-deep/60 blur-[120px]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />

        {/* Soft light overlay */}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Hero Content Area */}
      <div className="relative max-w-[92vw] sm:max-w-xl lg:max-w-2xl mx-auto px-3 z-10 flex flex-col items-center justify-center flex-grow">
        {/* Glassmorphic Container Card - Premium Light Glassmorphism */}
        <div className="w-full bg-white/55 backdrop-blur-md border border-white/80 rounded-2xl px-5 py-3 sm:px-8 sm:py-4.5 lg:px-9 lg:py-5 shadow-xl hover:shadow-2xl flex flex-col items-center text-center transition-all duration-300 md:bg-white/65 md:backdrop-blur-lg md:border-white/90 md:hover:border-gold/30">
          {/* Main Title - Stagger 1 */}
          <span className="text-gold-dark font-bold uppercase tracking-widest text-[11px] sm:text-xs animate-fade-stagger-1 mb-1">
            Directly By Developers
          </span>
          <h1
            className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-sage-dark animate-fade-stagger-1 mb-1.5"
          >
            Buy Direct. Save More.
          </h1>
          <h2
            className="font-sans font-semibold text-sm sm:text-base lg:text-lg text-emerald-800 animate-fade-stagger-2 mb-1.5"
          >
            Find Your Perfect Property, Directly from Developers.
          </h2>
          <p
            className="font-sans text-xs sm:text-sm text-sage-muted animate-fade-stagger-2 max-w-md mb-3.5 leading-relaxed"
          >
            Discover handpicked projects from leading developers with complete transparency and book with zero brokerage.
          </p>

          {/* Call to Actions (CTA) Buttons - Stagger 3 */}
          <div
            className="flex justify-center items-center animate-fade-stagger-3 w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <button
              onClick={onEnquireClick}
              className="w-full sm:w-auto px-6 py-2.5 bg-gold hover:bg-gold-light text-white font-bold rounded-lg shadow-md hover:shadow-[0_10px_25px_rgba(184,134,11,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider text-xs font-sans focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus:outline-none"
              aria-label="Book Free Site Visit"
            >
              Book Free Site Visit
            </button>
          </div>
        </div>
      </div>

      {/* Developer Partners Slider Section */}
      <div className="relative z-10 w-full mt-4 md:mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3">
          <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-sage-dark tracking-tight">
            Our Trusted Developer Partners
          </h3>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-1 rounded-full" />
        </div>

        <div className="logo-slider-container">
          <div className="logo-slider-track">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
              <div key={index} className="logo-slider-item">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
