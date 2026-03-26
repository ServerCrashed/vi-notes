const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST';

type RequestOptions = {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token = null, body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data as T;
}

export function registerUser(email: string, password: string) {
  return apiRequest<{ ok: true }>('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}

export function loginUser(email: string, password: string) {
  return apiRequest<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function startSession(token: string) {
  return apiRequest<{ sessionId: string }>('/api/sessions/start', {
    method: 'POST',
    token,
  });
}

export function recordPaste(
  sessionId: string,
  token: string,
  payload: { t: number; pastedCharCount: number; pastedLineCount?: number }
) {
  return apiRequest<{ ok: true }>(`/api/sessions/${sessionId}/paste`, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function endSession(
  sessionId: string,
  token: string,
  payload: { endedAt: number; finalCharCount?: number; finalWordCount?: number }
) {
  return apiRequest<{ ok: true }>(`/api/sessions/${sessionId}/end`, {
    method: 'POST',
    token,
    body: payload,
  });
}
