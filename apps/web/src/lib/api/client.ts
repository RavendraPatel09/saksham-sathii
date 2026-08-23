// Saksham Sathi API Client

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

// Custom Fetch Client
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Build headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Ensures httpOnly cookies for refresh token rotation are passed
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      // 401 Interceptor: Access token might have expired, try to refresh
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.data.accessToken;
            setAccessToken(newToken);

            // Execute queued requests
            isRefreshing = false;
            refreshQueue.forEach(cb => cb(newToken));
            refreshQueue = [];

            // Retry original request
            headers.set('Authorization', `Bearer ${newToken}`);
            const retryResponse = await fetch(url, fetchOptions);
            return handleResponse(retryResponse);
          } else {
            // Refresh token expired or invalid
            isRefreshing = false;
            setAccessToken(null);
            refreshQueue = [];
            // Redirect or logout can be handled at caller level
            throw new Error('Session expired. Please log in again.');
          }
        } catch (refreshErr) {
          isRefreshing = false;
          refreshQueue = [];
          setAccessToken(null);
          throw refreshErr;
        }
      } else {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            headers.set('Authorization', `Bearer ${newToken}`);
            fetch(url, fetchOptions)
              .then(handleResponse)
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }

    return handleResponse(response);
  } catch (err: any) {
    // If browser is offline or server is down, throw custom checkable error
    throw err;
  }
};

const handleResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { error: await response.text(), data: null };
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || response.statusText || 'Request failed';
    const err = new Error(errorMsg) as any;
    err.data = data;
    throw err;
  }

  return data;
};
