const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Clients API
export const clientsApi = {
  getAll: () => fetchApi('/clients'),
  create: (data: any) => fetchApi('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// Services API
export const servicesApi = {
  getAll: () => fetchApi('/services'),
  create: (data: any) => fetchApi('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi(`/services/${id}`, {
    method: 'DELETE',
  }),
};

// Appointments API
export const appointmentsApi = {
  getAll: () => fetchApi('/appointments'),
  create: (data: any) => fetchApi('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePayment: (id: string, isPaid: boolean) => fetchApi(`/appointments/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ isPaid }),
  }),
  updateNotes: (id: string, notes: string) => fetchApi(`/appointments/${id}/notes`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  }),
  delete: (id: string) => fetchApi(`/appointments/${id}`, {
    method: 'DELETE',
  }),
};
