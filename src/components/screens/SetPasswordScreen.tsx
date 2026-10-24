import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const SetPasswordScreen: React.FC = () => {
  const { completeWalletSetup, goBack } = useWallet();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password minimal harus 8 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    if (!agree) {
      setError('Harap setujui ketentuan keamanan');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await completeWalletSetup(password);
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-[#8A7360] uppercase tracking-wider">
              Keamanan Dompet
            </span>
            <div className="w-8" />
          </div>

          <h2 className="text-xl font-bold text-[#2E1B04]">Buat Password Buka Kunci</h2>
          <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
            Password ini digunakan untuk membuka LiteWallet di perangkat Android Anda.
          </p>

          <div className="space-y-3.5 mt-5">
            {/* Password input */}
            <div>
              <label className="block text-[11px] font-semibold text-[#2E1B04] mb-1">
                Password Baru (min. 8 karakter)
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Masukkan password"
                  className="w-full p-3 pr-10 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[11px] font-semibold text-[#2E1B04] mb-1">
                Konfirmasi Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Ulangi password"
                className="w-full p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] transition"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2.5 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-[#B45A00] focus:ring-[#B45A00]"
              />
              <span className="text-[11px] text-[#8A7360] leading-snug">
                Saya memahami bahwa LiteWallet tidak menyimpan password saya dan tidak dapat memulihkannya jika lupa.
              </span>
            </label>

            {error && (
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pb-2">
          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword || !agree}
            className={`w-full py-3.5 px-4 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 ${
              password && confirmPassword && agree && !isLoading
                ? 'bg-[#B45A00] hover:bg-[#9B4D00] active:scale-[0.98] text-white shadow-md shadow-[#B45A00]/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Selesaikan & Buka Wallet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
