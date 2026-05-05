export type AgentRole = 'creative-director' | 'art-director' | 'copywriter' | 'strategist' | 'social-manager';

export interface Agent {
  id: AgentRole;
  name: string;
  title: string;
  specialty: string;
  description: string;
  tools: string[];
  emoji: string;
  gradient: string;
  capabilities: string[];
}

export interface ClientProfile {
  brand: string;
  industry: string;
  products: string;
  targetAudience: string;
  tone: string;
  competitors: string;
  goals: string;
  uploadedFiles: UploadedFile[];
  completedAt?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
