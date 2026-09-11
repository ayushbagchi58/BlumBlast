/**
 * Lead Scoring Utilities
 * Calculates engagement and fit scores for leads
 */

import type { Lead, LeadEngagement } from "@/lib/types";

export function calculateEngagementScore(
  lead: Lead,
  engagements: LeadEngagement[] = []
): number {
  let score = 0;

  if (engagements.length > 0) {
    score += 5;
  }

  engagements.forEach((engagement) => {
    switch (engagement.type) {
      case "email_opened":
        score += 3;
        break;
      case "email_clicked":
        score += 7;
        break;
      case "sms_replied":
        score += 12;
        break;
      case "link_clicked":
        score += 8;
        break;
      case "form_submitted":
        score += 15;
        break;
      default:
        score += 2;
    }
  });

  if (engagements.length >= 3) {
    score += 10;
  }

  const recentEngagements = engagements.filter((e) => {
    const hoursSince = (Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSince <= 24;
  });

  if (recentEngagements.length > 0) {
    score += 5;
  }

  return Math.min(score, 60);
}

export function calculateFitScore(lead: Lead): number {
  let score = 0;

  if (lead.fundingAmount && lead.fundingAmount.trim() !== "") {
    score += 10;
  }

  if (lead.company && lead.company.trim() !== "") {
    score += 10;
  }

  if (lead.message && lead.message.length > 50) {
    score += 10;
  }

  // Fast response (<1 hour from creation)
  if (lead.lastActivityAt) {
    const hoursToFirstActivity =
      (new Date(lead.lastActivityAt).getTime() - new Date(lead.createdAt).getTime()) /
      (1000 * 60 * 60);
    
    if (hoursToFirstActivity <= 1) {
      score += 10;
    }
  }

  return Math.min(score, 40);
}

export function calculateLeadScore(
  lead: Lead,
  engagements: LeadEngagement[] = []
): number {
  const engagementScore = calculateEngagementScore(lead, engagements);
  const fitScore = calculateFitScore(lead);
  return engagementScore + fitScore;
}

export function getLeadTemperature(score: number): "hot" | "warm" | "cool" | "cold" {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  if (score >= 40) return "cool";
  return "cold";
}

export function updateLeadScores(
  lead: Lead,
  engagements: LeadEngagement[] = []
): Lead {
  const engagementScore = calculateEngagementScore(lead, engagements);
  const fitScore = calculateFitScore(lead);
  const totalScore = engagementScore + fitScore;
  const temperature = getLeadTemperature(totalScore);

  return {
    ...lead,
    score: totalScore,
    engagementScore,
    fitScore,
    temperature,
    updatedAt: new Date(),
  };
}

export function generateSignupUrl(lead: Lead): string {
  const baseUrl = "https://businessblum.com/login";
  
  // Add UTM parameters for tracking
  const params = new URLSearchParams({
    utm_source: "blumblast",
    utm_medium: lead.source,
    utm_campaign: "lead_conversion",
    lead_id: lead.id,
    // Pre-fill parameters if API supports it
    email: lead.email,
    phone: lead.phone,
    ...(lead.firstName && { first_name: lead.firstName }),
    ...(lead.lastName && { last_name: lead.lastName }),
    ...(lead.company && { company: lead.company }),
  });

  return `${baseUrl}?${params.toString()}`;
}

export function getRecommendedActions(lead: Lead): Array<{
  action: string;
  priority: "high" | "medium" | "low";
  description: string;
}> {
  const actions: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    description: string;
  }> = [];

  if (!lead.score) return actions;

  if (lead.temperature === "hot") {
    actions.push({
      action: "Call Immediately",
      priority: "high",
      description: "High engagement - convert to opportunity now",
    });
    
    if (!lead.clickedSignupLink) {
      actions.push({
        action: "Send Signup Link",
        priority: "high",
        description: "Direct them to BusinessBlum portal",
      });
    }
  }

  if (lead.temperature === "warm") {
    actions.push({
      action: "Follow Up Today",
      priority: "high",
      description: "Good engagement - schedule call within 24 hours",
    });
    
    if (!lead.nurtureSequenceId) {
      actions.push({
        action: "Enroll in Nurture",
        priority: "medium",
        description: "Add to automated follow-up sequence",
      });
    }
  }

  if (lead.temperature === "cool") {
    actions.push({
      action: "Send Educational Content",
      priority: "medium",
      description: "Share information about their loan type",
    });
  }

  if (lead.temperature === "cold") {
    actions.push({
      action: "Re-engagement Campaign",
      priority: "low",
      description: "Try to warm them up with targeted content",
    });
  }

  const daysSinceActivity = lead.lastActivityAt
    ? (Date.now() - new Date(lead.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
    : 999;

  if (daysSinceActivity > 7) {
    actions.push({
      action: "Re-engagement Needed",
      priority: "medium",
      description: "No activity in 7+ days - send check-in message",
    });
  }

  return actions;
}
