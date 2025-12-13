import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { intelligenceService } from '../../../services/intelligenceService';
import { VendorRiskProfile } from '../../../types/intelligence';
import { AlertTriangle, Activity, ShieldCheck, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const trendData = [
  { month: 'Jan', score: 15 },
  { month: 'Feb', score: 12 },
  { month: 'Mar', score: 18 },
  { month: 'Apr', score: 14 },
  { month: 'May', score: 25 }, // Spike
  { month: 'Jun', score: 20 },
];

export function RiskDashboard({ platformId }: { platformId: string }) {
  const [profile, setProfile] = useState<VendorRiskProfile | null>(null);

  useEffect(() => {
    intelligenceService.getRiskProfile(platformId).then(setProfile);
  }, [platformId]);

  if (!profile) return <div>Loading risk data...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Risk Score Card */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Real-time Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold">{profile.riskScore}</span>
            <span className="text-sm text-gray-400 mb-1">/ 100</span>
            <Badge variant={profile.riskScore > 50 ? "destructive" : "secondary"} className="mb-2">
              {profile.trend === 'degrading' ? 'Degrading ⚠️' : 'Stable ✅'}
            </Badge>
          </div>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#f43f5e" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Operational Stats */}
      <Card className="col-span-1">
         <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Operational Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> Uptime SLA</span>
            <span className="font-mono font-bold text-green-600">{profile.uptimesla}%</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Last Audit</span>
            <span className="text-sm text-gray-600">Nov 2024 (SOC2)</span>
          </div>
        </CardContent>
      </Card>

      {/* Incident Feed */}
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Risk Event Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.events.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> No recent risk events detected.
            </div>
          ) : (
            <div className="space-y-3">
              {profile.events.map(evt => (
                <div key={evt.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">{evt.description}</h4>
                    <p className="text-xs text-red-700 mt-1">
                      {evt.date} • Severity: <span className="uppercase">{evt.severity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
