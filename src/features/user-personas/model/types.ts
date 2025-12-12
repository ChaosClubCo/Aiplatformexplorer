/**
 * User Persona Types
 */

export interface PersonaTemplate {
  // Profile
  name: string;
  age: number;
  role: string;
  company: string;
  companySize: string;
  location: string;
  experience: string;
  teamSize: string;
  budgetAuthority: string;
  
  // Background
  background: string;
  
  // Goals & Objectives
  primaryGoals: string[];
  successMetrics: string[];
  
  // Pain Points
  painPoints: Array<{
    title: string;
    description: string;
  }>;
  
  // Technical Requirements
  mustHave: string[];
  niceToHave: string[];
  dealBreakers: string[];
  
  // User Journey
  discoveryPhase: string[];
  evaluationPhase: string[];
  decisionPhase: string[];
  
  // Behavioral Patterns
  behavioralPatterns: string[];
  
  // Decision Criteria
  decisionCriteria: Array<{
    criteria: string;
    weight: number;
  }>;
  
  // Quotes
  quotes: string[];
  
  // Technology Stack
  currentlyUsing: string[];
  preferredPlatforms: string[];
}
