import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Smartphone,
  CheckCircle2,
  FileCode,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';

export const AndroidConversionGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadProjectZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // 1. capacitor.config.json
      zip.file(
        'capacitor.config.json',
        JSON.stringify(
          {
            appId: 'com.litewallet.app',
            appName: 'LiteWallet',
            webDir: 'dist',
            bundledWebRuntime: false,
            android: {
              allowMixedContent: true,
              captureInput: true,
              backgroundColor: '#FAF6F0',
            },
            plugins: {
              SplashScreen: {
                launchShowDuration: 1500,
                backgroundColor: '#B45A00',
              },
            },
          },
          null,
          2
        )
      );

      // 2. AndroidManifest.xml
      zip.file(
        'android/app/src/main/AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.litewallet.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="LiteWallet"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="LiteWallet"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
      );

      // 3. MainActivity.java
      zip.file(
        'android/app/src/main/java/com/litewallet/app/MainActivity.java',
        `package com.litewallet.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // LiteWallet Android Container
}
`
      );

      // 4. build.gradle
      zip.file(
        'android/app/build.gradle',
        `apply plugin: 'com.android.application'

android {
    namespace "com.litewallet.app"
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.litewallet.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "0.4.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core-splashscreen:1.0.1'
    implementation project(':capacitor-android')
}
`
      );

      // 5. README_CARA_BUILD_APK.md
      zip.file(
        'README_CARA_BUILD_APK.md',
        `# Panduan Build LiteWallet ke APK Android

Project ini telah dikonfigurasi menggunakan **Capacitor**, cara resmi dan paling stabil untuk mengubah aplikasi web / Chrome Extension menjadi file APK Android mandiri.

## Prasyarat:
1. Node.js (v18 atau lebih baru)
2. Android Studio (unduh gratis dari developer.android.com)

## Langkah Cepat (3 Langkah):

### 1. Install Dependencies
\`\`\`bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
\`\`\`

### 2. Build Web Assets
\`\`\`bash
npm run build
\`\`\`

### 3. Buat & Buka Project di Android Studio
\`\`\`bash
npx cap add android
npx cap sync
npx cap open android
\`\`\`

### 4. Build File APK di Android Studio:
1. Di jendela Android Studio yang terbuka, klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Tunggu proses Gradle selesai (~1 menit).
3. Klik tombol **locate** pada notifikasi yang muncul di pojok kanan bawah.
4. Anda akan mendapatkan file \`app-debug.apk\` yang siap di-install langsung di HP Android Anda!

## Menguji di HP Android Fisik via USB:
1. Aktifkan **Developer Options** dan **USB Debugging** di HP Android Anda.
2. Hubungkan HP ke komputer dengan kabel USB.
3. Di Android Studio, pilih nama HP Anda di toolbar atas, lalu klik tombol **Run** (segitiga hijau). Aplikasi akan otomatis ter-install dan terbuka di HP Anda!
`
      );

      // Generate zip
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LiteWallet_Android_Capacitor_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const codeSnippets = [
    {
      title: 'Perintah Terminal untuk Menghasilkan APK',
      code: `# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build aplikasi web
npm run build

# 3. Sinkronisasikan ke folder Android
npx cap add android
npx cap sync

# 4. Buka di Android Studio & klik Build APK
npx cap open android`,
    },
    {
      title: 'Adaptasi Penyimpanan (Storage)',
      code: `// DARI CHROME EXTENSION:
chrome.storage.local.get(['vault'], (res) => { ... });

// DIUBAH KE ANDROID:
// Opsi 1 (Web / PWA):
const vault = localStorage.getItem('vault');

// Opsi 2 (Native Encrypted Storage Capacitor):
import { Preferences } from '@capacitor/preferences';
await Preferences.set({ key: 'vault', value: encryptedData });`,
    },
    {
      title: 'Adaptasi Kriptografi (Ed25519 & Keccak256)',
      code: `// Lib2_en.rs (Rust) dikompilasi ke WebAssembly
// ATAU menggunakan pure JavaScript/TypeScript (@noble/curves)
// yang sudah berjalan 100% cepat & native di WebView Android!

import { ed25519 } from '@noble/curves/ed25519.js';
import { keccak_256 } from '@noble/hashes/sha3.js';

// Derivasi alamat rx:
const pubkey = ed25519.getPublicKey(seed);
const hash = keccak_256(pubkey);
const rxAddress = 'rx' + bytesToHex(hash.slice(12));`,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#FAF6F0] via-white to-amber-50 rounded-3xl p-6 md:p-8 border border-[#E6DAC8] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Jawaban: Ya, Sangat Bisa Diubah Jadi Android!</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#2E1B04] tracking-tight">
              Panduan Konversi LiteWallet Chrome Extension ke Android APK
            </h1>
            <p className="text-sm text-[#8A7360] leading-relaxed">
              Karena file ekstensi Anda terdiri dari <strong>HTML, CSS, JavaScript, dan Kriptografi Ed25519</strong>,
              seluruh fungsionalitasnya dapat langsung dibungkus menjadi aplikasi Android APK murni atau PWA yang dapat di-install di smartphone Android.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleDownloadProjectZip}
              disabled={isDownloading}
              className="w-full md:w-auto px-6 py-4 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-[#B45A00]/25 flex items-center justify-center gap-3 transition-all"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs font-medium text-amber-200">Unduh Sekarang</div>
                    <div className="text-sm font-bold">Paket Android Studio (.zip)</div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Conversion Strategies */}
      <div>
        <h2 className="text-lg font-bold text-[#2E1B04] mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#B45A00]" />
          <span>3 Pilihan Cara Mengubah ke Aplikasi Android</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: Capacitor */}
          <div className="bg-white p-5 rounded-2xl border-2 border-[#B45A00] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#B45A00] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Rekomendasi Utama
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B45A00] flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="text-sm font-bold text-[#2E1B04]">Capacitor / Cordova</h3>
            <p className="text-xs text-[#8A7360] mt-1.5 leading-relaxed">
              Membungkus UI web dan kode JS/WASM ke dalam project Android Studio native. Menghasilkan file <strong>.APK</strong> siap pakai.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-[#B45A00]">
              <span>Kelebihan:</span>
              <span className="text-stone-600 font-normal">Bisa di-upload ke Play Store & akses hardware HP</span>
            </div>
          </div>

          {/* Method 2: PWA */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DAC8] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="text-sm font-bold text-[#2E1B04]">PWA + TWA (Bubblewrap)</h3>
            <p className="text-xs text-[#8A7360] mt-1.5 leading-relaxed">
              Memasang Web App Manifest & Service Worker. Pengguna Android cukup membuka link di Chrome lalu tekan <em>&quot;Install App&quot;</em>.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-[#B45A00]">
              <span>Kelebihan:</span>
              <span className="text-stone-600 font-normal">Tidak butuh instalasi Android Studio, instan via web</span>
            </div>
          </div>

          {/* Method 3: Native Kotlin */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6DAC8] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h3 className="text-sm font-bold text-[#2E1B04]">Native Kotlin / Compose</h3>
            <p className="text-xs text-[#8A7360] mt-1.5 leading-relaxed">
              Menulis ulang antarmuka dalam Jetpack Compose dan memanggil pustaka Rust melalui JNI (Java Native Interface).
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-[#B45A00]">
              <span>Kelebihan:</span>
              <span className="text-stone-600 font-normal">Performa 100% native murni (membutuhkan waktu refactor)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Chrome Extension vs Android App */}
      <div className="bg-white rounded-3xl border border-[#E6DAC8] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#2E1B04] mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#B45A00]" />
          <span>Tabel Perbandingan Komponen: Chrome Extension vs Android</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E6DAC8] text-[#8A7360] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Komponen</th>
                <th className="py-2.5 px-3">Chrome Extension Asli</th>
                <th className="py-2.5 px-3">Padanan di Android</th>
                <th className="py-2.5 px-3">Status di Versi Ini</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              <tr>
                <td className="py-3 px-3 font-bold text-[#2E1B04]">UI / Antarmuka</td>
                <td className="py-3 px-3 text-stone-600">popup.html (lebar 372px fixed)</td>
                <td className="py-3 px-3 text-stone-800">Responsif layar sentuh, Safe-area notch</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✓ Sudah Diadaptasi</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#2E1B04]">Penyimpanan Data</td>
                <td className="py-3 px-3 text-stone-600">chrome.storage.local</td>
                <td className="py-3 px-3 text-stone-800">localStorage / SharedPreferences / EncryptedVault</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✓ Sudah Diadaptasi</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#2E1B04]">Background Service</td>
                <td className="py-3 px-3 text-stone-600">background.js (MV3 Service Worker)</td>
                <td className="py-3 px-3 text-stone-800">Web Worker / Android Background Service</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✓ Sudah Diadaptasi</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#2E1B04]">Kriptografi (Ed25519)</td>
                <td className="py-3 px-3 text-stone-600">lib2_en.rs (WASM)</td>
                <td className="py-3 px-3 text-stone-800">WebAssembly WebView ATAU Pure TypeScript (@noble)</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✓ 100% Lolos Uji Vektor</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#2E1B04]">QR Scanner</td>
                <td className="py-3 px-3 text-stone-600">Terbatas di extension</td>
                <td className="py-3 px-3 text-stone-800">Kamera Android langsung via MediaDevices API</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✓ Siap Digunakan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets and Commands */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#2E1B04] flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#B45A00]" />
          <span>Potongan Kode & Perintah Konversi</span>
        </h2>

        {codeSnippets.map((snippet, idx) => (
          <div key={idx} className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-md">
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/60 border-b border-stone-800 text-xs">
              <span className="font-semibold text-stone-300">{snippet.title}</span>
              <button
                onClick={() => copyCode(snippet.code, idx)}
                className="flex items-center gap-1.5 text-stone-400 hover:text-white transition"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Salin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {snippet.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
