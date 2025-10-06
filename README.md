# SI PRIMA – Sistem Arsip Data Kepegawaian

## Deskripsi Proyek

**SI PRIMA** adalah aplikasi berbasis web yang digunakan untuk mengelola arsip data kepegawaian.
Fitur utama aplikasi ini mencakup:

* **Login & Registrasi**: Sistem autentikasi pegawai dengan email dan password.
* **Dashboard**: Ringkasan data pegawai yang dapat dipantau secara langsung.
* **Data Pegawai**: Formulir untuk mencatat informasi pegawai, seperti nama, NIP, jabatan, pangkat/golongan, TMT CPNS, TMT PNS, pendidikan terakhir, tempat & tanggal lahir, serta keterangan lain yang relevan.
* **Upload Berkas**: Menyimpan dan mengelola berkas pegawai (dokumen pendukung, sertifikat, dsb).
* **Laporan**: List Karyawan dan tempat export semua data ke dalam format CSV.


Aplikasi ini dirancang untuk mempermudah instansi dalam melakukan pengarsipan, pengelolaan, dan pencarian data pegawai secara efisien dan terstruktur.

---

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan stack modern:

* **React** + **Vite** (frontend framework & bundler)
* **TypeScript** (typed JavaScript)
* **Tailwind CSS** (utility-first CSS framework)
* **shadcn/ui** (komponen UI siap pakai berbasis Radix + Tailwind)
* **Supabase** (backend & autentikasi)

---

## Cara Menjalankan Proyek

Pastikan sudah menginstal **Node.js** dan **npm** di sistem Anda.

1. Clone repositori ini:

   ```sh
   git clone <GIT_URL_PROYEK>
   ```

2. Masuk ke folder proyek:

   ```sh
   cd prima-pegawai-hub-main
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Jalankan server pengembangan:

   ```sh
   npm run dev
   ```

5. Akses aplikasi melalui browser di:

   ```
   http://localhost:8080
   ```

---

## Struktur Direktori

* **/public** → berisi aset statis seperti gambar (logo, background).
* **/src/components** → komponen React (sidebar, form, protected route, dll).
* **/src/hooks** → custom hooks untuk kebutuhan aplikasi.
* **/src/integrations** → konfigurasi integrasi (contoh: Supabase client).

---


## Lisensi

Proyek ini dikembangkan untuk kebutuhan internal instansi/organisasi dan dapat dikustomisasi sesuai kebutuhan.
