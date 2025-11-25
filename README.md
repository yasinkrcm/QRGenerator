# QR Kod Oluşturucu

Next.js ve Material-UI ile oluşturulmuş modern, kullanıcı dostu QR kod generator uygulaması.

![QR Kod Generator](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Material-UI](https://img.shields.io/badge/MUI-5.15.0-blue?style=for-the-badge&logo=mui)

## ✨ Özellikler

### 🎨 Temel Özellikler
- **Modern ve Şık Arayüz** - Material Design 3 ile tasarlanmış profesyonel görünüm
- **Koyu/Açık Tema** - Otomatik tema değiştirme
- **Animasyonlar** - Smooth geçişler ve hover efektleri
- **Tam Responsive** - Mobil, tablet ve masaüstü uyumlu

### 🖼️ Logo ve Özelleştirme
- **Logo Ekleme** - QR kodun ortasına logo yükleyebilme
- **Logo Boyutu** - %15-40 arası ayarlanabilir boyut
- **Logo Şekli** - Kare veya yuvarlak seçenekleri
- **Logo Arka Planı** - Özelleştirilebilir arka plan rengi
- **Özelleştirilebilir Renkler** - Arka plan ve ön plan renklerini değiştirme
- **Şeffaf Arka Plan** - PNG formatında şeffaf arka plan desteği

### 📥 İndirme ve Paylaşma
- **Çoklu Format** - PNG, SVG, JPG formatlarında indirme
- **Paylaş** - Web Share API ile kolay paylaşım
- **Yazdır** - Doğrudan yazdırma desteği
- **Panoya Kopyala** - Clipboard API ile kopyalama

### 📚 Şablonlar
- **Metin/URL** - Standart metin ve URL'ler
- **WiFi** - WiFi ağ bilgileri için özel format
- **vCard** - Kartvizit bilgileri
- **Email** - Email adresi ve mesaj
- **SMS** - Telefon numarası ve mesaj
- **Konum** - GPS koordinatları

### 💾 Geçmiş ve Favoriler
- **Geçmiş** - Son 20 oluşturulan QR kod
- **Favoriler** - Sık kullanılanları kaydetme
- **Hızlı Yükleme** - Geçmişten tekrar oluşturma
- **localStorage** - Tarayıcıda yerel depolama

### 📱 PWA Özellikleri
- **Offline Çalışma** - Service Worker ile çevrimdışı destek
- **Ana Ekrana Ekle** - PWA olarak yüklenebilir
- **Hızlı Başlatma** - Uygulama gibi deneyim

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/yasinkrcm/QRGenerator.git
cd QRGenerator
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 📖 Kullanım

1. **Metin veya URL girin** - Ana alana QR kod için içerik yazın
2. **Dosya adını belirleyin** - İndirilecek dosyanın adını özelleştirin (opsiyonel)
3. **Boyutu ayarlayın** - Slider ile istediğiniz boyutu seçin
4. **Renkleri özelleştirin** - Arka plan ve ön plan renklerini seçin
5. **Hata düzeltme seviyesini seçin** - İhtiyacınıza göre seviye belirleyin
6. **QR kodunu indirin** - "QR Kodu İndir (PNG)" butonuna tıklayın

### Hızlı Örnekler

Uygulama içinde hazır örnekler bulunur:
- URL örnekleri
- Metin örnekleri
- WiFi bağlantı bilgileri
- Telefon numaraları
- Email adresleri

## 🛠️ Teknolojiler

- **[Next.js 15.1.7](https://nextjs.org/)** - React framework
- **[React 18.2.0](https://react.dev/)** - UI kütüphanesi
- **[Material-UI 5.15.0](https://mui.com/)** - UI component kütüphanesi
- **[qrcode.react 3.1.0](https://www.npmjs.com/package/qrcode.react)** - QR kod oluşturma
- **[Emotion](https://emotion.sh/)** - CSS-in-JS

## 📁 Proje Yapısı

```
QRGenerator/
├── pages/
│   ├── _app.js          # Ana uygulama wrapper (MUI Theme)
│   ├── _document.js      # HTML document (favicon, meta tags)
│   └── index.js          # Ana sayfa
├── public/
│   └── favicon.svg       # Logo ve favicon
├── styles/
│   └── globals.css       # Global stiller
├── next.config.js        # Next.js yapılandırması
├── package.json          # Bağımlılıklar
└── README.md             # Bu dosya
```

## 🎨 Özelleştirme

### Tema Renkleri

Tema renklerini `pages/_app.js` dosyasındaki `createTheme` fonksiyonunda değiştirebilirsiniz:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Ana renk
    },
    secondary: {
      main: '#9c27b0', // İkincil renk
    },
  },
})
```

## 📦 Build ve Deploy

### Production Build

```bash
npm run build
npm start
```

### Vercel ile Deploy

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Otomatik deploy başlar

### Diğer Platformlar

- **Netlify** - Netlify'a bağlayarak deploy edebilirsiniz
- **Railway** - Railway platformunu kullanabilirsiniz
- **Docker** - Docker container olarak çalıştırabilirsiniz

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Yazar

Bu proje açık kaynak olarak geliştirilmiştir.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) ekibine
- [Material-UI](https://mui.com/) ekibine
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) geliştiricilerine

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
