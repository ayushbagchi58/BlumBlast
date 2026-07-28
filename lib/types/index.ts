// Core Type Definitions for BlumBlast Internal Tool

/**
 * Lead Status
 */
export type LeadStatus = 
  | 'new'           // Just imported/created
  | 'contacted'     // Initial outreach done
  | 'engaged'       // Responded to outreach
  | 'qualified'     // Meets criteria for sales
  | 'unqualified'   // Does not meet criteria
  | 'converted';    // Became BusinessBlum customer

/**
 * Lead Source
 */
export type LeadSource =
  | 'email_inbound'    // Came via email integration
  | 'sms_inbound'      // Came via SMS integration
  | 'manual'           // Manually entered
  | 'csv_import'       // Bulk CSV import
  | 'api'              // API integration
  | 'form'             // Web form submission
  | 'referral';        // Referred by existing customer

/**
 * Lead - Core entity for contact management
 */
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;              // 0-100 lead quality score
  tags: string[];
  customFields: Record<string, any>;
  assignedTo?: string;        // User ID of assigned team member
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}

/**
 * Campaign Channel
 */
export type CampaignChannel = 'email' | 'sms' | 'both';

/**
 * Campaign Status
 */
export type CampaignStatus =
  | 'draft'           // Being created
  | 'scheduled'       // Scheduled for future send
  | 'sending'         // Currently sending
  | 'sent'            // Completed sending
  | 'paused'          // Paused mid-send
  | 'cancelled';      // Cancelled before completion

/**
 * Campaign - Bulk messaging to leads
 */
export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  subject?: string;           // For email campaigns
  content: string;            // HTML for email, text for SMS
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  unsubscribedCount: number;
  bouncedCount: number;
  scheduledFor?: Date;
  sentAt?: Date;
  createdBy: string;          // User ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workflow Node Type
 */
export type WorkflowNodeType =
  | 'trigger'        // Entry point (lead created, email opened, etc.)
  | 'action'         // Perform action (send email, update field, etc.)
  | 'condition'      // If/else branching
  | 'wait'           // Time delay
  | 'split';         // A/B test split

/**
 * Workflow Status
 */
export type WorkflowStatus =
  | 'draft'          // Being created
  | 'active'         // Running
  | 'paused'         // Temporarily stopped
  | 'archived';      // No longer in use

/**
 * Workflow Node
 */
export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: Record<string, any>;  // Node-specific configuration
  position: { x: number; y: number };
  connections: string[];          // IDs of connected nodes
}

/**
 * Workflow - Automated lead nurturing sequence
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  enrolledCount: number;
  completedCount: number;
  activeCount: number;
  createdBy: string;          // User ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Opportunity Stage
 */
export type OpportunityStage =
  | 'new'            // Just qualified from leads
  | 'contacted'      // Initial contact made
  | 'proposal'       // Proposal/demo sent
  | 'negotiation'    // Discussing terms
  | 'closed_won'     // Converted to BusinessBlum
  | 'closed_lost';   // Did not convert

/**
 * Opportunity - Sales pipeline entry
 */
export interface Opportunity {
  id: string;
  leadId: string;             // Associated lead
  title: string;
  value: number;              // Deal value in dollars
  stage: OpportunityStage;
  probability: number;        // 0-100 chance of closing
  assignedTo: string;         // User ID
  expectedCloseDate?: Date;
  closedAt?: Date;
  lostReason?: string;
  businessBlumAccountId?: string;  // When converted
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Role
 */
export type UserRole = 'admin' | 'manager' | 'agent';

/**
 * User - Team member
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to get full name
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

/**
 * Activity Type
 */
export type ActivityType =
  | 'lead_created'
  | 'lead_updated'
  | 'lead_converted'
  | 'campaign_sent'
  | 'campaign_opened'
  | 'campaign_clicked'
  | 'workflow_triggered'
  | 'opportunity_created'
  | 'opportunity_stage_changed'
  | 'opportunity_closed';

/**
 * Activity - System activity log
 */
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  entityId?: string;          // ID of related entity (lead, campaign, etc.)
  entityType?: string;         // Type of entity
  userId?: string;            // User who performed action
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Dashboard Metrics
 */
export interface DashboardMetrics {
  newLeadsToday: number;
  newLeadsChange: number;          // Percentage change from yesterday
  activeCampaigns: number;
  activeCampaignsChange: number;
  hotLeads: number;                // Leads with score > 80
  hotLeadsChange: number;
  revenueThisMonth: number;
  revenueChange: number;
  avgLeadScore: number;
  conversionRate: number;
}

/**
 * Campaign Analytics
 */
export interface CampaignAnalytics {
  campaignId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  topLinks: Array<{
    url: string;
    clicks: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  timeSeriesData: Array<{
    timestamp: Date;
    opens: number;
    clicks: number;
  }>;
}

/**
 * Lead Score Configuration
 */
export interface LeadScoringRule {
  id: string;
  name: string;
  description: string;
  trigger: ActivityType;
  points: number;
  isActive: boolean;
}

/**
 * Template Type
 */
export type TemplateType = 'email' | 'sms';

/**
 * Template
 */
export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject?: string;           // For email templates
  content: string;
  thumbnail?: string;
  category: string;
  isSystem: boolean;          // System template vs user-created
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Segment Filter
 */
export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

/**
 * Segment - For campaign targeting
 */
export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  estimatedCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Integration Type
 */
export type IntegrationType = 
  | 'email_imap'
  | 'email_smtp'
  | 'sms_twilio'
  | 'sms_messagebird'
  | 'businessblum_api';

/**
 * Integration - External service connection
 */
export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  config: Record<string, any>;
  isConnected: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
