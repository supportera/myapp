import { ed25519 } from '@noble/curves/ed25519.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { hmac } from '@noble/hashes/hmac.js';
import { sha512 } from '@noble/hashes/sha2.js';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

export const COIN_TYPE = 60;
export const ADDRESS_PREFIX = 'rx';
export const TOKEN_SYMBOL = 'LWC';
export const CHAINID = 1;
export const TRANSFER_POWER = 1200n;
export const DEFAULT_RPC_URL = 'http://127.0.0.1:3000/';

const TX_DOMAIN = new Uint8Array([1]); // DOMAIN_TX on node
const MESSAGE_DOMAIN = new TextEncoder().encode('\x00I signing this message');
const TX_VERSION = 1;
const TX_UNSIGNED_LEN = 179;
const TX_BODY_LEN = 243;
const MSG_PROOF_LEN = 104;

// Helper: Bytes to hex
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Hex to bytes
export function hexToBytes(hexStr: string): Uint8Array {
  let clean = hexStr.startsWith('0x') || hexStr.startsWith('0X') ? hexStr.slice(2) : hexStr;
  if (clean.length % 2 !== 0) throw new Error('Hex string has odd length');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function u256ToHex(value: bigint | number | string): string {
  let v: bigint;
  try {
    v = typeof value === 'bigint' ? value : BigInt(value);
  } catch {
    throw new Error('Invalid uint256 number');
  }
  if (v < 0n || v > (1n << 256n) - 1n) {
    throw new Error('Value out of u256 range');
  }
  return v.toString(16).padStart(64, '0');
}

export function u64ToBytes(value: bigint | number): Uint8Array {
  const v = BigInt(value);
  const out = new Uint8Array(8);
  const view = new DataView(out.buffer);
  view.setBigUint64(0, v, false); // big-endian
  return out;
}

export function u32ToBytes(value: number): Uint8Array {
  const out = new Uint8Array(4);
  const view = new DataView(out.buffer);
  view.setUint32(0, value, false); // big-endian
  return out;
}

// SLIP-0010 derivation for Ed25519
export function slip10Master(seed: Uint8Array): { key: Uint8Array; chain: Uint8Array } {
  const curveKey = new TextEncoder().encode('ed25519 seed');
  const mac = hmac(sha512, curveKey, seed);
  return {
    key: mac.slice(0, 32),
    chain: mac.slice(32, 64),
  };
}

export function slip10Child(
  privateKey: Uint8Array,
  chainCode: Uint8Array,
  indexHardened: number
): { key: Uint8Array; chain: Uint8Array } {
  const data = new Uint8Array(1 + 32 + 4);
  data[0] = 0x00;
  data.set(privateKey, 1);
  const dv = new DataView(data.buffer);
  dv.setUint32(33, indexHardened, false);

  const mac = hmac(sha512, chainCode, data);
  return {
    key: mac.slice(0, 32),
    chain: mac.slice(32, 64),
  };
}

export function parseHardenedPath(path: string): number[] {
  const segments = path.split('/');
  if (segments[0] !== 'm') {
    throw new Error("Path must start with 'm/'");
  }
  const out: number[] = [];
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i].trim();
    if (!seg.endsWith("'")) {
      throw new Error(`Level '${seg}' is not hardened: Ed25519 requires all levels to be hardened`);
    }
    const num = parseInt(seg.slice(0, -1), 10);
    if (isNaN(num) || num < 0 || num >= 0x80000000) {
      throw new Error(`Invalid index: ${seg}`);
    }
    out.push(num + 0x80000000);
  }
  return out;
}

export function buildHardenedPath(coinType = COIN_TYPE, accountIndex = 0): string {
  return `m/44'/${coinType}'/0'/0'/${accountIndex}'`;
}

export function generateMnemonic(wordCount: 12 | 24 = 12): string {
  const strength = wordCount === 24 ? 256 : 128;
  return bip39.generateMnemonic(wordlist, strength);
}

export function validateMnemonic(phrase: string): boolean {
  return bip39.validateMnemonic(phrase.trim().toLowerCase(), wordlist);
}

export function derivePrivSeed(phrase: string, passphrase = '', path = buildHardenedPath(60, 0)): Uint8Array {
  if (!validateMnemonic(phrase)) {
    throw new Error('Invalid mnemonic phrase');
  }
  const seed = bip39.mnemonicToSeedSync(phrase.trim().toLowerCase(), passphrase);
  const indices = parseHardenedPath(path);

  let { key, chain } = slip10Master(seed);
  for (const idx of indices) {
    const child = slip10Child(key, chain, idx);
    key = child.key;
    chain = child.chain;
  }
  return key;
}

export function deriveEd25519PrivkeyHex(phrase: string, passphrase = '', path = buildHardenedPath(60, 0)): string {
  const key = derivePrivSeed(phrase, passphrase, path);
  return '0x' + bytesToHex(key);
}

export function deriveEd25519PubkeyHex(phrase: string, passphrase = '', path = buildHardenedPath(60, 0)): string {
  const key = derivePrivSeed(phrase, passphrase, path);
  const pubkey = ed25519.getPublicKey(key);
  return bytesToHex(pubkey);
}

export function deriveAddress(phrase: string, passphrase = '', path = buildHardenedPath(60, 0), prefix = ADDRESS_PREFIX): string {
  const key = derivePrivSeed(phrase, passphrase, path);
  const pubkey = ed25519.getPublicKey(key);
  const hash = keccak_256(pubkey);
  const addrBytes = hash.slice(12); // last 20 bytes
  return prefix + bytesToHex(addrBytes);
}

export function deriveAddressFromPubkey(pubkeyHex: string, prefix = ADDRESS_PREFIX): string {
  const pubkey = hexToBytes(pubkeyHex);
  const hash = keccak_256(pubkey);
  const addrBytes = hash.slice(12);
  return prefix + bytesToHex(addrBytes);
}

// Transaction Signing
export function encodeTransactionUnsigned(
  chainid: number,
  action: number,
  senderPubkey: Uint8Array,
  toAddr20: Uint8Array,
  nonce: bigint | number,
  amountU256Hex: string,
  power: bigint | number,
  powerLimit: bigint | number,
  pricePerPowerHex: string,
  packet: number,
  tipHex: string
): Uint8Array {
  const out = new Uint8Array(TX_UNSIGNED_LEN);
  let pos = 0;

  out[pos++] = TX_VERSION;

  const cid = u32ToBytes(chainid);
  out.set(cid, pos); pos += cid.length;

  out[pos++] = action;

  if (senderPubkey.length !== 32) throw new Error('Sender pubkey must be 32 bytes');
  out.set(senderPubkey, pos); pos += 32;

  if (toAddr20.length !== 20) throw new Error('To address must be 20 bytes');
  out.set(toAddr20, pos); pos += 20;

  const n = u64ToBytes(nonce);
  out.set(n, pos); pos += n.length;

  const amt = hexToBytes(amountU256Hex);
  if (amt.length !== 32) throw new Error('Amount must be 32 bytes');
  out.set(amt, pos); pos += 32;

  const pow = u64ToBytes(power);
  out.set(pow, pos); pos += pow.length;

  const powLim = u64ToBytes(powerLimit);
  out.set(powLim, pos); pos += powLim.length;

  const price = hexToBytes(pricePerPowerHex);
  if (price.length !== 32) throw new Error('Price per power must be 32 bytes');
  out.set(price, pos); pos += 32;

  out[pos++] = packet;

  const tip = hexToBytes(tipHex);
  if (tip.length !== 32) throw new Error('Tip must be 32 bytes');
  out.set(tip, pos); pos += 32;

  if (pos !== TX_UNSIGNED_LEN) {
    throw new Error(`Buffer mismatch: pos ${pos} !== ${TX_UNSIGNED_LEN}`);
  }
  return out;
}

export function txSigningMessage(unsignedBytes: Uint8Array): Uint8Array {
  const m = new Uint8Array(TX_DOMAIN.length + unsignedBytes.length);
  m.set(TX_DOMAIN, 0);
  m.set(unsignedBytes, TX_DOMAIN.length);
  return m;
}

export function signTransaction(
  phrase: string,
  passphrase: string,
  path: string,
  chainid: number,
  action: number,
  toHex: string,
  nonce: bigint | number,
  amountHex: string,
  power: bigint | number,
  powerLimit: bigint | number,
  pricePerPowerHex: string,
  tipHex: string
): string {
  if (action !== 0) throw new Error('Only action 0 (transfer) is supported');
  if (BigInt(powerLimit) < BigInt(power)) throw new Error('power_limit must be >= power');

  const seed = derivePrivSeed(phrase, passphrase, path);
  const senderPubkey = ed25519.getPublicKey(seed);

  // Strip 'rx' or '0x' from toHex
  let cleanTo = toHex;
  if (cleanTo.toLowerCase().startsWith('rx')) cleanTo = cleanTo.slice(2);
  else if (cleanTo.toLowerCase().startsWith('0x')) cleanTo = cleanTo.slice(2);
  const toBytes = hexToBytes(cleanTo);
  if (toBytes.length !== 20) throw new Error('Destination address must be 20 bytes');

  const unsigned = encodeTransactionUnsigned(
    chainid,
    action,
    senderPubkey,
    toBytes,
    nonce,
    amountHex,
    power,
    powerLimit,
    pricePerPowerHex,
    0, // packet
    tipHex
  );

  const toSignHash = keccak_256(txSigningMessage(unsigned));
  const signature = ed25519.sign(toSignHash, seed);

  const body = new Uint8Array(TX_BODY_LEN);
  body.set(unsigned, 0);
  body.set(signature, TX_UNSIGNED_LEN);

  return bytesToHex(body);
}

export function verifyTransaction(signedTxHex: string): boolean {
  const wire = hexToBytes(signedTxHex);
  if (wire.length !== TX_BODY_LEN) return false;

  const unsigned = wire.slice(0, TX_UNSIGNED_LEN);
  const sigBytes = wire.slice(TX_UNSIGNED_LEN);
  const senderPubkey = wire.slice(6, 38);

  const toSignHash = keccak_256(txSigningMessage(unsigned));
  return ed25519.verify(sigBytes, toSignHash, senderPubkey);
}

export function txHashHex(signedTxHex: string): string {
  const wire = hexToBytes(signedTxHex);
  if (wire.length !== TX_BODY_LEN) {
    throw new Error(`tx body must be ${TX_BODY_LEN} bytes, got ${wire.length}`);
  }
  return bytesToHex(keccak_256(wire));
}

// Sign and Verify Message
export function signMessage(
  phrase: string,
  passphrase = '',
  path = buildHardenedPath(60, 0),
  message: string,
  chainid: number
): string {
  const seed = derivePrivSeed(phrase, passphrase, path);
  const pubkey = ed25519.getPublicKey(seed);
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const tsBytes = u64ToBytes(timestamp);
  const cidBytes = u32ToBytes(chainid);
  const msgBytes = new TextEncoder().encode(message);

  // keccak256(MESSAGE_DOMAIN || chainid(4) || message || timestamp(8))
  const data = new Uint8Array(MESSAGE_DOMAIN.length + 4 + msgBytes.length + 8);
  let p = 0;
  data.set(MESSAGE_DOMAIN, p); p += MESSAGE_DOMAIN.length;
  data.set(cidBytes, p); p += 4;
  data.set(msgBytes, p); p += msgBytes.length;
  data.set(tsBytes, p); p += 8;

  const hash = keccak_256(data);
  const signature = ed25519.sign(hash, seed);

  const proof = new Uint8Array(MSG_PROOF_LEN);
  proof.set(pubkey, 0);
  proof.set(signature, 32);
  proof.set(tsBytes, 96);

  return bytesToHex(proof);
}

export function verifyMessage(message: string, chainid: number, proofHex: string): { valid: boolean; pubkeyHex: string; address: string; timestamp: number } {
  const proof = hexToBytes(proofHex);
  if (proof.length !== MSG_PROOF_LEN) {
    throw new Error(`Proof must be ${MSG_PROOF_LEN} bytes`);
  }
  const pubkey = proof.slice(0, 32);
  const signature = proof.slice(32, 96);
  const tsBytes = proof.slice(96, 104);

  const dv = new DataView(tsBytes.buffer, tsBytes.byteOffset, tsBytes.byteLength);
  const timestamp = Number(dv.getBigUint64(0, false));

  const cidBytes = u32ToBytes(chainid);
  const msgBytes = new TextEncoder().encode(message);

  const data = new Uint8Array(MESSAGE_DOMAIN.length + 4 + msgBytes.length + 8);
  let p = 0;
  data.set(MESSAGE_DOMAIN, p); p += MESSAGE_DOMAIN.length;
  data.set(cidBytes, p); p += 4;
  data.set(msgBytes, p); p += msgBytes.length;
  data.set(tsBytes, p); p += 8;

  const hash = keccak_256(data);
  const valid = ed25519.verify(signature, hash, pubkey);

  const pubkeyHex = bytesToHex(pubkey);
  const address = deriveAddressFromPubkey(pubkeyHex, ADDRESS_PREFIX);

  return { valid, pubkeyHex, address, timestamp };
}

// Formatting tokens (18 decimals)
export function formatLWC(atomicAmount: bigint | string | number): string {
  try {
    const v = BigInt(atomicAmount);
    const decimals = 18n;
    const base = 10n ** decimals;
    const whole = v / base;
    const fraction = (v % base).toString().padStart(18, '0');
    const trimmedFraction = fraction.slice(0, 6).replace(/0+$/, '');
    return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : `${whole}`;
  } catch {
    return '0';
  }
}

export function parseLWC(amountStr: string): bigint {
  const clean = amountStr.trim();
  if (!clean || isNaN(Number(clean))) throw new Error('Invalid amount number');
  const [wholeStr, fracStr = ''] = clean.split('.');
  const whole = BigInt(wholeStr);
  const fracPadded = (fracStr + '0'.repeat(18)).slice(0, 18);
  const frac = BigInt(fracPadded);
  return whole * 10n ** 18n + frac;
}
