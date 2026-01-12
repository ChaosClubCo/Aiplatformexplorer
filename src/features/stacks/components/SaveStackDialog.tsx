import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Stack } from '../../../types';
import { Layers } from 'lucide-react';

interface SaveStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformIds: string[];
}

export function SaveStackDialog({ open, onOpenChange, platformIds }: SaveStackDialogProps) {
  const { actions } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) return;

    const newStack: Stack = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      name,
      description,
      platformIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: []
    };

    actions.addStack(newStack);
    onOpenChange(false);
    
    // Reset form
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Save Evaluation Stack
          </DialogTitle>
          <DialogDescription>
            Save your current selection of {platformIds.length} platforms to access them later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Stack Name</Label>
            <Input
              id="name"
              placeholder="e.g. Q1 GenAI Candidates"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Context about this evaluation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || platformIds.length === 0}>
            Save Stack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
