/**
 * Directly By Developers - Verified Locations & Project Matcher
 * 
 * Contains ONLY the 13 actual cities in Navi Mumbai where verified
 * developer projects exist in properties.js.
 */

import { properties } from '../data/properties';

export const ACTUAL_PROJECT_LOCATIONS = [
  {
    name: 'Kharghar',
    aliases: ['kharghar', 'khargar', 'khrghar', 'kargahar', 'upper kharghar', 'kharghr', 'khargad', 'khargharr', 'krghar', 'khargaon']
  },
  {
    name: 'Seawoods',
    aliases: ['seawoods', 'seawods', 'see woods', 'seawood', 'seewoods', 'seawud', 'seawoodss', 'siwoods', 'seaview seawoods']
  },
  {
    name: 'Palm Beach',
    aliases: ['palm beach', 'palmbeach', 'palm beach road', 'plam beach', 'palmbech', 'pbr', 'palme beach', 'palm beech']
  },
  {
    name: 'Panvel',
    aliases: ['panvel', 'panwl', 'penvel', 'panval', 'new panvel', 'panvell', 'panvl', 'panvel station']
  },
  {
    name: 'Vashi',
    aliases: ['vashi', 'vashy', 'washi', 'vassi', 'vashii', 'washy', 'vashi sector', 'vashi station']
  },
  {
    name: 'Nerul',
    aliases: ['nerul', 'nerol', 'nerull', 'nerl', 'nearul', 'nerul west', 'nerul east']
  },
  {
    name: 'Belapur',
    aliases: ['belapur', 'cbd', 'cbd belapur', 'belapure', 'belpur', 'belapoor', 'cbd-belapur']
  },
  {
    name: 'Airoli',
    aliases: ['airoli', 'airoly', 'ayroli', 'airolii', 'eroli', 'ayroly', 'airoly station']
  },
  {
    name: 'Taloja',
    aliases: ['taloja', 'taloj', 'taloga', 'taloza', 'talojha', 'talojaa', 'taloja phase 1', 'taloja phase 2']
  },
  {
    name: 'Juinagar',
    aliases: ['juinagar', 'juinagr', 'juyenagar', 'juinagar station', 'juinagar west']
  },
  {
    name: 'Sanpada',
    aliases: ['sanpada', 'sampada', 'sanpada station', 'sanpadha']
  },
  {
    name: 'Ghansoli',
    aliases: ['ghansoli', 'gansoli', 'ghansoly', 'ghansoli station', 'ghansoli west']
  },
  {
    name: 'Roadpali',
    aliases: ['roadpali', 'rodpali', 'roadpaly', 'roadpalli']
  }
];

// Flat array of valid city names that actually have properties
export const VALID_CITIES = ACTUAL_PROJECT_LOCATIONS.map(l => l.name);

/**
 * Standard Levenshtein distance algorithm for fuzzy typo detection
 */
export function levenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array(an + 1).fill(null).map(() => Array(bn + 1).fill(null));
  for (let i = 0; i <= an; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= bn; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= an; i += 1) {
    for (let j = 1; j <= bn; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[an][bn];
}

/**
 * Normalizes input: removes punctuation, trims, lowercases
 */
export function cleanText(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

/**
 * Smartly evaluates user input string to find if it maps to one of the 13 valid cities.
 * Uses exact match, alias match, and fuzzy typo matching.
 */
export function findMatchedLocation(input) {
  const raw = cleanText(input);
  if (!raw || raw.length < 2) return null;

  const blacklist = new Set([
    'hi', 'hello', 'hey', 'yes', 'no', 'ok', 'okay', 'bhk', 'price', 'flat', 
    'home', 'house', 'project', 'brochure', 'visit', 'site', 'call', 'contact',
    'please', 'help', 'details', 'pricing', 'mumbai', 'thane', 'delhi', 'pune', 'bangalore'
  ]);
  if (blacklist.has(raw)) return null;

  // 1. Direct exact match against official name or aliases
  for (const loc of ACTUAL_PROJECT_LOCATIONS) {
    if (loc.name.toLowerCase() === raw) return loc.name;
    if (loc.aliases.includes(raw)) return loc.name;
  }

  // 2. Whole word match
  for (const loc of ACTUAL_PROJECT_LOCATIONS) {
    for (const alias of loc.aliases) {
      if (alias.length >= 3) {
        const wordRegex = new RegExp(`\\b${alias}\\b`, 'i');
        if (wordRegex.test(raw)) {
          return loc.name;
        }
      }
    }
  }

  // 3. Prefix match (>= 3 chars)
  if (raw.length >= 3) {
    for (const loc of ACTUAL_PROJECT_LOCATIONS) {
      if (loc.name.toLowerCase().startsWith(raw)) return loc.name;
      if (loc.aliases.some(a => a.startsWith(raw))) return loc.name;
    }
  }

  // 4. Fuzzy / Typo matching
  if (raw.length >= 4) {
    let bestMatch = null;
    let minDistance = Infinity;

    for (const loc of ACTUAL_PROJECT_LOCATIONS) {
      for (const alias of loc.aliases) {
        const dist = levenshteinDistance(raw, alias);
        const maxAllowed = raw.length <= 5 ? 1 : 2;
        if (dist <= maxAllowed && dist < minDistance) {
          minDistance = dist;
          bestMatch = loc.name;
        }
      }
    }

    if (bestMatch) {
      return bestMatch;
    }
  }

  return null;
}

/**
 * Returns a list of verified project names for a given city or location.
 * @param {string} locationName
 * @param {number} max
 * @returns {string[]}
 */
export function getProjectsForLocation(locationName, max = 50) {
  if (!locationName) return [];
  const c = cleanText(locationName);

  const matched = properties.filter((p) => {
    const pCity = cleanText(p.city || '');
    const pLoc = cleanText(p.location || '');
    const pName = cleanText(p.name || '');

    if (c === 'palm beach' || c === 'palmbeach' || c === 'palm beach road') {
      return (
        pLoc.includes('palm beach') ||
        pName.includes('palm beach') ||
        pName.includes('pbr') ||
        pCity === 'seawoods' ||
        pCity === 'nerul'
      );
    }

    return pCity === c || pLoc.includes(c) || pName.includes(c);
  });

  const unique = Array.from(new Set(matched.map((p) => p.name)));
  return unique.slice(0, max);
}

/**
 * Checks if user typed input matches a specific project name
 * @param {string} input
 * @param {string|null} locationName
 * @returns {string|null}
 */
export function findMatchedProject(input, locationName = null) {
  if (!input) return null;
  const cleanInput = cleanText(input);
  if (!cleanInput || cleanInput.length < 3) return null;

  const candidateList = locationName 
    ? [
        ...properties.filter(p => cleanText(p.city) === cleanText(locationName) || cleanText(p.location).includes(cleanText(locationName))),
        ...properties
      ]
    : properties;

  for (const p of candidateList) {
    const pNameClean = cleanText(p.name);
    if (pNameClean === cleanInput) return p.name;
    if (cleanInput.includes(pNameClean) || pNameClean.includes(cleanInput)) return p.name;
  }

  if (cleanInput.length >= 4) {
    for (const p of candidateList) {
      const pNameClean = cleanText(p.name);
      if (levenshteinDistance(cleanInput, pNameClean) <= 2) {
        return p.name;
      }
    }
  }

  return null;
}

/**
 * Retrieves full details for a property by name (price, bhk, developer, etc.)
 * @param {string} projectName
 * @returns {object|null}
 */
export function getPropertyDetails(projectName) {
  if (!projectName) return null;
  const cleanInput = cleanText(projectName);
  if (!cleanInput) return null;

  for (const p of properties) {
    if (cleanText(p.name) === cleanInput) return p;
  }
  for (const p of properties) {
    if (cleanText(p.name).includes(cleanInput) || cleanInput.includes(cleanText(p.name))) return p;
  }
  return null;
}
