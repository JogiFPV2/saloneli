import { useState, useEffect } from 'react';
import { Service } from '../types';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';
import { Search, Scissors } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const saveServices = (newServices: Service[]) => {
    localStorage.setItem('services', JSON.stringify(newServices));
    setServices(newServices);
  };

  const handleSubmit = (serviceData: Omit<Service, 'id'>) => {
    if (editingService) {
      const updatedServices = services.map(service =>
        service.id === editingService.id
          ? { ...serviceData, id: editingService.id }
          : service
      );
      saveServices(updatedServices);
      setEditingService(null);
    } else {
      const newService = {
        ...serviceData,
        id: Date.now().toString(),
      };
      saveServices([...services, newService]);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę usługę?')) {
      const updatedServices = services.filter((service) => service.id !== id);
      saveServices(updatedServices);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="mb-6">Usługi</h1>

      {/* Add/Edit Service Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Scissors size={18} className="text-gray-600" />
          <h2 className="text-base">
            {editingService ? 'Edytuj usługę' : 'Dodaj nową usługę'}
          </h2>
        </div>
        <ServiceForm
          onSubmit={handleSubmit}
          initialData={editingService}
          onCancel={() => setEditingService(null)}
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj usług..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-base p-4 border-b border-gray-100">
          Lista usług ({filteredServices.length})
        </h2>
        <ServiceList
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
