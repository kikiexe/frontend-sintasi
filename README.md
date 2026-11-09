# SINTASI - Frontend Client (Quasar Framework / Vue.js)

Aplikasi berbasis web antarmuka pengguna untuk sistem informasi manajemen pasien dan kunjungan klinik SINTASI, dibangun menggunakan **Quasar Framework v2** (Vue 3) dan **pnpm**.

---

## 1. Fitur & Keselarasan Desain

- **Desain UI Figma**:
  - Mengikuti warna, font, dan modal layout sesuai referensi Figma dan spesifikasi `asset-dan-ui/DESIGN.md`:
    - Latar belakang biru: `#0461cd`
    - Tombol `TAMBAH PASIEN`, `SIMPAN`, dan `BUAT KUNJUNGAN` (submit): `#0461cd` (Biru)
    - Tombol `BUAT KUNJUNGAN` (toolbar utama): `#45cd04` (Hijau)
    - Field input readonly & login: `#d9d9d9` (Abu-abu muda)
    - Modal card: `#ffffff`
    - Logo resmi: MEDISIN
- **Arsitektur Komponen Modular**:
  - `src/pages/LoginPage.vue`: Halaman autentikasi dengan enkripsi payload AES-256-CBC.
  - `src/pages/DashboardPage.vue`: Halaman utama yang mengorkestrasi state daftar pasien.
  - `src/components/PatientTable.vue`: Tabel rekap pasien (`NO`, `NO REKAM MEDIK`, `NAMA PASIEN`, `NIK`, `ALAMAT`, `JML KUNJUNGAN`).
  - `src/components/AddPatientModal.vue`: Popup pendaftaran pasien baru dengan validasi NIK 16 digit.
  - `src/components/CreateVisitModal.vue`: Popup pembuatan kunjungan dengan auto-uppercase & auto-lookup `No Rekam Medik`.
- **Security Test Payload Encryption**:
  - Enkripsi AES-256-CBC pada payload `username` dan `password` menggunakan `crypto-js` (`src/boot/crypto.js`) sebelum request POST dikirim ke API Backend.

---

## 2. Persyaratan Sistem

- Node.js >= 18.0
- pnpm >= 9.0

---

## 3. Cara Menjalankan Frontend

1. **Install Dependencies menggunakan pnpm**:
   ```bash
   pnpm install
   ```

2. **Jalankan Development Server**:
   ```bash
   pnpm run dev
   ```
   Buka peramban di `http://localhost:9000`.

3. **Menjalankan Unit Test**:
   ```bash
   pnpm test --run
   ```

4. **Build untuk Production**:
   ```bash
   pnpm run build
   ```

---

## 4. Akun Uji Coba

Gunakan kredensial yang telah disediakan pada seeder backend:
- **Username**: `admin@sintasi.com`
- **Password**: `password123`
