import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Stack } from '../../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Trash2, ArrowRight, Layers, Calendar, Database } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function StackList() {
  const { state, actions } = useAppContext();
  const { stacks } = state;

  const handleLoad = (stack: Stack) => {
    actions.setPlatformSelection(stack.platformIds);
    actions.navigate('/explorer');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this stack?')) {
      actions.deleteStack(id);
    }
  };

  if (stacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Layers className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Saved Stacks</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
          Start exploring platforms and save your comparisons to create your first stack.
        </p>
        <Button onClick={() => actions.navigate('/explorer')}>
          Go to Explorer
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stacks.map((stack) => (
        <Card key={stack.id} className="group hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
              onClick={(e) => handleDelete(e, stack.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="font-serif text-xl">{stack.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {stack.description || "No description provided."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="font-normal text-xs flex items-center gap-1">
                <Database className="w-3 h-3" />
                {stack.platformIds.length} Platforms
              </Badge>
              <Badge variant="outline" className="font-normal text-xs flex items-center gap-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDistanceToNow(stack.createdAt, { addSuffix: true })}
              </Badge>
            </div>
            
            {/* Platform Preview Miniatures */}
            <div className="flex -space-x-2 overflow-hidden py-1">
               {stack.platformIds.slice(0, 5).map(id => {
                  const platform = state.platforms.all.find(p => p.id === id);
                  if (!platform) return null;
                  return (
                    <div key={id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-white flex items-center justify-center text-xs overflow-hidden shadow-sm" title={platform.name}>
                       {platform.logo}
                    </div>
                  );
               })}
               {stack.platformIds.length > 5 && (
                 <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-[10px] font-medium text-gray-600">
                   +{stack.platformIds.length - 5}
                 </div>
               )}
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50/50 p-4 border-t">
            <Button className="w-full justify-between group-hover:bg-[#E88A1D] transition-colors" onClick={() => handleLoad(stack)}>
              Load Evaluation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
