import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boatsApi, ListBoatsParams, CreateBoatRequest } from '../api/boats';
import toast from 'react-hot-toast';

export const useBoats = (params?: ListBoatsParams) => {
  return useQuery({
    queryKey: ['boats', params],
    queryFn: async () => {
      const { data } = await boatsApi.list(params);
      return data;
    },
  });
};

export const useBoatById = (id: string) => {
  return useQuery({
    queryKey: ['boats', id],
    queryFn: async () => {
      const { data } = await boatsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateBoat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBoatRequest) => {
      const { data: boat } = await boatsApi.create(data);
      return boat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Barco criado com sucesso!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || 'Erro ao criar barco';
      toast.error(message);
    },
  });
};

export const useUpdateBoat = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateBoatRequest>) => {
      const { data: boat } = await boatsApi.update(id, data);
      return boat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      queryClient.invalidateQueries({ queryKey: ['boats', id] });
      toast.success('Barco atualizado com sucesso!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || 'Erro ao atualizar barco';
      toast.error(message);
    },
  });
};

export const useDeleteBoat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await boatsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Barco deletado com sucesso!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || 'Erro ao deletar barco';
      toast.error(message);
    },
  });
};
