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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ShareIcon from '@mui/icons-material/Share'
import PrintIcon from '@mui/icons-material/Print'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import HistoryIcon from '@mui/icons-material/History'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
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
  const [logoImage, setLogoImage] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoSize, setLogoSize] = useState(25)
  const [logoShape, setLogoShape] = useState('square')
  const [logoBgColor, setLogoBgColor] = useState('#FFFFFF')
  const [logoTransparent, setLogoTransparent] = useState(false)
  const [logoBorderRadius, setLogoBorderRadius] = useState(8)
  const [qrTemplate, setQrTemplate] = useState('text')
  const [gradientEnabled, setGradientEnabled] = useState(false)
  const [gradientColor, setGradientColor] = useState('#764ba2')
  const [history, setHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

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

  // Geçmiş ve favorileri localStorage'dan yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('qr-history')
      const savedFavorites = localStorage.getItem('qr-favorites')
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + S: İndir
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (text) downloadQR('png')
      }
      // Ctrl/Cmd + Shift + S: SVG olarak indir
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault()
        if (text) downloadQR('svg')
      }
      // Ctrl/Cmd + P: Yazdır
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        if (text) printQR()
      }
      // Ctrl/Cmd + H: Geçmiş
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault()
        setShowHistory(!showHistory)
      }
      // Esc: Dialog'ları kapat
      if (e.key === 'Escape') {
        setShowHistory(false)
        setShowScanner(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [text, showHistory, showScanner])

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

  const downloadQR = (format = 'png') => {
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
      
      // Eğer logo varsa, QR kodun ortasına ekle
      if (logoImage) {
        const logoImg = new Image()
        logoImg.onload = () => {
          // Logo boyutunu kullanıcı tercihine göre ayarla
          const calculatedLogoSize = size * (logoSize / 100)
          const logoX = (size - calculatedLogoSize) / 2
          const logoY = (size - calculatedLogoSize) / 2
          
          // Logo arka plan
          if (!logoTransparent) {
            const padding = calculatedLogoSize * 0.1
            ctx.fillStyle = logoBgColor
            
            if (logoShape === 'circle') {
              ctx.beginPath()
              ctx.arc(size / 2, size / 2, (calculatedLogoSize + padding * 2) / 2, 0, Math.PI * 2)
              ctx.fill()
            } else {
              ctx.beginPath()
              const radius = logoBorderRadius
              ctx.moveTo(logoX - padding + radius, logoY - padding)
              ctx.lineTo(logoX + calculatedLogoSize + padding - radius, logoY - padding)
              ctx.arcTo(logoX + calculatedLogoSize + padding, logoY - padding, logoX + calculatedLogoSize + padding, logoY - padding + radius, radius)
              ctx.lineTo(logoX + calculatedLogoSize + padding, logoY + calculatedLogoSize + padding - radius)
              ctx.arcTo(logoX + calculatedLogoSize + padding, logoY + calculatedLogoSize + padding, logoX + calculatedLogoSize + padding - radius, logoY + calculatedLogoSize + padding, radius)
              ctx.lineTo(logoX - padding + radius, logoY + calculatedLogoSize + padding)
              ctx.arcTo(logoX - padding, logoY + calculatedLogoSize + padding, logoX - padding, logoY + calculatedLogoSize + padding - radius, radius)
              ctx.lineTo(logoX - padding, logoY - padding + radius)
              ctx.arcTo(logoX - padding, logoY - padding, logoX - padding + radius, logoY - padding, radius)
              ctx.closePath()
              ctx.fill()
            }
          }
          
          // Logoyu çiz
          ctx.save()
          if (logoShape === 'circle') {
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, calculatedLogoSize / 2, 0, Math.PI * 2)
            ctx.clip()
          }
          ctx.drawImage(logoImg, logoX, logoY, calculatedLogoSize, calculatedLogoSize)
          ctx.restore()
          
          // Formatına göre indir
          finishDownload(format)
        }
        logoImg.src = logoPreview
      } else {
        finishDownload(format)
      }
    }
    
    const finishDownload = (format) => {
      const finalFileName = fileName.trim() || 'qr-code'
      
      if (format === 'svg') {
        // SVG olarak indir
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.download = `${finalFileName}.svg`
        downloadLink.href = url
        downloadLink.click()
        URL.revokeObjectURL(url)
      } else if (format === 'jpg') {
        // JPG olarak indir
        const jpgFile = canvas.toDataURL('image/jpeg', 0.95)
        const downloadLink = document.createElement('a')
        downloadLink.download = `${finalFileName}.jpg`
        downloadLink.href = jpgFile
        downloadLink.click()
      } else {
        // PNG olarak indir (default)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `${finalFileName}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      // Geçmişe ekle
      saveToHistory()
      
      // Başarı bildirimi
      const formatName = format === 'svg' ? 'SVG' : format === 'jpg' ? 'JPG' : 'PNG'
      setSnackbar({ open: true, message: `📥 ${formatName} dosyası indirildi!`, severity: 'success' })
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const saveToHistory = () => {
    const qrData = {
      text,
      size,
      bgColor,
      fgColor,
      level,
      fileName,
      transparentBackground,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    
    const newHistory = [qrData, ...history].slice(0, 20) // Son 20 kayıt
    setHistory(newHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-history', JSON.stringify(newHistory))
    }
  }

  const addToFavorites = () => {
    const qrData = {
      text,
      size,
      bgColor,
      fgColor,
      level,
      fileName,
      transparentBackground,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    
    const newFavorites = [qrData, ...favorites]
    setFavorites(newFavorites)
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-favorites', JSON.stringify(newFavorites))
    }
    setSnackbar({ open: true, message: '⭐ Favorilere eklendi!', severity: 'success' })
  }

  const removeFromFavorites = (id) => {
    const newFavorites = favorites.filter(f => f.id !== id)
    setFavorites(newFavorites)
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-favorites', JSON.stringify(newFavorites))
    }
    setSnackbar({ open: true, message: '🗑️ Favorilerden kaldırıldı', severity: 'info' })
  }

  const loadFromHistory = (item) => {
    setText(item.text)
    setSize(item.size)
    setBgColor(item.bgColor)
    setFgColor(item.fgColor)
    setLevel(item.level)
    setFileName(item.fileName)
    setTransparentBackground(item.transparentBackground)
    setShowHistory(false)
    setSnackbar({ open: true, message: '✅ Geçmişten yüklendi!', severity: 'success' })
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('qr-history')
    }
    setSnackbar({ open: true, message: '🧹 Geçmiş temizlendi', severity: 'info' })
  }

  const shareQR = async () => {
    const canvas = document.createElement('canvas')
    
    renderQRWithLogo(canvas, () => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${fileName || 'qr-code'}.png`, { type: 'image/png' })
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'QR Kod',
              text: text
            })
            setSnackbar({ open: true, message: '📤 Paylaşıldı!', severity: 'success' })
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.log('Paylaşım hatası', err)
              setSnackbar({ open: true, message: '❌ Paylaşım başarısız', severity: 'error' })
            }
          }
        } else {
          // Fallback: İndir
          setSnackbar({ open: true, message: 'ℹ️ Paylaşma desteklenmiyor, indiriliyor...', severity: 'info' })
          downloadQR()
        }
      })
    })
  }

  const printQR = () => {
    const canvas = document.createElement('canvas')
    
    renderQRWithLogo(canvas, () => {
      const dataUrl = canvas.toDataURL('image/png')
      const printWindow = window.open('', '', 'width=800,height=600')
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileName || 'QR Kod'}</title>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0;
                background: white;
              }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="QR Code" />
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
        setSnackbar({ open: true, message: '🖨️ Yazdırma başlatıldı!', severity: 'info' })
      }
    })
  }

  const copyToClipboard = async () => {
    const canvas = document.createElement('canvas')
    
    renderQRWithLogo(canvas, () => {
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          setSnackbar({ open: true, message:  '✅ QR kod panoya kopyalandı!', severity: 'success' })
        } catch (err) {
          console.error('Kopyalama hatası:', err)
          setSnackbar({ open: true, message: '❌ Kopyalama başarısız!', severity: 'error' })
        }
      })
    })
  }

  const handleLogoUpload = (e) => {
    const file = e.target?.files?.[0] || e
    if (file && file.type.startsWith('image/')) {
      setLogoImage(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleLogoUpload(file)
    }
  }

  const handleLogoDragOver = (e) => {
    e.preventDefault()
  }

  const removeLogo = () => {
    setLogoImage(null)
    setLogoPreview(null)
  }

  // Canvas'a QR kod ve logoyu çiz
  const renderQRWithLogo = (canvas, callback) => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = size
    canvas.height = size
    ctx.fillStyle = transparentBackground ? 'white' : bgColor
    ctx.fillRect(0, 0, size, size)
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      
      // Logo varsa ekle
      if (logoPreview) {
        const logoImg = new Image()
        logoImg.onload = () => {
          const calculatedLogoSize = size * (logoSize / 100)
          const logoX = (size - calculatedLogoSize) / 2
          const logoY = (size - calculatedLogoSize) / 2
          
          // Logo arka plan
          if (!logoTransparent) {
            const padding = calculatedLogoSize * 0.1
            ctx.fillStyle = logoBgColor
            
            if (logoShape === 'circle') {
              ctx.beginPath()
              ctx.arc(size / 2, size / 2, (calculatedLogoSize + padding * 2) / 2, 0, Math.PI * 2)
              ctx.fill()
            } else {
              ctx.beginPath()
              const radius = logoBorderRadius
              ctx.moveTo(logoX - padding + radius, logoY - padding)
              ctx.lineTo(logoX + calculatedLogoSize + padding - radius, logoY - padding)
              ctx.arcTo(logoX + calculatedLogoSize + padding, logoY - padding, logoX + calculatedLogoSize + padding, logoY - padding + radius, radius)
              ctx.lineTo(logoX + calculatedLogoSize + padding, logoY + calculatedLogoSize + padding - radius)
              ctx.arcTo(logoX + calculatedLogoSize + padding, logoY + calculatedLogoSize + padding, logoX + calculatedLogoSize + padding - radius, logoY + calculatedLogoSize + padding, radius)
              ctx.lineTo(logoX - padding + radius, logoY + calculatedLogoSize + padding)
              ctx.arcTo(logoX - padding, logoY + calculatedLogoSize + padding, logoX - padding, logoY + calculatedLogoSize + padding - radius, radius)
              ctx.lineTo(logoX - padding, logoY - padding + radius)
              ctx.arcTo(logoX - padding, logoY - padding, logoX - padding + radius, logoY - padding, radius)
              ctx.closePath()
              ctx.fill()
            }
          }
          
          // Logoyu çiz
          ctx.save()
          if (logoShape === 'circle') {
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, calculatedLogoSize / 2, 0, Math.PI * 2)
            ctx.clip()
          }
          ctx.drawImage(logoImg, logoX, logoY, calculatedLogoSize, calculatedLogoSize)
          ctx.restore()
          
          callback()
        }
        logoImg.src = logoPreview
      } else {
        callback()
      }
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Şablon yardımcı fonksiyonları
  const generateWiFiQR = (ssid, password, security = 'WPA') => {
    return `WIFI:T:${security};S:${ssid};P:${password};;`
  }

  const generateVCardQR = (name, phone, email, website) => {
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nURL:${website}\nEND:VCARD`
  }

  const generateEmailQR = (email, subject, body) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const generateSMSQR = (phone, message) => {
    return `sms:${phone}?body=${encodeURIComponent(message)}`
  }

  const generateLocationQR = (lat, lng) => {
    return `geo:${lat},${lng}`
  }

  const templates = {
    text: { label: 'Metin/URL', icon: '📝' },
    wifi: { label: 'WiFi', icon: '📶' },
    vcard: { label: 'Kartvizit', icon: '👤' },
    email: { label: 'Email', icon: '✉️' },
    sms: { label: 'SMS', icon: '💬' },
    location: { label: 'Konum', icon: '📍' }
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
        {/* Üst Sağ Butonlar */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 9999,
          }}
        >
          <Tooltip title="Geçmiş" arrow>
            <IconButton
              onClick={() => setShowHistory(!showHistory)}
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
                  transform: 'scale(1.1)',
                  boxShadow: isDark
                    ? '0 12px 40px rgba(102, 126, 234, 0.6)'
                    : '0 12px 40px rgba(0, 0, 0, 0.25)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <HistoryIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>
          </Tooltip>

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
        </Stack>

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
                
                {/* Şablon Seçici */}
                <Box>
                  <Typography 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 1,
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                    }}
                  >
                    QR Kod Türü
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {Object.entries(templates).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${value.icon} ${value.label}`}
                        onClick={() => {
                          setQrTemplate(key)
                          // Template değiştiğinde örnek veri ekle
                          if (key === 'wifi') {
                            setText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')
                          } else if (key === 'vcard') {
                            setText('BEGIN:VCARD\nVERSION:3.0\nFN:Adınız Soyadınız\nTEL:+90 555 555 55 55 \nEMAIL:mail@yasinkaracam.codes\nURL:https://yasinkaracam.codes\nEND:VCARD')
                          } else if (key === 'email') {
                            setText('mailto:mail@yasinkaracam.codes?subject=Konu&body=Mesaj')
                          } else if (key === 'sms') {
                            setText('sms:+90 555 555 55 55?body=Mesaj')
                          } else if (key === 'location') {
                            setText('geo:39.9208,44.0408')
                          } else {
                            setText('')
                          }
                        }}
                        variant={qrTemplate === key ? 'filled' : 'outlined'}
                        color={qrTemplate === key ? 'primary' : 'default'}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          height: { xs: 32, sm: 36 },
                          mb: { xs: 0.5, sm: 0 },
                          ...(isDark && qrTemplate !== key && {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }),
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <TextField
                  label="Metin veya URL"
                  multiline
                  minRows={isLandscape ? 2 : 3}
                  maxRows={6}
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

                {/* Logo (Opsiyonel) */}

                {/* Logo Yükleme Bölümü */}
                <Box>
                  <Typography 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 1.5,
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                    }}
                  >
                    Logo (Opsiyonel)
                  </Typography>
                  {!logoPreview ? (
                    <Box
                      onDrop={handleLogoDrop}
                      onDragOver={handleLogoDragOver}
                      component="label"
                      sx={{
                        py: 3,
                        px: 2,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderRadius: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        '&:hover': {
                          borderColor: '#667eea',
                          bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        📷 Logo Yükle
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        }}
                      >
                        Tıklayın veya dosyayı sürükleyip bırakın
                      </Typography>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: '2px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                      }}
                    >
                      <Box
                        component="img"
                        src={logoPreview}
                        alt="Logo preview"
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                          borderRadius: 1,
                          bgcolor: 'white',
                          p: 0.5,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                            mb: 0.5,
                          }}
                        >
                          {logoImage?.name || 'Logo yüklendi'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                          }}
                        >
                          QR kodun ortasında görünecek
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={removeLogo}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        Kaldır
                      </Button>
                    </Box>
                  )}
                  
                  {/* Logo Özelleştirme Seçenekleri */}
                  {logoPreview && (
                    <Box sx={{ mt: 2, }}>
                      <Typography 
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          mb: 1,
                          color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                        }}
                      >
                        Logo Boyutu: {logoSize}%
                      </Typography>
                      <Slider
                        value={logoSize}
                        onChange={(e, newValue) => setLogoSize(newValue)}
                        min={15}
                        max={40}
                        step={1}
                        sx={{
                          mb: 2,
                          '& .MuiSlider-thumb': {
                            ...(isDark && {
                              backgroundColor: '#667eea',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                            }),
                          },
                          '& .MuiSlider-rail': {
                            ...(isDark && {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            }),
                          },
                          '& .MuiSlider-track': {
                            ...(isDark && {
                              backgroundColor: '#667eea',
                            }),
                          },
                        }}
                      />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ 
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              ...(isDark && {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': { color: '#667eea' },
                              }),
                            }}>
                              Şekil
                            </InputLabel>
                            <Select
                              value={logoShape}
                              label="Şekil"
                              onChange={(e) => setLogoShape(e.target.value)}
                              sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                color: isDark ? '#ffffff' : 'inherit',
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
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
                              <MenuItem value="square">⬛ Kare</MenuItem>
                              <MenuItem value="circle">⭕ Yuvarlak</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <input
                              type="color"
                              value={logoBgColor}
                              onChange={(e) => setLogoBgColor(e.target.value)}
                              disabled={logoTransparent}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4,
                                border: '2px solid #e0e0e0',
                                cursor: logoTransparent ? 'not-allowed' : 'pointer',
                                flexShrink: 0,
                                opacity: logoTransparent ? 0.5 : 1,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                                fontSize: '0.7rem'
                              }}>
                                Arka Plan
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={logoTransparent}
                                onChange={(e) => setLogoTransparent(e.target.checked)}
                                sx={{
                                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                  '&.Mui-checked': {
                                    color: '#667eea',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                                fontSize: '0.875rem'
                              }}>
                                Şeffaf Arka Plan
                              </Typography>
                            }
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
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
                        position: 'relative',
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
                      {logoPreview && (
                        <Box
                          sx={{
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {!logoTransparent && (
                            <Box
                              sx={{
                                position: 'absolute',
                                width: `${getResponsiveSize() * (logoSize / 100) + (getResponsiveSize() * (logoSize / 100) * 0.2)}px`,
                                height: `${getResponsiveSize() * (logoSize / 100) + (getResponsiveSize() * (logoSize / 100) * 0.2)}px`,
                                bgcolor: logoBgColor,
                                borderRadius: logoShape === 'circle' ? '50%' : `${logoBorderRadius}px`,
                              }}
                            />
                          )}
                          <Box
                            component="img"
                            src={logoPreview}
                            alt="Logo overlay"
                            sx={{
                              position: 'relative',
                              width: `${getResponsiveSize() * (logoSize / 100)}px`,
                              height: `${getResponsiveSize() * (logoSize / 100)}px`,
                              objectFit: 'cover',
                              borderRadius: logoShape === 'circle' ? '50%' : 0,
                              clipPath: logoShape === 'circle' ? 'circle(50%)' : 'none',
                            }}
                          />
                        </Box>
                      )}
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
                    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: { xs: '100%', sm: '450px', md: '500px' } }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadQR('png')}
                        fullWidth
                        sx={{
                          py: { 
                            xs: isLandscape ? 1.25 : 1.5, 
                            sm: 1.6, 
                            md: 1.8 
                          },
                          minHeight: { xs: '44px', sm: '48px' },
                          fontSize: { 
                            xs: '0.8125rem', 
                            sm: '0.9375rem', 
                            md: '1rem' 
                          },
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
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
                        PNG İndir
                      </Button>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => downloadQR('svg')}
                            fullWidth
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'primary.main',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'primary.main',
                              '&:hover': {
                                borderColor: '#667eea',
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                              },
                            }}
                          >
                            SVG
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => downloadQR('jpg')}
                            fullWidth
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'primary.main',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'primary.main',
                              '&:hover': {
                                borderColor: '#667eea',
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                              },
                            }}
                          >
                            JPG
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FavoriteIcon sx={{ fontSize: '1rem !important' }} />}
                            onClick={addToFavorites}
                            fullWidth
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'primary.main',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'primary.main',
                              '&:hover': {
                                borderColor: '#e91e63',
                                bgcolor: 'rgba(233, 30, 99, 0.1)',
                                color: '#e91e63',
                              },
                            }}
                          >
                            Kaydet
                          </Button>
                        </Grid>
                      </Grid>

                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <IconButton
                            onClick={shareQR}
                            sx={{
                              width: '100%',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                borderColor: '#667eea',
                              },
                            }}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={4}>
                          <IconButton
                            onClick={printQR}
                            sx={{
                              width: '100%',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                borderColor: '#667eea',
                              },
                            }}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={4}>
                          <IconButton
                            onClick={copyToClipboard}
                            sx={{
                              width: '100%',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                borderColor: '#667eea',
                              },
                            }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Stack>
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

        {/* Geçmiş Dialog */}
        {showHistory && (
          <Paper
            elevation={24}
            sx={{
              position: 'fixed',
              top: { xs: 80, sm: 90 },
              right: { xs: 16, sm: 24 },
              width: { xs: 'calc(100% - 32px)', sm: 400 },
              maxHeight: { xs: '70vh', sm: '80vh' },
              overflow: 'auto',
              zIndex: 10000,
              p: 2,
              background: isDark
                ? 'linear-gradient(to bottom, #1e1e2e 0%, #252538 100%)'
                : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: isDark ? '#fff' : 'inherit' }}>
                Geçmiş & Favoriler
              </Typography>
              <IconButton size="small" onClick={() => setShowHistory(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {favorites.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary', mb: 1 }}>
                  ⭐ Favoriler
                </Typography>
                <Stack spacing={1}>
                  {favorites.map((item) => (
                    <Paper
                      key={item.id}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                        '&:hover': { bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' },
                      }}
                      onClick={() => loadFromHistory(item)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box flex={1}>
                          <Typography variant="body2" noWrap sx={{ color: isDark ? '#fff' : 'inherit' }}>
                            {item.text.substring(0, 30)}{item.text.length > 30 ? '...' : ''}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>
                            {new Date(item.timestamp).toLocaleString('tr-TR')}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeFromFavorites(item.id); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {history.length > 0 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    🕒 Son Oluşturulanlar
                  </Typography>
                  <Button size="small" onClick={clearHistory} color="error">
                    Temizle
                  </Button>
                </Box>
                <Stack spacing={1}>
                  {history.map((item) => (
                    <Paper
                      key={item.id}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                        '&:hover': { bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' },
                      }}
                      onClick={() => loadFromHistory(item)}
                    >
                      <Typography variant="body2" noWrap sx={{ color: isDark ? '#fff' : 'inherit' }}>
                        {item.text.substring(0, 30)}{item.text.length > 30 ? '...' : ''}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>
                        {new Date(item.timestamp).toLocaleString('tr-TR')}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {history.length === 0 && favorites.length === 0 && (
              <Typography variant="body2" textAlign="center" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary', py: 4 }}>
                Henüz geçmiş yok
              </Typography>
            )}
          </Paper>
        )}

        {/* Snackbar Bildirimleri */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: '100%',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              color: isDark ? '#ffffff' : '#000000',
              '& .MuiAlert-icon': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}
