import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { COUNTRY_CODES, getCountryByCode } from '../data/countryCodes';

const CountryCodeDropdown = ({ 
  value, 
  onChange, 
  placement = 'bottom', 
  className = '', 
  buttonClassName = '',
  compact = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selected = getCountryByCode(value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredCountries = COUNTRY_CODES.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) || 
      c.code.includes(q) || 
      c.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className={`flex items-center gap-1.5 px-2.5 py-2.5 bg-sage-input border border-sage-border/80 rounded-xl text-sage-dark text-xs font-semibold hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors cursor-pointer select-none ${buttonClassName}`}
        title={`Selected: ${selected.name} (${selected.code})`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <img 
          src={selected.flagUrl} 
          alt={selected.country}
          className="w-5 h-3.5 object-cover rounded-[2px] shadow-xs shrink-0" 
          loading="eager"
          onError={(e) => {
            // Fallback to text if network issue
            e.target.style.display = 'none';
          }}
        />
        <span className="font-bold text-xs text-sage-dark">{selected.code}</span>
        <ChevronDown 
          className={`w-3 h-3 text-sage-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gold' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute left-0 z-50 w-60 max-h-64 bg-white border border-gold/30 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn ${
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          role="listbox"
        >
          {/* Search box */}
          <div className="p-2 border-b border-sage-border/40 bg-sage-input/40 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-sage-muted shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code..."
              className="w-full px-2 py-1 text-xs bg-white border border-sage-border/60 rounded-md focus:outline-none focus:ring-1 focus:ring-gold text-sage-dark"
            />
          </div>

          {/* List of Countries */}
          <div className="overflow-y-auto max-h-48 custom-scrollbar divide-y divide-sage-border/20">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-xs text-sage-muted text-center">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selected.code;
                return (
                  <button
                    key={c.code + c.country}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-gold/10 transition-colors cursor-pointer ${
                      isSelected ? 'bg-gold/15 font-bold text-gold-darker' : 'text-sage-dark'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img 
                        src={c.flagUrl} 
                        alt={c.country} 
                        className="w-4 h-3 object-cover rounded-[2px] shadow-2xs shrink-0" 
                        loading="lazy"
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <span className="text-[11px] font-semibold text-sage-muted">{c.code}</span>
                      {isSelected && <Check className="w-3 h-3 text-gold" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeDropdown;
