import { useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { useProgram } from 'hooks/useProgram';
import { Container } from 'components/Container';
import { Spinner } from 'components/Spinner';

const MAX_SIZE_TX = 276;
const chunkString = (str: string, length: number) =>
  str.match(new RegExp('.{1,' + length + '}', 'g'));

const Add: NextPage = () => {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePlaceAdSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!program) return;

      setIsSubmitting(true);

      const title = JSON.parse(JSON.stringify(e.target.elements.title.value));
      const content = JSON.parse(
        JSON.stringify(e.target.elements.content.value),
      );
      const textLimit = title.length + content.length;
      let chunks = chunkString(`${title}${content}`, MAX_SIZE_TX) as string[];
      const firstContent = chunks.shift()?.substring(title.length);

      const adAccountKeys = anchor.web3.Keypair.generate();
      const feePayer = program.provider.wallet.publicKey;

      try {
        const { blockhash: recentBlockhash } =
          await connection.getRecentBlockhash();
        const createAdTx = await program.transaction.createAd(
          title,
          firstContent,
          textLimit,
          {
            accounts: {
              ad: adAccountKeys.publicKey,
              authority: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            },
          },
        );
        createAdTx.recentBlockhash = recentBlockhash;
        createAdTx.feePayer = feePayer;
        createAdTx.partialSign(adAccountKeys);

        const signedCreate = await program.provider.wallet.signAllTransactions([
          createAdTx,
        ]);
        await Promise.all(
          (signedCreate || []).map((transaction) =>
            connection.sendRawTransaction(transaction.serialize()),
          ),
        );

        if (chunks.length) {
          const appendAdContentTxs = await Promise.all(
            chunks.map(async (chunkContent) => {
              const appendAdContentTx =
                await program.transaction.appendAdContent(chunkContent, {
                  accounts: {
                    ad: adAccountKeys.publicKey,
                    authority: program.provider.wallet.publicKey,
                  },
                });
              appendAdContentTx.recentBlockhash = recentBlockhash;
              appendAdContentTx.feePayer = feePayer;
              return appendAdContentTx;
            }),
          );

          const signedAppend =
            await program.provider.wallet.signAllTransactions(
              appendAdContentTxs,
            );
          await Promise.all(
            (signedAppend || []).map((transaction) =>
              connection.sendRawTransaction(transaction.serialize()),
            ),
          );
        }

        formRef.current?.reset();
      } catch (e) {
        console.log('createAd error', e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [program, connection],
  );
  return (
    <Container>
      <div className="prose dark:prose-dark mb-6">
        <h1>Place the ad</h1>
      </div>

      <div className="flex space-x-4">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>

      {wallet && (
        <>
          <form
            ref={formRef}
            className="w-full space-y-4 mt-6"
            onSubmit={handlePlaceAdSubmit}
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              maxLength={280}
              disabled={isSubmitting}
              className="
                form-input
                w-full
                px-4 py-3
                text-black dark:text-gray-100
                rounded-md
                border-2 border-gray-300 dark:border-gray-800
                focus:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-400
                bg-white dark:bg-gray-800
                transition
              "
              required
            />

            <textarea
              name="content"
              placeholder="Message"
              disabled={isSubmitting}
              className="
                form-input
                w-full
                px-4 py-3
                text-black dark:text-gray-100
                rounded-md
                border-2 border-gray-300 dark:border-gray-800
                focus:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-400
                bg-white dark:bg-gray-800
                transition
              "
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
                focus:ring-amber-400 focus:border-amber-400 hover:border-amber-400 dark:hover:border-amber-400
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100 hover:text-amber-400 dark:hover:text-amber-400
                text-xl
                transition
                rounded-md"
            >
              {isSubmitting && <Spinner />}
              Place
            </button>
          </form>
        </>
      )}
    </Container>
  );
};

export default Add;
