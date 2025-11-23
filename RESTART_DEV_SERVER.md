# Restart Dev Server - Fix vue-router Error

## ✅ Cache Sudah Dihapus

Cache Vite sudah dihapus. Sekarang lakukan langkah berikut:

## 🔄 Langkah Restart

### 1. Stop Dev Server (Jika Masih Running)
- Buka terminal yang menjalankan `npm run dev`
- Tekan **Ctrl+C** untuk stop

### 2. Restart Dev Server
```cmd
cd C:\laragon\www\SystemPakar\s_pakar_frontend
npm run dev
```

## ✅ Verifikasi

Setelah restart, error `Failed to resolve import "vue-router"` seharusnya hilang.

## 🐛 Jika Masih Error

### Cek 1: Pastikan vue-router Terinstall
```cmd
cd s_pakar_frontend
npm list vue-router
```

Harus menampilkan: `vue-router@4.5.0` atau versi yang sesuai.

### Cek 2: Reinstall vue-router
```cmd
npm uninstall vue-router
npm install vue-router@^4.5.0
```

### Cek 3: Clear Semua Cache
```cmd
rmdir /s /q node_modules\.vite
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

## 📝 Catatan

- Pastikan semua terminal/CMD yang menjalankan dev server sudah di-stop
- Restart terminal baru jika perlu
- Vue-router sudah terinstall di package.json dan node_modules


