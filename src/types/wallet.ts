export interface WalletAccount {
  index: number;
  label: string;
  path: string;
  pubkey: string;
  address: string; // rx...
  balance: bigint; // 18 decimals atomic
  nonce: number;
}

export interface TransactionHistoryItem {
  hash: string;
  from: string;
  to: string;
  amount: string; // formatted LWC
  rawAmount: string; // atomic string
  fee: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  type: 'send' | 'receive';
}

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainid: number;
  symbol: string;
  isMock: boolean;
  status: 'online' | 'offline' | 'checking';
  blockNumber: number;
  latencyMs: number;
}

export type ScreenName =
  | 'welcome'
  | 'create-1'
  | 'create-2'
  | 'import'
  | 'set-password'
  | 'unlock'
  | 'home'
  | 'accounts'
  | 'add-wallet'
  | 'send'
  | 'confirm-tx'
  | 'receive'
  | 'sign'
  | 'verify'
  | 'reveal-phrase'
  | 'export-key'
  | 'settings'
  | 'tx-detail';
