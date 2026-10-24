import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { validateMnemonic } from '../../crypto/walletCrypto';

export const ImportWalletScreen: React.FC = () => {
  const { setPendingMnemonic, setScreen, goBack } = useWallet();
  const [phraseInput, setPhraseInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const cleaned = phraseInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const count = cleaned ? cleaned.split(' ').length : 0;

    if (count !== 12 && count !== 24) {
      setError(`Secret phrase harus terdiri dari 12 atau 24 kata (saat ini ${count} kata)`);
      return;
    }

    if (!validateMnemonic(cleaned)) {
      setError('Kata-kata tidak cocok dengan kamus standar BIP39. Periksa ejaan setiap kata.');
      return;
    }

    setPendingMnemonic(cleaned);
    setScreen('set-password');
  };

  const handlePasteDemo = () => {
    // A sample test phrase for easy testing
    const demo = 'stock young success leaf radio inner tunnel aisle arena manual october flat';
    setPhraseInput(demo);
    setError(null);
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
            Import Akun
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Import Secret Phrase</h2>
        <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
          Masukkan 12 kata Secret Recovery Phrase Anda yang dipisahkan oleh spasi.
        </p>

        {/* Textarea input */}
        <div className="mt-4">
          <div className="relative">
            <textarea
              rows={4}
              value={phraseInput}
              onChange={(e) => {
                setPhraseInput(e.target.value);
                setError(null);
              }}
              placeholder="contoh: stock young success leaf radio inner tunnel aisle arena manual october flat"
              className="w-full p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E6DAC8] focus:border-[#B45A00] focus:bg-white focus:outline-none text-xs text-[#2E1B04] font-mono leading-relaxed resize-none shadow-xs transition"
            />
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Helper demo phrase for quick testing */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handlePasteDemo}
              className="text-[11px] font-semibold text-[#B45A00] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Gunakan Contoh Phrase Demo
            </button>
            <span className="text-[10px] text-stone-400">
              {phraseInput.trim() ? phraseInput.trim().split(/\s+/).length : 0} kata
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 pb-2">
        <button
          onClick={handleNext}
          disabled={!phraseInput.trim()}
          className={`w-full py-3.5 px-4 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 ${
            phraseInput.trim()
              ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-md shadow-[#B45A00]/25'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Lanjut ke Buat Password</span>
        </button>
      </div>
    </div>
  );
};
