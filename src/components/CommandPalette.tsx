import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandSeparator 
} from './ui/command';
import { 
  Calculator, 
  LayoutDashboard, 
  Zap, 
  Settings, 
  User, 
  Search,
  Bot
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { intelligenceService } from '../services/intelligenceService';
import { toast } from 'sonner';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleAiAsk = async () => {
    if (!query) return;
    
    toast.promise(
      // Simulating a "Smart" router that decides where to go based on query
      // In a real app, this would call intelligenceService.classifyIntent(query)
      new Promise((resolve) => {
        setTimeout(() => {
          if (query.toLowerCase().includes('roi') || query.toLowerCase().includes('cost')) {
            navigate('/roi');
            resolve('Navigating to ROI Calculator based on your query');
          } else if (query.toLowerCase().includes('recommend') || query.toLowerCase().includes('strategy')) {
            navigate('/intelligence');
            resolve('Opening Intelligence Engine');
          } else {
             // Fallback to "General Search" simulation
             resolve(`Searching Intelligence Base for "${query}"...`);
          }
        }, 800);
      }),
      {
        loading: 'Consulting AI Assistant...',
        success: (data: any) => data,
        error: 'Failed to process request'
      }
    );
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or ask AI..." 
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.length > 0) {
            handleAiAsk();
          }
        }}
      />
      <CommandList>
        <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <Bot className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                   Ask AI about "{query}"
                </p>
                <button 
                  onClick={handleAiAsk}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
                >
                   Ask Assistant ↵
                </button>
            </div>
        </CommandEmpty>
        
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/intelligence'))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Intelligence Engine</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/roi'))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>ROI Calculator</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate('/settings/profile'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile ({user?.name || 'Guest'})</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      
      <div className="border-t bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
        <span className="mr-2 font-bold">Pro Tip:</span> 
        Use <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">⌘K</kbd> to open, 
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">↵</kbd> to select
      </div>
    </CommandDialog>
  );
}
