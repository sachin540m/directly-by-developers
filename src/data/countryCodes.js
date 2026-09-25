/**
 * Directly By Developers - International Country Dialing Codes & Validation
 *
 * Supported country codes, official flag URLs (FlagCDN for cross-platform visual consistency),
 * and country-specific mobile number regex patterns.
 */

export const COUNTRY_CODES = [
  { 
    code: '+91', 
    country: 'IN', 
    name: 'India', 
    label: 'India (+91)', 
    flag: '🇮🇳',
    flagUrl: 'https://flagcdn.com/w40/in.png',
    pattern: /^[6-9]\d{9}$/,
    example: '9876543210',
    minDigits: 10,
    maxDigits: 10,
    hint: '10 digits starting with 6, 7, 8, or 9'
  },
  { 
    code: '+971', 
    country: 'AE', 
    name: 'UAE', 
    label: 'UAE (+971)', 
    flag: '🇦🇪',
    flagUrl: 'https://flagcdn.com/w40/ae.png',
    pattern: /^5\d{8}$/,
    example: '501234567',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 5 (e.g., 50, 52, 54, 55, 56, 58)'
  },
  { 
    code: '+1', 
    country: 'US', 
    name: 'USA / Canada', 
    label: 'USA / Canada (+1)', 
    flag: '🇺🇸',
    flagUrl: 'https://flagcdn.com/w40/us.png',
    pattern: /^[2-9]\d{9}$/,
    example: '2025550199',
    minDigits: 10,
    maxDigits: 10,
    hint: '10 digits starting with 2-9'
  },
  { 
    code: '+44', 
    country: 'GB', 
    name: 'UK', 
    label: 'UK (+44)', 
    flag: '🇬🇧',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    pattern: /^7\d{9}$/,
    example: '7911123456',
    minDigits: 10,
    maxDigits: 10,
    hint: '10 digits starting with 7'
  },
  { 
    code: '+65', 
    country: 'SG', 
    name: 'Singapore', 
    label: 'Singapore (+65)', 
    flag: '🇸🇬',
    flagUrl: 'https://flagcdn.com/w40/sg.png',
    pattern: /^[89]\d{7}$/,
    example: '81234567',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 8 or 9'
  },
  { 
    code: '+966', 
    country: 'SA', 
    name: 'Saudi Arabia', 
    label: 'Saudi Arabia (+966)', 
    flag: '🇸🇦',
    flagUrl: 'https://flagcdn.com/w40/sa.png',
    pattern: /^5\d{8}$/,
    example: '512345678',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 5'
  },
  { 
    code: '+974', 
    country: 'QA', 
    name: 'Qatar', 
    label: 'Qatar (+974)', 
    flag: '🇶🇦',
    flagUrl: 'https://flagcdn.com/w40/qa.png',
    pattern: /^[3567]\d{7}$/,
    example: '33123456',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 3, 5, 6, or 7'
  },
  { 
    code: '+968', 
    country: 'OM', 
    name: 'Oman', 
    label: 'Oman (+968)', 
    flag: '🇴🇲',
    flagUrl: 'https://flagcdn.com/w40/om.png',
    pattern: /^[79]\d{7}$/,
    example: '91234567',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 7 or 9'
  },
  { 
    code: '+965', 
    country: 'KW', 
    name: 'Kuwait', 
    label: 'Kuwait (+965)', 
    flag: '🇰🇼',
    flagUrl: 'https://flagcdn.com/w40/kw.png',
    pattern: /^[569]\d{7}$/,
    example: '51234567',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 5, 6, or 9'
  },
  { 
    code: '+973', 
    country: 'BH', 
    name: 'Bahrain', 
    label: 'Bahrain (+973)', 
    flag: '🇧🇭',
    flagUrl: 'https://flagcdn.com/w40/bh.png',
    pattern: /^[36]\d{7}$/,
    example: '36123456',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 3 or 6'
  },
  { 
    code: '+61', 
    country: 'AU', 
    name: 'Australia', 
    label: 'Australia (+61)', 
    flag: '🇦🇺',
    flagUrl: 'https://flagcdn.com/w40/au.png',
    pattern: /^4\d{8}$/,
    example: '412345678',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 4'
  },
  { 
    code: '+49', 
    country: 'DE', 
    name: 'Germany', 
    label: 'Germany (+49)', 
    flag: '🇩🇪',
    flagUrl: 'https://flagcdn.com/w40/de.png',
    pattern: /^1[567]\d{8,9}$/,
    example: '15123456789',
    minDigits: 10,
    maxDigits: 11,
    hint: '10-11 digits starting with 15, 16, or 17'
  },
  { 
    code: '+33', 
    country: 'FR', 
    name: 'France', 
    label: 'France (+33)', 
    flag: '🇫🇷',
    flagUrl: 'https://flagcdn.com/w40/fr.png',
    pattern: /^[67]\d{8}$/,
    example: '612345678',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 6 or 7'
  },
  { 
    code: '+60', 
    country: 'MY', 
    name: 'Malaysia', 
    label: 'Malaysia (+60)', 
    flag: '🇲🇾',
    flagUrl: 'https://flagcdn.com/w40/my.png',
    pattern: /^1\d{8,9}$/,
    example: '123456789',
    minDigits: 9,
    maxDigits: 10,
    hint: '9-10 digits starting with 1'
  },
  { 
    code: '+27', 
    country: 'ZA', 
    name: 'South Africa', 
    label: 'South Africa (+27)', 
    flag: '🇿🇦',
    flagUrl: 'https://flagcdn.com/w40/za.png',
    pattern: /^[678]\d{8}$/,
    example: '712345678',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 6, 7, or 8'
  },
  { 
    code: '+64', 
    country: 'NZ', 
    name: 'New Zealand', 
    label: 'New Zealand (+64)', 
    flag: '🇳🇿',
    flagUrl: 'https://flagcdn.com/w40/nz.png',
    pattern: /^2\d{7,9}$/,
    example: '212345678',
    minDigits: 8,
    maxDigits: 10,
    hint: '8-10 digits starting with 2'
  },
  { 
    code: '+41', 
    country: 'CH', 
    name: 'Switzerland', 
    label: 'Switzerland (+41)', 
    flag: '🇨🇭',
    flagUrl: 'https://flagcdn.com/w40/ch.png',
    pattern: /^7[5-9]\d{7}$/,
    example: '791234567',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 7'
  },
  { 
    code: '+81', 
    country: 'JP', 
    name: 'Japan', 
    label: 'Japan (+81)', 
    flag: '🇯🇵',
    flagUrl: 'https://flagcdn.com/w40/jp.png',
    pattern: /^[789]0\d{8}$/,
    example: '9012345678',
    minDigits: 10,
    maxDigits: 10,
    hint: '10 digits starting with 70, 80, or 90'
  },
  { 
    code: '+852', 
    country: 'HK', 
    name: 'Hong Kong', 
    label: 'Hong Kong (+852)', 
    flag: '🇭🇰',
    flagUrl: 'https://flagcdn.com/w40/hk.png',
    pattern: /^[569]\d{7}$/,
    example: '51234567',
    minDigits: 8,
    maxDigits: 8,
    hint: '8 digits starting with 5, 6, or 9'
  },
  { 
    code: '+353', 
    country: 'IE', 
    name: 'Ireland', 
    label: 'Ireland (+353)', 
    flag: '🇮🇪',
    flagUrl: 'https://flagcdn.com/w40/ie.png',
    pattern: /^8[3-9]\d{7}$/,
    example: '851234567',
    minDigits: 9,
    maxDigits: 9,
    hint: '9 digits starting with 8'
  },
];

export const DEFAULT_COUNTRY_CODE = '+91';

export const getCountryByCode = (code) => {
  return COUNTRY_CODES.find(c => c.code === code) || COUNTRY_CODES[0];
};

/**
 * Validates a phone number against selected country or auto-detects from '+' prefix.
 * Also checks if the number format belongs to a different country (e.g. UAE number entered with India selected).
 *
 * @param {string} rawInput - user entered phone text
 * @param {string} selectedCode - currently selected dialing code (e.g. '+91')
 * @returns {object} { isValid: boolean, fullNumber?: string, country?: object, suggestedCountry?: object, errorMsg?: string }
 */
export const validatePhoneNumber = (rawInput, selectedCode = DEFAULT_COUNTRY_CODE) => {
  if (!rawInput) {
    return { isValid: false, errorMsg: 'Please enter your mobile number.' };
  }

  const trimmed = rawInput.trim();

  // 1. If user typed explicit '+' international number (e.g. "+971501234567" or "+91 9876543210")
  if (trimmed.startsWith('+')) {
    const digitsOnly = trimmed.replace(/\D/g, '');
    for (const country of COUNTRY_CODES) {
      const codeDigits = country.code.replace('+', '');
      if (digitsOnly.startsWith(codeDigits)) {
        const nationalPart = digitsOnly.substring(codeDigits.length);
        if (country.pattern && !country.pattern.test(nationalPart)) {
          return {
            isValid: false,
            detectedCountry: country,
            errorMsg: `Invalid ${country.name} number. ${country.name} numbers should have ${country.hint} (e.g., ${country.example}).`
          };
        }
        return {
          isValid: true,
          fullNumber: `${country.code} ${nationalPart}`,
          country: country
        };
      }
    }
  }

  // 2. Clean digits for national comparison
  let cleanDigits = trimmed.replace(/\D/g, '');

  // Strip leading 0 if present (e.g., 09876543210 or 0501234567)
  if (cleanDigits.startsWith('0') && cleanDigits.length > 8) {
    cleanDigits = cleanDigits.substring(1);
  }

  // Find selected country
  const selectedCountry = getCountryByCode(selectedCode);

  // Check if matches selected country
  if (selectedCountry.pattern.test(cleanDigits)) {
    return {
      isValid: true,
      fullNumber: `${selectedCountry.code} ${cleanDigits}`,
      country: selectedCountry
    };
  }

  // If failed, check if user entered a number belonging to another supported country!
  for (const otherCountry of COUNTRY_CODES) {
    if (otherCountry.code !== selectedCountry.code) {
      if (otherCountry.pattern.test(cleanDigits)) {
        return {
          isValid: false,
          suggestedCountry: otherCountry,
          errorMsg: `This number looks like a ${otherCountry.name} (${otherCountry.code}) number. Please select ${otherCountry.name} from the country dropdown, or enter a valid ${selectedCountry.name} number (${selectedCountry.hint}).`
        };
      }
    }
  }

  // Standard failure message for selected country
  return {
    isValid: false,
    errorMsg: `Please enter a valid mobile number for ${selectedCountry.name} (${selectedCountry.hint}, e.g. ${selectedCountry.example}). Or select your country code from the dropdown.`
  };
};
