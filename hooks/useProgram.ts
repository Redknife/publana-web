import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Provider, Program, } from '@project-serum/anchor';

import idl from 'idl/solana_ads.json';
import { SolanaAds, IDL } from 'idl/solana_ads';

const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(idl.metadata.address);

export const useProgram = () => {
  const wallet = useAnchorWallet();

  const { connection } = useConnection();

  const provider = useMemo(() => {
    if (!wallet) return;
    return new Provider(connection, wallet, { preflightCommitment, commitment });
  }, [wallet, connection]);

  const program = useMemo(() => {
    if (!provider) return;
    return new Program<SolanaAds>(IDL, programID, provider);
  }, [provider]);

  return program;
};
