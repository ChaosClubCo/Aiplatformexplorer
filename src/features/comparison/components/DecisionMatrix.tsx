import React, { useMemo } from 'react';
import { Platform } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { WeightControls } from './WeightControls';
import { motion } from 'motion/react';
import { Crown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DecisionMatrixProps {
  platforms: Platform[];
}

export function DecisionMatrix({ platforms }: DecisionMatrixProps) {
  const { state } = useAppContext();
  const { weights } = state.preferences;

  // Calculate Weighted Scores
  const scoredPlatforms = useMemo(() => {
    return platforms.map(platform => {
      // 1. Capabilities Score (0-100)
      // Average of all capability scores * 10
      const capabilitiesRaw = Object.values(platform.scores).reduce((a, b) => a + b, 0) / Object.keys(platform.scores).length;
      const capabilitiesScore = capabilitiesRaw * 10;

      // 2. Security Score (0-100)
      // Base 50 + 10 for each compliance cert, max 100
      const complianceCount = platform.compliance.length;
      const securityScore = Math.min(100, 50 + (complianceCount * 15));

      // 3. Cost Score (0-100)
      // Inverse of pricing. Assuming max price reference is $60. 
      // $0 = 100, $30 = 50, $60+ = 0.
      const maxPriceRef = 60;
      const costScore = Math.max(0, 100 - ((platform.pricingValue / maxPriceRef) * 100));

      // 4. Customization Score (0-100)
      // Using specific scores if available, else average of relevant ones
      const customizationRaw = platform.scores['customization'] || 5;
      const customizationScore = customizationRaw * 10;

      // Apply User Weights (normalized to 100% total if needed, but simple sum is easier for relative comparison)
      // We assume user weights are 0-100 integers.
      const totalWeight = (weights.capabilities + weights.security + weights.cost + weights.customization) || 1;
      
      const weightedScore = (
        (capabilitiesScore * weights.capabilities) +
        (securityScore * weights.security) +
        (costScore * weights.cost) +
        (customizationScore * weights.customization)
      ) / totalWeight;

      return {
        ...platform,
        scoresCalculated: {
          capabilities: capabilitiesScore,
          security: securityScore,
          cost: costScore,
          customization: customizationScore,
          total: weightedScore
        }
      };
    }).sort((a, b) => b.scoresCalculated.total - a.scoresCalculated.total);
  }, [platforms, weights]);

  const winner = scoredPlatforms[0];

  return (
    <div className="space-y-6">
      <WeightControls />

      {/* Winner Banner */}
      {winner && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#FFF8F0] to-white border border-[#E88A1D]/20 rounded-xl p-6 flex items-center gap-6 shadow-sm"
        >
          <div className="bg-[#E88A1D]/10 p-4 rounded-full">
            <Crown className="w-8 h-8 text-[#E88A1D]" />
          </div>
          <div>
            <div className="text-sm text-[#8B8279] uppercase tracking-wider font-semibold mb-1">Recommended Choice</div>
            <h3 className="text-2xl font-serif text-[#231C19]">
              {winner.name} 
              <span className="text-lg font-sans font-normal text-[#5C524D] ml-2">
                ({winner.scoresCalculated.total.toFixed(1)} / 100)
              </span>
            </h3>
            <p className="text-sm text-[#5C524D] mt-1 max-w-xl">
              Based on your custom weighting, <strong>{winner.name}</strong> offers the best balance of 
              {weights.capabilities > 60 ? ' capabilities' : ''}
              {weights.cost > 60 ? ' cost efficiency' : ''}
              {weights.security > 60 ? ' security' : ''}.
            </p>
          </div>
        </motion.div>
      )}

      {/* Decision Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EDE8E3]">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#FAFAFA] text-[#5C524D] uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Platform</th>
              <th className="px-6 py-4 font-semibold text-center">
                Total Score
              </th>
              <th className="px-6 py-4 font-semibold text-center text-blue-600">
                Capabilities <span className="block text-[10px] opacity-70">({weights.capabilities}%)</span>
              </th>
              <th className="px-6 py-4 font-semibold text-center text-green-600">
                Security <span className="block text-[10px] opacity-70">({weights.security}%)</span>
              </th>
              <th className="px-6 py-4 font-semibold text-center text-orange-600">
                Cost <span className="block text-[10px] opacity-70">({weights.cost}%)</span>
              </th>
              <th className="px-6 py-4 font-semibold text-center text-purple-600">
                Customization <span className="block text-[10px] opacity-70">({weights.customization}%)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE8E3] bg-white">
            {scoredPlatforms.map((platform, idx) => (
              <tr key={platform.id} className={idx === 0 ? "bg-[#FFF8F0]/30" : ""}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.logo}</span>
                    <div>
                      <div className="font-medium text-[#231C19]">{platform.name}</div>
                      <div className="text-xs text-[#8B8279]">{platform.provider}</div>
                    </div>
                    {idx === 0 && <Crown className="w-4 h-4 text-[#E88A1D] ml-2" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-block px-3 py-1 bg-[#231C19] text-white rounded-lg font-bold">
                    {platform.scoresCalculated.total.toFixed(1)}
                  </div>
                </td>
                
                {/* Capabilities */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{platform.scoresCalculated.capabilities.toFixed(0)}</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${platform.scoresCalculated.capabilities}%` }} />
                    </div>
                  </div>
                </td>

                {/* Security */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{platform.scoresCalculated.security.toFixed(0)}</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${platform.scoresCalculated.security}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{platform.compliance.length} certs</div>
                  </div>
                </td>

                {/* Cost */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{platform.scoresCalculated.cost.toFixed(0)}</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${platform.scoresCalculated.cost}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">${platform.pricingValue}</div>
                  </div>
                </td>

                {/* Customization */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{platform.scoresCalculated.customization.toFixed(0)}</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${platform.scoresCalculated.customization}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
