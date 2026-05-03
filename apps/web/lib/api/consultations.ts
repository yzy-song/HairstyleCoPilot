import { apiClient } from './client';
import type { Consultation, GeneratedImage } from '../types';

export function createQuickConsult(): Promise<Consultation> {
  return apiClient<Consultation>('/consultations/quick', { method: 'POST' });
}

export function createConsultation(clientId: number): Promise<Consultation> {
  return apiClient<Consultation>('/consultations', {
    method: 'POST',
    body: { clientId },
  });
}

export function getConsultation(id: number): Promise<Consultation> {
  return apiClient<Consultation>(`/consultations/${id}`);
}

export function updateConsultation(
  id: number,
  data: { clientId?: number; notes?: string; tags?: string[]; status?: 'SAVED' | 'TEMPORARY' },
): Promise<Consultation> {
  return apiClient<Consultation>(`/consultations/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export function getGeneratedImages(consultationId: number): Promise<GeneratedImage[]> {
  return apiClient<GeneratedImage[]>(`/consultations/${consultationId}/generated-images`);
}

export function createGeneratedImage(
  consultationId: number,
  image: File,
  templateId: number,
  modelKey: string,
  options?: Record<string, unknown>,
): Promise<GeneratedImage> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('templateId', String(templateId));
  formData.append('modelKey', modelKey);
  if (options) {
    formData.append('options', JSON.stringify(options));
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return fetch(`${API_URL}/consultations/${consultationId}/generated-images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('Generation failed');
    return res.json().then((d) => d.data || d);
  });
}
