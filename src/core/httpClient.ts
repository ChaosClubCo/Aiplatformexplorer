import { secureStorage } from '../utils/secureStorage';
import { globalEventBus, DomainEvents } from './index';

interface RequestConfig extends RequestInit {
  retries?: number;
  timeout?: number;
}

/**
 * ENTERPRISE HTTP CLIENT
 * 
 * Features:
 * 1. Automatic Bearer Token injection
 * 2. Global Error Handling (401/403/500)
 * 3. Timeout Support
 * 4. Automatic Retries for Network Errors
 */
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { retries = 2, timeout = 10000, ...customConfig } = config;
    const url = `${this.baseURL}${endpoint}`;
    
    // 1. Auth Header Injection
    const token = secureStorage.getItem<string>('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customConfig.headers,
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(id);

      // 2. Global Error Handling
      if (!response.ok) {
        if (response.status === 401) {
          globalEventBus.emit(DomainEvents.APP_ERROR, { error: 'Unauthorized', context: 'http' });
          // Trigger logout flow via Event Bus if needed
        }
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Handle void responses (204)
      if (response.status === 204) return {} as T;

      return await response.json();
    } catch (error: any) {
      clearTimeout(id);
      
      // 3. Retry Logic
      if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
        console.warn(`[HttpClient] Retrying ${endpoint}... Attempts left: ${retries}`);
        return this.request<T>(endpoint, { ...config, retries: retries - 1 });
      }

      throw error;
    }
  }

  public get<T>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public post<T>(url: string, data: any, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'POST', body: JSON.stringify(data) });
  }

  public put<T>(url: string, data: any, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'PUT', body: JSON.stringify(data) });
  }

  public delete<T>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
