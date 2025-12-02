const API_BASE = '';

type ApiOptions = RequestInit & { skipJson?: boolean };

async function apiRequest<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipJson, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...rest,
  });

  if (skipJson) {
    return {} as T;
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    throw new Error('서버 응답 파싱에 실패했습니다.');
  }

  if (!res.ok || body?.success === false) {
    const msg = body?.error || '요청 처리 중 오류가 발생했습니다.';
    throw new Error(msg);
  }

  return body?.data as T;
}

export type SignupPayload = {
  username: string;
  password1: string;
  password2: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
};

export const api = {
  signUp: (payload: SignupPayload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => form.append(k, v));
    return apiRequest<{ username: string }>('/api/sign-up/', { method: 'POST', body: form });
  },
  login: (username: string, password: string) => {
    const form = new FormData();
    form.append('username', username);
    form.append('password', password);
    return apiRequest<{ username: string }>('/api/login/', { method: 'POST', body: form });
  },
  logout: () => apiRequest('/api/logout/', { method: 'POST' }),
  upload: (file: File) => {
    const form = new FormData();
    form.append('food_image', file);
    return apiRequest<{ food: string; foods: string[]; coaching: string }>('/api/upload/', {
      method: 'POST',
      body: form,
    });
  },
  getRecord: () => apiRequest<{ description: string }>('/api/record/', { method: 'GET' }),
};
