# Instruksi Mengganti Logo Hydrangea

## File Saat Ini
File placeholder saat ini: `s_pakar_frontend/src/assets/logo-hydrangea.svg`

## Cara Mengganti dengan Gambar Hydrangea Asli

### Opsi 1: Menggunakan File PNG/JPG
1. Simpan gambar hydrangea dengan nama: `logo-hydrangea.png` atau `logo-hydrangea.jpg`
2. Letakkan di folder: `s_pakar_frontend/src/assets/`
3. Update semua import di file berikut dari `.svg` menjadi `.png` atau `.jpg`:
   - `src/App.vue`
   - `src/views/Home.vue`
   - `src/views/Login.vue`
   - `src/views/Register.vue`
   - `src/views/ResetPassword.vue`
   - `src/views/Diagnosis.vue`
   - `src/views/admin/Dashboard.vue`
   - `src/components/Logo.vue`

### Opsi 2: Menggunakan File SVG (Direkomendasikan)
1. Simpan gambar hydrangea sebagai SVG dengan nama: `logo-hydrangea.svg`
2. Ganti file yang ada di: `s_pakar_frontend/src/assets/logo-hydrangea.svg`
3. Tidak perlu mengubah import, karena sudah menggunakan `.svg`

## Spesifikasi yang Disarankan
- **Format**: SVG (untuk kualitas terbaik) atau PNG dengan transparansi
- **Ukuran**: Minimal 512x512px (akan di-resize otomatis)
- **Background**: Transparan (untuk hasil terbaik)
- **Warna**: Sesuai dengan tema hijau sistem

## Catatan
- File logo digunakan di semua halaman aplikasi
- Logo akan otomatis di-resize sesuai kebutuhan
- Pastikan file tidak terlalu besar (max 500KB untuk performa optimal)

