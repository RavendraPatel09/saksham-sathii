import { apiRequest } from './client';

export const fetchJobs = async (isReserved: boolean = false) => {
  const res = await apiRequest(`/jobs?isReserved=${isReserved}`);
  return res.data;
};

export const fetchJobMatchExplanation = async (jobId: string) => {
  const res = await apiRequest('/jobs/match-explain', {
    method: 'POST',
    body: JSON.stringify({ jobId }),
  });
  return res.data;
};

export const submitAccessibilityAudit = async (auditData: any) => {
  const res = await apiRequest('/user/audit', {
    method: 'POST',
    body: JSON.stringify(auditData),
  });
  return res.data;
};
