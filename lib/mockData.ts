// Mock Data for Development (until backend is ready)
import type {
  Lead,
  Campaign,
  Workflow,
  Opportunity,
  Activity,
  DashboardMetrics,
  User,
} from "./types";

/**
 * Mock Users
 */
export const mockUsers: User[] = [
  {
    id: "user-1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@blumblast.com",
    role: "admin",
    timezone: "America/New_York",
    isActive: true,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-07-20"),
  },
  {
    id: "user-2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael@blumblast.com",
    role: "manager",
    timezone: "America/Los_Angeles",
    isActive: true,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-07-22"),
  },
  {
    id: "user-3",
    firstName: "Emma",
    lastName: "Rodriguez",
    email: "emma@blumblast.com",
    role: "agent",
    timezone: "America/Chicago",
    isActive: true,
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-07-23"),
  },
];

/**
 * Mock Dashboard Metrics
 */
export const mockDashboardMetrics: DashboardMetrics = {
  newLeadsToday: 47,
  newLeadsChange: 23,
  activeCampaigns: 8,
  activeCampaignsChange: 2,
  hotLeads: 12,
  hotLeadsChange: 15,
  revenueThisMonth: 125000,
  revenueChange: 18,
  avgLeadScore: 68,
  conversionRate: 12.5,
};

/**
 * Mock Leads
 */
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    firstName: "John",
    lastName: "Smith",
    email: "john@email.com",
    phone: "+1-555-0101",
    company: "ABC Corp",
    source: "email",
    sourceDetails: "Email inquiry",
    intent: "business_loan",
    fundingAmount: "$50,000",
    message: "Looking for business loan",
    status: "new",
    tags: ["email-inquiry"],
    customFields: {},
    createdAt: new Date("2026-08-19T10:00:00"),
    updatedAt: new Date("2026-08-19T10:00:00"),
  },
  {
    id: "lead-2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@email.com",
    phone: "+1-555-0102",
    company: "Tech Startup",
    source: "sms",
    sourceDetails: "SMS message",
    intent: "startup_funding",
    fundingAmount: "$30,000",
    message: "Need startup funding",
    status: "new",
    tags: ["sms-inquiry"],
    customFields: {},
    createdAt: new Date("2026-08-19T11:00:00"),
    updatedAt: new Date("2026-08-19T11:00:00"),
  },
  {
    id: "lead-3",
    firstName: "Mike",
    lastName: "Brown",
    email: "mike@email.com",
    phone: "+1-555-0103",
    company: "Restaurant Co",
    source: "facebook",
    sourceDetails: "Facebook Messenger",
    intent: "equipment_financing",
    fundingAmount: "$25,000",
    message: "Need equipment financing",
    status: "new",
    tags: ["facebook"],
    customFields: {},
    createdAt: new Date("2026-08-19T12:00:00"),
    updatedAt: new Date("2026-08-19T12:00:00"),
  },
  {
    id: "lead-4",
    firstName: "Lisa",
    lastName: "Davis",
    email: "lisa@email.com",
    phone: "+1-555-0104",
    company: "Fashion Store",
    source: "instagram",
    sourceDetails: "Instagram DM",
    intent: "working_capital",
    fundingAmount: "$20,000",
    message: "Working capital needed",
    status: "new",
    tags: ["instagram"],
    customFields: {},
    createdAt: new Date("2026-08-19T13:00:00"),
    updatedAt: new Date("2026-08-19T13:00:00"),
  },
  {
    id: "lead-5",
    firstName: "David",
    lastName: "Wilson",
    email: "david@email.com",
    phone: "+1-555-0105",
    company: "Consulting LLC",
    source: "twitter",
    sourceDetails: "Twitter DM",
    intent: "sba_loan",
    fundingAmount: "$100,000",
    message: "SBA loan inquiry",
    status: "new",
    tags: ["twitter"],
    customFields: {},
    createdAt: new Date("2026-08-19T14:00:00"),
    updatedAt: new Date("2026-08-19T14:00:00"),
  },
  {
    id: "lead-6",
    firstName: "Emma",
    lastName: "Taylor",
    email: "emma@email.com",
    phone: "+1-555-0106",
    company: "Marketing Agency",
    source: "linkedin",
    sourceDetails: "LinkedIn message",
    intent: "construction_loan",
    fundingAmount: "$200,000",
    message: "Construction loan needed",
    status: "new",
    tags: ["linkedin"],
    customFields: {},
    createdAt: new Date("2026-08-19T15:00:00"),
    updatedAt: new Date("2026-08-19T15:00:00"),
  },
  {
    id: "lead-7",
    firstName: "James",
    lastName: "Anderson",
    email: "james@email.com",
    phone: "+1-555-0107",
    company: "Retail Shop",
    source: "whatsapp",
    sourceDetails: "WhatsApp message",
    intent: "debt_consolidation",
    fundingAmount: "$40,000",
    message: "Debt consolidation help",
    status: "new",
    tags: ["whatsapp"],
    customFields: {},
    createdAt: new Date("2026-08-19T16:00:00"),
    updatedAt: new Date("2026-08-19T16:00:00"),
  },
];

/**
 * Mock Campaigns
 */
export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Summer Sale 2026",
    channel: "email",
    status: "sent",
    subject: "🔥 Summer Sale: 50% Off for New Customers",
    content: "<h1>Summer Sale</h1><p>Get 50% off...</p>",
    recipientCount: 2456,
    sentCount: 2456,
    deliveredCount: 2398,
    openedCount: 1034,
    clickedCount: 287,
    unsubscribedCount: 8,
    bouncedCount: 58,
    sentAt: new Date("2026-07-15T10:00:00"),
    createdBy: "user-1",
    createdAt: new Date("2026-07-14T15:30:00"),
    updatedAt: new Date("2026-07-24T08:00:00"),
  },
  {
    id: "campaign-2",
    name: "Product Launch - Q3",
    channel: "both",
    status: "scheduled",
    subject: "New Feature Alert: Boost Your Productivity",
    content: "Check out our new features...",
    recipientCount: 1823,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    unsubscribedCount: 0,
    bouncedCount: 0,
    scheduledFor: new Date("2026-07-26T09:00:00"),
    createdBy: "user-2",
    createdAt: new Date("2026-07-23T11:20:00"),
    updatedAt: new Date("2026-07-24T10:15:00"),
  },
  {
    id: "campaign-3",
    name: "Re-engagement Campaign",
    channel: "sms",
    status: "sending",
    content: "We miss you! Come back for an exclusive 30% discount.",
    recipientCount: 856,
    sentCount: 423,
    deliveredCount: 415,
    openedCount: 0, // SMS doesn't track opens
    clickedCount: 89,
    unsubscribedCount: 3,
    bouncedCount: 8,
    createdBy: "user-1",
    createdAt: new Date("2026-07-24T08:00:00"),
    updatedAt: new Date("2026-07-24T14:30:00"),
  },
];

/**
 * Mock Workflows
 */
export const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Welcome Series - New Leads",
    description: "3-email welcome sequence for new leads",
    status: "active",
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        label: "New Lead Created",
        config: { event: "lead_created" },
        position: { x: 100, y: 100 },
        connections: ["node-2"],
      },
      {
        id: "node-2",
        type: "action",
        label: "Send Welcome Email",
        config: { actionType: "send_email", templateId: "welcome-1" },
        position: { x: 100, y: 200 },
        connections: ["node-3"],
      },
      {
        id: "node-3",
        type: "wait",
        label: "Wait 2 Days",
        config: { duration: 2, unit: "days" },
        position: { x: 100, y: 300 },
        connections: ["node-4"],
      },
      {
        id: "node-4",
        type: "condition",
        label: "Email Opened?",
        config: { field: "email_opened", operator: "equals", value: true },
        position: { x: 100, y: 400 },
        connections: ["node-5", "node-6"],
      },
      {
        id: "node-5",
        type: "action",
        label: "Send Follow-up Email",
        config: { actionType: "send_email", templateId: "follow-up-1" },
        position: { x: 50, y: 500 },
        connections: [],
      },
      {
        id: "node-6",
        type: "action",
        label: "Send Re-engagement Email",
        config: { actionType: "send_email", templateId: "reengagement-1" },
        position: { x: 150, y: 500 },
        connections: [],
      },
    ],
    enrolledCount: 1247,
    completedCount: 856,
    activeCount: 391,
    createdBy: "user-1",
    createdAt: new Date("2026-06-01T10:00:00"),
    updatedAt: new Date("2026-07-20T15:30:00"),
  },
  {
    id: "workflow-2",
    name: "Lead Scoring Auto-Assign",
    description: "Automatically assign hot leads to sales team",
    status: "active",
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        label: "Lead Score > 80",
        config: { event: "lead_score_changed", threshold: 80 },
        position: { x: 100, y: 100 },
        connections: ["node-2"],
      },
      {
        id: "node-2",
        type: "action",
        label: "Add Tag: Hot Lead",
        config: { actionType: "add_tag", tag: "hot-lead" },
        position: { x: 100, y: 200 },
        connections: ["node-3"],
      },
      {
        id: "node-3",
        type: "action",
        label: "Assign to Sales Team",
        config: { actionType: "assign", userId: "user-2" },
        position: { x: 100, y: 300 },
        connections: [],
      },
    ],
    enrolledCount: 234,
    completedCount: 234,
    activeCount: 0,
    createdBy: "user-2",
    createdAt: new Date("2026-05-15T09:00:00"),
    updatedAt: new Date("2026-07-23T11:20:00"),
  },
];

/**
 * Mock Opportunities
 */
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    leadId: "lead-2",
    title: "RetailCo - Marketing Automation Platform",
    value: 75000,
    stage: "proposal",
    probability: 70,
    assignedTo: "user-2",
    expectedCloseDate: new Date("2026-08-15"),
    notes: [
      "Initial call went well, they're interested in multi-channel campaigns",
      "Sent proposal on 7/20, waiting for feedback",
    ],
    createdAt: new Date("2026-07-18T10:30:00"),
    updatedAt: new Date("2026-07-24T09:45:00"),
  },
  {
    id: "opp-2",
    leadId: "lead-5",
    title: "EduTech Platform - Enterprise Plan",
    value: 120000,
    stage: "negotiation",
    probability: 85,
    assignedTo: "user-1",
    expectedCloseDate: new Date("2026-08-01"),
    businessBlumAccountId: undefined,
    notes: [
      "CEO is very interested, discussing custom pricing",
      "Need to schedule final demo with their tech team",
    ],
    createdAt: new Date("2026-07-12T14:20:00"),
    updatedAt: new Date("2026-07-24T11:30:00"),
  },
  {
    id: "opp-3",
    leadId: "lead-1",
    title: "TechCorp Solutions - CRM Integration",
    value: 50000,
    stage: "contacted",
    probability: 40,
    assignedTo: "user-1",
    expectedCloseDate: new Date("2026-09-01"),
    notes: ["Initial outreach complete, scheduled discovery call for next week"],
    createdAt: new Date("2026-07-20T16:00:00"),
    updatedAt: new Date("2026-07-22T10:15:00"),
  },
  {
    id: "opp-4",
    leadId: "lead-4",
    title: "Finance Solutions - BusinessBlum Premium",
    value: 85000,
    stage: "closed_won",
    probability: 100,
    assignedTo: "user-2",
    closedAt: new Date("2026-07-22T15:30:00"),
    businessBlumAccountId: "bb-account-123",
    notes: [
      "Deal closed! Customer signed contract",
      "BusinessBlum account created successfully",
    ],
    createdAt: new Date("2026-07-05T09:00:00"),
    updatedAt: new Date("2026-07-22T15:30:00"),
  },
];

/**
 * Mock Activities
 */
export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    type: "campaign_sent",
    title: "Campaign Sent: Re-engagement Campaign",
    description: "Sent to 856 recipients via SMS",
    entityId: "campaign-3",
    entityType: "campaign",
    userId: "user-1",
    metadata: {
      campaignName: "Re-engagement Campaign",
      channel: "sms",
      recipients: 856,
    },
    createdAt: new Date("2026-07-24T08:00:00"),
  },
  {
    id: "activity-2",
    type: "lead_created",
    title: "New Lead Added",
    description: "John Doe from TechCorp Solutions",
    entityId: "lead-1",
    entityType: "lead",
    metadata: {
      leadName: "John Doe",
      company: "TechCorp Solutions",
      source: "email_inbound",
    },
    createdAt: new Date("2026-07-20T10:30:00"),
  },
  {
    id: "activity-3",
    type: "opportunity_closed",
    title: "Deal Closed Won",
    description: "Finance Solutions - BusinessBlum Premium ($85,000)",
    entityId: "opp-4",
    entityType: "opportunity",
    userId: "user-2",
    metadata: {
      value: 85000,
      businessBlumAccountId: "bb-account-123",
    },
    createdAt: new Date("2026-07-22T15:30:00"),
  },
  {
    id: "activity-4",
    type: "workflow_triggered",
    title: "Workflow Started",
    description: "47 leads enrolled in 'Welcome Series - New Leads'",
    entityId: "workflow-1",
    entityType: "workflow",
    metadata: {
      workflowName: "Welcome Series - New Leads",
      enrolledCount: 47,
    },
    createdAt: new Date("2026-07-24T06:00:00"),
  },
  {
    id: "activity-5",
    type: "campaign_opened",
    title: "High Engagement Detected",
    description: "Summer Sale campaign: 1,034 opens (43% open rate)",
    entityId: "campaign-1",
    entityType: "campaign",
    metadata: {
      campaignName: "Summer Sale 2026",
      opens: 1034,
      openRate: 43,
    },
    createdAt: new Date("2026-07-15T14:22:00"),
  },
];

/**
 * Helper function to get a random subset of leads
 */
export function getRandomLeads(count: number = 5): Lead[] {
  const shuffled = [...mockLeads].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, mockLeads.length));
}

/**
 * Helper function to filter leads by status
 */
export function getLeadsByStatus(status: Lead["status"]): Lead[] {
  return mockLeads.filter((lead) => lead.status === status);
}

/**
 * Helper function to get hot leads (score > 80)
 */
export function getHotLeads(): Lead[] {
  return mockLeads.filter((lead) => lead.status === "qualified" || lead.status === "engaged");
}

/**
 * Helper function to get opportunities by stage
 */
export function getOpportunitiesByStage(stage: Opportunity["stage"]): Opportunity[] {
  return mockOpportunities.filter((opp) => opp.stage === stage);
}

/**
 * Helper function to get recent activities
 */
export function getRecentActivities(count: number = 10): Activity[] {
  return mockActivities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, count);
}

/**
 * Mock Campaign Performance Data (for analytics charts)
 */
export const mockCampaignPerformanceData = [
  { date: "Week 1", opens: 245, clicks: 89, conversions: 23 },
  { date: "Week 2", opens: 312, clicks: 124, conversions: 34 },
  { date: "Week 3", opens: 287, clicks: 98, conversions: 28 },
  { date: "Week 4", opens: 356, clicks: 142, conversions: 41 },
];

/**
 * Mock Lead Source Data (for analytics charts)
 */
export const mockLeadSourceData = [
  { source: "Email Inbound", count: 456, percentage: 42 },
  { source: "SMS Inbound", count: 234, percentage: 22 },
  { source: "CSV Import", count: 189, percentage: 17 },
  { source: "Form Submission", count: 123, percentage: 11 },
  { source: "Other", count: 87, percentage: 8 },
];
