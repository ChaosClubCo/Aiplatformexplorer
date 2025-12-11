export default function Glossary() {
  const terms = [
    {
      term: 'Agentic AI',
      definition: 'AI systems that can autonomously plan, execute, and adapt to accomplish complex tasks without continuous human guidance.'
    },
    {
      term: 'Context Window',
      definition: 'The maximum number of tokens (words/characters) an AI model can process in a single request.'
    },
    {
      term: 'Constitutional AI',
      definition: "Anthropic's approach to AI safety where models are trained to follow a set of principles ('constitution') for safe behavior."
    },
    {
      term: 'Fine-tuning',
      definition: 'Training a pre-existing AI model on specific data to customize it for particular use cases.'
    },
    {
      term: 'Foundation Model',
      definition: 'Large AI models trained on broad data that can be adapted for many downstream tasks.'
    },
    {
      term: 'Multimodal',
      definition: 'AI systems that can process multiple types of input (text, images, audio, video).'
    },
    {
      term: 'RAG (Retrieval-Augmented Generation)',
      definition: 'Technique combining AI generation with information retrieval from external knowledge bases.'
    },
    {
      term: 'Token',
      definition: 'The basic unit of text processing in AI models, roughly equivalent to 3/4 of a word.'
    },
    {
      term: 'Pilot Purgatory',
      definition: 'When organizations remain stuck in experimentation phase without scaling AI to production.'
    },
    {
      term: 'TCO (Total Cost of Ownership)',
      definition: 'Complete cost including licensing, implementation, training, and ongoing maintenance.'
    }
  ];

  const sources = [
    {
      name: 'McKinsey State of AI 2025',
      url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
      description: 'Annual global survey of 1,993 organizations across 105 countries'
    },
    {
      name: 'Larridin State of Enterprise AI 2025',
      url: 'https://larridin.com/state-of-enterprise-ai-2025',
      description: 'Enterprise AI adoption and productivity benchmarks'
    },
    {
      name: 'LSE/Protiviti AI Productivity Study 2024',
      url: 'https://www.protiviti.com/us-en/survey/ai-job-productivity-survey',
      description: 'Impact of AI training on knowledge worker productivity'
    },
    {
      name: 'Axis Intelligence Enterprise AI Tools 2025',
      url: 'https://axis-intelligence.com/best-enterprise-ai-tools-2025-comparison/',
      description: 'Fortune 500 AI deployment analysis and ROI benchmarks'
    },
    {
      name: 'Gartner Top Strategic Technology Trends 2025',
      url: 'https://www.gartner.com/en/articles/gartner-top-10-strategic-technology-trends-for-2025',
      description: 'Agentic AI and enterprise technology predictions'
    },
    {
      name: 'Christian & Timbers F500 AI Adoption',
      url: 'https://www.christianandtimbers.com/insights/chatgpt-reached-92-of-the-fortune-500-in-24-months',
      description: 'ChatGPT adoption rates among Fortune 500'
    },
    {
      name: 'Snowflake/ESG AI ROI Report 2025',
      url: 'https://www.snowflake.com/resource/ai-roi-report/',
      description: 'Return on investment benchmarks for AI deployments'
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2 font-serif">Glossary & Research Sources</h2>
        <p className="text-lg text-[#5C524D]">
          Comprehensive definitions and verified research sources powering this analysis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b-2 border-[#E88A1D]">Key Terms</h3>
          <dl className="grid gap-4">
            {terms.map((item, i) => (
              <div key={i} className="mb-4">
                <dt className="text-[#231C19] mb-1">{item.term}</dt>
                <dd className="text-sm text-[#5C524D] mt-1">{item.definition}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="text-lg mb-4 pb-2 border-b-2 border-[#E88A1D]">Research Sources</h3>
          <ul className="grid gap-3">
            {sources.map((source, i) => (
              <li key={i} className="p-3 bg-[#FAFAFA] rounded-lg">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#231C19] hover:text-[#E88A1D] transition-colors"
                >
                  {source.name}
                </a>
                <p className="text-xs text-[#8B8279] mt-1">{source.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
