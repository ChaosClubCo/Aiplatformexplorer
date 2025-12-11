/**
 * Event-to-Toast Integration Hook
 * 
 * @description Automatically shows toasts for domain events
 * @module hooks/useEventToasts
 * @version 2.0.0
 * @updated 2024-12-11 - Fixed subscription cleanup and payload access
 */

import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { globalEventBus, DomainEvents } from '../core';

/**
 * Hook that subscribes to domain events and shows toasts
 * 
 * @example
 * ```tsx
 * function App() {
 *   useEventToasts();
 *   return <div>App content</div>;
 * }
 * ```
 */
export function useEventToasts() {
  const { showToast } = useToast();

  useEffect(() => {
    // Subscribe to error events
    const errorSubscription = globalEventBus.on(DomainEvents.ERROR_OCCURRED, (event) => {
      try {
        // Safely access the error from the event payload
        const errorPayload = event.payload;
        const error = errorPayload?.error as Error;
        const message = error?.message || String(error) || 'An error occurred';
        
        showToast(message, 'error', 7000);
      } catch (err) {
        console.error('[useEventToasts] Error handling ERROR_OCCURRED event:', err, event);
        showToast('An unexpected error occurred', 'error', 7000);
      }
    });

    // Subscribe to platform selection events
    const platformSelectedSubscription = globalEventBus.on(
      DomainEvents.PLATFORM_SELECTED,
      (event) => {
        try {
          const platformName = event.payload?.platformName || 'platform';
          showToast(`Selected ${platformName}`, 'info', 3000);
        } catch (err) {
          console.error('[useEventToasts] Error handling PLATFORM_SELECTED event:', err);
        }
      }
    );

    // Subscribe to comparison events
    const comparisonSubscription = globalEventBus.on(
      DomainEvents.COMPARISON_GENERATED,
      (event) => {
        try {
          const platformCount = event.payload?.platforms?.length || 0;
          showToast(`Comparing ${platformCount} platforms`, 'success', 4000);
        } catch (err) {
          console.error('[useEventToasts] Error handling COMPARISON_GENERATED event:', err);
        }
      }
    );

    // Subscribe to recommendation events
    const recommendationSubscription = globalEventBus.on(
      DomainEvents.RECOMMENDATION_GENERATED,
      (event) => {
        try {
          const recCount = event.payload?.recommendations?.length || 0;
          showToast(`Found ${recCount} recommended platforms`, 'success', 4000);
        } catch (err) {
          console.error('[useEventToasts] Error handling RECOMMENDATION_GENERATED event:', err);
        }
      }
    );

    // Subscribe to export events
    const exportSubscription = globalEventBus.on(
      DomainEvents.DATA_EXPORTED,
      (event) => {
        try {
          const format = event.payload?.format?.toUpperCase() || 'file';
          showToast(`Exported data as ${format}`, 'success', 3000);
        } catch (err) {
          console.error('[useEventToasts] Error handling DATA_EXPORTED event:', err);
        }
      }
    );

    // Subscribe to ROI calculation events
    const roiSubscription = globalEventBus.on(
      DomainEvents.ROI_CALCULATED,
      () => {
        try {
          showToast('ROI calculation complete', 'success', 3000);
        } catch (err) {
          console.error('[useEventToasts] Error handling ROI_CALCULATED event:', err);
        }
      }
    );

    // Clean up subscriptions on unmount
    return () => {
      try {
        errorSubscription.unsubscribe();
        platformSelectedSubscription.unsubscribe();
        comparisonSubscription.unsubscribe();
        recommendationSubscription.unsubscribe();
        exportSubscription.unsubscribe();
        roiSubscription.unsubscribe();
      } catch (err) {
        console.error('[useEventToasts] Error during cleanup:', err);
      }
    };
  }, [showToast]);
}