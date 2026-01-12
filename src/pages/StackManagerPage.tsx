import React from 'react';
import { StackList } from '../features/stacks';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function StackManagerPage() {
  const { actions } = useAppContext();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#231C19]">Saved Stacks</h1>
          <p className="text-[#5C524D] mt-1">
            Manage your saved evaluations and platform combinations.
          </p>
        </div>
        
        <Button onClick={() => actions.navigate('/explorer')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Stack
        </Button>
      </div>

      <StackList />
    </div>
  );
}
