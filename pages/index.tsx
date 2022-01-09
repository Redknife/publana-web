import { useEffect, useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { useProgram } from 'hooks/useProgram';
import { SolanaAds } from 'idl/solana_ads';

const MAX_SIZE_TX = 100;
const chunkString = (str: string, length: number) =>
  str.match(new RegExp('.{1,' + length + '}', 'g'));

const loader = (
  <svg
    className="animate-spin ml-3 mr-3 h-5 w-5 text-gray"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Home: NextPage = () => {
  const { wallet, publicKey } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();

  const [adAccounts, setAdAccounts] = useState<
    Awaited<ReturnType<anchor.Program<SolanaAds>['account']['ad']['all']>>
  >([]);
  const [isAdAccountsLoading, setIsAdAccountsLoading] = useState(false);
  const fetchAdAccounts = useCallback(async () => {
    if (!program) return;
    setIsAdAccountsLoading(true);
    try {
      const adAccounts = await program.account.ad.all();
      setAdAccounts(adAccounts.sort((acc1, acc2) => acc1.account.timestamp.cmp(acc2.account.timestamp)));
    } catch (e) {
      console.log('fetch adAccounts error', e);
    } finally {
      setIsAdAccountsLoading(false);
    }
  }, [program]);
  useEffect(() => {
    fetchAdAccounts();
  }, [fetchAdAccounts, wallet]);

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePlaceAdSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!program) return;

      setIsSubmitting(true);

      const title = e.target.elements.title.value;
      const content = e.target.elements.content.value;
      const textLimit = title.length + content.length;
      let chunks = chunkString(`${title}${content}`, MAX_SIZE_TX) as string[];
      const firstContent = chunks.shift()?.substring(title.length);

      const adAccountKeys = anchor.web3.Keypair.generate();
      const feePayer = program.provider.wallet.publicKey;

      try {
        const { blockhash: recentBlockhash } = await connection.getRecentBlockhash();
        const createAdTx = await program.transaction.createAd(title, firstContent, textLimit, {
          accounts: {
            ad: adAccountKeys.publicKey,
            authority: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        });
        createAdTx.recentBlockhash = recentBlockhash;
        createAdTx.feePayer = feePayer;
        createAdTx.partialSign(adAccountKeys);

        const signedCreate = await program.provider.wallet.signAllTransactions([createAdTx]);
        await Promise.all(
          (signedCreate || []).map((transaction) =>
            connection.sendRawTransaction(transaction.serialize()),
          ),
        );

        if (chunks.length) {
          const appendAdContentTxs = await Promise.all(chunks.map(async (chunkContent) => {
            const appendAdContentTx = await program.transaction.appendAdContent(chunkContent, {
              accounts: {
                ad: adAccountKeys.publicKey,
                authority: program.provider.wallet.publicKey,
              },
            });
            appendAdContentTx.recentBlockhash = recentBlockhash;
            appendAdContentTx.feePayer = feePayer;
            return appendAdContentTx;
          }));

          const signedAppend = await program.provider.wallet.signAllTransactions(appendAdContentTxs);
          await Promise.all(
            (signedAppend || []).map((transaction) =>
              connection.sendRawTransaction(transaction.serialize()),
            ),
          );
        }

        formRef.current?.reset();
        setTimeout(() => {
          fetchAdAccounts();
        }, 850);
      } catch (e) {
        console.log('createAd error', e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [program, connection, fetchAdAccounts],
  );
  return (
    <div>
      <Head>
        <title>Publana</title>
      </Head>

      <main className="prose">
        <h1 className="mb-0 ">Welcome to Publana</h1>
        <h3 className="mt-1 mb-8">Ads for everyone!</h3>

        <div className="flex space-x-4">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        {wallet && (
          <>
            <hr />
            <h3 className="flex items-center">
              Ads
              {isAdAccountsLoading && loader}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {adAccounts.map(({ account }, index) => {
                const isMine = publicKey?.equals(account.authority);
                return (
                  <div
                    key={index}
                    className={`w-full p-6 bg-white ${
                      isMine
                        ? 'border-4 border-amber-100'
                        : 'border-4 border-white'
                    } rounded-xl shadow-lg flex items-center space-x-4`}
                  >
                    <div>
                      <div className="text-xl font-medium text-black">
                        {account.title as string}
                      </div>
                      <p className="text-gray-600 m-0">
                        {(account.content as string) || '-'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr />

            <h3>Place the ad</h3>
            <form
              ref={formRef}
              className="w-full space-y-4"
              onSubmit={handlePlaceAdSubmit}
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                maxLength={280}
                disabled={isSubmitting}
                className="form-input text-black px-4 py-3 w-full rounded-md border-2 border-gray-300 focus:ring-amber-400 focus:border-amber-400"
                required
              />

              <textarea
                name="content"
                placeholder="Message"
                disabled={isSubmitting}
                className="form-input text-black px-4 py-3 w-full rounded-md border-2 border-gray-300 focus:ring-amber-400 focus:border-amber-400"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="
              flex items-center justify-center
              w-full
              px-3 py-2
              border-2 border-gray-300 dark:border-gray-800
              focus:ring-amber-400 focus:border-amber-400
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              text-xl
              rounded-md"
              >
                {isSubmitting && loader}
                Place
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
