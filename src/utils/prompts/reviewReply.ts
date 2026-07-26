export function buildReviewReplyPrompt(data: {
  businessName: string;
  customerReview: string;
  tone: 'Professional' | 'Friendly' | 'Formal' | 'Apologetic';
}): string {
  return `
You are an expert Reputation & Customer Support Manager for local businesses.

Business Name: ${data.businessName}
Customer Review: "${data.customerReview}"
Selected Tone: ${data.tone}

Generate 3 tailored, professional response variations to this customer review in JSON format matching this exact schema:

{
  "professionalReply": "Comprehensive response in a ${data.tone} tone addressing all points, thanking the customer, and showcasing strong service ethics.",
  "alternativeReply": "An alternative engaging response emphasizing brand values and local community connection.",
  "shortVersion": "A quick, concise response ideal for rapid public review platforms.",
  "nextSteps": [
    "Practical Next Step 1",
    "Practical Next Step 2",
    "Practical Next Step 3"
  ]
}

Return raw JSON only without markdown code formatting.
`;
}
