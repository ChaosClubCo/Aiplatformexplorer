import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { IntegrationHub } from '../features/ecosystem/components/IntegrationHub';
import { RFPGenerator } from '../features/ecosystem/components/RFPGenerator';

export default function EcosystemHub() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#231C19]">Operational Ecosystem</h1>
        <p className="text-gray-600">
          Connect, automate, and govern your AI procurement workflow.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-white border p-1 rounded-lg">
          <TabsTrigger value="integrations">Integration Hub</TabsTrigger>
          <TabsTrigger value="rfp">RFP Generator</TabsTrigger>
          <TabsTrigger value="governance" disabled>Governance Console (Enterprise)</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <IntegrationHub />
        </TabsContent>
        
        <TabsContent value="rfp">
          <RFPGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
