import { apiClient } from './client';
import type { HairstyleTemplate, PaginatedResponse } from '../types';

export function getTemplates(page = 1, limit = 20, tags?: string[]): Promise<PaginatedResponse<HairstyleTemplate>> {
  const tagQuery = tags && tags.length > 0 ? `&tags=${tags.join(',')}` : '';
  return apiClient<PaginatedResponse<HairstyleTemplate>>(`/templates?page=${page}&limit=${limit}${tagQuery}`);
}

export function getTemplate(id: number): Promise<HairstyleTemplate> {
  return apiClient<HairstyleTemplate>(`/templates/${id}`);
}
