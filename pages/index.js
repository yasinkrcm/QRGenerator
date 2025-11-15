import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
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
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

export default function Home() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(400)
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [fgColor, setFgColor] = useState('#000000')
  const [level, setLevel] = useState('M')
  const [fileName, setFileName] = useState('qr-code')

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = size
    canvas.height = size
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Box 
              textAlign="center" 
              mb={5}
              sx={{
                position: 'relative',
              }}
            >
              <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="center" 
                spacing={2}
                mb={2}
              >
                <Zoom in timeout={1000}>
                  <Box
                    sx={{
                      width: { xs: 56, md: 72 },
                      height: { xs: 56, md: 72 },
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
                      width={72}
                      height={72}
                      style={{ display: 'block' }}
                    />
                  </Box>
                </Zoom>
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '2rem', md: '3rem' },
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
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  fontWeight: 400,
                  opacity: 0.8,
                }}
              >
                Metin, URL veya herhangi bir veri için QR kod oluşturun
              </Typography>
            </Box>

          <Grid container spacing={4}>
            {/* Sol Taraf - Form */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={3}>
                <TextField
                  label="Metin veya URL"
                  multiline
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="QR kod için metin veya URL girin..."
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Dosya Adı"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="qr-code"
                  fullWidth
                  variant="outlined"
                  helperText="İndirilen dosyanın adı (uzantı otomatik eklenir)"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography gutterBottom>
                        Boyut: {size}px
                      </Typography>
                      <Slider
                        value={size}
                        onChange={(e, newValue) => setSize(newValue)}
                        min={128}
                        max={512}
                        step={8}
                        marks={[
                          { value: 128, label: '128' },
                          { value: 256, label: '256' },
                          { value: 384, label: '384' },
                          { value: 512, label: '512' },
                        ]}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Hata Düzeltme</InputLabel>
                      <Select
                        value={level}
                        label="Hata Düzeltme"
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        <MenuItem value="L">Düşük (L)</MenuItem>
                        <MenuItem value="M">Orta (M)</MenuItem>
                        <MenuItem value="Q">Yüksek (Q)</MenuItem>
                        <MenuItem value="H">Çok Yüksek (H)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>Arka Plan Rengi</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 8,
                          border: '2px solid #e0e0e0',
                          cursor: 'pointer',
                        }}
                      />
                      <TextField
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        placeholder="#FFFFFF"
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>Ön Plan Rengi</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 8,
                          border: '2px solid #e0e0e0',
                          cursor: 'pointer',
                        }}
                      />
                      <TextField
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        placeholder="#000000"
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                </Grid>
                </Stack>
              </Paper>
            </Grid>

            {/* Sağ Taraf - QR Kod Önizleme */}
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    mb: 3,
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 12,
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  {text ? (
                    <Box id="qr-container">
                      <QRCodeSVG
                        id="qr-code"
                        value={text}
                        size={size}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        level={level}
                        includeMargin={true}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: size,
                        height: size,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        px={2}
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
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
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
          <Box 
            mt={5} 
            pt={4} 
            borderTop={2} 
            borderColor="divider"
            sx={{
              background: 'linear-gradient(to right, transparent, rgba(102, 126, 234, 0.05), transparent)',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{
                mb: 2,
                color: 'text.primary',
              }}
            >
              Hızlı Örnekler
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {examples.map((example, index) => (
                <Chip
                  key={example}
                  label={example.length > 25 ? example.substring(0, 25) + '...' : example}
                  onClick={() => setText(example)}
                  clickable
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}
