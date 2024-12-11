import { Service } from '../types';
import { Pencil, Trash2, Clock } from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export default function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Brak usług w bazie
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: service.color }}
            />
            <div>
              <div className="font-medium">{service.name}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                {service.duration} min
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(service)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Pencil size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
