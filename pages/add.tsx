import { useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import BN from 'bn.js';

import { kolyanPublicKey, viktrchPublicKey } from 'consts';
import { cusper } from 'utils/cusper';
import { useProgram } from 'hooks/useProgram';
import { Container } from 'components/Container';
import { Form, Input, Textarea } from 'components/Form';
import { ImageInput } from 'components/ImageInput';
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

      const rank = parseInt(e.target.elements.rank.value || 0);
      const title = JSON.parse(JSON.stringify(e.target.elements.title.value));
      const content = JSON.parse(
        JSON.stringify(e.target.elements.content.value),
      );
      const image = e.target.elements.image.value || '';
      const textLimit = title.length + content.length;
      let chunks = chunkString(`${title}${content}`, MAX_SIZE_TX) as string[];
      const firstContent = chunks.shift()?.substring(title.length);

      const adAccountKeys = anchor.web3.Keypair.generate();
      const feePayer = program.provider.wallet.publicKey;

      try {
        const { blockhash: recentBlockhash } =
          await connection.getRecentBlockhash();
        const derivedAddress = await anchor.web3.PublicKey.createWithSeed(
          program.provider.wallet.publicKey,
          'seed',
          program.programId,
        );

        const createAdTx = await program.transaction.createAd(
          title,
          firstContent,
          image,
          textLimit,
          new BN(rank),
          {
            accounts: {
              ad: adAccountKeys.publicKey,
              kolyanAccount: kolyanPublicKey,
              viktrchAccount: viktrchPublicKey,
              authority: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
              derivedAddress,
            },
          },
        );
        createAdTx.recentBlockhash = recentBlockhash;
        createAdTx.feePayer = feePayer;
        createAdTx.partialSign(adAccountKeys);

        console.log('Sign `createAd` transaction', {
          title,
          content: firstContent,
          image,
          textLimit,
          rank,
          accounts: {
            ad: adAccountKeys.publicKey.toString(),
            kolyanAccount: kolyanPublicKey.toString(),
            viktrchAccount: viktrchPublicKey.toString(),
            authority: program.provider.wallet.publicKey.toString(),
            systemProgram: anchor.web3.SystemProgram.programId.toString(),
            derivedAddress: derivedAddress.toString(),
          },
          partialSign: [adAccountKeys.publicKey.toString()],
          feePayer: feePayer.toString(),
          recentBlockhash,
        });
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
        console.log('createAd original error', e);
        // TODO: find a way to parse and log the caught error
        try {
          cusper.throwError(e as any);
        } catch (e) {
          console.log(e);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [program, connection],
  );
  return (
    <Container>
      <div className="prose dark:prose-dark mb-6">
        <h1>Place the pub</h1>
      </div>

      <div className="flex space-x-4 mb-6">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>

      {wallet && (
        <Form ref={formRef} onSubmit={handlePlaceAdSubmit}>
          <Input
            type="text"
            name="title"
            placeholder="Title"
            maxLength={280}
            disabled={isSubmitting}
            className="w-full"
            required
          />

          <Textarea
            name="content"
            placeholder="Message"
            disabled={isSubmitting}
            className="w-full"
            required
          />

          <ImageInput
            name="image"
            placeholder="Cover image url"
            className="w-full"
          />

          <Input
            type="number"
            name="rank"
            placeholder="Rank"
            min="0"
            disabled={isSubmitting}
            className="w-30"
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
        </Form>
      )}
    </Container>
  );
};

export default Add;
