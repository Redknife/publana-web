import '../styles/globals.css';
import { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import('../components/WalletConnectionProvider').then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletModalProvider>
        <Component {...pageProps} />
      </WalletModalProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
