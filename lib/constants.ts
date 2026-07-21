export const APP_NAME = "BlumBlast";
export const APP_DESCRIPTION = "Multi-Channel Marketing & Lead Automation Platform";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  LEADS: "/leads",
  LEAD_DETAIL: (id: string) => `/leads/${id}`,
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_CREATE: "/campaigns/create",
  CAMPAIGN_EDIT: (id: string) => `/campaigns/${id}/edit`,
  CAMPAIGN_DETAIL: (id: string) => `/campaigns/${id}`,
  WORKFLOWS: "/workflows",
  WORKFLOW_CREATE: "/workflows/create",
  WORKFLOW_EDIT: (id: string) => `/workflows/${id}/edit`,
  OPPORTUNITIES: "/opportunities",
  OPPORTUNITY_DETAIL: (id: string) => `/opportunities/${id}`,
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  PROFILE: "/settings/profile",
  TEAM: "/settings/team",
  INTEGRATIONS: "/settings/integrations",
  BILLING: "/settings/billing",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "blumblast_auth_token",
  USER_DATA: "blumblast_user_data",
  THEME: "blumblast_theme",
} as const;

export const CAMPAIGN_TYPES = {
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
} as const;

export const LEAD_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  CONVERTED: "converted",
  LOST: "lost",
} as const;

export const OPPORTUNITY_STAGES = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  NEGOTIATION: "negotiation",
  CLOSED_WON: "closed_won",
  CLOSED_LOST: "closed_lost",
} as const;

export const WORKFLOW_NODE_TYPES = {
  TRIGGER: "trigger",
  ACTION: "action",
  CONDITION: "condition",
  DELAY: "delay",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  WITH_TIME: "MMM d, yyyy h:mm a",
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
} as const;
