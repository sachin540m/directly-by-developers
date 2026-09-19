/**
 * Directly By Developers - Central Reusable Lead Submission Service
 *
 * Securely submits customer enquiries to the backend Hostinger SMTP API endpoint.
 * Features:
 * - Configurable API endpoint via Vite environment variable (VITE_LEAD_API_URL)
 * - Safe fallback to relative '/api/submit-lead.php' for same-domain deployments
 * - Request timeout handling via AbortController (12s limit)
 * - In-flight duplicate prevention / debounce
 * - LocalStorage backup persistence
 * - Comprehensive network and HTTP error handling
 * - Clean boolean resolution for backward compatibility with existing form handlers
 *
 * @param {Object} leadData - Object containing name, phone, email, message, formType, etc.
 * @returns {Promise<boolean>} Resolves true ONLY when the backend confirms email delivery.
 */

// In-flight submission tracker to prevent accidental rapid double-clicks
const activeSubmissions = new Set();
const REQUEST_TIMEOUT_MS = 12000;

export async function submitLead(leadData) {
  const result = await submitLeadDetailed(leadData);
  return Boolean(result && result.success);
}

/**
 * Detailed submission handler returning full response metadata.
 *
 * @param {Object} leadData
 * @returns {Promise<{success: boolean, message: string, errors?: Object}>}
 */
export async function submitLeadDetailed(leadData) {
  if (!leadData || typeof leadData !== 'object') {
    console.error('[submitLead] Invalid lead data provided');
    return { success: false, message: 'Invalid lead data provided.' };
  }

  // 1. In-flight duplicate prevention check
  const submissionKey = `${leadData.phone || ''}_${leadData.formType || ''}_${leadData.name || ''}`;
  if (activeSubmissions.has(submissionKey)) {
    console.warn('[submitLead] Submission already in progress, skipping duplicate.');
    return { success: false, message: 'Submission already in progress. Please wait a moment.' };
  }
  activeSubmissions.add(submissionKey);

  // 2. Persist lead data to LocalStorage as a local backup
  try {
    const existing = JSON.parse(localStorage.getItem('dbd_captured_leads') || '[]');
    const leadSnapshot = {
      ...leadData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    existing.push(leadSnapshot);
    // Keep max 100 recent leads in storage to prevent quota limits
    if (existing.length > 100) existing.shift();
    localStorage.setItem('dbd_captured_leads', JSON.stringify(existing));
  } catch (e) {
    console.warn('[submitLead] LocalStorage backup warning:', e);
  }

  // 3. Resolve API Endpoint from environment or default path
  const endpoint = import.meta.env?.VITE_LEAD_API_URL || '/api/submit-lead.php';

  // 4. Enrich payload with browser metadata and bot honeypot
  const payload = {
    ...leadData,
    currentUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageSource: typeof window !== 'undefined' ? (document.title || window.location.pathname) : '',
    _gotcha: '', // Honeypot field (must stay empty)
  };

  // 5. Setup AbortController for network timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let result = null;
    const responseText = await response.text();

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error('[submitLead] Backend returned non-JSON response:', responseText.slice(0, 200));
      return {
        success: false,
        message: 'Unexpected server response format. Please try again later.'
      };
    }

    if (!response.ok || !result || result.success !== true) {
      const errorMsg = result?.message || `Server returned error (${response.status})`;
      console.error('[submitLead] Submission rejected by server:', errorMsg, result?.errors);
      return {
        success: false,
        message: errorMsg,
        errors: result?.errors || null
      };
    }

    // Update LocalStorage status to delivered on success
    try {
      const existing = JSON.parse(localStorage.getItem('dbd_captured_leads') || '[]');
      if (existing.length > 0) {
        existing[existing.length - 1].status = 'delivered';
        localStorage.setItem('dbd_captured_leads', JSON.stringify(existing));
      }
    } catch (e) {
      // Non-blocking
    }

    return {
      success: true,
      message: result.message || 'Enquiry submitted successfully.',
      data: result.data || null
    };

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('[submitLead] Request timed out after', REQUEST_TIMEOUT_MS, 'ms');
      return {
        success: false,
        message: 'Request timed out. Please check your connection and try again.'
      };
    }
    console.error('[submitLead] Network or connection error:', err.message);
    return {
      success: false,
      message: 'Network connection error. Please check your connection and try again.'
    };
  } finally {
    // Release in-flight lock after small cooldown to allow subsequent legitimate submissions
    setTimeout(() => {
      activeSubmissions.delete(submissionKey);
    }, 1500);
  }
}
