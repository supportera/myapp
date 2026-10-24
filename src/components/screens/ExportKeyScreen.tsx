import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, Shield, Copy, Check, AlertTriangle } from 'lucide-react';

export const ExportKeyScreen: React.FC = () => {
  const { exportPrivateKey, goBack, triggerCopy, copiedFeedback, activeAccount } = useWallet();
  const [password, setPassword] = useState('');
  const [privKey, setPrivKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const key = exportPrivateKey(password);
    if (!key) {
      setError('Password salah.');
    } else {
      setPrivKey(key);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between">
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
            Kunci Privat
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Ekspor Kunci Privat Ed25519</h2>
        <p className="text-xs text-[#8A7360] mt-0.5">
          Akun: <span className="font-bold text-[#2E1B04]">{activeAccount?.label}</span> ({activeAccount?.path})
        </p>

        {!privKey ? (
          <form onSubmit={handleExport} className="mt-5 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#2E1B04] block mb-1">
                Masukkan Password Wallet Anda
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Password"
                className="w-full p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:outline-none text-xs text-[#2E1B04]"
                autoFocus
              />
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={!password}
              className={`w-full py-3 px-4 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 ${
                password
                  ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Verifikasi & Tampilkan Kunci</span>
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8]">
              <span className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
                Private Key (32-byte Hex)
              </span>
              <p className="text-xs font-mono text-[#2E1B04] break-all select-all leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
                {privKey}
              </p>
            </div>

            <button
              onClick={() => triggerCopy(privKey, 'Private key disalin!')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#2E1B04] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#B45A00]" />
                  <span>Salin Private Key</span>
                </>
              )}
            </button>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-rose-900 leading-snug">
                Siapapun yang memiliki kunci ini dapat menarik semua koin dari akun {activeAccount?.label}.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pb-2">
        <button
          onClick={goBack}
          className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition"
        >
          Selesai & Tutup
        </button>
      </div>
    </div>
  );
};
