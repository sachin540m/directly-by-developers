import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const EnquiryModal = ({ isOpen, onClose, propertyName }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `Interested in ${propertyName}. Please share brochure and pricing details.`,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setError('');
    setIsSubmitted(true);

    // Close after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
      onClose();
    }, 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-slate-card w-full max-w-md rounded-xl shadow-2xl p-8 border border-slate-border/80 transform scale-100 transition-transform duration-300 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-muted hover:text-slate-dark transition-colors p-1 rounded-full hover:bg-slate-deep"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-card">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-slate-dark mb-2">Thank you!</h3>
            <p className="text-slate-muted">
              Our team will contact you shortly regarding <span className="font-semibold text-gold">{propertyName}</span>.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-slate-dark mb-1 font-serif">
              Enquire About
            </h3>
            <p className="text-gold font-semibold text-lg mb-6 leading-tight">
              {propertyName}
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full px-4 py-3 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider mb-1">
                  Email Address <span className="text-slate-muted">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg bg-slate-input border border-slate-border/80 text-slate-dark focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider text-sm mt-2"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
