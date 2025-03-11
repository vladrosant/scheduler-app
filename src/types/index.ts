export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'client';
  phoneNumber?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

export interface Staff extends User {
  role: 'staff';
  specialties: string[];
  schedule: WorkingHours[];
  services: string[]; // service IDs they can perform
}

export interface Appointment {
  id: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Client extends User {
  role: 'client';
  appointments: string[]; // appointment IDs
  preferences?: {
    preferredStaff?: string[];
    notes?: string;
  };
} 