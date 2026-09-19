import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#E8EDE8] border-t border-sage-border/50 py-12 px-4 sm:px-6 lg:px-8 text-sage-dark font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-center md:text-left">
          {/* Section 1: About / Tagline */}
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-dark mb-4 uppercase tracking-wider">
              Directly By Developers
            </h3>
            <p className="text-xs text-sage-muted leading-relaxed max-w-sm mx-auto md:mx-0">
              Your trusted platform for discovering verified developer projects across Navi Mumbai. Buy direct with zero brokerage, complete transparency, and authentic developer pricing.
            </p>
          </div>

          {/* Section 3: Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-serif font-bold text-lg text-slate-dark mb-4 uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="p-2 bg-white/60 hover:bg-gold hover:text-white rounded-full transition-colors duration-300 shadow-sm text-sage-dark" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/60 hover:bg-gold hover:text-white rounded-full transition-colors duration-300 shadow-sm text-sage-dark" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/60 hover:bg-gold hover:text-white rounded-full transition-colors duration-300 shadow-sm text-sage-dark" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/60 hover:bg-gold hover:text-white rounded-full transition-colors duration-300 shadow-sm text-sage-dark" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <span className="text-[10px] text-sage-muted font-semibold">Email: connect@directlybydevelopers.com</span>
          </div>
        </div>

        {/* MahaRERA Disclaimer */}
        <div className="border-t border-sage-border/30 pt-8 pb-4 text-center">
          <p className="text-[10px] text-sage-muted leading-relaxed max-w-4xl mx-auto mb-6">
            Disclaimer: Directly By Developers is a marketing and advertising platform showcasing real estate projects from developers. All project information, pricing, specifications, offers, availability, construction progress, and possession timelines are provided by the respective developers and are subject to change without prior notice. Buyers are advised to verify all project details, including the applicable MahaRERA registration, official documents, and terms and conditions with the developer before making any booking or purchase decision.
          </p>
          <p className="text-xs font-semibold text-slate-dark">
            Copyright © 2026 | Powered by Directly By Developers | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
