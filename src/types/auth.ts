export type Role = 'admin' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: Role;
  avatarUrl?: string;
  organizationId?: string;
  lastActive?: string;
}

export type Permission = 
  | 'view_scenarios'
  | 'create_scenarios'
  | 'edit_scenarios'
  | 'delete_scenarios'
  | 'manage_team'
  | 'edit_weights'
  | 'export_reports';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'view_scenarios',
    'create_scenarios',
    'edit_scenarios',
    'delete_scenarios',
    'manage_team',
    'edit_weights',
    'export_reports'
  ],
  editor: [
    'view_scenarios',
    'create_scenarios',
    'edit_scenarios',
    'edit_weights',
    'export_reports'
  ],
  viewer: [
    'view_scenarios'
  ]
};

export interface TeamMember {
  id: string;
  user: UserProfile;
  role: Role;
  joinedAt: string;
  status: 'active' | 'pending' | 'invited';
}
