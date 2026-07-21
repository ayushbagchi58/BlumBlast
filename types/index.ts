export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user" | "manager";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  tags: string[];
  score?: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push";
  status: "draft" | "scheduled" | "active" | "paused" | "completed";
  subject?: string;
  content: string;
  targetAudience: {
    segmentId?: string;
    filters?: Record<string, unknown>;
  };
  schedule?: {
    sendAt?: string;
    timezone?: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "paused";
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  leadId: string;
  stage:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  value: number;
  probability: number;
  expectedCloseDate?: string;
  assignedTo: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "task";
  title: string;
  description?: string;
  relatedTo: {
    type: "lead" | "campaign" | "opportunity";
    id: string;
  };
  createdBy: string;
  createdAt: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease";
}

export interface ChartData {
  label: string;
  value: number;
  [key: string]: string | number | boolean;
}

/**
 * API Response types (for future backend integration)
 * Currently using mock data - these types are ready when backend is implemented
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: Record<string, unknown>;
}

export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}

export interface TableFilter {
  key: string;
  value: unknown;
  operator?: "eq" | "ne" | "gt" | "lt" | "contains" | "in";
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
