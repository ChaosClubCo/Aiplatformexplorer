import { useState } from 'react';
import { motion } from 'motion/react';
import { RecommendationScore, UserAnswers } from '../types/recommendation';
import { exportRecommendations } from '../utils/recommendationEngine';

interface RecommendationResultsProps {
  recommendations: RecommendationScore[];
  answers: UserAnswers;
  onRestart: () => void;
  onClose?: () => void;
}

export default function RecommendationResults({
  recommendations,
  answers,
  onRestart,
  onClose
}: RecommendationResultsProps) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const topRecommendations = recommendations.slice(0, 3);
  const otherRecommendations = recommendations.slice(3);

  const getMatchColor = (score: number) => {
    if (score >= 80) return { bg: '#D1FAE5', text: '#059669', border: '#059669' };
    if (score >= 60) return { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
    if (score >= 40) return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
    return { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' };
  };

  const handleExport = () => {
    const json = exportRecommendations(recommendations, answers);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-platform-recommendations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8] py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E88A1D] to-[#D97706] rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                ✨
              </div>
              <div>
                <h1 className="text-4xl font-serif mb-1">Your Personalized Recommendations</h1>
                <p className="text-lg text-[#5C524D]">
                  Based on your {Object.keys(answers).length} answers, here are the best AI platforms for you
                </p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-[#8B8279] hover:text-[#231C19] hover:bg-[#EDE8E3] rounded-lg transition-all"
                aria-label="Close results"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export Results (JSON)
            </button>
            
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Start New Recommendation
            </button>
          </div>
        </motion.div>

        {/* Top 3 Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif mb-4">🏆 Top 3 Recommendations</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {topRecommendations.map((rec, index) => {
              const matchColor = getMatchColor(rec.totalScore);
              const isExpanded = expandedPlatform === rec.platform.id;
              
              return (
                <motion.div
                  key={rec.platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                    index === 0 ? 'ring-2 ring-[#E88A1D]' : 'border border-[#EDE8E3]'
                  }`}
                >
                  {/* Best Match Badge */}
                  {index === 0 && (
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#E88A1D] to-[#D97706] text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                      🏆 Best Match
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Platform Header */}
                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <div className="text-4xl">{rec.platform.logo}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{rec.platform.name}</h3>
                        <p className="text-sm text-[#8B8279]">{rec.platform.provider}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#8B8279] mb-1">Rank</div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E88A1D] to-[#D97706] text-white rounded-full flex items-center justify-center font-bold text-lg">
                          #{rec.rank}
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#5C524D] font-semibold">Overall Match</span>
                        <span className="text-3xl font-serif" style={{ color: matchColor.text }}>
                          {Math.round(rec.totalScore)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#EDE8E3] rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-3 rounded-full"
                          style={{ backgroundColor: matchColor.border }}
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.totalScore}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      
                      {/* Confidence */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[#8B8279]">Confidence:</span>
                        <div className="flex-1 bg-[#EDE8E3] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-[#059669]"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#059669]">
                          {Math.round(rec.confidence)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Breakdown Scores */}
                    <div className="mb-4 space-y-2 pb-4 border-b border-[#EDE8E3]">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5C524D]">Requirements</span>
                        <span className="font-semibold">{Math.round(rec.matchBreakdown.requirements)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5C524D]">Constraints</span>
                        <span className="font-semibold">{Math.round(rec.matchBreakdown.constraints)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5C524D]">Priorities</span>
                        <span className="font-semibold">{Math.round(rec.matchBreakdown.priorities)}%</span>
                      </div>
                    </div>
                    
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <div className="text-xs text-[#8B8279]">Pricing</div>
                        <div className="font-semibold">{rec.platform.pricing}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8B8279]">Market Share</div>
                        <div className="font-semibold">{rec.platform.marketShare}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8B8279]">Implementation</div>
                        <div className="font-semibold">{rec.platform.implementationTime}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8B8279]">Compliance</div>
                        <div className="font-semibold">{rec.platform.complianceCount} certs</div>
                      </div>
                    </div>
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedPlatform(isExpanded ? null : rec.platform.id)}
                      className="w-full px-3 py-2 text-sm text-[#E88A1D] border border-[#E88A1D] rounded-lg hover:bg-[#FEF3E7] transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      {isExpanded ? 'Show Less' : 'Show Details'}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-[#EDE8E3] space-y-4"
                      >
                        {/* Strengths */}
                        {rec.reasons.strengths.length > 0 && (
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-[#5C524D] mb-2 flex items-center gap-2">
                              <span>✅</span> Key Strengths
                            </h4>
                            <ul className="space-y-1">
                              {rec.reasons.strengths.map((strength, i) => (
                                <li key={i} className="text-sm text-[#231C19] flex items-start gap-2">
                                  <span className="text-[#059669] mt-0.5 flex-shrink-0">•</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Concerns */}
                        {rec.reasons.concerns.length > 0 && (
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-[#5C524D] mb-2 flex items-center gap-2">
                              <span>⚠️</span> Considerations
                            </h4>
                            <ul className="space-y-1">
                              {rec.reasons.concerns.map((concern, i) => (
                                <li key={i} className="text-sm text-[#231C19] flex items-start gap-2">
                                  <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">•</span>
                                  <span>{concern}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Differentiators */}
                        {rec.reasons.differentiators.length > 0 && (
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-[#5C524D] mb-2 flex items-center gap-2">
                              <span>⭐</span> Differentiators
                            </h4>
                            <ul className="space-y-1">
                              {rec.reasons.differentiators.map((diff, i) => (
                                <li key={i} className="text-sm text-[#231C19] flex items-start gap-2">
                                  <span className="text-[#3B82F6] mt-0.5 flex-shrink-0">•</span>
                                  <span>{diff}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Platform Description */}
                        <div className="pt-3 border-t border-[#EDE8E3]">
                          <p className="text-sm text-[#5C524D] italic">"{rec.platform.verdict}"</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Other Platforms */}
        {otherRecommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Other Platforms Considered</h2>
            <div className="bg-white border border-[#EDE8E3] rounded-2xl p-6">
              <div className="space-y-3">
                {otherRecommendations.map((rec) => {
                  const matchColor = getMatchColor(rec.totalScore);
                  
                  return (
                    <div
                      key={rec.platform.id}
                      className="flex items-center justify-between p-4 border border-[#EDE8E3] rounded-lg hover:border-[#B5ADA6] transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-[#FAFAFA] rounded-full flex items-center justify-center text-sm font-semibold text-[#8B8279]">
                          #{rec.rank}
                        </div>
                        <div className="text-2xl">{rec.platform.logo}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{rec.platform.name}</h4>
                          <p className="text-sm text-[#8B8279]">{rec.platform.provider}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs text-[#8B8279] mb-1">Match Score</div>
                          <div className="text-2xl font-serif" style={{ color: matchColor.text }}>
                            {Math.round(rec.totalScore)}%
                          </div>
                        </div>
                        
                        <div className="text-sm text-[#5C524D] text-right">
                          <div>{rec.platform.pricing}</div>
                          <div className="text-xs text-[#8B8279]">{rec.platform.implementationTime}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-[#FEF3E7] to-[#FFF8F1] border-2 border-[#E88A1D] rounded-2xl p-8"
        >
          <h3 className="text-2xl font-serif mb-4">🎯 Recommended Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E88A1D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Review Top 3 Platforms</h4>
                <p className="text-sm text-[#5C524D]">
                  Deep dive into the platforms above, focusing on your specific requirements
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E88A1D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Run ROI Calculations</h4>
                <p className="text-sm text-[#5C524D]">
                  Use our ROI Calculator to estimate financial impact for each platform
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E88A1D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Request Demos</h4>
                <p className="text-sm text-[#5C524D]">
                  Contact your top choices for personalized demos and proof-of-concept trials
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E88A1D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Assess Organizational Readiness</h4>
                <p className="text-sm text-[#5C524D]">
                  Ensure your organization is prepared for AI adoption across key dimensions
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {/* Navigate to ROI Calculator */}}
              className="px-6 py-3 bg-[#E88A1D] text-white rounded-lg hover:bg-[#D07614] transition-all font-semibold"
            >
              Calculate ROI
            </button>
            <button
              onClick={() => {/* Navigate to Platform Explorer */}}
              className="px-6 py-3 bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all"
            >
              Compare Platforms
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all"
            >
              📥 Export Full Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
