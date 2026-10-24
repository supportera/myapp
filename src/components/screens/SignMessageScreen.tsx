import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, FileSignature, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SignMessageScreen: React.FC = () => {
  const { signMsg, goBack, setScreen, triggerCopy, copiedFeedback, activeAccount } = useWallet();
  const [message, setMessage] = useState('');
  const [proofHex, setProofHex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setError(null);
      const proof = signMsg(message.trim());
      setProofHex(proof);
    } catch (err: any) {
      setError(err?.message || 'Gagal menandatangani pesan');
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
            Sign Message
          </span>
          <button
            onClick={() => setScreen('verify')}
            className="text-xs text-[#B45A00] font-bold hover:underline"
          >
            Verifikasi
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Tandatangani Pesan</h2>
        <p className="text-xs text-[#8A7360] mt-0.5 leading-relaxed">
          Menghasilkan cryptographic proof 104-byte (Pubkey + Ed25519 Signature + Timestamp) untuk login dApp.
        </p>

        <form onSubmit={handleSign} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#2E1B04] block mb-1">
              Isi Pesan
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setProofHex(null);
              }}
              placeholder="Ketik teks pesan atau tantangan dApp di sini..."
              className="w-full p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] resize-none"
            />
          </div>

          {!proofHex && (
            <button
              type="submit"
              disabled={!message.trim()}
              className={`w-full py-3 px-4 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 ${
                message.trim()
                  ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>Tandatangani Sekarang</span>
            </button>
          )}
        </form>

        {proofHex && (
          <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bukti Tanda Tangan (Proof Hex) Berhasil Dibuat</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 font-mono text-[11px] text-[#2E1B04] break-all select-all max-h-24 overflow-y-auto">
              {proofHex}
            </div>

            <button
              onClick={() => triggerCopy(proofHex, 'Proof hex disalin!')}
              className="w-full py-2 bg-white hover:bg-stone-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 transition"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Salin Bukti Hex</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-600 mt-2">{error}</p>
        )}
      </div>

      <div className="mt-6 pb-2">
        <button
          onClick={() => setScreen('verify')}
          className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition"
        >
          Cek & Uji Verifikasi Tanda Tangan
        </button>
      </div>
    </div>
  );
};
