import { apiClient } from './client.ts';

export interface Specialist {
  initials: string;
  education: string;
  practice: string;
  description: string;
  work_methods: string[];
  image: string;
  link?: string;
}

export const specialistsApi = {
  getAll(): Promise<Specialist[]> {
    return apiClient.get<Specialist[]>('/specialists/');
  },
};
