import React, { useState } from 'react';
import {
  Terminal,
  Smartphone,
  Cloud,
  Cpu,
  Copy,
  Check,
  Download,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Zap,
} from 'lucide-react';

const YAML_CONTENT = `name: Build Android APK (LiteWallet)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Set up Java JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Install NPM Dependencies
        run: npm ci || npm install

      - name: Build Web Application
        run: npm run build

      - name: Install Capacitor CLI & Core
        run: npm install @capacitor/core @capacitor/cli @capacitor/android

      - name: Initialize Capacitor Android Project
        run: |
          npx cap add android || true
          npx cap sync android

      - name: Build Debug APK with Gradle
        working-directory: android
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: LiteWallet-Android-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
`;

const SCRIPT_CONTENT = `#!/data/data/com.termux/files/usr/bin/bash
clear
echo "=================================================="
echo "    LiteWallet Mobile - Setup Build di Termux     "
echo "=================================================="
echo ""
echo "Pilih metode:"
echo "1) Jalankan Lokal (PWA) di Chrome Android"
echo "2) Push ke GitHub (Auto Build APK)"
read -p "Pilihan [1-2]: " pilihan

if [ "$pilihan" = "1" ]; then
  pkg update -y && pkg install nodejs-lts git -y
  npm install && npm run dev
elif [ "$pilihan" = "2" ]; then
  mkdir -p .github/workflows
  git init && git add . && git commit -m "Build LiteWallet"
  echo "Siap! Tinggal lakukan git push ke GitHub Anda."
fi
`;

export const TermuxGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'github' | 'pwa' | 'proot'>('github');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 100% In-Memory Blob Download (No server request, No cookie blocked!)
  const handleDownloadYaml = () => {
    const blob = new Blob([YAML_CONTENT], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build_apk.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([SCRIPT_CONTENT], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'termux_build.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentAppUrl = window.location.href;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>100% Menggunakan HP Saja • Tanpa Laptop / PC</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Cara Build LiteWallet lewat Termux
            </h1>

            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              Tenang saja! Walaupun Anda tidak punya laptop atau PC, Anda tetap bisa membuat dan meng-install aplikasi ini ke HP Android menggunakan <strong className="text-amber-400">Termux</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
            <button
              onClick={handleDownloadScript}
              className="px-4 py-3 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-95 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Script termux_build.sh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Method 1 */}
        <button
          onClick={() => setActiveTab('github')}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeTab === 'github'
              ? 'bg-white border-[#B45A00] shadow-md ring-2 ring-[#B45A00]/20'
              : 'bg-[#FAF6F0] hover:bg-white border-[#E6DAC8]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#B45A00] flex items-center justify-center font-bold text-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Paling Direkomendasikan
            </span>
          </div>
          <div className="text-sm font-bold text-[#2E1B04]">Opsi 1: GitHub Cloud Build</div>
          <div className="text-[11px] text-[#8A7360] mt-1 leading-snug">
            Ketik perintah di Termux, server GitHub meng-compile APK, Anda tinggal download APK siap pakai.
          </div>
        </button>

        {/* Method 2 */}
        <button
          onClick={() => setActiveTab('pwa')}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeTab === 'pwa'
              ? 'bg-white border-[#B45A00] shadow-md ring-2 ring-[#B45A00]/20'
              : 'bg-[#FAF6F0] hover:bg-white border-[#E6DAC8]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#B45A00] flex items-center justify-center font-bold text-xs">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-[#B45A00] px-2 py-0.5 rounded-full">
              Paling Cepat (5 Detik)
            </span>
          </div>
          <div className="text-sm font-bold text-[#2E1B04]">Opsi 2: Pasang Langsung (PWA)</div>
          <div className="text-[11px] text-[#8A7360] mt-1 leading-snug">
            Tanpa perlu compile APK. Buka di Chrome HP lalu tekan &quot;Install App&quot; ke layar utama.
          </div>
        </button>

        {/* Method 3 */}
        <button
          onClick={() => setActiveTab('proot')}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activeTab === 'proot'
              ? 'bg-white border-[#B45A00] shadow-md ring-2 ring-[#B45A00]/20'
              : 'bg-[#FAF6F0] hover:bg-white border-[#E6DAC8]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
              Full Offline di HP
            </span>
          </div>
          <div className="text-sm font-bold text-[#2E1B04]">Opsi 3: PRoot Ubuntu di Termux</div>
          <div className="text-[11px] text-[#8A7360] mt-1 leading-snug">
            Pasang Linux Ubuntu + Java JDK + Gradle langsung di dalam memori HP Anda.
          </div>
        </button>
      </div>

      {/* Tab Content 1: GitHub Cloud Build via Termux */}
      {activeTab === 'github' && (
        <div className="bg-white rounded-3xl border border-[#E6DAC8] p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-[#2E1B04] flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#B45A00]" />
              <span>Opsi 1: Build APK Otomatis via GitHub Actions dari Termux</span>
            </h2>
            <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
              <strong>Mengapa ini metode terbaik untuk HP?</strong> Meng-compile APK Android membutuhkan Java JDK dan Android SDK berukuran lebih dari 3 GB serta RAM minimal 4 GB. Jika dipaksakan di Termux lokal, HP sering panas atau Termux force-close (killed). Dengan cara ini, Anda cukup mengetik beberapa baris perintah di Termux, dan server cloud GitHub yang berkekuatan RAM 16 GB akan meng-compile file APK Anda secara gratis!
            </p>
          </div>

          {/* Special Spotlight: Lokasi file .github/workflows/build_apk.yml */}
          <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B45A00] text-white flex items-center justify-center font-bold text-xs">
                  📁
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#2E1B04]">
                    Di Mana Letak File <code className="text-[#B45A00] font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">.github/workflows/build_apk.yml</code>?
                  </h3>
                  <p className="text-[11px] text-[#8A7360]">
                    File ini berada di root folder proyek Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadYaml}
                  className="px-3.5 py-2 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-95 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File build_apk.yml (Asli)</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-1.5">
              <p>
                💡 <strong>Catatan penting untuk pengguna Termux:</strong> Folder yang diawali tanda titik seperti <code className="font-mono text-amber-900 bg-amber-50 px-1 rounded">.github</code> adalah <strong>folder tersembunyi (hidden folder)</strong> di Linux/Android.
              </p>
              <p>
                Jika Anda mengetik <code className="font-mono bg-stone-100 px-1 rounded">ls</code> biasa di Termux, folder ini tidak akan terlihat. Anda harus mengetik perintah:
              </p>
              <div className="bg-stone-900 text-emerald-400 p-2 rounded-lg font-mono text-xs flex items-center justify-between">
                <code>ls -la .github/workflows/</code>
                <button
                  onClick={() => copyToClipboard('ls -la .github/workflows/', 'check-file')}
                  className="text-stone-400 hover:text-white text-[10px] flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded"
                >
                  {copiedId === 'check-file' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Salin Perintah Cek</span>
                </button>
              </div>
            </div>

            {/* Perintah Otomatis Membuat File di Termux */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#2E1B04]">
                <span>Ingin membuat file ini otomatis di Termux dalam 1 detik?</span>
                <span className="text-amber-800 font-normal text-[10px]">(Cukup salin & tempel perintah di bawah ke Termux)</span>
              </div>
              <div className="relative bg-stone-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`mkdir -p .github/workflows
cat << 'EOF' > .github/workflows/build_apk.yml
name: Build Android APK (LiteWallet)
on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - uses: android-actions/setup-android@v3
      - run: npm install
      - run: npm run build
      - run: npm install @capacitor/core @capacitor/cli @capacitor/android
      - run: npx cap add android || true && npx cap sync android
      - working-directory: android
        run: ./gradlew assembleDebug --stacktrace
      - uses: actions/upload-artifact@v4
        with:
          name: LiteWallet-Android-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
EOF`}</pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `mkdir -p .github/workflows\ncat << 'EOF' > .github/workflows/build_apk.yml\nname: Build Android APK (LiteWallet)\non:\n  push:\n    branches: [ "main", "master" ]\n  workflow_dispatch:\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - uses: actions/setup-java@v4\n        with:\n          java-version: '17'\n          distribution: 'temurin'\n      - uses: android-actions/setup-android@v3\n      - run: npm install\n      - run: npm run build\n      - run: npm install @capacitor/core @capacitor/cli @capacitor/android\n      - run: npx cap add android || true && npx cap sync android\n      - working-directory: android\n        run: ./gradlew assembleDebug --stacktrace\n      - uses: actions/upload-artifact@v4\n        with:\n          name: LiteWallet-Android-APK\n          path: android/app/build/outputs/apk/debug/app-debug.apk\nEOF`,
                      'make-workflow'
                    )
                  }
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1.5 bg-stone-800 rounded-lg"
                >
                  {copiedId === 'make-workflow' ? (
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Tersalin!
                    </span>
                  ) : (
                    <span className="text-stone-300 text-[10px] flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Salin Perintah Lengkap
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B45A00] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="text-xs font-bold text-[#2E1B04]">
                  Buka Termux di HP Anda & Beri Izin Penyimpanan
                </span>
              </div>
              <div className="relative bg-stone-900 rounded-xl p-3 text-xs font-mono text-emerald-400">
                <code>termux-setup-storage</code>
                <button
                  onClick={() => copyToClipboard('termux-setup-storage', 'cmd1')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'cmd1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 italic">
                *Akan muncul pop-up izin akses file di HP Anda, pilih &quot;Izinkan&quot;.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B45A00] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="text-xs font-bold text-[#2E1B04]">
                  Install Git & Node.js di Termux
                </span>
              </div>
              <div className="relative bg-stone-900 rounded-xl p-3 text-xs font-mono text-emerald-400">
                <code>pkg update -y && pkg install git nodejs-lts -y</code>
                <button
                  onClick={() => copyToClipboard('pkg update -y && pkg install git nodejs-lts -y', 'cmd2')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'cmd2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B45A00] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span className="text-xs font-bold text-[#2E1B04]">
                  Inisialisasi & Push ke GitHub
                </span>
              </div>
              <p className="text-[11px] text-stone-600">
                Buat sebuah repository baru di akun GitHub Anda (bisa lewat browser di HP di <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#B45A00] underline font-semibold">github.com/new</a>), lalu jalankan perintah ini di Termux:
              </p>
              <div className="relative bg-stone-900 rounded-xl p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <pre>{`git init
git add .
git commit -m "Build LiteWallet Android"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
git push -u origin main`}</pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git init\ngit add .\ngit commit -m "Build LiteWallet Android"\ngit branch -M main\ngit remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git\ngit push -u origin main`,
                      'cmd3'
                    )
                  }
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'cmd3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B45A00] text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span className="text-xs font-bold text-[#2E1B04]">
                  Download File APK Selesai!
                </span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <p>
                  1. Buka repository Anda di browser HP, lalu klik tab <strong>Actions</strong>.
                </p>
                <p>
                  2. Anda akan melihat proses build berjalan (ikon kuning berubah jadi centang hijau ✓ dalam ~2 menit).
                </p>
                <p>
                  3. Klik hasil build tersebut, dan scroll ke bawah ke bagian <strong>Artifacts</strong>: klik <strong>LiteWallet-Android-APK</strong>. File <code>app-debug.apk</code> langsung ter-download dan bisa langsung Anda install di HP!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Direct PWA Install (5 Detik) */}
      {activeTab === 'pwa' && (
        <div className="bg-white rounded-3xl border border-[#E6DAC8] p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-[#2E1B04] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#B45A00]" />
              <span>Opsi 2: Pasang Langsung Tanpa Perlu Build File APK (PWA)</span>
            </h2>
            <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
              Jika tujuan Anda adalah <strong>memakai dompet LiteWallet ini di HP Anda</strong>, Anda sebenarnya <em>tidak wajib</em> membuat file .APK! Karena aplikasi ini sudah berstandar <strong>PWA (Progressive Web App)</strong>, tampilannya saat di-install akan 100% sama dengan aplikasi APK Android asli (full screen tanpa bilah URL browser, ada ikon di beranda HP, dan bisa dibuka kapan saja).
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] space-y-2">
              <div className="text-xs font-bold text-[#2E1B04]">Link Aplikasi Anda:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentAppUrl}
                  className="w-full p-2.5 bg-white rounded-xl border border-stone-200 text-xs font-mono text-[#2E1B04]"
                />
                <button
                  onClick={() => copyToClipboard(currentAppUrl, 'appurl')}
                  className="px-4 py-2.5 bg-[#B45A00] hover:bg-[#9B4D00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 flex-shrink-0"
                >
                  {copiedId === 'appurl' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Salin Link</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="w-7 h-7 rounded-lg bg-[#B45A00] text-white flex items-center justify-center font-bold text-xs mb-2">
                  1
                </div>
                <div className="text-xs font-bold text-[#2E1B04]">Buka di Google Chrome</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Buka tautan di atas menggunakan browser Google Chrome di HP Android Anda.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="w-7 h-7 rounded-lg bg-[#B45A00] text-white flex items-center justify-center font-bold text-xs mb-2">
                  2
                </div>
                <div className="text-xs font-bold text-[#2E1B04]">Tekan Titik Tiga (⋮)</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Tekan menu titik tiga di pojok kanan atas browser Google Chrome.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="w-7 h-7 rounded-lg bg-[#B45A00] text-white flex items-center justify-center font-bold text-xs mb-2">
                  3
                </div>
                <div className="text-xs font-bold text-[#2E1B04]">Pilih &quot;Tambahkan ke Layar Utama&quot;</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Atau pilih &quot;Instal Aplikasi&quot;. Ikon LiteWallet akan otomatis muncul di menu aplikasi HP Anda!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Full Offline di Termux dengan PRoot Ubuntu */}
      {activeTab === 'proot' && (
        <div className="bg-white rounded-3xl border border-[#E6DAC8] p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-[#2E1B04] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#B45A00]" />
              <span>Opsi 3: Build Full Offline Langsung di Termux (Menggunakan PRoot Ubuntu)</span>
            </h2>
            <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
              Metode ini menjalankan distro Linux (Ubuntu) di dalam Termux sehingga Anda dapat menginstall Java OpenJDK 17 dan Android Command Line Tools langsung di HP.
            </p>
            <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                Catatan: Membutuhkan ruang penyimpanan kosong minimal <strong>4 GB</strong> dan koneksi internet stabil saat instalasi awal.
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#2E1B04]">
                Langkah 1: Pasang PRoot Ubuntu di Termux
              </div>
              <div className="relative bg-stone-900 rounded-xl p-3 text-xs font-mono text-emerald-400">
                <code>pkg update -y && pkg install proot-distro git wget -y && proot-distro install ubuntu</code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'pkg update -y && pkg install proot-distro git wget -y && proot-distro install ubuntu',
                      'proot1'
                    )
                  }
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'proot1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#2E1B04]">
                Langkah 2: Masuk ke Ubuntu & Pasang Java JDK 17, Node.js, dan Gradle
              </div>
              <div className="relative bg-stone-900 rounded-xl p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <pre>{`proot-distro login ubuntu
apt update && apt install -y openjdk-17-jdk nodejs npm gradle
npm install -g @capacitor/cli`}</pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'proot-distro login ubuntu\napt update && apt install -y openjdk-17-jdk nodejs npm gradle\nnpm install -g @capacitor/cli',
                      'proot2'
                    )
                  }
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'proot2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#2E1B04]">
                Langkah 3: Build APK
              </div>
              <div className="relative bg-stone-900 rounded-xl p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <pre>{`npm run build
npx cap add android
npx cap sync
cd android && ./gradlew assembleDebug`}</pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'npm run build\nnpx cap add android\nnpx cap sync\ncd android && ./gradlew assembleDebug',
                      'proot3'
                    )
                  }
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-1"
                >
                  {copiedId === 'proot3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700">
              Hasil file APK akan berada di folder:
              <code className="block mt-1 font-mono text-amber-900 bg-amber-100/60 p-1.5 rounded">
                android/app/build/outputs/apk/debug/app-debug.apk
              </code>
              Anda bisa memindahkannya ke memori internal HP dengan perintah:
              <code className="block mt-1 font-mono text-stone-800 bg-stone-200 p-1 rounded">
                cp app-debug.apk /sdcard/Download/LiteWallet.apk
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips for Termux */}
      <div className="bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] p-4 text-xs space-y-2">
        <div className="font-bold text-[#2E1B04] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#B45A00]" />
          <span>Tips Penting saat Menggunakan Termux di HP:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1 text-[11px] leading-relaxed">
          <li>
            Agar Termux tidak tertutup sendiri oleh sistem baterai Android saat proses build, jalankan perintah <code className="bg-white px-1 py-0.5 rounded border font-mono">termux-wake-lock</code> sebelum mulai.
          </li>
          <li>
            Gunakan keyboard yang nyaman seperti <em>Hacker&#39;s Keyboard</em> di Play Store yang memiliki tombol Ctrl, Esc, dan tanda panah.
          </li>
          <li>
            Jika Anda mengalami kendala kuota atau penyimpanan di HP, <strong>Opsi 1 (GitHub Cloud Build)</strong> atau <strong>Opsi 2 (PWA Langsung)</strong> adalah solusi paling praktis tanpa resiko error!
          </li>
        </ul>
      </div>
    </div>
  );
};
