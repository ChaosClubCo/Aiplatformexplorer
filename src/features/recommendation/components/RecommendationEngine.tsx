import React from 'react';
import { motion } from 'motion/react';
import { useRecommendationEngine } from '../hooks/useRecommendationEngine';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

// Types for UI mapping (could be moved to constants)
const DEPARTMENTS = [
  { id: 'sales', label: 'Sales & Revenue' },
  { id: 'marketing', label: 'Marketing & Brand' },
  { id: 'engineering', label: 'Engineering & R&D' },
  { id: 'legal', label: 'Legal & Compliance' },
  { id: 'hr', label: 'Human Resources' },
];

const CAPABILITIES = [
  { id: 'code_generation', label: 'Code Generation' },
  { id: 'content_creation', label: 'Content Creation' },
  { id: 'data_analysis', label: 'Data Analysis' },
  { id: 'customer_support', label: 'Customer Support' },
  { id: 'legal_review', label: 'Legal Review' },
];

interface Props {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function RecommendationEngine({ onToast }: Props) {
  const { loading, results, inputs, actions } = useRecommendationEngine(onToast);

  if (results) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif text-[#231C19]">Strategic Recommendations</h2>
          <Button variant="outline" onClick={actions.reset}>Start Over</Button>
        </div>

        <div className="grid gap-4">
          {results.map((result, idx) => (
            <Card key={result.platformId} className="p-6 border-l-4 border-l-[#E88A1D]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold capitalize">{result.platformId}</h3>
                  <p className="text-[#5C524D] mt-1">{result.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#E88A1D]">{result.score}%</div>
                  <div className="text-xs uppercase tracking-wider text-[#8B8279]">Fit Score</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-[#231C19]">Platform Intelligence Engine</h2>
        <p className="text-[#5C524D]">Identify the optimal AI infrastructure for your specific organizational needs.</p>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
          
          {/* Department Selection */}
          <section>
            <h3 className="text-lg font-semibold mb-4">1. Primary Department</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => actions.setDepartment(dept.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    inputs.department === dept.id 
                      ? 'bg-[#E88A1D] text-white border-[#E88A1D] shadow-md' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#E88A1D]'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </section>

          {/* Capabilities Selection */}
          <section>
            <h3 className="text-lg font-semibold mb-4">2. Required Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map(cap => (
                <button
                  key={cap.id}
                  onClick={() => actions.toggleCapability(cap.id)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                    inputs.capabilities.includes(cap.id)
                      ? 'bg-[#231C19] text-white border-[#231C19]'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cap.label}
                </button>
              ))}
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={actions.generateRecommendations}
              disabled={loading || !inputs.department}
              className="w-full h-12 text-lg bg-[#E88A1D] hover:bg-[#D97706] text-white"
            >
              {loading ? 'Analyzing...' : 'Generate Strategic Analysis'}
            </Button>
            {!inputs.department && (
              <p className="text-center text-xs text-red-500 mt-2">Please select a department to continue</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
