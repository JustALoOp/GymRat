import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFD700', // Złoty/żółty dla głównych akcji
        },
        secondary: {
            main: '#1976d2', // Standardowy niebieski dla drugorzędnych elementów
        },
        background: {
            default: '#121212', // Głębokie, ciemne tło
            paper: '#1E1E1E',   // Nieco jaśniejsze tło dla powierzchni takich jak karty i szuflady
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1E1E1E', // Dopasowanie do tła 'paper'
                    elevation: 0,
                    borderBottom: '1px solid #333', // Subtelny separator
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Łagodniejsze rogi
                    textTransform: 'none', // Nowocześniejszy wygląd przycisków
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Spójne, łagodniejsze rogi
                }
            }
        }
    },
});

export default theme;