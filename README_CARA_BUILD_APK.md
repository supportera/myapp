# Panduan Build LiteWallet ke APK Android

Project ini telah dikonfigurasi menggunakan **Capacitor**, cara resmi dan paling stabil untuk mengubah aplikasi web / Chrome Extension menjadi file APK Android mandiri.

## Prasyarat:
1. Node.js (v18 atau lebih baru)
2. Android Studio (unduh gratis dari developer.android.com)

## Langkah Cepat (3 Langkah):

### 1. Install Dependencies
```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Buat & Buka Project di Android Studio
```bash
npx cap add android
npx cap sync
npx cap open android
```

### 4. Build File APK di Android Studio:
1. Di jendela Android Studio yang terbuka, klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Tunggu proses Gradle selesai (~1 menit).
3. Klik tombol **locate** pada notifikasi yang muncul di pojok kanan bawah.
4. Anda akan mendapatkan file `app-debug.apk` yang siap di-install langsung di HP Android Anda!

## Menguji di HP Android Fisik via USB:
1. Aktifkan **Developer Options** dan **USB Debugging** di HP Android Anda.
2. Hubungkan HP ke komputer dengan kabel USB.
3. Di Android Studio, pilih nama HP Anda di toolbar atas, lalu klik tombol **Run** (segitiga hijau). Aplikasi akan otomatis ter-install dan terbuka di HP Anda!
