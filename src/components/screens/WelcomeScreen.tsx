import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { ShieldCheck, Plus, ArrowDownLeft, Sparkles, Smartphone } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setScreen, createWalletInit } = useWallet();

  const handleStartCreate = () => {
    createWalletInit(12);
    setScreen('create-1');
  };

  return (
    <div className="flex flex-col flex-1 justify-between p-6 h-full text-center">
      <div className="flex flex-col items-center mt-6">
        {/* Logo Brand */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#B45A00] to-[#E67E22] flex items-center justify-center shadow-lg shadow-[#B45A00]/30 mb-5 relative group">
          <img
            src="/icons/logo.svg"
            alt="LiteWallet"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-white text-[#B45A00] text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-amber-200 flex items-center gap-1">
            <Smartphone className="w-2.5 h-2.5" /> Android
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#2E1B04] tracking-tight">LiteWallet Mobile</h1>
        <p className="text-xs text-[#8A7360] mt-1 max-w-[260px] leading-relaxed">
          Kripto wallet ringan untuk Lightweight Chain dengan enkripsi <span className="font-semibold text-[#B45A00]">Ed25519 + Keccak256</span>
        </p>

        {/* Feature Highlights */}
        <div className="w-full bg-[#FAF6F0] rounded-2xl p-4 mt-6 border border-[#E6DAC8] text-left space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#2E1B04]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Kunci privat disimpan aman di perangkat Android</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#2E1B04]">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Format alamat resmi berawalan <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-[11px] font-mono">rx...</code></span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#2E1B04]">
            <Smartphone className="w-4 h-4 text-[#B45A00] flex-shrink-0" />
            <span>Dioptimalkan untuk Android Touchscreen & PWA</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8 pb-4">
        <button
          onClick={handleStartCreate}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#B45A00] to-[#D36A00] hover:from-[#A04F00] hover:to-[#B45A00] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md shadow-[#B45A00]/25 flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Buat Wallet Baru
        </button>

        <button
          onClick={() => setScreen('import')}
          className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.98] text-[#2E1B04] font-semibold rounded-2xl border border-[#E6DAC8] shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
        >
          <ArrowDownLeft className="w-4 h-4 text-[#8A7360]" />
          Sudah Punya? Import Phrase
        </button>
      </div>
    </div>
  );
};
