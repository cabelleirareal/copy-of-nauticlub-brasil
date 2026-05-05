import { apiClient } from './client';
import { Lead } from '../types';

export interface CreateLeadRequest {
  boatId?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  type?: string;
}

export interface ListLeadsParams {
  boatId?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

export interface ListLeadsResponse {
  data: Lead[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface UpdateLeadRequest {
  status?: string;
  assignedBrokerId?: string;
}

export const leadsApi = {
  create: (data: CreateLeadRequest) =>
    apiClient.post<Lead>('/leads', data),

  list: (params?: ListLeadsParams) =>
    apiClient.get<ListLeadsResponse>('/leads', { params }),

  update: (id: string, data: UpdateLeadRequest) =>
    apiClient.patch<Lead>(`/leads/${id}`, data),
};
