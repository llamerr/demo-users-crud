import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import { FavoriteUsersProvider } from './context/favoriteUsers';
import { API_URL } from './data/api';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import FavoriteUsersPage from './pages/favoriteUsers';
import UsersCrudPage from './pages/users';
import type { User } from './types/json-placeholder-data';

const queryClient = new QueryClient();

// Create a standalone fetchUsers function for the FavoriteUsersProvider
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'users/:userId?/*',
            Component: UsersCrudPage,
          },
          {
            path: 'favorite-users/:userId?/*',
            Component: FavoriteUsersPage,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoriteUsersProvider fetchUsers={fetchUsers}>
        <RouterProvider router={router} />
      </FavoriteUsersProvider>
    </QueryClientProvider>
  </StrictMode>,
)
