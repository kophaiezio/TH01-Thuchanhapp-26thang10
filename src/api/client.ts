import {API_BASE_URL, TIMEOUT} from '../config';

export class ApiError extends Error {
  status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? {'Content-Type': 'application/json'} : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(
        message || `Yêu cầu thất bại (HTTP ${response.status}).`,
        response.status,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(`Yêu cầu hết thời gian chờ sau ${TIMEOUT / 1000} giây.`);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ.',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
