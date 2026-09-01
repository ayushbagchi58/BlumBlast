// Conversation Utilities - AI-powered message parsing and automation

import type { Message, Lead } from "@/lib/types";

// ─── Sentiment Analysis ───────────────────────────────────────────────────────

/**
 * Analyze message sentiment using keyword matching
 * In production, this would use an AI API (OpenAI, Anthropic, etc.)
 */
export function analyzeSentiment(message: string): "positive" | "neutral" | "negative" {
  const text = message.toLowerCase();

  // Positive indicators
  const positiveKeywords = [
    "thanks",
    "thank you",
    "great",
    "perfect",
    "excellent",
    "love",
    "interested",
    "yes",
    "sure",
    "definitely",
    "sounds good",
    "appreciate",
    "awesome",
    "wonderful",
    "fantastic",
    "pleased",
  ];

  // Negative indicators
  const negativeKeywords = [
    "no",
    "not interested",
    "cancel",
    "unsubscribe",
    "stop",
    "remove",
    "disappointed",
    "terrible",
    "awful",
    "bad",
    "poor",
    "never",
    "unfortunately",
    "complaint",
  ];

  const positiveCount = positiveKeywords.filter((keyword) => text.includes(keyword)).length;
  const negativeCount = negativeKeywords.filter((keyword) => text.includes(keyword)).length;

  if (negativeCount > positiveCount) return "negative";
  if (positiveCount > negativeCount) return "positive";
  return "neutral";
}

// ─── Intent Detection ─────────────────────────────────────────────────────────

/**
 * Detect what the lead is asking about
 * Returns intent keywords for routing/automation
 */
export function detectIntent(message: string): string | undefined {
  const text = message.toLowerCase();

  // Intent mapping
  const intentPatterns: Record<string, string[]> = {
    business_loan: ["business loan", "small business", "sba loan", "business funding"],
    startup_funding: ["startup", "new business", "entrepreneur", "startup funding"],
    equipment_financing: ["equipment", "machinery", "tools", "equipment financing"],
    construction_loan: ["construction", "real estate", "building", "property"],
    working_capital: ["working capital", "cash flow", "payroll", "operating expenses"],
    pricing_question: ["price", "cost", "rate", "fee", "interest", "apr"],
    application_question: ["apply", "application", "qualify", "approval", "process"],
    general_question: ["how", "what", "when", "where", "why", "tell me"],
  };

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return intent;
      }
    }
  }

  return undefined;
}

// ─── Requires Response Detection ──────────────────────────────────────────────

/**
 * Determine if message requires human response
 * Questions, concerns, negative sentiment = requires response
 */
export function requiresResponse(message: string): boolean {
  const text = message.toLowerCase();

  // Question indicators
  const hasQuestion =
    text.includes("?") ||
    text.startsWith("how ") ||
    text.startsWith("what ") ||
    text.startsWith("when ") ||
    text.startsWith("where ") ||
    text.startsWith("why ") ||
    text.startsWith("can ") ||
    text.startsWith("could ") ||
    text.startsWith("would ") ||
    text.includes("help") ||
    text.includes("question");

  // Urgent indicators
  const isUrgent =
    text.includes("urgent") ||
    text.includes("asap") ||
    text.includes("immediately") ||
    text.includes("right now");

  // Negative sentiment
  const sentiment = analyzeSentiment(message);
  const isNegative = sentiment === "negative";

  return hasQuestion || isUrgent || isNegative;
}

// ─── Auto-Reply Generation ────────────────────────────────────────────────────

/**
 * Generate automatic reply based on message content
 * In production, this would use GPT-4/Claude for intelligent responses
 */
export function generateAutoReply(message: string, leadName: string): string | null {
  const text = message.toLowerCase();
  const intent = detectIntent(message);

  // Simple FAQ responses
  if (intent === "pricing_question") {
    return `Hi ${leadName}, great question! Our rates vary based on loan type and amount. For business loans, rates typically start at 7.5% APR for qualified applicants. Would you like me to connect you with a specialist who can provide a personalized quote?`;
  }

  if (intent === "application_question") {
    return `Hi ${leadName}! Our application process is quick and easy:\n\n1. Complete online application (10 minutes)\n2. Submit documents\n3. Get decision within 24-48 hours\n\nMost loans under $25k get instant pre-approval. Ready to get started?`;
  }

  // Positive sentiment - thank you message
  if (text.includes("thank") || text.includes("thanks")) {
    return `You're welcome, ${leadName}! We're here if you need anything else. 😊`;
  }

  // Negative sentiment - escalate to human
  const sentiment = analyzeSentiment(message);
  if (sentiment === "negative") {
    return null; // Don't auto-reply, needs human attention
  }

  // Default: acknowledge and offer help
  if (requiresResponse(message)) {
    return `Hi ${leadName}, thanks for your message! A team member will get back to you shortly. In the meantime, feel free to explore our resources at businessblum.com.`;
  }

  return null; // No auto-reply needed
}

// ─── Message Personalization ──────────────────────────────────────────────────

/**
 * Replace template variables with lead data
 * Example: "Hi {{firstName}}" → "Hi John"
 */
export function personalizeMessage(template: string, lead: Lead): string {
  let personalized = template;

  const replacements: Record<string, string> = {
    "{{firstName}}": lead.firstName,
    "{{lastName}}": lead.lastName,
    "{{fullName}}": `${lead.firstName} ${lead.lastName}`,
    "{{email}}": lead.email,
    "{{phone}}": lead.phone,
    "{{company}}": lead.company || "your business",
    "{{fundingAmount}}": lead.fundingAmount || "$50,000",
    "{{intent}}": lead.intent?.replace(/_/g, " ") || "business funding",
    "{{leadId}}": lead.id,
  };

  for (const [variable, value] of Object.entries(replacements)) {
    personalized = personalized.replace(new RegExp(variable, "g"), value);
  }

  return personalized;
}

// ─── Lead Score Update based on Message ───────────────────────────────────────

/**
 * Calculate score impact based on message engagement
 */
export function calculateMessageScoreImpact(message: Message): number {
  let scoreImpact = 0;

  // Inbound messages = engagement
  if (message.sender === "lead") {
    scoreImpact += 5; // Base engagement score

    // Positive sentiment = higher score
    if (message.sentiment === "positive") {
      scoreImpact += 5;
    }

    // Question shows interest
    if (message.body.includes("?")) {
      scoreImpact += 3;
    }

    // Mentioned specific intent
    if (message.intent) {
      scoreImpact += 5;
    }
  }

  // Outbound message clicked/opened
  if (message.sender === "agent") {
    if (message.readAt) {
      scoreImpact += 2; // Read = mild engagement
    }
    if (message.repliedAt) {
      scoreImpact += 10; // Reply = strong engagement
    }
  }

  return scoreImpact;
}

// ─── Conversation Quality Metrics ─────────────────────────────────────────────

/**
 * Calculate conversation health metrics
 */
export function calculateConversationMetrics(messages: Message[]) {
  const totalMessages = messages.length;
  const inboundMessages = messages.filter((m) => m.sender === "lead").length;
  const outboundMessages = messages.filter((m) => m.sender === "agent").length;

  const responseRate = totalMessages > 0 ? (inboundMessages / totalMessages) * 100 : 0;

  // Average response time (mock - in production, calculate actual time between messages)
  const avgResponseTime = "2h 30m"; // Mock value

  // Sentiment distribution
  const positiveCount = messages.filter((m) => m.sentiment === "positive").length;
  const neutralCount = messages.filter((m) => m.sentiment === "neutral").length;
  const negativeCount = messages.filter((m) => m.sentiment === "negative").length;

  return {
    totalMessages,
    inboundMessages,
    outboundMessages,
    responseRate: Math.round(responseRate),
    avgResponseTime,
    sentiment: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
    },
  };
}

// ─── Smart Reply Suggestions ──────────────────────────────────────────────────

/**
 * Generate quick reply suggestions for agents
 */
export function generateReplySuggestions(
  lastMessage: Message,
  leadName: string
): string[] {
  const text = lastMessage.body.toLowerCase();
  const suggestions: string[] = [];

  // Question about rates
  if (text.includes("rate") || text.includes("interest") || text.includes("apr")) {
    suggestions.push(
      `Hi ${leadName}, our rates start at 7.5% APR for qualified applicants. Would you like a personalized quote?`
    );
    suggestions.push(
      `Great question! Rates vary by loan type. Let me connect you with a specialist for exact numbers.`
    );
  }

  // Question about timeline
  else if (
    text.includes("how long") ||
    text.includes("when") ||
    text.includes("timeline")
  ) {
    suggestions.push(
      `Most applications are approved within 24-48 hours, ${leadName}. Ready to get started?`
    );
    suggestions.push(
      `We can get you pre-approved in as little as 10 minutes for loans under $25k!`
    );
  }

  // Expressed interest
  else if (
    text.includes("interested") ||
    text.includes("yes") ||
    text.includes("sounds good")
  ) {
    suggestions.push(
      `Fantastic! Here's the next step: [link to application]. Let me know if you need any help!`
    );
    suggestions.push(`Great! I'll send over the application link and guide you through it.`);
  }

  // Default suggestions
  else {
    suggestions.push(`Thanks for reaching out, ${leadName}! How can I help you today?`);
    suggestions.push(
      `Hi ${leadName}, I'd be happy to answer any questions about our funding options.`
    );
    suggestions.push(`Let me connect you with a specialist who can help with that!`);
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

// ─── Unsubscribe/Opt-out Detection ────────────────────────────────────────────

/**
 * Check if message contains unsubscribe request
 */
export function isUnsubscribeRequest(message: string): boolean {
  const text = message.toLowerCase();
  const unsubscribeKeywords = [
    "unsubscribe",
    "opt out",
    "opt-out",
    "remove me",
    "stop emailing",
    "stop texting",
    "stop messaging",
    "take me off",
    "no longer interested",
    "stop",
    "cancel",
  ];

  return unsubscribeKeywords.some((keyword) => text.includes(keyword));
}

// ─── Spam Detection ───────────────────────────────────────────────────────────

/**
 * Basic spam detection
 */
export function isLikelySpam(message: string): boolean {
  const text = message.toLowerCase();

  // Spam indicators
  const spamKeywords = [
    "click here now",
    "limited time offer",
    "act now",
    "free money",
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations you won",
  ];

  const hasSpamKeywords = spamKeywords.some((keyword) => text.includes(keyword));

  // Too many links
  const linkCount = (text.match(/http/g) || []).length;
  const hasTooManyLinks = linkCount > 3;

  // All caps
  const capsPercentage = (message.match(/[A-Z]/g) || []).length / message.length;
  const isMostlyCaps = capsPercentage > 0.5 && message.length > 20;

  return hasSpamKeywords || hasTooManyLinks || isMostlyCaps;
}
