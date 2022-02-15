import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Coder } from '@project-serum/anchor';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { MdDelete } from 'react-icons/md';

import idl from 'idl/solana_ads.json';
import { IDL } from 'idl/solana_ads';
import { ProgramPubAccount, PubAccount } from 'types';
import { Spinner } from 'components/Spinner';
import { PubSkeleton } from 'components/Skeletons';
import { useProgram } from 'hooks/useProgram';
import { cusper } from 'utils/cusper';

const programId = new PublicKey(idl.metadata.address);
const coder = new Coder(IDL);

export const PubsList = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [accounts, setAccounts] = useState<ProgramPubAccount[]>([]);
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
              account: coder.accounts.decode<PubAccount>(
                IDL.accounts[0].name,
                account.data,
              ),
            };
          }),
        );
      setAccounts(
        accounts.sort((acc1, acc2) => {
          if (acc1.account.rank.eq(acc2.account.rank)) {
            return acc1.account.timestamp.cmp(acc2.account.timestamp);
          }
          return acc2.account.rank.cmp(acc1.account.rank);
        }),
      );
    } catch (e) {
      console.log('fetch accounts error', e);
    } finally {
      setIsAccountsLoading(false);
    }
  }, [connection]);

  const program = useProgram();
  const handleDeleteClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (program) {
        try {
          await program.rpc.deleteAd({
            accounts: {
              authority: program.provider.wallet.publicKey,
              ad: e.currentTarget.dataset.pk,
            },
          });
          await fetchAccounts();
        } catch (e) {
          try {
            cusper.throwError(e as any);
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    [program, fetchAccounts],
  );

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
          !accounts.length &&
          [1, 2, 3, 4].map((skelId) => (
            <PubSkeleton key={skelId} variant="small" />
          ))}
        {accounts.map(({ account, publicKey }) => {
          const pk = publicKey.toString();
          const rank = account.rank.toNumber();
          const isOwns = wallet && account.authority.equals(wallet?.publicKey);

          return (
            <Link href={`/pub/${pk}`} key={pk}>
              <a
                className={`
                  w-full
                  flex
                  p-6
                  bg-white dark:bg-gray-800
                  border-4 border-white dark:border-gray-800 hover:border-amber-100 dark:hover:border-amber-100
                  rounded-xl shadow-lg
                  transition ease-in-out
                  relative
                `}
              >
                <div className="hidden sm:block min-w-[160px] max-w-[160px] mr-4 flex-auto mt-1 rounded-md overflow-hidden">
                  {(account.image as string).length ? (
                    <img
                      src={account.image as string}
                      className="block"
                      alt=""
                    />
                  ) : (
                    <div className="relative pb-[100%]">
                      <div
                        className={`
                          absolute top-0 bottom-0 right-0 left-0
                          flex items-center justify-center
                          text-4xl text-gray-400 dark:text-gray-500
                          bg-gray-100 dark:bg-gray-700
                      `}
                      >
                        {(account.title as string).charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="overflow-hidden max-w-full">
                  <div className="text-xl font-medium text-gray-800 dark:text-amber-200">
                    {account.title as string}
                  </div>
                  <p className="text-gray-600 font-normal dark:text-amber-50 m-0">
                    {(account.content as string) || '-'}
                  </p>
                </div>
                {rank > 0 && (
                  <div className="absolute top-1 right-2 font-bold text-amber-500">
                    {rank}
                  </div>
                )}
                {isOwns && (
                  <button
                    onClick={handleDeleteClick}
                    data-pk={pk}
                    className={`
                      absolute
                      bottom-[0.25em]
                      right-[0.25em]
                      bg-white
                      text-xl
                      p-0.5
                      rounded-md
                      text-gray-900
                      z-50
                      opacity-10
                      hover:opacity-100
                  `}
                  >
                    <MdDelete />
                  </button>
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </>
  );
};
