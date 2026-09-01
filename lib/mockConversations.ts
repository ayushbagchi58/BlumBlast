// Mock Conversations and Messages Data
// Realistic email/SMS threads for testing inbox functionality

import type { Conversation, Message, Campaign, CampaignAnalytics } from "./types";

// ─── Mock Messages ────────────────────────────────────────────────────────────

export const mockMessages: Message[] = [
  // Conversation 1: John Doe - Email Thread (Hot Lead)
  {
    id: "msg-1",
    conversationId: "conv-1",
    leadId: "lead-1",
    channel: "email",
    sender: "lead",
    type: "inbound",
    subject: "Business loan inquiry",
    body: "Hi, I'm looking for a $50,000 business loan to expand my restaurant. Can you help?",
    status: "read",
    sentiment: "positive",
    intent: "business_loan",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    deliveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    leadId: "lead-1",
    channel: "email",
    sender: "agent",
    type: "automated",
    subject: "Re: Business loan inquiry",
    body: "Hi John, thanks for reaching out! We'd love to help you expand your restaurant. I've attached our business loan guide. Can you share more details about your revenue and how long you've been in business?",
    status: "delivered",
    sequenceId: "seq-business-loan",
    sequenceStepIndex: 1,
    automationTriggered: true,
    sentAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    leadId: "lead-1",
    channel: "email",
    sender: "lead",
    type: "inbound",
    subject: "Re: Business loan inquiry",
    body: "Great! We've been in business for 4 years with $300k annual revenue. When can we get started?",
    status: "read",
    sentiment: "positive",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    deliveredAt: new Date(Date.now() - 30 * 60 * 1000),
    readAt: new Date(Date.now() - 15 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },

  // Conversation 2: Sarah Smith - SMS Thread (Warm Lead)
  {
    id: "msg-4",
    conversationId: "conv-2",
    leadId: "lead-2",
    channel: "sms",
    sender: "lead",
    type: "inbound",
    body: "Hi, I saw your ad about startup funding. I need $30k for my tech startup. What are the requirements?",
    status: "read",
    sentiment: "neutral",
    intent: "startup_funding",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    deliveredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "msg-5",
    conversationId: "conv-2",
    leadId: "lead-2",
    channel: "sms",
    sender: "agent",
    type: "automated",
    body: "Hi Sarah! For startup funding, we typically need: 1) Business plan 2) Financial projections 3) Credit score 600+. Does this work for you?",
    status: "delivered",
    sequenceId: "seq-startup-funding",
    sequenceStepIndex: 1,
    automationTriggered: true,
    sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "msg-6",
    conversationId: "conv-2",
    leadId: "lead-2",
    channel: "sms",
    sender: "lead",
    type: "inbound",
    body: "Yes, I have all of those. My credit score is 720. What's next?",
    status: "read",
    sentiment: "positive",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    deliveredAt: new Date(Date.now() - 10 * 60 * 1000),
    readAt: new Date(Date.now() - 5 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },

  // Conversation 3: Mike Johnson - Facebook Messenger (Cold Lead)
  {
    id: "msg-7",
    conversationId: "conv-3",
    leadId: "lead-3",
    channel: "facebook",
    sender: "lead",
    type: "inbound",
    body: "What are your interest rates for equipment financing?",
    status: "read",
    sentiment: "neutral",
    intent: "equipment_financing",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    deliveredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "msg-8",
    conversationId: "conv-3",
    leadId: "lead-3",
    channel: "facebook",
    sender: "agent",
    type: "automated",
    body: "Hi Mike! Our equipment financing rates start at 7.5% APR for qualified applicants. What type of equipment are you looking to finance?",
    status: "delivered",
    sequenceId: "seq-equipment-financing",
    sequenceStepIndex: 1,
    automationTriggered: true,
    sentAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },

  // Conversation 4: Emily Davis - WhatsApp (Hot Lead)
  {
    id: "msg-9",
    conversationId: "conv-4",
    leadId: "lead-4",
    channel: "whatsapp",
    sender: "lead",
    type: "inbound",
    body: "Hello! I clicked your signup link but have a question about the application process. How long does approval take?",
    status: "read",
    sentiment: "positive",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "msg-10",
    conversationId: "conv-4",
    leadId: "lead-4",
    channel: "whatsapp",
    sender: "agent",
    type: "automated",
    body: "Hi Emily! Most applications are approved within 24-48 hours. You'll get an instant decision for amounts under $25k. Need any help with your application?",
    status: "delivered",
    sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 45 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "msg-11",
    conversationId: "conv-4",
    leadId: "lead-4",
    channel: "whatsapp",
    sender: "lead",
    type: "inbound",
    body: "Perfect! I'm applying for $20k. Just submitted my application.",
    status: "read",
    sentiment: "positive",
    requiresResponse: false,
    sentAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    deliveredAt: new Date(Date.now() - 5 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },

  // Conversation 5: David Wilson - Email (Negative Response)
  {
    id: "msg-12",
    conversationId: "conv-5",
    leadId: "lead-5",
    channel: "email",
    sender: "lead",
    type: "inbound",
    subject: "SBA loan information",
    body: "I'm interested in SBA loans but not sure if I qualify. My credit is around 580.",
    status: "read",
    sentiment: "neutral",
    intent: "sba_loan",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "msg-13",
    conversationId: "conv-5",
    leadId: "lead-5",
    channel: "email",
    sender: "agent",
    type: "automated",
    subject: "Re: SBA loan information",
    body: "Hi David, thanks for your interest! SBA loans typically require a minimum credit score of 640. However, we have other options that might work for you. Would you like to explore alternative financing?",
    status: "delivered",
    sequenceId: "seq-sba-loan",
    sequenceStepIndex: 1,
    automationTriggered: true,
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "msg-14",
    conversationId: "conv-5",
    leadId: "lead-5",
    channel: "email",
    sender: "lead",
    type: "inbound",
    subject: "Re: SBA loan information",
    body: "No thanks, I'll work on improving my credit first. Please remove me from your list.",
    status: "read",
    sentiment: "negative",
    requiresResponse: false,
    sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 45 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },

  // Conversation 6: Lisa Anderson - SMS (Campaign Reply)
  {
    id: "msg-15",
    conversationId: "conv-6",
    leadId: "lead-6",
    channel: "sms",
    sender: "agent",
    type: "outbound",
    body: "Hi Lisa! Special Q4 offer: Get pre-approved for business funding in 10 minutes. Apply now: [link]",
    status: "delivered",
    campaignId: "camp-1",
    sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    deliveredAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "msg-16",
    conversationId: "conv-6",
    leadId: "lead-6",
    channel: "sms",
    sender: "lead",
    type: "inbound",
    body: "This sounds great! What's the maximum amount I can get?",
    status: "read",
    sentiment: "positive",
    requiresResponse: true,
    sentAt: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
    deliveredAt: new Date(Date.now() - 20 * 60 * 1000),
    readAt: new Date(Date.now() - 15 * 60 * 1000),
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
  },
];

// ─── Mock Conversations ───────────────────────────────────────────────────────

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    leadId: "lead-1",
    leadName: "John Doe",
    leadEmail: "john@restaurant.com",
    leadPhone: "+1-555-0101",
    channel: "email",
    subject: "Business loan inquiry",
    status: "open",
    assignedTo: "user-1",
    messageCount: 3,
    unreadCount: 1,
    lastMessagePreview: "Great! We've been in business for 4 years with $300k annual revenue...",
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    lastMessageSender: "lead",
    leadStatus: "engaged",
    leadScore: 85,
    leadTemperature: "hot",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "conv-2",
    leadId: "lead-2",
    leadName: "Sarah Smith",
    leadEmail: "sarah@techstartup.com",
    leadPhone: "+1-555-0102",
    channel: "sms",
    status: "open",
    messageCount: 3,
    unreadCount: 1,
    lastMessagePreview: "Yes, I have all of those. My credit score is 720. What's next?",
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    lastMessageSender: "lead",
    leadStatus: "engaged",
    leadScore: 72,
    leadTemperature: "warm",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "conv-3",
    leadId: "lead-3",
    leadName: "Mike Johnson",
    leadEmail: "mike@construction.com",
    leadPhone: "+1-555-0103",
    channel: "facebook",
    status: "open",
    messageCount: 2,
    unreadCount: 0,
    lastMessagePreview: "Hi Mike! Our equipment financing rates start at 7.5% APR...",
    lastMessageAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    lastMessageSender: "agent",
    leadStatus: "contacted",
    leadScore: 45,
    leadTemperature: "cool",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },
  {
    id: "conv-4",
    leadId: "lead-4",
    leadName: "Emily Davis",
    leadEmail: "emily@boutique.com",
    leadPhone: "+1-555-0104",
    channel: "whatsapp",
    status: "open",
    messageCount: 3,
    unreadCount: 1,
    lastMessagePreview: "Perfect! I'm applying for $20k. Just submitted my application.",
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    lastMessageSender: "lead",
    leadStatus: "qualified",
    leadScore: 92,
    leadTemperature: "hot",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "conv-5",
    leadId: "lead-5",
    leadName: "David Wilson",
    leadEmail: "david@retail.com",
    channel: "email",
    subject: "SBA loan information",
    status: "resolved",
    messageCount: 3,
    unreadCount: 0,
    lastMessagePreview: "No thanks, I'll work on improving my credit first...",
    lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    lastMessageSender: "lead",
    leadStatus: "unqualified",
    leadScore: 28,
    leadTemperature: "cold",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "conv-6",
    leadId: "lead-6",
    leadName: "Lisa Anderson",
    leadEmail: "lisa@consulting.com",
    leadPhone: "+1-555-0106",
    channel: "sms",
    status: "open",
    messageCount: 2,
    unreadCount: 1,
    lastMessagePreview: "This sounds great! What's the maximum amount I can get?",
    lastMessageAt: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
    lastMessageSender: "lead",
    leadStatus: "new",
    leadScore: 58,
    leadTemperature: "warm",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000),
  },
];

// ─── Mock Campaigns ───────────────────────────────────────────────────────────

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Q4 Special Funding Offer",
    channel: "sms",
    status: "sent",
    content: "Hi {{firstName}}! Special Q4 offer: Get pre-approved for business funding in 10 minutes. Apply now: https://businessblum.com/apply?ref={{leadId}}",
    recipientCount: 1234,
    sentCount: 1234,
    deliveredCount: 1198,
    openedCount: 0, // SMS doesn't track opens
    clickedCount: 234,
    unsubscribedCount: 12,
    bouncedCount: 36,
    sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "camp-2",
    name: "Year-End Equipment Financing",
    channel: "email",
    status: "sent",
    subject: "🎄 Special Year-End Equipment Financing Rates",
    content: "<p>Hi {{firstName}},</p><p>Get 0% APR for 6 months on equipment financing...</p>",
    recipientCount: 567,
    sentCount: 567,
    deliveredCount: 545,
    openedCount: 298,
    clickedCount: 87,
    unsubscribedCount: 8,
    bouncedCount: 22,
    sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "camp-3",
    name: "Startup Funding Webinar Invitation",
    channel: "email",
    status: "scheduled",
    subject: "You're invited: Startup Funding Masterclass",
    content: "<p>Hi {{firstName}},</p><p>Join our live webinar on securing startup funding...</p>",
    recipientCount: 892,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    unsubscribedCount: 0,
    bouncedCount: 0,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

// ─── Mock Campaign Analytics ──────────────────────────────────────────────────

export const mockCampaignAnalytics: CampaignAnalytics[] = [
  {
    campaignId: "camp-1",
    sent: 1234,
    totalSent: 1234,
    delivered: 1198,
    opened: 0,
    clicked: 234,
    replied: 67,
    unsubscribed: 12,
    bounced: 36,
    deliveryRate: 97.1,
    openRate: 0,
    clickRate: 19.5,
    clickToOpenRate: 0,
    replyRate: 5.6,
    unsubscribeRate: 1.0,
    bounceRate: 2.9,
    conversions: 23,
    revenue: 1150000,
    topLinks: [
      { url: "https://businessblum.com/apply", clicks: 187, percentage: 79.9 },
      { url: "https://businessblum.com/rates", clicks: 47, percentage: 20.1 },
    ],
    deviceBreakdown: { desktop: 45, mobile: 50, tablet: 5 },
    timeSeriesData: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    campaignId: "camp-2",
    sent: 567,
    totalSent: 567,
    delivered: 545,
    opened: 298,
    clicked: 87,
    replied: 34,
    unsubscribed: 8,
    bounced: 22,
    deliveryRate: 96.1,
    openRate: 54.7,
    clickRate: 16.0,
    clickToOpenRate: 29.2,
    replyRate: 6.2,
    unsubscribeRate: 1.5,
    bounceRate: 3.9,
    conversions: 12,
    revenue: 480000,
    topLinks: [
      { url: "https://businessblum.com/equipment", clicks: 65, percentage: 74.7 },
      { url: "https://businessblum.com/contact", clicks: 22, percentage: 25.3 },
    ],
    deviceBreakdown: { desktop: 60, mobile: 35, tablet: 5 },
    timeSeriesData: [],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Get messages for a specific conversation
 */
export function getMessagesByConversationId(conversationId: string): Message[] {
  return mockMessages
    .filter((msg) => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

/**
 * Get messages for a specific lead
 */
export function getMessagesByLeadId(leadId: string): Message[] {
  return mockMessages
    .filter((msg) => msg.leadId === leadId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

/**
 * Get conversation by lead ID
 */
export function getConversationByLeadId(leadId: string): Conversation | undefined {
  return mockConversations.find((conv) => conv.leadId === leadId);
}

/**
 * Get total unread count across all conversations
 */
export function getTotalUnreadCount(): number {
  return mockConversations.reduce((total, conv) => total + conv.unreadCount, 0);
}

/**
 * Get conversations that need reply (last message from lead + requiresResponse)
 */
export function getConversationsNeedingReply(): Conversation[] {
  return mockConversations.filter((conv) => {
    const messages = getMessagesByConversationId(conv.id);
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.sender === "lead" && lastMessage?.requiresResponse;
  });
}
