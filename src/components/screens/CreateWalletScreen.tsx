import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Copy, Check, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export const CreateWalletScreen: React.FC = () => {
  const { pendingMnemonic, setScreen, goBack, triggerCopy, copiedFeedback } = useWallet();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const words = pendingMnemonic ? pendingMnemonic.split(' ') : [];

  // Scrambled words for step 2 verification
  const [shuffledWords] = useState<string[]>(() => {
    return [...words].sort(() => Math.random() - 0.5);
  });

  const handleCopyPhrase = () => {
    triggerCopy(pendingMnemonic, '12 Kata Secret Phrase disalin!');
  };

  const handleSelectWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
    setVerifyError(null);
  };

  const handleVerifyStep2 = () => {
    if (selectedWords.join(' ') === pendingMnemonic) {
      setScreen('set-password');
    } else {
      setVerifyError('Urutan kata belum tepat. Periksa kembali catatan Anda.');
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 h-full justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={step === 1 ? goBack : () => setStep(1)}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#8A7360] uppercase tracking-wider">
            Langkah {step} dari 2
          </span>
          <div className="w-8" />
        </div>

        {step === 1 ? (
          <div>
            <h2 className="text-xl font-bold text-[#2E1B04]">Simpan Secret Phrase</h2>
            <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
              Tulis 12 kata berikut di kertas yang aman. Jangan bagikan kepada siapapun, ini adalah akses penuh ke wallet Anda.
            </p>

            {/* Word Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E6DAC8]">
              {words.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-white py-2 px-2.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between"
                >
                  <span className="text-[10px] text-stone-400 font-mono">{idx + 1}.</span>
                  <span className="text-xs font-bold text-[#2E1B04]">{word}</span>
                </div>
              ))}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopyPhrase}
              className="w-full mt-3 py-2 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl text-xs font-semibold text-[#2E1B04] flex items-center justify-center gap-1.5 transition"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B45A00]" />
                  <span>Salin Semua Kata</span>
                </>
              )}
            </button>

            {/* Warning banner */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#B45A00] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-snug">
                Jika Anda kehilangan recovery phrase ini, saldo wallet Anda tidak dapat dipulihkan oleh pihak manapun.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-[#2E1B04]">Verifikasi Catatan Anda</h2>
            <p className="text-xs text-[#8A7360] mt-1 leading-relaxed">
              Ketuk kata-kata berikut sesuai urutan nomor 1 sampai 12 untuk memastikan Anda telah mencatatnya.
            </p>

            {/* Selected box */}
            <div className="min-h-[96px] bg-white border border-[#E6DAC8] rounded-2xl p-2.5 mt-4 flex flex-wrap gap-1.5 items-start">
              {selectedWords.length === 0 ? (
                <span className="text-xs text-stone-400 m-auto italic">Pilih kata sesuai urutan di bawah...</span>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectWord(word)}
                    className="bg-[#FAF6F0] hover:bg-amber-100 border border-amber-300/80 rounded-lg px-2 py-1 text-xs font-semibold text-[#B45A00] flex items-center gap-1"
                  >
                    <span className="text-[10px] text-stone-400">{idx + 1}</span>
                    <span>{word}</span>
                    <span className="text-[10px] text-stone-400">×</span>
                  </button>
                ))
              )}
            </div>

            {verifyError && (
              <p className="text-xs text-rose-600 mt-2 font-medium">{verifyError}</p>
            )}

            {/* Available scrambled words */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {shuffledWords.map((word, idx) => {
                const isUsed = selectedWords.includes(word);
                return (
                  <button
                    key={idx}
                    disabled={isUsed}
                    onClick={() => handleSelectWord(word)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                      isUsed
                        ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                        : 'bg-[#FAF6F0] hover:bg-[#F5E3D0] border-[#E6DAC8] text-[#2E1B04] active:scale-95'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 pb-2">
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 px-4 bg-[#B45A00] hover:bg-[#9B4D00] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md shadow-[#B45A00]/25 flex items-center justify-center gap-2 text-sm transition"
          >
            <span>Sudah Saya Catat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedWords([])}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl transition"
            >
              Reset
            </button>
            <button
              disabled={selectedWords.length !== 12}
              onClick={handleVerifyStep2}
              className={`flex-1 py-3.5 px-4 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 ${
                selectedWords.length === 12
                  ? 'bg-[#B45A00] hover:bg-[#9B4D00] text-white shadow-md shadow-[#B45A00]/25'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Lanjut ke Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
