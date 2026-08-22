/**
 * Pre-built Nurture Sequences for Lead Conversion
 * Automated follow-up sequences based on lead intent
 */

import type { NurtureSequence } from "@/lib/types";

export const defaultNurtureSequences: NurtureSequence[] = [
  {
    id: "business-loan-sequence",
    name: "Business Loan Inquiry Follow-Up",
    description: "Automated sequence for business loan inquiries with educational content and conversion prompts",
    triggerIntent: "business_loan",
    steps: [
      {
        id: "step-1",
        order: 1,
        type: "email",
        delayHours: 0, // Immediate
        subject: "Thanks for Your Business Loan Inquiry, {firstName}!",
        content: `Hi {firstName},

Thank you for reaching out about business funding! I wanted to personally acknowledge your inquiry and let you know we're here to help.

At BusinessBlum, we connect businesses like {company} with over 200+ institutional lending partners to find you the best funding options - whether you need {fundingAmount} or are still exploring your options.

🚀 What makes BusinessBlum different:
• AI-powered matching with 200+ lenders
• Approval decisions in under 24 hours
• Soft credit inquiry only (no impact on your score)
• Funding from $5K to $10M

I'd love to discuss your specific needs. Would you be available for a quick 10-minute call this week?

In the meantime, you can get started right away:
👉 Complete your application: https://businessblum.com/login

Best regards,
BlumBlast Team
admin@businessblum.com | (+1) 980-361-1860`,
        isActive: true,
      },
      {
        id: "step-2",
        order: 2,
        type: "sms",
        delayHours: 24, // 1 day later
        content: `Hi {firstName}! Just following up on your business loan inquiry. Have you had a chance to review the info I sent? Ready to start your application? https://businessblum.com/login Reply YES if you'd like to schedule a call!`,
        isActive: true,
      },
      {
        id: "step-3",
        order: 3,
        type: "email",
        delayHours: 72, // 3 days after previous
        subject: "Quick Question About Your Business Funding, {firstName}",
        content: `Hi {firstName},

I wanted to check in - have you had any questions about business loans for {company}?

Many business owners we work with have similar concerns:
❓ "Will this affect my credit score?" - NO! We only do soft inquiries
❓ "How long does approval take?" - Most decisions within 24 hours
❓ "What if I don't qualify?" - We match you with 200+ lenders to maximize your chances

Here's what some of our clients are saying:

"Business Blum facilitated $85,000 in growth financing by close of business. Their institutional approach set a new benchmark." - Sarah Martinez, Martinez Bakery

Ready to move forward? Complete your application in just 3 minutes:
👉 https://businessblum.com/login

Or reply to this email with your questions - I'm here to help!

Best,
BlumBlast Team`,
        isActive: true,
      },
      {
        id: "step-4",
        order: 4,
        type: "email",
        delayHours: 120, // 5 days after previous
        subject: "Last Call: Your Business Funding Opportunity",
        content: `Hi {firstName},

I don't want you to miss out on this opportunity to secure funding for {company}.

🎯 Here's what you're leaving on the table:
• Access to $5K-$10M in business capital
• 87% approval rate (vs. 45% industry average)
• 200+ institutional lending partners competing for your business
• 24-hour approval process

This is your final reminder to complete your application. After today, we'll move you to our quarterly newsletter instead of personal follow-up.

👉 Complete your application now: https://businessblum.com/login

Still have questions? Call us directly: (+1) 980-361-1860

Don't let another week go by without the funding your business needs.

Best regards,
BlumBlast Team`,
        isActive: true,
      },
    ],
    isActive: true,
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sba-loan-sequence",
    name: "SBA Loan Specialist Follow-Up",
    description: "Tailored sequence for SBA loan inquiries with government-backed loan information",
    triggerIntent: "sba_loan",
    steps: [
      {
        id: "step-1",
        order: 1,
        type: "email",
        delayHours: 0,
        subject: "SBA Loan Information for {firstName} at {company}",
        content: `Hi {firstName},

Thank you for your interest in SBA loans! These government-backed loans offer some of the best terms available for businesses.

💼 SBA Loan Benefits:
• Lower interest rates (government-backed)
• Longer repayment terms (up to 25 years)
• Lower down payments
• Amounts up to $5.5M

BusinessBlum has direct relationships with SBA-preferred lenders in our network of 200+ institutional partners.

The application process is straightforward:
1. Complete our 3-minute application
2. We match you with SBA-approved lenders
3. Get pre-qualified within 24 hours
4. Lender handles SBA paperwork

👉 Start your SBA loan application: https://businessblum.com/login

Questions? I'm here to help!

Best regards,
BlumBlast Team
(+1) 980-361-1860`,
        isActive: true,
      },
      {
        id: "step-2",
        order: 2,
        type: "email",
        delayHours: 48,
        subject: "SBA Loan Requirements - Quick Checklist for {company}",
        content: `Hi {firstName},

I wanted to share a quick checklist of what you'll need for your SBA loan application:

✅ SBA Loan Requirements:
□ Business plan (we can help with this!)
□ Personal & business tax returns (2 years)
□ Financial statements (profit & loss, balance sheet)
□ Personal financial statement
□ Business licenses and registrations

Don't worry if you don't have everything ready - you can still start your application and our lending partners will guide you through the process.

Many business owners find SBA loans easier to qualify for than traditional bank loans because of the government guarantee.

👉 Get started today: https://businessblum.com/login

Need help preparing your documents? Reply to this email!

Best,
BlumBlast Team`,
        isActive: true,
      },
      {
        id: "step-3",
        order: 3,
        type: "sms",
        delayHours: 72,
        content: `Hi {firstName}! Quick question about your SBA loan for {company} - have you started your application yet? Takes just 3 min: https://businessblum.com/login Reply if you need help!`,
        isActive: true,
      },
    ],
    isActive: true,
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "equipment-financing-sequence",
    name: "Equipment Financing Follow-Up",
    description: "Sequence for equipment financing inquiries",
    triggerIntent: "equipment_financing",
    steps: [
      {
        id: "step-1",
        order: 1,
        type: "email",
        delayHours: 0,
        subject: "Equipment Financing Options for {company}",
        content: `Hi {firstName},

Thanks for inquiring about equipment financing! Whether you need new machinery, vehicles, technology, or other business equipment, we can help.

🔧 Equipment Financing Advantages:
• Finance up to 100% of equipment cost
• Preserve working capital
• Tax benefits (Section 179 deduction)
• Flexible terms based on equipment lifespan
• Fast approval (often same-day)

BusinessBlum partners with equipment financing specialists who understand your industry.

What equipment are you looking to finance? Let's get you the funding you need.

👉 Start your application: https://businessblum.com/login

Best regards,
BlumBlast Team`,
        isActive: true,
      },
      {
        id: "step-2",
        order: 2,
        type: "sms",
        delayHours: 24,
        content: `Hi {firstName}! Following up on equipment financing for {company}. Most approvals in 24hrs. Ready to apply? https://businessblum.com/login`,
        isActive: true,
      },
    ],
    isActive: true,
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "startup-funding-sequence",
    name: "Startup Funding Specialist Follow-Up",
    description: "Tailored sequence for startup funding inquiries",
    triggerIntent: "startup_funding",
    steps: [
      {
        id: "step-1",
        order: 1,
        type: "email",
        delayHours: 0,
        subject: "Startup Funding Resources for {firstName}",
        content: `Hi {firstName},

Congratulations on starting {company}! Securing funding for a startup can be challenging, but we specialize in connecting new businesses with lenders who understand your potential.

🚀 Startup Funding Options:
• SBA Microloans ($500 - $50K)
• Startup business loans
• Business lines of credit
• Equipment financing
• Working capital loans

Even with limited business history, our 200+ lending partners include those who specialize in startup funding.

What will you use the funding for? The more details you provide, the better we can match you with the right lender.

👉 Apply now: https://businessblum.com/login

Let's get your startup funded!

Best,
BlumBlast Team`,
        isActive: true,
      },
      {
        id: "step-2",
        order: 2,
        type: "email",
        delayHours: 48,
        subject: "Startup Success Story + Your Next Steps",
        content: `Hi {firstName},

I wanted to share a quick success story:

"As an emerging enterprise, traditional funding channels proved inaccessible. Business Blum matched us with an SBA institutional partner who recognized our growth trajectory. The $500K strategic capital facility enabled us to scale to 25 professionals." - Emily Parker, Parker Marketing Group

Your startup has potential too! Here's what you need to do next:

1. Complete the 3-minute application
2. We'll match you with startup-friendly lenders
3. Get pre-qualified in 24 hours
4. Receive your funding

Don't let funding hold back your dreams.

👉 Start your application: https://businessblum.com/login

Questions? Call us: (+1) 980-361-1860

Best regards,
BlumBlast Team`,
        isActive: true,
      },
    ],
    isActive: true,
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "general-inquiry-sequence",
    name: "General Inquiry Follow-Up",
    description: "Universal sequence for general inquiries",
    triggerIntent: "general_inquiry",
    steps: [
      {
        id: "step-1",
        order: 1,
        type: "email",
        delayHours: 0,
        subject: "Thanks for Contacting BusinessBlum, {firstName}!",
        content: `Hi {firstName},

Thank you for reaching out! We're excited to help {company} find the right business funding solution.

At BusinessBlum, we're not a lender - we're your advocate. We connect you with the right lender from our network of 200+ institutional partners.

📋 Popular Funding Options:
• Business Loans ($5K - $10M)
• SBA Loans (government-backed)
• Equipment Financing
• Lines of Credit
• Working Capital Loans

The best part? Getting started takes just 3 minutes, and there's no impact on your credit score.

👉 Complete your application: https://businessblum.com/login

What type of funding are you most interested in? Reply to this email and I'll send you specific information!

Best regards,
BlumBlast Team
(+1) 980-361-1860`,
        isActive: true,
      },
      {
        id: "step-2",
        order: 2,
        type: "sms",
        delayHours: 24,
        content: `Hi {firstName}! Thanks for your inquiry. Have questions about business funding for {company}? We're here to help! Apply in 3 min: https://businessblum.com/login`,
        isActive: true,
      },
      {
        id: "step-3",
        order: 3,
        type: "email",
        delayHours: 72,
        subject: "Your Business Funding Options, {firstName}",
        content: `Hi {firstName},

I wanted to follow up and make sure you have all the information you need about business funding options for {company}.

Here's why 50,000+ businesses trust BusinessBlum:

✅ 200+ Lending Partners - Maximum approval chances
✅ 24-Hour Decisions - Fast, AI-powered matching
✅ No Credit Impact - Soft inquiry only
✅ 87% Approval Rate - Industry-leading success
✅ $5K to $10M - Flexible funding amounts

Ready to see what you qualify for?

👉 Apply now: https://businessblum.com/login

Still have questions? Call us: (+1) 980-361-1860

Best regards,
BlumBlast Team`,
        isActive: true,
      },
    ],
    isActive: true,
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Get nurture sequence by intent
 */
export function getNurtureSequenceByIntent(intent?: string): NurtureSequence | undefined {
  if (!intent) return defaultNurtureSequences.find((s) => s.id === "general-inquiry-sequence");
  return defaultNurtureSequences.find((s) => s.triggerIntent === intent);
}

/**
 * Personalize message content with lead data
 */
export function personalizeMessage(content: string, lead: any): string {
  let personalized = content;

  // Replace placeholders
  personalized = personalized.replace(/{firstName}/g, lead.firstName || "there");
  personalized = personalized.replace(/{lastName}/g, lead.lastName || "");
  personalized = personalized.replace(/{email}/g, lead.email || "");
  personalized = personalized.replace(/{phone}/g, lead.phone || "");
  personalized = personalized.replace(/{company}/g, lead.company || "your business");
  personalized = personalized.replace(/{fundingAmount}/g, lead.fundingAmount || "the funding you need");

  return personalized;
}
