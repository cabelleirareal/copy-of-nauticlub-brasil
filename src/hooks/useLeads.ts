import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, CreateLeadRequest, ListLeadsParams } from '../api/leads';
import toast from 'react-hot-toast';

export const useLeads = (params?: ListLeadsParams) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const { data } = await leadsApi.list(params);
      return data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLeadRequest) => {
      const { data: lead } = await leadsApi.create(data);
      return lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead criado com sucesso!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || 'Erro ao criar lead';
      toast.error(message);
    },
  });
};
