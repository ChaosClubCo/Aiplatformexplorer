import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Slider } from '../../../components/ui/slider';
import { intelligenceService } from '../../../services/intelligenceService';
import { RecommendationRequirements, MatchResult } from '../../../types/intelligence';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export function RecommendationWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  
  const [reqs, setReqs] = useState<RecommendationRequirements>({
    budget: { maxAnnual: 100000, currency: 'USD' },
    users: { count: 50, type: 'mixed' },
    compliance: [],
    features: [],
    techStack: []
  });

  const handleMatch = async () => {
    setLoading(true);
    // Simulate thinking time
    await new Promise(r => setTimeout(r, 1500));
    const data = await intelligenceService.getRecommendations(reqs);
    setResults(data);
    setLoading(false);
    setStep(4);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 1: Organizational Profile</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Estimated Annual Budget ($)</label>
        <div className="flex items-center gap-4">
          <Slider 
            max={500000} 
            step={10000} 
            value={[reqs.budget.maxAnnual]} 
            onValueChange={(v) => setReqs({...reqs, budget: {...reqs.budget, maxAnnual: v[0]}})}
          />
          <span className="font-mono">${reqs.budget.maxAnnual.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">User Base Size</label>
         <Slider 
            max={1000} 
            step={10} 
            value={[reqs.users.count]} 
            onValueChange={(v) => setReqs({...reqs, users: {...reqs.users, count: v[0]}})}
          />
          <span className="font-mono">{reqs.users.count} users</span>
      </div>
      <Button onClick={() => setStep(2)} className="w-full mt-4">Next: Compliance</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Compliance Requirements</h3>
      <div className="grid grid-cols-2 gap-4">
        {['soc2', 'hipaa', 'gdpr', 'iso27001'].map((c) => (
          <div key={c} className="flex items-center space-x-2 border p-3 rounded-lg">
            <Checkbox 
              id={c} 
              checked={reqs.compliance.includes(c as any)}
              onCheckedChange={(checked) => {
                const current = reqs.compliance;
                setReqs({
                  ...reqs,
                  compliance: checked 
                    ? [...current, c as any]
                    : current.filter(i => i !== c)
                });
              }}
            />
            <label htmlFor={c} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase">
              {c}
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
        <Button onClick={() => setStep(3)} className="flex-1">Next: Tech Stack</Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Technical Context</h3>
      <p className="text-sm text-gray-500">Select your primary integration languages</p>
      <div className="grid grid-cols-2 gap-4">
        {['python', 'node', 'go', 'java'].map((t) => (
          <div key={t} className="flex items-center space-x-2 border p-3 rounded-lg">
             <Checkbox 
              id={t} 
              checked={reqs.techStack.includes(t as any)}
              onCheckedChange={(checked) => {
                const current = reqs.techStack;
                setReqs({
                  ...reqs,
                  techStack: checked 
                    ? [...current, t as any]
                    : current.filter(i => i !== t)
                });
              }}
            />
            <label htmlFor={t} className="text-sm font-medium capitalize">{t}</label>
          </div>
        ))}
      </div>
       <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
        <Button onClick={handleMatch} className="flex-1" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Find Best Fit'}
        </Button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Top Recommendations</h3>
        <Button variant="ghost" onClick={() => setStep(1)}>Reset</Button>
      </div>
      <div className="space-y-3">
        {results?.slice(0, 3).map((r, i) => (
          <Card key={r.platformId} className="p-4 border-l-4 border-l-primary">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">#{i+1} {r.platformId}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono">
                    {r.score}% Match
                  </span>
                </div>
                {r.gapAnalysis.complianceGaps.length > 0 && (
                   <div className="flex items-center text-red-600 text-xs mt-1">
                     <AlertTriangle className="w-3 h-3 mr-1" />
                     Missing Compliance: {r.gapAnalysis.complianceGaps.join(', ')}
                   </div>
                )}
              </div>
              <Button size="sm" variant="outline">Select</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderResults()}
    </Card>
  );
}
