import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Search, ArrowRight, Command, FileText, Zap, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { actions, state } = useAppContext();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
    setQuery('');
  };

  const navItems = [
    { label: 'Go to Explorer', icon: <LayoutDashboard />, action: () => actions.navigate('explorer') },
    { label: 'Go to Feature Matrix', icon: <LayoutDashboard />, action: () => actions.navigate('comparison') },
    { label: 'Go to ROI Calculator', icon: <LayoutDashboard />, action: () => actions.navigate('roi') },
    { label: 'Go to Intelligence', icon: <Zap />, action: () => actions.navigate('intelligence') },
    { label: 'Go to Ecosystem', icon: <Zap />, action: () => actions.navigate('ecosystem') },
  ];

  const actionsItems = [
    { label: 'Create New Scenario', icon: <FileText />, action: () => console.log('Create Scenario') }, // Placeholder
    { label: 'Export Report', icon: <FileText />, action: () => console.log('Export') },
    { label: 'Reset Filters', icon: <Search />, action: () => actions.resetFilters() },
  ];

  const filteredNav = navItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  const filteredActions = actionsItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden gap-0">
        <div className="flex items-center px-4 border-b">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <Input 
            className="border-0 focus-visible:ring-0 px-0 py-4 text-lg h-14 shadow-none" 
            placeholder="Type a command or search..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs text-gray-400 border px-1.5 py-0.5 rounded">ESC</div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredNav.length > 0 && (
            <div className="mb-2">
              <h4 className="text-xs font-bold text-gray-400 px-2 py-1 uppercase">Navigation</h4>
              {filteredNav.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.action)}
                  className="w-full flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 text-left text-sm group"
                >
                  <span className="w-5 h-5 mr-2 text-gray-500">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                </button>
              ))}
            </div>
          )}

          {filteredActions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 px-2 py-1 uppercase">Actions</h4>
              {filteredActions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.action)}
                  className="w-full flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 text-left text-sm group"
                >
                  <span className="w-5 h-5 mr-2 text-gray-500">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <KeyboardShortcut />
                </button>
              ))}
            </div>
          )}
          
          {filteredNav.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found.
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 flex items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <Command className="w-3 h-3" /> 
            <span>Open Palette</span>
          </div>
          <span>Pro Tip: Use arrow keys to navigate</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KeyboardShortcut() {
  return <span className="text-xs text-gray-400">↵</span>;
}
