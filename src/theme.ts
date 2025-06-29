
  "use client";
  import { createTheme } from '@mui/material/styles';

  const theme = createTheme({
    components: {
    },
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
  });

  export default theme;
  