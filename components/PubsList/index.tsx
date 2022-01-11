import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Program, Coder } from '@project-serum/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import idl from 'idl/solana_ads.json';
import { SolanaAds, IDL } from 'idl/solana_ads';
import { Spinner } from 'components/Spinner';

const programId = new PublicKey(idl.metadata.address);
const coder = new Coder(IDL);

export const PubsList = () => {
  const { connection } = useConnection();

  const [accounts, setAccounts] = useState<
    Awaited<ReturnType<Program<SolanaAds>['account']['ad']['all']>>
  >([]);
  const [isAccountsLoading, setIsAccountsLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!connection) return;
    setIsAccountsLoading(true);
    try {
      const accounts = await connection
        .getProgramAccounts(programId)
        .then((resp) =>
          resp.map(({ pubkey, account }) => {
            return {
              publicKey: pubkey,
              account: coder.accounts.decode(
                IDL.accounts[0].name,
                account.data,
              ),
            };
          }),
        );
      setAccounts(
        accounts.sort((acc1, acc2) =>
          acc1.account.timestamp.cmp(acc2.account.timestamp),
        ),
      );
    } catch (e) {
      console.log('fetch accounts error', e);
    } finally {
      setIsAccountsLoading(false);
    }
  }, [connection]);
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <>
      <div className="prose dark:prose-dark">
        <h1 className="flex items-center mb-4">
          Pubs
          {isAccountsLoading && <Spinner />}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isAccountsLoading &&
          [1, 2, 3, 4].map((skelId) => (
            <div
              key={skelId}
              className={`
              w-full
              flex items-center
              space-x-4
              p-6
              bg-white dark:bg-gray-800
              border-4 border-white dark:border-gray-800
              rounded-xl shadow-lg
            `}
            >
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="flex-1 space-y-3 py-1">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                  <div className="h-2 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        {accounts.map(({ account, publicKey }) => {
          const pk = publicKey.toString();
          return (
            <Link href={`/pub/${pk}`} key={pk}>
              <a
                className={`
                  w-full
                  flex items-center
                  space-x-4
                  p-6
                  bg-white dark:bg-gray-800
                  border-4 border-white dark:border-gray-800 hover:border-amber-100 dark:hover:border-amber-100
                  rounded-xl shadow-lg
                  transition ease-in-out
                `}
              >
                <div className="overflow-hidden max-w-full">
                  <div className="text-xl font-medium text-black dark:text-amber-200">
                    {account.title as string}
                  </div>
                  <p className="text-gray-600 dark:text-amber-50 m-0">
                    {(account.content as string) || '-'}
                  </p>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </>
  );
};
