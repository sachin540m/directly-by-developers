import React from 'react';
import SectionDivider from './SectionDivider';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-slate-deep/30 to-slate-deep py-16 px-4 md:px-8 border-b border-slate-border/50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-dark font-serif leading-tight tracking-tight">
          Directly By Developers Offer Properties in{' '}
          <span className="text-gold">Nerul</span>,{' '}
          <span className="text-gold">Panvel</span>,{' '}
          <span className="text-gold">Kharghar</span> &{' '}
          <span className="text-gold">Vashi</span>
        </h1>
        
        {/* Decorative Divider */}
        <SectionDivider className="my-6 max-w-lg mx-auto" />
        
        <p className="text-lg md:text-xl text-slate-muted font-medium max-w-2xl mx-auto font-sans">
          Buy 1, 2, 3, 4 & 5 BHK Flats Directly From Developers —{' '}
          <span className="text-emerald-700 font-semibold">No Brokerage</span>, Best Price Guaranteed
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
