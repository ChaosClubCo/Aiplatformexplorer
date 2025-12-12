/**
 * Persona Generator Page
 * 
 * @description Persona creation interface
 * @module pages/PersonaGenerator
 */

import React, { useEffect } from 'react';
import { Container } from '../components/layouts/MainLayout';
import { analyticsService } from '../services/analyticsService';
import { PersonaGenerator as PersonaGeneratorFeature } from '../features/user-personas';

/**
 * Persona Generator Page Component
 * 
 * @returns {JSX.Element} Persona Generator page
 */
export default function PersonaGenerator(): JSX.Element {
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('persona-generator');
  }, []);
  
  return (
    <Container className="py-8">
      <PersonaGeneratorFeature />
    </Container>
  );
}
