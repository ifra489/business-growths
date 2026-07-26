export function buildPromotionGeneratorPrompt(data) {
  return `
You are an expert Marketing Campaign & Sales Promotion Strategist.

Business Details:
- Business Name: ${data.businessName}
- Category: ${data.category}
- Promotion Type: ${data.promotionType}
${data.discountDetails ? `- Specific Discount / Detail: ${data.discountDetails}` : ''}

Generate a complete promotional campaign framework in JSON format matching this exact schema:

{
  "campaignTitle": "Catchy High-Converting Campaign Title",
  "description": "Strategic rationale and goal of this promotion.",
  "targetAudience": "Ideal customer demographic for this specific offer.",
  "headline": "Attention-grabbing headline for flyers, social banners, or email subjects.",
  "bodyCopy": "Persuasive promotional offer copy highlighting customer benefits and urgency.",
  "offerDetails": "Terms, discounts, bonus perks, and redemption instructions.",
  "ctaText": "Strong Call To Action button text.",
  "duration": "Recommended runtime (e.g., 3 Days, Weekend Only, 14 Days).",
  "channels": ["Google Business Profile Post", "Instagram Feed & Stories", "SMS / Email Blast", "In-Store Signage"],
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only without markdown code blocks.
`;
}
