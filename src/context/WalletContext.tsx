import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WalletAccount,
  TransactionHistoryItem,
  NetworkConfig,
  ScreenName,
} from '../types/wallet';
import {
  generateMnemonic,
  validateMnemonic,
  deriveAddress,
  deriveEd25519PubkeyHex,
  deriveEd25519PrivkeyHex,
  buildHardenedPath,
  signTransaction,
  txHashHex,
  signMessage,
  verifyMessage,
  formatLWC,
  parseLWC,
  u256ToHex,
  TRANSFER_POWER,
} from '../crypto/walletCrypto';

interface WalletContextType {
  // Screen
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  screenHistory: ScreenName[];
  goBack: () => void;

  // Wallet auth state
  hasWallet: boolean;
  isLocked: boolean;
  activeAccountIndex: number;
  accounts: WalletAccount[];
  activeAccount: WalletAccount | null;
  history: TransactionHistoryItem[];

  // Pending creation/import state
  pendingMnemonic: string;
  setPendingMnemonic: (phrase: string) => void;
  pendingTx: {
    to: string;
    amount: string;
    fee: string;
    rawTxHex?: string;
  } | null;
  setPendingTx: (tx: any) => void;
  selectedTx: TransactionHistoryItem | null;
  setSelectedTx: (tx: TransactionHistoryItem | null) => void;

  // Actions
  createWalletInit: (wordCount?: 12 | 24) => string;
  completeWalletSetup: (password: string) => Promise<void>;
  importWallet: (phrase: string, password: string) => Promise<void>;
  unlockWallet: (password: string) => Promise<boolean>;
  lockWallet: () => void;
  addAccount: (label?: string) => void;
  switchAccount: (index: number) => void;
  sendTransfer: (to: string, amountStr: string) => Promise<string>;
  faucetClaim: () => Promise<void>;
  signMsg: (message: string) => string;
  verifyMsg: (message: string, proofHex: string) => { valid: boolean; pubkeyHex: string; address: string; timestamp: number };
  exportPrivateKey: (password: string) => string | null;
  exportPhrase: (password: string) => string | null;
  resetWallet: () => void;

  // Network & Settings
  network: NetworkConfig;
  setNetworkUrl: (url: string) => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  copiedFeedback: string | null;
  triggerCopy: (text: string, label?: string) => void;
}

const STORAGE_KEY_ACCOUNTS = 'litewallet_accounts';
const STORAGE_KEY_ENCRYPTED = 'litewallet_vault';
const STORAGE_KEY_HISTORY = 'litewallet_tx_history';
const STORAGE_KEY_AUTOLOCK = 'litewallet_autolock';

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenName>('welcome');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>([]);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [activeAccountIndex, setActiveAccountIndex] = useState<number>(0);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);
  const [pendingMnemonic, setPendingMnemonic] = useState<string>('');
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [selectedTx, setSelectedTx] = useState<TransactionHistoryItem | null>(null);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(5);
  const [copiedFeedback, setCopiedFeedback] = useState<string | null>(null);

  // In-memory unlocked mnemonic & password
  const [currentMnemonic, setCurrentMnemonic] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);

  const [network, setNetwork] = useState<NetworkConfig>({
    name: 'LiteChain Devnet (Mock / Local)',
    rpcUrl: 'http://127.0.0.1:3000/',
    chainid: 1,
    symbol: 'LWC',
    isMock: true,
    status: 'online',
    blockNumber: 14209,
    latencyMs: 12,
  });

  // Navigation with history stack
  const setScreen = (nextScreen: ScreenName) => {
    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreenState(nextScreen);
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((h) => h.slice(0, -1));
      setCurrentScreenState(prev);
    } else {
      setCurrentScreenState(hasWallet ? (isLocked ? 'unlock' : 'home') : 'welcome');
    }
  };

  // Check saved state on load
  useEffect(() => {
    try {
      const savedVault = localStorage.getItem(STORAGE_KEY_ENCRYPTED);
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      const savedAutolock = localStorage.getItem(STORAGE_KEY_AUTOLOCK);

      if (savedAutolock) {
        setAutoLockMinutes(Number(savedAutolock));
      }

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      if (savedVault) {
        setHasWallet(true);
        setIsLocked(true);
        setCurrentScreenState('unlock');
      } else {
        setHasWallet(false);
        setIsLocked(false);
        setCurrentScreenState('welcome');
      }
    } catch {
      // fallback
    }
  }, []);

  // Simple copy helper
  const triggerCopy = (text: string, label = 'Tersalin ke clipboard') => {
    navigator.clipboard?.writeText(text);
    setCopiedFeedback(label);
    setTimeout(() => {
      setCopiedFeedback(null);
    }, 2500);
  };

  // Create initial mnemonic
  const createWalletInit = (wordCount: 12 | 24 = 12): string => {
    const phrase = generateMnemonic(wordCount);
    setPendingMnemonic(phrase);
    return phrase;
  };

  // Complete wallet setup with password
  const completeWalletSetup = async (password: string) => {
    if (!pendingMnemonic || !validateMnemonic(pendingMnemonic)) {
      throw new Error('Mnemonic tidak valid');
    }

    const path = buildHardenedPath(60, 0);
    const pubkey = deriveEd25519PubkeyHex(pendingMnemonic, '', path);
    const address = deriveAddress(pendingMnemonic, '', path);

    const initialAccount: WalletAccount = {
      index: 0,
      label: 'Account 1',
      path,
      pubkey,
      address,
      balance: 50n * 10n ** 18n, // Give initial demo balance of 50 LWC!
      nonce: 0,
    };

    const initialAccounts = [initialAccount];

    // Store in localStorage (vault simulated)
    const vault = {
      phrase: pendingMnemonic,
      passwordHash: btoa(password), // simple client hash
      createdAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY_ENCRYPTED, JSON.stringify(vault));
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(initialAccounts));

    setCurrentMnemonic(pendingMnemonic);
    setCurrentPassword(password);
    setAccounts(initialAccounts);
    setActiveAccountIndex(0);
    setHasWallet(true);
    setIsLocked(false);
    setPendingMnemonic('');
    setCurrentScreenState('home');
  };

  // Import wallet from mnemonic
  const importWallet = async (phrase: string, password: string) => {
    if (!validateMnemonic(phrase)) {
      throw new Error('Secret Recovery Phrase tidak valid (harus 12 kata BIP39)');
    }

    setPendingMnemonic(phrase);
    await completeWalletSetup(password);
  };

  // Unlock wallet
  const unlockWallet = async (password: string): Promise<boolean> => {
    const savedVault = localStorage.getItem(STORAGE_KEY_ENCRYPTED);
    if (!savedVault) return false;

    try {
      const vault = JSON.parse(savedVault);
      if (vault.passwordHash === btoa(password)) {
        setCurrentMnemonic(vault.phrase);
        setCurrentPassword(password);
        setIsLocked(false);

        // Load accounts
        const savedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
        if (savedAccounts) {
          const parsed = JSON.parse(savedAccounts);
          // revive bigints
          const revived: WalletAccount[] = parsed.map((a: any) => ({
            ...a,
            balance: BigInt(a.balance || '0'),
          }));
          setAccounts(revived);
        } else {
          // Re-derive Account 1
          const path = buildHardenedPath(60, 0);
          const pubkey = deriveEd25519PubkeyHex(vault.phrase, '', path);
          const address = deriveAddress(vault.phrase, '', path);
          const initialAccount: WalletAccount = {
            index: 0,
            label: 'Account 1',
            path,
            pubkey,
            address,
            balance: 50n * 10n ** 18n,
            nonce: 0,
          };
          setAccounts([initialAccount]);
        }

        setCurrentScreenState('home');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const lockWallet = () => {
    setIsLocked(true);
    setCurrentMnemonic(null);
    setCurrentPassword(null);
    setCurrentScreenState('unlock');
  };

  // Add derived account
  const addAccount = (label?: string) => {
    if (!currentMnemonic) return;
    const nextIndex = accounts.length;
    const path = buildHardenedPath(60, nextIndex);
    const pubkey = deriveEd25519PubkeyHex(currentMnemonic, '', path);
    const address = deriveAddress(currentMnemonic, '', path);

    const newAccount: WalletAccount = {
      index: nextIndex,
      label: label || `Account ${nextIndex + 1}`,
      path,
      pubkey,
      address,
      balance: 10n * 10n ** 18n, // Give fresh account 10 LWC demo
      nonce: 0,
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    setActiveAccountIndex(nextIndex);
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated.map((a) => ({ ...a, balance: a.balance.toString() }))));
    setCurrentScreenState('home');
  };

  const switchAccount = (index: number) => {
    if (index >= 0 && index < accounts.length) {
      setActiveAccountIndex(index);
      setCurrentScreenState('home');
    }
  };

  // Real transaction signing and balance update
  const sendTransfer = async (to: string, amountStr: string): Promise<string> => {
    if (!currentMnemonic) throw new Error('Dompet terkunci');
    const senderAcc = accounts[activeAccountIndex];
    if (!senderAcc) throw new Error('Akun tidak ditemukan');

    const amountAtomic = parseLWC(amountStr);
    const power = TRANSFER_POWER;
    const powerLimit = TRANSFER_POWER;
    const pricePerPower = 1_000_000n; // 1M atomic per power
    const feeAtomic = power * pricePerPower; // 1200 * 1M = 0.0000000012 LWC

    if (senderAcc.balance < amountAtomic + feeAtomic) {
      throw new Error(`Saldo tidak mencukupi (Saldo: ${formatLWC(senderAcc.balance)} LWC)`);
    }

    const amountHex = u256ToHex(amountAtomic);
    const priceHex = u256ToHex(pricePerPower);
    const tipHex = u256ToHex(0n);

    // Cryptographic signing with Ed25519 & Keccak256
    const signedTxHex = signTransaction(
      currentMnemonic,
      '',
      senderAcc.path,
      network.chainid,
      0, // transfer
      to,
      BigInt(senderAcc.nonce),
      amountHex,
      power,
      powerLimit,
      priceHex,
      tipHex
    );

    const hash = 'rx' + txHashHex(signedTxHex);

    // Update sender balance and nonce
    const updatedAccounts = accounts.map((acc, idx) => {
      if (idx === activeAccountIndex) {
        return {
          ...acc,
          balance: acc.balance - amountAtomic - feeAtomic,
          nonce: acc.nonce + 1,
        };
      }
      // If sending to another of user's own accounts:
      if (acc.address.toLowerCase() === to.toLowerCase()) {
        return {
          ...acc,
          balance: acc.balance + amountAtomic,
        };
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    localStorage.setItem(
      STORAGE_KEY_ACCOUNTS,
      JSON.stringify(updatedAccounts.map((a) => ({ ...a, balance: a.balance.toString() })))
    );

    // Record to transaction history
    const newTx: TransactionHistoryItem = {
      hash,
      from: senderAcc.address,
      to,
      amount: amountStr,
      rawAmount: amountAtomic.toString(),
      fee: formatLWC(feeAtomic),
      timestamp: Date.now(),
      status: 'confirmed',
      type: 'send',
    };

    const updatedHistory = [newTx, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

    return hash;
  };

  // Free faucet claim for testing
  const faucetClaim = async () => {
    if (!accounts[activeAccountIndex]) return;
    const addAmt = 25n * 10n ** 18n; // +25 LWC
    const updated = accounts.map((acc, idx) => {
      if (idx === activeAccountIndex) {
        return { ...acc, balance: acc.balance + addAmt };
      }
      return acc;
    });
    setAccounts(updated);
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated.map((a) => ({ ...a, balance: a.balance.toString() }))));

    const faucetTx: TransactionHistoryItem = {
      hash: 'rx' + Math.random().toString(16).substring(2).padEnd(64, '0'),
      from: 'rx0000000000000000000000000000000000000000 (Faucet)',
      to: accounts[activeAccountIndex].address,
      amount: '25.0',
      rawAmount: addAmt.toString(),
      fee: '0',
      timestamp: Date.now(),
      status: 'confirmed',
      type: 'receive',
    };

    const updatedHistory = [faucetTx, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    triggerCopy('', 'Berhasil klaim +25 LWC Faucet!');
  };

  // Sign message
  const signMsg = (message: string): string => {
    if (!currentMnemonic) throw new Error('Dompet terkunci');
    const acc = accounts[activeAccountIndex];
    return signMessage(currentMnemonic, '', acc.path, message, network.chainid);
  };

  // Verify message
  const verifyMsg = (message: string, proofHex: string) => {
    return verifyMessage(message, network.chainid, proofHex);
  };

  // Export private key
  const exportPrivateKey = (password: string): string | null => {
    if (!currentMnemonic || currentPassword !== password) return null;
    const acc = accounts[activeAccountIndex];
    return deriveEd25519PrivkeyHex(currentMnemonic, '', acc.path);
  };

  // Export seed phrase
  const exportPhrase = (password: string): string | null => {
    if (!currentMnemonic || currentPassword !== password) return null;
    return currentMnemonic;
  };

  // Reset wallet completely
  const resetWallet = () => {
    localStorage.removeItem(STORAGE_KEY_ENCRYPTED);
    localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    setHasWallet(false);
    setIsLocked(false);
    setAccounts([]);
    setHistory([]);
    setCurrentMnemonic(null);
    setCurrentPassword(null);
    setCurrentScreenState('welcome');
  };

  const setNetworkUrl = (url: string) => {
    setNetwork((prev) => ({
      ...prev,
      rpcUrl: url,
    }));
  };

  const activeAccount = accounts[activeAccountIndex] || null;

  return (
    <WalletContext.Provider
      value={{
        currentScreen,
        setScreen,
        screenHistory,
        goBack,
        hasWallet,
        isLocked,
        activeAccountIndex,
        accounts,
        activeAccount,
        history,
        pendingMnemonic,
        setPendingMnemonic,
        pendingTx,
        setPendingTx,
        selectedTx,
        setSelectedTx,
        createWalletInit,
        completeWalletSetup,
        importWallet,
        unlockWallet,
        lockWallet,
        addAccount,
        switchAccount,
        sendTransfer,
        faucetClaim,
        signMsg,
        verifyMsg,
        exportPrivateKey,
        exportPhrase,
        resetWallet,
        network,
        setNetworkUrl,
        autoLockMinutes,
        setAutoLockMinutes,
        copiedFeedback,
        triggerCopy,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
