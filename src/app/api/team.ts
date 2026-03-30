import { apiClient } from './client.ts';

export interface JoinTeamData {
  email: string;
  resume: File;
}

export interface JoinTeamResponse {
  message: string;
  applicationId: string;
}

export const teamApi = {
  async submitApplication(data: JoinTeamData): Promise<JoinTeamResponse> {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('resume_file', data.resume);

    return apiClient.request<JoinTeamResponse>('/join-team/', {
      method: 'POST',
      body: formData,
    });
  },
};