import { createContext, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    body1: {
    fontFamily: '"Open Sans", serif',
    letterSpacing: '0.5px',
    lineHeight: 1.6,
    },
    body2: {
    fontFamily: '"Open Sans", serif',
    },
    h2: {
    fontFamily: '"Work Sans", serif',
    fontWeight: 600,
    },
    h4: {
    fontFamily: '"Work Sans", serif',
    fontWeight: 600,
    },
    h5: {
    fontFamily: '"Work Sans", serif',
    fontWeight: 600,
    },
    h6: {
    fontFamily: '"Work Sans", serif',
    fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#008080',
    },
    secondary: {
      main: '#FF6F61',
    },
    background: {
        default: '#F2EEE8',
    },
    error: {
      main: '#f44336',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          textTransform: 'none',
          fontFamily: '"Work Sans", serif',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#008080',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#33A1A1',
          },
        },
        containedSecondary: {
          backgroundColor: '#FF6F61',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#9a0036',
          },
        },
        outlinedPrimary: {
          borderColor: '#008080',
          color: '#008080',
          '&:hover': {
            borderColor: '#33A1A1',
            backgroundColor: 'rgba(17, 82, 147, 0.04)',
          },
        },
        outlinedSecondary: {
          borderColor: '#FF6F61',
          color: '#FF6F61',
          '&:hover': {
            borderColor: '#9a0036',
            backgroundColor: 'rgba(154, 0, 54, 0.04)',
          },
        },
      },
    },
  },
});

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};