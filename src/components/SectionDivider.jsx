import React, { useEffect, useRef, useState } from 'react';

const SectionDivider = ({ className = 'my-4' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gold/40"></div>
      <span className={`text-gold text-lg font-serif transition-transform duration-1000 ${
        isVisible ? 'animate-slow-spin-pulse' : ''
      }`}>✦</span>
      <div className="flex-1 h-px bg-gold/40"></div>
    </div>
  );
};

export default SectionDivider;
