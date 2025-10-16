import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Złoty/żółty
    },
    secondary: {
      main: '#FFA500', // Pomarańczowy jako dodatkowy akcent
    },
    background: {
      default: '#121212', // Ciemne tło
      paper: '#1E1E1E',   // Nieco jaśniejsze tło dla kart
    },
    text: {
      primary: '#FFFFFF', // Biały tekst
      secondary: '#B0B0B0', // Szary tekst
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

export default theme;