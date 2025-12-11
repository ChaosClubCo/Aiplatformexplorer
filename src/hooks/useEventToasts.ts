/**
 * Event-to-Toast Integration Hook
 * 
 * @description Automatically shows toasts for domain events
 * @module hooks/useEventToasts
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
    const errorUnsubscribe = globalEventBus.on(DomainEvents.ERROR_OCCURRED, (payload) => {
      const error = payload.error as Error;
      showToast(
        error.message || 'An error occurred',
        'error',
        7000
      );
    });

    // Subscribe to platform selection events
    const platformSelectedUnsubscribe = globalEventBus.on(
      DomainEvents.PLATFORM_SELECTED,
      (payload) => {
        showToast(
          `Selected ${payload.platformName}`,
          'info',
          3000
        );
      }
    );

    // Subscribe to comparison events
    const comparisonUnsubscribe = globalEventBus.on(
      DomainEvents.COMPARISON_GENERATED,
      (payload) => {
        showToast(
          `Comparing ${payload.platforms.length} platforms`,
          'success',
          4000
        );
      }
    );

    // Subscribe to recommendation events
    const recommendationUnsubscribe = globalEventBus.on(
      DomainEvents.RECOMMENDATION_GENERATED,
      (payload) => {
        showToast(
          `Found ${payload.recommendations.length} recommended platforms`,
          'success',
          4000
        );
      }
    );

    // Subscribe to export events
    const exportUnsubscribe = globalEventBus.on(
      DomainEvents.DATA_EXPORTED,
      (payload) => {
        showToast(
          `Exported data as ${payload.format.toUpperCase()}`,
          'success',
          3000
        );
      }
    );

    // Subscribe to ROI calculation events
    const roiUnsubscribe = globalEventBus.on(
      DomainEvents.ROI_CALCULATED,
      () => {
        showToast(
          'ROI calculation complete',
          'success',
          3000
        );
      }
    );

    // Clean up subscriptions
    return () => {
      errorUnsubscribe();
      platformSelectedUnsubscribe();
      comparisonUnsubscribe();
      recommendationUnsubscribe();
      exportUnsubscribe();
      roiUnsubscribe();
    };
  }, [showToast]);
}
