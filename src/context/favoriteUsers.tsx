import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode,useContext, useEffect, useMemo, useState } from 'react';

import type { User } from '@/types/json-placeholder-data';

interface FavoriteUsersContextType {
  favoriteUserIds: number[];
  isFavorite: (userId: number) => boolean;
  toggleFavorite: (userId: number) => void;
  favorites: User[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchFavorites: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'favoriteUserIds';

const FavoriteUsersContext = createContext<FavoriteUsersContextType | undefined>(undefined);

interface FavoriteUsersProviderProps {
  children: ReactNode;
  fetchUsers: () => Promise<User[]>;
}

export const FavoriteUsersProvider = ({ children, fetchUsers }: FavoriteUsersProviderProps) => {
  const queryClient = useQueryClient();
  
  // Get favorite user IDs from localStorage
  const getFavoriteUserIds = (): number[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const [favoriteUserIds, setFavoriteUserIds] = useState<number[]>(() => getFavoriteUserIds());

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoriteUserIds));
  }, [favoriteUserIds]);

  // Fetch all users to get favorite users' details
  const {
    data: allUsers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter users to get only favorites
  const favorites = useMemo(() => {
    return allUsers.filter(user => favoriteUserIds.includes(user.id));
  }, [allUsers, favoriteUserIds]);

  const isFavorite = (userId: number) => favoriteUserIds.includes(userId);

  const toggleFavorite = (userId: number) => {
    setFavoriteUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    // Invalidate the favorites query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  const refetchFavorites = async () => {
    await refetch();
  };

  const value = {
    favoriteUserIds,
    isFavorite,
    toggleFavorite,
    favorites,
    isLoading,
    isError,
    error,
    refetchFavorites,
  };

  return (
    <FavoriteUsersContext.Provider value={value}>
      {children}
    </FavoriteUsersContext.Provider>
  );
};

export const useFavoriteUsers = (): FavoriteUsersContextType => {
  const context = useContext(FavoriteUsersContext);
  if (context === undefined) {
    throw new Error('useFavoriteUsers must be used within a FavoriteUsersProvider');
  }
  return context;
};