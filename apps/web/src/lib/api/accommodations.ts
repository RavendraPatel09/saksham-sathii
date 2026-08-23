import { apiRequest } from './client';

export const generateAccommodationLetter = async (disability: string, needs: string[], additionalInfo?: string) => {
  const res = await apiRequest('/accommodations/generate-letter', {
    method: 'POST',
    body: JSON.stringify({ disability, needs, additionalInfo }),
  });
  return res.data;
};

export const simplifyTextDocument = async (text: string) => {
  const res = await apiRequest('/accommodations/simplify-document', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return res.data;
};
export const fetchAdminUserDetail = async (userId: string) => {
  const res = await apiRequest(`/admin/users/${userId}`);
  return res.data;
};
