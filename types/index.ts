import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';

import { SolanaAds } from 'idl/solana_ads';

export type PubAccount = IdlAccounts<SolanaAds>['ad'];
export type ProgramPubAccount = ProgramAccount<PubAccount>;
