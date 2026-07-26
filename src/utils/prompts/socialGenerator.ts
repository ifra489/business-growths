export function buildSocialGeneratorPrompt(data: {
  businessName: string;
  category: string;
  targetAudience: string;
  topicOrOffer?: string;
}): string {
  return `
You are an expert Social Media & Growth Content Strategist for local businesses.

Business Details:
- Business Name: ${data.businessName}
- Category: ${data.category}
- Target Audience: ${data.targetAudience}
${data.topicOrOffer ? `- Special Topic / Offer: ${data.topicOrOffer}` : ''}

Generate high-converting multi-platform social media marketing content in JSON format matching this exact schema:

{
  "instagramCaptions": [
    "Engaging IG Caption 1 with emojis and call to action",
    "Engaging IG Caption 2 focused on customer benefit"
  ],
  "facebookPosts": [
    "Detailed informative FB post 1",
    "Community-focused FB post 2"
  ],
  "linkedInPosts": [
    "Professional B2B/Community leadership post 1"
  ],
  "promotionalContent": [
    "High-urgency promotional campaign post 1"
  ],
  "hashtags": ["#LocalBusiness", "#CategoryKeywords", "#CommunityTag", "#GrowthTag"],
  "storyIdeas": [
    "Interactive poll story idea",
    "Behind-the-scenes video story idea"
  ],
  "reelIdeas": [
    "Trending audio 15s transformation Reel script",
    "Quick tip 30s educational Reel script"
  ],
  "ctaSuggestions": [
    "Call us today for a free consultation!",
    "Visit our link in bio to book your slot!"
  ],
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only without extra text.
`;
}
