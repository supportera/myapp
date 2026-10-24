import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { formatLWC } from '../../crypto/walletCrypto';
import { ArrowLeft, Plus, Check, Wallet, ChevronRight } from 'lucide-react';

export const AccountsScreen: React.FC = () => {
  const { accounts, activeAccountIndex, switchAccount, addAccount, goBack } = useWallet();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(newLabel.trim() || undefined);
    setShowAddModal(false);
    setNewLabel('');
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
            Kelola Akun
          </span>
          <div className="w-8" />
        </div>

        <h2 className="text-xl font-bold text-[#2E1B04]">Daftar Akun Wallet</h2>
        <p className="text-xs text-[#8A7360] mt-0.5">
          Semua akun diturunkan secara aman dari satu recovery phrase utama (SLIP-0010)
        </p>

        {/* Account list */}
        <div className="space-y-2 mt-4">
          {accounts.map((acc, idx) => {
            const isActive = idx === activeAccountIndex;
            return (
              <button
                key={idx}
                onClick={() => switchAccount(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  isActive
                    ? 'bg-[#FAF6F0] border-[#B45A00] shadow-sm ring-1 ring-[#B45A00]/20'
                    : 'bg-white hover:bg-stone-50 border-[#E6DAC8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-[#B45A00] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2E1B04] flex items-center gap-1.5">
                      <span>{acc.label}</span>
                      {isActive && (
                        <span className="text-[9px] bg-amber-100 text-[#B45A00] font-bold px-1.5 py-0.2 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {acc.address.slice(0, 10)}...{acc.address.slice(-6)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#2E1B04]">
                    {formatLWC(acc.balance)} LWC
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {acc.path}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-[#2E1B04]">Tambah Akun Baru</h3>
            <p className="text-xs text-[#8A7360] mt-1">
              Akun baru akan menggunakan path derivasi berikutnya.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={`Account ${accounts.length + 1}`}
                className="w-full p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] focus:border-[#B45A00] focus:outline-none text-xs text-[#2E1B04]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B45A00] hover:bg-[#9B4D00] text-white text-xs font-bold rounded-xl"
                >
                  Buat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add account button */}
      <div className="mt-6 pb-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.98] text-[#2E1B04] font-bold rounded-2xl border border-[#E6DAC8] shadow-xs flex items-center justify-center gap-2 text-sm transition"
        >
          <Plus className="w-4 h-4 text-[#B45A00]" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>
    </div>
  );
};
