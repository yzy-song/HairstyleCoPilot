import { apiClient } from './client';
import type { Client, PaginatedResponse } from '../types';

export function getClients(page = 1, limit = 10): Promise<PaginatedResponse<Client>> {
  return apiClient<PaginatedResponse<Client>>(`/clients?page=${page}&limit=${limit}`);
}

export function getClient(id: number): Promise<Client> {
  return apiClient<Client>(`/clients/${id}`);
}

export function createClient(data: { name: string; notes?: string }): Promise<Client> {
  return apiClient<Client>('/clients', {
    method: 'POST',
    body: data,
  });
}

export function updateClient(id: number, data: { name?: string; notes?: string }): Promise<Client> {
  return apiClient<Client>(`/clients/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export function deleteClient(id: number): Promise<void> {
  return apiClient(`/clients/${id}`, { method: 'DELETE' });
}

export function uploadClientPhoto(id: number, file: File): Promise<Client> {
  const formData = new FormData();
  formData.append('photo', file);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return fetch(`${API_URL}/clients/${id}/photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json().then((d) => d.data || d);
  });
}
