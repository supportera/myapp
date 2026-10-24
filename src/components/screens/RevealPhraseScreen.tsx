import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, KeyRound, Copy, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const RevealPhraseScreen: React.FC = () => {
  const { exportPhrase, goBack, triggerCopy, copiedFeedback } = useWallet();
  const [password, setPassword] = useState('');
  const [phrase, setPhrase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReveal = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const p = exportPhrase(password);
    if (!p) {
      setError('Password salah.');
    } else {
      setPhrase(p);
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
            Cadangan
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Secret Recovery Phrase</h2>
        <p className="text-xs text-[#8A7360] mt-0.5">
          Verifikasi password Anda terlebih dahulu untuk membuka kunci frasa pemulihan.
        </p>

        {!phrase ? (
          <form onSubmit={handleReveal} className="mt-5 space-y-3">
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
              <span>Verifikasi & Tampilkan</span>
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-2 bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E6DAC8]">
              {phrase.split(' ').map((word, idx) => (
                <div
                  key={idx}
                  className="bg-white py-1.5 px-2 rounded-lg border border-stone-200 flex items-center justify-between"
                >
                  <span className="text-[9px] text-stone-400 font-mono">{idx + 1}.</span>
                  <span className="text-xs font-bold text-[#2E1B04]">{word}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => triggerCopy(phrase, 'Secret phrase disalin!')}
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
                  <span>Salin Semua 12 Kata</span>
                </>
              )}
            </button>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B45A00] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-snug">
                Jangan pernah membagikan kata-kata ini ke siapapun termasuk staf dukungan teknis.
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
