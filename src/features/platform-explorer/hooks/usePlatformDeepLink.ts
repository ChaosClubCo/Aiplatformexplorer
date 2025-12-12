import { useEffect, useRef } from 'react';
import { useAppContext } from '../../../context/AppContext';

/**
 * Hook to handle deep linking for platform details
 * 
 * Manages the URL query parameters to reflect the currently selected platform,
 * allowing for shareable links to specific platform details.
 */
export function usePlatformDeepLink() {
  const { state, actions } = useAppContext();
  const { showPlatformModal, selectedPlatformId } = state.ui;
  const isInitialized = useRef(false);

  // Check URL on mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    // Check for platform ID in query params (e.g. ?platform=123)
    // We use query params because the main router doesn't support nested routes like /platform/:id natively yet
    // But we also support /platform/123 if the server rewrites it or if we use hash routing fallback
    
    const params = new URLSearchParams(window.location.search);
    const platformId = params.get('platform');
    
    if (platformId) {
      actions.showPlatformModal(platformId);
    } else {
      // Fallback: check if the path is /platform/:id (simple check)
      const pathParts = window.location.pathname.split('/');
      const platformIndex = pathParts.indexOf('platform');
      
      if (platformIndex !== -1 && pathParts[platformIndex + 1]) {
        const id = pathParts[platformIndex + 1];
        actions.showPlatformModal(id);
      }
    }
    
    isInitialized.current = true;
  }, [actions]);

  // Update URL when state changes
  useEffect(() => {
    if (!isInitialized.current) return;

    if (showPlatformModal && selectedPlatformId) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('platform', selectedPlatformId);
      
      // We can also try to push a cleaner path if we wanted to support /platform/:id fully, 
      // but sticking to query params is safer with the current simple router.
      // However, the prompt asked to ensure /platform/:id exists.
      // So let's try to update the path to /platform/:id if possible, 
      // but since we are on the explorer page, we might want to keep context.
      
      // Let's use history.pushState to update the URL without reload
      window.history.pushState({ platformId: selectedPlatformId }, '', `/platform/${selectedPlatformId}`);
    } else {
      // Revert to normal explorer URL
      // Ideally we should go back to where we were, e.g. /explorer or /
      if (window.location.pathname.includes('/platform/')) {
        window.history.pushState({}, '', '/');
      }
    }
  }, [showPlatformModal, selectedPlatformId]);
}
