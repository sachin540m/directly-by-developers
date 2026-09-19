import React from 'react';
import { developers } from '../data/developers';
import { motion } from 'framer-motion';

const DeveloperPartners = ({ onExploreClick }) => {
  return (
    <div className="relative z-20 w-full py-2.5 lg:py-3 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1550px] mx-auto text-center">
        
        {/* Main Heading */}
        <h2 className="text-sm sm:text-base lg:text-lg font-serif text-[#0F2A23] font-bold tracking-tight mb-2">
          Trusted by Leading Developers
        </h2>

        {/* Continuous Horizontal Logo Panel - Roomy frame ensuring large, clear logos without cropping */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-white/95 backdrop-blur-sm border border-[#B58A3C]/30 rounded-2xl md:rounded-full py-2 sm:py-2.5 px-4 lg:px-6 shadow-md flex items-center justify-between gap-4 overflow-hidden min-h-[72px] sm:min-h-[82px]"
        >
          <div className="flex-1 w-full overflow-hidden relative select-none py-1">
            <div className="animate-scroll-ticker flex items-center">
              {/* First Loop */}
              <div className="flex items-center gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0">
                {[...developers, ...developers].map((dev, index) => (
                  <React.Fragment key={`first-${dev.id}-${index}`}>
                    <div className="flex items-center justify-center h-12 sm:h-14 max-w-[150px] sm:max-w-[180px] transition-all duration-300 transform hover:scale-105 shrink-0 px-1">
                      <img
                        src={dev.logo}
                        alt={dev.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <span className="text-[#B58A3C] text-[6px] select-none shrink-0 opacity-70">◆</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Second Loop for Infinite Scrolling */}
              <div className="flex items-center gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0" aria-hidden="true">
                {[...developers, ...developers].map((dev, index) => (
                  <React.Fragment key={`second-${dev.id}-${index}`}>
                    <div className="flex items-center justify-center h-12 sm:h-14 max-w-[150px] sm:max-w-[180px] transition-all duration-300 transform hover:scale-105 shrink-0 px-1">
                      <img
                        src={dev.logo}
                        alt={dev.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <span className="text-[#B58A3C] text-[6px] select-none shrink-0 opacity-70">◆</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DeveloperPartners;
