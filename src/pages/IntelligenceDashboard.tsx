import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { RecommendationWizard } from '../features/intelligence/components/RecommendationWizard';
import { RiskDashboard } from '../features/intelligence/components/RiskDashboard';
import { ROIValidation } from '../features/intelligence/components/ROIValidation';

export default function IntelligenceDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#231C19]">Decision Intelligence</h1>
        <p className="text-gray-600">
          Data-driven insights to validate your AI platform selection.
        </p>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="bg-white border p-1 rounded-lg">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="risk">Vendor Risk Monitor</TabsTrigger>
          <TabsTrigger value="roi">TCO & ROI Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <RecommendationWizard />
        </TabsContent>
        
        <TabsContent value="risk">
          {/* Default to a popular platform for demo */}
          <RiskDashboard platformId="openai-gpt4" />
        </TabsContent>
        
        <TabsContent value="roi">
          <ROIValidation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
