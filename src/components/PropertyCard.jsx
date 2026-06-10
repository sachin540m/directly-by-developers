import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import SectionDivider from './SectionDivider';

const PropertyCard = ({ property }) => {
  const { name, developer, location, city, bhk, price, offer, image, slug, officialUrl } = property;

  return (
    <div className="bg-slate-card rounded-xl shadow-md border border-slate-border/80 overflow-hidden hover:shadow-xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      {/* Property Image & Badges */}
      <div className="relative aspect-video overflow-hidden">
        <Link to={`/property/${slug}`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top-Left City Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {city}
        </div>

        {/* Top-Right No Brokerage Badge */}
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow flex items-center gap-1 uppercase tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          No Brokerage
        </div>
      </div>

      {/* Decorative Divider */}
      <SectionDivider className="my-2 px-6" />

      {/* Main Details Section */}
      <div className="px-6 py-4 flex-grow flex flex-col">
        {/* Clickable Title */}
        <h3 className="text-xl font-bold text-slate-dark font-serif leading-snug hover:text-gold transition-colors duration-200">
          <Link to={`/property/${slug}`}>{name}</Link>
        </h3>

        {/* Inner Divider */}
        <div className="w-full h-px bg-slate-border/50 my-3"></div>

        {/* Specs List */}
        <ul className="space-y-2.5 text-sm text-slate-muted mb-6 flex-grow">
          <li className="flex items-start gap-2">
            <span>
              By <strong className="text-slate-dark font-semibold">{developer}</strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="line-clamp-1 text-slate-muted">{location}</span>
          </li>
          
          {/* Render offers as bullet points if it's an array, or split by ◆ if it's a string */}
          {offer && (Array.isArray(offer) ? offer : offer.split('◆').filter(Boolean).map(o => '◆ ' + o.trim())).map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-slate-dark font-medium">{bullet}</span>
            </li>
          ))}

          <li className="flex items-start gap-2 pt-2">
            <span className="font-semibold text-slate-dark">{bhk}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-gold text-base">{price}</span>
          </li>
        </ul>

        {/* Visit Official Site Link */}
        <a
          href={officialUrl || "https://www.lodhagroup.in"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] uppercase tracking-wider text-xs text-center block"
        >
          Visit Official Site
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;
