#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# Script Build LiteWallet Android via Termux (Tanpa Laptop / PC)
# ==============================================================================

clear
echo "=================================================="
echo "    LiteWallet Mobile - Setup Build di Termux     "
echo "=================================================="
echo ""
echo "Pilih metode yang ingin Anda gunakan:"
echo "1) Jalankan Lokal & Install sebagai PWA (Instan & Ringan)"
echo "2) Build APK via GitHub Actions (Gratis Cloud Build)"
echo "3) Setup Lingkungan Android SDK Lokal di Termux (Proot Ubuntu)"
echo "4) Keluar"
echo ""
read -p "Masukkan pilihan [1-4]: " pilihan

case $pilihan in
  1)
    echo ""
    echo "[+] Menginstall Node.js dan Git di Termux..."
    pkg update -y && pkg install nodejs-lts git -y
    echo "[+] Menginstall dependensi proyek..."
    npm install
    echo "[+] Menjalankan server aplikasi..."
    echo "Buka Google Chrome di HP Anda dan kunjungi: http://localhost:3000"
    echo "Lalu klik titik 3 di Chrome -> 'Tambahkan ke Layar Utama' / 'Install App'"
    npm run dev
    ;;
  2)
    echo ""
    echo "=== Panduan Build APK via GitHub Actions ==="
    echo "1. Buat repository baru di github.com"
    echo "2. Masukkan script workflow ke folder .github/workflows/build_apk.yml"
    echo "3. Lakukan git push dari Termux:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Setup LiteWallet'"
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/USERNAME/NAMA-REPO.git"
    echo "   git push -u origin main"
    echo "4. Buka tab 'Actions' di GitHub melalui browser HP Anda."
    echo "5. File APK akan otomatis selesai di-build dan siap di-download!"
    ;;
  3)
    echo ""
    echo "[+] Menginstall PRoot Distro Ubuntu..."
    pkg update -y && pkg install proot-distro git -y
    proot-distro install ubuntu
    echo "[+] Masuk ke Ubuntu untuk menginstall OpenJDK & Gradle..."
    proot-distro login ubuntu -- bash -c "apt update && apt install -y openjdk-17-jdk git curl unzip nodejs npm && npm install -g @capacitor/cli"
    echo "[+] Lingkungan siap! Anda dapat menjalankan gradle di dalam ubuntu."
    ;;
  4)
    echo "Keluar."
    exit 0
    ;;
  *)
    echo "Pilihan tidak valid."
    ;;
esac
