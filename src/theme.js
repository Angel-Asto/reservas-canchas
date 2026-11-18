import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    primary: { main: '#1b7f4b' },
    secondary: { main: '#f59e0b' },
    background: { default: '#f4f7f5' },
  },
  typography: { fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', h3: { fontWeight: 700 }, h5: { fontWeight: 600 } },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #e1e8e4' } } },
  },
})
