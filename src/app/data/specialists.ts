export interface Specialist {
  id: string;
  name: string;
  experience: string;
  photo: string;
  education: string[];
  description: string;
  methods: string[];
  availableSlots?: { date: string; times: string[] }[];
}

export interface Session {
  id: string;
  date: string;
  specialistId: string;
  specialistName: string;
  time: string;
  clientName?: string;
  clientPhone?: string;
}