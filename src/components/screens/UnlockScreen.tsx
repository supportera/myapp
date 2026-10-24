import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Lock, Fingerprint, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const UnlockScreen: React.FC = () => {
  const { unlockWallet, resetWallet } = useWallet();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsSubmitting(true);
    setError(null);

    const success = await unlockWallet(password);
    if (!success) {
      setError('Password salah. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 h-full justify-between text-center">
      <div className="flex flex-col items-center mt-8">
        {/* Brand Mark */}
        <div className="w-16 h-16 rounded-2xl bg-[#B45A00] flex items-center justify-center shadow-lg shadow-[#B45A00]/25 mb-4">
          <img
            src="/icons/logo.svg"
            alt="LiteWallet"
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Selamat Datang Kembali</h2>
        <p className="text-xs text-[#8A7360] mt-1">LiteWallet terkunci demi keamanan</p>

        {/* Password input */}
        <form onSubmit={handleUnlock} className="w-full mt-6 space-y-3">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Masukkan password Anda"
              autoFocus
              className="w-full p-3.5 pr-10 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!password || isSubmitting}
            className={`w-full py-3.5 px-4 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 ${
              password && !isSubmitting
                ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-md shadow-[#B45A00]/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Buka Kunci</span>
          </button>
        </form>

        {/* Android Biometric Simulated Unlock */}
        <div className="mt-6 flex flex-col items-center">
          <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mb-2">
            <Fingerprint className="w-4 h-4 text-[#B45A00]" />
            <span>Dukungan Biometrik / Sidik Jari Android</span>
          </div>
          <span className="text-[10px] text-stone-400 max-w-[240px]">
            Tersedia otomatis saat dijalankan di aplikasi APK Android via BiometricPrompt API
          </span>
        </div>
      </div>

      {/* Forgot / Reset wallet */}
      <div className="pb-3 text-center">
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset wallet ini? Pastikan Anda masih memiliki 12 kata secret recovery phrase.')) {
              resetWallet();
            }
          }}
          className="text-xs text-[#8A7360] hover:text-rose-600 font-medium transition"
        >
          Lupa password? Reset wallet
        </button>
      </div>
    </div>
  );
};
