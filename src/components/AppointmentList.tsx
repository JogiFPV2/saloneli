import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Appointment, Client, Service } from '../types';
import { DollarSign, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AppointmentListProps {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  onUpdatePaymentStatus?: (appointmentId: string, isPaid: boolean) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  onUpdateNotes?: (appointmentId: string, notes: string) => void;
}

export default function AppointmentList({ 
  appointments, 
  clients,
  services,
  onUpdatePaymentStatus,
  onEdit,
  onDelete,
  onUpdateNotes
}: AppointmentListProps) {
  const [expandedAppointments, setExpandedAppointments] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');

  const getClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const getService = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  // Function to determine if a color is dark
  const isColorDark = (color: string): boolean => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.6;
  };

  const toggleDetails = (appointmentId: string) => {
    const newExpanded = new Set(expandedAppointments);
    if (newExpanded.has(appointmentId)) {
      newExpanded.delete(appointmentId);
      setEditingNotes(null);
    } else {
      newExpanded.add(appointmentId);
    }
    setExpandedAppointments(newExpanded);
  };

  const startEditingNotes = (appointment: Appointment) => {
    setEditingNotes(appointment.id);
    setNotesDraft(appointment.notes);
  };

  const saveNotes = (appointmentId: string) => {
    onUpdateNotes?.(appointmentId, notesDraft);
    setEditingNotes(null);
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg text-xs">
        <p className="text-gray-500">Brak wizyt na ten dzień</p>
      </div>
    );
  }

  const handleDelete = (appointmentId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę wizytę?')) {
      onDelete(appointmentId);
    }
  };

  return (
    <div className="space-y-2">
      {appointments
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((appointment) => {
          const client = getClient(appointment.clientId);
          const isExpanded = expandedAppointments.has(appointment.id);
          const hasNotes = appointment.notes.trim().length > 0;
          
          return (
            <div
              key={appointment.id}
              className={`p-3 rounded border text-xs transition-colors ${
                appointment.isPaid 
                  ? 'bg-green-50 border-green-200 hover:border-green-300' 
                  : 'bg-red-50 border-red-200 hover:border-red-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="text-gray-800 font-semibold text-base min-w-[45px]">
                    {format(new Date(appointment.date), 'HH:mm', { locale: pl })}
                  </div>
                  
                  <div>
                    <div className="font-bold">
                      {client ? `${client.firstName} ${client.lastName}` : 'Nieznany klient'}
                    </div>
                    {client && (
                      <div className="mt-1 space-y-1">
                        <div className="text-gray-600">
                          Tel. {client.phone}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdatePaymentStatus?.(appointment.id, !appointment.isPaid)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                      appointment.isPaid
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <DollarSign size={14} />
                    {appointment.isPaid ? 'Opłacone' : 'Nieopłacone'}
                  </button>
                  <button 
                    onClick={() => onEdit(appointment)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {appointment.services.map(serviceId => {
                    const service = getService(serviceId);
                    if (!service) return null;
                    const isDark = isColorDark(service.color);
                    return (
                      <span
                        key={service.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                          isDark ? 'text-white' : 'text-gray-700'
                        }`}
                        style={{
                          backgroundColor: service.color,
                          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                        }}
                      >
                        {service.name}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={() => toggleDetails(appointment.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ml-2
                    ${hasNotes ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'} 
                    hover:bg-gray-200`}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Szczegóły
                </button>
              </div>

              {/* Details section */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="text-gray-600">
                      {editingNotes === appointment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            className="w-full p-2 border rounded text-sm"
                            rows={3}
                            placeholder="Wpisz notatki..."
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNotes(null)}
                              className="px-2 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              Anuluj
                            </button>
                            <button
                              onClick={() => saveNotes(appointment.id)}
                              className="px-2 py-1 text-[11px] rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                            >
                              Zapisz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="bg-white bg-opacity-50 p-2 rounded cursor-pointer hover:bg-opacity-70 transition-colors"
                          onClick={() => startEditingNotes(appointment)}
                        >
                          {appointment.notes || (
                            <span className="text-gray-400 italic">
                              Kliknij aby dodać notatki
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
