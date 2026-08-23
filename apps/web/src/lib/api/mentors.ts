import { apiRequest } from './client';

export const fetchMentors = async () => {
  const res = await apiRequest('/mentors');
  return res.data;
};

export const connectWithMentor = async (mentorId: string) => {
  const res = await apiRequest('/mentors/connect', {
    method: 'POST',
    body: JSON.stringify({ mentorId }),
  });
  return res.data;
};
