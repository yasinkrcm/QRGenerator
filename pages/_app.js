import { useState, useEffect, useMemo, createContext, useContext } from 'react'
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Analytics } from '@vercel/analytics/next'

// Tema Context
const ThemeModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
})

export const useThemeMode = () => useContext(ThemeModeContext)

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState('light')

  // localStorage'dan tema tercihini yükle
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light'
    setMode(savedMode)

    // Service Worker'ı kaydet
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registered:', registration))
        .catch((error) => console.log('Service Worker registration failed:', error))
    }
  }, [])

  // Tema değiştirme fonksiyonu
  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('themeMode', newMode)
  }

  // Light ve Dark tema oluştur
  const getTheme = (mode) => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#667eea' : '#1976d2',
        light: mode === 'dark' ? '#8fa4f0' : '#42a5f5',
        dark: mode === 'dark' ? '#5568d3' : '#1565c0',
      },
      secondary: {
        main: mode === 'dark' ? '#764ba2' : '#9c27b0',
      },
      background: {
        default: mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paper: mode === 'dark' ? '#1e1e2e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
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
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(to bottom, #1e1e2e 0%, #252538 100%)'
              : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1e1e2e' : '#ffffff',
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(to bottom, #1e1e2e 0%, #252538 100%)'
              : 'none',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1e1e2e' : '#ffffff',
            backgroundImage: mode === 'dark' 
              ? 'linear-gradient(to bottom, #1e1e2e 0%, #252538 100%)'
              : 'none',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          },
        },
      },
    },
  })

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ toggleColorMode, mode }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
