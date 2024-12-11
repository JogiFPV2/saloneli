export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  color: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  services: string[]; // array of service IDs
  isPaid: boolean;
  notes: string;
}
