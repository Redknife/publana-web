import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useConnection } from '@solana/wallet-adapter-react';
import { Coder, ProgramAccount } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { IDL } from 'idl/solana_ads';
import { Container } from 'components/Container';
import { ExplorerLink } from 'components/ExplorerLink';

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

  const datetime = useMemo<string | undefined>(() => {
    const timestamp = account?.account.timestamp.toNumber();
    if (!timestamp) return;

    const date = new Date(timestamp * 1000);
    const localeDate = date.toLocaleDateString();
    const localeTime = date.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }, [account]);

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
        <div className="flex flex-col overflow-hidden max-w-full w-full">
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
            <article className="flex flex-col flex-1">
              <header>
                <h1 className="text-3xl font-medium text-black dark:text-amber-200 mb-4">
                  {account.account.title as string}
                </h1>
              </header>
              <div className="flex-1">
                <p className="font-normal text-gray-600 dark:text-amber-50 m-0">
                  {(account.account.content as string) || '-'}
                </p>
              </div>
              <footer
                className="
                sm:flex flex-row justify-between items-end
                space-y-2
                pt-4 mt-8
                border-t-2 border-gray-200 dark:border-gray-600
              "
              >
                <div className="sm:flex flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {datetime}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rank
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {account.account.rank.toNumber()}
                    </div>
                  </div>
                </div>
                <div className="sm:flex flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  {pubkey && (
                    <div>
                      <ExplorerLink
                        address={pubkey as string}
                        className="text-gray-600 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400 transition"
                      >
                        Account
                      </ExplorerLink>
                    </div>
                  )}

                  <div>
                    <ExplorerLink
                      address={account?.account.authority.toString()}
                      className="text-gray-600 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400 transition"
                    >
                      Authority
                    </ExplorerLink>
                  </div>
                </div>
              </footer>
            </article>
          ) : (
            <span>Failed to load data</span>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Pub;
