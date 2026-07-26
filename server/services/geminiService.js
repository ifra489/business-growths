const getApiKey = () => {
  return process.env.OPENROUTER_API_KEY;
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo';

/**
 * Retry logic with exponential backoff for rate limits
 */
async function callOpenRouterWithRetry(promptText, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://business-growth.app',
          'X-Title': 'Business Growth App'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'user',
              content: promptText
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error?.message || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenRouter');
      }

      return data.choices[0].message.content;
    } catch (error) {
      lastError = error;
      const statusCode = error.status || 500;
      const errorMsg = error.message || '';

      // If it's a rate limit (429), wait and retry
      if (statusCode === 429 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Rate limited. Retry ${attempt}/${maxRetries - 1} after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  throw lastError;
}

export async function callGemini(promptText) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error(
      'OPENROUTER_API_KEY is not configured on the server environment. ' +
      'Please set OPENROUTER_API_KEY in server/.env file with a valid key from OpenRouter (https://openrouter.ai).'
    );
  }

  try {
    console.log(`✓ Using OpenRouter model: ${MODEL}`);
    
    // Call OpenRouter with retry logic for rate limits
    const rawText = await callOpenRouterWithRetry(promptText);

    if (!rawText) {
      throw new Error('Unable to generate recommendations. Please try again.');
    }

    // Sanitize json formatting fences if present
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn('Raw AI output parse warning:', rawText);
      return {
        rawOutput: rawText,
        nextSteps: [
          'Review the generated recommendations',
          'Implement priority action items',
          'Track local SEO performance'
        ]
      };
    }
  } catch (error) {
    console.error('OpenRouter Service Error:', error.message);
    
    // Provide helpful error messages for common issues
    if (error.status === 401 || error.message?.includes('unauthorized')) {
      throw new Error(
        'Authentication failed. Please verify your OPENROUTER_API_KEY is correct. ' +
        'Get a key at https://openrouter.ai'
      );
    }
    
    if (error.status === 404 || error.message?.includes('not found')) {
      throw new Error(
        'Model not available. Please verify the model is available on OpenRouter.'
      );
    }
    
    if (error.status === 429) {
      throw new Error(
        'Rate limit exceeded. Please wait a moment and try again. ' +
        'Free tier has usage limits. Consider spacing out your requests or upgrading your plan.'
      );
    }

    throw new Error(error.message || 'Unable to generate recommendations. Please try again.');
  }
}
