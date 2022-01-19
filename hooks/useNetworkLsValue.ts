import { useLocalStorage } from '@rehooks/local-storage';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const defaultValue =
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK || WalletAdapterNetwork.Devnet;

export const useNetworkLsValue = () => {
  return useLocalStorage<WalletAdapterNetwork>(
    'network',
    defaultValue as WalletAdapterNetwork,
  );
};
