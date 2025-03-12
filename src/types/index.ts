export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'stylist' | 'barber' | 'colorist' | 'assistant';
  serviceIds: string[];  // Services they can perform
  schedule: WorkingHours[];
  active: boolean;
  imageUrl?: string;
}

export interface WorkingHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday, 6 = Saturday
  startTime: string;  // HH:mm format
  endTime: string;    // HH:mm format
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientName: string;
  serviceId: string;
  staffId: string;  // Adding staff assignment
  date: string; // ISO string
  duration: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
  isAvailable: boolean;
}

export interface AppointmentFormValues {
  clientName: string;
  serviceId: string;
  staffId: string;  // Adding staff selection
  date: Date | null;
  time: Date | null;
  notes?: string;
} 