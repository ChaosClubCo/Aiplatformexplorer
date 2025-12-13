import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Badge } from '../../../components/ui/badge';
import { ecosystemService } from '../../../services/ecosystemService';
import { IntegrationConfig } from '../../../types/ecosystem';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);

  useEffect(() => {
    ecosystemService.getIntegrations().then(setIntegrations);
  }, []);

  const handleSync = async (id: string) => {
    toast.info('Syncing...');
    await ecosystemService.syncIntegration(id);
    toast.success('Sync complete');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">Integration Hub</h2>
           <p className="text-gray-500">Connect the AI Explorer to your enterprise stack.</p>
        </div>
        <Button variant="outline">Add New Integration</Button>
      </div>

      <div className="grid gap-4">
        {integrations.map(int => (
          <Card key={int.id}>
            <div className="flex items-center p-6 gap-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold uppercase text-gray-500">
                {int.type.slice(0, 2)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold capitalize">{int.type} Integration</h3>
                  <Badge variant={int.status === 'active' ? 'default' : int.status === 'error' ? 'destructive' : 'secondary'}>
                    {int.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                  <span>ID: {int.id}</span>
                  {int.lastSync && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Last sync: {new Date(int.lastSync).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                   <p className="text-sm font-medium">{int.status === 'active' ? 'Auto-Sync On' : 'Disconnected'}</p>
                </div>
                <Switch checked={int.status === 'active'} />
                <Button variant="ghost" size="icon" onClick={() => handleSync(int.id)}>
                   <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
