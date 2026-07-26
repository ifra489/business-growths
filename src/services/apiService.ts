// Backend API service for routing AI generation through Express backend

const RAW_API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();

function buildApiEndpointUrl(endpoint: string): string {
  let cleanEndpoint = endpoint.replace(/^\/+/, '');
  cleanEndpoint = cleanEndpoint.replace(/^(api\/ai\/|ai\/)/, '');
  if (!RAW_API_BASE) {
    return `/api/ai/${cleanEndpoint}`;
  }
  const cleanBase = RAW_API_BASE.replace(/\/+$/, '');
  if (cleanBase.endsWith('/api/ai')) {
    return `${cleanBase}/${cleanEndpoint}`;
  }
  if (cleanBase.endsWith('/api')) {
    return `${cleanBase}/ai/${cleanEndpoint}`;
  }
  return `${cleanBase}/api/ai/${cleanEndpoint}`;
}

export async function generateAiContent<T>(endpoint: string, payload: Record<string, any>): Promise<T> {
  try {
    const url = buildApiEndpointUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to generate recommendations. Please try again.');
    }

    const data = await response.json();
    if (!data.success || !data.result) {
      throw new Error(data.message || 'Unable to generate recommendations. Please try again.');
    }

    return data.result as T;
  } catch (error: any) {
    console.error(`AI Generation API Error (${endpoint}):`, error);
    throw new Error(error.message || 'Unable to generate recommendations. Please try again.');
  }
}
