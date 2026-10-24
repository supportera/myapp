import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import {
  ArrowLeft,
  KeyRound,
  Shield,
  Clock,
  Globe,
  Trash2,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    network,
    setNetworkUrl,
    autoLockMinutes,
    setAutoLockMinutes,
    lockWallet,
    resetWallet,
    setScreen,
    goBack,
  } = useWallet();

  const [customRpc, setCustomRpc] = useState(network.rpcUrl);
  const [rpcSavedMessage, setRpcSavedMessage] = useState<string | null>(null);

  const handleSaveRpc = (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkUrl(customRpc.trim());
    setRpcSavedMessage('RPC URL berhasil diperbarui');
    setTimeout(() => setRpcSavedMessage(null), 3000);
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#8A7360] uppercase tracking-wider">
            Pengaturan
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Pengaturan Wallet</h2>
        <p className="text-xs text-[#8A7360] mt-0.5">
          Kelola node jaringan, keamanan akun, dan backup kunci privat
        </p>

        {/* Security / Backup Section */}
        <div className="mt-5 space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
            Keamanan & Cadangan
          </span>

          <button
            onClick={() => setScreen('reveal-phrase')}
            className="w-full p-3.5 bg-white hover:bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] flex items-center justify-between transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B45A00] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2E1B04]">Tampilkan Secret Phrase</div>
                <div className="text-[10px] text-stone-400">12 kata cadangan pemulihan</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setScreen('export-key')}
            className="w-full p-3.5 bg-white hover:bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] flex items-center justify-between transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B45A00] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2E1B04]">Ekspor Kunci Privat (Ed25519)</div>
                <div className="text-[10px] text-stone-400">Kunci privat heksadesimal akun aktif</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Network RPC Section */}
        <div className="mt-5 space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
            Koneksi Jaringan RPC
          </span>

          <form onSubmit={handleSaveRpc} className="p-3.5 bg-white rounded-2xl border border-[#E6DAC8] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1B04]">
                <Globe className="w-3.5 h-3.5 text-[#B45A00]" />
                <span>Node Endpoint</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Chain ID: {network.chainid}
              </span>
            </div>

            <input
              type="text"
              value={customRpc}
              onChange={(e) => setCustomRpc(e.target.value)}
              placeholder="http://127.0.0.1:3000/"
              className="w-full p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:outline-none text-xs font-mono text-[#2E1B04]"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-stone-400">
                {rpcSavedMessage || 'Default: http://127.0.0.1:3000/'}
              </span>
              <button
                type="submit"
                className="py-1 px-3 bg-[#B45A00] hover:bg-[#9B4D00] text-white text-[11px] font-bold rounded-lg transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>

        {/* Auto Lock & Session */}
        <div className="mt-5 space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
            Preferensi Aplikasi
          </span>

          <div className="p-3.5 bg-white rounded-2xl border border-[#E6DAC8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#2E1B04] font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Kunci Otomatis (Auto-lock)</span>
              </div>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                className="bg-[#FAF6F0] border border-[#E6DAC8] rounded-lg px-2 py-1 text-xs text-[#2E1B04] focus:outline-none"
              >
                <option value={1}>1 Menit</option>
                <option value={5}>5 Menit</option>
                <option value={15}>15 Menit</option>
                <option value={60}>1 Jam</option>
              </select>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-5 p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] text-xs text-[#8A7360] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#2E1B04]">
            <Info className="w-3.5 h-3.5 text-[#B45A00]" />
            <span>LiteWallet v0.4.0 Mobile Edition</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Diadaptasi dari ekstensi browser Chrome ke arsitektur Android Mobile PWA / Capacitor APK.
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 pb-2 space-y-2">
        <button
          onClick={lockWallet}
          className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-[#2E1B04] font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition"
        >
          <Lock className="w-3.5 h-3.5 text-stone-600" />
          <span>Kunci Wallet Sekarang</span>
        </button>

        <button
          onClick={() => {
            if (confirm('YAKIN INGIN MERESET? Seluruh data akun lokal akan dihapus.')) {
              resetWallet();
            }
          }}
          className="w-full py-2.5 px-4 text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus & Reset Wallet Ini</span>
        </button>
      </div>
    </div>
  );
};
