import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { useQuery, QueryObserverResult, keepPreviousData } from '@tanstack/react-query';
import { User } from '../types/json-placeholder-data';
import { API_URL, BROKEN_API_URL } from '../data/api';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table';

interface UserContextType {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<User[], Error>>;
  isRefetching: boolean;
  isSuccess: boolean;
  isBroken: boolean;
  setIsBroken: (value: boolean) => void;
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: (filters: MRT_ColumnFiltersState) => void;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  sorting: MRT_SortingState;
  setSorting: (sorting: MRT_SortingState) => void;
  filteredData: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isBroken, setIsBroken] = useState(false);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isRefetching,
    isSuccess,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(isBroken ? BROKEN_API_URL : API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    placeholderData: keepPreviousData,
  });

  // Apply filtering, sorting, and searching
  const filteredData = useMemo(() => {
    let filtered = [...(users || [])];

    // Apply global filter (search)
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(user => 
        Object.values(user).some(
          value => value && 
                  value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply column filters
    if (columnFilters?.length) {
      filtered = filtered.filter(row => {
        return columnFilters.every(filter => {
          const value = row[filter.id as keyof User];
          if (value === undefined) return false;
          return value
            .toString()
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sorting?.length) {
      const sort = sorting[0];
      const { id, desc } = sort;
      filtered.sort((a, b) => {
        const aValue = a[id as keyof User];
        const bValue = b[id as keyof User];
        
        if (aValue === bValue) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        return (aValue < bValue ? -1 : 1) * (desc ? -1 : 1);
      });
    }

    return filtered;
  }, [users, globalFilter, columnFilters, sorting]);

  const value = {
    users: filteredData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isRefetching,
    isSuccess,
    isBroken,
    setIsBroken,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    filteredData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};