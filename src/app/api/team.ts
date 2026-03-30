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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate email
    if (!data.email.includes('@') || !data.email.includes('.')) {
      throw new Error('Некорректный формат email');
    }

    // Validate resume file
    if (!data.resume) {
      throw new Error('Необходимо прикрепить резюме');
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(data.resume.type)) {
      throw new Error('Резюме должно быть в формате PDF или DOC');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (data.resume.size > maxSize) {
      throw new Error('Размер файла не должен превышать 5 МБ');
    }

    // Mock: Save application to localStorage for demo
    const applications = JSON.parse(
      localStorage.getItem('teamApplications') || '[]'
    );

    const newApplication = {
      id: `app-${Date.now()}`,
      email: data.email,
      resumeName: data.resume.name,
      resumeSize: data.resume.size,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    applications.push(newApplication);
    localStorage.setItem('teamApplications', JSON.stringify(applications));

    return {
      message: 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      applicationId: newApplication.id,
    };
  },

  async getApplicationStatus(applicationId: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const applications = JSON.parse(
      localStorage.getItem('teamApplications') || '[]'
    );

    const application = applications.find((app: any) => app.id === applicationId);

    if (!application) {
      throw new Error('Заявка не найдена');
    }

    return application;
  },
};
