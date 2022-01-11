import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useConnection } from '@solana/wallet-adapter-react';
import { Coder, ProgramAccount } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { IDL } from 'idl/solana_ads';
import { Container } from 'components/Container';

const coder = new Coder(IDL);

const Pub: NextPage = () => {
  const router = useRouter();
  const { pubkey } = router.query;

  const { connection } = useConnection();
  const [account, setAccount] = useState<ProgramAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!connection || !pubkey) return;
    setIsLoading(true);

    try {
      const publicKey = new PublicKey(pubkey);
      const account = await connection
        .getAccountInfo(publicKey)
        .then((resp) => {
          return resp
            ? {
                publicKey,
                account: coder.accounts.decode(
                  IDL.accounts[0].name,
                  resp?.data,
                ),
              }
            : null;
        });
      setAccount(account);
    } catch (e) {
      console.log('fetch accounts error', e);
    } finally {
      setIsLoading(false);
    }
  }, [connection, pubkey]);
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <Container>
      <div
        className={`
          w-full
          flex flex-1
          space-x-4
          p-6
          bg-white dark:bg-gray-800
          border-4 border-white dark:border-gray-800
          rounded-xl shadow-lg
        `}
      >
        <div className="overflow-hidden max-w-full w-full">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                  <div className="h-2 bg-gray-200 rounded" />
                </div>
                <div className="h-2 bg-gray-200 rounded" />
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            </div>
          ) : account ? (
            <>
              <div className="text-xl font-medium text-black dark:text-amber-200">
                {account.account.title as string}
              </div>
              <p className="text-gray-600 dark:text-amber-50 m-0">
                {(account.account.content as string) || '-'}
              </p>
            </>
          ) : (
            <span>Failed to load data</span>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Pub;
