import React from 'react';
import { MapPin } from 'lucide-react';
import { locations } from '../data/locations';

const LocationNavbar = ({ activeLocation, onSelectLocation }) => {
  return (
    <header className="w-full bg-[#0F2A23] border-b border-[#B58A3C]/30 text-white font-sans shrink-0 h-[40px] sm:h-[42px] flex items-center z-50">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-widest h-full">
        
        {/* Left Side: Pin Icon + EXPLORE LOCATIONS + Gold Line */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-[#B58A3C]">
            <MapPin className="w-3.5 h-3.5 text-[#B58A3C]" />
            <span>EXPLORE LOCATIONS</span>
          </div>
          <div className="w-[1px] h-3.5 bg-[#B58A3C]/40 hidden md:block" />
        </div>

        {/* Center: Horizontal Locations List */}
        <nav className="flex-1 overflow-x-auto no-scrollbar px-3 sm:px-6 flex items-center justify-start lg:justify-center gap-2.5 sm:gap-3.5 whitespace-nowrap">
          {locations.map((loc, index) => {
            const isActive = activeLocation?.toLowerCase() === loc.toLowerCase();
            return (
              <React.Fragment key={loc}>
                <button
                  onClick={() => onSelectLocation && onSelectLocation(loc)}
                  className={`transition-colors duration-200 hover:text-[#B58A3C] font-semibold tracking-wider ${
                    isActive ? 'text-[#B58A3C] underline underline-offset-4 decoration-[#B58A3C]' : 'text-white/90'
                  }`}
                >
                  {loc}
                </button>
                {index < locations.length - 1 && (
                  <span className="text-[#B58A3C] text-[7px] select-none shrink-0">◆</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right Side: Gold line + Italic Serif Tagline */}
        <div className="hidden xl:flex items-center gap-2.5 shrink-0 pl-3 border-l border-[#B58A3C]/20">
          <div className="w-6 h-[1px] bg-[#B58A3C]/60" />
          <span className="font-serif italic lowercase first-letter:uppercase text-[#F7F5F0]/90 text-xs tracking-normal font-normal">
            Same Cities. Better Opportunities.
          </span>
        </div>

      </div>
    </header>
  );
};

export default LocationNavbar;
