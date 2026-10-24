import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { CreateWalletScreen } from './screens/CreateWalletScreen';
import { ImportWalletScreen } from './screens/ImportWalletScreen';
import { SetPasswordScreen } from './screens/SetPasswordScreen';
import { UnlockScreen } from './screens/UnlockScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SendScreen } from './screens/SendScreen';
import { ConfirmTxModal } from './screens/ConfirmTxModal';
import { ReceiveScreen } from './screens/ReceiveScreen';
import { AccountsScreen } from './screens/AccountsScreen';
import { SignMessageScreen } from './screens/SignMessageScreen';
import { VerifyMessageScreen } from './screens/VerifyMessageScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RevealPhraseScreen } from './screens/RevealPhraseScreen';
import { ExportKeyScreen } from './screens/ExportKeyScreen';
import { TxDetailScreen } from './screens/TxDetailScreen';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

export const AndroidFrame: React.FC = () => {
  const { currentScreen, copiedFeedback } = useWallet();
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [showDeviceFrame, setShowDeviceFrame] = useState<boolean>(true);

  // Live status bar time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'create-1':
      case 'create-2':
        return <CreateWalletScreen />;
      case 'import':
        return <ImportWalletScreen />;
      case 'set-password':
        return <SetPasswordScreen />;
      case 'unlock':
        return <UnlockScreen />;
      case 'home':
        return <HomeScreen />;
      case 'send':
        return <SendScreen />;
      case 'confirm-tx':
        return <ConfirmTxModal />;
      case 'receive':
        return <ReceiveScreen />;
      case 'accounts':
      case 'add-wallet':
        return <AccountsScreen />;
      case 'sign':
        return <SignMessageScreen />;
      case 'verify':
        return <VerifyMessageScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'reveal-phrase':
        return <RevealPhraseScreen />;
      case 'export-key':
        return <ExportKeyScreen />;
      case 'tx-detail':
        return <TxDetailScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Floating Toggle Frame control */}
      <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-stone-200 shadow-xs text-xs">
        <button
          onClick={() => setShowDeviceFrame(!showDeviceFrame)}
          className="flex items-center gap-1.5 text-stone-600 hover:text-[#B45A00] font-medium transition"
        >
          {showDeviceFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mode Layar Penuh</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tampilkan Bingkai HP Android</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: Android Bezel vs Fullscreen */}
      <div
        className={`relative transition-all duration-300 ${
          showDeviceFrame
            ? 'w-[380px] max-w-[95vw] h-[740px] max-h-[88vh] bg-stone-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-stone-800'
            : 'w-full max-w-md h-[740px] max-h-[90vh] bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden'
        }`}
      >
        {/* Device screen area */}
        <div
          className={`w-full h-full bg-[#FAF6F0] flex flex-col overflow-hidden relative ${
            showDeviceFrame ? 'rounded-[38px]' : 'rounded-3xl'
          }`}
        >
          {/* Android Status Bar */}
          <div className="h-10 px-6 pt-1 flex items-center justify-between text-xs font-semibold text-stone-800 select-none z-20 flex-shrink-0 bg-transparent">
            {/* Clock */}
            <span className="text-[12px] font-bold tracking-tight">{currentTime}</span>

            {/* Camera Punch Hole (Center) */}
            {showDeviceFrame && (
              <div className="w-3.5 h-3.5 rounded-full bg-stone-900 ring-2 ring-stone-800/40" />
            )}

            {/* Android Icons: 5G, Wifi, Battery */}
            <div className="flex items-center gap-1.5 text-stone-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">88%</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Toast / Copied feedback pill */}
          {copiedFeedback && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#2E1B04] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{copiedFeedback}</span>
            </div>
          )}

          {/* Screen Content Render */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {renderActiveScreen()}
          </div>

          {/* Android Bottom Navigation Pill */}
          <div className="h-5 flex items-center justify-center flex-shrink-0 bg-transparent py-1">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
