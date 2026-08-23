import { apiRequest } from './client';

export const fetchAssessmentQuestions = async () => {
  const res = await apiRequest('/assessments/questions');
  return res.data;
};

export const submitAssessmentAnswers = async (answers: Record<string, string>) => {
  const res = await apiRequest('/assessments/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  return res.data;
};

export const submitInterviewAnswer = async (data: { mode: 'text' | 'voice' | 'video'; question: string; answer: string }) => {
  const res = await apiRequest('/user/interview', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
};
