import { useState, useEffect } from 'react';
import { Client } from '../types';
import ClientList from '../components/ClientList';
import { UserPlus, Search } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  const saveClients = (newClients: Client[]) => {
    localStorage.setItem('clients', JSON.stringify(newClients));
    setClients(newClients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      ...formData,
      id: Date.now().toString(),
    };
    saveClients([...clients, newClient]);
    setFormData({ firstName: '', lastName: '', phone: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      const updatedClients = clients.filter((client) => client.id !== id);
      saveClients(updatedClients);
    }
  };

  const handleViewHistory = (id: string) => {
    console.log('View history for client:', id);
  };

  const filteredClients = clients.filter((client) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchTerm) ||
      client.lastName.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="mb-6">Klienci</h1>

      {/* Add Client Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={18} className="text-gray-600" />
          <h2 className="text-base">Dodaj nowego klienta</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Imię</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="input"
              placeholder="Wprowadź imię"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nazwisko</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="input"
              placeholder="Wprowadź nazwisko"
            />
          </div>
          <div className="flex items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Telefon</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  placeholder="Wprowadź numer"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj klientów po imieniu, nazwisku lub numerze telefonu..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-base p-4 border-b border-gray-100">
          Lista klientów ({filteredClients.length})
        </h2>
        <ClientList
          clients={filteredClients}
          onEdit={() => {}}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
        />
      </div>
    </div>
  );
}
