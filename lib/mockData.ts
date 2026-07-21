/**
 * Mock Data for Frontend Development
 * This file contains sample data to use while backend is being developed
 */

import type { User, Lead, Campaign, Opportunity, Activity } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    role: "user",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    role: "user",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
];

export const mockLeads: Lead[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Corp",
    status: "new",
    source: "Website",
    tags: ["Enterprise", "High Priority"],
    score: 85,
    assignedTo: "1",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Williams",
    email: "bob.williams@startup.io",
    phone: "+1 (555) 234-5678",
    company: "Startup Inc",
    status: "contacted",
    source: "LinkedIn",
    tags: ["SMB"],
    score: 65,
    assignedTo: "2",
    createdAt: "2026-02-02T10:00:00Z",
    updatedAt: "2026-02-03T10:00:00Z",
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@business.com",
    phone: "+1 (555) 345-6789",
    company: "Business Solutions",
    status: "qualified",
    source: "Referral",
    tags: ["Enterprise", "Decision Maker"],
    score: 92,
    assignedTo: "1",
    createdAt: "2026-02-03T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Email Series",
    type: "email",
    status: "active",
    subject: "Welcome to BlumBlast!",
    content: "Thank you for signing up...",
    targetAudience: {
      segmentId: "new-users",
    },
    metrics: {
      sent: 1250,
      delivered: 1200,
      opened: 720,
      clicked: 240,
      converted: 48,
    },
    createdBy: "1",
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Product Launch SMS",
    type: "sms",
    status: "completed",
    content: "New feature alert! Check it out now.",
    targetAudience: {
      segmentId: "active-users",
    },
    metrics: {
      sent: 500,
      delivered: 495,
      opened: 450,
      clicked: 180,
      converted: 35,
    },
    createdBy: "2",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    type: "email",
    status: "draft",
    subject: "We miss you!",
    content: "Come back and see what's new...",
    targetAudience: {
      segmentId: "inactive-users",
    },
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
    },
    createdBy: "1",
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Enterprise Deal - Tech Corp",
    leadId: "1",
    stage: "proposal",
    value: 50000,
    probability: 75,
    expectedCloseDate: "2026-03-15",
    assignedTo: "1",
    notes: "Strong interest, waiting for final approval",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "2",
    title: "SMB Package - Startup Inc",
    leadId: "2",
    stage: "negotiation",
    value: 15000,
    probability: 60,
    expectedCloseDate: "2026-02-28",
    assignedTo: "2",
    notes: "Price negotiation in progress",
    createdAt: "2026-02-03T10:00:00Z",
    updatedAt: "2026-02-12T10:00:00Z",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "email",
    title: "Sent proposal to Tech Corp",
    description: "Enterprise package proposal sent",
    relatedTo: {
      type: "opportunity",
      id: "1",
    },
    createdBy: "1",
    createdAt: "2026-02-10T14:30:00Z",
  },
  {
    id: "2",
    type: "call",
    title: "Follow-up call with Bob Williams",
    description: "Discussed pricing and implementation timeline",
    relatedTo: {
      type: "lead",
      id: "2",
    },
    createdBy: "2",
    createdAt: "2026-02-12T10:15:00Z",
  },
  {
    id: "3",
    type: "note",
    title: "Decision maker meeting scheduled",
    description: "Carol Davis agreed to demo on Feb 20",
    relatedTo: {
      type: "lead",
      id: "3",
    },
    createdBy: "1",
    createdAt: "2026-02-13T16:45:00Z",
  },
];

export const mockDashboardMetrics = {
  newLeadsToday: 12,
  totalLeads: 1247,
  activeCampaigns: 5,
  totalCampaigns: 23,
  openDeals: 8,
  totalDealsValue: 125000,
  conversionRate: 3.8,
  revenueThisMonth: 45000,
};

export const mockCampaignPerformanceData = [
  { month: "Jan", email: 65, sms: 45, push: 30 },
  { month: "Feb", email: 72, sms: 52, push: 35 },
  { month: "Mar", email: 68, sms: 48, push: 32 },
  { month: "Apr", email: 78, sms: 55, push: 40 },
  { month: "May", email: 85, sms: 62, push: 45 },
  { month: "Jun", email: 90, sms: 68, push: 50 },
];

export const mockLeadSourceData = [
  { source: "Website", count: 450, percentage: 36 },
  { source: "LinkedIn", count: 320, percentage: 26 },
  { source: "Referral", count: 280, percentage: 22 },
  { source: "Direct", count: 150, percentage: 12 },
  { source: "Other", count: 47, percentage: 4 },
];
