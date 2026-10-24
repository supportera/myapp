import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidConversionGuide } from './components/AndroidConversionGuide';
import { TermuxGuide } from './components/TermuxGuide';
import { Smartphone, BookOpen, Terminal, Flame } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'app' | 'termux' | 'guide'>('termux');

  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#FAF6F0] text-[#2E1B04] flex flex-col font-sans selection:bg-[#F5E3D0] selection:text-[#B45A00]">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6DAC8] px-4 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B45A00] to-[#E67E22] flex items-center justify-center shadow-md shadow-[#B45A00]/25 flex-shrink-0">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-[#2E1B04] tracking-tight">LiteWallet Mobile</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> Android Ready
                  </span>
                </div>
                <p className="text-[11px] text-[#8A7360]">
                  Ekstensi Chrome dimigrasikan ke Aplikasi Android & PWA (Ed25519 + Keccak256)
                </p>
              </div>
            </div>

            {/* Navigation Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveView('app')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeView === 'app'
                    ? 'bg-white text-[#B45A00] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulasi Aplikasi</span>
              </button>

              <button
                onClick={() => setActiveView('termux')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeView === 'termux'
                    ? 'bg-[#B45A00] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 bg-amber-100/60 font-extrabold text-amber-900'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Build via Termux (HP Saja)</span>
              </button>

              <button
                onClick={() => setActiveView('guide')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeView === 'guide'
                    ? 'bg-white text-[#B45A00] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Panduan Android Studio</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6">
          {activeView === 'app' && (
            <div className="w-full flex flex-col items-center">
              <AndroidFrame />
            </div>
          )}

          {activeView === 'termux' && (
            <div className="w-full flex justify-center">
              <TermuxGuide />
            </div>
          )}

          {activeView === 'guide' && (
            <div className="w-full flex justify-center">
              <AndroidConversionGuide />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E6DAC8] bg-white py-3.5 px-4 text-center text-xs text-[#8A7360]">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>
              LiteWallet Mobile • Kriptografi SLIP-0010 + Ed25519 + Keccak256
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-medium">✓ Kompatibel Android 7.0 - Android 14+</span>
              <span className="text-stone-300">•</span>
              <span className="text-amber-800 font-medium">Format Alamat rx...</span>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
