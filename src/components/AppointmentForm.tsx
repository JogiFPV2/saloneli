import { useState, useEffect } from 'react';
import { X, Clock, Search } from 'lucide-react';
import { Client, Service, Appointment } from '../types';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface AppointmentFormProps {
  onSubmit: (appointment: Omit<Appointment, 'id'>) => void;
  onClose: () => void;
  selectedDate: Date;
  clients: Client[];
  services: Service[];
  initialData?: Appointment | null;
}

export default function AppointmentForm({
  onSubmit,
  onClose,
  selectedDate,
  clients,
  services,
  initialData
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    date: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
    services: [] as string[],
    notes: '',
    isPaid: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId,
        date: initialData.date,
        services: initialData.services,
        notes: initialData.notes,
        isPaid: initialData.isPaid,
      });
    }
  }, [initialData]);

  const filteredClients = clients.filter(
    client =>
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edytuj wizytę' : 'Nowa wizyta'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klient
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj klienta..."
                  className="input pl-10"
                />
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {filteredClients.map((client) => (
                  <label
                    key={client.id}
                    className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
                      formData.clientId === client.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="client"
                      value={client.id}
                      checked={formData.clientId === client.id}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="mr-2"
                    />
                    <span>
                      {client.firstName} {client.lastName} ({client.phone})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data i godzina
            </label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input pl-10"
                required
              />
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usługi
            </label>
            <div className="space-y-2">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer ${
                    formData.services.includes(service.id) ? 'bg-gray-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="mr-2"
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span>{service.name}</span>
                    <span className="text-sm text-gray-500">({service.duration} min)</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notatki
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={3}
              placeholder="Dodatkowe informacje..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Anuluj
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Zapisz zmiany' : 'Zapisz wizytę'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
