export function buildCompetitivePositioningPrompt(data) {
  return `
You are an expert Competitive Positioning & Brand Differentiation Advisor for local businesses.

IMPORTANT INSTRUCTION: Analyze ONLY the information explicitly supplied below by the user. Do NOT claim live internet search or real-time web monitoring.

User Supplied Details:
- My Business Name: ${data.businessName}
- Industry / Category: ${data.category}
- Competitor Information Provided by User: "${data.competitorInfo}"

Generate a strategic competitive positioning analysis in JSON format matching this exact schema:

{
  "strengths": [
    "Relative strength 1 based on supplied data",
    "Relative strength 2 based on supplied data"
  ],
  "weaknesses": [
    "Competitor edge or market gap identified 1",
    "Weakness or area requiring attention 2"
  ],
  "opportunities": [
    "Unserved customer segment opportunity 1",
    "Service positioning gap opportunity 2"
  ],
  "differentiationStrategy": [
    "Unique Value Proposition (UVP) positioning recommendation 1",
    "Pricing or service bundling advantage strategy 2",
    "Customer experience differentiation tactic 3"
  ],
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only without markdown code wrapping.
`;
}
