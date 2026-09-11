// Core Type Definitions for BlumBlast Internal Tool

export type LeadStatus = 
  | 'new'           // Just imported/created
  | 'contacted'     // Initial outreach done
  | 'engaged'       // Responded to outreach
  | 'qualified'     // Meets criteria for sales
  | 'unqualified'   // Does not meet criteria
  | 'converted';    // Became BusinessBlum customer

export type LeadSource =
  | 'email'           // Email inquiry
  | 'sms'             // SMS message
  | 'facebook'        // Facebook Messenger
  | 'instagram'       // Instagram DM
  | 'twitter'         // Twitter/X DM
  | 'linkedin'        // LinkedIn message
  | 'whatsapp'        // WhatsApp message
  | 'webchat';        // Website live chat

export type LeadIntent =
  | 'business_loan'
  | 'startup_funding'
  | 'equipment_financing'
  | 'construction_loan'
  | 'sba_loan'
  | 'working_capital'
  | 'debt_consolidation'
  | 'general_inquiry';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  
  // Channel information
  source: LeadSource;           // Which channel they came from
  sourceDetails?: string;        // Original message/content
  
  // Intent data
  intent?: LeadIntent;           // What they're looking for (optional for backward compatibility)
  fundingAmount?: string;        // Requested funding amount
  businessType?: string;         // Type of business
  message?: string;              // Original inquiry message (optional for backward compatibility)
  
  // CRM data
  status: LeadStatus;
  tags: string[];
  customFields: Record<string, any>;
  assignedTo?: string;           // User ID of assigned team member
  
  // Lead Scoring & Nurturing
  score?: number;                // 0-100 lead score
  engagementScore?: number;      // Engagement-based score (0-60)
  fitScore?: number;             // Fit-based score (0-40)
  temperature?: 'hot' | 'warm' | 'cool' | 'cold';  // Lead temperature
  nurtureSequenceId?: string;    // Active nurture sequence
  nurtureStepIndex?: number;     // Current step in sequence
  lastEngagementAt?: Date;       // Last interaction
  
  // Conversion tracking
  businessBlumSignupUrl?: string;  // Personalized signup URL
  clickedSignupLink?: boolean;     // Clicked BusinessBlum link
  signedUp?: boolean;              // Completed signup
  convertedAt?: Date;              // Conversion date
  conversionValue?: number;        // Deal value
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}

export type CampaignChannel = 'email' | 'sms' | 'both';

export type CampaignStatus =
  | 'draft'           // Being created
  | 'scheduled'       // Scheduled for future send
  | 'sending'         // Currently sending
  | 'sent'            // Completed sending
  | 'paused'          // Paused mid-send
  | 'cancelled';      // Cancelled before completion

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

export type WorkflowNodeType =
  | 'trigger'        // Entry point (lead created, email opened, etc.)
  | 'action'         // Perform action (send email, update field, etc.)
  | 'condition'      // If/else branching
  | 'wait'           // Time delay
  | 'split';         // A/B test split

export type WorkflowStatus =
  | 'draft'          // Being created
  | 'active'         // Running
  | 'paused'         // Temporarily stopped
  | 'archived';      // No longer in use

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: Record<string, any>;  // Node-specific configuration
  position: { x: number; y: number };
  connections: string[];          // IDs of connected nodes
}

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

export type OpportunityStage =
  | 'new'            // Just qualified from leads
  | 'contacted'      // Initial contact made
  | 'proposal'       // Proposal/demo sent
  | 'negotiation'    // Discussing terms
  | 'closed_won'     // Converted to BusinessBlum
  | 'closed_lost';   // Did not convert

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

export type UserRole = 'admin' | 'manager' | 'agent';

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

export interface CampaignAnalytics {
  campaignId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  unsubscribed: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  deliveryRate: number;
  replyRate: number;
  conversions: number;
  revenue: number;
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

export interface LeadScoringRule {
  id: string;
  name: string;
  description: string;
  trigger: ActivityType;
  points: number;
  isActive: boolean;
}

export type TemplateType = 'email' | 'sms';

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

export interface NurtureStep {
  id: string;
  order: number;
  type: 'email' | 'sms';
  delayHours: number;         // Hours after previous step or enrollment
  subject?: string;           // For email
  content: string;            // Message content with personalization tokens
  isActive: boolean;
}

export interface NurtureSequence {
  id: string;
  name: string;
  description?: string;
  triggerIntent?: LeadIntent;   // Auto-enroll leads with this intent
  triggerSource?: LeadSource;   // Auto-enroll leads from this source
  steps: NurtureStep[];
  isActive: boolean;
  enrolledCount: number;
  completedCount: number;
  conversionRate: number;       // Percentage of enrollees who converted
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadEngagement {
  id: string;
  leadId: string;
  type: 'email_sent' | 'email_opened' | 'email_clicked' | 'sms_sent' | 'sms_replied' | 'link_clicked' | 'form_submitted';
  metadata?: Record<string, any>;
  scoreImpact: number;         // Points added to lead score
  createdAt: Date;
}

export interface ConversionMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  avgTimeToConversion: number;  // Hours
  totalRevenue: number;
  avgDealValue: number;
  bySource: Record<LeadSource, {
    leads: number;
    conversions: number;
    rate: number;
    revenue: number;
  }>;
  byIntent: Record<LeadIntent, {
    leads: number;
    conversions: number;
    rate: number;
    revenue: number;
  }>;
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

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

export type IntegrationType = 
  | 'email_imap'
  | 'email_smtp'
  | 'sms_twilio'
  | 'sms_messagebird'
  | 'businessblum_api';

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

// ─── Messaging & Conversations ────────────────────────────────────────────────

export type MessageChannel = LeadSource | 'agent';

export type MessageSender = 'lead' | 'agent' | 'system';

export type MessageType = 'inbound' | 'outbound' | 'automated';

export type MessageStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'bounced';

export interface Message {
  id: string;
  conversationId: string;
  leadId: string;
  channel: MessageChannel;
  sender: MessageSender;
  type: MessageType;
  
  // Content
  subject?: string;              // For emails
  body: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  
  // Metadata
  status: MessageStatus;
  campaignId?: string;           // If part of bulk campaign
  sequenceId?: string;           // If part of nurture sequence
  sequenceStepIndex?: number;    // Step number in sequence
  automationTriggered?: boolean; // Was this auto-sent?
  
  // AI Analysis
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: string;               // Detected intent from AI
  requiresResponse?: boolean;    // AI thinks agent should reply
  
  // Timestamps
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  repliedAt?: Date;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  leadAvatar?: string;
  
  // Conversation metadata
  channel: MessageChannel;       // Primary channel
  subject?: string;              // For email threads
  status: 'open' | 'resolved' | 'snoozed';
  assignedTo?: string;           // Agent user ID
  
  // Message stats
  messageCount: number;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: Date;
  lastMessageSender: MessageSender;
  
  // Lead info snapshot
  leadStatus: LeadStatus;
  leadScore?: number;
  leadTemperature?: 'hot' | 'warm' | 'cool' | 'cold';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationFilter {
  status?: 'open' | 'resolved' | 'snoozed' | 'all';
  channel?: MessageChannel | 'all';
  assignedTo?: string | 'all';
  unreadOnly?: boolean;
  needsReply?: boolean;
  searchQuery?: string;
}

export interface ReplyTemplate {
  id: string;
  name: string;
  subject?: string;
  body: string;
  channel: MessageChannel[];
  category: 'greeting' | 'followup' | 'question' | 'closing' | 'custom';
  variables: string[];          // e.g., ["firstName", "fundingAmount"]
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  unsubscribed: number;
  bounced: number;
  
  // Rates
  deliveryRate: number;         // %
  openRate: number;             // %
  clickRate: number;            // %
  replyRate: number;            // %
  unsubscribeRate: number;      // %
  
  // Revenue (if tracked)
  conversions: number;
  revenue: number;
  
  createdAt: Date;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  data: {
    full_name: string;
    work_email: string;
    company_name: string;
    work_phone: string;
    password: string;
  };
}

export interface RegisterResponseData {
  id: number;
  user_id: string;
  full_name: string;
  company_name: string;
  work_email: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterResponse {
  code: number;
  data: RegisterResponseData;
  message: string;
  failed: boolean;
}
