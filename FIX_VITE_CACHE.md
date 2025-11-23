# Fix Vite Cache Error

## 🔧 Solusi untuk Error "Failed to resolve import vue-router"

### Solusi 1: Clear Cache dan Restart (Paling Mudah)

1. **Stop Vite dev server** (Ctrl+C di terminal yang menjalankan `npm run dev`)

2. **Hapus cache Vite:**
   ```cmd
   cd s_pakar_frontend
   rmdir /s /q node_modules\.vite
   ```

   Atau manual: Hapus folder `node_modules\.vite` jika ada

3. **Restart dev server:**
   ```cmd
   npm run dev
   ```

### Solusi 2: Reinstall Dependencies

1. **Hapus node_modules dan package-lock.json:**
   ```cmd
   cd s_pakar_frontend
   rmdir /s /q node_modules
   del package-lock.json
   ```

2. **Install ulang:**
   ```cmd
   npm install
   ```

3. **Restart dev server:**
   ```cmd
   npm run dev
   ```

### Solusi 3: Force Reinstall vue-router

```cmd
cd s_pakar_frontend
npm uninstall vue-router
npm install vue-router@^4.5.0
npm run dev
```

## ✅ Verifikasi

Setelah restart, error seharusnya hilang. Jika masih ada error:

1. Cek apakah `vue-router` ada di `node_modules/vue-router`
2. Pastikan `package.json` sudah benar
3. Restart terminal/CMD
4. Restart Vite dev server

## 🐛 Jika Masih Error

Cek file `vite.config.js` dan pastikan konfigurasi benar.


