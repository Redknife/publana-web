import React, { useMemo, ReactNode, AnchorHTMLAttributes } from 'react';

import { useNetworkLsValue } from 'hooks/useNetworkLsValue';

type ExplorerLinkProps = {
  address: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const explorerHost =
  process.env.NEXT_PUBLIC_EXPLORER || 'https://explorer.solana.com';

export const ExplorerLink = ({
  address,
  children = address,
  ...props
}: ExplorerLinkProps) => {
  const [network] = useNetworkLsValue();

  const href = useMemo<string>(
    () => `${explorerHost}/address/${address}?cluster=${network}`,
    [address, network],
  );

  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
};
