import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Appointment, Client, Service } from '../types';
import AppointmentList from '../components/AppointmentList';
import 'react-day-picker/dist/style.css';

export default function HistoryPage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    const savedClients = localStorage.getItem('clients');
    const savedServices = localStorage.getItem('services');
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleUpdatePaymentStatus = (appointmentId: string, isPaid: boolean) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, isPaid }
        : appointment
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
  };

  const handleUpdateNotes = (appointmentId: string, notes: string) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, notes }
        : appointment
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
  };

  const handleDelete = (appointmentId: string) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
  };

  const selectedDayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === selected.getDate() &&
      appointmentDate.getMonth() === selected.getMonth() &&
      appointmentDate.getFullYear() === selected.getFullYear()
    );
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6">
        <div className="w-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Wybierz datę</h2>
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => date && setSelected(date)}
              locale={pl}
              className="rdp-custom"
              modifiers={{
                hasAppointments: (date) =>
                  appointments.some((apt) => {
                    const aptDate = new Date(apt.date);
                    return (
                      aptDate.getDate() === date.getDate() &&
                      aptDate.getMonth() === date.getMonth() &&
                      aptDate.getFullYear() === date.getFullYear()
                    );
                  }),
              }}
              modifiersClassNames={{
                hasAppointments: 'bg-gray-100',
              }}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">
              Historia wizyt - {format(selected, 'd MMMM yyyy', { locale: pl })}
            </h2>
            <AppointmentList
              appointments={selectedDayAppointments}
              clients={clients}
              services={services}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onUpdateNotes={handleUpdateNotes}
              onEdit={() => {}} // Historia nie pozwala na edycję
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Wybierz datę</h2>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => date && setSelected(date)}
            locale={pl}
            className="rdp-custom"
            modifiers={{
              hasAppointments: (date) =>
                appointments.some((apt) => {
                  const aptDate = new Date(apt.date);
                  return (
                    aptDate.getDate() === date.getDate() &&
                    aptDate.getMonth() === date.getMonth() &&
                    aptDate.getFullYear() === date.getFullYear()
                  );
                }),
            }}
            modifiersClassNames={{
              hasAppointments: 'bg-gray-100',
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">
            Historia wizyt - {format(selected, 'd MMMM yyyy', { locale: pl })}
          </h2>
          <AppointmentList
            appointments={selectedDayAppointments}
            clients={clients}
            services={services}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onUpdateNotes={handleUpdateNotes}
            onEdit={() => {}} // Historia nie pozwala na edycję
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
