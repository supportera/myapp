import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, CheckCircle2, ShieldAlert, Send } from 'lucide-react';

export const ConfirmTxModal: React.FC = () => {
  const { pendingTx, sendTransfer, setScreen, goBack } = useWallet();
  const [isSending, setIsSending] = useState(false);
  const [txSuccessHash, setTxSuccessHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!pendingTx) {
    return (
      <div className="p-4 text-center">
        <button onClick={goBack} className="text-xs text-[#B45A00]">Kembali</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    try {
      setIsSending(true);
      setError(null);
      const hash = await sendTransfer(pendingTx.to, pendingTx.amount);
      setTxSuccessHash(hash);
    } catch (err: any) {
      setError(err?.message || 'Gagal mengirim transaksi');
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            disabled={isSending}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#8A7360] uppercase tracking-wider">
            Konfirmasi
          </span>
          <div className="w-8" />
        </div>

        {txSuccessHash ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold text-[#2E1B04]">Transaksi Terkirim!</h2>
            <p className="text-xs text-[#8A7360] mt-1">
              Signed dengan Ed25519 & Keccak256 dan berhasil dibroadcast ke node.
            </p>

            <div className="mt-4 p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] text-left">
              <span className="text-[10px] text-stone-400 font-semibold uppercase">Tx Hash:</span>
              <p className="text-xs font-mono text-[#2E1B04] break-all select-all mt-0.5">
                {txSuccessHash}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-[#2E1B04]">Tinjau & Tandatangani</h2>
            <p className="text-xs text-[#8A7360] mt-1">
              Periksa detail pengiriman sebelum ditandatangani.
            </p>

            {/* Summary card */}
            <div className="mt-5 p-4 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] space-y-3">
              <div>
                <span className="text-[10px] text-stone-500 font-semibold uppercase">Jumlah Pengiriman</span>
                <div className="text-2xl font-black text-[#2E1B04] mt-0.5">
                  {pendingTx.amount} <span className="text-sm font-bold text-[#B45A00]">LWC</span>
                </div>
              </div>

              <div className="border-t border-[#E6DAC8]/80 pt-2.5">
                <span className="text-[10px] text-stone-500 font-semibold uppercase">Tujuan</span>
                <div className="text-xs font-mono text-[#2E1B04] break-all mt-0.5">
                  {pendingTx.to}
                </div>
              </div>

              <div className="border-t border-[#E6DAC8]/80 pt-2.5 flex justify-between">
                <span className="text-[10px] text-stone-500 font-semibold uppercase">Biaya Jaringan</span>
                <span className="text-xs font-mono text-[#2E1B04]">{pendingTx.fee} LWC</span>
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-6 pb-2">
        {txSuccessHash ? (
          <button
            onClick={() => setScreen('home')}
            className="w-full py-3.5 px-4 bg-[#B45A00] hover:bg-[#9B4D00] text-white font-bold rounded-2xl shadow-md transition"
          >
            Kembali ke Beranda
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isSending}
            className="w-full py-3.5 px-4 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md shadow-[#B45A00]/25 flex items-center justify-center gap-2 text-sm transition"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Sign & Kirim Transaksi</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
