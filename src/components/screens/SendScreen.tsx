import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { formatLWC, parseLWC, TRANSFER_POWER } from '../../crypto/walletCrypto';
import { ArrowLeft, QrCode, AlertCircle, ArrowRight } from 'lucide-react';

export const SendScreen: React.FC = () => {
  const { activeAccount, goBack, setScreen, setPendingTx } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!activeAccount) return null;

  const handleMax = () => {
    // Leave a small buffer for gas fee (0.0000012 LWC)
    const power = TRANSFER_POWER;
    const pricePerPower = 1_000_000n;
    const feeAtomic = power * pricePerPower;
    if (activeAccount.balance > feeAtomic) {
      const maxAtomic = activeAccount.balance - feeAtomic;
      setAmount(formatLWC(maxAtomic));
    } else {
      setAmount('0');
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTo = recipient.trim();

    if (!cleanTo.toLowerCase().startsWith('rx')) {
      setError('Alamat tujuan harus dimulai dengan awalan "rx" (contoh: rx...)');
      return;
    }

    const hexPart = cleanTo.slice(2);
    if (hexPart.length !== 40 || !/^[0-9a-fA-F]+$/.test(hexPart)) {
      setError('Alamat rx harus memiliki panjang tepat 40 karakter heksadesimal setelah awalan "rx"');
      return;
    }

    if (cleanTo.toLowerCase() === activeAccount.address.toLowerCase()) {
      setError('Tidak dapat mengirim ke alamat diri sendiri');
      return;
    }

    try {
      const amtAtomic = parseLWC(amount);
      if (amtAtomic <= 0n) {
        setError('Jumlah kirim harus lebih besar dari 0');
        return;
      }

      const power = TRANSFER_POWER;
      const pricePerPower = 1_000_000n;
      const feeAtomic = power * pricePerPower;

      if (activeAccount.balance < amtAtomic + feeAtomic) {
        setError('Saldo tidak mencukupi untuk jumlah transfer dan biaya jaringan (fee)');
        return;
      }

      setPendingTx({
        to: cleanTo,
        amount,
        fee: formatLWC(feeAtomic),
      });

      setScreen('confirm-tx');
    } catch {
      setError('Format angka jumlah tidak valid');
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between">
      <form onSubmit={handleReview} className="flex flex-col justify-between h-full">
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
              Kirim Token
            </span>
            <div className="w-8" />
          </div>

          <h2 className="text-xl font-bold text-[#2E1B04]">Kirim LWC</h2>
          <p className="text-xs text-[#8A7360] mt-1">
            Saldo: <span className="font-bold text-[#2E1B04]">{formatLWC(activeAccount.balance)} LWC</span>
          </p>

          <div className="space-y-4 mt-5">
            {/* Recipient Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#2E1B04]">
                  Alamat Penerima (Format <code className="text-[#B45A00]">rx...</code>)
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setError(null);
                  }}
                  placeholder="rx..."
                  className="w-full p-3 pr-10 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs font-mono text-[#2E1B04] transition"
                />
                <button
                  type="button"
                  onClick={() => {
                    // Pre-fill a sample valid rx destination for easy testing
                    setRecipient('rx' + 'e2'.repeat(20));
                    setError(null);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#B45A00] bg-amber-100 px-1.5 py-1 rounded hover:bg-amber-200 transition"
                >
                  Contoh
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#2E1B04]">
                  Jumlah LWC
                </label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-[10px] font-bold text-[#B45A00] hover:underline"
                >
                  Gunakan MAX
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder="0.0"
                  className="w-full p-3 pr-16 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-sm font-bold text-[#2E1B04] transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                  LWC
                </span>
              </div>
            </div>

            {/* Network Fee Estimate */}
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] text-xs space-y-1.5">
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Biaya Jaringan (Power: 1200)</span>
                <span className="font-mono text-[#2E1B04]">~0.0000012 LWC</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Waktu Konfirmasi</span>
                <span className="text-emerald-700 font-semibold">Instan (~1-2 detik)</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 pb-2">
          <button
            type="submit"
            disabled={!recipient || !amount}
            className={`w-full py-3.5 px-4 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 ${
              recipient && amount
                ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-md shadow-[#B45A00]/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Tinjau Transaksi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
