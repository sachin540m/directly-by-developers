import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import SectionDivider from './SectionDivider';

const PropertyCard = ({ property, onEnquire }) => {
  const { name, developer, location, city, bhk, price, offer, image, slug, officialUrl, landingUrl } = property;
  const hasTargetUrl = Boolean(landingUrl || officialUrl);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-slate-card rounded-[18px] shadow-sm border border-gold/15 hover:border-gold/50 overflow-hidden hover:shadow-[0_20px_50px_rgba(184,134,11,0.12)] hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 flex flex-col h-full group ken-burns-container">
      {/* Property Image & Badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-deep">
        {/* Skeleton Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer-wave z-10 flex items-center justify-center">
            <span className="text-gold/60 text-xs font-semibold uppercase tracking-wider">Loading...</span>
          </div>
        )}
        
        <div 
          onClick={() => onEnquire && onEnquire(name, city || location)}
          className="cursor-pointer w-full h-full"
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover ken-burns-img transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Top-Left City Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider z-20">
          {city}
        </div>

        {/* Top-Right No Brokerage Badge */}
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow flex items-center gap-1 uppercase tracking-wide z-20">
          <ShieldCheck className="w-3.5 h-3.5" />
          No Brokerage
        </div>
      </div>

      {/* Decorative Divider */}
      <SectionDivider className="my-2 px-6" />

      {/* Main Details Section */}
      <div className="px-6 py-4 flex-grow flex flex-col">
        {/* Clickable Title */}
        <h3 
          onClick={() => onEnquire && onEnquire(name, city || location)}
          className="text-xl font-bold text-slate-dark font-serif leading-snug hover:text-gold transition-colors duration-200 cursor-pointer"
        >
          {name}
        </h3>

        {/* Inner Divider */}
        <div className="w-full h-px bg-slate-border/50 my-3"></div>

        {/* Specs List */}
        <ul className="space-y-2.5 text-sm text-slate-muted mb-6 flex-grow">
          <li className="flex items-start gap-2">
            <span className="text-gold mt-0.5 select-none">►</span>
            <span>
              By <strong className="text-slate-dark font-semibold">{developer}</strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold mt-0.5 select-none">►</span>
            <span className="line-clamp-1 text-slate-muted">{location}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold mt-0.5 select-none">►</span>
            <span className="font-semibold text-slate-dark">{bhk}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold mt-0.5 select-none">►</span>
            <span className="font-bold text-gold">{price}</span>
          </li>
          {offer && (
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 select-none">►</span>
              <span className="text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-500/20">
                {offer}
              </span>
            </li>
          )}
        </ul>

        {/* Action Buttons: Enquire & Visit Official Site */}
        <div className={`mt-auto pt-2 ${hasTargetUrl ? 'grid grid-cols-2 gap-3' : 'w-full'}`}>
          <button
            onClick={() => onEnquire && onEnquire(name, city || location)}
            className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-[10px] text-center shimmer-sweep"
          >
            Enquire Now
          </button>
          
          {hasTargetUrl && (
            <a
              href={landingUrl || officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border-2 border-gold/60 text-gold hover:bg-gold hover:text-white font-bold py-2.5 px-3 rounded-lg shadow-sm transition-all duration-300 uppercase tracking-wider text-[10px] text-center flex items-center justify-center"
            >
              {landingUrl ? "View Project" : "Official Site"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
