export function buildSeoAuditPrompt(data) {
  return `
You are an expert Local SEO & Google Business Profile Specialist.

Based ONLY on the provided business details:
- Business Name: ${data.businessName}
- Category: ${data.category}
- Location: ${data.location}
${data.currentServices ? `- Current Services: ${data.currentServices}` : ''}

Generate an actionable, high-ranking Google Business Profile (GBP) SEO Audit in JSON format matching this exact schema:

{
  "optimizedDescription": "A compelling, keyword-rich 750-character profile description tailored to local customers and local search algorithms.",
  "recommendedCategories": ["Primary Category", "Secondary Category 1", "Secondary Category 2"],
  "seoKeywords": ["Primary Keyword 1", "Long-tail Keyword 2", "Geo-targeted Keyword 3", "Keyword 4", "Keyword 5"],
  "recommendedServices": ["Service 1", "Service 2", "Service 3", "Service 4"],
  "faqSuggestions": [
    {"question": "FAQ 1?", "answer": "Detailed helpful response 1"},
    {"question": "FAQ 2?", "answer": "Detailed helpful response 2"}
  ],
  "photoSuggestions": ["Photo idea 1", "Photo idea 2", "Photo idea 3"],
  "postingStrategy": ["Strategy tip 1", "Strategy tip 2", "Strategy tip 3"],
  "reviewStrategy": ["Review tactic 1", "Review tactic 2"],
  "optimizationScore": 88,
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only, with no markdown fences or preambles.
`;
}
