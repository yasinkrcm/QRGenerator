import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Stack,
  Fade,
  Zoom,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeMode } from './_app'

export default function Home() {
  const theme = useTheme()
  const { toggleColorMode, mode } = useThemeMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 600px)')
  const isDark = mode === 'dark'
  
  const [text, setText] = useState('')
  const [size, setSize] = useState(400)
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [fgColor, setFgColor] = useState('#000000')
  const [level, setLevel] = useState('M')
  const [fileName, setFileName] = useState('qr-code')
  const [windowWidth, setWindowWidth] = useState(0)
  const [transparentBackground, setTransparentBackground] = useState(false)

  // Window width'i takip et
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Responsive QR kod boyutu - daha akıllı hesaplama
  const getResponsiveSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Landscape modda daha küçük
      if (isLandscape && height < 600) {
        return Math.min(size, Math.min(width * 0.3, height * 0.4))
      }
      
      // Mobilde ekran genişliğine göre
      if (width < 600) {
        return Math.min(size, width - 100) // Daha fazla padding
      }
      
      // Tablet
      if (width < 960) {
        return Math.min(size, 350)
      }
    }
    return size
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = size
    canvas.height = size
    
    // Şeffaf arka plan için canvas'ı temizle
    if (transparentBackground) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    } else {
      // Arka plan rengini ayarla
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      // Şeffaf arka plan için PNG formatını kullan (zaten şeffaf destekler)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      const finalFileName = fileName.trim() || 'qr-code'
      downloadLink.download = `${finalFileName}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const examples = [
    'https://www.google.com',
    'Merhaba Dünya!',
    'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;',
    'tel:+905551234567',
    'mailto:ornek@email.com',
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 2 },
        transition: 'background 0.3s ease',
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          position: 'relative',
        }}
      >
        {/* Tema Değiştirme Butonu */}
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 9999,
          }}
        >
          <Tooltip title={isDark ? 'Açık Tema' : 'Koyu Tema'} arrow>
            <IconButton
              onClick={toggleColorMode}
              sx={{
                bgcolor: isDark 
                  ? 'rgba(102, 126, 234, 0.9)' 
                  : 'rgba(255, 255, 255, 0.95)',
                color: isDark ? '#fff' : '#667eea',
                backdropFilter: 'blur(20px)',
                boxShadow: isDark
                  ? '0 8px 32px rgba(102, 126, 234, 0.4)'
                  : '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.2)'}`,
                width: { xs: 48, sm: 52 },
                height: { xs: 48, sm: 52 },
                '&:hover': {
                  bgcolor: isDark 
                    ? 'rgba(102, 126, 234, 1)' 
                    : 'rgba(255, 255, 255, 1)',
                  transform: 'rotate(180deg) scale(1.1)',
                  boxShadow: isDark
                    ? '0 12px 40px rgba(102, 126, 234, 0.6)'
                    : '0 12px 40px rgba(0, 0, 0, 0.25)',
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: { xs: 24, sm: 28 } }} /> : <DarkModeIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
            </IconButton>
          </Tooltip>
        </Box>

        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { 
                xs: isLandscape ? 2 : 2.5, 
                sm: 3, 
                md: 5, 
                lg: 6 
              },
              borderRadius: { xs: 3, md: 4 },
              background: isDark
                ? 'linear-gradient(to bottom, #1e1e2e 0%, #252538 100%)'
                : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              position: 'relative',
              overflow: 'hidden',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              transition: 'all 0.3s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: { xs: '3px', md: '4px' },
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Box 
              textAlign="center" 
              mb={{ xs: isLandscape ? 2 : 3, sm: 4, md: 5 }}
              sx={{
                position: 'relative',
              }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center" 
                justifyContent="center" 
                spacing={{ xs: isLandscape ? 0.5 : 1, sm: 2 }}
                mb={{ xs: isLandscape ? 1 : 1.5, sm: 2 }}
              >
                <Zoom in timeout={1000}>
                  <Box
                    sx={{
                      width: { xs: 48, sm: 56, md: 72 },
                      height: { xs: 48, sm: 56, md: 72 },
                      position: 'relative',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': {
                          transform: 'translateY(0px)',
                        },
                        '50%': {
                          transform: 'translateY(-10px)',
                        },
                      },
                    }}
                  >
                    <img
                      src="/favicon.svg"
                      alt="QR Code Logo"
                      style={{ 
                        display: 'block',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Box>
                </Zoom>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { 
                        xs: isLandscape ? '1.25rem' : '1.5rem', 
                        sm: '1.75rem', 
                        md: '2.5rem',
                        lg: '3rem' 
                      },
                      lineHeight: { xs: 1.2, md: 1.3 },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    QR Kod Oluşturucu
                  </Typography>
                </Box>
              </Stack>
              {!isLandscape && (
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: 400,
                    opacity: isDark ? 0.9 : 0.8,
                    fontSize: { 
                      xs: '0.8125rem', 
                      sm: '0.9375rem', 
                      md: '1.125rem',
                      lg: '1.25rem' 
                    },
                    px: { xs: 1.5, sm: 0 },
                    display: { xs: isLandscape ? 'none' : 'block' },
                    color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'text.secondary',
                  }}
                >
                  Metin, URL veya herhangi bir veri için QR kod oluşturun
                </Typography>
              )}
            </Box>

          <Grid 
            container 
            spacing={{ xs: isLandscape ? 1.5 : 2, sm: 2.5, md: 3, lg: 4 }}
            sx={{
              flexDirection: { xs: isLandscape ? 'row' : 'column', md: 'row' },
            }}
          >
            {/* Sol Taraf - Form */}
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{
                order: { xs: 1, md: 1 },
                maxWidth: { xs: isLandscape ? '50%' : '100%', md: '100%' },
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { 
                    xs: isLandscape ? 1.5 : 2, 
                    sm: 2, 
                    md: 2.5, 
                    lg: 3 
                  },
                  bgcolor: isDark ? 'rgba(30, 30, 46, 0.6)' : 'grey.50',
                  borderRadius: { xs: 2, md: 3 },
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'divider',
                  height: { xs: isLandscape ? '100%' : 'auto', md: 'auto' },
                  transition: 'all 0.3s ease',
                  backdropFilter: isDark ? 'blur(10px)' : 'none',
                }}
              >
                <Stack spacing={{ xs: isLandscape ? 1.5 : 2, sm: 2, md: 2.5, lg: 3 }}>
                <TextField
                  label="Metin veya URL"
                  multiline
                  rows={{ xs: isLandscape ? 2 : 3, sm: 3, md: 4 }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="QR kod için metin veya URL girin..."
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      color: isDark ? '#ffffff' : 'inherit',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      ...(isDark && {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      }),
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      ...(isDark && {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      }),
                    },
                    '& .MuiInputBase-input::placeholder': {
                      ...(isDark && {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      }),
                      ...(!isDark && {
                        opacity: 0.6,
                      }),
                    },
                  }}
                />

                <TextField
                  label="Dosya Adı"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="qr-code"
                  fullWidth
                  variant="outlined"
                  helperText="İndirilen dosyanın adı (uzantı otomatik eklenir)"
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: isDark ? '#ffffff' : 'inherit',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      ...(isDark && {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      }),
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      ...(isDark && {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      }),
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      ...(isDark && {
                        color: 'rgba(255, 255, 255, 0.6)',
                      }),
                    },
                    '& .MuiInputBase-input::placeholder': {
                      ...(isDark && {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      }),
                      ...(!isDark && {
                        opacity: 0.6,
                      }),
                    },
                  }}
                />

                <Grid container spacing={{ xs: isLandscape ? 1 : 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography 
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: '0.8125rem', sm: '0.9375rem', md: '1rem' },
                          mb: { xs: 0.5, sm: 1 },
                          color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                        }}
                      >
                        Boyut: {size}px
                      </Typography>
                      <Slider
                        value={size}
                        onChange={(e, newValue) => setSize(newValue)}
                        min={128}
                        max={512}
                        step={8}
                        marks={!isMobile}
                        markLabelDisplay={isMobile ? 'none' : 'on'}
                        sx={{
                          '& .MuiSlider-markLabel': {
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            display: { xs: 'none', sm: 'block' },
                            ...(isDark && {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }),
                          },
                          '& .MuiSlider-thumb': {
                            width: { xs: 18, sm: 20 },
                            height: { xs: 18, sm: 20 },
                            ...(isDark && {
                              backgroundColor: '#667eea',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                              '&:hover': {
                                boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                              },
                            }),
                          },
                          '& .MuiSlider-rail': {
                            height: { xs: 4, sm: 6 },
                            ...(isDark && {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            }),
                          },
                          '& .MuiSlider-track': {
                            height: { xs: 4, sm: 6 },
                            ...(isDark && {
                              backgroundColor: '#667eea',
                            }),
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel 
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          ...(isDark && {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#667eea',
                            },
                          }),
                        }}
                      >
                        Hata Düzeltme
                      </InputLabel>
                      <Select
                        value={level}
                        label="Hata Düzeltme"
                        onChange={(e) => setLevel(e.target.value)}
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: isDark ? '#ffffff' : 'inherit',
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          '& .MuiSelect-select': {
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                          },
                          ...(isDark && {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea',
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }),
                        }}
                      >
                        <MenuItem 
                          value="L" 
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                            ...(isDark && {
                              bgcolor: 'rgba(30, 30, 46, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                              },
                            }),
                          }}
                        >
                          Düşük (L)
                        </MenuItem>
                        <MenuItem 
                          value="M" 
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                            ...(isDark && {
                              bgcolor: 'rgba(30, 30, 46, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                              },
                            }),
                          }}
                        >
                          Orta (M)
                        </MenuItem>
                        <MenuItem 
                          value="Q" 
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                            ...(isDark && {
                              bgcolor: 'rgba(30, 30, 46, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                              },
                            }),
                          }}
                        >
                          Yüksek (Q)
                        </MenuItem>
                        <MenuItem 
                          value="H" 
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                            ...(isDark && {
                              bgcolor: 'rgba(30, 30, 46, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                              },
                            }),
                          }}
                        >
                          Çok Yüksek (H)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                      }}
                    >
                      Arka Plan Rengi
                    </Typography>
                    <Stack spacing={1.5}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={transparentBackground}
                            onChange={(e) => setTransparentBackground(e.target.checked)}
                            sx={{
                              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'primary.main',
                              '&.Mui-checked': {
                                color: '#667eea',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                            }}
                          >
                            Şeffaf Arka Plan
                          </Typography>
                        }
                      />
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: transparentBackground ? 0.5 : 1 }}>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          disabled={transparentBackground}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 8,
                            border: '2px solid #e0e0e0',
                            cursor: transparentBackground ? 'not-allowed' : 'pointer',
                            flexShrink: 0,
                            opacity: transparentBackground ? 0.5 : 1,
                          }}
                        />
                        <TextField
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          placeholder="#FFFFFF"
                          size="small"
                          fullWidth
                          disabled={transparentBackground}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              color: isDark ? '#ffffff' : 'inherit',
                              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                              ...(isDark && {
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              }),
                            },
                            '& .MuiInputBase-input::placeholder': {
                              ...(isDark && {
                                color: 'rgba(255, 255, 255, 0.5)',
                                opacity: 1,
                              }),
                              ...(!isDark && {
                                opacity: 0.6,
                              }),
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                      }}
                    >
                      Ön Plan Rengi
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          border: '2px solid #e0e0e0',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                      <TextField
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        placeholder="#000000"
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? '#ffffff' : 'inherit',
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            ...(isDark && {
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                              },
                            }),
                          },
                          '& .MuiInputBase-input::placeholder': {
                            ...(isDark && {
                              color: 'rgba(255, 255, 255, 0.5)',
                              opacity: 1,
                            }),
                            ...(!isDark && {
                              opacity: 0.6,
                            }),
                          },
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                </Stack>
              </Paper>
            </Grid>

            {/* Sağ Taraf - QR Kod Önizleme */}
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{
                order: { xs: 2, md: 2 },
                maxWidth: { xs: isLandscape ? '50%' : '100%', md: '100%' },
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  mt: { xs: isLandscape ? 0 : 2, md: 0 },
                  height: { xs: isLandscape ? '100%' : 'auto', md: 'auto' },
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: { 
                      xs: isLandscape ? 1.5 : 2, 
                      sm: 2.5, 
                      md: 3, 
                      lg: 4 
                    },
                    mb: { xs: isLandscape ? 1 : 2, sm: 2, md: 3 },
                    bgcolor: isDark ? 'rgba(30, 30, 46, 0.7)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: { xs: 2, md: 3 },
                    border: '2px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'divider',
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '450px', md: '500px' },
                    '&:hover': {
                      boxShadow: 12,
                      transform: { xs: 'none', md: 'scale(1.02)' },
                    },
                  }}
                >
                  {text ? (
                    <Box 
                      id="qr-container"
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: transparentBackground 
                          ? isDark
                            ? 'repeating-conic-gradient(#2a2a3a 0% 25%, #1e1e2e 0% 50%) 50% / 20px 20px'
                            : 'repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px'
                          : 'transparent',
                        borderRadius: 2,
                        p: transparentBackground ? 2 : 0,
                        '& svg': {
                          maxWidth: '100%',
                          height: 'auto',
                        },
                      }}
                    >
                      <QRCodeSVG
                        id="qr-code"
                        value={text}
                        size={getResponsiveSize()}
                        bgColor={transparentBackground ? 'transparent' : bgColor}
                        fgColor={fgColor}
                        level={level}
                        includeMargin={true}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: { xs: '100%', sm: size },
                        height: { xs: '200px', sm: size },
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isDark ? 'transparent' : 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        textAlign="center"
                        px={2}
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        }}
                      >
                        QR kod görünümü için metin girin
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {text && (
                  <Zoom in timeout={500}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<DownloadIcon />}
                      onClick={downloadQR}
                      fullWidth
                      sx={{
                        py: { 
                          xs: isLandscape ? 1.25 : 1.5, 
                          sm: 1.6, 
                          md: 1.8 
                        },
                        minHeight: { xs: '44px', sm: '48px' }, // Touch-friendly
                        fontSize: { 
                          xs: '0.8125rem', 
                          sm: '0.9375rem', 
                          md: '1rem' 
                        },
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        maxWidth: { xs: '100%', sm: '450px', md: '500px' },
                        '& .MuiButton-startIcon': {
                          marginRight: { xs: 0.5, sm: 1 },
                          '& > *:nth-of-type(1)': {
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                          },
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      QR Kodu İndir (PNG)
                    </Button>
                  </Zoom>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Örnekler */}
          {!isLandscape && (
            <Box 
              mt={{ xs: 2.5, sm: 3, md: 4, lg: 5 }} 
              pt={{ xs: 2.5, sm: 3, md: 3.5, lg: 4 }} 
              borderTop={2} 
              borderColor="divider"
              sx={{
                background: isDark 
                  ? 'linear-gradient(to right, transparent, rgba(102, 126, 234, 0.1), transparent)'
                  : 'linear-gradient(to right, transparent, rgba(102, 126, 234, 0.05), transparent)',
                borderRadius: { xs: 2, md: 2 },
                p: { xs: 1.25, sm: 1.5, md: 2 },
                transition: 'all 0.3s ease',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight={600}
                sx={{
                  mb: { xs: 1.25, sm: 1.5, md: 2 },
                  color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'text.primary',
                  fontSize: { 
                    xs: '0.9375rem', 
                    sm: '1.125rem', 
                    md: '1.375rem',
                    lg: '1.5rem' 
                  },
                }}
              >
                Hızlı Örnekler
              </Typography>
              <Stack 
                direction="row" 
                spacing={{ xs: 0.75, sm: 1, md: 1.5 }} 
                flexWrap="wrap" 
                useFlexGap
                sx={{
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: { xs: 0.75, sm: 1, md: 1.5 },
                }}
              >
                {examples.map((example, index) => (
                  <Chip
                    key={example}
                    label={example.length > (isMobile ? 18 : 20) ? example.substring(0, isMobile ? 18 : 20) + '...' : example}
                    onClick={() => setText(example)}
                    clickable
                    variant="outlined"
                    sx={{
                      fontSize: { xs: '0.6875rem', sm: '0.8125rem', md: '0.875rem' },
                      height: { xs: 28, sm: 30, md: 32 },
                      minHeight: { xs: 28, sm: 30, md: 32 },
                      padding: { xs: '0 8px', sm: '0 12px' },
                      ...(isDark && {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: isDark ? 'white' : '#000000',
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}
