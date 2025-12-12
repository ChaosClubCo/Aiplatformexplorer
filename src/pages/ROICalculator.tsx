/**
 * ROI Calculator Page
 * 
 * @description ROI Calculator interface
 * @module pages/ROICalculator
 */

import React, { useEffect } from 'react';
import { Container, PageHeader } from '../components/layouts/MainLayout';
import { analyticsService } from '../services/analyticsService';
import { useEventToasts } from '../hooks/useEventToasts';
import { ROICalculator as ROICalculatorFeature } from '../features/roi-calculator';
import { useAppContext } from '../context/AppContext';

/**
 * ROI Calculator Page Component
 * 
 * @returns {JSX.Element} ROI Calculator page
 */
export default function ROICalculator(): JSX.Element {
  const { actions } = useAppContext();
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('roi-calculator');
  }, []);

  const handleToast = (message: string, type: 'success' | 'warning' | 'error') => {
    // Dispatch toast event
    const event = new CustomEvent('app:toast', {
      detail: {
        message,
        type,
        duration: 3000
      }
    });
    window.dispatchEvent(event);
  };
  
  return (
    <Container className="py-8">
      <ROICalculatorFeature onToast={handleToast} />
    </Container>
  );
}
