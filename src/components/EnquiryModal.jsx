import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { submitLead } from '../utils/submitLead';
import { properties } from '../data/properties';

const LOCATION_CITIES = ['Kharghar', 'Panvel', 'Nerul', 'Seawoods', 'Vashi', 'Airoli', 'Taloja', 'Juinagar', 'Belapur', 'Sanpada', 'Ghansoli', 'Roadpali'];

const getShortCity = (loc, propName) => {
  if (propName) {
    const propByName = properties.find(
      (p) => p.name.toLowerCase() === propName.toLowerCase()
    );
    if (propByName && propByName.city) {
      const matched = LOCATION_CITIES.find(
        (c) => c.toLowerCase() === propByName.city.toLowerCase()
      );
      if (matched) return matched;
    }
  }

  if (loc) {
    const directMatch = LOCATION_CITIES.find(
      (c) => c.toLowerCase() === loc.toLowerCase()
    );
    if (directMatch) return directMatch;

    const propByLoc = properties.find(
      (p) => p.location.toLowerCase() === loc.toLowerCase() || p.city.toLowerCase() === loc.toLowerCase()
    );
    if (propByLoc && propByLoc.city) {
      const matched = LOCATION_CITIES.find(
        (c) => c.toLowerCase() === propByLoc.city.toLowerCase()
      );
      if (matched) return matched;
    }

    const subMatch = LOCATION_CITIES.find((c) =>
      loc.toLowerCase().includes(c.toLowerCase())
    );
    if (subMatch) return subMatch;
  }

  return '';
};

const EnquiryModal = ({ isOpen, onClose, propertyName, location }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `Interested in ${propertyName}. Please share brochure and pricing details.`,
    location: getShortCity(location, propertyName),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasClearedDefault, setClearedDefault] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: `Interested in ${propertyName}. Please share brochure and pricing details.`,
        location: getShortCity(location, propertyName),
      });
      setError('');
      setIsSubmitted(false);
      setClearedDefault(false);
    }
  }, [isOpen, propertyName, location]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && !hasClearedDefault) {
      const defaultText = `Interested in ${propertyName}. Please share brochure and pricing details.`;
      if (value !== defaultText) {
        setClearedDefault(true);
        setFormData((prev) => ({ ...prev, message: value }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMessageKeyDown = (e) => {
    if (!hasClearedDefault) {
      const isCharacterKey = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
      if (isCharacterKey) {
        setFormData((prev) => ({ ...prev, message: e.key }));
        setClearedDefault(true);
        e.preventDefault();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        setFormData((prev) => ({ ...prev, message: '' }));
        setClearedDefault(true);
        e.preventDefault();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.location) {
      setError('Please select a location.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    submitLead({
      formType: "Modal Enquiry Form",
      propertyName: propertyName,
      region: formData.location,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message
    })
    .then((success) => {
      setIsSubmitting(false);
      if (success) {
        setIsSubmitted(true);
      } else {
        setError('Submission failed. Please try again.');
      }
    })
    .catch((err) => {
      setIsSubmitting(false);
      setError('A network error occurred. Please check your connection.');
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100000] flex items-center justify-center overflow-y-auto p-3 transition-all duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-[370px] overflow-y-auto rounded-xl border border-slate-border/80 bg-slate-card p-5 shadow-2xl transform scale-100 transition-transform duration-300 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-700 hover:text-slate-900 bg-transparent hover:bg-slate-100/85 rounded-full transition-all duration-300 z-[110000] focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-card animate-fadeIn">
            {/* Custom SVG Drawing Checkmark */}
            <svg className="checkmark mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h3 className="text-xl font-bold text-slate-dark mb-1">Thank you!</h3>
            <p className="text-xs text-slate-muted">
              Our team will contact you shortly regarding <span className="font-semibold text-gold">{propertyName}</span>.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-slate-dark font-serif leading-tight">
              Enquire About
            </h3>
            <p className="text-gold font-semibold text-sm mb-3 leading-tight truncate">
              {propertyName}
            </p>

            {error && (
              <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-dark uppercase tracking-wider mb-0.5">
                  Preferred Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-input border border-slate-border/80 text-xs text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select a location</option>
                  {LOCATION_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-dark uppercase tracking-wider mb-0.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-input border border-slate-border/80 text-xs text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-dark uppercase tracking-wider mb-0.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="E.g. 7718853773"
                  maxLength="10"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-input border border-slate-border/80 text-xs text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-dark uppercase tracking-wider mb-0.5">
                  Email Address <span className="text-slate-muted">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aarav@example.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-input border border-slate-border/80 text-xs text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-dark uppercase tracking-wider mb-0.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onKeyDown={handleMessageKeyDown}
                  rows="2"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-input border border-slate-border/80 text-xs text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider text-xs mt-1.5 flex items-center justify-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
