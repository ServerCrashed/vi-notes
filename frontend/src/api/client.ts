const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  return rawBody;
}

function toErrorMessage(
  data: unknown,
  response: Response,
  method: HttpMethod,
  path: string
): string {
  if (isRecord(data)) {
    const err = data.error;
    const message = data.message;

    if (typeof err === 'string' && err.trim()) {
      return err;
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  return `${method} ${path} failed (${response.status} ${response.statusText})`;
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected network error';
    throw new Error(`Network request failed: ${message}`);
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(data, response, method, path));
  }

  return (data as T) ?? ({} as T);
}

export function registerUser(email: string, password: string) {
  return apiRequest<{ ok: true }>('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}

export function loginUser(email: string, password: string) {
  return apiRequest<{ ok: true }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function checkSession() {
  return apiRequest<{ authenticated: true }>('/api/auth/session');
}

export function logoutUser() {
  return apiRequest<{ ok: true }>('/api/auth/logout', {
    method: 'POST',
  });
}

export function startSession() {
  return apiRequest<{ sessionId: string }>('/api/sessions/start', {
    method: 'POST',
  });
}

export function recordPaste(
  sessionId: string,
  payload: { t: number; pastedCharCount: number; pastedLineCount?: number }
) {
  return apiRequest<{ ok: true }>(`/api/sessions/${sessionId}/paste`, {
    method: 'POST',
    body: payload,
  });
}

export function endSession(
  sessionId: string,
  payload: { endedAt: number; finalCharCount?: number; finalWordCount?: number }
) {
  return apiRequest<{ ok: true }>(`/api/sessions/${sessionId}/end`, {
    method: 'POST',
    body: payload,
  });
}
