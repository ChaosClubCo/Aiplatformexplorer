import { PersonaTemplate } from '../model/types';
import { exportService } from '../../../services';

export const generateMarkdown = (persona: PersonaTemplate): string => {
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

export const downloadMarkdown = (persona: PersonaTemplate) => {
  const markdown = generateMarkdown(persona);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `persona-${persona.name.toLowerCase().replace(/\s+/g, '-')}.md`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportPersonaJson = async (persona: PersonaTemplate) => {
  await exportService.export(persona, {
    format: 'json',
    filename: `persona-${persona.name.toLowerCase().replace(/\s+/g, '-')}`,
    pretty: true,
    includeMetadata: true,
  });
};
