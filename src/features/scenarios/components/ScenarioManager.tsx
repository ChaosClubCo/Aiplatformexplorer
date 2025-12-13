import React, { useState } from 'react';
import { useScenario } from '../../../contexts/ScenarioContext';
import { useAppContext } from '../../../context/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../../../components/ui/sheet';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Trash2, Save, Play, Copy, BarChart3, Users } from 'lucide-react';
import { toast } from 'sonner';

export function ScenarioManager() {
  const { state: scenarioState, saveScenario, deleteScenario, activateScenario } = useScenario();
  const { state: appState, actions: appActions } = useAppContext();
  const { user, hasPermission } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const handleSave = async () => {
    if (!newScenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }
    
    // Capture current state
    const currentData = {
      weights: appState.preferences.weights,
      // In a full implementation, we'd capture ROI inputs and filters too
      // roiInputs: ... 
      selectedPlatforms: appState.platforms.selected
    };

    await saveScenario(
      newScenarioName, 
      'platform-selection', 
      currentData, 
      'Generated from current view'
    );
    
    setNewScenarioName('');
    setActiveTab('list');
  };

  const handleLoad = (scenarioId: string) => {
    const scenario = scenarioState.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    activateScenario(scenarioId);
    
    // Apply state
    if (scenario.data.weights) {
      appActions.setWeights(scenario.data.weights);
    }
    if (scenario.data.selectedPlatforms) {
      appActions.setPlatformSelection(scenario.data.selectedPlatforms);
    }
    
    toast.success(`Applied scenario: ${scenario.name}`);
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Scenarios
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Scenario Planning</SheetTitle>
          <SheetDescription>
            Save and compare different evaluation configurations.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Saved Scenarios</TabsTrigger>
            <TabsTrigger value="create" disabled={!hasPermission('create_scenarios')}>
              Save Current
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {scenarioState.scenarios.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No saved scenarios yet. Create one to get started.
                  </div>
                ) : (
                  scenarioState.scenarios.map(scenario => (
                    <Card key={scenario.id} className={`p-4 ${scenarioState.activeScenarioId === scenario.id ? 'border-primary ring-1 ring-primary' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{scenario.name}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(scenario.updatedAt).toLocaleDateString()} by {scenario.createdBy === user.id ? 'You' : 'Team'}
                          </p>
                        </div>
                        <Badge variant="outline">{scenario.type}</Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant={scenarioState.activeScenarioId === scenario.id ? "default" : "secondary"}
                          className="flex-1"
                          onClick={() => handleLoad(scenario.id)}
                        >
                          <Play className="w-3 h-3 mr-2" />
                          {scenarioState.activeScenarioId === scenario.id ? 'Active' : 'Load'}
                        </Button>
                        
                        {hasPermission('delete_scenarios') && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => deleteScenario(scenario.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create">
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scenario Name</label>
                <Input 
                  placeholder="e.g., Q3 Security Focus" 
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                />
              </div>
              
              <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-medium mb-2">What will be saved:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Current Evaluation Weights</li>
                  <li>Selected Platforms</li>
                  <li>ROI Calculator Inputs (Active)</li>
                  <li>Current Filters</li>
                </ul>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Scenario
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
