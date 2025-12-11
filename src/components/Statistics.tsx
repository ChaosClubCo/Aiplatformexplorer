export default function Statistics() {
  const stats = [
    {
      value: '88%',
      label: 'Enterprise AI Adoption',
      source: '(McKinsey 2025)'
    },
    {
      value: '$8.7K–$18K',
      label: 'Savings/Employee/Year',
      source: '(Larridin; LSE/Protiviti)',
      isRange: true
    },
    {
      value: '6%',
      label: 'Achieve High-Performer Status',
      source: '(McKinsey 2025)'
    },
    {
      value: '62%',
      label: 'Experimenting with AI Agents',
      source: '(McKinsey 2025)'
    }
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-[#EDE8E3] rounded-xl p-5 hover:border-[#B5ADA6] hover:shadow-md transition-all"
        >
          <div className={`text-2xl text-[#231C19] mb-1 font-serif ${stat.isRange ? 'text-[#E88A1D]' : ''}`}>
            {stat.value}
          </div>
          <div className="text-sm text-[#5C524D] mb-3">{stat.label}</div>
          <div className="flex items-center gap-2 text-xs text-[#8B8279]">
            <span className="italic">{stat.source}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
