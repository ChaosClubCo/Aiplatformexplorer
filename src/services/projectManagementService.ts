/**
 * Project Management Service
 * Production-grade project and task management inspired by Notion workspace
 * 
 * @module services/projectManagementService
 */

/**
 * Project status
 */
export type ProjectStatus =
  | 'not-started'
  | 'planning'
  | 'in-progress'
  | 'on-hold'
  | 'completed'
  | 'cancelled';

/**
 * Task priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task status
 */
export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'in-review'
  | 'blocked'
  | 'completed'
  | 'cancelled';

/**
 * Project interface
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: TaskPriority;
  
  // Dates
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Team
  owner: string;
  team: string[];
  stakeholders: string[];
  
  // Progress
  progress: number; // 0-100
  tasksTotal: number;
  tasksCompleted: number;
  
  // Metadata
  tags: string[];
  category: string;
  notionPageId?: string;
  
  // Goals
  goals: string[];
  deliverables: string[];
  
  // Budget (optional)
  budget?: {
    allocated: number;
    spent: number;
    currency: string;
  };
}

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Project association
  projectId: string;
  projectName: string;
  
  // Dates
  dueDate: Date | null;
  startDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Assignment
  assignee: string | null;
  assignedBy: string;
  
  // Dependencies
  blockedBy: string[];
  blocks: string[];
  
  // Time tracking
  estimatedHours: number | null;
  actualHours: number | null;
  
  // Metadata
  tags: string[];
  labels: string[];
  notionPageId?: string;
  
  // Subtasks
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  
  // Comments
  commentsCount: number;
}

/**
 * Sprint interface (Agile)
 */
export interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: 'planning' | 'active' | 'completed';
  
  startDate: Date;
  endDate: Date;
  
  tasks: string[]; // Task IDs
  capacity: number; // Story points or hours
  velocity: number; // Completed story points
  
  projectId: string;
}

/**
 * Milestone interface
 */
export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt: Date | null;
  
  projectId: string;
  tasks: string[]; // Task IDs
  deliverables: string[];
}

/**
 * Project analytics
 */
export interface ProjectAnalytics {
  // Overall metrics
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Task metrics
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  
  // Time metrics
  averageCompletionTime: number; // days
  averageTaskDuration: number; // hours
  
  // Team metrics
  totalTeamMembers: number;
  tasksByMember: Record<string, number>;
  completionRateByMember: Record<string, number>;
  
  // Trend data
  completionTrend: Array<{
    date: Date;
    completed: number;
    created: number;
  }>;
}

/**
 * Project Management Service
 */
class ProjectManagementService {
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task> = new Map();
  private sprints: Map<string, Sprint> = new Map();
  private milestones: Map<string, Milestone> = new Map();
  
  /**
   * Initialize with sample data (inspired by Notion workspace)
   */
  initialize(): void {
    // Sample projects
    const projects: Project[] = [
      {
        id: 'proj-1',
        name: 'AI Platform Explorer V3',
        description: 'Complete refactor with max depth architecture',
        status: 'in-progress',
        priority: 'high',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-12-31'),
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date(),
        owner: 'Product Team',
        team: ['Engineering', 'Design', 'Product'],
        stakeholders: ['CTO', 'CEO', 'Head of Product'],
        progress: 75,
        tasksTotal: 40,
        tasksCompleted: 30,
        tags: ['high-priority', 'refactor', 'v3'],
        category: 'Engineering',
        goals: [
          'Complete architecture refactor',
          'Implement 10 user personas',
          'Create persona generator tool',
          'Production-ready code',
        ],
        deliverables: [
          'Refactored codebase',
          'User personas documentation',
          'Persona generator component',
          'Complete documentation',
        ],
      },
      {
        id: 'proj-2',
        name: 'User Research & Personas',
        description: '10 detailed user personas with complete user flows',
        status: 'completed',
        priority: 'high',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-12-10'),
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date(),
        owner: 'UX Research',
        team: ['UX Research', 'Product'],
        stakeholders: ['Head of Product', 'Design Lead'],
        progress: 100,
        tasksTotal: 15,
        tasksCompleted: 15,
        tags: ['research', 'personas', 'ux'],
        category: 'Research',
        goals: [
          'Create 10 detailed personas',
          'Map 30 user flows',
          'Document behavioral patterns',
        ],
        deliverables: [
          'USER_PERSONAS_COMPLETE.md',
          'USER_FLOWS_COMPLETE.md',
          'Persona templates',
        ],
      },
      {
        id: 'proj-3',
        name: 'Production Infrastructure',
        description: 'Build production-grade utilities and services',
        status: 'completed',
        priority: 'high',
        startDate: new Date('2024-10-15'),
        endDate: new Date('2024-11-15'),
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date(),
        owner: 'Engineering',
        team: ['Engineering'],
        stakeholders: ['CTO', 'Tech Lead'],
        progress: 100,
        tasksTotal: 20,
        tasksCompleted: 20,
        tags: ['infrastructure', 'utilities', 'phase-2'],
        category: 'Engineering',
        goals: [
          'Build utility library (130+ functions)',
          'Create service layer',
          'Implement custom hooks',
        ],
        deliverables: [
          '130+ utility functions',
          '3 production services',
          '15+ custom hooks',
        ],
      },
    ];
    
    projects.forEach(project => this.projects.set(project.id, project));
    
    // Sample tasks
    const tasks: Task[] = [
      {
        id: 'task-1',
        title: 'Create architecture document',
        description: 'Complete V3 architecture documentation at max depth',
        status: 'completed',
        priority: 'high',
        projectId: 'proj-1',
        projectName: 'AI Platform Explorer V3',
        dueDate: new Date('2024-12-01'),
        startDate: new Date('2024-11-20'),
        completedAt: new Date('2024-11-30'),
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-30'),
        assignee: 'Engineering',
        assignedBy: 'Tech Lead',
        blockedBy: [],
        blocks: ['task-2', 'task-3'],
        estimatedHours: 16,
        actualHours: 14,
        tags: ['documentation', 'architecture'],
        labels: ['v3', 'critical'],
        subtasks: [
          { id: 'st-1', title: 'Architecture diagrams', completed: true },
          { id: 'st-2', title: 'Data flow documentation', completed: true },
          { id: 'st-3', title: 'Component hierarchy', completed: true },
        ],
        commentsCount: 5,
      },
      {
        id: 'task-2',
        title: 'Implement persona generator',
        description: 'Build production-grade persona template generator',
        status: 'completed',
        priority: 'high',
        projectId: 'proj-1',
        projectName: 'AI Platform Explorer V3',
        dueDate: new Date('2024-12-05'),
        startDate: new Date('2024-12-01'),
        completedAt: new Date('2024-12-04'),
        createdAt: new Date('2024-11-25'),
        updatedAt: new Date('2024-12-04'),
        assignee: 'Engineering',
        assignedBy: 'Product Manager',
        blockedBy: ['task-1'],
        blocks: [],
        estimatedHours: 8,
        actualHours: 6,
        tags: ['feature', 'personas'],
        labels: ['v3'],
        subtasks: [
          { id: 'st-4', title: 'Design component UI', completed: true },
          { id: 'st-5', title: 'Implement form logic', completed: true },
          { id: 'st-6', title: 'Add export functionality', completed: true },
        ],
        commentsCount: 3,
      },
      {
        id: 'task-3',
        title: 'Refactor App.tsx',
        description: 'Refactor main app using Feature-Sliced Design',
        status: 'in-progress',
        priority: 'high',
        projectId: 'proj-1',
        projectName: 'AI Platform Explorer V3',
        dueDate: new Date('2024-12-15'),
        startDate: new Date('2024-12-05'),
        completedAt: null,
        createdAt: new Date('2024-11-25'),
        updatedAt: new Date(),
        assignee: 'Engineering',
        assignedBy: 'Tech Lead',
        blockedBy: ['task-1'],
        blocks: ['task-4'],
        estimatedHours: 12,
        actualHours: 8,
        tags: ['refactor', 'architecture'],
        labels: ['v3', 'in-progress'],
        subtasks: [
          { id: 'st-7', title: 'Set up Context API', completed: true },
          { id: 'st-8', title: 'Implement lazy loading', completed: true },
          { id: 'st-9', title: 'Add error boundaries', completed: false },
        ],
        commentsCount: 7,
      },
    ];
    
    tasks.forEach(task => this.tasks.set(task.id, task));
  }
  
  // ==================== Project Methods ====================
  
  /**
   * Create a new project
   */
  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.projects.set(newProject.id, newProject);
    return newProject;
  }
  
  /**
   * Update a project
   */
  updateProject(id: string, updates: Partial<Project>): Project | null {
    const project = this.projects.get(id);
    if (!project) return null;
    
    const updated = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updated);
    return updated;
  }
  
  /**
   * Get a project by ID
   */
  getProject(id: string): Project | null {
    return this.projects.get(id) || null;
  }
  
  /**
   * Get all projects
   */
  getAllProjects(filters?: {
    status?: ProjectStatus;
    priority?: TaskPriority;
    owner?: string;
    tags?: string[];
  }): Project[] {
    let projects = Array.from(this.projects.values());
    
    if (filters) {
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.priority) {
        projects = projects.filter(p => p.priority === filters.priority);
      }
      if (filters.owner) {
        projects = projects.filter(p => p.owner === filters.owner);
      }
      if (filters.tags && filters.tags.length > 0) {
        projects = projects.filter(p =>
          filters.tags!.some(tag => p.tags.includes(tag))
        );
      }
    }
    
    return projects;
  }
  
  /**
   * Delete a project
   */
  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }
  
  // ==================== Task Methods ====================
  
  /**
   * Create a new task
   */
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.set(newTask.id, newTask);
    
    // Update project task count
    const project = this.projects.get(task.projectId);
    if (project) {
      this.updateProject(task.projectId, {
        tasksTotal: project.tasksTotal + 1,
      });
    }
    
    return newTask;
  }
  
  /**
   * Update a task
   */
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;
    
    const updated = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    
    // If status changed to completed, update project
    if (updates.status === 'completed' && task.status !== 'completed') {
      updated.completedAt = new Date();
      const project = this.projects.get(task.projectId);
      if (project) {
        this.updateProject(task.projectId, {
          tasksCompleted: project.tasksCompleted + 1,
          progress: ((project.tasksCompleted + 1) / project.tasksTotal) * 100,
        });
      }
    }
    
    this.tasks.set(id, updated);
    return updated;
  }
  
  /**
   * Get a task by ID
   */
  getTask(id: string): Task | null {
    return this.tasks.get(id) || null;
  }
  
  /**
   * Get all tasks
   */
  getAllTasks(filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
    assignee?: string;
    tags?: string[];
  }): Task[] {
    let tasks = Array.from(this.tasks.values());
    
    if (filters) {
      if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status);
      }
      if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority);
      }
      if (filters.projectId) {
        tasks = tasks.filter(t => t.projectId === filters.projectId);
      }
      if (filters.assignee) {
        tasks = tasks.filter(t => t.assignee === filters.assignee);
      }
      if (filters.tags && filters.tags.length > 0) {
        tasks = tasks.filter(t =>
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }
    }
    
    return tasks;
  }
  
  /**
   * Get tasks by project
   */
  getTasksByProject(projectId: string): Task[] {
    return this.getAllTasks({ projectId });
  }
  
  /**
   * Get overdue tasks
   */
  getOverdueTasks(): Task[] {
    const now = new Date();
    return Array.from(this.tasks.values()).filter(
      task =>
        task.dueDate &&
        task.dueDate < now &&
        task.status !== 'completed' &&
        task.status !== 'cancelled'
    );
  }
  
  /**
   * Delete a task
   */
  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }
  
  // ==================== Analytics Methods ====================
  
  /**
   * Get project analytics
   */
  getAnalytics(): ProjectAnalytics {
    const projects = Array.from(this.projects.values());
    const tasks = Array.from(this.tasks.values());
    
    const now = new Date();
    const overdueTasks = tasks.filter(
      t => t.dueDate && t.dueDate < now && t.status !== 'completed'
    );
    const blockedTasks = tasks.filter(t => t.status === 'blocked');
    
    // Calculate completion times
    const completedTasks = tasks.filter(t => t.completedAt);
    const completionTimes = completedTasks.map(t => {
      const created = new Date(t.createdAt).getTime();
      const completed = new Date(t.completedAt!).getTime();
      return (completed - created) / (1000 * 60 * 60 * 24); // days
    });
    
    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;
    
    // Calculate task durations
    const tasksWithHours = tasks.filter(t => t.actualHours);
    const averageTaskDuration =
      tasksWithHours.length > 0
        ? tasksWithHours.reduce((sum, t) => sum + (t.actualHours || 0), 0) /
          tasksWithHours.length
        : 0;
    
    // Team metrics
    const teamMembers = new Set(
      tasks.map(t => t.assignee).filter(a => a !== null)
    );
    const tasksByMember: Record<string, number> = {};
    const completionRateByMember: Record<string, number> = {};
    
    teamMembers.forEach(member => {
      if (!member) return;
      const memberTasks = tasks.filter(t => t.assignee === member);
      const completed = memberTasks.filter(t => t.status === 'completed');
      tasksByMember[member] = memberTasks.length;
      completionRateByMember[member] =
        memberTasks.length > 0 ? (completed.length / memberTasks.length) * 100 : 0;
    });
    
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'in-progress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      overdueTasks: overdueTasks.length,
      blockedTasks: blockedTasks.length,
      averageCompletionTime,
      averageTaskDuration,
      totalTeamMembers: teamMembers.size,
      tasksByMember,
      completionRateByMember,
      completionTrend: [], // Would calculate from historical data
    };
  }
  
  /**
   * Get project health score
   */
  getProjectHealth(projectId: string): {
    score: number; // 0-100
    factors: {
      onTime: number;
      withinBudget: number;
      teamVelocity: number;
      qualityMetrics: number;
    };
  } {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        score: 0,
        factors: { onTime: 0, withinBudget: 0, teamVelocity: 0, qualityMetrics: 0 },
      };
    }
    
    const tasks = this.getTasksByProject(projectId);
    const overdue = tasks.filter(
      t => t.dueDate && t.dueDate < new Date() && t.status !== 'completed'
    );
    
    const onTime = tasks.length > 0 ? ((tasks.length - overdue.length) / tasks.length) * 100 : 100;
    const withinBudget = project.budget
      ? Math.max(0, ((project.budget.allocated - project.budget.spent) / project.budget.allocated) * 100)
      : 100;
    const teamVelocity = project.progress;
    const qualityMetrics = 85; // Placeholder
    
    const score = (onTime + withinBudget + teamVelocity + qualityMetrics) / 4;
    
    return {
      score,
      factors: {
        onTime,
        withinBudget,
        teamVelocity,
        qualityMetrics,
      },
    };
  }
}

// Singleton instance
export const projectManagementService = new ProjectManagementService();

// Initialize with sample data
projectManagementService.initialize();

export default projectManagementService;
