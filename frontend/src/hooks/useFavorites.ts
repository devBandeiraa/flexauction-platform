import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addFavorite, getMyFavorites, removeFavorite } from '@/services/me.api';
import { useAuthStore } from '@/store/auth.store';

export function useFavorites() {
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getMyFavorites,
    enabled: isAuthenticated,
  });
}

export function useToggleFavorite(auctionId: string) {
  const queryClient = useQueryClient();
  const { data: favorites } = useFavorites();
  const isFavorited = favorites?.some((f) => f.auctionId === auctionId) ?? false;

  const mutation = useMutation({
    mutationFn: () => (isFavorited ? removeFavorite(auctionId) : addFavorite(auctionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    },
    onError: () => toast.error('Não foi possível atualizar os favoritos'),
  });

  return { isFavorited, toggle: () => mutation.mutate(), isPending: mutation.isPending };
}
