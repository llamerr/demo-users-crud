import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <DashboardLayout >
      <Outlet />
    </DashboardLayout>
  );
}