'use client';
import { DataSource, DataSourceCache, DataModel } from '@toolpad/core/Crud';
import { z } from 'zod';
import { Address, Company } from '../types/json-placeholder-data';
import { GridDataSource, GridGetRowsParams } from '@mui/x-data-grid';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export interface User extends DataModel {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export const usersGridDataSource: GridDataSource = {
  getRows: async (params: GridGetRowsParams) => {
    const response = await fetch(API_URL, {
      method: 'GET',
      body: JSON.stringify(params),
    });
    const data = await response.json();

    return {
      rows: data,
      rowCount: data.length,
    };
  },
}

export const usersDataSource: DataSource<User> = {
  fields: [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'username', headerName: 'Username', width: 120 },
    {
      field: 'company',
      headerName: 'Company',
      width: 160,
      valueGetter: (value: Company) => {
        return value?.name;
      },
    },
  ],
  
  async getMany({ paginationModel, filterModel, sortModel }) {
    try {
      // Fetch all users from the API
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let users = await response.json() as User[];

      // Apply filters if any
      if (filterModel?.items?.length) {
        users = users.filter((user) => {
          return filterModel.items.every(({ field, value, operator = 'contains' }) => {
            if (!field || value == null) return true;
            
            // Handle nested fields (e.g., 'company.name')
            const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], user as any);
            
            if (fieldValue == null) return false;
            
            const fieldStr = String(fieldValue).toLowerCase();
            const valueStr = String(value).toLowerCase();
            
            switch (operator) {
              case 'contains':
                return fieldStr.includes(valueStr);
              case 'equals':
                return fieldStr === valueStr;
              case 'startsWith':
                return fieldStr.startsWith(valueStr);
              case 'endsWith':
                return fieldStr.endsWith(valueStr);
              case '>':
                return fieldValue > value;
              case '<':
                return fieldValue < value;
              default:
                return true;
            }
          });
        });
      }

      // Apply sorting if any
      if (sortModel?.length) {
        users.sort((a, b) => {
          for (const { field, sort } of sortModel) {
            // Handle nested fields for sorting
            const aValue = field.split('.').reduce((obj, key) => obj?.[key], a as any);
            const bValue = field.split('.').reduce((obj, key) => obj?.[key], b as any);
            
            if (aValue < bValue) return sort === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      // Apply pagination
      const start = paginationModel.page * paginationModel.pageSize;
      const end = start + paginationModel.pageSize;
      const paginatedUsers = users.slice(start, end);

      return {
        items: paginatedUsers,
        itemCount: users.length,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getOne(userId) {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as User;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  async createOne(data) {
    try {
      // Generate a temporary ID (since JSONPlaceholder is read-only for posts)
      const tempId = Math.floor(Math.random() * 10000);
      const newUser = { ...data, id: tempId };
      
      // In a real app, you would make a POST request here
      // const response = await fetch(API_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return await response.json();
      
      // For demo purposes, we'll just return the new user
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateOne(userId, data) {
    try {
      // In a real app, you would make a PUT/PATCH request here
      // const response = await fetch(`${API_URL}/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return await response.json();
      
      // For demo purposes, we'll just return the updated data
      return { ...data, id: Number(userId) };
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  async deleteOne(userId) {
    try {
      // In a real app, you would make a DELETE request here
      // const response = await fetch(`${API_URL}/${userId}`, {
      //   method: 'DELETE'
      // });
      // return response.ok;
      
      // For demo purposes, we'll just return true
      return true;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    username: z.string({ required_error: 'Username is required' }).nonempty('Username is required'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').or(z.literal('')).optional(),
    'company.name': z.string().optional(),
  })['~standard'].validate,
};

export const usersCache = new DataSourceCache();
