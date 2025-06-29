import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import type { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';

import theme from './theme';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'users',
    title: 'Users',
    icon: <PersonIcon />,
    pattern: 'users{/:userId}*',
  },
  {
    segment: 'favorite-users',
    title: 'Favorite Users',
    icon: <PersonSearchIcon />,
    pattern: 'favorite-users{/:userId}*',
  },
];

const BRANDING = {
  title: "demo-users-crud",
};


export default function App() {
  
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={theme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}