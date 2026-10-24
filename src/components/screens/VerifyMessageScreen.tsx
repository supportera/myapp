import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, CheckCircle2, XCircle, Search } from 'lucide-react';

export const VerifyMessageScreen: React.FC = () => {
  const { verifyMsg, goBack } = useWallet();
  const [message, setMessage] = useState('');
  const [proofHex, setProofHex] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    pubkeyHex: string;
    address: string;
    timestamp: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !proofHex.trim()) return;

    try {
      setError(null);
      const res = verifyMsg(message.trim(), proofHex.trim());
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Format bukti tanda tangan tidak valid (harus 104 bytes heksadesimal)');
      setResult(null);
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
            Verifikasi Tanda Tangan
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Verifikasi Bukti Pesan</h2>
        <p className="text-xs text-[#8A7360] mt-0.5 leading-relaxed">
          Verifikasi integritas pesan dan identitas pengirim tanpa memerlukan private key.
        </p>

        <form onSubmit={handleVerify} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#2E1B04] block mb-1">
              Pesan Asli
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Masukkan pesan yang ditandatangani..."
              className="w-full p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#2E1B04] block mb-1">
              Bukti Hex (Proof 104-byte)
            </label>
            <textarea
              rows={3}
              value={proofHex}
              onChange={(e) => setProofHex(e.target.value)}
              placeholder="Tempelkan kode heksadesimal bukti tanda tangan..."
              className="w-full p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs font-mono text-[#2E1B04] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || !proofHex.trim()}
            className={`w-full py-3 px-4 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 ${
              message.trim() && proofHex.trim()
                ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-xs'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Verifikasi Keabsahan</span>
          </button>
        </form>

        {error && (
          <p className="text-xs text-rose-600 mt-3 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        {result && (
          <div
            className={`mt-4 p-4 rounded-2xl border ${
              result.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.valid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-800">Tanda Tangan Asli & Valid!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold text-rose-800">Tanda Tangan Tidak Cocok / Rusak</span>
                </>
              )}
            </div>

            {result.valid && (
              <div className="space-y-1.5 text-[11px] font-mono mt-2 bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                <div>
                  <span className="text-stone-500 block text-[9px] uppercase">Alamat Penandatangan (rx):</span>
                  <span className="font-bold text-[#2E1B04] break-all">{result.address}</span>
                </div>
                <div className="pt-1">
                  <span className="text-stone-500 block text-[9px] uppercase">Waktu Penandatanganan:</span>
                  <span className="text-stone-700">
                    {new Date(result.timestamp * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 pb-2">
        <button
          onClick={goBack}
          className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition"
        >
          Selesai & Kembali
        </button>
      </div>
    </div>
  );
};
