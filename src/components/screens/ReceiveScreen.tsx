import React, { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, Copy, Check, Share2, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

export const ReceiveScreen: React.FC = () => {
  const { activeAccount, goBack, triggerCopy, copiedFeedback } = useWallet();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (activeAccount?.address) {
      QRCode.toDataURL(activeAccount.address, {
        width: 220,
        margin: 2,
        color: {
          dark: '#2E1B04',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [activeAccount?.address]);

  if (!activeAccount) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Alamat LiteWallet Saya',
        text: activeAccount.address,
      }).catch(() => {});
    } else {
      triggerCopy(activeAccount.address, 'Alamat rx disalin!');
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
            Terima Aset
          </span>
          <div className="w-8" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-[#2E1B04]">Terima LWC</h2>
          <p className="text-xs text-[#8A7360] mt-0.5">
            Pindai QR Code atau salin alamat di bawah untuk menerima koin
          </p>

          {/* QR Code Container */}
          <div className="mt-5 inline-block p-4 bg-white rounded-3xl border border-[#E6DAC8] shadow-md shadow-stone-200/50">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code Alamat"
                className="w-48 h-48 rounded-xl object-contain mx-auto"
              />
            ) : (
              <div className="w-48 h-48 bg-stone-100 rounded-xl animate-pulse" />
            )}
            <div className="mt-2 text-[10px] font-bold text-[#B45A00] tracking-wider uppercase">
              LiteChain • {activeAccount.label}
            </div>
          </div>

          {/* Address pill & Copy */}
          <div className="mt-5 p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] text-left">
            <span className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
              Alamat Dompet (Format rx)
            </span>
            <p className="text-xs font-mono text-[#2E1B04] break-all leading-relaxed select-all">
              {activeAccount.address}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 pb-2 flex gap-2.5">
        <button
          onClick={() => triggerCopy(activeAccount.address, 'Alamat rx berhasil disalin!')}
          className="flex-1 py-3.5 px-4 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md shadow-[#B45A00]/25 flex items-center justify-center gap-2 text-sm transition"
        >
          {copiedFeedback ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Alamat</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="py-3.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.98] text-[#2E1B04] font-semibold rounded-2xl border border-[#E6DAC8] shadow-sm flex items-center justify-center gap-2 text-sm transition"
        >
          <Share2 className="w-4 h-4 text-[#8A7360]" />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
};
