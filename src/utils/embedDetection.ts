/**
 * Utility functions for detecting iframe embedding and managing embed mode
 */

/**
 * Check if the current page is loaded inside an iframe
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to cross-origin, we're definitely in an iframe
    return true;
  }
}

/**
 * Check if the URL has an embed parameter
 */
export function hasEmbedParam(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const params = new URLSearchParams(window.location.search);
  return params.get('embed') === 'true' || params.get('mode') === 'embed';
}

/**
 * Check if we should show minimal UI (embed mode)
 */
export function isEmbedMode(): boolean {
  return isInIframe() || hasEmbedParam();
}

/**
 * Get embed configuration from URL parameters
 */
export function getEmbedConfig() {
  if (typeof window === 'undefined') {
    return {
      hideHeader: true,
      hideFooter: false,
      hideStepper: false,
      compact: false,
    };
  }
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    hideHeader: params.get('hideHeader') !== 'false', // Hide by default in embed mode
    hideFooter: params.get('hideFooter') === 'true',
    hideStepper: params.get('hideStepper') === 'true',
    compact: params.get('compact') === 'true',
  };
}
