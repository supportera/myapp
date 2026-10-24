import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { formatLWC } from '../../crypto/walletCrypto';
import {
  Send,
  ArrowDownLeft,
  Settings,
  ChevronDown,
  Copy,
  Check,
  FileSignature,
  Coins,
  History,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    activeAccount,
    accounts,
    history,
    setScreen,
    triggerCopy,
    copiedFeedback,
    faucetClaim,
    setSelectedTx,
    network,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'activity' | 'assets'>('activity');

  if (!activeAccount) {
    return <div className="p-4 text-center text-xs">Memuat akun...</div>;
  }

  const shortAddress = `${activeAccount.address.slice(0, 8)}...${activeAccount.address.slice(-6)}`;
  const balanceFormatted = formatLWC(activeAccount.balance);
  const balanceUSD = (Number(balanceFormatted) * 0.85).toFixed(2); // approximate 1 LWC = $0.85

  return (
    <div className="flex flex-col flex-1 h-full bg-[#EEF1FB]/30">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E6DAC8]/60">
        {/* Network status pill */}
        <button
          onClick={() => setScreen('settings')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LiteChain</span>
        </button>

        {/* Account Selector Pill */}
        <button
          onClick={() => setScreen('accounts')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2E1B04] text-xs font-bold border border-stone-200 shadow-xs transition"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#B45A00]" />
          <span>{activeAccount.label}</span>
          <ChevronDown className="w-3 h-3 text-stone-500" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setScreen('settings')}
          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Address Pill */}
        <div className="flex justify-center">
          <button
            onClick={() => triggerCopy(activeAccount.address, 'Alamat rx tersalin!')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#FAF6F0] border border-[#E6DAC8] rounded-full text-xs font-mono text-stone-600 shadow-xs transition"
          >
            <span>{shortAddress}</span>
            {copiedFeedback ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3 text-[#B45A00]" />
            )}
          </button>
        </div>

        {/* Balance Display Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#B45A00] to-[#8C4600] text-white p-5 shadow-xl shadow-[#B45A00]/20">
          {/* Flame decorative background */}
          <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none">
            <img src="/icons/logo.svg" alt="" className="w-36 h-36" />
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-amber-100/90">
            <span>Saldo Tersedia</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
              Ed25519 Native
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              {balanceFormatted}
            </span>
            <span className="text-lg font-bold text-amber-200">LWC</span>
          </div>

          <div className="text-xs text-amber-200/80 mt-0.5">
            ≈ ${balanceUSD} USD
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Send */}
          <button
            onClick={() => setScreen('send')}
            className="flex flex-col items-center gap-1.5 p-2.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#E6DAC8]/80 shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] group-hover:bg-[#B45A00] text-[#B45A00] group-hover:text-white flex items-center justify-center transition">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#2E1B04]">Kirim</span>
          </button>

          {/* Receive */}
          <button
            onClick={() => setScreen('receive')}
            className="flex flex-col items-center gap-1.5 p-2.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#E6DAC8]/80 shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] group-hover:bg-[#B45A00] text-[#B45A00] group-hover:text-white flex items-center justify-center transition">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#2E1B04]">Terima</span>
          </button>

          {/* Faucet Claim */}
          <button
            onClick={faucetClaim}
            className="flex flex-col items-center gap-1.5 p-2.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#E6DAC8]/80 shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-700 group-hover:text-white flex items-center justify-center transition">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-amber-900">Faucet</span>
          </button>

          {/* Sign Message */}
          <button
            onClick={() => setScreen('sign')}
            className="flex flex-col items-center gap-1.5 p-2.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#E6DAC8]/80 shadow-xs transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] group-hover:bg-[#B45A00] text-[#B45A00] group-hover:text-white flex items-center justify-center transition">
              <FileSignature className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#2E1B04]">Sign</span>
          </button>
        </div>

        {/* Tabs: Activity vs Assets */}
        <div className="bg-white rounded-2xl border border-[#E6DAC8]/80 p-3 shadow-xs">
          <div className="flex border-b border-stone-100 pb-2 mb-3">
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'activity'
                  ? 'border-[#B45A00] text-[#B45A00]'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Riwayat Transaksi
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'assets'
                  ? 'border-[#B45A00] text-[#B45A00]'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Aset Token
            </button>
          </div>

          {activeTab === 'activity' ? (
            <div>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-500">Belum ada transaksi</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Coba klaim tombol <span className="font-semibold text-amber-700">Faucet</span> atau lakukan pengiriman LWC!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((tx, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedTx(tx);
                        setScreen('tx-detail');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#FAF6F0] hover:bg-amber-100/40 border border-[#E6DAC8]/60 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'send'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {tx.type === 'send' ? (
                            <Send className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#2E1B04] flex items-center gap-1">
                            <span>{tx.type === 'send' ? 'Kirim LWC' : 'Terima LWC'}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono">
                              Sukses
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-bold ${
                            tx.type === 'send' ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {tx.type === 'send' ? `-${tx.amount}` : `+${tx.amount}`} LWC
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E6DAC8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#B45A00] flex items-center justify-center text-white font-bold text-xs">
                    LWC
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2E1B04]">Lightweight Coin</div>
                    <div className="text-[10px] text-stone-400">Native Ed25519 Token</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#2E1B04]">{balanceFormatted} LWC</div>
                  <div className="text-[10px] text-stone-500">≈ ${balanceUSD}</div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center py-4">
                <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-stone-500">Mendukung Custom Token & NFT Chain</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
