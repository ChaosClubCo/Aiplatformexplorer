/**
 * User Persona Template Generator
 * Production-grade persona creation tool
 * 
 * @module features/user-personas/PersonaGenerator
 */

import React, { useState } from 'react';
import { Download, Users, Plus, Trash2, Copy, FileText } from 'lucide-react';
import { exportService } from '../../services';

/**
 * Persona template interface
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

/**
 * Default persona template
 */
const defaultPersona: PersonaTemplate = {
  name: '',
  age: 35,
  role: '',
  company: '',
  companySize: '',
  location: '',
  experience: '',
  teamSize: '',
  budgetAuthority: '',
  background: '',
  primaryGoals: [''],
  successMetrics: [''],
  painPoints: [{ title: '', description: '' }],
  mustHave: [''],
  niceToHave: [''],
  dealBreakers: [''],
  discoveryPhase: [''],
  evaluationPhase: [''],
  decisionPhase: [''],
  behavioralPatterns: [''],
  decisionCriteria: [{ criteria: '', weight: 0 }],
  quotes: [''],
  currentlyUsing: [''],
  preferredPlatforms: [''],
};

/**
 * Persona template library
 */
const personaTemplates = {
  enterprise: {
    name: 'Enterprise AI Architect',
    role: 'Senior AI Architect',
    company: 'Fortune 500 Company',
    companySize: '10,000+ employees',
    budgetAuthority: '$1M+',
    primaryGoals: [
      'Select enterprise-grade AI platform',
      'Ensure regulatory compliance',
      'Build scalable infrastructure',
    ],
    mustHave: ['SOC2', 'GDPR', 'SSO', 'Enterprise SLA'],
    dealBreakers: ['No compliance certifications', 'Consumer-grade only'],
  },
  startup: {
    name: 'Startup CTO',
    role: 'Co-founder & CTO',
    company: 'Early-stage Startup',
    companySize: '10-50 employees',
    budgetAuthority: '$50K-$200K',
    primaryGoals: [
      'Find cost-effective solution',
      'Move fast and iterate',
      'Optimize developer experience',
    ],
    mustHave: ['Pay-as-you-go pricing', 'Good documentation', 'API access'],
    dealBreakers: ['Long-term contracts', 'Enterprise-only pricing'],
  },
  technical: {
    name: 'ML Engineer',
    role: 'Machine Learning Engineer',
    company: 'Tech Company',
    companySize: '500-5,000 employees',
    budgetAuthority: '$100K-$500K',
    primaryGoals: [
      'Access advanced technical features',
      'High performance and reliability',
      'Custom model support',
    ],
    mustHave: ['API access', 'Fine-tuning', 'High context window'],
    dealBreakers: ['Limited technical capabilities', 'Poor API performance'],
  },
  business: {
    name: 'Product Manager',
    role: 'Product Manager',
    company: 'SaaS Company',
    companySize: '100-1,000 employees',
    budgetAuthority: '$200K-$500K',
    primaryGoals: [
      'Demonstrate clear ROI',
      'Easy integration',
      'Improve product capabilities',
    ],
    mustHave: ['Clear ROI', 'Good documentation', 'Customer success'],
    dealBreakers: ['Unclear pricing', 'Poor integration support'],
  },
  compliance: {
    name: 'Compliance Officer',
    role: 'Chief Compliance Officer',
    company: 'Regulated Industry',
    companySize: '1,000-10,000 employees',
    budgetAuthority: 'Review authority',
    primaryGoals: [
      'Ensure regulatory compliance',
      'Verify security standards',
      'Mitigate risk',
    ],
    mustHave: ['Industry certifications', 'Audit logs', 'Data sovereignty'],
    dealBreakers: ['Missing certifications', 'Unclear compliance'],
  },
};

/**
 * Persona Generator Component
 */
export function PersonaGenerator() {
  const [persona, setPersona] = useState<PersonaTemplate>(defaultPersona);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Update field
  const updateField = (field: keyof PersonaTemplate, value: any) => {
    setPersona(prev => ({ ...prev, [field]: value }));
  };
  
  // Update array item
  const updateArrayItem = (field: keyof PersonaTemplate, index: number, value: string) => {
    setPersona(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item),
    }));
  };
  
  // Add array item
  const addArrayItem = (field: keyof PersonaTemplate) => {
    setPersona(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), ''],
    }));
  };
  
  // Remove array item
  const removeArrayItem = (field: keyof PersonaTemplate, index: number) => {
    setPersona(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };
  
  // Load template
  const loadTemplate = (templateKey: string) => {
    const template = personaTemplates[templateKey as keyof typeof personaTemplates];
    if (template) {
      setPersona(prev => ({
        ...prev,
        ...template,
        age: 35,
        location: '',
        experience: '',
        teamSize: '',
        background: '',
        successMetrics: [''],
        painPoints: [{ title: '', description: '' }],
        niceToHave: [''],
        discoveryPhase: [''],
        evaluationPhase: [''],
        decisionPhase: [''],
        behavioralPatterns: [''],
        decisionCriteria: [{ criteria: '', weight: 0 }],
        quotes: [''],
        currentlyUsing: [''],
        preferredPlatforms: [''],
      }));
      setSelectedTemplate(templateKey);
    }
  };
  
  // Export persona
  const handleExport = async () => {
    await exportService.export(persona, {
      format: 'json',
      filename: `persona-${persona.name.toLowerCase().replace(/\s+/g, '-')}`,
      pretty: true,
      includeMetadata: true,
    });
  };
  
  // Generate markdown
  const generateMarkdown = (): string => {
    return `# User Persona: ${persona.name}

## 👤 Profile

**Name:** ${persona.name}  
**Age:** ${persona.age}  
**Role:** ${persona.role}  
**Company:** ${persona.company} (${persona.companySize})  
**Location:** ${persona.location}  
**Experience:** ${persona.experience}  
**Team Size:** ${persona.teamSize}  
**Budget Authority:** ${persona.budgetAuthority}  

## 📋 Background

${persona.background}

## 🎯 Goals & Objectives

**Primary Goals:**
${persona.primaryGoals.map(g => `- ${g}`).join('\n')}

**Success Metrics:**
${persona.successMetrics.map(m => `- ${m}`).join('\n')}

## 😓 Pain Points

${persona.painPoints.map((p, i) => `${i + 1}. **${p.title}:** ${p.description}`).join('\n')}

## 🔧 Technical Requirements

**Must Have:**
${persona.mustHave.map(h => `- ${h}`).join('\n')}

**Nice to Have:**
${persona.niceToHave.map(h => `- ${h}`).join('\n')}

**Deal Breakers:**
${persona.dealBreakers.map(d => `- ${d}`).join('\n')}

## 🚀 User Journey

**Discovery Phase:**
${persona.discoveryPhase.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Evaluation Phase:**
${persona.evaluationPhase.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Decision Phase:**
${persona.decisionPhase.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## 🎭 Behavioral Patterns

${persona.behavioralPatterns.map(p => `- ${p}`).join('\n')}

## 📊 Decision Criteria

${persona.decisionCriteria.map(c => `- **${c.criteria}** (${c.weight}%)`).join('\n')}

## 💬 Quotes

${persona.quotes.map(q => `> "${q}"`).join('\n\n')}

## 💻 Technology Stack

**Currently Using:**
${persona.currentlyUsing.map(t => `- ${t}`).join('\n')}

**Preferred Platforms:**
${persona.preferredPlatforms.map(p => `- ${p}`).join('\n')}
`;
  };
  
  // Export as markdown
  const handleExportMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `persona-${persona.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  // Reset form
  const handleReset = () => {
    setPersona(defaultPersona);
    setSelectedTemplate('');
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">User Persona Generator</h1>
          <p className="text-gray-600">
            Create detailed user personas for AI platform evaluation
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FileText className="w-4 h-4" />
            Export Markdown
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <Trash2 className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl mb-4">Start with a Template</h2>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(personaTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedTemplate === key
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-sm text-center">{template.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl mb-4">👤 Profile</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={persona.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Emily Chen"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              value={persona.age}
              onChange={(e) => updateField('age', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Role</label>
            <input
              type="text"
              value={persona.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Senior AI Architect"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Company</label>
            <input
              type="text"
              value={persona.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Fortune 500 Financial Services"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Company Size</label>
            <input
              type="text"
              value={persona.companySize}
              onChange={(e) => updateField('companySize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 10,000+ employees"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              value={persona.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., New York, NY"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Experience</label>
            <input
              type="text"
              value={persona.experience}
              onChange={(e) => updateField('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 15 years in technology"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Team Size</label>
            <input
              type="text"
              value={persona.teamSize}
              onChange={(e) => updateField('teamSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Team of 25"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm mb-1">Budget Authority</label>
            <input
              type="text"
              value={persona.budgetAuthority}
              onChange={(e) => updateField('budgetAuthority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., $5M+ annually"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Background</label>
          <textarea
            value={persona.background}
            onChange={(e) => updateField('background', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="Describe the persona's professional background and context..."
          />
        </div>
      </div>
      
      {/* Goals Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl mb-4">🎯 Goals & Success Metrics</h2>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm">Primary Goals</label>
            <button
              onClick={() => addArrayItem('primaryGoals')}
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              + Add Goal
            </button>
          </div>
          {persona.primaryGoals.map((goal, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => updateArrayItem('primaryGoals', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter primary goal..."
              />
              {persona.primaryGoals.length > 1 && (
                <button
                  onClick={() => removeArrayItem('primaryGoals', index)}
                  className="px-3 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm">Success Metrics</label>
            <button
              onClick={() => addArrayItem('successMetrics')}
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              + Add Metric
            </button>
          </div>
          {persona.successMetrics.map((metric, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={metric}
                onChange={(e) => updateArrayItem('successMetrics', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter success metric..."
              />
              {persona.successMetrics.length > 1 && (
                <button
                  onClick={() => removeArrayItem('successMetrics', index)}
                  className="px-3 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Technical Requirements */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl mb-4">🔧 Technical Requirements</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm">Must Have</label>
              <button
                onClick={() => addArrayItem('mustHave')}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                + Add
              </button>
            </div>
            {persona.mustHave.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('mustHave', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Required feature..."
                />
                {persona.mustHave.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('mustHave', index)}
                    className="px-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm">Nice to Have</label>
              <button
                onClick={() => addArrayItem('niceToHave')}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                + Add
              </button>
            </div>
            {persona.niceToHave.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('niceToHave', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Optional feature..."
                />
                {persona.niceToHave.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('niceToHave', index)}
                    className="px-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm">Deal Breakers</label>
              <button
                onClick={() => addArrayItem('dealBreakers')}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                + Add
              </button>
            </div>
            {persona.dealBreakers.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('dealBreakers', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Deal breaker..."
                />
                {persona.dealBreakers.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('dealBreakers', index)}
                    className="px-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quotes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl">💬 Quotes</h2>
          <button
            onClick={() => addArrayItem('quotes')}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            + Add Quote
          </button>
        </div>
        {persona.quotes.map((quote, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={quote}
              onChange={(e) => updateArrayItem('quotes', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="Enter a representative quote from this persona..."
            />
            {persona.quotes.length > 1 && (
              <button
                onClick={() => removeArrayItem('quotes', index)}
                className="px-3 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl mb-4">📄 Preview</h2>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
          {generateMarkdown()}
        </pre>
      </div>
    </div>
  );
}

export default PersonaGenerator;
