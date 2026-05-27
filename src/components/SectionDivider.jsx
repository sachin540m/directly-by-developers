import React from 'react';

const SectionDivider = ({ className = 'my-4' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gold/40"></div>
      <span className="text-gold text-lg font-serif">✦</span>
      <div className="flex-1 h-px bg-gold/40"></div>
    </div>
  );
};

export default SectionDivider;
