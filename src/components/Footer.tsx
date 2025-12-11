interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#262626] text-[#A3A3A3] py-8 mt-16">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E88A1D] to-[#D97706] rounded-lg flex items-center justify-center text-white text-sm">
              AI
            </div>
            <div className="text-sm">
              INT Inc. AI Platform Explorer v3.1
              <br />
              <span className="text-xs opacity-70">
                Built for enterprise AI adoption decisions • 16 platforms • 30+ features
              </span>
            </div>
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('glossary')}
              className="text-sm text-[#A3A3A3] hover:text-white transition-colors"
            >
              Sources
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
