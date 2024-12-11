import { Client } from '../types';
import { Trash2, History } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onViewHistory: (id: string) => void;
}

export default function ClientList({ clients, onEdit, onDelete, onViewHistory }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Brak klientów w bazie
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Imię i nazwisko
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Telefon
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50 text-sm">
              <td className="px-4 py-3">
                {client.firstName} {client.lastName}
              </td>
              <td className="px-4 py-3 text-gray-600">{client.phone}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  onClick={() => onViewHistory(client.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <History size={16} />
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
