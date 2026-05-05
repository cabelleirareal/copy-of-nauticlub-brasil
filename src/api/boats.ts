import { apiClient } from './client';
import { Boat } from '../types';

export interface ListBoatsParams {
  type?: string;
  status?: string;
  size_min?: number;
  size_max?: number;
  price_min?: number;
  price_max?: number;
  location?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface ListBoatsResponse {
  data: Boat[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface CreateBoatRequest {
  name: string;
  brand: string;
  year: number;
  size: number;
  price: number;
  type: string;
  status?: string;
  description?: string;
  location?: string;
  marina?: string;
  specs: Record<string, any>;
  openToPartnerships?: boolean;
  defaultCommission?: number;
  featured?: boolean;
}

export const boatsApi = {
  list: (params?: ListBoatsParams) =>
    apiClient.get<ListBoatsResponse>('/boats', { params }),

  getById: (id: string) =>
    apiClient.get<Boat>(`/boats/${id}`),

  create: (data: CreateBoatRequest) =>
    apiClient.post<Boat>('/boats', data),

  update: (id: string, data: Partial<CreateBoatRequest>) =>
    apiClient.patch<Boat>(`/boats/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/boats/${id}`),
};
