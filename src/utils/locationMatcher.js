/**
 * Directly By Developers - Verified Locations & Project Matcher
 * 
 * Contains ONLY the 13 actual cities in Navi Mumbai where verified
 * developer projects exist in properties.js.
 */

import { properties } from '../data/properties.js';
import { commercialProperties } from '../data/commercialProperties.js';

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
    name: 'Palm Beach Road',
    aliases: ['palm beach road', 'palm beach', 'palmbeach', 'plam beach', 'palmbech', 'pbr', 'palme beach', 'palm beech']
  },
  {
    name: 'Thane-Belapur Road',
    aliases: [
      'thane-belapur road', 'thane belapur road', 'thanebelapur road',
      'thane belapur', 'thane-belapur', 'thanebelapur',
      'tb road', 'tb-road', 'belapur road', 'thane belapur rd'
    ]
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
    name: 'Kopar Khairane',
    aliases: [
      'kopar khairane', 'koper khairane', 'koparkhairane', 'koperkhairane',
      'kopar khairne', 'koper khairne', 'koparkhairne', 'kopar kherane',
      'koper kherane', 'kopar station', 'koparkhairane station'
    ]
  },
  {
    name: 'Ulwe',
    aliases: [
      'ulwe', 'ulwa', 'ulve', 'ulway', 'ulwe node', 'coastal road ulwe',
      'bamandongri', 'kharkopar', 'ulwe sector'
    ]
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

// Verified projects directly on or within 1-2 minutes of Palm Beach Road
export const PALM_BEACH_ROAD_IDS = [
  '9-pbr-adani',
  'sai-palm-view',
  'delta-palm-beach-seawoods',
  'palm-amore-seawoods',
  'sai-green-gold',
  'platinum-oakwoods-seawoods',
  'pioneer-the-view',
  'godrej-eternal-palms',
  'godrej-bayview',
  'arihant-advika',
  'sun-view-heights-vashi',
  'metricon-gateway-vashi'
];

// Verified projects directly on or within 1-2 minutes of Thane-Belapur Road
export const THANE_BELAPUR_ROAD_IDS = [
  'sai-world-one',
  'aurum-q-islands-ghansoli',
  'raheja-lunaris',
  'raheja-jade-city',
  'raheja-wtc',
  'raheja-atlantis',
  'today-citadil-juinagar',
  'delta-tricity-airoli',
  'birla-taranya-airoli',
  'eden-garden-airoli',
  'delta-new-palm-beach-airoli'
];

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
 * Normalizes input: removes punctuation, trims, lowercases, maps hyphens to spaces
 */
export function cleanText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
    if (loc.aliases.some(a => cleanText(a) === raw || a.toLowerCase() === raw)) return loc.name;
  }

  // 2. Whole word match
  for (const loc of ACTUAL_PROJECT_LOCATIONS) {
    for (const alias of loc.aliases) {
      if (alias.length >= 3) {
        const wordRegex = new RegExp(`\\b${alias.replace(/[-_]/g, '[-_\\s]?')}\\b`, 'i');
        if (wordRegex.test(input) || wordRegex.test(raw)) {
          return loc.name;
        }
      }
    }
  }

  // 3. Prefix match (>= 3 chars)
  if (raw.length >= 3) {
    for (const loc of ACTUAL_PROJECT_LOCATIONS) {
      if (cleanText(loc.name).startsWith(raw)) return loc.name;
      if (loc.aliases.some(a => cleanText(a).startsWith(raw))) return loc.name;
    }
  }

  // 4. Fuzzy / Typo matching
  if (raw.length >= 4) {
    let bestMatch = null;
    let minDistance = Infinity;

    for (const loc of ACTUAL_PROJECT_LOCATIONS) {
      for (const alias of loc.aliases) {
        const cleanAlias = cleanText(alias);
        const dist = levenshteinDistance(raw, cleanAlias);
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
  const rawLower = (locationName || '').toLowerCase().trim();

  const isPbr = 
    c.includes('palm beach') || 
    c.includes('palmbeach') || 
    c === 'pbr' || 
    rawLower.includes('palm beach');

  const isTbr = 
    c.includes('thane belapur') || 
    c.includes('thanebelapur') || 
    c.includes('tb road') || 
    rawLower.includes('thane-belapur') ||
    rawLower.includes('thane belapur');

  if (isPbr) {
    const map = new Map(properties.map((p) => [p.id, p]));
    return PALM_BEACH_ROAD_IDS.map((id) => map.get(id)).filter(Boolean).map((p) => p.name).slice(0, max);
  }

  if (isTbr) {
    const map = new Map(properties.map((p) => [p.id, p]));
    return THANE_BELAPUR_ROAD_IDS.map((id) => map.get(id)).filter(Boolean).map((p) => p.name).slice(0, max);
  }

  const matched = properties.filter((p) => {
    const pCity = cleanText(p.city || '');
    const pLoc = cleanText(p.location || '');
    const pName = cleanText(p.name || '');
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

// ==========================================
// COMMERCIAL LOCATIONS & MATCHING LOGIC
// ==========================================

export const ACTUAL_COMMERCIAL_LOCATIONS = [
  {
    name: 'Vashi',
    aliases: ['vashi', 'sector 30a', 'vashi station', 'vashi midc', 'washi']
  },
  {
    name: 'Turbhe',
    aliases: ['turbhe', 'turbhe midc', 'turbe', 'turbhe station', 'turbhe commercial']
  },
  {
    name: 'Nerul',
    aliases: ['nerul', 'nerul midc', 'nerul station', 'nerol']
  },
  {
    name: 'Juinagar',
    aliases: ['juinagar', 'juinagr', 'juinagar station', 'sion panvel highway juinagar']
  },
  {
    name: 'Airoli',
    aliases: ['airoli', 'airoly', 'airoli station', 'thane belapur airoli']
  },
  {
    name: 'Mahape',
    aliases: ['mahape', 'mbp', 'millennium business park', 'mahape midc', 'millenium']
  },
  {
    name: 'Digha',
    aliases: ['digha', 'digha station', 'bkc 2', 'bkc2', 'bkc 2 digha']
  },
  {
    name: 'Rabale',
    aliases: ['rabale', 'rabale midc', 'rabale station']
  },
  {
    name: 'Koparkhairane',
    aliases: ['koparkhairane', 'koperkhairne', 'koparkhairane midc', 'koperkhairane', 'koper khairane']
  }
];

export const VALID_COMMERCIAL_CITIES = ACTUAL_COMMERCIAL_LOCATIONS.map((l) => l.name);

/**
 * Smartly evaluates user input string to find if it maps to a commercial hub
 */
export function findMatchedCommercialLocation(input) {
  const raw = cleanText(input);
  if (!raw || raw.length < 2) return null;

  for (const loc of ACTUAL_COMMERCIAL_LOCATIONS) {
    if (loc.name.toLowerCase() === raw) return loc.name;
    if (loc.aliases.some((a) => cleanText(a) === raw || a.toLowerCase() === raw)) return loc.name;
  }

  for (const loc of ACTUAL_COMMERCIAL_LOCATIONS) {
    for (const alias of loc.aliases) {
      if (alias.length >= 3) {
        const wordRegex = new RegExp(`\\b${alias.replace(/[-_]/g, '[-_\\s]?')}\\b`, 'i');
        if (wordRegex.test(input) || wordRegex.test(raw)) {
          return loc.name;
        }
      }
    }
  }

  if (raw.length >= 3) {
    for (const loc of ACTUAL_COMMERCIAL_LOCATIONS) {
      if (cleanText(loc.name).startsWith(raw)) return loc.name;
      if (loc.aliases.some((a) => cleanText(a).startsWith(raw))) return loc.name;
    }
  }

  return null;
}

/**
 * Returns commercial projects for a given location
 */
export function getCommercialProjectsForLocation(locationName, max = 50) {
  if (!locationName) return [];
  const c = cleanText(locationName);

  const matched = commercialProperties.filter((p) => {
    const pCity = cleanText(p.city || '');
    const pLoc = cleanText(p.location || '');
    const pName = cleanText(p.name || '');
    return pCity === c || pLoc.includes(c) || pName.includes(c);
  });

  const unique = Array.from(new Set(matched.map((p) => p.name)));
  return unique.slice(0, max);
}

/**
 * Checks if user input matches a commercial project name
 */
export function findMatchedCommercialProject(input, locationName = null) {
  if (!input) return null;
  const cleanInput = cleanText(input);
  if (!cleanInput || cleanInput.length < 3) return null;

  const candidateList = locationName
    ? [
        ...commercialProperties.filter(
          (p) => cleanText(p.city) === cleanText(locationName) || cleanText(p.location).includes(cleanText(locationName))
        ),
        ...commercialProperties
      ]
    : commercialProperties;

  for (const p of candidateList) {
    const pNameClean = cleanText(p.name);
    if (pNameClean === cleanInput) return p.name;
    if (cleanInput.includes(pNameClean) || pNameClean.includes(cleanInput)) return p.name;
  }

  return null;
}

/**
 * Retrieves commercial property details
 */
export function getCommercialPropertyDetails(projectName) {
  if (!projectName) return null;
  const cleanInput = cleanText(projectName);
  if (!cleanInput) return null;

  for (const p of commercialProperties) {
    if (cleanText(p.name) === cleanInput) return p;
  }
  for (const p of commercialProperties) {
    if (cleanText(p.name).includes(cleanInput) || cleanInput.includes(cleanText(p.name))) return p;
  }
  return null;
}

