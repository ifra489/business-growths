export function buildMarketingPlanPrompt(data: {
  businessName: string;
  category: string;
  primaryGoal: string;
}): string {
  return `
You are an expert Local Marketing Strategist.

Business Details:
- Business Name: ${data.businessName}
- Category: ${data.category}
- Primary Goal: ${data.primaryGoal}

Generate a comprehensive, actionable 30-Day Marketing Roadmap broken down by 4 weekly themes and daily checklists in JSON format matching this exact schema:

{
  "month": "30-Day Growth Roadmap",
  "weeks": [
    {
      "weekNumber": 1,
      "focusArea": "Week 1: Digital Footprint & GBP Optimization",
      "objectives": ["Audit business listings", "Gather first 5 new reviews"],
      "tasks": [
        {"day": "Day 1", "task": "Update business hours and cover photo on Google Profile."},
        {"day": "Day 2", "task": "Send review request SMS to 5 past happy clients."},
        {"day": "Day 3", "task": "Post welcoming photo update on GBP."},
        {"day": "Day 4", "task": "Verify NAP consistency across online directories."},
        {"day": "Day 5", "task": "Respond to all outstanding reviews."},
        {"day": "Day 6", "task": "Set up social media profile links."},
        {"day": "Day 7", "task": "Review week 1 stats and adjust profile bio."}
      ]
    },
    {
      "weekNumber": 2,
      "focusArea": "Week 2: Social Proof & Content Engine",
      "objectives": ["Increase local social engagement"],
      "tasks": [
        {"day": "Day 8", "task": "Publish educational Reel or short video."},
        {"day": "Day 9", "task": "Engage with 10 local business accounts."},
        {"day": "Day 10", "task": "Share customer testimonial graphic."},
        {"day": "Day 11", "task": "Launch weekly Q&A story poll."},
        {"day": "Day 12", "task": "Create special weekend promotional offer."},
        {"day": "Day 13", "task": "Send promotional newsletter or broadcast."},
        {"day": "Day 14", "task": "Analyze social engagement metrics."}
      ]
    },
    {
      "weekNumber": 3,
      "focusArea": "Week 3: Local Partnerships & Lead Generation",
      "objectives": ["Build local cross-promotions"],
      "tasks": [
        {"day": "Day 15", "task": "Reach out to 2 complementary local non-competing businesses."},
        {"day": "Day 16", "task": "Create referral discount flyer."},
        {"day": "Day 17", "task": "Post joint giveaway announcement."},
        {"day": "Day 18", "task": "Run localized Facebook / Instagram ad campaign."},
        {"day": "Day 19", "task": "Host live Q&A session or micro event."},
        {"day": "Day 20", "task": "Send follow-up offer to past leads."},
        {"day": "Day 21", "task": "Evaluate campaign lead responses."}
      ]
    },
    {
      "weekNumber": 4,
      "focusArea": "Week 4: Retargeting, Customer Retention & Scale",
      "objectives": ["Boost repeat visits and customer lifetime value"],
      "tasks": [
        {"day": "Day 22", "task": "Launch VIP Customer Loyalty offer."},
        {"day": "Day 23", "task": "Send bounce-back coupon for next visit."},
        {"day": "Day 24", "task": "Highlight top employee or behind-the-scenes feature."},
        {"day": "Day 25", "task": "Refresh GBP cover image and Q&A section."},
        {"day": "Day 26", "task": "Run end-of-month flash sale."},
        {"day": "Day 27", "task": "Collect client feedback survey responses."},
        {"day": "Day 28", "task": "Review monthly conversion and revenue growth."},
        {"day": "Day 29", "task": "Document top performing content templates."},
        {"day": "Day 30", "task": "Plan next month strategy and key dates."}
      ]
    }
  ],
  "dailyChecklist": [
    "Check and respond to Google Messages & Reviews daily",
    "Post 1 story update or GBP update",
    "Monitor local customer inquiries"
  ],
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only without extra formatting.
`;
}
