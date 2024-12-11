import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Appointment, Client, Service } from '../types';
import AppointmentList from '../components/AppointmentList';
import AppointmentForm from '../components/AppointmentForm';
import CurrentDateTime from '../components/CurrentDateTime';
import 'react-day-picker/dist/style.css';

export default function CalendarPage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

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

  const handleNewAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map(apt =>
        apt.id === editingAppointment.id
          ? { ...appointmentData, id: editingAppointment.id }
          : apt
      );
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
      setEditingAppointment(null);
    } else {
      // Create new appointment
      const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
      };
      const updatedAppointments = [...appointments, newAppointment];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
    }
    setShowAppointmentForm(false);
  };

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

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
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
  });

  const CalendarSection = () => (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <CurrentDateTime />
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
  );

  const AppointmentsSection = () => (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-700">
          Wizyty na {format(selected, 'd MMMM yyyy', { locale: pl })}
        </h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditingAppointment(null);
            setShowAppointmentForm(true);
          }}
        >
          Nowa wizyta
        </button>
      </div>
      
      <AppointmentList
        appointments={selectedDayAppointments}
        clients={clients}
        services={services}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onUpdateNotes={handleUpdateNotes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );

  return (
    <div>
      {/* Desktop Layout (side by side) */}
      <div className="hidden lg:flex gap-6 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="w-auto">
          <CalendarSection />
        </div>
        <div className="flex-1 overflow-y-auto">
          <AppointmentsSection />
        </div>
      </div>

      {/* Mobile Layout (stacked) */}
      <div className="lg:hidden space-y-4">
        <CalendarSection />
        <AppointmentsSection />
      </div>

      {showAppointmentForm && (
        <AppointmentForm
          onSubmit={handleNewAppointment}
          onClose={() => {
            setShowAppointmentForm(false);
            setEditingAppointment(null);
          }}
          selectedDate={selected}
          clients={clients}
          services={services}
          initialData={editingAppointment}
        />
      )}
    </div>
  );
}
