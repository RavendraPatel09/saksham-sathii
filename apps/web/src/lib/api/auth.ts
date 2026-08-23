import { apiRequest, setAccessToken } from './client';

export const registerUser = async (data: any) => {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }
  return res.data;
};

export const loginUser = async (credentials: any) => {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }
  return res.data;
};

export const logoutUser = async () => {
  await apiRequest('/auth/logout', { method: 'POST' });
  setAccessToken(null);
};

export const fetchCurrentUser = async () => {
  const res = await apiRequest('/user/me');
  return res.data;
};

export const updateUserProfile = async (profileData: any) => {
  const res = await apiRequest('/user/me', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
  return res.data;
};
