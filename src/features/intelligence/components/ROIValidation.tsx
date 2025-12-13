import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { intelligenceService } from '../../../services/intelligenceService';
import { ROIRealizationEntry } from '../../../types/intelligence';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ROIValidation() {
  const [data, setData] = useState<ROIRealizationEntry[]>([]);

  useEffect(() => {
    intelligenceService.getROIRealization('curr').then(setData);
  }, []);

  const totalProjected = data.reduce((acc, curr) => acc + curr.projectedCost, 0);
  const totalActual = data.reduce((acc, curr) => acc + curr.actualCost, 0);
  const variance = ((totalActual - totalProjected) / totalProjected) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
           <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Projected Cost</div>
            <div className="text-2xl font-bold">${totalProjected.toLocaleString()}</div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Actual Cost</div>
            <div className={`text-2xl font-bold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${totalActual.toLocaleString()}
            </div>
           </CardContent>
        </Card>
         <Card>
           <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Variance</div>
            <div className={`text-2xl font-bold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
            </div>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Realization (Projected vs Actual)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projectedCost" name="Projected" fill="#94a3b8" />
                <Bar dataKey="actualCost" name="Actual" fill="#E88A1D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Adoption Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projectedAdoption" name="Target Users" fill="#94a3b8" />
                <Bar dataKey="actualAdoption" name="Active Users" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
