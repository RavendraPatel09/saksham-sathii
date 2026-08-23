import { apiRequest } from './client';

export const fetchCourses = async () => {
  const res = await apiRequest('/courses');
  return res.data;
};

export const updateCourseProgress = async (courseId: string, progress: number) => {
  const res = await apiRequest('/courses/progress', {
    method: 'POST',
    body: JSON.stringify({ courseId, progress }),
  });
  return res.data;
};
