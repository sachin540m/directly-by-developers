import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, ShieldCheck, Percent, Building2, Star, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperPartners from './DeveloperPartners';

const base = import.meta.env.BASE_URL;

const HERO_SLIDES = [
  {
    id: 1,
    image: `${base}images/luxury_hero_new.jpg`,
    headingMain: 'Buy Your Next Address,',
    headingGold: 'Directly From the Source.',
    subtext: 'Exclusive developer inventory. Verified projects. Complete transparency. Zero brokerage.'
  },
  {
    id: 2,
    image: `${base}images/sai-world-empire-banner.webp`,
    headingMain: 'Curated Luxury Residences,',
    headingGold: 'Crafted For Distinction.',
    subtext: 'Discover iconic sea-facing and township developments directly from top tier developers.'
  },
  {
    id: 3,
    image: `${base}images/raheja-atlantis-banner.webp`,
    headingMain: 'Direct Builder Pricing,',
    headingGold: 'Zero Brokerage Guaranteed.',
    subtext: 'Seamless direct access to official developer sales teams across prime Navi Mumbai locations.'
  }
];

const HeroSection = ({ onExploreClick, onConsultationClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = HERO_SLIDES[currentSlide];

  // Automatic slide timer (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="relative w-full max-w-full flex-1 flex flex-col justify-between bg-[#FCFBF8] text-[#1B1F1E] isolate overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* ==================================================
          RIGHT PROPERTY BACKGROUND IMAGE CONTAINER
          Stretches from 35% to 100% width on Desktop
          ================================================== */}
      {/* Background image — desktop only (hidden on mobile/tablet) */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[65%] z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />
          </motion.div>
        </AnimatePresence>


      </div>

      {/* ==================================================
          ORGANIC CURVED / WAVE MIST BOUNDARY (35% to 62%)
          Irregular flowing wave boundary with blurred cloud depth
          ================================================== */}

      {/* ==================================================
          FULL-HERO SEAMLESS ATMOSPHERIC FOG OVERLAY (0% to 100%)
          Spans full width & height (inset-0) so ZERO box edges exist!
          ================================================== */}

      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block overflow-hidden">
        {/* Layer 1: Full-Width Multi-Stop Strong Feathered Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(
              90deg,
              rgba(252, 251, 248, 1) 0%,
              rgba(252, 251, 248, 1) 32%,
              rgba(252, 251, 248, 0.92) 44%,
              rgba(252, 251, 248, 0.70) 56%,
              rgba(252, 251, 248, 0.38) 68%,
              rgba(252, 251, 248, 0.12) 78%,
              transparent 86%
            )`
          }}
        />

        {/* Layer 2: Strong Angled Ambient Haze (96deg) */}
        <div
          className="absolute inset-0 w-full h-full opacity-85"
          style={{
            background: `linear-gradient(
              96deg,
              rgba(252, 251, 248, 1) 0%,
              rgba(252, 251, 248, 0.95) 36%,
              rgba(252, 251, 248, 0.65) 52%,
              rgba(252, 251, 248, 0.28) 66%,
              transparent 80%
            )`
          }}
        />

        {/* Layer 3: Rich Radial Cloud Mist Core */}
        <div
          className="absolute inset-0 w-full h-full opacity-65"
          style={{
            background: `radial-gradient(
              ellipse 50% 75% at 48% 50%,
              rgba(252, 251, 248, 0.95) 0%,
              rgba(247, 245, 240, 0.60) 50%,
              transparent 90%
            )`
          }}
        />
      </div>

      {/* ==================================================
          FOREGROUND HERO CONTENT (Left 52% to 55%)
          ================================================== */}
      <div className="max-w-[1650px] w-full mx-auto relative z-20 flex-1 flex flex-col justify-between">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center flex-1">
          {/* Left Content Column (55% / 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center px-[clamp(1.25rem,3vw,3rem)] py-[clamp(0.75rem,1.8vw,1.5rem)] max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Eyebrow Label */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[clamp(0.625rem,0.85vw,0.6875rem)] font-bold uppercase tracking-widest text-[#B58A3C] font-sans">
                  DIRECTLY BY DEVELOPERS
                </span>
                <div className="w-8 h-[1px] bg-[#B58A3C]/70" />
              </div>

              {/* Main Headline & Subtext Container (Reserved height prevents frame jumping) */}
              <div className="min-h-[120px] sm:min-h-[135px] lg:min-h-[148px] mb-3 flex flex-col justify-start overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Main Headline with Gold Accent */}
                    <h1 className="text-[clamp(1.35rem,2.5vw,2.35rem)] font-serif font-bold text-[#0F2A23] leading-[1.15] tracking-tight mb-2">
                      {slide.headingMain} <br />
                      <span className="text-[#B58A3C]">{slide.headingGold}</span>
                    </h1>

                    {/* Subheading / Paragraph */}
                    <p className="text-[clamp(0.75rem,0.95vw,0.825rem)] text-[#66706B] font-sans font-normal leading-relaxed max-w-lg">
                      {slide.subtext}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CTA Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Primary CTA (Talk to an Expert) */}
                <button
                  onClick={onConsultationClick}
                  className="px-5 py-2.5 bg-[#0F2A23] hover:bg-[#173D33] text-white font-bold font-sans rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-xs uppercase tracking-wider group"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B58A3C]" />
                  <span>TALK TO AN EXPERT</span>
                </button>

                {/* Secondary CTA (Explore Properties) */}
                <button
                  onClick={onExploreClick}
                  className="px-4.5 py-2.5 bg-[#FCFBF8] hover:bg-[#F7F5F0] text-[#0F2A23] border border-[#B58A3C] font-bold font-sans rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:border-[#9A6F1E]"
                >
                  <span>EXPLORE PROPERTIES</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B58A3C] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* 5 USP Feature Items (Directly Below CTA Buttons inside Hero) */}
              <div className="mt-3.5 pt-3 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:flex-nowrap gap-2.5 lg:gap-3 max-w-2xl select-none">
                {/* 1. Verified Projects */}
                <div className="flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#B58A3C] shrink-0" strokeWidth={1.5} />
                  <div className="text-[11px] font-sans font-semibold text-[#0F2A23] leading-tight">
                    <span className="block">Verified</span>
                    <span className="block">Projects</span>
                  </div>
                </div>

                <div className="hidden lg:block w-[1px] h-5 bg-[#EBE6DE] shrink-0" />

                {/* 2. Zero Brokerage */}
                <div className="flex items-center gap-2 shrink-0">
                  <Percent className="w-4 h-4 text-[#B58A3C] shrink-0" strokeWidth={1.5} />
                  <div className="text-[11px] font-sans font-semibold text-[#0F2A23] leading-tight">
                    <span className="block">Zero</span>
                    <span className="block">Brokerage</span>
                  </div>
                </div>

                <div className="hidden lg:block w-[1px] h-5 bg-[#EBE6DE] shrink-0" />

                {/* 3. Direct Developer Access */}
                <div className="flex items-center gap-2 shrink-0">
                  <Building2 className="w-4 h-4 text-[#B58A3C] shrink-0" strokeWidth={1.5} />
                  <div className="text-[11px] font-sans font-semibold text-[#0F2A23] leading-tight">
                    <span className="block">Direct</span>
                    <span className="block">Developer Access</span>
                  </div>
                </div>

                <div className="hidden lg:block w-[1px] h-5 bg-[#EBE6DE] shrink-0" />

                {/* 4. Exclusive Inventory */}
                <div className="flex items-center gap-2 shrink-0">
                  <Star className="w-4 h-4 text-[#B58A3C] shrink-0" strokeWidth={1.5} />
                  <div className="text-[11px] font-sans font-semibold text-[#0F2A23] leading-tight">
                    <span className="block">Exclusive</span>
                    <span className="block">Inventory</span>
                  </div>
                </div>

                <div className="hidden lg:block w-[1px] h-5 bg-[#EBE6DE] shrink-0" />

                {/* 5. Personalized Support */}
                <div className="flex items-center gap-2 shrink-0">
                  <Headphones className="w-4 h-4 text-[#B58A3C] shrink-0" strokeWidth={1.5} />
                  <div className="text-[11px] font-sans font-semibold text-[#0F2A23] leading-tight">
                    <span className="block">Personalized</span>
                    <span className="block">Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Developer Partners Ticker (Integrated Inside HeroSection) */}
        <DeveloperPartners onExploreClick={onExploreClick} />
      </div>

    </section>
  );
};

export default HeroSection;
