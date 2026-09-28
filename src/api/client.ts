import { getApiBaseUrl } from '../config/environment';

const DEFAULT_TIMEOUT = 5000;

export async function apiGet<T>(
  endpoint: string,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(
      `${getApiBaseUrl()}${endpoint}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        `Request failed ${response.status}: ${message}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(
      `${getApiBaseUrl()}${endpoint}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        `Request failed ${response.status}: ${message}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}