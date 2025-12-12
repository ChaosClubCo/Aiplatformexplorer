/**
 * AI Recommendations Page
 * 
 * @description Recommendation wizard for AI platforms
 * @module pages/Recommendations
 */

import React, { useEffect } from 'react';
import { Container } from '../components/layouts/MainLayout';
import { analyticsService } from '../services/analyticsService';
import { useAppContext } from '../context/AppContext';
import { RecommendationWizard } from '../features/recommendation-engine';

/**
 * Recommendations Page Component
 * 
 * @returns {JSX.Element} Recommendations page
 */
export default function Recommendations(): JSX.Element {
  const { state } = useAppContext();
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('recommendations');
  }, []);
  
  return (
    <Container className="py-8">
      <RecommendationWizard platforms={state.platforms.all} />
    </Container>
  );
}
