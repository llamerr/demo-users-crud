import * as React from 'react';


import { useParams } from 'react-router';
import { Crud } from '@toolpad/core/Crud';
import { usersDataSource, User, usersCache, usersGridDataSource } from '../data/users';
import { DataGrid } from '@mui/x-data-grid';

export default function UsersCrudPage() {
  
  
  const { userId } = useParams();
  
  

  return (
    <>
    <DataGrid
        dataSource={usersGridDataSource}
        columns={usersDataSource.fields}
        showToolbar
      />
    <Crud<User>
      dataSource={usersDataSource}
      dataSourceCache={usersCache}
      rootPath="/users"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `User ${userId}`,
        create: 'New User',
        edit: `User ${userId} - Edit`,
      }}
    />
     
    </>
  );
}
