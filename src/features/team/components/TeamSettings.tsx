import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Role } from '../../../types/auth';
import { toast } from 'sonner';
import { Users, Shield, Mail, Plus } from 'lucide-react';

export function TeamSettings() {
  const { user, switchRole, hasPermission } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('viewer');

  const [members, setMembers] = useState([
    { id: '1', name: 'Alex Innovation', email: 'demo@enterprise.ai', role: 'admin' as Role, status: 'active' },
    { id: '2', name: 'Sarah Security', email: 'sarah@enterprise.ai', role: 'editor' as Role, status: 'active' },
    { id: '3', name: 'Mike Manager', email: 'mike@enterprise.ai', role: 'viewer' as Role, status: 'invited' },
  ]);

  if (!user) return null;

  const handleInvite = () => {
    if (!inviteEmail) return;
    setMembers([...members, {
      id: Math.random().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'invited'
    }]);
    setInviteEmail('');
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Team Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Demo Role Switcher */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Demo: Switch Your Role
            </h4>
            <div className="flex gap-2">
              {(['admin', 'editor', 'viewer'] as Role[]).map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={user.role === r ? 'default' : 'outline'}
                  onClick={() => {
                    switchRole(r);
                    toast.success(`Switched to ${r} role`);
                  }}
                  className="capitalize"
                >
                  {r}
                </Button>
              ))}
            </div>
            <p className="text-xs text-orange-600 mt-2">
              Current permissions: {hasPermission('manage_team') ? 'Full Access' : hasPermission('edit_weights') ? 'Edit Access' : 'View Only'}
            </p>
          </div>

          {/* Invite Form */}
          {hasPermission('manage_team') && (
            <div className="flex gap-2 items-end border-b pb-6">
              <div className="grid gap-2 flex-1">
                <label className="text-sm font-medium">Invite New Member</label>
                <Input 
                  placeholder="colleague@company.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 w-[140px]">
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteRole} onValueChange={(v: Role) => setInviteRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite}>
                <Plus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          )}

          {/* Member List */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Active Members ({members.length})</h4>
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${member.email}`} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.status === 'active' ? 'secondary' : 'outline'}>
                    {member.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize w-[70px] justify-center">
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
