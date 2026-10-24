import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

export const TxDetailScreen: React.FC = () => {
  const { selectedTx, goBack, triggerCopy, copiedFeedback } = useWallet();

  if (!selectedTx) {
    return (
      <div className="p-4 text-center">
        <button onClick={goBack} className="text-xs text-[#B45A00]">Kembali</button>
      </div>
    );
  }

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
            Detail Transaksi
          </span>
          <div className="w-8" />
        </div>

        {/* Status icon & title */}
        <div className="text-center py-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#2E1B04]">
            {selectedTx.type === 'send' ? 'Pengiriman Sukses' : 'Penerimaan Sukses'}
          </h2>
          <div className="text-2xl font-black text-[#2E1B04] mt-1">
            {selectedTx.type === 'send' ? `-${selectedTx.amount}` : `+${selectedTx.amount}`} LWC
          </div>
          <span className="text-[11px] text-stone-400">
            {new Date(selectedTx.timestamp).toLocaleString()}
          </span>
        </div>

        {/* Fields list */}
        <div className="mt-5 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] p-3.5 space-y-3">
          <div>
            <span className="text-[10px] text-stone-500 font-semibold uppercase block">Transaction Hash</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-mono text-[#2E1B04] break-all select-all">
                {selectedTx.hash}
              </span>
              <button
                onClick={() => triggerCopy(selectedTx.hash, 'Tx Hash disalin!')}
                className="p-1 hover:bg-stone-200 rounded text-stone-600 ml-1 flex-shrink-0"
              >
                {copiedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="border-t border-[#E6DAC8]/80 pt-2">
            <span className="text-[10px] text-stone-500 font-semibold uppercase block">Pengirim (From)</span>
            <span className="text-xs font-mono text-[#2E1B04] break-all select-all block mt-0.5">
              {selectedTx.from}
            </span>
          </div>

          <div className="border-t border-[#E6DAC8]/80 pt-2">
            <span className="text-[10px] text-stone-500 font-semibold uppercase block">Penerima (To)</span>
            <span className="text-xs font-mono text-[#2E1B04] break-all select-all block mt-0.5">
              {selectedTx.to}
            </span>
          </div>

          <div className="border-t border-[#E6DAC8]/80 pt-2 flex justify-between items-center">
            <span className="text-[10px] text-stone-500 font-semibold uppercase">Biaya Jaringan</span>
            <span className="text-xs font-mono text-[#2E1B04]">{selectedTx.fee} LWC</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pb-2">
        <button
          onClick={goBack}
          className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
