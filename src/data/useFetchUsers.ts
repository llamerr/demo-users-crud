import { useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { User } from '../types/json-placeholder-data';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table';
import { API_URL, BROKEN_API_URL } from './api';

export function useFetchUsers() {
  const [isBroken, setIsBroken] = useState(false);
  // State for filters and sorting
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  // Fetch all users without any filtering
  const {
    data: allUsers = [],
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['users-list'],
    queryFn: async () => {
      try {
        const response = await fetch(isBroken ? BROKEN_API_URL : API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        return (await response.json()) as User[];
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    placeholderData: keepPreviousData,
  });

  // Apply filtering, sorting, and searching locally
  const filteredData = useMemo(() => {
    let filtered = [...(allUsers || [])];

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
    if (columnFilters.length > 0) {
      filtered = filtered.filter(row => {
        return columnFilters.every(filter => {
          const value = filter.id.split('.').reduce((obj, key) => obj?.[key], row);
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sorting.length > 0) {
      const sort = sorting[0];
      filtered.sort((a, b) => {
        const aValue = sort.id.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = sort.id.split('.').reduce((obj, key) => obj?.[key], b);
        
        if (aValue === bValue) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        return sort.desc 
          ? String(bValue).localeCompare(String(aValue))
          : String(aValue).localeCompare(String(bValue));
      });
    }

    return filtered;
  }, [allUsers, globalFilter, columnFilters, sorting]);

  return {
    data: filteredData,
    isError,
    isRefetching,
    isLoading,
    refetch,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    isBroken,
    setIsBroken,
  };
}