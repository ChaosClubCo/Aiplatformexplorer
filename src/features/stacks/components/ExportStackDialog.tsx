import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Stack } from '../../../types';
import { stackService } from '../../../services/stackPersistence';
import { toast } from 'sonner';
import { Loader2, Share2, Github, FileText } from 'lucide-react';

interface ExportStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stack: Stack | null;
}

export function ExportStackDialog({ open, onOpenChange, stack }: ExportStackDialogProps) {
  const [loading, setLoading] = useState(false);
  const [notionDbId, setNotionDbId] = useState('');
  const [githubRepo, setGithubRepo] = useState('');

  const handleNotionExport = async () => {
    if (!stack) return;
    setLoading(true);
    try {
      const result = await stackService.exportToNotion(stack, notionDbId);
      toast.success("Exported to Notion successfully!", {
        action: {
          label: "View",
          onClick: () => window.open(result.url, '_blank')
        }
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to export to Notion");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubExport = async () => {
    if (!stack) return;
    if (!githubRepo) {
      toast.error("Repository URL is required (e.g., owner/repo)");
      return;
    }
    setLoading(true);
    try {
      const result = await stackService.exportToGithub(stack, githubRepo);
      toast.success("Issue created on GitHub!", {
         action: {
          label: "View",
          onClick: () => window.open(result.url, '_blank')
        }
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to export to GitHub");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Export Stack Analysis
          </DialogTitle>
          <DialogDescription>
            Export "{stack?.name}" to your external tools.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="notion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notion" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notion
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notion" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notion-db">Database ID (Optional)</Label>
              <Input 
                id="notion-db" 
                placeholder="Use default or enter ID..." 
                value={notionDbId}
                onChange={(e) => setNotionDbId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use the configured default database.
              </p>
            </div>
            <Button onClick={handleNotionExport} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Notion Page
            </Button>
          </TabsContent>
          
          <TabsContent value="github" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github-repo">Repository (owner/repo)</Label>
              <Input 
                id="github-repo" 
                placeholder="int-inc/ai-platform-explorer" 
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                An issue will be created in this repository.
              </p>
            </div>
            <Button onClick={handleGithubExport} disabled={loading || !githubRepo} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create GitHub Issue
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
