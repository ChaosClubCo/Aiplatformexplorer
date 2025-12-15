import { Platform } from '../types';

export const PLATFORMS_DATA: Platform[] = [
  // ENTERPRISE FOUNDATION (2 - PRIMARY)
  {
    id: 'copilot',
    name: "Microsoft Copilot",
    provider: "Microsoft",
    providerKey: "microsoft",
    logo: "🪟",
    category: "enterprise",
    categoryLabel: "Primary Platform (M365)",
    model: "GPT-4 (OpenAI)",
    marketShare: "70–90% F500",
    marketSharePercent: 85,
    contextWindow: "128K tokens",
    contextTokens: 128000,
    focus: "M365 Ecosystem Integration",
    pricing: "$30/user/month",
    pricingValue: 30,
    pricingNotes: "M365 E3/E5 Add-on",
    compliance: ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "FedRAMP"],
    complianceCount: 5,
    dataResidency: "Global, EU, US",
    multimodal: "Yes",
    intPriority: "PRIMARY",
    intPriorityClass: "primary",
    intRecommendation: "Sales, Finance, IT - Best for M365-centric orgs",
    growthRate: 30,
    implementationTime: "2-4 weeks",
    scores: {
      codeGeneration: 7, // GitHub Copilot is separate but related
      creativeWriting: 7,
      dataAnalysis: 10, // Excel integration is top-tier
      customerService: 7,
      complianceWork: 8,
      agentCapabilities: 8, // Copilot Studio
      apiAccess: 9,
      customization: 7,
      multilingual: 8,
      reasoning: 8
    },
    strengths: [
      "Native M365 integration (Word, Excel, Teams)",
      "Enterprise security & data residency",
      "GitHub Copilot for devs (55% faster)",
      "Dynamics 365 CRM automation"
    ],
    useCases: [
      "Automated CRM Data Enrichment",
      "Dynamic Proposal Generation",
      "Sales Call Intelligence",
      "Financial Report Automation"
    ],
    officialUrl: "https://www.microsoft.com/microsoft-copilot",
    description: "Optimal for M365 organizations. Proven 5,857% ROI for sales teams.",
    verdict: "Primary Choice for M365 Shops"
  },
  {
    id: 'gemini',
    name: "Google Gemini Enterprise",
    provider: "Google",
    providerKey: "google",
    logo: "🔍",
    category: "enterprise",
    categoryLabel: "Primary Platform (Workspace)",
    model: "Gemini 1.5 Pro",
    marketShare: "80% F500 (Cloud)",
    marketSharePercent: 80,
    contextWindow: "2M tokens",
    contextTokens: 2000000,
    focus: "Multimodal & Multilingual",
    pricing: "$20-30/user/month",
    pricingValue: 30,
    pricingNotes: "Integrated with Workspace",
    compliance: ["SOC 2", "ISO 27001", "GDPR", "HIPAA"],
    complianceCount: 4,
    dataResidency: "Global, EU",
    multimodal: "Yes (Best-in-Class)",
    intPriority: "PRIMARY",
    intPriorityClass: "primary",
    intRecommendation: "Marketing, Customer Service - Best for Workspace orgs",
    growthRate: 35,
    implementationTime: "2-4 weeks",
    scores: {
      codeGeneration: 9,
      creativeWriting: 8,
      dataAnalysis: 9,
      customerService: 10, // Multilingual excellence
      complianceWork: 7,
      agentCapabilities: 8,
      apiAccess: 9,
      customization: 8,
      multilingual: 10, // 100+ languages
      reasoning: 9
    },
    strengths: [
      "2M token context window",
      "Superior multilingual (100+ langs)",
      "Native Workspace integration",
      "Real-time web search"
    ],
    useCases: [
      "Multilingual Tier-1 Deflection",
      "Real-Time Meeting Translation",
      "Marketing Analytics Interpretation",
      "Cross-Platform Deal Management"
    ],
    officialUrl: "https://cloud.google.com/gemini",
    description: "Optimal for Google Workspace orgs. Unmatched for multilingual support.",
    verdict: "Primary Choice for Google Shops"
  },
  // SPECIALIZED CAPABILITIES (3 - SECONDARY)
  {
    id: 'chatgpt',
    name: "ChatGPT Enterprise",
    provider: "OpenAI",
    providerKey: "openai",
    logo: "🤖",
    category: "specialized",
    categoryLabel: "Creative Specialist",
    model: "GPT-4o",
    marketShare: "92% F500",
    marketSharePercent: 92,
    contextWindow: "128K tokens",
    contextTokens: 128000,
    focus: "Creativity & Ideation",
    pricing: "$60/user/month",
    pricingValue: 60,
    pricingNotes: "Enterprise Tier",
    compliance: ["SOC 2", "ISO 27001", "GDPR", "HIPAA"],
    complianceCount: 4,
    dataResidency: "US, EU",
    multimodal: "Yes",
    intPriority: "SECONDARY",
    intPriorityClass: "secondary",
    intRecommendation: "Marketing, HR, Strategy - Creative workflows",
    growthRate: 45,
    implementationTime: "1-2 weeks",
    scores: {
      codeGeneration: 8,
      creativeWriting: 10, // Benchmark leader
      dataAnalysis: 8,
      customerService: 9,
      complianceWork: 7,
      agentCapabilities: 9, // Custom GPTs
      apiAccess: 10,
      customization: 9,
      multilingual: 8,
      reasoning: 9
    },
    strengths: [
      "Superior creative content generation",
      "Advanced reasoning & problem solving",
      "Custom GPTs for specialized workflows",
      "High adoption/familiarity"
    ],
    useCases: [
      "Multi-Channel Campaign Development",
      "Dynamic Personalization at Scale",
      "Job Description Optimization",
      "Strategic Planning Synthesis"
    ],
    officialUrl: "https://openai.com/enterprise",
    description: "The creative engine. Best for Marketing, HR, and Strategy.",
    verdict: "Essential for Creative Teams"
  },
  {
    id: 'claude',
    name: "Anthropic Claude",
    provider: "Anthropic",
    providerKey: "anthropic",
    logo: "🛡️",
    category: "specialized",
    categoryLabel: "Compliance Specialist",
    model: "Claude 3.5 Sonnet",
    marketShare: "45% F500",
    marketSharePercent: 45,
    contextWindow: "200K tokens",
    contextTokens: 200000,
    focus: "Safety, Compliance, Analysis",
    pricing: "$20/user/month",
    pricingValue: 20,
    pricingNotes: "Pro Tier (Enterprise Negotiable)",
    compliance: ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "CCPA"],
    complianceCount: 5,
    dataResidency: "US, EU",
    multimodal: "Yes",
    intPriority: "SECONDARY",
    intPriorityClass: "secondary",
    intRecommendation: "Legal, InfoSec, Compliance - High-risk workflows",
    growthRate: 60,
    implementationTime: "2-3 weeks",
    scores: {
      codeGeneration: 9, // Legacy code modernization
      creativeWriting: 8,
      dataAnalysis: 9,
      customerService: 8,
      complianceWork: 10, // Benchmark leader
      agentCapabilities: 8,
      apiAccess: 9,
      customization: 8,
      multilingual: 8,
      reasoning: 10 // Constitutional AI
    },
    strengths: [
      "Industry-leading 200K context",
      "Constitutional AI (Safety First)",
      "Reduced hallucination rates",
      "Complex document analysis"
    ],
    useCases: [
      "Full Contract Review",
      "SOC 2 Audit Preparation",
      "M&A Due Diligence",
      "Regulatory Compliance Monitoring"
    ],
    officialUrl: "https://www.anthropic.com/claude",
    description: "The compliance officer's choice. Best for Legal and InfoSec.",
    verdict: "Critical for Regulated Industries"
  },
  {
    id: 'perplexity',
    name: "Perplexity Enterprise",
    provider: "Perplexity",
    providerKey: "perplexity",
    logo: "🔎",
    category: "specialized",
    categoryLabel: "Research Specialist",
    model: "Hybrid (GPT-4 + Claude + Llama)",
    marketShare: "Rapid Growth",
    marketSharePercent: 15,
    contextWindow: "128K tokens",
    contextTokens: 128000,
    focus: "Real-time Research & Citations",
    pricing: "$20/user/month",
    pricingValue: 20,
    pricingNotes: "Pro Tier",
    compliance: ["SOC 2"],
    complianceCount: 2,
    dataResidency: "US",
    multimodal: "Limited",
    intPriority: "SECONDARY",
    intPriorityClass: "secondary",
    intRecommendation: "Strategy, Research, Competitive Intel",
    growthRate: 450,
    implementationTime: "1 week",
    scores: {
      codeGeneration: 5,
      creativeWriting: 7,
      dataAnalysis: 7,
      customerService: 6,
      complianceWork: 5,
      agentCapabilities: 4,
      apiAccess: 6,
      customization: 4,
      multilingual: 6,
      reasoning: 8
    },
    strengths: [
      "Real-time web search with citations",
      "Transparent source attribution",
      "Rapid research synthesis",
      "Academic/Professional research"
    ],
    useCases: [
      "Competitive Intelligence Dashboard",
      "Real-time Market Analysis",
      "Fact Verification",
      "Literature Review"
    ],
    officialUrl: "https://www.perplexity.ai/",
    description: "The researcher's best friend. Best for Strategy and Competitive Intel.",
    verdict: "Unbeatable for Research"
  }
];
