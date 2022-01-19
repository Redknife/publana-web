import { useLocalStorage } from '@rehooks/local-storage';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const useNetworkLsValue = () => {
  return useLocalStorage<WalletAdapterNetwork>(
    'network',
    WalletAdapterNetwork.Devnet,
  );
};
