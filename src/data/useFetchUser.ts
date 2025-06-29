import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { User } from '../types/json-placeholder-data';
import { API_URL, BROKEN_API_URL } from './api';

export function useFetchUser(userId: number | undefined) {
  const [isBroken, setIsBroken] = useState(false);

  const {
    data: user,
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<User | undefined>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return undefined;
      try {
        const response = await fetch(`${isBroken ? BROKEN_API_URL : API_URL}/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return (await response.json()) as User;
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  return {
    user,
    isError,
    isRefetching,
    isLoading,
    refetch,
    isBroken,
    setIsBroken,
  };
}