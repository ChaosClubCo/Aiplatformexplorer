import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layouts/AppShell';

// Lazy Load Features (Code Splitting)
const ROICalculator = lazy(() => import('../features/roi-calculator/components/ROICalculator'));
const RecommendationEngine = lazy(() => import('../features/recommendation/components/RecommendationEngine'));

// Pages
const PlatformExplorer = lazy(() => import('../pages/PlatformExplorer'));
const EcosystemHub = lazy(() => import('../pages/EcosystemHub'));
const PersonaGenerator = lazy(() => import('../pages/PersonaGenerator'));
const StackManagerPage = lazy(() => import('../pages/StackManagerPage'));

const Dashboard = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="space-y-4">
      <h1 className="text-3xl font-serif text-[#231C19]">Executive Dashboard</h1>
      <p className="text-[#5C524D]">Welcome to the Enterprise AI Strategic Explorer.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Access Cards */}
        <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
           <h3 className="font-bold text-lg mb-2">ROI Analysis</h3>
           <p className="text-sm text-gray-500">Calculate projected returns for AI implementations.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
           <h3 className="font-bold text-lg mb-2">Intelligence Engine</h3>
           <p className="text-sm text-gray-500">Get tailored platform recommendations.</p>
        </div>
      </div>
    </div>
  )
}));

export default function Router() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explorer" element={<PlatformExplorer />} />
        <Route path="/stacks" element={<StackManagerPage />} />
        <Route path="/roi" element={<ROICalculator onToast={(msg, type) => console.log(msg, type)} />} />
        <Route path="/intelligence" element={<RecommendationEngine onToast={(msg, type) => console.log(msg, type)} />} />
        <Route path="/ecosystem" element={<EcosystemHub />} />
        <Route path="/personas" element={<PersonaGenerator />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
